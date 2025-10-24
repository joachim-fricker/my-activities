import sqlite3 from 'sqlite3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JsonToSQLite {
    constructor(dbPath = './data.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    // Datenbankverbindung öffnen
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

    // TODO check whether all fields should have not null constraint
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
                    startLatitude TEXT,
                    startLongitude TEXT,
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

    // find all JSON-Files
    async findJsonFiles(directory) {
        
        try {
            const files = await fs.readdir(directory);
            const jsonFiles = files.filter(file => 
                path.extname(file).toLowerCase() === '.json'
            );
            
            console.log(`📁 ${jsonFiles.length} JSON-files found in ${directory}`);
            return jsonFiles.map(file => path.join(directory, file));
        } catch (error) {
            console.error('❌ Error reading directory', error);
            return [];
        }
    }

    // JSON-Datei parsen
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

    // Daten in Datenbank einfügen
    async insertJsonData(retValue) {
    
        

        var jsonData = retValue.data;
        var filename= retValue.filename;
        var uuid= jsonData.activityUUID.uuid;
        var activityName= jsonData.activityName;
        var activityType= jsonData.activityTypeDTO.typeKey;
        var distance= jsonData.summaryDTO.distance;
        var duration= jsonData.summaryDTO.duration;
        var startTime=jsonData.summaryDTO.distance;
        var startLatitude= jsonData.summaryDTO.startLatitude;
        var startLongitude= jsonData.summaryDTO.startLongitude;
        var elevationGain= jsonData.summaryDTO.elevationGain;
        var maxElevation= jsonData.summaryDTO.maxElevation;
        var averageHR= jsonData.summaryDTO.averageHR
        var locationName= jsonData.locationName;

        

        
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO activities (filename, uuid, activityName, activityType, distance, duration, startTime, startLatitude, startLongitude, elevationGain, maxElevation, averageHR, locationName)
                VALUES (?, ?, ? ,? ,?,?, ?, ? ,? ,?,?,?,?)
            `;

            this.db.run(query, [filename,uuid, activityName, activityType, distance, duration, startTime, startLatitude, startLongitude, elevationGain, maxElevation, averageHR, locationName ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`📝 ${filename} eingefügt (ID: ${this.lastID})`);
                    resolve(this.lastID);
                }
            });
        });
    }

    // Hauptfunktion
    async processDirectory(directoryPath) {
        try {
            // Verbindung herstellen und Tabelle erstellen
            await this.connect();

            await this.createTable();

            // JSON-Dateien finden
            const jsonFiles = await this.findJsonFiles(directoryPath);

            let successCount = 0;
            let errorCount = 0;

            // Jede JSON-Datei verarbeiten
            for (const filePath of jsonFiles) {
                try {
                    const jsonData = await this.parseJsonFile(filePath);
                    
                    if (jsonData) {
                       await this.insertJsonData(jsonData);
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`❌ Fehler bei ${filePath}:`, error.message);
                    errorCount++;
                }
            }

            console.log(`\n📊 Summary:`);
            console.log(`✅ Success: ${successCount}`);
            console.log(`❌ Error: ${errorCount}`);
            console.log(`📁 Total: ${jsonFiles.length}`);

        } catch (error) {
            console.error('❌ Critical Error:', error);
        } finally {
            // Datenbankverbindung schließen
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

    // Daten aus der Datenbank lesen (optional)
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

// Hauptprogramm
async function main() {
    const directoryPath = process.argv[2] || './activities';

    console.log("Here we are");
    
    try {
        // Prüfen ob Verzeichnis existiert
        await fs.access(directoryPath);
        
        const processor = new JsonToSQLite();
        await processor.processDirectory(directoryPath);
        
    } catch (error) {
        console.error(`❌ Verzeichnis ${directoryPath} existiert nicht oder ist nicht zugänglich`);
        process.exit(1);
    }
}

// Script ausführen
// main().catch(console.error);
main();
