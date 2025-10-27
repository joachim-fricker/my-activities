// API Service für Backend-Kommunikation 

const API_BASE_URL = 'http://localhost:3000/api';

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


    async getYearSummary() {
        return this.request('/yearSummary');
    },

    async getSummary() {
        return this.request('/summary');
    },

    async getAllTracks() {
        return this.request('/allTracks');
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

