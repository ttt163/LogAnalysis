import { combineReducers } from 'redux'
import {userCont} from "../actions/Content.js"
function loginInfo(state = {}, action) {
    switch (action.type) {
        case userCont.LOGIN:
            var _data=action.data;
            return {...state,..._data}
        default:
            return state
    }
}
function userInfo(state = {}, action) {
    switch (action.type) {
        case userCont.EDITUSER:
            var _data=action.data;
            return {...state,..._data}
        default:
            return state
    }
}
function userList(state = {}, action) {
    switch (action.type) {
        case userCont.USERLIST:
            var _data=action.data;
            return {...state,..._data}
        case userCont.DELUSER:
            var list=state.list;
            list=[...list.slice(0,action.index),...list.slice(action.index+1)];
            return {...state,"list":list}
        default:
            return state
    }
}
const userReducer = combineReducers({
        userInfo,
        loginInfo,
        userList
    }
)
export default userReducer