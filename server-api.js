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
            var sql = `SELECT  activityType, count(*) as total, SUM(distance)/1000 AS distance, SUM(elevationGain)/1000 as elevationGain, strftime('%Y',startTime )  as year from activities where activityType in ('mountain_biking',
'cycling',
'road_biking',
'gravel_cycling',
'virtual_ride', 'backcountry_skiing'
) group by activityType,year  union SELECT  'Year Summary', count(*) as total, SUM(distance)/1000 AS distance, SUM(elevationGain)/1000 as elevationGain,strftime('%Y',startTime )  as year   from activities group by year
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