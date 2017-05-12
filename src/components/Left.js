import React, {Component,PropTypes} from 'react'
import { Link,IndexLink,browserHistory } from 'react-router';
import {getCookieJson} from "../containers/App.js";
export default class Left extends Component {
    render() {
        var user = getCookieJson();
        return (
            <div className="f-nav">
                <ul className='list-unstyled'>
                    <li className="f-unfold"></li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" onlyActiveOnIndex className='f-total' to="/">全局带宽统计</Link>
                    </li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" className='f-channel' to="/channel">频道信息查询</Link>
                    </li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" className='f-origin' to="/originInfo">回源信息查询</Link>
                    </li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" className='f-stream' to="/stream">流信息查询</Link>
                    </li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" className='f-link' to="/linkInfo">链接信息查询</Link>
                    </li>
                    <li className="f-sub">
                        <Link activeClassName="f-curr" className='f-device' to="/devInfo">设备信息查询</Link>
                    </li>
                    {!user || user.userole != 1 ? "" :
                        <li className="f-sub">
                            <Link activeClassName="f-curr" className='f-user' to="/user">账户管理</Link>
                        </li>}

                    {/* <li className="f-sub">
                     <a className='f-user' href='#'>账户管理 <i className='glyphicon glyphicon-menu-down'></i></a>
                     <ul className='list-unstyled f-placehold'>
                     <li><Link  activeClassName="f-curr" to="/user"><span>- </span>账户管理</Link></li>
                     {/!* <li><Link  activeClassName="f-curr" to="/userPerson"><span>- </span>个人用户</Link></li>*!/}
                     </ul>
                     </li>*/}

                </ul>
            </div>
        )
    }
}