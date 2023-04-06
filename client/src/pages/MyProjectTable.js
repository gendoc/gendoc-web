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


    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>프로젝트명</TableCell>
                        <TableCell align="right">상태</TableCell>
                        <TableCell align="right">용량</TableCell>
                        <TableCell align="right">생성 시간</TableCell>
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
                                    <div style={{display:"flex",alignItems:"center"}}>
                                        <img style={{marginRight:"10px"}} width={"30px"} src="/assets/icons/folder.png" />
                                        {project.projectName}
                                    </div>

                                </TableCell>
                                <TableCell align="right">{project.projectState!=null?project.projectState:"첨삭중"}</TableCell>
                                <TableCell align="right">-</TableCell>
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

