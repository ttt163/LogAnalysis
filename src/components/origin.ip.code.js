import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,towYAxisChartOpt,cookieInfo } from  "../public/js/f.js"
import echarts from 'echarts'
import { Link} from 'react-router';
import { URL ,CODEDEFAULTDEV,SCROLLBOTTOM} from '../config.js';
import {addSubCodeData} from "../actions/originActions.js"
import {getDevices,getHistoryDevices} from "./origin.Bit.js"
import {initCodeChart} from "./origin.Code.js"
import {loadingShow,loadingHide} from "./Loading.js"
class IpCode extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch,originCode,location}=this.props;
        $(".tab-code").addClass("tab-active");
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-");
        var query=originCode.bitQuery;
        var bitQuery={
            "vhost":location.query.vhost,
            "starttime": !query||!query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime":!query||!query.endtime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000)+24*60*60-1+ "" : query.endtime,
            "level":!query||!query.level ? "3/3" : query.level,
            "sourceip":location.query.selecIp
        };
        loadingShow().then(()=>{
            setTimeout(()=> {
                var deviceData=getDevices("BackStatusCode",bitQuery),
                    len=(CODEDEFAULTDEV)<deviceData.length?CODEDEFAULTDEV:deviceData.length,
                    showDevData=deviceData.slice(0,len);
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addSubCodeData({"bitQuery":bitQuery,"deviceData":deviceData,"showDevData":showDevData})));
                });
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":bitQuery.sourceip,
                    "devname":""
                };
                promise.then(function (value) {
                    for(var index=0;index<showDevData.length;index++){
                        initCodeChart(bitQuery,index,{...sendData,"devname":showDevData[index]});
                    }
                });
                loadingHide();
            }, 10);
        });

    }

    componentWillUnmount() {
        $(".tab-code").removeClass("tab-active");
    }
    initScrollData(e){
        const {subCode,dispatch}=this.props;
        const _this=this;
        var _thisDom=$(e.target),
            _contentHeight=_thisDom[0].scrollHeight,
            _height=_thisDom.height(),
            _scrollTop=_thisDom.scrollTop(),
            _scrollBottom=_contentHeight-_height-_scrollTop;
        var showDevData=subCode.showDevData,
            deviceData=subCode.deviceData,
            //deviceDataNames=Object.keys(deviceData),
            bitQuery=subCode.bitQuery;
        if(showDevData.length<deviceData.length){
           // var showDevNames=deviceDataNames.slice(showDevData.length,showDevData.length+2);
            var addShowData=deviceData.slice(showDevData.length,showDevData.length+2);
           /* var addShowData=[];
            for(var i=0;i<showDevNames.length;i++){
                addShowData.push({"devName":showDevNames[i],"devIp":deviceData[showDevNames[i]]});
            }*/
            if(_scrollBottom<SCROLLBOTTOM){
                //加载数据
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addSubCodeData({"showDevData":[...showDevData,...addShowData]})));
                });
                // console.log(deviceData);
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":bitQuery.sourceip,
                    "devname":""
                };
                promise.then(function (value) {
                    for(var i=0;i<addShowData.length;i++){
                        initCodeChart(subCode.bitQuery,showDevData.length+i,{...sendData,"devname":addShowData[i]});
                    }

                });
            }
        }

    }

    render() {
        const {subCode,location}=this.props;
        //console.log(subCode);
        return (
            <div className="tab-cont">
                <div style={{"borderBottom": "1px solid #e5e5e5"}}>
                    <i style={{"fontSize": "26px","verticalAlign": "middle","color": "#0099cb", "cursor": "pointer"}}
                       className="iconfont"
                       onClick={()=> this.context.router.push(`/originCont/code?vhost=${location.query.vhost}`)}>&#xe605;</i>
                    <h4 className="mr10" style={{"display": "inline"}}>{location.query.selectName}</h4>
                </div>
                <div className="row mt30" style={{"height": "520px","overflowY": "scroll"}}  onScroll={(e)=>this.initScrollData(e)}>
                    {!subCode.showDevData?"":
                        subCode.showDevData.map((item,index)=>
                                <div key={index} className="ip-block col-md-6">
                                    <div>
                                        <i className="iconfont">&#xe639;</i>{item}
                                    </div>
                                    <div className="code-line" style={{"height":"350px"}}></div>
                                </div>
                        )}
                    {/*<div className="ip-block col-md-6">
                        <div>
                            <i className="iconfont">&#xe639;</i>101.71.29.130
                        </div>
                        <div style={{"height":"350px"}}></div>
                    </div>
                    <div className="ip-block col-md-6">
                        <div>
                            <i className="iconfont">&#xe639;</i>101.71.29.130
                        </div>
                        <div style={{"height":"350px"}}></div>
                    </div>*/}
                </div>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "originCode": state.originReducer.originCode,
        "subCode": state.originReducer.originSubCode
    }
}
export default connect(getData)(IpCode);
IpCode.contextTypes = {
    router: PropTypes.object
}
