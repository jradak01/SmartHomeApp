const setupWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
        console.log('Povezan na WebSocket server');
        ws.send('Mounted')
    };

    ws.onmessage = (event) => {
        console.log('Primljena poruka od servera:', event.data);
        // Ovdje možete ažurirati stanje komponente ili izvršiti odgovarajuće radnje
    };

    ws.onerror = (error) => {
        console.log('Greška pri WebSocket vezi:', error);
    };

    return ws;
};

export default setupWebSocket;