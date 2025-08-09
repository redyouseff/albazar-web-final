import  { useDeleteDataWithToken } from "../../hooks/UseDeleteData";
import {  useGetDataWithToken } from "../../hooks/UseGetData";
import { useInsetData } from "../../hooks/UseInsertData";
import { ADD_TO_FAVOURITE, DELETE_FAVOURITE, GET_LOGGED_USER_FAVOURITE } from "../Type";


export const addToFavourite=(id)=>async(dispatch)=>{
    try{
        const response=await useInsetData(`/api/favourite/${id}`);
        dispatch({
            type:ADD_TO_FAVOURITE,
            payload:response,
            loading:false
        })

    }
    catch(e){
        dispatch({
            type:ADD_TO_FAVOURITE,
            payload:e,
            loading:false
        })
    }

}

export const getLoggedUserFavourite=async(dispatch)=>{

    try{
        const response=await useGetDataWithToken("/api/favourite")
        dispatch({
            type:GET_LOGGED_USER_FAVOURITE,
            payload:response.data,
            loading:false
        })

    }
    catch(e){
        dispatch({
            type:GET_LOGGED_USER_FAVOURITE,
            payload:e,
            loading:false
        })

    }

}


export const deleteFavourite=(id)=> async(dispatch)=>{
  
    try{
        const response =await useDeleteDataWithToken(`/api/favourite/${id}`)
        dispatch({
            type:DELETE_FAVOURITE,
            payload:response,
            loading:false
        })

    }
    catch(e){
        dispatch({
            type:DELETE_FAVOURITE,
            payload:e,
            loading:false
        })

    }
}