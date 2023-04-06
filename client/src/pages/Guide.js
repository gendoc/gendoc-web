import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {red} from "@mui/material/colors";
import {Typography} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function Guide(state) {
    return (
        <Grid {...state} container>

                <Grid item style={{ height: '100%', width: '100%' }}  >
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                display: 'grid',
                                gridTemplateColumns: { md: '1fr 1fr 1fr' },
                                gap: 2,
                                alignContent: 'stretch'
                            }}
                            style={{background:"#ECE9E9"}}
                        >
                            {["새 프로젝트를 눌러 가이드 문서와 사업계획서 초안을 업로드해주세요. \n(만약, 전문가 작성 가이드가 없으시다면 genDOC에서 기본 제공하는 전문가 작성 가이드를 단운 받아 업로드 해주세요.)",
                                "새 프로젝트를 눌러 가이드 문서와 사업계획서 초안을 업로드해주세요. (만약, 전문가 작성 가이드가 없으시다면 genDOC에서 기본 제공하는 전문가 작성 가이드를 단운 받아 업로드 해주세요.)",
                                "새 프로젝트를 눌러 가이드 문서와 사업계획서 초안을 업로드해주세요. (만약, 전문가 작성 가이드가 없으시다면 genDOC에서 기본 제공하는 전문가 작성 가이드를 단운 받아 업로드 해주세요.)"].map((elevation) => (
                                        <Item key={elevation} style={{height:"491px",borderRadius:"17px",paddingBlock:"37px",paddingInline:"20px",textAlign:"left"}} >

                                            <Typography
                                                sx={{ flex: '1 1 100%' }}
                                                variant="h4"
                                                id="tableTitle"
                                                component="div"
                                                marginBottom={"30px"}
                                            >
                                                STEP 1.
                                            </Typography>
                                            <hr style={{marginBottom:"20px"}}/>
                                            <Typography style={{whiteSpace: 'pre-wrap'}}>
                                                {elevation}
                                            </Typography>

                                        </Item>

                            ))}
                        </Box>
                </Grid>

        </Grid>
    );
}