const axios = require('axios');

async function postReadGuides(postReadGuidesRequest) {

        const response = await axios.post('http://3.39.75.150:8000/read_guides',postReadGuidesRequest);
        return response.data

}

async function proofRead(proofReadRequest) {

        const response = await axios.post('http://3.39.75.150:8000/',proofReadRequest);
        return response.data

}



module.exports = {postReadGuides,proofRead
}