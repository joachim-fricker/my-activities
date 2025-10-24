/**
 * This is our backend server
 */
import express from 'express';
import cors from 'cors';
import db from './server-db.js';
import api from './server-api.js';

const app = express();

app.use(cors());
app.use(express.json());

// Mock Database
let tracks = [
    {
        id: 1,
        name: "Zürich See Rundfahrt",
        distance: 15.2,
        duration: "01:15",
        elevationGain: 120,
        createdAt: "2024-01-15T10:30:00Z"
    }
];



app.use('/', express.static('./webapp', { index: "index.html" }));


// our routes
app.get('/api/tracks', (req, res) => {
    res.json(tracks);
});

app.get('/api/yearSummary', (req, res) => {
    api.getYearSummary(req,res);
});

app.post('/api/tracks', (req, res) => {
    const newTrack = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    tracks.push(newTrack);
    res.json(newTrack);
});

/* we now load all our activities into memory
 the question is whether this makes sense in order to handle the various frontend request we somehow have to reimplement SQL functionality which we get for free
const sql = ` SELECT * from activities `;
const activities= await db.query(sql);
console.log('✅ All activties loaded');
*/

app.listen(3000, () => {
    console.log('✅ Backend Server running on http://localhost:3000');
});

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutdown server and db...');
    db.close();
    process.exit(0);
});