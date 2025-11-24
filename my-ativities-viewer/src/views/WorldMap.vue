<template>
    <div>
        <h1>Touren auf Weltkarte</h1>
        <div class="world-map-container">
            <div ref="map" class="map" style="  height: 90vh;"></div>
        </div>
    </div>
    `,
</template>

<script>
import { onMounted, ref } from 'vue';
import { ApiService } from '../composables/api';
import { useHelpers } from '../composables/helper';
import { toast } from 'vue3-toastify'

export default {
    name: 'WorldMap',
    setup() {
        const rowData = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const map = ref(null);

        let leafletMap = null;

        // Methods
        const initMap = () => {

            if (!map.value) return;
            leafletMap = L.map(map.value).setView([47.5746760703623, 30], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

        };

        const onClick = (event) => {
            let track = event.target.track ;
            let filename = track.filename;
            let newFilename = filename.replace('_summary.json', '.gpx');
            var gpxTrack = new L.GPX('http://localhost:3000/activities/' + newFilename, {
                async: true,
                markers: {
                    startIcon: 'src/assets/pin-icon-start.png',
                    endIcon: 'src/assets/pin-icon-end.png',
                }

            }).addTo(leafletMap);
        }

        const { formatTime, formatNumber } = useHelpers();
        onMounted(async () => {
            initMap();
            try {
                rowData.value = await ApiService.getAllTracks(toast);
                rowData.value.forEach(track => {
                    if (track.activityType !== "virtual_ride") {
                        // Korrigierter Bedingung: Marker nur setzen, wenn Koordinaten vorhanden sind
                        if (track.startLatitude && track.startLongitude) {
                            const marker = L.marker([track.startLatitude, track.startLongitude]).addTo(leafletMap);
                            let text =track.activityName + " " + track.startTime + " distance " + formatNumber(track.distance) + "km";
                            marker.track = track;
                            marker.bindPopup(text);
                            marker.on('click', onClick);
                        } else {
                            //  console.log("Ignoring due to missing coordinates:", track.activityName);
                        }
                    } else {
                        // console.log("Ignoring virtual_ride:", track.activityName);
                    }
                });
            } catch (error) {
                console.error("Error loading tracks:", error);
            }
        });


        /* this takes to much time is maybe not we want to see
        rowData.value.forEach(track => {
            let filename = track.filename;
            let newFilename = filename.replace('_summary.json', '.gpx');
            var gpxTrack = new L.GPX('http://localhost:3000/activities/' + newFilename, {
                async: true,
                markers: {
                    startIcon: 'src/assets/pin-icon-start.png',
                    endIcon: 'src/assets/pin-icon-end.png',
                }
    
            }).on('loaded', function (e) {
    //                 leafletMap.fitBounds(e.target.getBounds()); // Karte an Track anpassen
            }).addTo(leafletMap);
        });
    
    */


        return {
            map,
            rowData,
            loading,
            error
        }
    }
}


</script>

<style>
world-map-container {
    height: 900px;
    width: 900px;
}
</style>
