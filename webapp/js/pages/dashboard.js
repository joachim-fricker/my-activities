
// Dashboard Page Component
const DashboardPage = {
    //props: ['tracks', 'settings'],
    props: {
        yearSummary: {
            type: Object,
            default: () => []
        },
        lastTracks: {
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
        onRefresh: {
            type: Function,
            default: () => { }
        }
    },
    template: `
        <div class="page">
            <h1>Dashboard aktuelles Jahr</h1>
            
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-value">{{ summaryStats.total }}</div>
                    <div class="stat-label">Anzahl Tracks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ summaryStats.totalDistance }} km</div>
                    <div class="stat-label">Gesamtdistanz</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ summaryStats.totalElevation }} m</div>
                    <div class="stat-label">Gesamthöhenmeter</div>
                </div>
            </div>
            
            <h2>Aktivitätsübersicht</h2>
            <div class="map-grid-container">
                <div class="map-container">
                    <h3>Letzte Aktivitäten</h3>
                    <div ref="map" class="map"></div>
                </div>
                <div class="grid-container">
                    <h3>Kürzliche Tracks</h3>
                    <div ref="grid" class="ag-theme-alpine"></div>
                </div>
            </div>
        </div>
    `,

    setup(props) {
        const { computed, ref, onMounted, watch } = Vue;

        const map = ref(null);
        const grid = ref(null);
        let leafletMap = null;
        let gridApi = null;


        console.log("Dashboard Year Summary", props.yearSummary);
        // Computed Properties
        const summaryStats = computed(() => {
            return {
                total: props.yearSummary.total,
                totalDistance: props.yearSummary.totalDistance,
                totalElevation: props.yearSummary.totalElevation
            }
        });

        const lastTracksValue = computed(() => {
            return props.lastTracks;
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
                    { field: 'activityType', headerName: 'Type', flex: 2 },
                    { field: 'distance', headerName: 'Distance', flex: 1 },
                    { field: 'elevationGain', headerName: 'Elevation', flex: 1 },
                    { field: 'duration', headerName: 'Duration', flex: 1 }
                ],
                rowData: lastTracksValue.value
            });
            console.log("initGrid gridApi is", gridApi);
            console.log("initGrid", lastTracksValue.value);
        };

        // Lifecycle
        onMounted(() => {
            initMap();
            initGrid();
        });

        // Watch for tracks changes
        watch(() => props.lastTracks, () => {

            if (gridApi) {

                gridApi.setGridOption('rowData', lastTracksValue.value);
            }
        });

        return {
            map,
            grid,
            summaryStats,
            lastTracksValue
        };
    }
};