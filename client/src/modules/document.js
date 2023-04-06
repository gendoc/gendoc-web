import {getGuideDocuments, getWrittenDocuments} from "../api/documentApi";

const GET_GUIDE_DOCUMENTS_SUCCESS = "GET_GUIDE_DOCUMENTS_SUCCESS"
const GET_WRITTEN_DOCUMENTS_SUCCESS = "GET_WRITTEN_DOCUMENTS_SUCCESS"
const SET_LOADING = "SET_LOADING"

export const getGuideDocumentsSuccess = (documents) => ({
    type: GET_GUIDE_DOCUMENTS_SUCCESS,
    guideDocuments: documents
});

export const getWrittenDocumentsSuccess = (documents) => ({
    type: GET_WRITTEN_DOCUMENTS_SUCCESS,
    writtenDocuments: documents
});

export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    isLoading: isLoading
});

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
    loading: false
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
        case SET_LOADING:
            return {
                ...state,
                loading: action.isLoading
            }
        default:
            return state
    }
}

export default documentReducer;