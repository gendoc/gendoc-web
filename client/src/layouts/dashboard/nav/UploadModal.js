import {Button, Container, Grid, Modal, Typography} from "@mui/material";
import {AppWidgetSummary} from "../../../sections/@dashboard/app";
import React, {useEffect, useState} from "react";
import {uploadFileToS3} from "../../../utils/s3Client";
import {
    patchAccessToken,
    postGuideDocuments,
    postNoticeDocument,
    postWrittenDocument,
    uploadFinish
} from "../../../api/documentApi";
import {
    callGetGuideDocuments,
    callGetProjects,
    callGetWrittenDocuments,
    setLoading,
    setModalOpen
} from "../../../modules/document";
import {gapiLoaded, gisLoaded, handleAuthClick} from "../../../pages/GapiClient";
import {useDispatch, useSelector} from "react-redux";
import newScript from "../../../utils/scriptReader";
import CenteredCircularProgress from "../../../components/progress/CenteredCircularProgress";
import Box from "@mui/material/Box";
import {Item} from "../../../pages/Guide";
import {getProjects, postProject} from "../../../api/projectApi";


export default function UploadModal(props){

    const dispatch = useDispatch();
    const guideFileInputRef = React.useRef(null);
    const noticeFileInputRef = React.useRef(null);
    const writtenFileInputRef = React.useRef(null);
    const loading = useSelector((state) => state.documentReducer.loading);

    const [selectedFiles, setSelectedFiles] = useState({noticeFile:[],guideFile:[],writtenFile:[]});

    useEffect(() => {
        if (props.open){
            setSelectedFiles({noticeFile:[],guideFile:[],writtenFile:[]})
        }
    }, [props.open]);

    useEffect(() => {
        if (loading){
            document.body.classList.add('no-pointer-events');
        }else {
            document.body.classList.remove('no-pointer-events');
        }
    }, [loading]);

    const handleUploadFilesButton = async () => {
        if (validateFiles()){
            if (localStorage.getItem("googleAccessToken") == null) {
                handleAuthClick(uploadFiles)
            } else {
                const accessToken = localStorage.getItem("googleAccessToken");
                const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;

                const response = await fetch(url);
                if (response.ok) {
                    uploadFiles(accessToken)
                }else{
                    handleAuthClick(uploadFiles)
                }


            }
        }
    }


    const uploadFiles = async (access_token) => {
        dispatch(setLoading(true))
        let projectId
        try {
            console.log("uploadFiles token :"+access_token)
            if (access_token!=null){
                await patchAccessToken({accessToken:access_token})
            }
            const res = await postProject({projectName: selectedFiles.writtenFile[0].name})
            projectId = res.data.projectId
            console.log("projectId: "+projectId)
            await uploadGuideFiles(selectedFiles.guideFile,projectId)
            await uploadNoticeFile(selectedFiles.noticeFile[0],projectId)
            await uploadWrittenFile(selectedFiles.writtenFile[0],projectId)
        }catch (e) {
            console.log(e)
        }finally {
            dispatch(setModalOpen(false))
            dispatch(setLoading(false))
            dispatch(callGetProjects())
            console.log("uploadFinish projectId: "+projectId)
            uploadFinish(projectId)
        }

    }


    const validateFiles = () => {
        for (const prop in selectedFiles){
            if(selectedFiles[prop].length==0){
                switch(prop) {
                    case "noticeFile":
                        alert("모집 공고문 문서를 업로드해 주세요")
                        break;
                    case "writtenFile":
                        alert("작성한 Word 문서를 업로드해 주세요")
                        break;
                    default:
                        continue

                }
                return false
            }
        }
        return true
    }

    const uploadGuideFiles = async (files,projectId) => {
        if (files.length==0){
            return
        }
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
            if (uploadSuccess) {
                await postGuideDocuments({files: fileInfos,projectId:projectId})
            }
        } catch (e) {
            uploadSuccess = false

        } finally {
            if (!uploadSuccess) {
                alert("전문가 작성 가이드 업로드 실패")
            }
        }
    }

    const uploadNoticeFile = async (file,projectId) => {
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
            if (uploadSuccess) {
                await postNoticeDocument({file: fileInfo,projectId:projectId})
            }
        } catch (e) {
            uploadSuccess = false

        } finally {
            if (!uploadSuccess) {
                alert("모집 공고문 문서 업로드 실패")
            }
        }
    }

    const uploadWrittenFile = async (file,projectId) => {
        const accessToken = localStorage.getItem("googleAccessToken")

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
            await postWrittenDocument({file:{fileName:file.name,documentId:responseData.id},projectId:projectId})
        }catch (e) {
            console.log(e)
            alert("작성한 Word 문서 업로드 실패")
        }

    }


    const handleGuideFilesUpload = async (event) => {

        if (event.target.files.length == 0) {
            dispatch(setLoading(false));
            return;
        }
        const files = event.target.files;

        ////////////////////////////////////////////////////
        const fileList = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            fileList.push(file)
        }
         setSelectedFiles(prevState => ({
             ...prevState,
             guideFile: fileList
         }));
        ////////////////////////////////////////////////////

    };
    
    

    const handleNoticeFileUpload = async (event) => {

        if (event.target.files.length == 0) {
            dispatch(setLoading(false));
            return;
        }
        const file = event.target.files[0];
        ////////////////////////////////////////////////////
        const fileList = []
        fileList.push(file)
        setSelectedFiles(prevState => ({
            ...prevState,
            noticeFile: fileList
        }));
        ////////////////////////////////////////////////////
    };

    const handleWrittenFileUpload = async (event) => {

        if (event.target.files.length==0){
            dispatch(setLoading(false))
            return
        }
        const file = event.target.files[0];
        ////////////////////////////////////////////////////
        const fileList = []
        fileList.push(file)
        selectedFiles.writtenFile = fileList
        setSelectedFiles(prevState => ({
            ...prevState,
            writtenFile: fileList
        }));
        ////////////////////////////////////////////////////

    };

    const handleGuideFilesUploadButtonClick = () => {
        guideFileInputRef.current.click();
    };

    const handleNoticeFileUploadButtonClick = () => {
        noticeFileInputRef.current.click();
    };

    const handleWrittenFileUploadButtonClick = async (e) => {

        writtenFileInputRef.current.click();
    };

    return(
        <Modal {...props} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <div>
                <div style={{backgroundColor:"#E9EEFE", borderRadius: "14px",paddingInline:"30px", paddingBlock:"60px"
                }}>


                    <div style={{display:"flex",flexDirection:"column",flexWrap:"wrap"}}>
                        {loading && <CenteredCircularProgress />}

                        <div style={{display:"flex",justifyContent:"center"}}>
                            <Typography
                                id="tableTitle"
                                component="div"
                                fontSize={"25px"}
                                style={{marginRight:"6px",fontWeight:"bold"}}
                            >
                                새 프로젝트
                            </Typography>

                            <Typography
                                id="tableTitle"
                                component="div"
                                fontSize={"25px"}
                            >
                                (New DOC)
                            </Typography>
                        </div>


                        <Grid   container style={{display:"flex",justifyContent:"center"}}>

                            <Grid item style={{minHeight:"150px", height: '100%', width: '100%'}}  >
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

                                    <Item key={"모집 공고문 문서"} style={{
                                        display: "flex",
                                        minHeight:"60px",width:"272px",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer", flexDirection:"column",
                                    }}
                                          onClick={handleNoticeFileUploadButtonClick}
                                    >
                                        {selectedFiles.noticeFile.length==0&&

                                            <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",paddingInline:"30px"}}>

                                                <div style={{flexDirection:"column"}}>
                                                    <Typography style={{whiteSpace: 'pre-wrap'}}
                                                                fontSize={"17px"}
                                                                color={"black"}
                                                                style={{marginRight:"6px"}}>
                                                        {"모집 공고문 문서"}
                                                    </Typography>
                                                    <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                                fontSize={"12px"}
                                                                color={"#C55454"}
                                                                style={{marginRight:"6px"}}>
                                                        {"(PDF / 1개 제한 / 필수)"}
                                                    </Typography>
                                                </div>
                                                <img style={{}} width={"30px"} src="/assets/images/custom/pdf.png" />

                                            </div>

                                        }



                                        <input
                                            type="file"
                                            accept=".pdf"
                                            style={{display: 'none'}}
                                            ref={noticeFileInputRef}
                                            onChange={handleNoticeFileUpload}
                                        />

                                        {selectedFiles.noticeFile.map((file,index)=>(
                                            <span>
                                                 <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                             fontSize={"12px"}
                                                             color={"black"}
                                                             style={{marginRight:"6px"}}>
                                                {`${index+1}. ${file.name}`}
                                            </Typography>
                                            </span>

                                        ))}


                                    </Item>



                                    <Item key={ "전문가 작성 가이드"} style={{
                                        display: "flex",
                                        minHeight:"60px",width:"272px",height:"100%",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer", flexDirection:"column"
                                    }}
                                          onClick={handleGuideFilesUploadButtonClick}
                                    >

                                        {selectedFiles.guideFile.length==0&&
                                            <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",paddingInline:"30px"}}>

                                                <div style={{flexDirection:"column"}}>
                                                    <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                                fontSize={"17px"}
                                                                color={"black"}
                                                                style={{marginRight:"6px"}}>
                                                        { "전문가 작성 가이드"}
                                                    </Typography>
                                                    <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                                fontSize={"12px"}
                                                                color={"#C55454"}
                                                                style={{marginRight:"6px"}}>
                                                        {"(PDF / 제한 없음 / 선택)"}
                                                    </Typography>
                                                </div>
                                                <img style={{}} width={"30px"} src="/assets/images/custom/pdf.png" />

                                            </div>

                                        }

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            multiple
                                            style={{display: 'none'}}
                                            ref={guideFileInputRef}
                                            onChange={handleGuideFilesUpload}
                                        />



                                        {selectedFiles.guideFile.map((file,index)=>(
                                            <Typography style={{whiteSpace: 'pre-wrap'}}
                                                        fontSize={"12px"}
                                                        color={"black"}
                                                        style={{marginRight:"6px"}}>
                                                {`${index+1}. ${file.name}`}
                                            </Typography>
                                        ))}

                                    </Item>

                                    <Item key={"작성한 Word 문서"} style={{
                                        display: "flex",
                                        minHeight:"60px",width:"272px",borderRadius:"17px",
                                        paddingBlock:"5px",paddingInline:"14px",textAlign:"center",justifyContent:"center",
                                        justifySelf:"center", alignItems:"center", cursor:"pointer", flexDirection:"column"
                                    }}
                                          onClick={handleWrittenFileUploadButtonClick}
                                    >

                                        {selectedFiles.writtenFile.length==0&&
                                            <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",paddingInline:"30px"}}>
                                                <div style={{flexDirection:"column"}}>
                                                    <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                                fontSize={"17px"}
                                                                color={"black"}
                                                                style={{marginRight:"6px"}}>
                                                        {"작성한 Word 문서"}
                                                    </Typography>
                                                    <Typography style={{whiteSpace: 'pre-wrap',textAlign:"left"}}
                                                                fontSize={"12px"}
                                                                color={"#C55454"}
                                                                style={{marginRight:"6px"}}>
                                                        {"(1개만 업로드 가능 / 필수)"}
                                                    </Typography>
                                                </div>
                                                <img style={{}} width={"30px"} src="/assets/images/custom/docx.png" />

                                            </div>
                                        }

                                        <input
                                            type="file"
                                            accept=".docx"
                                            multiple
                                            style={{display: 'none'}}
                                            ref={writtenFileInputRef}
                                            onChange={handleWrittenFileUpload}
                                        />



                                        {selectedFiles.writtenFile.map((file,index)=>(
                                            <Typography style={{whiteSpace: 'pre-wrap'}}
                                                        fontSize={"12px"}
                                                        color={"black"}
                                                        style={{marginRight:"6px"}}>
                                                {`${index+1}. ${file.name}`}
                                            </Typography>
                                        ))}
                                    </Item>


                                </Box>
                            </Grid>

                        </Grid>
                        <Button style={{color:"white", boxShadow:"0px 2px 2px rgba(0, 0, 0, 0.25)", backgroundColor:"#5774FF",width:"131px",alignSelf:"center"}} onClick={handleUploadFilesButton}>생성하기</Button>

                    </div>

                </div>
            </div>
        </Modal>
    )
}