<template>
  <div class="grid-page">
    <h1>Chart Test</h1>
    <ag-charts :options="optionsData"> </ag-charts>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { AgCharts } from 'ag-charts-vue3';

export default {
  name: 'GridPage',
  components: {
    'ag-charts': AgCharts,
  },

  setup() {
    // Chart Options

    const testData =
      [{"year":"2021","totalActivities":83,"totalCycling":13,"totalCyclingDistance":462.78594,"totalCyclingElevation":7.8368199999999995,"totalRoadCycling":0,"totalRoadCyclingDistance":0,"totalRoadCyclingElevation":0,"totalVirtuallRide":0,"totalVirtualRideDistance":0,"totalVirtaulRideElevation":0,"totalMountainBiking":0,"totalMountainBikingDistance":0,"totalMountainBikingElevation":0,"totalGravelCycling":0,"totalGravelCyclingDistance":0,"totalGravelCyclingElevation":0,"totalBackcountrySkiing":22,"totalBackcountrySkiingDistance":106.03766,"totalBackcountrySkiingElevation":13.927719999999999,"totalResortSkiing":0,"totalResortSkiingDistance":0,"totalResortSkiingElevation":0,"totaWalking":33,"totalWalkingDistance":135.83513,"totalWalkingElevation":2.3216,"totalDistance":759.3187399999999,"totalElevation":24.48144},{"year":"2022","totalActivities":83,"totalCycling":56,"totalCyclingDistance":1944.4577,"totalCyclingElevation":22.11411,"totalRoadCycling":0,"totalRoadCyclingDistance":0,"totalRoadCyclingElevation":0,"totalVirtuallRide":0,"totalVirtualRideDistance":0,"totalVirtaulRideElevation":0,"totalMountainBiking":0,"totalMountainBikingDistance":0,"totalMountainBikingElevation":0,"totalGravelCycling":0,"totalGravelCyclingDistance":0,"totalGravelCyclingElevation":0,"totalBackcountrySkiing":11,"totalBackcountrySkiingDistance":58.77475,"totalBackcountrySkiingElevation":9.27627,"totalResortSkiing":0,"totalResortSkiingDistance":0,"totalResortSkiingElevation":0,"totaWalking":7,"totalWalkingDistance":46.863409999999995,"totalWalkingElevation":3.7666500000000003,"totalDistance":2052.09878,"totalElevation":35.246370000000006},{"year":"2023","totalActivities":118,"totalCycling":35,"totalCyclingDistance":2071.51286,"totalCyclingElevation":16.95909,"totalRoadCycling":10,"totalRoadCyclingDistance":577.7930600000001,"totalRoadCyclingElevation":7.00255,"totalVirtuallRide":0,"totalVirtualRideDistance":0,"totalVirtaulRideElevation":0,"totalMountainBiking":14,"totalMountainBikingDistance":511.67346999999995,"totalMountainBikingElevation":8.42126,"totalGravelCycling":0,"totalGravelCyclingDistance":0,"totalGravelCyclingElevation":0,"totalBackcountrySkiing":16,"totalBackcountrySkiingDistance":129.132,"totalBackcountrySkiingElevation":13.93032,"totalResortSkiing":1,"totalResortSkiingDistance":18.63341,"totalResortSkiingElevation":0,"totaWalking":32,"totalWalkingDistance":362.01088,"totalWalkingElevation":22.06446,"totalDistance":3964.0853399999996,"totalElevation":70.99325999999999},{"year":"2024","totalActivities":137,"totalCycling":1,"totalCyclingDistance":19.785970000000002,"totalCyclingElevation":0.226,"totalRoadCycling":18,"totalRoadCyclingDistance":797.3009000000001,"totalRoadCyclingElevation":11.36498,"totalVirtuallRide":15,"totalVirtualRideDistance":291.9934,"totalVirtaulRideElevation":2.36,"totalMountainBiking":13,"totalMountainBikingDistance":472.50284,"totalMountainBikingElevation":8.82902,"totalGravelCycling":53,"totalGravelCyclingDistance":3326.42019,"totalGravelCyclingElevation":29.76684,"totalBackcountrySkiing":22,"totalBackcountrySkiingDistance":192.00086,"totalBackcountrySkiingElevation":20.072740000000003,"totalResortSkiing":2,"totalResortSkiingDistance":77.15270999999998,"totalResortSkiingElevation":0,"totaWalking":5,"totalWalkingDistance":41.39953,"totalWalkingElevation":4.00033,"totalDistance":5287.73941,"totalElevation":77.56514999999999},{"year":"2025","totalActivities":110,"totalCycling":0,"totalCyclingDistance":0,"totalCyclingElevation":0,"totalRoadCycling":6,"totalRoadCyclingDistance":256.21357,"totalRoadCyclingElevation":2.13814,"totalVirtuallRide":43,"totalVirtualRideDistance":735.2336,"totalVirtaulRideElevation":9.001,"totalMountainBiking":20,"totalMountainBikingDistance":713.40904,"totalMountainBikingElevation":14.12657,"totalGravelCycling":12,"totalGravelCyclingDistance":715.75576,"totalGravelCyclingElevation":6.62461,"totalBackcountrySkiing":13,"totalBackcountrySkiingDistance":119.2672,"totalBackcountrySkiingElevation":12.13438,"totalResortSkiing":0,"totalResortSkiingDistance":0,"totalResortSkiingElevation":0,"totaWalking":16,"totalWalkingDistance":247.53966,"totalWalkingElevation":12.23827,"totalDistance":2787.41883,"totalElevation":56.26297}];

    const optionsData = {
      title: {
        text: "Distanzen der Aktivitäten"
      },
      data: testData,
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'year', yKey: 'totalDistance', yName: 'Total'},
        { type: 'bar', xKey: 'year', yKey: 'totalMountainBikingDistance', yName: 'MTB'},
        { type: 'bar', xKey: 'year', yKey: 'totalGravelCyclingDistance',  yName: 'Gravel'},
        { type: 'bar', xKey: 'year', yKey: 'totalRoadCyclingDistance', yName: 'Road'},
        { type: 'bar', xKey: 'year', yKey: 'totalBackcountrySkiingDistance',yName: 'SkiTour'},
        { type: 'bar', xKey: 'year', yKey: 'totalWalkingDistance' ,yName: 'Wandern'},
      ],
       axes: [
        {
          type: "grouped-category",
          position: "bottom",
          label: { rotation: 0 },
          depthOptions: [{}, { label: { fontWeight: "bold" } }],
        },
        { type: "number", position: "left" },
      ],
    }

    return {
      optionsData
    };
  },
}
</script>

<style scoped>
.grid-page {
  width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
