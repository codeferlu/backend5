const express = require('express');
const HandleDatabaseLogs = require('./logsMiddleware');
const { obtenerJoyas, obtenerJoyasPorFiltros } = require('./consultas');

const app = express();
app.listen(3000, () => console.log('Server ON'));

const OrdenarDatos = (data) => {
    const stockTotal = data.reduce((stock, joya) => stock += joya.stock, 0);
    const totalJoyas = data.length;
    const results = data.map(joya => ({
        nombre: joya.nombre,
        link: `/api/joyas/${joya.id}`
    }));

    return { totalJoyas, stockTotal, results };
}

app.get('/joyas', HandleDatabaseLogs, async (req, res) => {
    try {
        const { limits, order_by, page } = req.query;
        const { joyas, totalPages } = await obtenerJoyas({ limits, order_by, page });
        const joyasHATEOAS = OrdenarDatos(joyas);
        joyasHATEOAS.totalPages = totalPages;
        res.json(joyasHATEOAS);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/joyas/filtros', HandleDatabaseLogs, async (req, res) => {
    try {
        const queryStrings = req.query;
        const joyas = await obtenerJoyasPorFiltros(queryStrings);
        const joyasHATEOAS = OrdenarDatos(joyas);
        res.json(joyasHATEOAS);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;
