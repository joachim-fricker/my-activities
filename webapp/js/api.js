// API Service für Backend-Kommunikation
const API_BASE_URL = 'http://localhost:3000/api'; // Ändere zu deinem Backend

const ApiService = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // year summary
    async getYearSummary() {
        return this.request('/yearSummary');
    },

    // TODO REMOVE
    async dummy() {
        return "dummy";
    },

    async getTrack(id) {
        return this.request(`/tracks/${id}`);
    },

    async createTrack(trackData) {
        return this.request('/tracks', {
            method: 'POST',
            body: JSON.stringify(trackData)
        });
    },


};

