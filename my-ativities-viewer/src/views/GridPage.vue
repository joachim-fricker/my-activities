<template>
  <div class="grid-page">
    <h1>GPX Datenübersicht</h1>
    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 500px"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
    />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

export default {
  name: 'GridPage',
  components: {
    AgGridVue
  },
  data() {
    return {
      columnDefs: [
        { headerName: 'Track Name', field: 'name', sortable: true, filter: true },
        { headerName: 'Länge (km)', field: 'length', sortable: true, filter: true },
        { headerName: 'Höhenmeter', field: 'elevation', sortable: true, filter: true }
      ],
      defaultColDef: {
        resizable: true
      },
      rowData: [
        { name: 'Alpenroute', length: 12.4, elevation: 850 },
        { name: 'Seerundweg', length: 8.2, elevation: 120 },
        { name: 'Waldpfad', length: 5.6, elevation: 300 }
      ]
    }
  }
}
</script>

<style scoped>
.grid-page {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

