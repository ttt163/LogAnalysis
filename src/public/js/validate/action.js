
export const DEL_FORM="DEL_FORM";
export const ADD_FORM="ADD_FORM";
export const ADD_FIELD="ADD_FIELD";
export const EDIT_FIELD="EDIT_FIELD";
export const ADD_VALIDATE_MSG="ADD_VALIDATE_MSG";
export const ADD_VALIDATE="ADD_VALIDATE";
export const DEL_FIELD="DEL_FIELD";
export const ADD_FIELD_ARR="ADD_FIELD_ARR";
export const EDIT_FIELD_ARR="EDIT_FIELD_ARR";
export const ADD_ERROR_ARR="ADD_ERROR_ARR";
export const DEL_FIELD_ARR="DEL_FIELD_ARR";
export const DEL_FORMS="DEL_FORMS";


export const ADD_FORM_ARR="ADD_FORM_ARR";
export const CLEAR_FORM_ARR="CLEAR_FORM_ARR";
export const DEL_FORM_ARR="DEL_FORM_ARR";
export const ADD_FORM_ARR_FIELD="ADD_FORM_ARR_FIELD";
export const EDIT_FORM_ARR_FIELD="EDIT_FORM_ARR_FIELD";
export const ADD_FORM_ARR_VALIDATE_MSG="ADD_FORM_ARR_VALIDATE_MSG";
export const PUSH_FORM_ARR_ARR_FIELD="PUSH_FORM_ARR_ARR_FIELD";
export const DEIT_FORM_ARR_ARR_FIELD="DEIT_FORM_ARR_ARR_FIELD";
export const ADD_FORM_ARR_ARR_ERROR="ADD_FORM_ARR_ARR_ERROR";
export const DEL_FORM_ARR_ARR_FIELD="DEL_FORM_ARR_ARR_FIELD";
export const DEL_FORM_FORM_MSG="DEL_FORM_FORM_MSG"

export function addForm(data){
    return { type: ADD_FORM,data}
}
export function delForm(form){
    return { type: DEL_FORM,form}
}
export function delForms(data){
    return { type: DEL_FORMS,data}
}
export function addField(form,data) {
    return { type: ADD_FIELD,data,form}
}
export function delField(form,field) {
    return { type: DEL_FIELD,form,field}
}
export function addError(form,data) {
    return { type: ADD_VALIDATE_MSG,data,form}
}
export function editField(form,field,data) {
    return { type: EDIT_FIELD,field,data,form}
}
export function addValidate(form,data) {
    return { type: ADD_VALIDATE,data,form}
}
export function addArrField(form,field,data,index){
    return { type: ADD_FIELD_ARR,data,form,field,index}
}
export function editArrField(form,field,data,index){
    return { type: EDIT_FIELD_ARR,data,form,field,index}
}
export function addArrError(form,field,data,index){
    return { type: ADD_ERROR_ARR,data,form,field,index}
}
export function delArrField(form,data) {
    return { type: DEL_FIELD_ARR,form,data}
}
/*export function clearArrField(form,field) {
    return { type: CLEAR_FIELD_ARR,form,data}
}*/
//数组form校验
export function addArrForm(form,data) {
    return { type: ADD_FORM_ARR,form,data}
}
export function clearArrForm(form){
    return { type: CLEAR_FORM_ARR,form}
}
export function delArrForm(form,index){
    return { type: DEL_FORM_ARR,form,index}
}
export function addArrformField(form ,index,data){
    return { type: ADD_FORM_ARR_FIELD,form,index,data}
}
export function editArrFormField(form,field,index,data){
    return { type: EDIT_FORM_ARR_FIELD,form,field,index,data}
}
export function addArrFormError(form,field,index,data){
    return {type:ADD_FORM_ARR_VALIDATE_MSG,form,field,index,data}
}
export function pushArrofrmArrField(form,formIndex,field,index,data){
    return {type:PUSH_FORM_ARR_ARR_FIELD,form,formIndex,field,index,data}
}
export function editArrformArrField(form,formIndex,field,data,index){
    return {type:DEIT_FORM_ARR_ARR_FIELD,form,formIndex,field,data,index}
}
export function addarrformArrError(form,formIndex,field,data,index){
    return {type:ADD_FORM_ARR_ARR_ERROR,form,formIndex,field,data,index}
}
export function delArrFormArrField(form,formIndex,field,index){
    return {type:DEL_FORM_ARR_ARR_FIELD,form,formIndex,field,index}
}
//清除from验证信息
export function delFromMsg(form,index){
    return {type:DEL_FORM_FORM_MSG,form,index}
}

