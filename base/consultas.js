const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "corey222",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 0 }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = page * limits;

    const formattedQuery = format(
        `SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s`,
        campo,
        direccion,
        limits,
        offset
    );

    const { rows: joyas } = await pool.query(formattedQuery);
    const { rows: [{ count }] } = await pool.query('SELECT count(*) FROM inventario;');
    const totalPages = Math.ceil(count / limits);

    return {
        joyas,
        totalPages
    };
}

const obtenerJoyasPorFiltros = async ({ precio_min, precio_max, categoria, metal }) => {
    const filtros = [];
    const values = [];

    if (precio_min) {
        filtros.push(`precio >= $${filtros.length + 1}`);
        values.push(precio_min);
    }
    if (precio_max) {
        filtros.push(`precio <= $${filtros.length + 1}`);
        values.push(precio_max);
    }
    if (categoria) {
        filtros.push(`categoria ILIKE $${filtros.length + 1}`);
        values.push(categoria);
    }
    if (metal) {
        filtros.push(`metal ILIKE $${filtros.length + 1}`);
        values.push(metal);
    }

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(" AND ")}`;
    }

    const { rows: joyas } = await pool.query(consulta, values);
    return joyas;
}

module.exports = { obtenerJoyas, obtenerJoyasPorFiltros };
