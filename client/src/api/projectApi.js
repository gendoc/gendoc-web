import axiosInstance from "./index";

export const postProject = (postProjectRequest) =>{

    return axiosInstance.post(`/projects`,
        postProjectRequest
    )
}

export const getProjects = () =>{

    return axiosInstance.get(`/projects`
    )
}