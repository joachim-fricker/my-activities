
// Dashboard Page Component
const TracksPage = {

    props: {
        allTracks: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: null
        },
       
    },
    template: `
    <div>
            <h1>Alle Aktivitäten</h1>
            {{ selectedActivity.activityName}} {{ selectedActivity.startTime}}
            
            <div class="map-grid-container">
                <div class="map-container">
                    <div ref="map" class="map"></div>
                </div>
                <div class="grid-container">
                    <div ref="grid" class="ag-theme-alpine"></div>
                </div>
            </div>
        </div>
    `,

    setup(props) {
        const { computed, ref, onMounted, watch } = Vue;

        const { formatTime } = useHelpers();
        const { formatNumber } = useHelpers();
        const map = ref(null);
        const grid = ref(null);
        let leafletMap = null;
        let gridApi = null;

        const selectedActivity = ref({
            activityName: "Please select",
            startTime: ""
        });

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

        const initGrid = () => {
            if (!grid.value) return;

            gridApi = agGrid.createGrid(grid.value, {
                columnDefs: [
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
                ],
                // Configurations applied to all columns
                defaultColDef: {
                    filter: true,
                    filterParams: {
                        buttons: ['apply', 'reset'],
                        closeOnApply: true,
                    }
                },
                onRowClicked: (event) => {
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
                    var gpxTrack = new L.GPX('./activities/' + newFilename, {
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
                },
            });

        };
        // Lifecycle
        onMounted(() => {
            initMap();
            initGrid();
            // Probaly this is dangerous 
            gridApi.setGridOption('rowData', props.allTracks);
        });

        // Watch for the data needed
        watch(() => props.allTracks, () => {
            if (gridApi) {
                gridApi.setGridOption('rowData', props.allTracks);
            }
        });

        return {
            map,
            grid,
            selectedActivity,
        };
    }
};