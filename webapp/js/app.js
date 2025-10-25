// Haupt-Vue App
const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        // State
        const currentPage = ref('dashboard');
        const tracks = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const yearSummary = ref({});
        const lastTracks = ref([]);

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
            console.log("In currentPageProps", yearSummary.value);


            switch (currentPage.value) {
                case 'dashboard':
                    return {
                        yearSummary: yearSummary.value,
                        lastTracks: lastTracks.value,
                        loading: loading.value,
                        error: error.value,
                        onRefresh: loadInitialData // Funktion als Prop übergeben
                    };
                case 'tracks':
                    return {
                        tracks: tracks.value,
                        loading: loading.value
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
                error.value = 'Error Loading Year Summary';
                throw err;
            }
        };

        const loadLastTracks = async () => {
            try {
                console.log("Loading LastTracks...");
                const data = await ApiService.getLastTracks();
                lastTracks.value = data;
            } catch (err) {
                console.error('Error Loading LastTracks:', err);
                error.value = 'Error Loading LastTracks';
                throw err;
            }
        };


        const loadInitialData = async () => {
            loading.value = true;
            try {
                // Parallele API Calls
                await Promise.all([
                    loadYearSummary(),
                    loadLastTracks()
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

        return {
            // State
            currentPage,
            tracks,
            yearSummary,
            lastTracks,
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
        DashboardPage,
        TracksPage,

    }
};

// App erstellen
createApp(App).mount('#app');