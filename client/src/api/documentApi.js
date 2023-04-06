import axiosInstance from "./index";

export const postGuideDocuments = (postGuideDocumentsRequest) =>{

    return axiosInstance.post(`/documents/guide`,
        postGuideDocumentsRequest
    )
}

export const postNoticeDocument = (postNoticeDocumentRequest) =>{

    return axiosInstance.post(`/documents/notice`,
        postNoticeDocumentRequest
    )
}

export const postWrittenDocument = (postWrittenDocumentRequest) =>{

    return axiosInstance.post(`/documents/written`,
        postWrittenDocumentRequest
    )
}

export const getGuideDocuments = () =>{

    return axiosInstance.get(`/documents/guide`
    )
}


export const getWrittenDocuments = () =>{

    return axiosInstance.get(`/documents/written`
    )
}