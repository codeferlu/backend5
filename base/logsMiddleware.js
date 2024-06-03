const HandleDatabaseLogs = (req, res, next) => {
    const time = new Date();
    const url = req.url;
    const queries = req.query;
    const params = req.params;

    console.log(
        `
        Hola Admin el día ${time} se ejecutó una consulta al servidor.\n
        Los datos son: \n
        URL:  --> ${url}\n
        Queries: --> ${JSON.stringify(queries)}\n
        Params: --> ${JSON.stringify(params)}\n 
        Saludos 👏👏;
        `
    );

    next();
}

module.exports = HandleDatabaseLogs;
