import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment";
import {useEffect} from "react";
import newScript from "../utils/scriptReader";
import {gapiLoaded, gisLoaded} from "./GapiClient";
import {callGetGuideDocuments, callGetWrittenDocuments} from "../modules/document";
import {Link} from "react-router-dom";
import {Tooltip} from "@mui/material";

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function MyProjectTable(props) {
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    useEffect(() => {
        handleTooltipOpen()
        handleTooltipOpen2()
        const timer = setTimeout(() => {
            handleTooltipClose()
            handleTooltipClose2()
            // Your callback function logic here
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipOpen = () => {
        setOpen(true);
    };

    const handleTooltipClose2 = () => {
        setOpen2(false);
    };

    const handleTooltipOpen2 = () => {
        setOpen2(true);
    };

    const CustomToolTip = (props) => {
        return (
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                onMouseOver={handleTooltipOpen}
                placement="bottom"
                // disableFocusListener
                // disableHoverListener
                // disableTouchListener
                title="첨삭이 완성될 때까지 해당 캐릭터를 눌러 AI챗봇에게 공고 가이드 및 전문가 작성법 내용 기반에 정보를 물어보고 완성도 높은 문서를 만들어보세요"
            >
                {props.children}
            </Tooltip>
        )
    }

    const CustomToolTip2 = (props) => {
        return (
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={handleTooltipClose2}
                open={open2}
                onMouseOver={handleTooltipOpen2}
                placement="left-start"
                // disableFocusListener
                // disableHoverListener
                // disableTouchListener
                title="MVP 단계와 정확도 높은 첨삭을 위해 조금 오래 걸릴 수 있어요. 'F5 새로고침'을 해주시면 완료 상태가 변화해요!"
            >
                {props.children}
            </Tooltip>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>프로젝트명</TableCell>
                        <TableCell align="right">상태</TableCell>
                        <TableCell align="right">CHAT DOC</TableCell>
                        <TableCell align="right">최종 수정 날짜</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.projects.map((project) => {


                        return (
                            <TableRow
                                key={project.projectName}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Link to={`/dashboard/projects/${project.projectId}`} style={{textDecoration: "none",color:"black",display:"flex",alignItems:"center"}}>
                                        <img style={{marginRight:"10px"}} width={"30px"} src="/assets/icons/folder.png" />
                                        {project.projectName}
                                    </Link>

                                </TableCell>
                                <TableCell align="right">
                                    <CustomToolTip2>
                                        <div>
                                            {project.projectState!=null?project.projectState:"첨삭중"}
                                        </div>
                                    </CustomToolTip2>
                                   </TableCell>
                                <TableCell align="right" >{project.chatDoc?
                                    (
                                        <CustomToolTip
                                         >
                                            <img style={{cursor:"pointer"}} onClick={()=>{
                                                alert("채팅창 띄우기")
                                            }} width={"40px"} src="/favicon/android-icon-48x48.png" />
                                        </CustomToolTip>)
                                    :
                                    (<CustomToolTip ><img onClick={()=>{alert("공고문과 작성 가이드를 처리 중입니다. \n잠시만 기다려주세요.")}} style={{filter:"grayscale(100%)"}} width={"40px"} src="/favicon/android-icon-48x48.png" /></CustomToolTip>
                                    )
                                }</TableCell>
                                <TableCell
                                    align="right">{moment(project.creationTime, 'YYYYMMDDHHmmss z').add(9, "h").fromNow()}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

