import {userCont,loadingCont,SHOWNOTIFICATION,HIDENOTIFICATION} from "./Content.js"
export function addLoginData(data) {
    return { type: userCont.LOGIN,data}
}
export function addUserList(data) {
    return { type: userCont.USERLIST,data}
}
export function addUserInfo(data) {
    return { type: userCont.EDITUSER,data}
}
export function delUserData(index) {
    return { type: userCont.DELUSER,index}
}
/*export function addLoadingData(data) {
    return { type: loadingCont.LOADINGSTATE,data}
}*/
function showNotification(id, text) { return { type: 'SHOWNOTIFICATION', id, text } }
function hideNotification(id) { return { type: 'HIDENOTIFICATION', id } }

export function showNotificationWithTimeout(text) {
    return function (dispatch,getState) {
        const id = nextNotificationId++ ;
        dispatch(showNotification(id, text));

    setTimeout(() => {
        console.log(getState().userReducer.loginInfo);
        dispatch(hideNotification(id))
    }, 5000)
}
}



