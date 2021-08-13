const https = require("https")
// get the API key for TMDB here
const apiKey = "e17f1bdb179fc9136546f2ea45022f2a"
/**
 * Gets the details for a given movie from TMDB.
 * @movieID - The ID of the movie to retrieve.
 */
exports.movieDetails = async (event) => {
    const { httpMethod, path, pathParameters } = event
    if (httpMethod !== 'GET') {
        throw new Error(`Invalid HTTP Method!`)
    }

    console.log('received:', JSON.stringify(event))

    // Get the movie ID to look for
    const { movieID } = pathParameters;
    const options = {
        host: 'api.themoviedb.org',
        path: 'search/movie/' + movieID + '?api_key=' + apiKey,
        port: 443,
        method: 'GET'
    }

    let body = ''
    
    const request = await https.get(options, 
        function(res) {    
            res.on('data', chunk => {
                body += chunk;
            })
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify(JSON.parse(body), null, 4)
                })
            })

            res.on('error', (e) => {
                reject({            
                    statusCode: 500,
                    body: 'Error : ' + e
                })
            })
        })
        

    const response = {
        statusCode: 200,
        request,
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`)
    return response
};
