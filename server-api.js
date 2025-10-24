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
            console.log("Got an eror fetching the year summary",error);
        }
    }


}
export const api = new Api();
export default api