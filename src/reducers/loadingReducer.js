import { combineReducers } from 'redux'
import {loadingCont} from "../actions/Content.js"
export default function loadingData(state = {}, action) {
    switch (action.type) {
        case loadingCont.LOADINGSTATE:
            var _data=action.data;
            return {...state,..._data};
        default:
            return state
    }
}
/*
const userReducer = combineReducers({
        userInfo,
        loginInfo,
        userList
    }
)
export default userReducer*/
