const dotenv = require('dotenv')
dotenv.config()

const geoURL = async(latitud, longitud) => 'http://www.mapquestapi.com/geocoding/v1/reverse?key='+process.env.GEO_KEY+'&location='+latitud+','+longitud

module.exports = { geoURL }