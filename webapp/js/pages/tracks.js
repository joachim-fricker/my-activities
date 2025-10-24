// Tracks Page Component
const TracksPage = {
    //props: ['tracks', 'settings'],
    props: ['tracks'],
    emits: ['update-tracks'],
    template: `
        <div class="page">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h1>Alle Tracks ({{ tracks.length }})</h1>
                <button class="btn btn-primary" @click="refreshTracks">
                    🔄 Aktualisieren
                </button>
            </div>

            <div class="map-grid-container">
                <div class="map-container">
                    <h3>Karte</h3>
                    <div ref="map" class="map"></div>
                    <div v-if="selectedTrack" class="track-info">
                        <h4>{{ selectedTrack.name }}</h4>
                        <p><strong>Distanz:</strong> {{ selectedTrack.distance }} km</p>
                        <p><strong>Dauer:</strong> {{ selectedTrack.duration }}</p>
                        <p><strong>Höhenmeter:</strong> +{{ selectedTrack.elevationGain }}m</p>
                        <button class="btn" @click="deleteTrack(selectedTrack.id)" style="margin-top: 10px;">
                            🗑️ Löschen
                        </button>
                    </div>
                </div>
                
                <div class="grid-container">
                    <h3>Track Liste</h3>
                    <div ref="grid" class="ag-theme-alpine"></div>
                </div>
            </div>
        </div>
    `,

    setup(props, { emit }) {
        const { ref, onMounted, watch } = Vue;
        
        const map = ref(null);
        const grid = ref(null);
        const selectedTrack = ref(null);
        
        let leafletMap = null;
        let gridApi = null;
        let currentPolyline = null;

        // Methods
        const initMap = () => {
            if (!map.value) return;
            
            leafletMap = L.map(map.value).setView([47.3769, 8.5417], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
        };

        const initGrid = () => {
            if (!grid.value) return;
            
            const gridOptions = {
                columnDefs: [
                    { 
                        field: 'name', 
                        headerName: 'Name', 
                        filter: true,
                        flex: 2 
                    },
                    { 
                        field: 'distance', 
                        headerName: 'Distanz (km)',
                        filter: 'agNumberColumnFilter',
                        flex: 1
                    },
                    { 
                        field: 'duration', 
                        headerName: 'Dauer',
                        flex: 1
                    },
                    { 
                        field: 'elevationGain', 
                        headerName: 'Höhe+',
                        flex: 1
                    }
                ],
                rowData: props.tracks,
                rowSelection: 'single',
                onSelectionChanged: onRowSelected
            };

            gridApi = new agGrid.Grid(grid.value, gridOptions);
        };

        const onRowSelected = () => {
            const selectedRows = gridApi.getSelectedRows();
            selectedTrack.value = selectedRows.length > 0 ? selectedRows[0] : null;
        };

        const drawTrackOnMap = (track) => {
            // Alten Track löschen
            if (currentPolyline) {
                leafletMap.removeLayer(currentPolyline);
            }
            
            if (track.points && track.points.length > 0) {
                // Echte Track-Points verwenden
                currentPolyline = L.polyline(track.points, {
                    color: 'blue',
                    weight: 4,
                    opacity: 0.7
                }).addTo(leafletMap);
                
                leafletMap.fitBounds(currentPolyline.getBounds());
            } else {
                // Fallback: Einfachen Marker setzen
                const marker = L.marker([47.3769, 8.5417]).addTo(leafletMap);
                marker.bindPopup(`<b>${track.name}</b>`);
                leafletMap.setView([47.3769, 8.5417], 13);
            }
        };

        const refreshTracks = async () => {
            try {
                const updatedTracks = await ApiService.getTracks();
                emit('update-tracks', updatedTracks);
                if (gridApi) {
                    gridApi.setRowData(updatedTracks);
                }
            } catch (error) {
                console.error('Failed to refresh tracks:', error);
                alert('Fehler beim Aktualisieren der Tracks');
            }
        };

        const deleteTrack = async (trackId) => {
            if (!confirm('Möchtest du diesen Track wirklich löschen?')) return;
            
            try {
                await ApiService.deleteTrack(trackId);
                const updatedTracks = props.tracks.filter(t => t.id !== trackId);
                emit('update-tracks', updatedTracks);
                selectedTrack.value = null;
                
                if (gridApi) {
                    gridApi.setRowData(updatedTracks);
                }
            } catch (error) {
                console.error('Failed to delete track:', error);
                alert('Fehler beim Löschen des Tracks');
            }
        };

        // Lifecycle
        onMounted(() => {
            initMap();
            initGrid();
        });

        // Watch for track selection
        watch(selectedTrack, (newTrack) => {
            if (newTrack && leafletMap) {
                drawTrackOnMap(newTrack);
            }
        });

        // Watch for tracks changes
        watch(() => props.tracks, () => {
            if (gridApi) {
                gridApi.setRowData(props.tracks);
            }
        });

        return {
            map,
            grid,
            selectedTrack,
            refreshTracks,
            deleteTrack
        };
    }
};