import {addField,addValidate,addError,editField,addForm,addArrField,editArrField,addArrError,delArrField,
    addArrForm,clearArrForm,delArrForm,addArrformField,editArrFormField,addArrFormError,pushArrofrmArrField,
    editArrformArrField,addarrformArrError,delArrFormArrField,clearArrField,delForms,delField,delFromMsg,delForm} from "./action.js"
//import {store} from "../../../routes.js"
import {store} from "../../../allStore.js"
export function getForm(form) {
    var validator_1=store.getState().validator_1;
    if(validator_1[form]){
        return;
    }
        store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
}
export function clearFormData(form) {
    //store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
    store.dispatch(addValidate(form, {"valideMsg": {}, "fields": {}}));
}
export function delFormsFn(formArr) {
    //store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
    store.dispatch(delForms(formArr));
}
export function delFormFn(form) {
    //store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
    store.dispatch(delForm(form));
}
export function getFields(form,name, opt) {
    var validator_1=store.getState().validator_1;
    //console.log(validator_1[form]);
    if(!validator_1[form]){
        getForm(form);
        //return;
    }
    if(!validator_1[form].fields[name]){
        var data={
            [name]:opt
        }
        store.dispatch(addField(form,data));
    }
}
export function delFieldFn(form,field){
    store.dispatch(delField(form,field));
}
export function getFormFields(form,data){
    var validator_1=store.getState().validator_1;
    //console.log(validator_1[form]);
    if(!validator_1[form]){
        getForm(form);
        //return;
    }
    store.dispatch(addField(form,data));
}
export function getKeyField(form,name,key ,opt) {
    var validator_1=store.getState().validator_1;
    //console.log(validator_1[form]);
    if(!validator_1[form]){
        return;
    }
    if(!validator_1[form].fields[name]){
        store.dispatch(addField(form,{ [name]:[]}));
    }
    if(!validator_1[form].fields[name][key]){
       /* var data={
         [name]: [{[key]:opt}]
         }*/
        store.dispatch(addArrField(form,name,opt,key));
    }
}
export function editArrFieldValue(form,field,value,index){
    var validator_1=store.getState().validator_1;
    if(!validator_1[form]||!validator_1[form].fields||!validator_1[form].fields[field]){
        return;
    }
    if(validator_1[form].fields[field][index].value==value){
        return;
    }
    store.dispatch(editArrField(form,field,{"value":value},index));
}
export function validateArrField(form,field,value,index){
    store.dispatch(editArrField(form,field,{"value":value},index));
    var validator_1=store.getState().validator_1;
    var rule=validator_1[form].fields[field][index].rule,msg=validator_1[form].fields[field][index].msg,data={};
    // console.log(rule);
    if(!validator_1[form].valideMsg[field]){
        store.dispatch(addError(form,{[field]:[]}));
    }
    if(rule.required){
        if(!value){
            //console.log(msg.required);
            data={
                    "isValider":false,
                    "error":msg.required?msg.required:"不能为空"
            }
            //console.log(data);
            store.dispatch(addArrError(form,field,data,index));
            return;
        }else{
            data={
                    "isValider":true,
                    "error":""
            }
            //store.dispatch(addError(form,data))
            store.dispatch(addArrError(form,field,data,index));
        }
    }
    if(rule.regexp){
        if(!value){
            data={
                    "isValider":true,
                    "error":""
            }
            //store.dispatch(addError(form,data))
            store.dispatch(addArrError(form,field,data,index));
        }else{
            if(!rule.regexp.test(value)){
                data={
                        "isValider":false,
                        "error":msg.regexp?msg.regexp:"格式错误！"
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrError(form,field,data,index));
                return;
            }else{
                data={
                        "isValider":true,
                        "error":""
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrError(form,field,data,index));
            }

        }
    }
    if(rule.maxLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data));
            store.dispatch(addArrError(form,field,data,index));
        }else{
            if(value.length>rule.maxLen){
                data={
                        "isValider":false,
                        "error":msg.maxLen?msg.maxLen:"超出长度！"
                }
               // store.dispatch(addError(form,data));
                store.dispatch(addArrError(form,field,data,index));
                return;
            }else{
                data={
                        "isValider":true,
                        "error":""
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrError(form,field,data,index));
            }

        }
    }
    if(rule.minLen){
        if(!value){
            data={
                    "isValider":true,
                    "error":""
            }
            //store.dispatch(addError(form,data));
            store.dispatch(addArrError(form,field,data,index));
        }else{
            if(value.length<rule.minLen){
                data={
                        "isValider":false,
                        "error":msg.minLen?msg.minLen:"长度不够！"
                }
                //store.dispatch(addError(form,data));
                store.dispatch(addArrError(form,field,data,index));
                return;
            }else{
                data={
                        "isValider":true,
                        "error":""
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrError(form,field,data,index));
            }

        }
    }
    //不能重复
    if(rule.repeatd){
        if(!value){
            data={
                "isValider":true,
                "error":""
            }
            //store.dispatch(addError(form,data));
            store.dispatch(addArrError(form,field,data,index));
        }else{
            var thisFields=validator_1[form].fields[field];
            if(!thisFields){
                data={
                    "isValider":true,
                    "error":""
                }
                //store.dispatch(addError(form,data));
                store.dispatch(addArrError(form,field,data,index));
                return;
            }
            var isReapt=false;
            for(var i=0;i<thisFields.length;i++){
                if(thisFields[i].value==value&&i!=index){
                    data={
                        "isValider":false,
                        "error":msg.repeatd?msg.repeatd:"IP"+value+"重复！"
                    }
                    //store.dispatch(addError(form,data));
                    store.dispatch(addArrError(form,field,data,index));
                    isReapt=true;
                    break;
                }
            }
            if(!isReapt){
                data={
                    "isValider":true,
                    "error":""
                }
                //store.dispatch(addError(form,data));
                store.dispatch(addArrError(form,field,data,index));
            }
        }
    }
}
export function validateField(form,field,value){
    //console.log(field);console.log(value);
    store.dispatch(editField(form,field,{"value":value}));
    var validator_1=store.getState().validator_1,fields=validator_1[form].fields;
    var rule=fields[field].rule,msg=fields[field].msg,data={};
   // console.log(rule);
    //禁用不校验
    if(rule.disable){
        data={
            [field]:{
                "isValider":true,
                "error":""
            }
        }
        //console.log(data);
        store.dispatch(addError(form,data));
    }
    if(rule.required){
        if(!value){
           // console.log(msg.required);
            data={
                [field]:{
                    "isValider":false,
                    "error":msg.required?msg.required:"不能为空"
                }
            }
            //console.log(data);
            store.dispatch(addError(form,data));
            return;
        }else{
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            store.dispatch(addError(form,data))
        }
    }
    if(rule.regexp){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            store.dispatch(addError(form,data))
        }else{
            if(!rule.regexp.test(value)){
               // console.log(111);
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.regexp?msg.regexp:"格式错误！"
                    }
                }
                store.dispatch(addError(form,data))
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                store.dispatch(addError(form,data))
            }

        }
    }
    if(rule.maxLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            store.dispatch(addError(form,data));
        }else{
            if(value.length>rule.maxLen){
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.maxLen?msg.maxLen:"超出长度！"
                    }
                }
                store.dispatch(addError(form,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                store.dispatch(addError(form,data))
            }

        }
    }
    if(rule.minLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            store.dispatch(addError(form,data));
        }else{
            if(value.length<rule.minLen){
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.minLen?msg.minLen:"长度不够！"
                    }
                }
                store.dispatch(addError(form,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                store.dispatch(addError(form,data))
            }

        }
    }
    if(rule.eq){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            store.dispatch(addError(form,data));
        }else{
            if(value!=fields[rule.eq].value){
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.eq?msg.eq:"不相同！"
                    }
                };
                store.dispatch(addError(form,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                };
                store.dispatch(addError(form,data));
            }
        }
    }
}
export function validateAllFields(form){
    var fields=store.getState().validator_1[form].fields;
    //console.log(fields);
    for(var [k,v] of Object.entries(fields)){
        //console.log(v.value);
        //console.log(v instanceof Array);
        if(v instanceof Array){
            for(var i=0;i<v.length;i++){
                validateArrField(form,k,v[i].value,i);
            }
        }else{
            validateField(form,k,v.value);
        }

    }
    //return;
    var allIsvalider=true,valideMsg=store.getState().validator_1[form].valideMsg;
    //console.log(validator_1);
    for(var [k,v] of Object.entries(valideMsg)){
        //console.log(v.isValider);
        if(v instanceof Array){
            for(var i=0;i<v.length;i++){
                if(!v[i].isValider){
                    allIsvalider=false;
                    break;
                }
            }
        }else{
            if(!v.isValider){
                allIsvalider=false;
                break;
            }
        }

    }
    return allIsvalider;
}
export function delArrFieldFn(form,field,index){
    store.dispatch(delArrField(form,[{"field":field,"index":index}]))
}
export function clearArrFieldFn(form,field){
    store.dispatch(clearArrField(form,field));
}

