import axiosInstance from "./index";

export const postProject = () =>{

    return axiosInstance.post(`/projects`
    )
}
