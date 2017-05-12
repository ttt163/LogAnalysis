import {channelCont} from "./Content.js"
export function addChannelData(data) {
    return { type: channelCont.CHANNEL_DATA,data}
}
export function addQueryData(data) {
    return { type: channelCont.CHANNEL_SEARCH_QUERY,data}
}
export function addChannelList(data) {
    return { type: channelCont.CHANNEL_LIST,data}
}
//带宽
export function addChannelBitData(data) {
    return { type: channelCont.CHANNEL_BIT_DATA,data}
}
export function addBitQueryData(data) {
    return { type: channelCont.CHANNEL_BIT_QUERY,data}
}
//状态码
export function addChannelCodeData(data) {
    return { type: channelCont.CHANNEL_CODE_DATA,data}
}
export function addCodeQueryData(data) {
    return { type: channelCont.CHANNEL_CODE_QUERY,data}
}
export function eidtIspIsShow(isp,data) {
    return { type: channelCont.CHANNEL_CODE_ISP,isp,data}
}
export function editDevList(data,index) {
    return { type: channelCont.EDIT_CHANNEL_DEVICE,index,data}
}
//全局带宽
export function addChannelTotalData(data) {
    return { type: channelCont.CHANNEL_TOTAL_DATA,data}
}
export function addTotalQueryData(data) {
    return { type: channelCont.CHANNEL_TOTAL_QUERY,data}
}