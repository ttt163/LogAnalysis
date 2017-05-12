import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,historyLineOpt,cookieInfo,getDateRange} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,OPERATORS,PROVICES,LEVEL,DEFMINUTER,DEFSENCOD,DEFOPERATORS} from '../config.js';
import {addPackageData,addPackageQueryData} from "../actions/streamActions.js"
import {loadingShow,loadingHide} from "./Loading.js"
import echarts from 'echarts'
import  'echarts/map/js/china'
import { Select } from 'antd';
const Option = Select.Option, levelOpt = [];
var ispOpt = [], prvOpt = [];

class StreamPackage extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {location,dispatch,query}=this.props;
        const _this = this;
        //数据层级opt
        for (var [k,v] of Object.entries(LEVEL)) {
            levelOpt.push(<Option key={k}>{v}</Option>);
        }
        //初始化数据
        var protocol = location.query.protocol, stream = location.query.stream;
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-"), dateTime = getMinut(thisTime, "-"), timestamp = parseInt(new Date(dateTime).getTime() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
        var searchData = {
            "stream": stream,
            "timestamp": !query.timestamp ? timestamp : query.timestamp,
            "protocol": protocol,
            "level": !query.level ? "3/3" : query.level,
            "operators": !query.operators ? "" : query.operators,
            "province": !query.province ? "" : query.province,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime": !query.endtime ? parseInt(thisTime) + "" : query.endtime
        };
        dispatch(addPackageQueryData({
            ...searchData,
            "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
            "v_endtime": !query.v_endtime ? dateTime : query.v_endtime
        }));
        //时间插件
        $('.date-time').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            minView: 0,
            pickerPosition: "bottom-left"
        }).on("changeDate", function (ev) {
            var name = ev.target.name;
            dispatch(addPackageQueryData({
                [name]: parseInt(ev.date.valueOf() / 1000) + "",
                ["v_" + name]: ev.target.value
            }));
            //_this.upDateIps({[name]: parseInt(ev.date.valueOf() / 1000) + ""});
            _this.getStreamIsp({[name]: parseInt(ev.date.valueOf() / 1000) + ""});
            if (name == "endtime") {
                var timestamp = parseInt(ev.date.valueOf() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
                dispatch(addPackageQueryData({"timestamp": timestamp}));
            }
        });
        loadingShow().then(()=>{
            setTimeout(()=> {
                //加载运营商
                this.getStreamIsp(searchData);
                //初始化图表
                this.initChart({ ...searchData,
                    "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
                    "v_endtime": !query.v_endtime ? dateTime : query.v_endtime
                });
                loadingHide();
            }, 10);
        });
    }

    //运营商省份数据
    getStreamIsp(_obj) {
        const {dispatch,query}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var cookieData = cookieInfo(thisTime);
        var _query = {...query, ..._obj};
        //console.log(_query);
        var sendData = {
            "stream": _query.stream,
            "protocol": _query.protocol,
            "level":_query.level,
            "starttime": parseInt(_query.starttime),
            "endtime": parseInt(_query.endtime)
        };
        //console.log(sendData);
        ispOpt = [],prvOpt=[];
        $.ajax({
            url: `${URL}/stream/getSingleInfo`,
            type: 'post',
            data: {...sendData, ...cookieData},
            async: true,  //默认为true 异步
            dataType: "json",
            error: function (error) {
                dispatch(addPackageData({"ispData": {}}));
            },
            success: function (res) {
                for (var key of Object.keys(res)) {
                    //console.log(key);
                    ispOpt.push(<Option key={key}>{!OPERATORS[key] ? key : OPERATORS[key]}</Option>);
                }
                //console.log(ispOpt);
                dispatch(addPackageData({"ispData": res}));
            }
        });
    }

    //运营商省份联动
    getProviceByIsp(val) {
        const {dispatch,streamPakage}=this.props;
        var deviceData = streamPakage.ispData;
        dispatch(addPackageQueryData({"province": ""}));
        prvOpt = [];
        if (!deviceData || !deviceData[val]) {
            prvOpt = [];
        } else {
            var prvArr = deviceData[val];
            for (var i = 0; i < prvArr.length; i++) {
                prvOpt.push(<Option key={prvArr[i]}>{!PROVICES[prvArr[i]] ? prvArr[i] : PROVICES[prvArr[i]]}</Option>);
            }
        }
    }

    //首包瞬时
    getMapData(_obj) {
        const {query}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var cookieData = cookieInfo(thisTime);
        var retData = [], searchData = {...query, ..._obj};
        var _sendData = {
            "stream": searchData.stream,
            "protocol": searchData.protocol,
            "level": searchData.level,
            "timestamp": searchData.timestamp,
            "operators": !searchData.operators?DEFOPERATORS.join(","):searchData.operators,
            "province": searchData.province
        };
        $.ajax({
            url: `${URL}/stream/getInstantaneousTime`,
            type: 'post',
            data: {..._sendData, ...cookieData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
                return retData;
            },
            success: function (res) {
                retData = res;
            }
        });
        return retData;
    }

    /*首包历史数据*/
    getHistoryData(_obj) {
        const {query}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var cookieData = cookieInfo(thisTime);
        var retData = [], searchData = {...query, ..._obj};
        var _sendData = {
            "stream": searchData.stream,
            "protocol": searchData.protocol,
            "operators": !searchData.operators?DEFOPERATORS.join(","):searchData.operators,
            "province": searchData.province,
            "level": searchData.level,
            "starttime": parseInt(searchData.starttime),
            "endtime": parseInt(searchData.endtime)
        };
        $.ajax({
            url: `${URL}/stream/getHistoryFirstTime`,
            type: 'post',
            data: {..._sendData, ...cookieData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
                return retData;
            },
            success: function (res) {
                retData = res;
            }
        });
        return retData;
    }

    initChart(searchData) {
        var mapData = this.getMapData(searchData);
       /* var _mapData= {
            "UNI" : {
                "BJ" : {
                    "1486106939" : {
                        "total" : "343.34343",
                        "num" : "12203"
                    }
                }
            },
            "CHN" : {
                "BJ" : {
                    "1486106939" : {
                        "total" : "343.34343",
                        "num" : "12203"
                    }
                }
            }
        };*/
        var _mapOpt=this.getMapOpt(mapData,searchData);
       // console.log(_mapOpt);
        if(!searchData.operators||searchData.operators==""){
            for(var i=0;i<DEFOPERATORS.length;i++){
                var chnbitChart = echarts.init(document.getElementById(`${DEFOPERATORS[i]}_map`));
                chnbitChart.setOption(_mapOpt[`${DEFOPERATORS[i]}_opt`]);
            }

        }else{
             var chnbitChart = echarts.init(document.getElementById(`${searchData.operators}_map`));
            chnbitChart.setOption(_mapOpt[`${searchData.operators}_opt`]);
        }

        var historyData = this.getHistoryData(searchData);
        var _historyOpt=this.getHistoryOpt(historyData,searchData);
        var packageLine=echarts.init(document.getElementById("package-line"));
        packageLine.setOption(_historyOpt);
    }
    getMapOpt(mapData,query) {
        var seriesObj={};
        if(!query.operators||query.operators==""){
            for(var i=0;i<DEFOPERATORS.length;i++){
                var _seriesData=[];
                var _thisSeries={
                    name: !OPERATORS[DEFOPERATORS[i]] ? DEFOPERATORS[i] : OPERATORS[DEFOPERATORS[i]],
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },data:[]};
                if(!mapData[DEFOPERATORS[i]]){
                    _seriesData=[];
                }else{
                    var  series=[];
                    for(var [prv,prvItem] of Object.entries(mapData[DEFOPERATORS[i]])){
                        var _valObj=Object.values(prvItem)[0],val=!Number(_valObj.num)?0:(Number(_valObj.total)/Number(_valObj.num)).toFixed(2);
                        if(val>0){
                            var  _thisData={name: !PROVICES[prv] ? prv : PROVICES[prv]};
                            _seriesData.push({..._thisData,value:val});
                        }

                    }
                }
                _thisSeries={..._thisSeries,data:_seriesData};
                //series.push(_thisSeries);
                var color=["red"];
               // if(DEFOPERATORS[i]=="UNI"){color=['rgba(255, 51, 51, 1)']}else if(DEFOPERATORS[i]=="CHN"){color=['rgba(0, 51, 51, 1)']}else if(DEFOPERATORS[i]=="CMN"){color=['rgba(0, 153, 255, 1)']}
                var option = mapOpt(!OPERATORS[DEFOPERATORS[i]] ? DEFOPERATORS[i] : OPERATORS[DEFOPERATORS[i]]+'首包用时', [{name:!OPERATORS[DEFOPERATORS[i]] ? DEFOPERATORS[i] : OPERATORS[DEFOPERATORS[i]], icon: 'circle'}], [_thisSeries], "", ["#c33530"], "");
              // option = mapOpt(!OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp] + "客户端流量", [{name:!OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp], icon: 'circle'}], series, 2,color,max);
                seriesObj={...seriesObj,[`${DEFOPERATORS[i]}_opt`]:option};
            }

        }else{
            var _thisIsp=query.operators,_thisData=!mapData[_thisIsp]?{}:mapData[_thisIsp];
            var _thisSeries={
                name: !OPERATORS[_thisIsp] ? _thisIsp : OPERATORS[_thisIsp],
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },data:[]};
            var _seriesData=[];
            if(!$.isEmptyObject(_thisData)){
                for(var [prv,prvItem] of Object.entries(_thisData)){
                    var _valObj=Object.values(prvItem)[0],val=!Number(_valObj.num)?0:(Number(_valObj.total)/Number(_valObj.num)).toFixed(2);
                    if(val>0){
                        var  _thisData={name: !PROVICES[prv] ? prv : PROVICES[prv]};
                        _seriesData.push({..._thisData,value:val});
                    }
                   /* var  _thisData={name: !PROVICES[prv] ? prv : PROVICES[prv]};
                    var _valObj=Object.values(prvItem)[0];
                    _seriesData.push({..._thisData,value:!Number(_valObj.num)?0:(Number(_valObj.total)/Number(_valObj.num)).toFixed(2)});*/
                }
            }
            _thisSeries={..._thisSeries,data:_seriesData};
            var color=["red"];
           // if(_thisIsp=="UNI"){color=['rgba(255, 51, 51, 1)']}else if(_thisIsp=="CHN"){color=['rgba(0, 51, 51, 1)']}else if(_thisIsp=="CMN"){color=['rgba(0, 153, 255, 1)']}
            var option = mapOpt(!OPERATORS[_thisIsp] ? _thisIsp : OPERATORS[_thisIsp]+'首包用时', [{name:!OPERATORS[_thisIsp] ? _thisIsp : OPERATORS[_thisIsp], icon: 'circle'}], [_thisSeries], "", ["#c33530"], "");
            //var option = mapOpt("", [_thisIsp], [_thisSeries], "", [], 2);
            seriesObj={...seriesObj,[`${_thisIsp}_opt`]:option};
        }
        /*for(var [key,item] of Object.entries(mapData)){
            var  series=[];
            var _thisSeries={
                name: !OPERATORS[key] ? key : OPERATORS[key]+'首包用时',
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },data:[]};
            var _seriesData=[];
            for(var [prv,prvItem] of Object.entries(item)){
                var  _thisData={name: !PROVICES[prv] ? prv : PROVICES[prv]};
                var _valObj=Object.values(prvItem)[0];
                _seriesData.push({..._thisData,value:!Number(_valObj.num)?0:Number(_valObj.total)/Number(_valObj.num)});
            }
            _thisSeries={..._thisSeries,data:_seriesData};
            series.push(_thisSeries);
            var option = mapOpt("", [], series, "", [], 2);
            seriesObj={...seriesObj,[`${key}_opt}`]:option};
        }*/
        return seriesObj;
    }
    getHistoryOpt(historyData,query){
        var timeData=getDateRange(query.v_starttime,query.v_endtime);
        var seriesData=[];
        for(var i=0;i<timeData.timev.length;i++){
            if(!historyData[timeData.timev[i]]||$.isEmptyObject(historyData[timeData.timev[i]])){
                seriesData.push(0);
            }else{
                seriesData.push(!Number(historyData[timeData.timev[i]].num)?0:(Number(historyData[timeData.timev[i]].total)/Number(historyData[timeData.timev[i]].num)).toFixed(2));
            }
        }
        var series = {
            name: '平均值',
            smooth: true,
            type: 'line',
            data: seriesData
        };
        var opt = historyLineOpt("", timeData.time_list, ["平均值"], series, ["#4672a3"]);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '2%'
        }, yAxis = {...optYAxis, "name": "首包所用时间（s）"};
        return {
            ...opt,
            'legend': le,
            'grid': grid,
            "yAxis": yAxis
        };
    }
