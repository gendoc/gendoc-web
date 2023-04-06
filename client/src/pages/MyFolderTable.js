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

export default function MyFolderTable(props) {


    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>폴더명</TableCell>
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
                                    <Link to={`/dashboard/projects/${project.projectId}/${project.folderKey}`}
                                          style={{textDecoration: "none",color:"black",display:"flex",alignItems:"center"}}>
                                        <img style={{marginRight:"10px"}} width={"30px"} src="/assets/icons/folder.png" />
                                        {project.projectName}
                                    </Link>

                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

