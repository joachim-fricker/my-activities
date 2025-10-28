import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// global argv for CLI flags
var argv;

class JsonToSQLite {
    constructor(dbPath = './data.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // open DB connection
    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Connection to db established');
                    resolve();
                }
            });
        });
    }

    // create table if not exists
    async createTable() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    uuid TEXT NOT NULL,
                    activityName TEXT NOT NULL,
                    activityType  TEXT NOT NULL,
                    distance REAL,
                    duration REAL,
                    startTime DATETIME,
                    startLatitude REAL,
                    startLongitude REAL,
                    elevationGain REAL,
                    maxElevation REAL,
                    averageHR INTEGER,
                    locationName TEXT
                )
            `;

            this.db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Tabelle activities created');
                    resolve();
                }
            });
        });
    }

    // find JSON files in directory
    async findJsonFiles(directory) {
        try {
            const files = await fs.readdir(directory);
            const jsonFiles = files.filter(file =>
                path.extname(file).toLowerCase() === '.json'
            );

            // console.log(`📁 ${jsonFiles.length} JSON-files found in ${directory}`);
            return jsonFiles.map(file => path.join(directory, file));
        } catch (error) {
            console.error('❌ Error reading directory', error);
            return [];
        }
    }

    // parse a JSON file
    async parseJsonFile(filePath) {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(data);

            return {
                filename: path.basename(filePath),
                data: jsonData,
                filePath: filePath
            };
        } catch (error) {
            console.error(`❌ Error parsing json ${filePath}:`, error.message);
            return null;
        }
    }

    // cleanup Records
    cleanupRecords(jsonData) {
        if (!jsonData) return;
        if (jsonData.activityTypeDTO && jsonData.activityTypeDTO.typeKey == 'other') {
            // console.log("Converting other to backcountry_skiing");
            jsonData.activityTypeDTO.typeKey = 'backcountry_skiing';
        }
    }

    // New: batch insert using a transaction + prepared statement
    async insertBatch(retValues) {
        if (!Array.isArray(retValues) || retValues.length === 0) {
            return { success: 0, errors: 0 };
        }

        return new Promise((resolve, reject) => {
            let successCount = 0;
            let errorCount = 0;
            // serialize ensures the order and that BEGIN/COMMIT wrap all runs
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION", (beginErr) => {
                    if (beginErr) {
                        return reject(beginErr);
                    }

                    const query = `
                        INSERT INTO activities (
                            filename, uuid, activityName, activityType, distance, duration, startTime,
                            startLatitude, startLongitude, elevationGain, maxElevation, averageHR, locationName
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    const stmt = this.db.prepare(query, (prepErr) => {
                        if (prepErr) {
                            // prepare failed -> rollback
                            return this.db.run("ROLLBACK", () => reject(prepErr));
                        }

                        // Helper to run each insert sequentially and finalize at the end
                        let idx = 0;
                        const runNext = () => {
                            if (idx >= retValues.length) {
                                // finalize statement and commit
                                stmt.finalize((finalizeErr) => {
                                    if (finalizeErr) {
                                        return this.db.run("ROLLBACK", () => reject(finalizeErr));
                                    }
                                    this.db.run("COMMIT", (commitErr) => {
                                        if (commitErr) {
                                            return this.db.run("ROLLBACK", () => reject(commitErr));
                                        }
                                        resolve({ success: successCount, errors: errorCount });
                                    });
                                });
                                return;
                            }

                            const ret = retValues[idx++];
                            if (!ret) {
                                errorCount++;
                                return runNext();
                            }

                            // Allow cleanup/mutation before extracting fields
                            try {
                                if (!argv.nocleanup) {
                                    this.cleanupRecords(ret.data);
                                }
                            } catch (cleanupErr) {
                                console.warn(`⚠️ Cleanup failed for ${ret.filename}:`, cleanupErr.message);
                            }

                            const jsonData = ret.data || {};
                            const filename = ret.filename || null;
                            const uuid = (jsonData.activityUUID && jsonData.activityUUID.uuid) ? jsonData.activityUUID.uuid : null;
                            const activityName = jsonData.activityName || null;
                            const activityType = (jsonData.activityTypeDTO && jsonData.activityTypeDTO.typeKey) ? jsonData.activityTypeDTO.typeKey : null;
                            const distance = (jsonData.summaryDTO && typeof jsonData.summaryDTO.distance !== 'undefined') ? jsonData.summaryDTO.distance : null;
                            const duration = (jsonData.summaryDTO && typeof jsonData.summaryDTO.duration !== 'undefined') ? jsonData.summaryDTO.duration : null;
                            const startTime = (jsonData.summaryDTO && jsonData.summaryDTO.startTimeGMT) ? jsonData.summaryDTO.startTimeGMT : null;
                            const startLatitude = (jsonData.summaryDTO && typeof jsonData.summaryDTO.startLatitude !== 'undefined') ? jsonData.summaryDTO.startLatitude : null;
                            const startLongitude = (jsonData.summaryDTO && typeof jsonData.summaryDTO.startLongitude !== 'undefined') ? jsonData.summaryDTO.startLongitude : null;
                            const elevationGain = (jsonData.summaryDTO && typeof jsonData.summaryDTO.elevationGain !== 'undefined') ? jsonData.summaryDTO.elevationGain : null;
                            const maxElevation = (jsonData.summaryDTO && typeof jsonData.summaryDTO.maxElevation !== 'undefined') ? jsonData.summaryDTO.maxElevation : null;
                            const averageHR = (jsonData.summaryDTO && typeof jsonData.summaryDTO.averageHR !== 'undefined') ? jsonData.summaryDTO.averageHR : null;
                            const locationName = jsonData.locationName || null;

                            // Use function callback to access this.lastID if needed
                            stmt.run(
                                [filename, uuid, activityName, activityType, distance, duration, startTime,
                                    startLatitude, startLongitude, elevationGain, maxElevation, averageHR, locationName],
                                function (err) {
                                    if (err) {
                                        console.error(`❌ Error inserting ${filename}:`, err.message);
                                        errorCount++;
                                    } else {
                                        // console.log(`📝 ${filename} inserted (ID: ${this.lastID})`);
                                        successCount++;
                                    }
                                    // next row
                                    runNext();
                                }
                            );
                        }; // end runNext

                        // start processing
                        runNext();
                    }); // end prepare
                }); // end BEGIN TRANSACTION
            }); // end serialize
        }); // end Promise
    }

    // main processing function
    async processDirectory(directoryPath) {
        try {
            await this.connect();
            await this.createTable();

            const jsonFiles = await this.findJsonFiles(directoryPath);
            const parsedItems = [];

            // parse sequentially to avoid reading too many files at once, but could be parallelized
            for (const filePath of jsonFiles) {
                try {
                    const jsonData = await this.parseJsonFile(filePath);
                    if (jsonData) {
                        parsedItems.push(jsonData);
                    }
                } catch (error) {
                    console.error(`❌ Fehler bei ${filePath}:`, error.message);
                }
            }

            // bulk insert with transaction and prepared statement
            const result = await this.insertBatch(parsedItems);

            console.log(`\n📊 Summary:`);
            console.log(`✅ Success: ${result.success}`);
            console.log(`❌ Error: ${result.errors}`);
            console.log(`📁 Total: ${jsonFiles.length}`);

        } catch (error) {
            console.error('❌ Critical Error:', error);
        } finally {
            // close DB
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('❌ Error closing DB:', err);
                    } else {
                        console.log('🔒 DB Connection closed');
                    }
                });
            }
        }
    }

    // optional helper to read data
    async readData() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM json_data", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

// CLI entrypoint
async function main() {
    const directoryPath = './activities';

    argv = minimist(process.argv.slice(2), {
        boolean: ['nocleanup'],
        alias: {
            n: 'nocleanup'
        },
        default: {
            nocleanup: false,
        }
    });

    try {
        await fs.access(directoryPath);

        const processor = new JsonToSQLite();
        await processor.processDirectory(directoryPath);

    } catch (error) {
        console.error(`❌ Verzeichnis ${directoryPath} existiert nicht oder ist nicht zugänglich`);
        process.exit(1);
    }
}

main();