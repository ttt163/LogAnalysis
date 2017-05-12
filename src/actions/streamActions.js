import {streamCont} from "./Content.js"
export function addStreamData(data) {
    return { type: streamCont.SEARCH_QUERY,data}
}
export function editSearchQuery(data) {
    return { type: streamCont.SEARCH_QUERY,data}
}
export function addStreamList(data) {
    return { type: streamCont.STREAM_LIST,data}
}
/*首包*/
export function addPackageQueryData(data) {
    return { type: streamCont.PACKAGE_QUERY_DATA,data}
}
export function addPackageData(data) {
    return { type: streamCont.PACKAGE_DATA,data}
}
//带宽&在线人数
export function addOnlineQueryData(data) {
    return { type: streamCont.ONLINE_QUERY_DATA,data}
}

export function addOnlineData(data) {
    return { type: streamCont.ONLINE_DATA,data}
}
