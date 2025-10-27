const ChartComponent = {
    template: `
        <div :id="chartId" :style="{ height: height + 'px', width: width }"></div>
    `,
    props: {
        options: Object,
        height: {
            type: Number,
            default: 400
        },
        width: {
            type: String,
            default: '100%'
        }
    },
    data() {
        return {
            chart: null,
            chartId: 'chart-' + Math.random().toString(36).substr(2, 9)
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.createChart();
        });
    },
    watch: {
        options: {
            handler(newOptions) {
                if (this.chart) {
                    try {
                        const cleanOptions = this.unwrapReactiveData(newOptions);
                        this.chart.update(cleanOptions);
                    } catch (error) {
                        // Fehler ignorieren
                        console.warn('Chart update warning:', error.message);
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        createChart() {
            if (typeof agCharts !== 'undefined') {
                try {
                    const container = document.getElementById(this.chartId);
                    if (!container) return;
                    
                    const cleanOptions = this.unwrapReactiveData(this.options);
                    this.chart = agCharts.AgCharts.create({
                        ...cleanOptions,
                        container: container
                    });
                } catch (error) {
                    console.error('Error creating chart:', error);
                }
            }
        },
        // Öffentliche Methode zum direkten Daten-Update
        setData(newData) {
            if (this.chart) {
                try {
                    const cleanData = JSON.parse(JSON.stringify(newData || []));
                    this.chart.update({
                        data: cleanData
                    });
                } catch (error) {
                    console.error('Error setting chart data:', error);
                }
            }
        },
        unwrapReactiveData(options) {
            if (!options) return {};
            try {
                return JSON.parse(JSON.stringify(options));
            } catch (error) {
                return options || {};
            }
        }
    },
    beforeUnmount() {
        this.chart = null;
    }
};