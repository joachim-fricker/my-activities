<template>
  <div>
    <h1>Dashboard aktuelles Jahr</h1>
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
    <h1>Letzte Jahre</h1>
  </div>

</template>

<script>

import { onMounted, ref } from 'vue';
import { ApiService } from '../composables/api';
import { useHelpers } from '../composables/helper';
import { toast } from 'vue3-toastify'


export default {

  setup() {
    const yearSummary = ref({});
    const loading = ref(true);
    const error = ref(null);
    const { formatTime, formatNumber } = useHelpers()

    onMounted(async () => {
      try {
        yearSummary.value = await ApiService.getYearSummary(toast)
      } catch (err) {
      } finally {
        loading.value = false
      }
    })

    return {
      formatTime,
      formatNumber,
      yearSummary,
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
  font-size:24px;
    margin-top: 0.5rem;
}
</style>
