const https = require("https");
const { resolve } = require("path");
// get the API key for TMDB here
// In an ideal world, this would be in KMS somewhere
const apiKey = "e17f1bdb179fc9136546f2ea45022f2a";

/**
 * search - Requests a search result from the TMDB
 */
exports.search = async (event) => {
    
    const { httpMethod, path, pathParameters } = event;
    if (httpMethod !== 'GET') {
        throw new Error(`Invalid HTTP method!`);
    }

    console.log('received:', JSON.stringify(event));
    
    const { keywords } = pathParameters;

    const options = {
        host: 'api.themoviedb.org',
        path: 'search/movie/?api_key=' + apiKey + '&query=' + keywords,
        port: 443,
        method: 'GET'
    }
    let body = '';
    const request = await https.get(options, 
        function(res) {    
            res.on('data', chunk => {
                console.log(chunk)
                body += chunk;
            })
            res.on('end', () => {
                console.log(body)
                if (res.statusCode == 200) {
                    console.log(body);
                    resolve({
                        statusCode: 200,
                        body: JSON.stringify(JSON.parse(body), null, 4)
                    })
                } else {                    
                    reject({
                        statusCode: res.statusCode,
                        body: res.statusMessage
                    })
                }                
            })
            res.on('error', (e) => {
                console.log("Error : ", e)
                reject({            
                    statusCode: e.statusCode,
                    body: e.body
                })
            })
        })
         
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(body, null, 4),
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
