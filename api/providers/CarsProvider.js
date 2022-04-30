const axios = require("axios");
const CreateHTTPError = require("http-errors");
const lodash = require('lodash');

const BASE_URL = process.env.CAR_API_URL;
const API_KEY = process.env.CAR_API_KEY;
const SHORTNER_URL = process.env.SHORTNER_URL;
const SHORTNER_KEY = process.env.SHORTNER_KEY;

const instance = axios.create({
    baseURL: BASE_URL,
})
class CarsProvider {

    constructor () { 
    }

    fetchCar = async (vin, callback) => {
        try {
            const specs = await instance.get('/specs?key=' + API_KEY + '&vin=' + vin);

            const params = lodash.pick(specs.data.attributes, [
                'make',
                'model', 
                'year',
                'engine',
                'engine_cylinders',
                'style',
                'made_in',
                'fuel_capacity',
                'city_mileage',
                'highway_mileage',
                'retail_price',
                'transmission_short',
                'standard_seating',
                'manufacturer_suggested_retail_price'
            ]);

            // Fetch Car Image URL Then Shoreten it
            await this.fetchCarImages(
                specs.data.attributes.make,
                specs.data.attributes.model,
                specs.data.attributes.year
            ).then(async result => {
                const param = {url: result.data.images[0].link}

                const shortImgLink = await axios.post(`${SHORTNER_URL}/create`,JSON.stringify(param), {
                    headers: {
                        authorization: `Bearer ${SHORTNER_KEY}`,
                        'Content-Type': 'application/json'
                    }
                })
                const imgLink = shortImgLink.data.data.tiny_url;
                callback({...params, img: imgLink});
            });
                
        } catch(e){
            throw CreateHTTPError(404, e);
        }
    }

    carHistory = async (vin, callback) => {
        try {
            await instance.get('/history?key=' + API_KEY + '&vin=' + vin)
                .then(result => {
                    callback(result.data);
                })
        } catch(e){
            throw CreateHTTPError(404, 'No History Records Found');
        }
    }

    getMarketDetails = async (vin, callback) => {
        try {
            await instance.get('/marketvalue?key=' + API_KEY + '&vin=' + vin)
                .then(result => {
                    callback(result.data);
                })
        } catch(e){
            console.log(e)
        }
    }

    plateDecoder = async (plate, state, callback) => {
        try {
            await instance.get('/platedecoder?key=' + API_KEY + '&plate=' + plate + '&state=' + state)
                .then(result => {
                    callback(result.data);
                    console.log(result.data)
                })
        } catch(e){
            console.log(e)
        }
    }

    fetchCarImages = async (make, model, year) => {
        try {
            return instance.get(`/images?key=${API_KEY}&make=${make}&model=${model}&year=${year}&transparent=true`);
        } catch(e){
            console.log(e)
        }
    }

}

module.exports = CarsProvider