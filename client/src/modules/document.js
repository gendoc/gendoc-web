import {getGuideDocuments, getNoticeDocuments, getWrittenDocuments} from "../api/documentApi";
import {getProjects} from "../api/projectApi";

const GET_GUIDE_DOCUMENTS_SUCCESS = "GET_GUIDE_DOCUMENTS_SUCCESS"
const GET_WRITTEN_DOCUMENTS_SUCCESS = "GET_WRITTEN_DOCUMENTS_SUCCESS"
const GET_NOTICE_DOCUMENTS_SUCCESS = "GET_NOTICE_DOCUMENTS_SUCCESS"
const GET_PROJECTS_SUCCESS = "GET_PROJECTS_SUCCESS"
const SET_LOADING = "SET_LOADING"
const SET_MODAL_OPEN = "SET_MODAL_OPEN"
const SET_BACK_BUTTON_SHOWN = "SET_BACK_BUTTON_SHOWN"

export const getGuideDocumentsSuccess = (documents) => ({
    type: GET_GUIDE_DOCUMENTS_SUCCESS,
    guideDocuments: documents
});

export const getNoticeDocumentsSuccess = (documents) => ({
    type: GET_NOTICE_DOCUMENTS_SUCCESS,
    noticeDocuments: documents
});

export const getWrittenDocumentsSuccess = (documents) => ({
    type: GET_WRITTEN_DOCUMENTS_SUCCESS,
    writtenDocuments: documents
});

export const getProjectsSuccess = (projects) => ({
    type: GET_PROJECTS_SUCCESS,
    projects: projects
});

export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    isLoading: isLoading
});

export const setModalOpen = (isModalOpen) => ({
    type: SET_MODAL_OPEN,
    isModalOpen: isModalOpen
});

export const setBackButtonShown = (backButtonShown) => ({
    type: SET_BACK_BUTTON_SHOWN,
    backButtonShown: backButtonShown
});

export const callGetProjects =
    () =>
        async (dispatch, getState) => {
            await getProjects().then((res) => {
                dispatch(getProjectsSuccess(res.data.projects))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };


export const callGetNoticeDocuments =
    (projectId) =>
        async (dispatch, getState) => {
            await getNoticeDocuments(projectId).then((res) => {
                dispatch(getNoticeDocumentsSuccess(res.data.documents))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };

export const callGetGuideDocuments =
    (projectId) =>
        async (dispatch, getState) => {
            await getGuideDocuments(projectId).then((res) => {
                dispatch(getGuideDocumentsSuccess(res.data.documents))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };

export const callGetWrittenDocuments =
    (projectId) =>
        async (dispatch, getState) => {
            await getWrittenDocuments(projectId).then((res) => {
                dispatch(getWrittenDocumentsSuccess(res.data.documents))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };

const initialState = {
    guideDocuments: [],
    noticeDocuments: [],
    writtenDocuments: [],
    loading: false,
    modalOpen: false,
    projects: [],
    backButtonShown: false
}

function documentReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case GET_GUIDE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                guideDocuments: action.guideDocuments
            }
        case GET_WRITTEN_DOCUMENTS_SUCCESS:
            return {
                ...state,
                writtenDocuments: action.writtenDocuments
            }
        case GET_NOTICE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                noticeDocuments: action.noticeDocuments
            }
        case GET_PROJECTS_SUCCESS:
            return {
                ...state,
                projects: action.projects
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.isLoading
            }
        case SET_MODAL_OPEN:
            return {
                ...state,
                modalOpen: action.isModalOpen
            }
        case SET_BACK_BUTTON_SHOWN:
            return {
                ...state,
                backButtonShown: action.backButtonShown
            }
        default:
            return state
    }
}

export default documentReducer;