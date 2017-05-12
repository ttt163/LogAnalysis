import React, {Component,PropTypes} from 'react'
import { Radio } from 'antd';
const RadioGroup = Radio.Group;
import { connect } from 'react-redux'
import {addUserList,addUserInfo} from "../actions/userActions.js"
import {sendUserInfo,getUserList} from "../containers/User.management.js"
import {ShowDiag} from  "../public/js/f.js"
import {getCookieJson} from "../containers/App.js";
import ValidateItem from "./Validate.item.js"
import {validateField,validateAllFields} from "../public/js/validate/validateRform.js"
class serAdd extends Component {
    submitUser(e){
        e.preventDefault();
        const {userInfo,dispatch}=this.props;
        //var cookieData=$.parseJSON(document.cookie);
        if(!validateAllFields("userInfo")){
            //console.log("gggg");
            return;
        }
        var cookieData=getCookieJson();
        var thisTime=parseInt(new Date().getTime()/1000).toString();
        var jsonData={"ckt":thisTime,"username":cookieData.username,"password":$.md5(cookieData.password+thisTime)};
        //jsonData={...jsonData,...userInfo,"action":"add"};
        var backData=sendUserInfo({...jsonData,...userInfo,"action":"add"});
        if(backData.code==0){
            $("#user_add_modal").modal("hide");
            new ShowDiag({
                msg: !backData.info?'新增成功！':backData.info,
                closetime: 2
            });
            dispatch(addUserList({"list":getUserList({...jsonData,"uservalue":""})}));
        }else{
            new ShowDiag({
                msg: !backData.info?'新增失败！':backData.info,
                closetime: 2
            });
        }
    }
    render() {
        const {userInfo,dispatch,validator}=this.props;
        return (
            <div className="modal fade" id="user_add_modal" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <div className="m-close"></div>
                            </button>
                            <h4 className="modal-title">新增用户</h4>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal check f-formSet1">
                                <div className="form-group">
                                    <label className="col-xs-3 control-label"><span className="red">*</span>
                                        用户名:</label>

                                    <div className="col-xs-7">
                                        <ValidateItem validator={validator} thisForm="userInfo" field="adduser">
                                            <input className="form-control" value={userInfo.adduser}
                                                   onChange={(e)=>{dispatch(addUserInfo({"adduser":e.target.value}));validateField("userInfo","adduser",e.target.value);}} type="text" />
                                        </ValidateItem>
                                        </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label"><span className="red">*</span> 角色:</label>
                                    <div className="col-xs-7">
                                        <ValidateItem validator={validator} thisForm="userInfo" field="adduserole">
                                            <RadioGroup value={userInfo.adduserole} onChange={(e)=>{dispatch(addUserInfo({"adduserole":e.target.value}));validateField("userInfo","adduserole",e.target.value);}}>
                                                <Radio value="1">管理员</Radio>
                                                <Radio value="2">普通用户</Radio>
                                            </RadioGroup>
                                        </ValidateItem>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label pl5px"><span className="red">*</span>
                                        密码:</label>

                                    <div className="col-xs-7">
                                        <ValidateItem validator={validator} thisForm="userInfo" field="addpasswd">
                                            <input className="form-control" id="password" type="password"
                                                   value={userInfo.addpasswd} onChange={(e)=>{dispatch(addUserInfo({"addpasswd":e.target.value}));validateField("userInfo","addpasswd",e.target.value);}}
                                                />
                                        </ValidateItem>

                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3  control-label"><span className="red">*</span>
                                        重复密码:</label>
                                    <div className="col-xs-7">
                                        <ValidateItem validator={validator} thisForm="userInfo" field="repeatPassword">
                                            <input className="form-control" id="password" type="password"
                                                   value={userInfo.repeatPassword} onChange={(e)=>{dispatch(addUserInfo({"repeatPassword":e.target.value}));validateField("userInfo","repeatPassword",e.target.value);}}
                                                />
                                        </ValidateItem>

                                    </div>
                                </div>
                                <div className="form-group text-center">
                                    <div className="error"></div>
                                    <button type="submit" className="f-btn fbtn-ok" id="f-addcase1" onClick={(e)=>this.submitUser(e)}><span
                                        className="fbtn-ok-svg"></span> 提交
                                    </button>
                                    <button type="button" className="f-btn fbtn-miss ml15 f-resbtn"
                                            data-dismiss="modal"><span className="fbtn-miss-svg"></span> 取消
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function getData(state) {
    //console.log(state);
    return {
        "userInfo":state.userReducer.userInfo,
        "validator":state.validator_1
    }
}
export default connect(getData)(serAdd);