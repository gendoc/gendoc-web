import axiosInstance from "./index";

export const patchAccessToken = (patchAccessTokenRequest) =>{
    console.log("patchAccessToken")
    return axiosInstance.patch(`/users/access-token`,
        patchAccessTokenRequest
    )
}

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

export const getGuideDocuments = (projectId) =>{

    return axiosInstance.get(`/documents/guide/${projectId}`
    )
}

export const getNoticeDocuments = (projectId) =>{

    return axiosInstance.get(`/documents/notice/${projectId}`
    )
}


export const getWrittenDocuments = (projectId) =>{

    return axiosInstance.get(`/documents/written/${projectId}`
    )
}

export const uploadFinish = (projectId) =>{
    console.log("uploadFinish")
    return axiosInstance.get(`/documents/upload-finish/${projectId}`
    )
}