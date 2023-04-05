import React, {useEffect} from "react";
import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, IconButton, Button} from '@mui/material';
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
import GoogleDrivePicker from "./GoogleDrivePicker";
import {gapiLoaded, getGoogleAuthToken, gisLoaded, handleAuthClick, handleSignoutClick} from "./GapiClient";
import newScript from "../utils/scriptReader";
import {uploadFileToS3} from "../utils/s3Client";
import CenteredCircularProgress from "../components/progress/CenteredCircularProgress";
import {postGuideDocuments, postWrittenDocument} from "../api/documentApi";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
    const theme = useTheme();

    const guideFileInputRef = React.useRef(null);
    const writtenFileInputRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        newScript("https://apis.google.com/js/api.js").then(function() {
            gapiLoaded()
        })
        newScript("https://accounts.google.com/gsi/client").then(function() {
            gisLoaded()
        })



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


                    {/*<Grid item xs={12} md={6} lg={8}>*/}
                    {/*    <AppWebsiteVisits*/}
                    {/*        title="Website Visits"*/}
                    {/*        subheader="(+43%) than last year"*/}
                    {/*        chartLabels={[*/}
                    {/*            '01/01/2003',*/}
                    {/*            '02/01/2003',*/}
                    {/*            '03/01/2003',*/}
                    {/*            '04/01/2003',*/}
                    {/*            '05/01/2003',*/}
                    {/*            '06/01/2003',*/}
                    {/*            '07/01/2003',*/}
                    {/*            '08/01/2003',*/}
                    {/*            '09/01/2003',*/}
                    {/*            '10/01/2003',*/}
                    {/*            '11/01/2003',*/}
                    {/*        ]}*/}
                    {/*        chartData={[*/}
                    {/*            {*/}
                    {/*                name: 'Team A',*/}
                    {/*                type: 'column',*/}
                    {/*                fill: 'solid',*/}
                    {/*                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],*/}
                    {/*            },*/}
                    {/*            {*/}
                    {/*                name: 'Team B',*/}
                    {/*                type: 'area',*/}
                    {/*                fill: 'gradient',*/}
                    {/*                data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],*/}
                    {/*            },*/}
                    {/*            {*/}
                    {/*                name: 'Team C',*/}
                    {/*                type: 'line',*/}
                    {/*                fill: 'solid',*/}
                    {/*                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],*/}
                    {/*            },*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={4}>*/}
                    {/*    <AppCurrentVisits*/}
                    {/*        title="Current Visits"*/}
                    {/*        chartData={[*/}
                    {/*            {label: 'America', value: 4344},*/}
                    {/*            {label: 'Asia', value: 5435},*/}
                    {/*            {label: 'Europe', value: 1443},*/}
                    {/*            {label: 'Africa', value: 4443},*/}
                    {/*        ]}*/}
                    {/*        chartColors={[*/}
                    {/*            theme.palette.primary.main,*/}
                    {/*            theme.palette.info.main,*/}
                    {/*            theme.palette.warning.main,*/}
                    {/*            theme.palette.error.main,*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={8}>*/}
                    {/*    <AppConversionRates*/}
                    {/*        title="Conversion Rates"*/}
                    {/*        subheader="(+43%) than last year"*/}
                    {/*        chartData={[*/}
                    {/*            {label: 'Italy', value: 400},*/}
                    {/*            {label: 'Japan', value: 430},*/}
                    {/*            {label: 'China', value: 448},*/}
                    {/*            {label: 'Canada', value: 470},*/}
                    {/*            {label: 'France', value: 540},*/}
                    {/*            {label: 'Germany', value: 580},*/}
                    {/*            {label: 'South Korea', value: 690},*/}
                    {/*            {label: 'Netherlands', value: 1100},*/}
                    {/*            {label: 'United States', value: 1200},*/}
                    {/*            {label: 'United Kingdom', value: 1380},*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={4}>*/}
                    {/*    <AppCurrentSubject*/}
                    {/*        title="Current Subject"*/}
                    {/*        chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}*/}
                    {/*        chartData={[*/}
                    {/*            {name: 'Series 1', data: [80, 50, 30, 40, 100, 20]},*/}
                    {/*            {name: 'Series 2', data: [20, 30, 40, 80, 20, 80]},*/}
                    {/*            {name: 'Series 3', data: [44, 76, 78, 13, 43, 10]},*/}
                    {/*        ]}*/}
                    {/*        chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={8}>*/}
                    {/*    <AppNewsUpdate*/}
                    {/*        title="News Update"*/}
                    {/*        list={[...Array(5)].map((_, index) => ({*/}
                    {/*            id: faker.datatype.uuid(),*/}
                    {/*            title: faker.name.jobTitle(),*/}
                    {/*            description: faker.name.jobTitle(),*/}
                    {/*            image: `/assets/images/covers/cover_${index + 1}.jpg`,*/}
                    {/*            postedAt: faker.date.recent(),*/}
                    {/*        }))}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={4}>*/}
                    {/*    <AppOrderTimeline*/}
                    {/*        title="Order Timeline"*/}
                    {/*        list={[...Array(5)].map((_, index) => ({*/}
                    {/*            id: faker.datatype.uuid(),*/}
                    {/*            title: [*/}
                    {/*                '1983, orders, $4220',*/}
                    {/*                '12 Invoices have been paid',*/}
                    {/*                'Order #37745 from September',*/}
                    {/*                'New order placed #XF-2356',*/}
                    {/*                'New order placed #XF-2346',*/}
                    {/*            ][index],*/}
                    {/*            type: `order${index + 1}`,*/}
                    {/*            time: faker.date.past(),*/}
                    {/*        }))}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={4}>*/}
                    {/*    <AppTrafficBySite*/}
                    {/*        title="Traffic by Site"*/}
                    {/*        list={[*/}
                    {/*            {*/}
                    {/*                name: 'FaceBook',*/}
                    {/*                value: 323234,*/}
                    {/*                icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32}/>,*/}
                    {/*            },*/}
                    {/*            {*/}
                    {/*                name: 'Google',*/}
                    {/*                value: 341212,*/}
                    {/*                icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32}/>,*/}
                    {/*            },*/}
                    {/*            {*/}
                    {/*                name: 'Linkedin',*/}
                    {/*                value: 411213,*/}
                    {/*                icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32}/>,*/}
                    {/*            },*/}
                    {/*            {*/}
                    {/*                name: 'Twitter',*/}
                    {/*                value: 443232,*/}
                    {/*                icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32}/>,*/}
                    {/*            },*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid item xs={12} md={6} lg={8}>*/}
                    {/*    <AppTasks*/}
                    {/*        title="Tasks"*/}
                    {/*        list={[*/}
                    {/*            {id: '1', label: 'Create FireStone Logo'},*/}
                    {/*            {id: '2', label: 'Add SCSS and JS files if required'},*/}
                    {/*            {id: '3', label: 'Stakeholder Meeting'},*/}
                    {/*            {id: '4', label: 'Scoping & Estimations'},*/}
                    {/*            {id: '5', label: 'Sprint Showcase'},*/}
                    {/*        ]}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                </Grid>
            </Container>
        </>
    );
}
