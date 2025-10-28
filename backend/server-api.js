/**
 * Here is the backend part of our API
 */
import db from './server-db.js';


class Api {

    async getYearSummary(req, res,) {
        try {
            var currentYear = new Date().getFullYear();
            var sql = "SELECT count(*) as total, SUM(distance)/1000 AS totalDistance, SUM(elevationGain) as totalElevation from activities where startTime >=  '" + currentYear + "-01-01'";
            var activities = await db.get(sql);
            res.json(activities);
        } catch (error) {
            console.log("Got an eror fetching the year summary", error);
        }
    }

    async getAllTracks(req, res) {
        try {
            var sql = "SELECT  activityName,  activityType, distance/1000 AS distance, elevationGain, duration, startLatitude, startLongitude,startTime,filename from activities order by startTime DESC ";
            var activities = await db.query(sql);
            res.json(activities);
        } catch (error) {
            console.log("Got an eror fetching the last activities", error);
        }
    }

    async getSummary(req, res) {
        try {
            var sql = `SELECT 
    strftime('%Y', startTime) as year,
    COUNT(*) as totalActivities,
    -- Cycling Aktivitäten
    SUM(CASE WHEN activityType IN ('cycling', 'road_biking', 'virtual_ride') THEN 1 ELSE 0 END) as totalCycling,
    SUM(CASE WHEN activityType IN ('cycling', 'road_biking', 'virtual_ride') THEN distance ELSE 0 END)/1000 as totalCyclingDistance,
    SUM(CASE WHEN activityType IN ('cycling', 'road_biking', 'virtual_ride') THEN elevationGain ELSE 0 END)/1000 as totalCyclingElevation,
    
    -- Mountain Biking
    SUM(CASE WHEN activityType = 'mountain_biking' THEN 1 ELSE 0 END) as totalMountainBiking,
    SUM(CASE WHEN activityType = 'mountain_biking' THEN distance ELSE 0 END)/1000 as totalMountainBikingDistance,
    SUM(CASE WHEN activityType = 'mountain_biking' THEN elevationGain ELSE 0 END)/1000 as totalMountainBikingElevation,
    
    -- Gravel Cycling
    SUM(CASE WHEN activityType = 'gravel_cycling' THEN 1 ELSE 0 END) as totalGravelCycling,
    SUM(CASE WHEN activityType = 'gravel_cycling' THEN distance ELSE 0 END)/1000 as totalGravelCyclingDistance,
    SUM(CASE WHEN activityType = 'gravel_cycling' THEN elevationGain ELSE 0 END)/1000 as totalGravelCyclingElevation,
    
    -- Backcountry Skiing
    SUM(CASE WHEN activityType = 'backcountry_skiing' THEN 1 ELSE 0 END) as totalBackcountrySkiing,
    SUM(CASE WHEN activityType = 'backcountry_skiing' THEN distance ELSE 0 END)/1000 as totalBackcountrySkiingDistance,
    SUM(CASE WHEN activityType = 'backcountry_skiing' THEN elevationGain ELSE 0 END)/1000 as totalBackcountrySkiingElevation,
    
    -- Gesamtsummen
    SUM(distance)/1000 as totalDistance,
    SUM(elevationGain)/1000 as totalElevation

FROM activities 
WHERE activityType IN (
    'mountain_biking',
    'cycling', 
    'road_biking',
    'gravel_cycling',
    'virtual_ride',
    'backcountry_skiing'
)
GROUP BY year
ORDER BY year;
`
            var activities = await db.query(sql);
            res.json(activities);
        } catch (error) {
            console.log("Got an eror fetching ActivitySummary", error);
        }


    }

}
export const api = new Api();
export default api