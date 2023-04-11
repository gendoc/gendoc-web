import {patchAccessToken} from "../api/documentApi";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DEVELOPER_KEY;

let tokenClient;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.file';



export function gapiLoaded() {

    window.gapi.load('client', initializeGapiClient);
}


/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
}

/**
 * Callback after Google Identity Services are loaded.
 */
export function gisLoaded() {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
}



/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(callback) {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        console.log(resp)
        localStorage.setItem("googleAccessToken",resp.access_token)

        callback(resp.access_token)

    };

    if (localStorage.getItem("googleAccessToken") === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }

}

export async function getGoogleAuthToken() {

    if (localStorage.getItem("googleAccessToken") === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        await tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        await tokenClient.requestAccessToken({prompt: ''});
    }

    return localStorage.getItem("googleAccessToken")

}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    const token = localStorage.getItem("googleAccessToken")
    if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token);
        window.gapi.client.setToken('');
    }
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
    let response;
    try {
        response = await window.gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name)',
        });
    } catch (err) {
        return;
    }
    const files = response.result.files;
    if (!files || files.length === 0) {
        return;
    }
    // Flatten to string to display
    const output = files.reduce(
        (str, file) => `${str}${file.name} (${file.id})\n`,
        'Files:\n');
}