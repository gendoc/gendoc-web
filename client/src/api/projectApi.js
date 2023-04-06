import axiosInstance from "./index";

export const postProject = (postProjectRequest) =>{

    return axiosInstance.post(`/projects`,
        postProjectRequest
    )
}
