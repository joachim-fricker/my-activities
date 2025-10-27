// Dashboard Page Component

const DashboardPage = {
    props: {
        yearSummary: {
            type: Object,
            default: () => []
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
    template: `
        <div class="page">
            <h1>Dashboard aktuelles Jahr</h1>
            
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-value">{{ yearSummary.total }}</div>
                    <div class="stat-label">Anzahl Tracks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{  formatNumber(yearSummary.totalDistance) }} km</div>
                    <div class="stat-label">Gesamtdistanz</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">{{ formatNumber(yearSummary.totalElevation) }} m</div>
                    <div class="stat-label">Gesamthöhenmeter</div>
                </div>
            </div>
            
            <h1>Letzte Jahre </h1>

             <div class="my-container">
                <div ref="grid" class="ag-theme-alpine" ></div>            
            </div>
        </div>
        
    `,

    setup(props) {
        const { computed, ref, onMounted, watch } = Vue;

        const { formatTime } = useHelpers();
        const { formatNumber } = useHelpers();

        const grid = ref(null);

        const initGrid = () => {
            if (!grid.value) return;

            gridApi = agGrid.createGrid(grid.value, {
                columnDefs: [
                    { field: 'activityType', headerName: 'Type', flex: 2 },
                    { field: 'year', headerName: 'Year', flex: 1 },
                    { field: 'distance', headerName: 'Distance', flex: 1, valueFormatter: (params) => formatNumber(params.value) },
                    { field: 'elevationGain', headerName: 'Elevation', flex: 1,valueFormatter: (params) => formatNumber(params.value) },
                    {
                        field: 'duration',
                        headerName: 'Duration',
                        flex: 1,
                        valueFormatter: (params) => formatTime(params.value)
                    }
                ],

            });
        }

        // Lifecycle
        onMounted(() => {
            initGrid();
            gridApi.setGridOption('rowData', props.summary);
        });

        // Watch for the data needed
        watch(() => props.summary, () => {
            if (gridApi) {
                gridApi.setGridOption('rowData', props.summary);
            }
        });
        return {
            grid,
            formatTime,
            formatNumber

        };
    }
};