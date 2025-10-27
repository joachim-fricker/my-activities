const DashboardPage = {
    props: {
        yearSummary: {
            type: Object,
            default: () => ({})
        },
        summary: {
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
    components: {
        'chart-component': ChartComponent
    },
    template: `
        <div class="page">
            <h1>Dashboard aktuelles Jahr</h1>
            
            <div class="dashboard-grid">
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

            <div id="foo">
                <chart-component 
                    :options="chartOptions" 
                    :height="400"
                />
            </div>
        </div>
    `,
    computed: {
        chartOptions() {
            return {
                data: [],
                series: [
                    {
                        type: 'line',
                        xKey: 'year',
                        yKey: 'totalDistance',
                        yName: "Total",
                    },
                    {
                        type: 'line',
                        xKey: 'year',
                        yKey: 'totalMountainBikingDistance',
                        yName: "MTB",
                    },
                    {
                        type: 'line',
                        xKey: 'year',
                        yKey: 'totalGravelCyclingDistance',
                        yName: "Gravel",
                    },
                    {
                        type: 'line',
                        xKey: 'year',
                        yKey: 'totalCyclingDistance',
                        yName: "Rennrad/Virtual",
                    }
                ],
                title: {
                    text: 'Summary'
                },
            };
        }
    },
    mounted() {
        this.chartData = [
            { "year": "2021", "totalActivities": 35, "totalCycling": 13, "totalCyclingDistance": 462.78594, "totalCyclingElevation": 7.8368199999999995, "totalMountainBiking": 0, "totalMountainBikingDistance": 0, "totalMountainBikingElevation": 0, "totalGravelCycling": 0, "totalGravelCyclingDistance": 0, "totalGravelCyclingElevation": 0, "totalBackcountrySkiing": 22, "totalBackcountrySkiingDistance": 106.03766, "totalBackcountrySkiingElevation": 13.927719999999999, "totalDistance": 568.8235999999999, "totalElevation": 21.76454 },
            { "year": "2022", "totalActivities": 67, "totalCycling": 56, "totalCyclingDistance": 1944.4577, "totalCyclingElevation": 22.11411, "totalMountainBiking": 0, "totalMountainBikingDistance": 0, "totalMountainBikingElevation": 0, "totalGravelCycling": 0, "totalGravelCyclingDistance": 0, "totalGravelCyclingElevation": 0, "totalBackcountrySkiing": 11, "totalBackcountrySkiingDistance": 58.77475, "totalBackcountrySkiingElevation": 9.27627, "totalDistance": 2003.23245, "totalElevation": 31.39038 },
            { "year": "2023", "totalActivities": 75, "totalCycling": 45, "totalCyclingDistance": 2649.30592, "totalCyclingElevation": 23.96164, "totalMountainBiking": 14, "totalMountainBikingDistance": 511.67346999999995, "totalMountainBikingElevation": 8.42126, "totalGravelCycling": 0, "totalGravelCyclingDistance": 0, "totalGravelCyclingElevation": 0, "totalBackcountrySkiing": 16, "totalBackcountrySkiingDistance": 129.132, "totalBackcountrySkiingElevation": 13.93032, "totalDistance": 3290.11139, "totalElevation": 46.31322 },
            { "year": "2024", "totalActivities": 122, "totalCycling": 34, "totalCyclingDistance": 1109.08027, "totalCyclingElevation": 13.95098, "totalMountainBiking": 13, "totalMountainBikingDistance": 472.50284, "totalMountainBikingElevation": 8.82902, "totalGravelCycling": 53, "totalGravelCyclingDistance": 3326.42019, "totalGravelCyclingElevation": 29.76684, "totalBackcountrySkiing": 22, "totalBackcountrySkiingDistance": 192.00086, "totalBackcountrySkiingElevation": 20.072740000000003, "totalDistance": 5100.00416, "totalElevation": 72.61958 },
            { "year": "2025", "totalActivities": 94, "totalCycling": 49, "totalCyclingDistance": 991.44717, "totalCyclingElevation": 11.13914, "totalMountainBiking": 20, "totalMountainBikingDistance": 713.40904, "totalMountainBikingElevation": 14.12657, "totalGravelCycling": 12, "totalGravelCyclingDistance": 715.75576, "totalGravelCyclingElevation": 6.62461, "totalBackcountrySkiing": 13, "totalBackcountrySkiingDistance": 119.2672, "totalBackcountrySkiingElevation": 12.13438, "totalDistance": 2539.8791699999997, "totalElevation": 44.024699999999996 }
        ];
    },

    methods: {
        formatNumber(num) {
            return useHelpers().formatNumber(num);
        },
        formatTime(time) {
            return useHelpers().formatTime(time);
        }
    },
    watch: {
        summary: {
            handler(newSummary) {
                const foo = JSON.parse(JSON.stringify(newSummary));
                console.log("Foo is",foo);
                this.chartOptions.data = foo;
                immediate: true // Sofort ausführen wenn Komponente erstellt wird
            }
        }
    }
};