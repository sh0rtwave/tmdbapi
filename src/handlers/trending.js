const https = require("https")
// get the API key for TMDB here
const apiKey = "e17f1bdb179fc9136546f2ea45022f2a"

/**
 * Gets the list of trending movies for the day from TMDB
 */
exports.trending = async (event) => {
    const { httpMethod, path } = event
    if (httpMethod !== 'GET') {

        throw new Error(`Invalid HTTP Method!`)
    }
    
    console.log('received:', JSON.stringify(event))

    const options = {
        host: 'api.themoviedb.org',
        path: 'trending/movie/day?api_key=' + apiKey,
        port: 443,
        method: 'GET'
    }

    let body = ''

    const request = await https.get(options, 
        function(res) {    
            res.on('data', chunk => {
                console.log(chunk) 
                body += chunk;
            })
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(JSON.parse(body), null, 4)
            })
            res.on('error', (e) => {
                reject({            
                    statusCode: 500,
                    body: 'Error : ' + e
                })
            })
        })
    })
     
    const response = {
        statusCode: 200,
        body: JSON.stringify(body, null, 4),
    }

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`)

    return response;
};
