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
import {makeStyles} from "@mui/material";
import {styled} from "@mui/material/styles";
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

export default function MyDocumentTable(props) {

    const StyledTableHead = props.tableHeadColor?
        styled(TableHead)`
  & .MuiTableCell-root {
    background-color: #EBF1FE;
  }`: TableHead


    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <StyledTableHead>
                    <TableRow>
                        <TableCell>파일명</TableCell>
                        <TableCell align="right">작업상태</TableCell>
                        <TableCell align="right">업로드 시간</TableCell>
                    </TableRow>
                </StyledTableHead>
                <TableBody>
                    {props.documents.map((document) => {


                        console.log(document)
                        return (
                            <TableRow
                                key={document.fileName}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >

                                <TableCell component="th" scope="row">
                                    {document.documentId!=null?
                                        <a href={`https://docs.google.com/document/d/${document.documentId}/edit`} target="_blank"
                                           style={{color:"black"}}>
                                            {document.fileName}
                                        </a>
                                    :
                                        <>
                                        {document.fileName}
                                        </>
                                    }
                                </TableCell>
                                <TableCell align="right">{document.documentState}</TableCell>
                                <TableCell
                                    align="right">{moment(document.uploadTime, 'YYYYMMDDHHmmss z').add(9, "h").fromNow()}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

