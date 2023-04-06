import {Container, Grid, Modal, Typography} from "@mui/material";
import {AppWidgetSummary} from "../../../sections/@dashboard/app";
import React from "react";
import {uploadFileToS3} from "../../../utils/s3Client";
import {postGuideDocuments, postNoticeDocument, postWrittenDocument} from "../../../api/documentApi";
import {callGetGuideDocuments, callGetWrittenDocuments, setLoading} from "../../../modules/document";
import {gapiLoaded, gisLoaded, handleAuthClick} from "../../../pages/GapiClient";
import {useDispatch, useSelector} from "react-redux";
import newScript from "../../../utils/scriptReader";
import CenteredCircularProgress from "../../../components/progress/CenteredCircularProgress";
import Box from "@mui/material/Box";
import {Item} from "../../../pages/Guide";

export default function UploadModal(props){

    const dispatch = useDispatch();
    const guideFileInputRef = React.useRef(null);
    const noticeFileInputRef = React.useRef(null);
    const writtenFileInputRef = React.useRef(null);
    const loading = useSelector((state) => state.documentReducer.loading);



    const handleGuideFilesUpload = async (event) => {
        dispatch(setLoading(true))
        if (event.target.files.length == 0) {
            dispatch(setLoading(false));
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
            dispatch(setLoading(false));
        }



    };

    const handleNoticeFileUpload = async (event) => {
        dispatch(setLoading(true))
        if (event.target.files.length == 0) {
            dispatch(setLoading(false));
            return;
        }
        const file = event.target.files[0];
        let uploadSuccess = true
        const fileInfo = {}

            if (file.type === 'application/pdf') {
                try {
                    const fileKey = await uploadFileToS3(file);

                    fileInfo.fileName = file.name
                    fileInfo.fileKey = fileKey
                } catch (err) {
                    console.log('Error uploading file:', file.name);
                    uploadSuccess = false
                }
            } else {
                console.log('Invalid file type:', file.name);
                uploadSuccess = false
            }


        try {
            if (uploadSuccess){
                await postNoticeDocument({file:fileInfo})
            }
        }catch (e) {
            uploadSuccess = false

        }finally {
            if (!uploadSuccess){
                alert("업로드 실패")
            }
            dispatch(setLoading(false));
        }



    };

    const handleWrittenFileUpload = async (event) => {
        dispatch(setLoading(true))
        if (event.target.files.length==0){
            dispatch(setLoading(false))
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


        dispatch(setLoading(false))
    };

    const handleGuideFilesUploadButtonClick = () => {
        guideFileInputRef.current.click();
    };

    const handleNoticeFileUploadButtonClick = () => {
        noticeFileInputRef.current.click();
    };

    const handleWrittenFileUploadButtonClick = async (e) => {
        dispatch(setLoading(true))
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
        dispatch(setLoading(false))
    };

    return(
        <Modal {...props} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <div>
                <div style={{backgroundColor:"#E9EEFE", borderRadius: "14px",paddingInline:"30px", paddingBlock:"60px"
                }}>


                    <div style={{display:"flex",flexDirection:"column",flexWrap:"wrap"}}>
                        {loading && <CenteredCircularProgress />}

                        <div style={{display:"flex"}}>
                            <Typography
                                id="tableTitle"
                                component="div"
                                fontSize={"20px"}
                                style={{marginRight:"6px",fontWeight:"bold"}}
                            >
                                새 프로젝트
                            </Typography>

                            <Typography
                                id="tableTitle"
                                component="div"
                                fontSize={"20px"}
                            >
                                (New DOC)
                            </Typography>
                        </div>


                        <Grid   container style={{display:"flex",justifyContent:"center"}}>

                            <Grid item style={{ height: '100%', width: '100%'}}  >
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'background.default',
                                        display: 'grid',
                                        gridTemplateColumns: { md: '1fr' },
                                        gap: 2,
                                        alignContent: 'stretch'
                                    }}
                                    style={{background:"#E9EEFE"}}
                                >

                                    <Item key={"공고 가이드 PDF 문서"} style={{
                                        display: "flex",
                                        height:"60px",width:"272px",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer"
                                    }}
                                          onClick={handleNoticeFileUploadButtonClick}
                                    >

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            style={{display: 'none'}}
                                            ref={noticeFileInputRef}
                                            onChange={handleNoticeFileUpload}
                                        />

                                        <Typography style={{whiteSpace: 'pre-wrap'}}
                                                    fontSize={"17px"}
                                                    color={"black"}
                                                    style={{marginRight:"6px"}}>
                                            {"공고 가이드 PDF 문서"}
                                        </Typography>

                                    </Item>



                                    <Item key={ "작성 가이드 문서"} style={{
                                        display: "flex",
                                        height:"60px",width:"272px",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer"
                                    }}
                                          onClick={handleGuideFilesUploadButtonClick}
                                    >

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            style={{display: 'none'}}
                                            ref={guideFileInputRef}
                                            onChange={handleGuideFilesUpload}
                                        />

                                        <Typography style={{whiteSpace: 'pre-wrap'}}
                                                    fontSize={"17px"}
                                                    color={"black"}
                                                    style={{marginRight:"6px"}}>
                                            { "작성 가이드 문서"}
                                        </Typography>

                                    </Item>

                                    <Item key={"작성한 Word 문서"} style={{
                                        display: "flex",
                                        height:"60px",width:"272px",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer"
                                    }}
                                          onClick={handleWrittenFileUploadButtonClick}
                                    >

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            style={{display: 'none'}}
                                            ref={writtenFileInputRef}
                                            onChange={handleWrittenFileUpload}
                                        />

                                        <Typography style={{whiteSpace: 'pre-wrap'}}
                                                    fontSize={"17px"}
                                                    color={"black"}
                                                    style={{marginRight:"6px"}}>
                                            {"작성한 Word 문서"}
                                        </Typography>

                                    </Item>


                                </Box>
                            </Grid>

                        </Grid>

                    </div>

                </div>
            </div>
        </Modal>
    )
}