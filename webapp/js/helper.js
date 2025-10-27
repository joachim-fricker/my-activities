const useHelpers = () => {
    const formatTime = (sekunden) => {
        if (!sekunden && sekunden !== 0) return '0:00:00';
        
        const seconds = Math.floor( sekunden );
        const stunden = Math.floor(seconds / 3600);
        const minuten = Math.floor((seconds % 3600) / 60);
        const sekundenRest = seconds % 60;
        
        return `${stunden}:${minuten.toString().padStart(2, '0')}:${sekundenRest.toString().padStart(2, '0')}`;
    };
    
    // Weitere Helper-Funktionen können hier hinzugefügt werden
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('de-DE');
    };
    
    const formatNumber = (number) => {
        if (!number && number !== 0) return '0.00';
        return new Intl.NumberFormat('de-CH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    };

    return {
        formatTime,
        formatNumber,
        formatDate
    };
};