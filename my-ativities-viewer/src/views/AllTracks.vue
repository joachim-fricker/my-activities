<template>
    <div>
        <h1>Alle Aktivitäten</h1>
        {{ selectedActivity.activityName }} {{ selectedActivity.startTime }}

        <div class="map-grid-container">
            <div class="map-container">
                <div ref="map" class="map"></div>
            </div>
            <div class="grid-container">
                <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 100%" :rowData="rowData" :theme="myTheme"
                    :columnDefs="columnDefs" :defaultColDef="defaultColDef" v-on:row-clicked="onRowClicked"/>

            </div>
        </div>
    </div>
    `,
</template>

<script>
import { onMounted, ref } from 'vue';
import { ApiService } from '../composables/api';
import { useHelpers } from '../composables/helper';
import { toast } from 'vue3-toastify'
import { AgGridVue } from 'ag-grid-vue3'
import { themeQuartz } from 'ag-grid-community';

export default {
    name: 'AllTracks',
    components: {
        AgGridVue
    },

    setup() {
        const rowData = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const map = ref(null);

        const { formatTime, formatNumber } = useHelpers();

        const selectedActivity = ref({
            activityName: "Please select",
            startTime: ""
        });

        let leafletMap = null;

        const myTheme = themeQuartz.withParams({ accentColor: 'blue' });
        const columnDefs = [
            { field: 'activityName', headerName: 'Name', flex: 2 },
            { field: 'activityType', headerName: 'Type', flex: 1, },
            { field: 'startTime', headerName: 'Datum', flex: 2 },
            { field: 'distance', headerName: 'Distance', flex: 1, valueFormatter: (params) => formatNumber(params.value) },
            { field: 'elevationGain', headerName: 'Elevation', flex: 1 },
            {
                field: 'duration',
                headerName: 'Duration',
                flex: 1,
                valueFormatter: (params) => formatTime(params.value)
            },
        ];
        const defaultColDef = {
            filter: true,
            filterParams: {
                buttons: ['apply', 'reset'],
                closeOnApply: true,
            }
        };
        // Methods
        const initMap = () => {

            if (!map.value) return;
            leafletMap = L.map(map.value).setView([47.5746760703623, 8.51740451529622], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

            /*
            recentTracks.value.forEach(track => {
                // Hier würdest du die echten Track-Points verwenden
                const marker = L.marker([47.3769, 8.5417]).addTo(leafletMap);
                marker.bindPopup(`<b>${track.name}</b><br>${track.distance}km`);
            });
            */
        };

        const onRowClicked = (event) => {
            leafletMap.eachLayer(function (layer) {
                if (layer instanceof L.GPX) {
                    leafletMap.removeLayer(layer);
                }
            });
            leafletMap.setView([event.data.startLatitude, event.data.startLongitude], 13);
            let filename = event.data.filename;
            let newFilename = filename.replace('_summary.json', '.gpx');
            selectedActivity.value.activityName = event.data.activityName;
            selectedActivity.value.startTime = event.data.startTime;
            var gpxTrack = new L.GPX('http://localhost:3000/activities/' + newFilename, {
                async: true,
                marker_options: {
                    startIconUrl: null,  // Start-Marker ausschalten
                    endIconUrl: null,    // End-Marker ausschalten
                    shadowUrl: null,     // Shadow ausschalten
                    wptIconUrls: null    // Wegpunkte ausschalten
                }
            }).on('loaded', function (e) {
                leafletMap.fitBounds(e.target.getBounds()); // Karte an Track anpassen
            }).addTo(leafletMap);
        };

        onMounted(async () => {
            initMap();
            try {
                rowData.value = await ApiService.getAllTracks(toast);
            } catch (err) {
            } finally {
                loading.value = false
            }
        })

        return {
            myTheme,
            map,
            onRowClicked,
            columnDefs,
            defaultColDef,
            formatTime,
            formatNumber,
            rowData,
            selectedActivity,
            loading,
            error
        }
    }

}
</script>

