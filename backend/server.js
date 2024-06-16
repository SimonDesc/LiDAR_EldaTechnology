// External library import
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// Internal module import
const transformCoordinates = require('./utils/transform_coordinate');

const app = express();
const PORT = 3000;

// Middleware CORS
app.use(cors())

// Database configuration
const pool = new Pool({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

// Server Starting
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// Route to fetch data from lidar_points table and transform coordinates to WGS 84
app.get('/data', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 100000;
		const result = await pool.query('SELECT geojson FROM lidar_points');
		const geojson = {
			type: "FeatureCollection",
			features: result.rows.slice(0, limit).map(row => {
				const parsedRow = JSON.parse(row.geojson);
				const coordinates = parsedRow.coordinates;
				const wgs84Coords = transformCoordinates(coordinates[0], coordinates[1]);
				return {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [wgs84Coords[0], wgs84Coords[1]]
					},
					properties: {
						elevation: coordinates[2]
					}
				};
			})
		};
		res.json(geojson);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error retrieving data');
	}
});
