import { combineReducers } from 'redux'
import {channelCont} from "../actions/Content.js"
function channelList(state = {"query":{},"list":[]}, action) {
    switch (action.type) {
        case channelCont.CHANNEL_DATA:
            var _data = action.data;
            return {...state, ..._data};
        case channelCont.CHANNEL_SEARCH_QUERY:
            var _data = action.data, query = state.query;
            query = {...query, ..._data};
            return {...state, "query": query};
        case channelCont.CHANNEL_LIST:
            var _data = action.data, list = state.list;
            return {...state, "list": _data};
        default:
            return state;
    }
}
function channelBit(state = {"query":{}}, action) {
    switch (action.type) {
        case channelCont.CHANNEL_BIT_DATA:
            var _data = action.data;
            return {...state, ..._data};
        case channelCont.CHANNEL_BIT_QUERY:
            var _data = action.data, query = state.query;
            query = {...query, ..._data};
            return {...state, "query": query};
        case channelCont.EDIT_CHANNEL_DEVICE:
            var _data = action.data, devList = state.devList;
            if(!devList){
                return {...state}
            }
            var thisDevList=devList[action.index];
            thisDevList={...thisDevList,..._data};
            return {...state, "devList":[
                ...devList.slice(0,action.index),
                thisDevList,
                ...devList.slice(action.index+1)
            ]};
        default:
            return state;
    }
}
function channelCode(state = {"query":{}}, action) {
    switch (action.type) {
        case channelCont.CHANNEL_CODE_DATA:
            var _data = action.data;
            return {...state, ..._data};
        case channelCont.CHANNEL_CODE_QUERY:
            var _data = action.data, query = state.query;
            query = {...query, ..._data};
            return {...state, "query": query};
        case channelCont.CHANNEL_CODE_ISP:
            var _data=action.data,_isp=action.isp,tableData=state.tableData,_thisIps=tableData[_isp];
            if(!tableData){
                return {...state};
            }
            state.tableData[_isp]={..._thisIps,..._data};
            return {...state};
        default:
            return state;
    }
}
function channelTotal(state = {"query":{}}, action) {
    switch (action.type) {
        case channelCont.CHANNEL_TOTAL_DATA:
            var _data = action.data;
            return {...state, ..._data};
        case channelCont.CHANNEL_TOTAL_QUERY:
            var _data = action.data, query = state.query;
            query = {...query, ..._data};
            return {...state, "query": query};
        default:
            return state;
    }
}
const channelReducer = combineReducers({
        channelList,
        channelBit,
        channelCode,
        channelTotal
    }
);
export default channelReducer