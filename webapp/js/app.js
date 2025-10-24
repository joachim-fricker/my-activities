// Haupt-Vue App
const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        // State
        const currentPage = ref('dashboard');
        const tracks = ref([]);
        const loading = ref(false);
        const error = ref(null);

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

        // Methods
        const navigateTo = (pageId) => {
            currentPage.value = pageId;
            error.value = null;
        };

        const handleUpdateTracks = (updatedTracks) => {
            tracks.value = updatedTracks;
        };

        const handleUpdateSettings = (updatedSettings) => {
            settings.value = updatedSettings;
        };

        const loadInitialData = async () => {
            loading.value = true;
            try {
                // Parallel alle Daten laden
                const [tracksData, dummy] = await Promise.all([
                    ApiService.getYearSummary(),
                    ApiService.dummy()
                ]);
                
                tracks.value = tracksData;
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
            loading,
            error,
            pages,
            
            // Computed
            currentPageComponent,
            
            // Methods
            navigateTo,
            handleUpdateTracks,
            handleUpdateSettings
        };
    },

    components: {
        DashboardPage,
        TracksPage,

    }
};

// App erstellen
createApp(App).mount('#app');