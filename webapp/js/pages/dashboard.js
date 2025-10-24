// Dashboard Page Component
const DashboardPage = {
    props: ['tracks', 'settings'],
    template: `
        <div class="page">
            <h1>Dashboard aktuelles Jahr</h1>
            
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-value">{{ total }}</div>
                    <div class="stat-label">Gesamte Tracks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ totalDistance }} km</div>
                    <div class="stat-label">Gesamtdistanz</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ totalElevation }} m</div>
                    <div class="stat-label">Gesamthöhe</div>
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

        // Computed Properties
        const totalTracks = computed(() => props.tracks.length);
        
        const totalDistance = computed(() => {
            return props.tracks.reduce((sum, track) => sum + track.distance, 0).toFixed(1);
        });
        
        const totalElevation = computed(() => {
            return props.tracks.reduce((sum, track) => sum + (track.elevationGain || 0), 0);
        });
        
        const averagePace = computed(() => {
            if (props.tracks.length === 0) return '0:00';
            const totalMinutes = props.tracks.reduce((sum, track) => {
                const [hours, minutes] = track.duration.split(':').map(Number);
                return sum + (hours * 60) + minutes;
            }, 0);
            const avgMinutes = totalMinutes / props.tracks.length;
            return `${Math.floor(avgMinutes / 60)}:${Math.floor(avgMinutes % 60).toString().padStart(2, '0')}`;
        });

        const recentTracks = computed(() => {
            return [...props.tracks]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);
        });

        // Methods
        const initMap = () => {
            if (!map.value) return;
            
            leafletMap = L.map(map.value).setView([47.5746760703623, 8.51740451529622], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
            
            // Zeige letzte Tracks auf der Map
            recentTracks.value.forEach(track => {
                // Hier würdest du die echten Track-Points verwenden
                const marker = L.marker([47.3769, 8.5417]).addTo(leafletMap);
                marker.bindPopup(`<b>${track.name}</b><br>${track.distance}km`);
            });
        };

        const initGrid = () => {
            if (!grid.value) return;
            
            gridApi = new agGrid.Grid(grid.value, {
                columnDefs: [
                    { field: 'name', headerName: 'Name', flex: 2 },
                    { field: 'distance', headerName: 'Distanz', flex: 1 },
                    { field: 'duration', headerName: 'Dauer', flex: 1 }
                ],
                rowData: recentTracks.value
            });
        };

        // Lifecycle
        onMounted(() => {
            initMap();
            initGrid();
        });

        // Watch for tracks changes
        watch(() => props.tracks, () => {
            if (gridApi) {
                //gridApi.setRowData(recentTracks.value);
            }
        });

        return {
            map,
            grid,
            totalTracks,
            totalDistance,
            totalElevation,
            averagePace,
            recentTracks
        };
    }
};