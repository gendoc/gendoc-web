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


    const guideDocuments = useSelector((state) => state.documentReducer.guideDocuments);
    const writtenDocuments = useSelector((state) => state.documentReducer.writtenDocuments);
    const loading = useSelector((state) => state.documentReducer.loading);

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





    return (
        <>
            <Helmet>
                <title> Dashboard | Minimal UI </title>
            </Helmet>

            <Container maxWidth="xl">

                {loading && <CenteredCircularProgress />}
                <Grid container spacing={3}>


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
