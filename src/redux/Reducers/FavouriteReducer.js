import { ADD_TO_FAVOURITE, DELETE_FAVOURITE, GET_LOGGED_USER_FAVOURITE } from "../Type"

const initial={
    addToFavourite:[],
    getLoggedUserFavourite:[],
    deleteFavourite:[],
    loading:true

}

const FavouriteReducer=(state=initial,action)=>{

    switch(action.type){
        case ADD_TO_FAVOURITE:
            return{
                ...state,
                addToFavourite:action.payload,
                loading:false
            }
            case GET_LOGGED_USER_FAVOURITE:
                return{
                    ...state,
                    getLoggedUserFavourite:action.payload,
                    loading:false
                }  
                case DELETE_FAVOURITE:
                    return{
                        ...state,
                        deleteFavourite:action.payload,
                        loading:false
                    }

            default:
                return state
    }


}

export default FavouriteReducer
 


