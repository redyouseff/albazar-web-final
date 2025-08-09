
import { useGetData, useGetDataWithToken } from "../../hooks/UseGetData"
import { ACCEPT_LISTING, ADD_LISTING, CATEGORY_CAR_ID, CATEGORY_LAND_ID, CATEGORY_RENT_ID, CATEGORY_SELL_ID, GET_ALL_LISTINGS, GET_LISTING_BY_ID, GET_PROPERTY_FOR_CAR_LISTING, GET_PROPERTY_FOR_LAND_LISTING, GET_PROPERTY_FOR_RENT_LISTING, GET_PROPERTY_FOR_SELL_LISTING, REJECT_LISTING } from "../Type"
import { useInsetDataWithImage } from "../../hooks/UseInsertData"
import { useUdpateDataWithToken } from "../../hooks/UseUpdataData";

// Helper function to convert filters object to query string
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




export const getAllListings=(limit,keyword,page=1,pending=false)=>async (dispatch)=>{
    try{
        const pendingParam = pending ? '&pending=true' : '';
        const response= await useGetData(`/api/listing?limit=${limit}&keyword=${keyword}&page=${page}${pendingParam}`)
       
        dispatch({
            type:GET_ALL_LISTINGS,
            payload:response,
            loading:false,
        })
    }
    catch(e){
        dispatch({
            type:GET_ALL_LISTINGS,
            payload:e,
            loading:false,
        })
    }
}

export const getListingById=(id)=>async(dispatch)=>{
    try{
        const response=await useGetData(`/api/listing/${id}`)

        dispatch({
            type:GET_LISTING_BY_ID,
            payload:response,
            loading:false,
        })
    }
    catch(e){
        dispatch({
            type:GET_LISTING_BY_ID,
            payload:e,
            loading:false,
        })
    }
}

export const getAllListingsByCategory = (category, params = {}, pending = false) => async (dispatch) => {
    console.log("params",params)
    try {
        // Ensure category is included in params
        const queryParams = {
            category,
            sort: '-createdAt', 
            ...params
        };
        
        // Add pending parameter if true
        if (pending) {
            queryParams.pending = true;
        }
        
        const queryString = buildQueryString(queryParams);
        const response = await useGetData(`/api/listing?${queryString}`);
        
        dispatch({    
            type: GET_ALL_LISTINGS,
            payload: response,
            loading: false,
        });
    } catch(e) {
        dispatch({
            type: GET_ALL_LISTINGS,
            payload: e,
            loading: false,
        });
    }
}

export const getProprtyForRentListing=(page,limit,post)=>async(dispatch)=>{
   
    try{
        const response=await useGetData(`/api/listing?category=${CATEGORY_RENT_ID}&sort=-createdAt&page=${page}&limit=${limit}&post=${post}`)
        dispatch({
            type:GET_PROPERTY_FOR_RENT_LISTING,
            payload:response,
            loading:false,
        })
    }
    catch(e){   
        dispatch({
            type:GET_PROPERTY_FOR_RENT_LISTING,
            payload:e,
            loading:false,
        })
    }
}

export const getProprtyForSelltListing =(page,limit,post)=>async(dispatch)=>{
    try{
    
    const response =await useGetData(`/api/listing?category=${CATEGORY_SELL_ID}&sort=-createdAt&page=${page}&limit=${limit}&post=${post}`)

    dispatch({
        type:GET_PROPERTY_FOR_SELL_LISTING,
        payload:response,
        loading:false
    })

}
catch(e){
    dispatch({
        type:GET_PROPERTY_FOR_SELL_LISTING, 
        payload:e,
        loading:false

    })
}
}

export const getProprtyForLandtListing=(page,limit,post)=>async(dispatch)=>{
  
    try{
        const response =await useGetData(`/api/listing?category=${CATEGORY_LAND_ID}&sort=-createdAt&page=${page}&limit=${limit}&post=${post}`)
     
        dispatch({
            type:GET_PROPERTY_FOR_LAND_LISTING,
            payload:response,
            loading:false
        })

    }
    catch(e){
        dispatch({
            type:GET_PROPERTY_FOR_LAND_LISTING,
            payload:e,
            loading:false
        })
    }
}

export const  getProprtyForCarListing=(page,limit,post)=> async(dispatch)=>{

    try{
        const response =await useGetData(`/api/listing?category=${CATEGORY_CAR_ID}&sort=-createdAt&page=${page}&limit=${limit}&post=${post}`)

        dispatch({
            type:GET_PROPERTY_FOR_CAR_LISTING,
            payload:response,
            loading:false,
        })

    }
    catch(e){
        dispatch({
            type:GET_PROPERTY_FOR_CAR_LISTING,
            payload:e,
            loading:false
        })
    }

}

//add listing

export const addListing=(data)=>async(dispatch)=>{
    console.log("data",data)
    try{
        console.log(data)
        const response=await useInsetDataWithImage(`/api/listing`,data)
        dispatch({
            type:ADD_LISTING,
            payload:response,
            loading:false
        })  

    }
    catch(e){
        dispatch({
            type:ADD_LISTING,
            payload:e,
            loading:false
        })
    }
    
}


export const acceptListing=(id)=>async(dispatch)=>{
    try{
        const response =await useUdpateDataWithToken(`/api/listing/accept/${id}`)
        dispatch({
            type:ACCEPT_LISTING,
            payload: { ...response, id }, // إضافة الـ ID للـ response
            loading:false
        })  


    }
    catch(e){
        dispatch({
            type:ACCEPT_LISTING,
            payload: { ...e, id }, // إضافة الـ ID حتى في حالة الخطأ
            loading:false
        })

    }
}

export  const rejectListing=(id)=>async(dispatch)=>{
    try{
        const response =await useUdpateDataWithToken(`/api/listing/reject/${id}`)
        dispatch({
            type:REJECT_LISTING,
            payload: { ...response, id }, // إضافة الـ ID للـ response
            loading:false
        })  


    }
    catch(e){
        dispatch({
            type:REJECT_LISTING,
            payload: { ...e, id }, // إضافة الـ ID حتى في حالة الخطأ
            loading:false
        })

    }

}



