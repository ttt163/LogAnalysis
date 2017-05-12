import 'babel-polyfill'
import React,{withContext,PropTypes } from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route,routes , hashHistory,IndexRoute,browserHistory } from 'react-router';
import App from './containers/App'
//import Device from './containers/Device.js'
//import Test from './containers/Test.js'
import Login from './containers/Login.js'
import Channel from './containers/Channel.js'
import ChannelBit from './components/Channel.Bit.js'
import ChannelCode from './components/Channel.Code.js'
import ChannelDevList from './components/Channel.DevList.js'
import Stream from './containers/Stream.js'
import StreamPackage from './components/Stream.Package.js'
import StreamOnline from './components/Stream.Online.js'
import LinkInfo from './containers/LinkInfo.js'
import DeviceInfo from './containers/DeviceInfo.js'
import UserManagement from './containers/User.management.js'
//import UserPerson from './containers/User.person.js'
import ChannelContent from './components/Channel.content.js'
import StreamContent from "./components/Stream.content.js"
import Total from './containers/Total.js'
import OriginInfo from './containers/Origin.js'
import OriginContent from './components/origin.content.js'
import OriginBit from './components/origin.Bit.js'
import OriginCode from './components/origin.Code.js'
import IpBit from './components/origin.ip.bit.js'
import IpCode from './components/origin.ip.code.js'
import TestSup from './test/test.super.js'
import {store} from './allStore.js'
let rootElement = document.getElementById('app');
import {getCookieJson} from "./containers/App.js";

function isRole(nextState, replace) {
    var cookies=getCookieJson();
    if(cookies.userole!=1){
        //replaceState({ nextPathname: nextState.location.pathname }, '/login');
        replace('/login');
    }
}
function isLogin(nextState, replace) {
    var cookies=getCookieJson();
    if(!cookies||!cookies.loginStatus){
        replace('/login');
    }
}
//withContext({'name': 'Jonas'}, function () {
    //render(<TestSup />,rootElement);
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" onEnter={isLogin} component={App}>
                    {/*<IndexRoute component={Clms}/>*/}
                    <IndexRoute  component={Total}/>
                    {/* <Route path="/test" component={Test}/>*/}
                    <Route path="/user" onEnter={isRole} component={UserManagement}/>
                    {/*<Route path="/userPerson" component={UserPerson}/>*/}
                    <Route path="/channel" component={Channel}/>
                    <Route path="/channelCont" component={ChannelContent}>
                        <Route path="/channelCont/bit" component={ChannelBit}/>
                        <Route path="/channelCont/code" component={ChannelCode}/>
                        <Route path="/channelCont/bit/devList" component={ChannelDevList}/>
                    </Route>
                    <Route path="/stream" component={Stream}/>
                    <Route path="/streamCont" component={StreamContent}>
                        <Route path="/streamCont/package" component={StreamPackage}/>
                        <Route path="/streamCont/online" component={StreamOnline}/>
                    </Route>
                    <Route path="/originInfo" component={OriginInfo}/>
                    <Route path="/originCont" component={OriginContent}>
                        <Route path="/originCont/bit" component={OriginBit}/>
                        <Route path="/originCont/code" component={OriginCode}/>
                        <Route path="/originCont/bit/ipInfo" component={IpBit}/>
                        <Route path="/originCont/code/ipInfo" component={IpCode}/>
                    </Route>
                    <Route path="/linkInfo" component={LinkInfo}/>
                    <Route path="/devInfo" component={DeviceInfo}/>
                    {/*<Route path="/clms/clmsConfig(/:id)(/:type)" components={ClmsConfig}/>*/}
                </Route>
                <Route path="/super" component={TestSup} />
                <Route path="/login" component={Login}/>
            </Router>
        </Provider>,
        rootElement
    )
//})

