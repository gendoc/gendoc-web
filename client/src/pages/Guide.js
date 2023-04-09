import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {red} from "@mui/material/colors";
import {Typography} from "@mui/material";

export const Item = styled(Paper)(({ theme }) => ({
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
                            <Item key={Math.floor(Math.random() * 10000)} style={{height:"491px",borderRadius:"17px",paddingBlock:"37px",paddingInline:"20px",textAlign:"left"}} >

                                <Typography
                                    sx={{ flex: '1 1 100%' }}
                                    variant="h4"
                                    id="tableTitle"
                                    component="div"
                                    marginBottom={"30px"}
                                >
                                    STEP 1_문서 업로드
                                </Typography>
                                <hr style={{marginBottom:"20px"}}/>
                                <Typography style={{whiteSpace: 'pre-wrap'}}>
                                    {" 좌측에 ‘새 프로젝트’를 눌러 ‘모집 공고문 문서’,’전문가 작성 가이드' 와 ‘사업계획서 초안’을 업로드 후 ‘생성하기’를 눌러주세요. 🎯\n" +
                                        "\n" +
                                        " ( ‘전문가 작성 가이드’가 없다면 좌측 ‘전문가 작성 가이드' 탭을 클릭하여 genDOC에서 기본 제공하는 전문가 작성 가이드를 내려받아, 업로드해 주세요. )"}
                                </Typography>

                            </Item>

                            <Item key={Math.floor(Math.random() * 10000)} style={{height:"491px",borderRadius:"17px",paddingBlock:"37px",paddingInline:"20px",textAlign:"left"}} >

                                <Typography
                                    sx={{ flex: '1 1 100%' }}
                                    variant="h4"
                                    id="tableTitle"
                                    component="div"
                                    marginBottom={"30px"}
                                >
                                    STEP 2_AI 챗봇 활용
                                </Typography>
                                <hr style={{marginBottom:"20px"}}/>
                                <Typography style={{whiteSpace: 'pre-wrap'}}>
                                    {" 업로드한 ‘공고문 및 가이드 문서’를 기반으로 작성 문서 초안이 첨삭 완료되기까지, 대기 시간이 생깁니다.  대기 시간에 생성 폴더 항목에 존재하는 ‘genDOC 캐릭터’를 클릭하여, 공고 가이드 및 전문가 작성법 내용 기반의 정보를 물어보고 완성도 높은 문서를 만들어보세요. 📑 🤖"}
                                </Typography>

                            </Item>

                            <Item key={Math.floor(Math.random() * 10000)} style={{height:"491px",borderRadius:"17px",paddingBlock:"37px",paddingInline:"20px",textAlign:"left"}} >

                                <Typography
                                    sx={{ flex: '1 1 100%' }}
                                    variant="h4"
                                    id="tableTitle"
                                    component="div"
                                    marginBottom={"30px"}
                                >
                                    STEP 3_첨삭 내용 확인
                                </Typography>
                                <hr style={{marginBottom:"20px"}}/>
                                <Typography style={{whiteSpace: 'pre-wrap'}}>
                                    {" 생성된 프로젝트의 상태가 ‘첨삭 완료’로 바뀌면, 해당 폴더를 접속하여, ‘첨삭 문서’를 열람하면, 기존 문서 초안 내용과 첨삭된 내용을 대조 확인할 수 있어요. 단기간에 완성도 높은 문서 작업을 경험해 보세요-! 🥳\n" +
                                        "\n" +
                                        " ( 프로젝트 폴더에서 업로드한 ‘공고문 및 가이드 문서'를 확인할 수 있어요. )"}
                                </Typography>

                            </Item>




                        </Box>
                </Grid>

        </Grid>
    );
}