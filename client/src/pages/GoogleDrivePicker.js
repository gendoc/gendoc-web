import  { useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'


const GoogleDrivePicker = () => {
    const [openPicker, authResponse] = useDrivePicker();
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const handleOpenPicker = () => {
        openPicker({
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            developerKey: process.env.REACT_APP_GOOGLE_DEVELOPER_KEY,
            viewId: "DOCUMENTS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                }
            },
        })
    }



    return (
        <div>
            <button onClick={() => handleOpenPicker()}>Open Picker</button>
        </div>
    );
}

export default GoogleDrivePicker;