import { ACCEPT_LISTING, ADD_LISTING, GET_ALL_LISTINGS, GET_LISTING_BY_ID, GET_PROPERTY_FOR_CAR_LISTING, GET_PROPERTY_FOR_LAND_LISTING, GET_PROPERTY_FOR_RENT_LISTING, GET_PROPERTY_FOR_SELL_LISTING, GET_USER_BY_ID, REJECT_LISTING } from "../Type";


const initial={
    allListings:[],
    propertyForRentListing:[],
    propertyForSellListing:[],
    propertyForLandListing:[],
    propertyForCarListing:[],
    listingById:[],
    addListing:[],
    acceptlisting:[],
    rejectlisting:[],
    loading:true,

}



const ListingReducer=(state=initial,action)=>{

    switch(action.type){
        case GET_ALL_LISTINGS:
            return{
                ...state,
                allListings:action.payload,
                loading:false,
            }
            case GET_PROPERTY_FOR_RENT_LISTING:
                return{
                    ...state,
                    propertyForRentListing:action.payload,
                    loading:false,
                }
                case GET_PROPERTY_FOR_SELL_LISTING:
                    return{
                        ...state,
                        propertyForSellListing:action.payload,
                        loading:false
                        
                    }
                    case  GET_PROPERTY_FOR_LAND_LISTING:
                        return {
                            ...state,
                            propertyForLandListing:action.payload,
                            loading:false

                        }
                        case GET_PROPERTY_FOR_CAR_LISTING:
                            return{
                                ...state,
                                propertyForCarListing:action.payload,
                                loading:false 

                            }

                            case GET_LISTING_BY_ID:
                                return{
                                    ...state,
                                    listingById:action.payload,
                                    loading:false
                                } 
                                case ADD_LISTING:
                                    return{
                                        ...state,
                                        addListing:action.payload,
                                        loading:false
                                        }
                                        case ACCEPT_LISTING :
                                            return {
                                                ...state,
                                                acceptlisting:action.payload,
                                                loading:false
                                            }
                                        case REJECT_LISTING :
                                            return{
                                                ...state,
                                                rejectlisting:action.payload,
                                                loading:false

                                            }    
                                    
                            
                            


        default:
            return state
    }

 

}

export default ListingReducer;  