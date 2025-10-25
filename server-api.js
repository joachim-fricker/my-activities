/**
 * Here is the backend part of our API
 */
import db from './server-db.js';


class Api {

    async getYearSummary(req, res,) {
        try {
            var currentYear = new Date().getFullYear();
            var sql = "SELECT count(*) as total, cast(ROUND( SUM(distance)/1000) as int) AS totalDistance, cast(ROUND(SUM(elevationGain)) as int) as totalElevation from activities where startTime >=  '" + currentYear + "-01-01'";
            var activities = await db.get(sql);
            res.json(activities);
        } catch (error) {
            console.log("Got an eror fetching the year summary", error);
        }
    }

    async getLastTracks(req, res) {
        try {
            var sql = "SELECT  activityName,  activityType,cast( ROUND(distance/1000) as int) AS distance, elevationGain, duration, startLatitude, startLongitude,filename from activities order by startTime DESC LIMIT 20";
            var activities = await db.query(sql);
            res.json(activities);
        } catch (error) {
            console.log("Got an eror fetching the last activities", error);
        }


    }

}
export const api = new Api();
export default api