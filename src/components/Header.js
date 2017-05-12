import React, {Component,PropTypes} from 'react'
import { Link} from 'react-router';
import imgFace from '../public/images/face.jpg';
import {getCookieJson} from "../containers/App.js";
import Cookies from 'js-cookie'
export default class Header extends Component {
	constructor(state){
		super(state);
		/*this.state={
			name:''
		}*/
	}
	/*componentDidMount(){
		$('#log_out').on('click',function(){
			document.cookie='';
			window.location.href='#/login';
		});
	}*/
	/*editPassword(){
		$("#edit_password_modal").modal();
}*/
	exit(){
		var user=getCookieJson();
		//var user={"loginStatus":true,"userole":data.data,"username":loginInfo.username,"password":loginInfo.password};
		//document.cookie=JSON.stringify(user);
		Cookies.set('userInfo', {...user,"loginStatus":false});
		this.context.router.push("/login");
	}
	render() {
		//var user=JSON.parse(document.cookie);
		var user=getCookieJson();
		return (
			<div className="f-header">
				<h1>日志分析系统</h1>
				<ul className='f-login list-inline'>
					<li className='f-face'><img src={imgFace} /></li>
						<li>您好,{!user|!user.username?"":user.username}</li>
					{/*<li><a href="javascript:;" className="f-edit-psw" onClick={()=>this.editPassword()}>修改密码</a></li>*/}
						<li><span className='glyphicon glyphicon-off mr10'></span>
							<a href="javascript:;" onClick={()=>this.exit()} >退出</a>
						</li>
					</ul>
				</div>
		)
	}
}
Header.contextTypes={
	router: PropTypes.object
}