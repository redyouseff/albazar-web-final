import { CHANGE_PASSWORD, GET_ALL_USERS_FOR_ADMIN, GET_LOGGED_USER_LISTING, GET_USER_BY_ID, UPDATE_USER } from "../Type"


const initial={
    updateUser:[],
    changePassword:[],
    userById:[],
    loggeduserlisting:[],
    allUsers:[],
    
}


const UserReducer=(state=initial,action)=>{

    switch(action.type){
        case UPDATE_USER:
            return{
                ...state,
                updateUser:action.payload,
                loading:false
            }
            case CHANGE_PASSWORD:
                return{
                    ...state,
                    changePassword:action.payload,
                    loading:false
                }
                case GET_USER_BY_ID:
                    return {
                        ...state,
                        userById:action.payload,
                        loading:false
                    }
                
                case GET_LOGGED_USER_LISTING:
                    return {
                        ...state,
                        loggeduserlisting:action.payload,
                        loading:false
                    }

                    case GET_ALL_USERS_FOR_ADMIN:
                        return {
                            ...state,
                            allUsers:action.payload,
                            loading:false
                        }

            default:    
                return state;
                
    }
}

export default UserReducer;


