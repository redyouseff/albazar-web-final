import BaseUrl from "../api/BaseUrl";

const useUpdateDataWithImage = async (url,params)=>{

    try{
        const config={
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:`Bearer ${localStorage.getItem("token")}`
              }
        }
        const res=await BaseUrl.put(url,params,config)
      
        return res;

    }
    catch(error){
        console.error('Error deleting data with image:', error);
        throw error;
    }
}


const useUdpateData = async (url,params)=>{
    try {
        const config={
            headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}
        }
        const res=await BaseUrl.put(url,params,config)
        return res

    }
    catch(error){
        console.error('Error updating data:', error);
        throw error;
    }
}

const useUdpateDataWithToken = async (url,params)=>{
    try {
        const config={
            headers:{
                "Content-Type": "application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }
        const res=await BaseUrl.put(url,params,config)
        return res

    }
    catch(error){
        console.error('Error updating data with token:', error);
        throw error;
    }
}

export {useUpdateDataWithImage,useUdpateData,useUdpateDataWithToken};