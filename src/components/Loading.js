import React, { Component, PropTypes } from 'react'
//import { connect } from 'react-redux'
//import ReactDOM  from 'react-dom'
import "../public/css/loading.css"
//import {addLoadingData} from  "../actions/userActions.js"
//import {store} from "../allStore.js"
/*export function loadingShow(opt){
    var _status=opt=="hide"?false:true;
    console.log(_status);
    /!*if(_status){

        $(".loading").css({"display":"block"});
    }else{
        $(".loading").css({"display":"none"});
    }*!/
   // console.log(_status);
    store.dispatch(addLoadingData({"status":_status}));
}*/
/*export function loadingHide(){
    const {dispatch}=this.props;
    dispatch(addLoadingData({"status":false}));  style={{"display":!loadingData.status?"none":"block"}}
}*/
export function loadingShow() {
    return new Promise((resolve)=>{
        resolve($(".loading").css({"display":"block"}));
    });
}
export function loadingHide(){
    $(".loading").css({"display":"none"});
}
export default class Loading extends Component {
    render() {
        return (
            <div className="loading" style={{"display":"none"}}>
               <div className="opacity-bg"></div>
                <div className="loading-content">
                    <div className="loadEffect">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="loading-text">正在加载中....</div>
                </div>
            </div>
        )
    }
}
/*function getData(state) {
    return {
        "loadingData":state.loadingData
    }
}
export default connect(getData)(Loading);*/
