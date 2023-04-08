const { google } = require('googleapis');

const path = require('path');

// Create a new JWT client using the credentials and scope
const auth = new google.auth.JWT(
    "36938426274-2675ovkp09h7knif802s9a4hblt56rge.apps.googleusercontent.com",
    null,
    "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",
    ['https://www.googleapis.com/auth/documents']
);


// Authorize the client and make a request to the Google Docs API
auth.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }

    const docs = google.docs({ version: 'v1', auth });
    docs.documents.get({ documentId: '1xH4_gMf9yAQUxmYxlFWwwbKK551HRYmZ4blUrnJb-ts' }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(res.data);
    });
});