//form数组
export function getArrForm(form,index) {
    var data={"fields":{},"valideMsg":{}},validator_1=store.getState().validator_1;
    if(!validator_1[form]||!validator_1[form][index]){
        store.dispatch(addArrForm(form,data));
    }
}
export function getArrFormField(form,index,field,opt){
    var validator_1=store.getState().validator_1;
    if(!validator_1[form]||!validator_1[form][index]){
        getArrForm(form,{"fields":{},"valideMsg":{}});
    }
    //console.log(validator_1);
    var validator=store.getState().validator_1;
    if(!validator[form][index].fields[field]){
        store.dispatch(addArrformField(form,index,opt));
    }

}
export function getArrFormFields(form,index,opt){
    var data={},validator_1=store.getState().validator_1;
    if(!validator_1[form]||!validator_1[form][index]){
        getArrForm(form,{"fields":{},"valideMsg":{}});
    }
    store.dispatch(addArrformField(form,index,opt));
}
export function clearArrFormFn(form) {
    //var data={"fields":{},"valideMsg":{}};
    store.dispatch(clearArrForm(form));
    //store.dispatch(addForm({[form]:{"fields":{},"valideMsg":{}}}));
    //var form={"form":[{"fields":{},"valideMsg":{}},{"fields":{},"valideMsg":{}}]};
}
export function delArrFormFn(form,index) {
    //var data={"fields":{},"valideMsg":{}};
    store.dispatch(delArrForm(form,index));
}
export function editArrformFieldMsg(form,field,index,data){
    var opt={
        [field]:{...data}
    }
    store.dispatch(addArrFormError(form,field,index,opt));
}
export function editArrformArrFieldsMsg(form,formIndex,field,index,data){
    store.dispatch(addarrformArrError(form,formIndex,field,data,index));
}
export function clearFromMsg(form,index){
    store.dispatch(delFromMsg(form,index));
}
export function validateArrformField(form,field,value,index){
    //console.log(field);console.log(value);
    store.dispatch(editArrFormField(form,field,index,{"value":value}));
    var validator_1=store.getState().validator_1;
    var rule=validator_1[form][index].fields[field].rule,msg=validator_1[form][index].fields[field].msg,data={};
    // console.log(rule);
    if(rule.required){
        if(!value){
            //console.log(msg.required);
            data={
                [field]:{
                    "isValider":false,
                    "error":msg.required?msg.required:"不能为空"
                }
            }
            //console.log(data);
            //store.dispatch(addError(form,data));
            store.dispatch(addArrFormError(form,field,index,data));
            return;
        }else{
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data))
            store.dispatch(addArrFormError(form,field,index,data));
        }
    }
    if(rule.regexp){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data))
            store.dispatch(addArrFormError(form,field,index,data));
        }else{
            if(!rule.regexp.test(value)){
                // console.log(111);
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.regexp?msg.regexp:"格式错误！"
                    }
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrFormError(form,field,index,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrFormError(form,field,index,data));
            }

        }
    }
    if(rule.maxLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data));
            store.dispatch(addArrFormError(form,field,index,data));
        }else{
            if(value.length>rule.maxLen){
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.maxLen?msg.maxLen:"超出长度！"
                    }
                }
               // store.dispatch(addError(form,data));
                store.dispatch(addArrFormError(form,field,index,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrFormError(form,field,index,data));
            }

        }
    }
    if(rule.minLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data));
            store.dispatch(addArrFormError(form,field,index,data));
        }else{
            if(value.length<rule.minLen){
                data={
                    [field]:{
                        "isValider":false,
                        "error":msg.minLen?msg.minLen:"长度不够！"
                    }
                }
                //store.dispatch(addError(form,data));
                store.dispatch(addArrFormError(form,field,index,data));
                return;
            }else{
                data={
                    [field]:{
                        "isValider":true,
                        "error":""
                    }
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addArrFormError(form,field,index,data));
            }

        }
    }
}
export function validateArrformAllFields(form,index){
    var fields=store.getState().validator_1[form][index].fields;
    //console.log(fields);
    for(var [k,v] of Object.entries(fields)){
        //console.log(v.value);
        //console.log(v instanceof Array);
        if(v instanceof Array){
            for(var i=0;i<v.length;i++){
                //validateArrField(form,k,v[i].value,i);
                validateArrformArrField(form,index,k,v[i].value,i);
            }
        }else{
            //validateField(form,k,v.value);
            validateArrformField(form,k,v.value,index);
        }

    }
    //return;
    var allIsvalider=true,valideMsg=store.getState().validator_1[form][index].valideMsg;
    //console.log(validator_1);
    for(var [k,v] of Object.entries(valideMsg)){
        //console.log(v.isValider);
        if(v instanceof Array){
            for(var i=0;i<v.length;i++){
                if(!v[i].isValider){
                    allIsvalider=false;
                    break;
                }
            }
        }else{
            if(!v.isValider){
                allIsvalider=false;
                break;
            }
        }

    }
    return allIsvalider;
}

