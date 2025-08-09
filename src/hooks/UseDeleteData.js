import BaseUrl from "../api/BaseUrl";

export const UseDeleteData = async (url,params)=>{
    try {
        const response = await BaseUrl.delete(url,params);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}
export const useDeleteDataWithToken=async(url,params)=>{
    try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        };
    
        const response = await BaseUrl.delete(url, config);
        return response;
      } catch (error) {
        console.error('Error delete data with token:', error);
        throw error;
      }
    };



