import { useGetData, useGetDataWithToken } from "../../hooks/UseGetData"
import { useInsetData } from "../../hooks/UseInsertData"
import {  useUpdateDataWithImage } from "../../hooks/UseUpdataData"
import { CHANGE_PASSWORD, GET_ALL_USERS_FOR_ADMIN, GET_LOGGED_USER_LISTING, GET_USER_BY_ID, UPDATE_USER } from "../Type"



const buildQueryString = (params) => {
    // Filter out empty values and format arrays
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
        // Skip empty values
        if (value === '' || value === null || value === undefined) {
            return acc;
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return acc;
            }
            return {
                ...acc,
                [key]: value.join(',')
            };
        }
        
        // Handle booleans
        if (typeof value === 'boolean') {
            return {
                ...acc,
                [key]: value.toString()
            };
        }
        
        // Handle numbers
        if (typeof value === 'number') {
            return {
                ...acc,
                [key]: value.toString()
            };
        }
        
        return {
            ...acc,
            [key]: value
        };
    }, {});

    // Build query string
    return Object.entries(filteredParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
};


export const updateUser=(data)=>async(dispatch)=>{
       
    try{
        const response=await useUpdateDataWithImage(`/api/user/${JSON.parse(localStorage.getItem('user'))._id}`,data)
    
       
        dispatch({
            type:UPDATE_USER,
            payload:response,
            loading:false
        })
    }
    catch(e){
        dispatch({
            type:UPDATE_USER,
            payload:e,
            loading:false
        })
    }
}

export const changePassword=(data)=>async(dispatch)=>{
    try{
        
        const response=await useInsetData(`/api/user/changeMyPassword`, data)
        dispatch({
            type:CHANGE_PASSWORD,
            payload:response,
            loading:false
        })
    }
    catch(e){
        dispatch({
            type:CHANGE_PASSWORD,
            payload:e,
            loading:false
        })
    }
}

export  const getUserById=(id)=>async(dispatch)=>{
    try{
        const response=await useGetData(`/api/user/${id}`)
        dispatch({
            type:GET_USER_BY_ID,
            payload:response,
            loading:false
        })
    }
    catch(e){
        dispatch({
            type:GET_USER_BY_ID,
            payload:e,
            loading:false
        })
    }
}

export const getLoggedUserListing=(params={})=>async(dispatch)=>{
 
    const query=params
    const queryParams=buildQueryString(query)
    
    try{
        const response =await useGetDataWithToken(`/api/listing/userListing?${queryParams}`);
        dispatch({
            type:GET_LOGGED_USER_LISTING,
            payload:response,
            loading:false
        })

    }
    catch(e){
        dispatch({
            type:GET_LOGGED_USER_LISTING,
            payload:e,
            loading:false
        })

    }
}


export const getAllUsersForAdmin = (params = {}) => async (dispatch) => {
    try {
        const { page = 1, limit = 5, keyword } = params;
        const queryParams = buildQueryString({ page, limit, keyword });
        console.log('Fetching users with params:', queryParams);
        const response = await useGetDataWithToken(`/api/user?${queryParams}`);
        console.log('API Response:', response);
        return dispatch({
            type: GET_ALL_USERS_FOR_ADMIN,
            payload: response
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return dispatch({
            type: GET_ALL_USERS_FOR_ADMIN,
            payload: { status: 500, data: null }
        });
    }
}

