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
    SUM(CASE WHEN activityType = 'cycling' THEN 1 ELSE 0 END) as totalCycling,
    SUM(CASE WHEN activityType = 'cycling' THEN distance ELSE 0 END)/1000 as totalCyclingDistance,
    SUM(CASE WHEN activityType = 'cycling' THEN elevationGain ELSE 0 END)/1000 as totalCyclingElevation,

    -- road_bike
    SUM(CASE WHEN activityType = 'road_biking' THEN 1 ELSE 0 END) as totalRoadCycling,
    SUM(CASE WHEN activityType = 'road_biking' THEN distance ELSE 0 END)/1000 as totalRoadCyclingDistance,
    SUM(CASE WHEN activityType = 'road_biking' THEN elevationGain ELSE 0 END)/1000 as totalRoadCyclingElevation,

    -- virtual_ride
    SUM(CASE WHEN activityType = 'virtual_ride' THEN 1 ELSE 0 END) as totalVirtuallRide,
    SUM(CASE WHEN activityType = 'virtual_ride' THEN distance ELSE 0 END)/1000 as totalVirtualRideDistance,
    SUM(CASE WHEN activityType = 'virtual_ride' THEN elevationGain ELSE 0 END)/1000 as totalVirtaulRideElevation,

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

    -- Backcountry Skiing
    SUM(CASE WHEN activityType = 'resort_skiing' THEN 1 ELSE 0 END) as totalResortSkiing,
    SUM(CASE WHEN activityType = 'resort_skiing' THEN distance ELSE 0 END)/1000 as totalResortSkiingDistance,
    SUM(CASE WHEN activityType = 'resort_skiing' THEN elevationGain ELSE 0 END)/1000 as totalResortSkiingElevation,

    -- all walking/runnuing/
    SUM(CASE WHEN activityType IN ('walking','running','mountaineering','hiking') THEN 1 ELSE 0 END) as totaWalking,
    SUM(CASE WHEN activityType IN ('walking','running','mountaineering','hiking') THEN distance ELSE 0 END)/1000 as totalWalkingDistance,
    SUM(CASE WHEN activityType IN ('walking','running','mountaineering','hiking') THEN elevationGain ELSE 0 END)/1000 as totalWalkingElevation,


    -- Gesamtsummen
    SUM(distance)/1000 as totalDistance,
    SUM(elevationGain)/1000 as totalElevation

FROM activities 
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