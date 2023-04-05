import React, {useEffect} from "react";
import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, IconButton, Button, Paper} from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppWidgetSummary,
    AppCurrentSubject,
    AppConversionRates,
} from '../sections/@dashboard/app';
import {gapiLoaded, getGoogleAuthToken, gisLoaded, handleAuthClick, handleSignoutClick} from "./GapiClient";
import newScript from "../utils/scriptReader";
import {uploadFileToS3} from "../utils/s3Client";
import CenteredCircularProgress from "../components/progress/CenteredCircularProgress";
import {getGuideDocuments, postGuideDocuments, postWrittenDocument} from "../api/documentApi";
import {useDispatch, useSelector} from "react-redux";
import {callGetGuideDocuments, callGetWrittenDocuments} from "../modules/document";
import MyDocumentTable from "./MyDocumentTable";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const guideFileInputRef = React.useRef(null);
    const writtenFileInputRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);

    const guideDocuments = useSelector((state) => state.documentReducer.guideDocuments);
    const writtenDocuments = useSelector((state) => state.documentReducer.writtenDocuments);

    useEffect( () => {
        newScript("https://apis.google.com/js/api.js").then(function() {
            gapiLoaded()
        })
        newScript("https://accounts.google.com/gsi/client").then(function() {
            gisLoaded()
        })
        dispatch(callGetGuideDocuments())
        dispatch(callGetWrittenDocuments())
    }, [])



    const handleGuideFilesUpload = async (event) => {
        setLoading(true);
        if (event.target.files.length == 0) {
            setLoading(false);
            return;
        }
        const files = event.target.files;
        const fileInfos = []
        let uploadSuccess = true
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type === 'application/pdf') {
                try {
                    const fileKey = await uploadFileToS3(file);
                    const fileInfo = {}
                    fileInfo.fileName = file.name
                    fileInfo.fileKey = fileKey
                    fileInfos.push(fileInfo)
                } catch (err) {
                    console.log('Error uploading file:', file.name);
                    uploadSuccess = false
                    break
                }
            } else {
                console.log('Invalid file type:', file.name);
                uploadSuccess = false
                break
            }
        }

        try {
            if (uploadSuccess){
                await postGuideDocuments({files:fileInfos})
                dispatch(callGetGuideDocuments())
            }
        }catch (e) {
            uploadSuccess = false

        }finally {
            if (!uploadSuccess){
                alert("업로드 실패")
            }
            setLoading(false);
        }



    };

    const handleWrittenFileUpload = async (event) => {
        setLoading(true)
        if (event.target.files.length==0){
            setLoading(false)
            return
        }
        const file = event.target.files[0];
        const accessToken = window.gapi.client.getToken().access_token;

        // Set the metadata for the file, including the desired mimeType for the Google Document
        const metadata = {
            name: file.name,
            mimeType: "application/vnd.google-apps.document",
        };

        // Convert the metadata object to a JSON string
        const metadataJSON = JSON.stringify(metadata);

        // Create a Blob object for the metadata
        const metadataBlob = new Blob([metadataJSON], {
            type: "application/json; charset=UTF-8",
        });

        // Create a FormData object to hold the metadata and file content
        const formData = new FormData();
        formData.append("metadata", metadataBlob);
        formData.append("file", file);

        // Set the appropriate request headers
        const requestHeaders = new Headers();
        requestHeaders.append("Authorization", `Bearer ${accessToken}`);

        try {
            // Send the request to the Google Drive API
            const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
                method: "POST",
                headers: requestHeaders,
                body: formData,
            });

            // Parse the response JSON and return the file ID
            const responseData = await response.json();
            console.log(responseData);
            await postWrittenDocument({file:{fileName:file.name,documentId:responseData.id}})
            dispatch(callGetWrittenDocuments())
        }catch (e) {
            console.log(e)
            alert("업로드 실패")
        }


        setLoading(false)
    };

    const handleGuideFilesUploadButtonClick = () => {
        guideFileInputRef.current.click();
    };

    const handleWrittenFileUploadButtonClick = async (e) => {
        setLoading(true)
        if (window.gapi.client.getToken() == null) {
            handleAuthClick()
        } else {
            const accessToken = window.gapi.client.getToken().access_token;
            const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;

            const response = await fetch(url);
            if (response.ok) {
                writtenFileInputRef.current.click();
            } else {
                handleAuthClick()
            }



        }
        setLoading(false)
    };

    return (
        <>
            <Helmet>
                <title> Dashboard | Minimal UI </title>
            </Helmet>

            <Container maxWidth="xl">

                {/*{guideDocuments.map((document)=>{*/}
                {/*    return(*/}
                {/*        <b>{document.fileName}<br/></b>*/}
                {/*    )*/}

                {/*})}*/}
                {/*{writtenDocuments.map((document)=>{*/}
                {/*    return(*/}
                {/*        <b>{document.fileName}<br/></b>*/}
                {/*        )*/}

                {/*})}*/}
                {loading && <CenteredCircularProgress />}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3} style={{cursor:"pointer"}} >
                        <input
                            type="file"
                            id="pdfUploader"
                            accept=".pdf"
                            multiple
                            style={{display: 'none'}}
                            ref={guideFileInputRef}
                            onChange={handleGuideFilesUpload}
                        />
                        <AppWidgetSummary onClick={handleGuideFilesUploadButtonClick} title="가이드 문서 업로드" icon={'ant-design:android-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} style={{cursor:"pointer"}} >
                        <input
                            type="file"
                            id="pdfUploader"
                            accept=".docx"
                            style={{display: 'none'}}
                            ref={writtenFileInputRef}
                            onChange={handleWrittenFileUpload}
                        />
                        <AppWidgetSummary onClick={handleWrittenFileUploadButtonClick} title="작성 문서 업로드" color="info" icon={'ant-design:apple-filled'}/>
                    </Grid>

                    <Paper sx={{ width: '100%', mb: 2 }} style={{marginTop:"10px",padding:"10px"}}>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            가이드 문서
                        </Typography>
                        <MyDocumentTable documents={guideDocuments}/>
                    </Paper>

                    <Paper sx={{ width: '100%', mb: 2 }} style={{marginTop:"10px",padding:"10px"}}>
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            첨삭 문서
                        </Typography>
                        <MyDocumentTable documents={writtenDocuments}/>
                    </Paper>

                </Grid>
            </Container>
        </>
    );
}
