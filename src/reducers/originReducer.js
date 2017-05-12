import { combineReducers } from 'redux'
import {originCont} from "../actions/Content.js"
function originList(state = {"query":{},"list":[]}, action) {
    switch (action.type) {
        case originCont.ORIGIN_DATA:
            var _data = action.data;
            return {...state, ..._data};
        case originCont.ORIGIN_SEARCH_QUERY:
            var _data = action.data, query = state.query;
            query = {...query, ..._data};
            return {...state, "query": query};
        case originCont.ORIGIN_LIST:
            var _data = action.data, list = state.list;
            return {...state, "list": _data};
        default:
            return state;
    }
}
function originBit(state = {}, action) {
    switch (action.type) {
        case originCont.ORIGIN_BIT_DATA:
            var _data = action.data;
            return {...state, ..._data};
        default:
            return state;
    }
}
function originSubBit(state = {}, action) {
    switch (action.type) {
        case originCont.ORIGIN_SUB_BIT_DATA:
            var _data = action.data;
            return {...state, ..._data};
        default:
            return state;
    }
}
function originCode(state = {}, action) {
    switch (action.type) {
        case originCont.ORIGIN_CODE_DATA:
            var _data = action.data;
            return {...state, ..._data};
        default:
            return state;
    }
}
function originSubCode(state = {}, action) {
    switch (action.type) {
        case originCont.ORIGIN_SUB_CODE_DATA:
            var _data = action.data;
            return {...state, ..._data};
        default:
            return state;
    }
}
const originReducer = combineReducers({
        originList,
        originBit,
        originSubBit,
        originCode,
        originSubCode
    }
);
export default originReducer