export function getArrformArrField(form,formIndex,field,index ,opt) {
    var validator_1=store.getState().validator_1;
   // console.log(field);
    //console.log(form);
    //console.log(validator_1[form]);
    if(!validator_1[form]||!validator_1[form][formIndex]){
        return;
    }
   // console.log(validator_1[form][formIndex].fields[field]);
    if(!validator_1[form][formIndex].fields[field]){
        //store.dispatch(addField(form,{ [name]:[]}));
        store.dispatch(addArrformField(form,formIndex,{ [field]:[]}));
       // console.log("wwww");
    }
    if(!validator_1[form][formIndex].fields[field][index]){
        store.dispatch(pushArrofrmArrField(form,formIndex,field,index,opt));
    }
}
export function validateArrformArrField(form,formIndex,field,value,index){
    store.dispatch(editArrformArrField(form,formIndex,field,{"value":value},index));
    var validator_1=store.getState().validator_1;
    var rule=validator_1[form][formIndex].fields[field][index].rule,msg=validator_1[form][formIndex].fields[field][index].msg,data={};
    // console.log(rule);
    if(!validator_1[form][formIndex].valideMsg[field]){
        //store.dispatch(addError(form,{[field]:[]}));
        store.dispatch(addArrFormError(form,field,formIndex,{[field]:[]}));
    }
    if(rule.required){
        if(!value){
            //console.log(msg.required);
            data={
                "isValider":false,
                "error":msg.required?msg.required:"不能为空"
            }
            //console.log(data);
            store.dispatch(addarrformArrError(form,formIndex,field,data,index));
            return;
        }else{
            data={
                "isValider":true,
                "error":""
            }
            //store.dispatch(addError(form,data))
            //store.dispatch(addArrError(form,field,data,index));
            store.dispatch(addarrformArrError(form,formIndex,field,data,index));
        }
    }
    if(rule.regexp){
        if(!value){
            data={
                "isValider":true,
                "error":""
            }
            //store.dispatch(addError(form,data))
            //store.dispatch(addArrError(form,field,data,index));
            store.dispatch(addarrformArrError(form,formIndex,field,data,index));
        }else{
            if(!rule.regexp.test(value)){
                data={
                    "isValider":false,
                    "error":msg.regexp?msg.regexp:"格式错误！"
                }
                //store.dispatch(addError(form,data))
                //store.dispatch(addArrError(form,field,data,index));
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
                return;
            }else{
                data={
                    "isValider":true,
                    "error":""
                }
                //store.dispatch(addError(form,data))
                //store.dispatch(addArrError(form,field,data,index));
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
            }

        }
    }
    if(rule.maxLen){
        if(!value){
            data={
                [field]:{
                    "isValider":true,
                    "error":""
                }
            }
            //store.dispatch(addError(form,data));
            //store.dispatch(addArrError(form,field,data,index));
            store.dispatch(addarrformArrError(form,formIndex,field,data,index));
        }else{
            if(value.length>rule.maxLen){
                data={
                    "isValider":false,
                    "error":msg.maxLen?msg.maxLen:"超出长度！"
                }
                // store.dispatch(addError(form,data));
                //store.dispatch(addArrError(form,field,data,index));
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
                return;
            }else{
                data={
                    "isValider":true,
                    "error":""
                }
                //store.dispatch(addError(form,data))
                //store.dispatch(addArrError(form,field,data,index));
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
            }

        }
    }
    if(rule.minLen){
        if(!value){
            data={
                "isValider":true,
                "error":""
            }
            //store.dispatch(addError(form,data));
            //store.dispatch(addArrError(form,field,data,index));
            store.dispatch(addarrformArrError(form,formIndex,field,data,index));
        }else{
            if(value.length<rule.minLen){
                data={
                    "isValider":false,
                    "error":msg.minLen?msg.minLen:"长度不够！"
                }
                //store.dispatch(addError(form,data));
                //store.dispatch(addArrError(form,field,data,index));
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
                return;
            }else{
                data={
                    "isValider":true,
                    "error":""
                }
                //store.dispatch(addError(form,data))
                store.dispatch(addarrformArrError(form,formIndex,field,data,index));
               // store.dispatch(addArrError(form,field,data,index));
            }

        }
    }
    //console.log(store.getState().validator_1[form][formIndex].formIndex.valideMsg[field]);
}
export function delArrformArrField(form,formIndex,field,index){
    store.dispatch(delArrFormArrField(form,formIndex,field,index));
}
/*export function delArrFormFn(form,index) {
    store.dispatch(delArrForm(form,index));
}*/
/*
 import {validateField,getFields,validateAllFields} from "../public/js/validate/validateRform.js"
 import ValidateItem from "./Validate.item.js"
 validateArrField("addDevice",name,e.target.value,index);
 validateField("addDevice",name,value);
 <ValidateItem validator={validator} thisForm="editDevice" field="name">

 </ValidateItem>

 getFields("name",{
 "value":!dev.name?"":dev.name,
 "rule": {"required": true,"regexp": /[0-9]+$/},
 "msg": {"required": "设备名不能为空","regexp": "设备名格式错误！"}
 });

 <div className={!validator||!validator.valideMsg||!validator.valideMsg["ip"+this.props.index]||validator.valideMsg["ip"+this.props.index].isValider?"":"has-error"}>
 <input type="text" value={this.props.ip} onChange={this.props.editIpsDataFn}  className="form-control devip-item" name={"dev-ip-"+this.props.index}/>
 <div style={{"textAlign":"left"}}>{!validator||!validator.valideMsg||!validator.valideMsg["ip"+this.props.index]||validator.valideMsg["ip"+this.props.index].isValider?"":validator.valideMsg["ip"+this.props.index].error}</div>
 </div>




var opt = {
    fields: {
        "name": {
            "rule": {
                "require": true,
                "regexp": /[0-9]+$/
            },
            "msg": {
                "require": "不能为空",
                "regexp": "格式错误！"
            }
        },
        "role": {
            "rule": {
                "require": true
            },
            "msg": {
                "require": "角色不能为空"
            }
        }
    },
    valideFilter:{
        "name":{
            isValider:false,
            error:"不能为空",
        },
        "role":{
            isValider:false,
            error:"不能为空",
        }
    }
}*/