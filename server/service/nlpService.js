const axios = require('axios');

async function postReadGuides(postReadGuidesRequest) {
        console.log(postReadGuidesRequest)

        try {
                const response = await axios.post(`http://3.39.75.150:8000/read_guides`,postReadGuidesRequest);

                return response.data
        } catch (error) {
                console.log('Error:', error.message);

                if (error.response) {
                        console.log('Request Details:');
                        console.log('URL:', error.response.config.url);
                        console.log('Method:', error.response.config.method);
                        console.log('Headers:', error.response.config.headers);
                        console.log('Data:', error.response.config.data);

                        console.log('Response Data:', error.response.data);
                }
        }

}

async function proofRead(proofReadRequest) {

        const response = await axios.post('http://3.39.75.150:8000/',proofReadRequest);
        return response.data

}



module.exports = {postReadGuides,proofRead
}