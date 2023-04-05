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

export const getGuideDocument = () =>{

    return axiosInstance.get(`/documents/guide`
    )
}


export const getWrittenDocument = () =>{

    return axiosInstance.get(`/documents/written`
    )
}