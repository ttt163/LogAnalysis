//import '../public/plugs/bootstrap/css/bootstrap.css';
//import "../public/css/f.css"
//import  '../css/main.css';
import React from 'react'
import { render } from 'react-dom'
import {ShowDiag} from  "../public/js/f.js"
import UserAdd from '../components/User.add.js'
import ManagementEdit from '../components/User.manage.edit.js'
import ResetPwd from '../components/User.resetPwd.js'
import { URL } from '../config.js';
import { connect } from 'react-redux'
import {addUserList,addUserInfo,delUserData} from "../actions/userActions.js"
import {getCookieJson} from "./App.js";
import {getFormFields,delFormFn} from "../public/js/validate/validateRform.js"
import { Select } from 'antd';
import {loadingShow,loadingHide} from "../components/Loading.js"
const Option = Select.Option;
//用户列表
export function getUserList(jsonData){
    var data=[];
    $.ajax({
        url:`${URL}/user/getList`,
        type:'post',
        data:jsonData,
        async: false,  //默认为true 异步
        dataType: "json",
        error:function(error){
            //var data=$.parseJSON(error.responseText);
            return data;
            /*new ShowDiag({
                msg: !data.info.warning?'操作失败！':data.info.warning,
                closetime: 2
            });*/
        },
        success:function(res){
            if(res.code==0){
                data=res.data;
            }else{
                return data;
            }
        }
    });
    return data;
}
//添加/修改用户
export function sendUserInfo(jsonData){
    var data={};
    $.ajax({
        url:`${URL}/user/edit`,
        type:'post',
        data:jsonData,
        async: false,  //默认为true 异步
        dataType: "json",
        error:function(error){
            //var data=$.parseJSON(error.responseText);
            data= $.parseJSON(error.responseText);
        },
        success:function(res){
            data=res;
        }
    });
    return data;
}
class UserManagement extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch}=this.props;
        //var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData=getCookieJson();
                var thisTime=parseInt(new Date().getTime()/1000).toString();
                var jsonData={"ckt":thisTime,"username":cookieData.username,"password":$.md5(cookieData.password+thisTime)};
                jsonData={...jsonData,"uservalue":""};
                dispatch(addUserList({"list":getUserList(jsonData)}));
                $("#user_add_modal").on("hidden.bs.modal",function() {
                    delFormFn("userInfo");
                });
                $("#user_edit_modal").on("hidden.bs.modal",function() {
                    delFormFn("userInfo");
                });
                loadingHide();
            }, 10);
        });

    }

    /*resetPws(){
        $("#reset_password_modal").modal();
    }*/
    editUser(index){
        const {userList,dispatch}=this.props;
        var _thisData=userList.list[index];
        dispatch(addUserInfo({"adduser":_thisData.name,"adduserole":_thisData.userole+"","addpasswd":"","repeatPassword":""}));
        $("#user_edit_modal").modal();
        getFormFields("userInfo", {
            "adduser": {
                "value": _thisData.name,
                "rule": {"required": true},
                "msg": {"required": "请输入用户名！"}
            },"adduserole": {
                "value":_thisData.userole+"",
                "rule": {"required": true},
                "msg": {"required": "请选择用户角色！"}
            },"addpasswd": {
                "value": "",
                "rule": {"required": true},
                "msg": {"required": "请输入用户密码！"}
            },"repeatPassword": {
                "value": "",
                "rule": {"required": true,"eq":"addpasswd"},
                "msg": {"required": "请再次输入密码","eq":"两次密码不一致！"}
            }
        });
    }
    addUser(){
        const {dispatch}=this.props;
        dispatch(addUserInfo({"adduser":"","adduserole":"","addpasswd":"","repeatPassword":""}));
        $("#user_add_modal").modal();
        getFormFields("userInfo", {
            "adduser": {
                "value": "",
                "rule": {"required": true},
                "msg": {"required": "请输入用户名！"}
            },"adduserole": {
                "value": "",
                "rule": {"required": true},
                "msg": {"required": "请选择用户角色！"}
            },"addpasswd": {
                "value": "",
                "rule": {"required": true},
                "msg": {"required": "请输入用户密码！"}
            },"repeatPassword": {
                "value": "",
                "rule": {"required": true,"eq":"addpasswd"},
                "msg": {"required": "请再次输入密码","eq":"两次密码不一致！"}
            }
        });
    }
    //删除用户
    delUser(name,index){
        const {dispatch}=this.props;
        //var cookieData=$.parseJSON(document.cookie);
        var cookieData=getCookieJson();
        var thisTime=parseInt(new Date().getTime()/1000).toString();
        var jsonData={"ckt":thisTime,"username":cookieData.username,"password":$.md5(cookieData.password+thisTime)};
        Modal.confirm({
            msg: '确认要删除' + name + '吗？',
            title: "删除",
            btnok: "确定",
            btncl: "取消"
        }).on(function(e) {
            if (e) {
                $.ajax({
                    url:`${URL}/user/delete`,
                    type:'post',
                    data:{...jsonData,"adduser":name},
                    async: false,  //默认为true 异步
                    dataType: "json",
                    error:function(error){
                        var data=$.parseJSON(error.responseText);
                        new ShowDiag({
                            msg: !data.info?'删除失败！':data.info,
                            closetime: 2
                        });
                    },
                    success:function(data){
                        if(data.code==0){
                            new ShowDiag({
                                msg: !data.info?'删除成功！':data.info,
                                closetime: 2
                            });
                            dispatch(delUserData(index));
                        }else{
                            new ShowDiag({
                                msg: !data.info?'删除失败！':data.info,
                                closetime: 2
                            });
                        }

                    }
                });
            }
        })
    }
    render() {
        const {userList}=this.props;
        return (
            <div>
                <div className="f-box list-box">
                    <div className="f-gradient">
                        <div className="row" style={{"lineHeight":"40px"}}>
                            <div className="col-xs-1" style={{"paddingLeft": "20px"}}><h4>用户列表</h4></div>
                            <div className="col-xs-1">共{!userList.list||!userList.list.length?0:userList.list.length}个记录</div>
                            <div className="col-xs-3">每页显示
                                <Select defaultValue="10" style={{"width": "80px","display": "inline-block","margin": "0px 5px","height": "30px","verticalAlign": "middle"}} allowClear>
                                    <Option value="10">10</Option>
                                    <Option value="20">20</Option>
                                    <Option value="30">30</Option>
                                </Select>
                                个</div>
                            <div className="col-xs-offset-6 col-xs-1"><button className="btn t-btn" onClick={()=>this.addUser()}>新增</button></div>
                        </div>
                    </div>

                    <div className="table-responsive" >
                        <table className="table f-table table-bordered table-striped table-hover">
                            <thead>
                            <tr>
                                <th style={{"width":"30%"}}>用户名</th>
                                <th style={{"width":"30%"}}>角色</th>
                                <th style={{"width":"40%"}}>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!userList.list||!userList.list.length?<tr><td colSpan="3" className="text-center">暂无数据！</td></tr>:
                                userList.list.map((item,index)=>(
                                    <tr key={index}>
                                        <td className="text-center">{item.name}</td>
                                        <td className="text-center">{item.userole==1?"管理员":"普通用户"}</td>
                                        <td className="text-center td-a">
                                            <a href="javascript:void(0);" className="edit-user" onClick={()=>this.editUser(index)}>编辑</a>
                                            <a href="javascript:void(0);" style={{"margin":" 0px 20px"}} onClick={()=>this.delUser(item.name,index)}>删除</a>
                                        </td>
                                    </tr>
                                ))
                            }
                            {/*<tr>
                                <td className="text-center">admin2</td>
                                <td className="text-center">管理员</td>
                                <td className="text-center td-a">
                                    <a href="javascript:void(0);" className="edit-user" onClick={()=>this.editUser()}>编辑</a>
                                    <a href="javascript:void(0);" style={{"margin":" 0px 20px"}}>删除</a>
                                    <a href="javascript:void(0);" className="reset-psw" onClick={()=>this.resetPws()}>重置</a>
                                </td>
                            </tr>*/}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*添加*/}
                <UserAdd />
                {/*编辑*/}
                <ManagementEdit />
                    {/*重置密码*/}
                <ResetPwd />
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "userList":state.userReducer.userList
    }
}
export default connect(getData)(UserManagement);
