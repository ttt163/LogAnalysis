import React,{PropTypes} from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {URL} from '../config.js'
import {addLoginData} from "../actions/userActions.js"
import '../public/plugs/jqueryMd5/jQuery.md5.js'
import Cookies from 'js-cookie'

class Login extends React.Component {
    constructor(state) {
        super(state);
    }
    _login(e){
        e.preventDefault();
        const {loginInfo,dispatch}=this.props;
        const _this=this;
        var thisTime=parseInt(new Date().getTime()/1000).toString();
        $.ajax({
            url:`${URL}/user/login`,
            type:'post',
            data:{"adduser":loginInfo.username,"addpasswd":$.md5(loginInfo.password+thisTime),"ckt":thisTime},
            async: false,  //默认为true 异步
            dataType: "json",
            error:function(error){
               // console.log(error);
                var data=$.parseJSON(error.responseText);
                dispatch(addLoginData({"error":data.info}));
            },
            success:function(data){
               // console.log(data);
                if(data.code==0){
                    //dispatch(addLoginData({"userole":data.data}));
                    var user={"loginStatus":true,"userole":data.data,"username":loginInfo.username,"password":loginInfo.password};
                    //document.cookie=JSON.stringify(user);
                    Cookies.set('userInfo', user);
                   _this.context.router.push("/");
                }else{
                    dispatch(addLoginData({"error":data.info}));
                }
            }
        });

    }

    componentWillUnmount() {
        const {dispatch}=this.props;
        dispatch(addLoginData({"error":"","password":""}));
    }
    render() {
        const {dispatch,loginInfo}=this.props;
        return(
            <div id="f-index">
                <div className="container">
                    <div className="f-iLogo"><a href=""></a></div>
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="f-login-ban"></div>
                        </div>
                        <div className="col-xs-6">
                            <h1>日志分析系统
                                <small>beta</small>
                            </h1>
                            <form  id="login">
                                <div className="f-iform">
                                    <div className="form-group  has-feedback">
                                        <span className="glyphicon glyphicon-user form-control-feedback"></span>
                                        <input type="text" className="form-control" value={loginInfo.username} name="username" placeholder="用户名"
                                            onChange={(e)=>dispatch(addLoginData({"username":e.target.value}))}
                                            />
                                    </div>
                                    <div className="form-group  has-feedback">
                                        <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                                        <input type="password" value={loginInfo.password} className="form-control" name="password" placeholder="密码"
                                               onChange={(e)=>dispatch(addLoginData({"password":e.target.value}))}
                                            />
                                    </div>
                                    <div className="form-group">
                                        <div className="error text-center">{loginInfo.error}</div>
                                        <button type="submit" onClick={(e)=>this._login(e)} className="btn btn-primary col-xs-12 f-mt10">登陆</button>
                                    </div>
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
   // console.log(state);
    return {
        "loginInfo":state.userReducer.loginInfo
    }
}
export default connect(getData)(Login);
Login.contextTypes = {
    router: PropTypes.object
}


