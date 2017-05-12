import React, {Component,PropTypes} from 'react'
import '../../node_modules/antd/dist/antd.css';
import '../public/plugs/bootstrap/css/bootstrap.css';
import '../public/plugs/bootstrap3-datetimepicker/datetimepicker/css/bootstrap-datetimepicker.min.css'
import "../public/css/f.css"
import "../public/css/common.css"
import $ from 'jquery';
import '../public/plugs/bootstrap/js/bootstrap';
import '../public/plugs/bootstrap3-datetimepicker/datetimepicker/js/bootstrap-datetimepicker.js'
import '../public/plugs/bootstrap3-datetimepicker/datetimepicker/js/bootstrap-datetimepicker.zh-CN.js'
import '../public/plugs/jqueryMd5/jQuery.md5.js'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Left from '../components/Left'
import DelModal from '../components/DelModal.js'
import Cookies from 'js-cookie'
import {Modal,aSide,fDrop} from "../public/js/f.js"
import Loading from '../components/Loading.js'
export function getCookieJson(){
    var cookie=Cookies.get("userInfo");
    return !cookie?{"loginStatus":false}:$.parseJSON(cookie);
}
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        aSide.init();
        fDrop.init();
        Modal();
    }
    render() {
        return (
            <div>
                <Header />
                <Left />
                <div className='f-page'>
                    {this.props.children}
                </div>
                <DelModal />
                <Footer />
                <Loading />
            </div>
        )
    }
}
App.contextTypes={
    router: PropTypes.object
};