import React, { Component, PropTypes } from 'react'
import $ from 'jquery';
import EditPwd from './User.editPwd.js'
import {formCheck} from'../public/js/f.js'
export default class Footer extends Component {
   /* componentDidMount(){
            var $resetpwd = $('.f-edit-psw'), //重置密码按钮
                $resetpweModal = $('#f-editPsw-modal'); //重置密码模态框
            //重置密码模态框
            $resetpwd.on('click', function () {
                var user =JSON.parse(document.cookie);
                $resetpweModal.find('input[name="id"]').val(user.userId);
                $resetpweModal.modal('show');
                var rules = {
                    'oldPwd':{
                        required:true,
                        psw:true
                    },
                    'password':{
                        required:true,
                        psw:true
                    },
                    'rpassword':{
                        required:true,
                        equalTo:"#newspwP"
                    }
                }, msg = {
                    'oldPwd':{
                        required:'请填写原密码'
                    },
                    'password':{
                        required:"请填写密码"
                    },
                    'rpassword':{
                        required:"请填写密码",
                        equalTo:"两次密码输入不一致"
                    }
                }, url = '/UpdatePassword';
                formCheck('#setPwd', rules, msg, url,'resetPassword');
            });
    }*/
    render() {
        return (
            <div>
                {/*侧边栏收缩后的提示*/}
                <div id="f-tip">
                    <div className="f-tip">
                        <div className="arrow"></div>
                        <span className='arrow-txt'></span>
                    </div>
                </div>
                <div id="fdiag">
                    <div id="lbOverlay"></div>
                    <div id="lbCenter"><span></span></div>
                </div>
                <EditPwd />
            </div>
        )
    }
}
