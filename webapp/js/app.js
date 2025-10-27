// Haupt-Vue App
const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        // State
        const currentPage = ref('dashboard');

        const loading = ref(false);
        const error = ref(null);
        const yearSummary = ref({});
        const allTracks = ref([]);
        const summary = ref([]);

        // Pages Definition
        const pages = [
            { id: 'dashboard', name: 'Dashboard', component: 'DashboardPage' },
            { id: 'tracks', name: 'Tracks', component: 'TracksPage' },

        ];

        // Computed
        const currentPageComponent = computed(() => {
            const page = pages.find(p => p.id === currentPage.value);
            return page ? page.component : 'DashboardPage';
        });

        const currentPageProps = computed(() => {

            switch (currentPage.value) {
                case 'dashboard':
                    return {
                        yearSummary: yearSummary.value,
                        summary: summary.value,
                        loading: loading.value,
                        error: error.value,
                        onRefresh: loadInitialData // Funktion als Prop übergeben
                    };
                case 'tracks':
                    return {
                        allTracks: allTracks.value,
                        loading: loading.value,
                        error: error.value,
                        onRefresh: loadInitialData // Funktion als Prop übergeben

                    };
                default:
                    return {};
            }
        });
        // Methods
        const navigateTo = (pageId) => {
            currentPage.value = pageId;
            error.value = null;
        };

        /**----------------------
         * Data loading
         * -----------------------
         */

        const loadYearSummary = async () => {
            try {
                console.log("Loading Year Summary...");
                const data = await ApiService.getYearSummary();
                yearSummary.value = data;
            } catch (err) {
                console.error('Error Loading YearSummary:', err);
                throw err;
            }
        };

        const loadSummary = async () => {
            try {
                console.log("Loading Summary...");
                const data = await ApiService.getSummary();
                summary.value = data;
            } catch (err) {
                console.error('Error Loading YearSummary:', err);
                throw err;
            }
        };

        const loadAllTracks = async () => {
            try {
                console.log("Loading AllTracks...");
                const data = await ApiService.getAllTracks();
                allTracks.value = data;
            } catch (err) {
                console.error('Error Loading AllTracks:', err);
                throw err;
            }
        };


        const loadInitialData = async () => {
            loading.value = true;
            try {
                // Parallele API Calls
                await Promise.all([
                    loadYearSummary(),
                    loadAllTracks(),
                    loadSummary()
                ]);

            } catch (err) {
                console.error('Failed to load initial data:', err);
            } finally {
                loading.value = false;
            }

        };

        // Lifecycle
        onMounted(() => {
            loadInitialData();
        });

        // AG Charts Vue Plugin registrieren

        return {
            // State
            currentPage,
            loading,
            error,
            pages,
            // Computed
            currentPageComponent,
            currentPageProps,
            // Methods
            navigateTo,
        };
    },

    components: {
        'chart-component': ChartComponent,
        DashboardPage,
        TracksPage
    }
};

// App erstellen
const app = createApp(App);
app.mount('#app');