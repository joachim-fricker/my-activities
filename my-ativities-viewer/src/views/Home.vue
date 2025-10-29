<template>
  <div>
    <h2>Atuelles Jahr</h2>
    <div class="dashboard">
      <div class="stat-card">
        <div class="stat-value">{{ yearSummary.total }}</div>
        <div class="stat-label">Anzahl Tracks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ formatNumber(yearSummary.totalDistance) }} km</div>
        <div class="stat-label">Gesamtdistanz</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ formatNumber(yearSummary.totalElevation) }} m</div>
        <div class="stat-label">Gesamthöhenmeter</div>
      </div>
    </div>
    <h2>Daten aller Jahre in km</h2> 
    <ag-charts :options="distanceData" > </ag-charts>
    <ag-charts :options="elevationData" > </ag-charts>
  </div>

</template>

<script>

import { onMounted, ref, watch, computed } from 'vue';
import { ApiService } from '../composables/api';
import { useHelpers } from '../composables/helper';
import { toast } from 'vue3-toastify'
import { AgCharts } from 'ag-charts-vue3';


export default {
  name: 'GridPage',
  components: {
    'ag-charts': AgCharts,
  },

  setup() {
    const yearSummary = ref({});
    const summary = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const { formatTime, formatNumber } = useHelpers()

    const distanceData = computed(() => ({
      title: {
        text: "Distanzen der Aktivitäten"
      },
      data: summary.value, 
      //data: summary.value,
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'year', yKey: 'totalDistance', yName: 'Total' },
        { type: 'bar', xKey: 'year', yKey: 'totalMountainBikingDistance', yName: 'MTB' },
        { type: 'bar', xKey: 'year', yKey: 'totalGravelCyclingDistance', yName: 'Gravel' },
        { type: 'bar', xKey: 'year', yKey: 'totalRoadCyclingDistance', yName: 'Road' },
        { type: 'bar', xKey: 'year', yKey: 'totalBackcountrySkiingDistance', yName: 'SkiTour' },
        { type: 'bar', xKey: 'year', yKey: 'totalWalkingDistance', yName: 'Wandern' },
      ],
      axes: [
        {
          type: "grouped-category",
          position: "bottom",
          label: { rotation: 0 },
          depthOptions: [{}, { label: { fontWeight: "bold" } }],
        },
        { type: "number", position: "left" },
      ]
    }));

     const elevationData = computed(() => ({
      title: {
        text: "Höhenmeter der Aktivitäten"
      },
      data: summary.value, 
      //data: summary.value,
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'year', yKey: 'totalElevation', yName: 'Total' },
        { type: 'bar', xKey: 'year', yKey: 'totalMountainBikingElevation', yName: 'MTB' },
        { type: 'bar', xKey: 'year', yKey: 'totalGravelCyclingElevation', yName: 'Gravel' },
        { type: 'bar', xKey: 'year', yKey: 'totalRoadCyclingElevation', yName: 'Road' },
        { type: 'bar', xKey: 'year', yKey: 'totalBackcountrySkiingElevation', yName: 'SkiTour' },
        { type: 'bar', xKey: 'year', yKey: 'totalWalkingElevation', yName: 'Wandern' },
      ],
      axes: [
        {
          type: "grouped-category",
          position: "bottom",
          label: { rotation: 0 },
          depthOptions: [{}, { label: { fontWeight: "bold" } }],
        },
        { type: "number", position: "left" },
      ]
    }));
    onMounted(async () => {
      try {
        yearSummary.value = await ApiService.getYearSummary(toast);
        summary.value = await ApiService.getSummary(toast);
      } catch (err) {
      } finally {
        loading.value = false
      }
    })


    return {
      formatTime,
      formatNumber,
      distanceData,
      elevationData,
      yearSummary,
      summary,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #eeebeb;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;

}

.stat-label {
  color: black;
  font-weight: bold;
  font-size: 24px;
  margin-top: 0.5rem;
}
</style>
