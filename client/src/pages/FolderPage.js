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
import {
    callGetGuideDocuments,
    callGetNoticeDocuments,
    callGetProjects,
    callGetWrittenDocuments,
    setModalOpen
} from "../modules/document";
import MyDocumentTable from "./MyDocumentTable";
import palette from "../theme/palette";
import Guide from "./Guide";
import MyProjectTable from "./MyProjectTable";
import MyFolderTable from "./MyFolderTable";
import {useParams} from "react-router-dom";

// ----------------------------------------------------------------------

export default function FolderPage(state) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const guideDocuments = useSelector((state) => state.documentReducer.guideDocuments);
    const noticeDocuments = useSelector((state) => state.documentReducer.noticeDocuments);
    const writtenDocuments = useSelector((state) => state.documentReducer.writtenDocuments);
    const params = useParams();
    const loading = useSelector((state) => state.documentReducer.loading);

    useEffect(() => {

       if (params.projectId!=null){
           const projectId = params.projectId
            dispatch(callGetGuideDocuments(projectId))
            dispatch(callGetNoticeDocuments(projectId))
            dispatch(callGetWrittenDocuments(projectId))
       }
    }, []);


    return (
        <>
            <Helmet>
                <title> Dashboard | Minimal UI </title>
            </Helmet>

            <Container maxWidth="xl">

                {loading && <CenteredCircularProgress />}
                <Grid container spacing={3}>


                    <>
                        <Paper sx={{ width: '100%', mb: 2 }} style={{marginTop:"10px",padding:"10px"}}>
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                variant="h6"
                                id="tableTitle"
                                component="div"
                            >
                                작성 가이드 문서
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
                                공고 가이드 문서
                            </Typography>
                            <MyDocumentTable documents={noticeDocuments}/>
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
                    </>



                </Grid>
            </Container>
        </>
    );
}
