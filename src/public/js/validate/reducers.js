/**
 * Created by Administrator on 2016/11/1.
 */
import { ADD_FORM,ADD_FIELD,ADD_VALIDATE_MSG,EDIT_FIELD,ADD_VALIDATE,DEL_FIELD,ADD_FIELD_ARR,EDIT_FIELD_ARR,ADD_ERROR_ARR,DEL_FIELD_ARR,
    ADD_FORM_ARR,DEL_FORM_ARR,CLEAR_FORM_ARR,ADD_FORM_ARR_FIELD,EDIT_FORM_ARR_FIELD,ADD_FORM_ARR_VALIDATE_MSG,PUSH_FORM_ARR_ARR_FIELD,
    DEIT_FORM_ARR_ARR_FIELD,ADD_FORM_ARR_ARR_ERROR,DEL_FORM_ARR_ARR_FIELD,DEL_FORMS,DEL_FORM_FORM_MSG,DEL_FORM} from './action.js'
export default function validator_1(state = {}, action) {
    switch (action.type) {
        case ADD_FORM:
            var _data=action.data;
            return {...state,..._data};
        case DEL_FORM:
            var form=action.form;
            delete state[form];
            return {...state};
        case DEL_FORMS:
            var _data=action.data;
            for(var i=0;i<_data.length;i++){
                delete (state[_data[i]]);
            }
            //console.log(state);
            return {...state};

        case ADD_VALIDATE:
            var thisForm=state[action.form], _data=action.data;
            state[action.form]={...thisForm,..._data}
            return {...state};
        case ADD_FIELD:
            //console.log(action.form);
            var thisForm=state[action.form], _data = action.data,fields=thisForm.fields;
            //console.log(thisForm);
            state[action.form].fields={...fields,..._data};
            return {...state};
        case DEL_FIELD:
            var thisForm=state[action.form],fields=thisForm.fields,valideMsg=thisForm.valideMsg;
            delete(fields[action.field]);
            if(valideMsg[action.field]){
                delete(valideMsg[action.field]);
            }

            state[action.form]={"fields":fields,"valideMsg":valideMsg};
           // console.log(state);
            return {...state};
        case EDIT_FIELD:
            //console.log(typeof action.form);
            var thisForm=state[action.form], _data=action.data, field=thisForm.fields[action.field];
            state[action.form].fields[action.field]={...field,..._data};
            //console.log({...state});
            return {...state};
        case ADD_VALIDATE_MSG:
            var thisForm=state[action.form], _data = action.data,valMsg=state[action.form].valideMsg;
            state[action.form].valideMsg={...valMsg,..._data};
            return {...state};
        case ADD_FIELD_ARR:
            var thisForm=state[action.form], _data = action.data,field=thisForm.fields[action.field];
           // console.log(action.index);
            state[action.form].fields[action.field]=[
                ...field.slice(0,action.index),
                {..._data},
                ...field.slice(action.index+1)
            ]
            //console.log(field);
            //state[action.form].fields[action.field]=field;
            return {...state};
        case EDIT_FIELD_ARR:
            var thisForm=state[action.form],field=thisForm.fields[action.field],thisField=field[action.index],_data=action.data;
            thisField={...thisField,..._data};
            state[action.form].fields[action.field]=[
                ...field.slice(0,action.index),
                thisField,
                ...field.slice(action.index+1)
            ]
            //console.log(state[action.form].fields[action.field]);
            return {...state};
        case ADD_ERROR_ARR:
            var thisForm=state[action.form],fieldMsg=thisForm.valideMsg[action.field];
            if(!fieldMsg){
                return {...state};
            }
            var thisFieldMsg=fieldMsg[action.index],_data=action.data;
            thisFieldMsg={...thisField,..._data};
            state[action.form].valideMsg[action.field]=[
                ...fieldMsg.slice(0,action.index),
                thisFieldMsg,
                ...fieldMsg.slice(action.index+1)
            ]
            //console.log(state[action.form].valideMsg);
            return {...state};
        case DEL_FIELD_ARR:
            var thisForm=state[action.form],_data=action.data;
            for(var i=0;i<_data.length;i++){
                var field=thisForm.fields[_data[i].field],fieldMsg=thisForm.valideMsg[_data[i].field];
               // console.log(fieldMsg);
                state[action.form].fields[_data[i].field]=[
                    ...field.slice(0,_data[i].index),
                    ...field.slice(_data[i].index+1)
                ]
                if(fieldMsg){
                    state[action.form].valideMsg[_data[i].field]=[
                        ...fieldMsg.slice(0,_data[i].index),
                        ...fieldMsg.slice(_data[i].index+1)
                    ]
                }

            }
            //console.log({...state});
            return {...state};

        case ADD_FORM_ARR:
            //var thisForm=state[action.form],fieldMsg=thisForm.valideMsg[action.field],thisFieldMsg=fieldMsg[action.index],_data=action.data;
            if(!state[action.form]){
                var data={[action.form]:[]};
                state={...state,...data}
            }
            state[action.form].push(action.data);
            return {...state};
        case ADD_FORM_ARR_FIELD:
            //console.log(action.index);
            //console.log(state[action.form]);
            var form=state[action.form],thisForm=form[action.index],fields=thisForm.fields,_data=action.data;
            state[action.form][action.index].fields={...fields,..._data};
            return {...state};
        case CLEAR_FORM_ARR:
            //state[action.form]=[];
            delete (state[action.form]);
            //console.log(state);
            return {...state};
        case DEL_FORM_ARR:
            var _form=state[action.form];
            //console.log(state);
            //console.log(!_form);
            if(!_form){
                return {...state};
            }
           /* _form[action.index].fields={};
            if( _form[action.index].valideMsg){
                _form[action.index].fields={};
            }*/
            state[action.form]=[..._form.slice(0,action.index),..._form.slice(action.index+1)];
            return {...state};
        case EDIT_FORM_ARR_FIELD:
            var form=state[action.form],thisForm=form[action.index],fields=thisForm.fields,thisField=fields[action.field],_data=action.data;
            state[action.form][action.index].fields[action.field]={...thisField,..._data};
            return {...state};
        case ADD_FORM_ARR_VALIDATE_MSG:
            var form=state[action.form],_thisForm=form[action.index], _data = action.data,valMsg=_thisForm.valideMsg;
            state[action.form][action.index].valideMsg={...valMsg,..._data};
            return {...state};
        case PUSH_FORM_ARR_ARR_FIELD:
            //var form=state[action.form],_thisForm=form[action.formIndex],fields=_thisForm.fields,thisField=fields[action.field], _data = action.data;
            //thisField={...thisField,..._data};
            var _data = action.data;
            state[action.form][action.formIndex].fields[action.field].push(_data);
            return {...state};
        case DEIT_FORM_ARR_ARR_FIELD:
            var form=state[action.form],thisForm=form[action.formIndex],fields=thisForm.fields,thisField=fields[action.field][action.index],_data=action.data;
            state[action.form][action.formIndex].fields[action.field][action.index]={...thisField,..._data};
            return {...state};
        case ADD_FORM_ARR_ARR_ERROR:
            var form=state[action.form],thisForm=form[action.formIndex],valMsg=thisForm.valideMsg,msgField=valMsg[action.field];
            if(!msgField){
                return {...state};
            }
            var thisMsgField=msgField[action.index],_data=action.data;
            //state[action.form][action.index].valideMsg[action.field][action.index]={...thisField,..._data};
            thisMsgField={...thisMsgField,..._data};
           // console.log(action.index);
            if(msgField.length<action.index){
                for(var i=0;i<action.index;i++){
                    msgField=[...msgField,{
                        "isValider":true,
                        "error":""}]
                }
            }
           //console.log(msgField);
            state[action.form][action.formIndex].valideMsg[action.field]=[
                ...msgField.slice(0,action.index),
                thisMsgField,
                ...msgField.slice(action.index+1)
            ]
            return {...state};
        case DEL_FORM_ARR_ARR_FIELD:
            var form=state[action.form];
            if(!form||!form[action.formIndex]){
                return state;
            }
            var thisForm=form[action.formIndex],fields=thisForm.fields,thisFields=fields[action.field],valideMsg=thisForm.valideMsg;
            state[action.form][action.formIndex].fields[action.field]=[
                ...thisFields.slice(0,action.index),
                ...thisFields.slice(action.index+1)
            ];
            if(!valideMsg||!valideMsg[action.field]||!valideMsg[action.field].length){
                return {...state};
            }
                var thisValideMsg=valideMsg[action.field];
                state[action.form][action.formIndex].valideMsg[action.field]=[
                    ...thisValideMsg.slice(0,action.index),
                    ...thisValideMsg.slice(action.index+1)
                ];
            return {...state};
        case DEL_FORM_FORM_MSG:
            var _form=action.form,index=action.index;
            if(state[_form] instanceof Array){
                if(!state[_form][index]){
                    for(var i=0;i<state[_form].length;i++){
                        //state[_form][i].valideMsg=[];
                        if(state[_form][i].valideMsg){
                            var formMsg= state[_form][i].valideMsg;
                            for (var [key, item] of Object.entries(formMsg)) {
                                if(formMsg[key]  instanceof Array){
                                    for(var j=0;j<formMsg[key].length;j++){
                                        state[_form][i].valideMsg[key][j]={
                                            "isValider":true,
                                            "error":""
                                        }
                                    }
                                }else{
                                    state[_form][i].valideMsg[key]={
                                        "isValider":true,
                                        "error":""
                                    }
                                }

                            }
                        }

                    }
                }else{
                    //state[_form][index].valideMsg=[];
                    var formMsg= state[_form][index].valideMsg;
                    for (var [key, item] of Object.entries(formMsg)) {
                        if(formMsg[key]  instanceof Array){
                            for(var i=0;i<formMsg[key].length;i++){
                                state[_form][index].valideMsg[key][i]={
                                    "isValider":true,
                                    "error":""
                                }
                            }
                        }else{
                            state[_form][index].valideMsg[key]={
                                "isValider":true,
                                "error":""
                            }
                        }

                    }

                }

            }else{
                var formMsg= state[_form].valideMsg;
                for (var [key, item] of Object.entries(formMsg)) {
                    if(formMsg[key]  instanceof Array){
                        for(var i=0;i<formMsg[key].length;i++){
                            state[_form].valideMsg[key][i]={
                                "isValider":true,
                                "error":""
                            }
                        }
                    }else{
                        state[_form].valideMsg[key]={
                            "isValider":true,
                            "error":""
                        }
                    }

                }
                //state[_form].valideMsg=[];
            }
            return {...state};
        default:
            return state
    }
}