import {combineReducers} from "redux"
import ListingReducer from "./ListingReducer"
import AuthReducer from "./AuthReducer"
import UserReducer from "./UserReducer"
import FavouriteReducer from "./FavouriteReducer"
import MessageReducer from "./MessageReducer"

export default combineReducers({
    listing: ListingReducer,
    auth: AuthReducer   ,
    user:UserReducer,
    favourite:FavouriteReducer,
    message:MessageReducer
})  
