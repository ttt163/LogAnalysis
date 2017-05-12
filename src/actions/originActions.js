import {originCont} from "./Content.js"
export function addOriginData(data) {
    return { type: originCont.ORIGIN_DATA,data}
}
export function addQueryData(data) {
    return { type: originCont.ORIGIN_SEARCH_QUERY,data}
}
export function addOriginList(data) {
    return { type: originCont.ORIGIN_LIST,data}
}
//´ø¿í
export function addOriginBitData(data) {
    return { type: originCont.ORIGIN_BIT_DATA,data}
}
export function addSubBitData(data) {
    return { type: originCont.ORIGIN_SUB_BIT_DATA,data}
}
//×´Ì¬Âë
export function addOriginCodeData(data) {
    return { type: originCont.ORIGIN_CODE_DATA,data}
}
export function addSubCodeData(data) {
    return { type: originCont.ORIGIN_SUB_CODE_DATA,data}
}
