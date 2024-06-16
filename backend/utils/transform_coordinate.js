const proj4 = require('proj4');

// Definition of coordinate systems
proj4.defs([
	['EPSG:2154', '+proj=lcc +lat_1=49.000000000 +lat_2=44.000000000 +lat_0=46.500000000 +lon_0=3.000000000 +x_0=700000.000 +y_0=6600000.000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'],
	['EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs']
]);

// Function to transform coordinates
// lambert9 to WGS84
function transformCoordinates(x, y) {
	return proj4('EPSG:2154', 'EPSG:4326', [x, y]);
}


module.exports = transformCoordinates;
