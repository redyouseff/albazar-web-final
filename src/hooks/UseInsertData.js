import BaseUrl from "../api/BaseUrl";


const useInsetDataWithImage = async (url,params)=>{

 try{
    const config={
        headers:{
            "content-type":"multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,

    }
}

   const response = await BaseUrl.post(url,params,config);
   return response;

 }
 catch(error){
    console.error('Error inserting data with image:', error);
    throw error;


 }

}


const useInsetData =async(url,params)=>{
try{
    const config={
        headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}

    }
    const response = await BaseUrl.post(url,params,config);
    return response;

}
catch(error){
    console.error('Error inserting data:', error);
    throw error;
}
}

const useInsetDataWithToken = async(url,params)=>{
    try{
        const config={
            headers:{
                "Content-Type": "application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }
        const response = await BaseUrl.post(url,params,config);
        return response;

    }
    catch(error){
        console.error('Error inserting data with token:', error);
        throw error;
    }
}

export {useInsetDataWithImage,useInsetData,useInsetDataWithToken};