searchData(e){
    e.preventDefault();
    const {query}=this.props;
    loadingShow().then(()=>{
        setTimeout(()=> {
            this.initChart(query);
            loadingHide();
        }, 10);
    });

}
    render() {
        const {query,dispatch}=this.props;
       // console.log(ispOpt);
        return (
            <div className="tab-cont">
                <form className="form-horizontal mb30">
                    <div className="row">
                        <div className="col-md-11">
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">查询类型：</label>
                                    <div className="col-xs-9">
                                        <Select value={query.protocol} disabled>
                                            <Option value="">请选择</Option>
                                            <Option value="rtmp">rtmp</Option>
                                            <Option value="flv">flv</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">运营商：</label>
                                    <div className="col-xs-9">
                                        <Select value={query.operators}
                                                onChange={(val)=>{dispatch(addPackageQueryData({"operators":val}));this.getProviceByIsp(val);}}>
                                            <Option value="">请选择</Option>
                                            {ispOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">起始时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" name="starttime" className="form-control date-time"
                                               value={query.v_starttime}/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">数据层级：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.level}
                                                onChange={(val)=>{dispatch(addPackageQueryData({"level":val}));this.getStreamIsp({"level":val})}}>
                                            {levelOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">省份：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.province}
                                                onChange={(val)=>dispatch(addPackageQueryData({"province":val}))}>
                                            <Option value="">请选择</Option>
                                            {prvOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">结束时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" name="endtime" className="form-control date-time"
                                               value={query.v_endtime}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <input type="submit" className="btn btn-primary mt30"
                                   onClick={(e)=>{this.searchData(e)}} value="查询"/>
                        </div>
                    </div>
                </form>
                <div className="pb30">
                    {!query.operators?
                        <div className="row">
                            {DEFOPERATORS.map((isp,ispIndex)=>
                                    <div key={ispIndex} className="col-md-4" style={{"height": "500px"}} id={`${isp}_map`}></div>
                            )}
                        </div>
                        :
                        <div className="row">
                            <div className="col-md-12" id={`${query.operators}_map`} style={{"height": "500px"}}></div>
                        </div>

                    }
                    <div id="package-line" style={{"height": "350px","border": "1px solid #e5e5e5"}}></div>
                </div>

            </div>

        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "streamPakage": state.streamReducer.streamPakage,
        "query": state.streamReducer.streamPakage.query
    }
}
export default connect(getData)(StreamPackage);
