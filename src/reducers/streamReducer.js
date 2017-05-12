import { combineReducers } from 'redux'
import {streamCont} from "../actions/Content.js"
function streamSearchQuery(state = {}, action) {
    switch (action.type) {
        case streamCont.SEARCH_QUERY:
            var _data=action.data;
            return {...state,..._data}
        default:
            return state
    }
}
function streamList(state = {}, action) {
    switch (action.type) {
        case streamCont.STREAM_LIST:
            var _data=action.data;
            return {...state,..._data}
        default:
            return state
    }
}
function streamPakage(state = {"query":{}}, action) {
    switch (action.type) {
        case streamCont.PACKAGE_QUERY_DATA:
            var _data=action.data,query=state.query;
            query={...query,..._data};
            return {...state,"query":query};
        case streamCont.PACKAGE_DATA:
            var _data=action.data;
            return {...state,..._data};
        default:
            return state
    }
}
function streamOnline(state = {"query":{}}, action) {
    switch (action.type) {
        case streamCont.ONLINE_QUERY_DATA:
            var _data=action.data,query=!state.query?{}:state.query;
            query={...query,..._data};
            return {...state,"query":query};
        case streamCont.ONLINE_DATA:
            var _data=action.data;
            return {...state,..._data};
        default:
            return state
    }
}
const streamReducer = combineReducers({
        streamSearchQuery,
        streamList,
        streamOnline,
        streamPakage
    }
)
export default streamReducer