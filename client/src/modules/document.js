import {getGuideDocuments, getWrittenDocuments} from "../api/documentApi";
import {getProjects} from "../api/projectApi";

const GET_GUIDE_DOCUMENTS_SUCCESS = "GET_GUIDE_DOCUMENTS_SUCCESS"
const GET_WRITTEN_DOCUMENTS_SUCCESS = "GET_WRITTEN_DOCUMENTS_SUCCESS"
const GET_PROJECTS_SUCCESS = "GET_PROJECTS_SUCCESS"
const SET_LOADING = "SET_LOADING"
const SET_MODAL_OPEN = "SET_MODAL_OPEN"

export const getGuideDocumentsSuccess = (documents) => ({
    type: GET_GUIDE_DOCUMENTS_SUCCESS,
    guideDocuments: documents
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

export const callGetProjects =
    () =>
        async (dispatch, getState) => {
            await getProjects().then((res) => {
                dispatch(getProjectsSuccess(res.data.projects))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };


export const callGetGuideDocuments =
    () =>
        async (dispatch, getState) => {
            await getGuideDocuments().then((res) => {
                dispatch(getGuideDocumentsSuccess(res.data.documents))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };

export const callGetWrittenDocuments =
    () =>
        async (dispatch, getState) => {
            await getWrittenDocuments().then((res) => {
                dispatch(getWrittenDocumentsSuccess(res.data.documents))
            }).catch((error) => {
                console.log(error.response.data)
            })
        };

const initialState = {
    guideDocuments: [],
    writtenDocuments: [],
    loading: false,
    modalOpen: false,
    projects: []
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
        default:
            return state
    }
}

export default documentReducer;