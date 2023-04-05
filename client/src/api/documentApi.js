import axiosInstance from "./index";

export const postGuideDocuments = (postGuideDocumentsRequest) =>{

    return axiosInstance.post(`/documents/guide`,
        postGuideDocumentsRequest
    )
}

export const postWrittenDocument = (postWrittenDocumentRequest) =>{

    return axiosInstance.post(`/documents/written`,
        postWrittenDocumentRequest
    )
}