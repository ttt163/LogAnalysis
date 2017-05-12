import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat,getMinut,randomData,towYAxisChartOpt,getDateRange} from  "../public/js/f.js"
import echarts from 'echarts'
import { Link} from 'react-router';
import { URL,LEVEL} from '../config.js';
import {addOnlineData,addOnlineQueryData} from "../actions/streamActions.js"
import { Select } from 'antd';
import {getCookieJson} from "../containers/App.js";
import {loadingShow,loadingHide} from "./Loading.js"
const Option = Select.Option, leveOpt = [];
//流历史带宽数据
export function getSreamBit(sendData) {
    var retData = {};
    $.ajax({
        url: `${URL}/stream/getStreamBit`,
        type: 'post',
        data: {...sendData},
        async: false,  //默认为true 异步
        dataType: "json",
        error: function (error) {
            return {"bitData": retData};
        },
        success: function (res) {
            if (!res || !res.ByteData) {
                return {"onlineData": retData};
            }
            retData = res.ByteData;
        }
    });
    return {"bitData": retData};
}
//流在线人数数据
export function getSreamOnline(sendData) {
    var retData = {};
    $.ajax({
        url: `${URL}/stream/getStreamonLine`,
        type: 'post',
        data: {...sendData},
        async: false,  //默认为true 异步
        dataType: "json",
        error: function (error) {
            return {"onlineData": retData};
        },
        success: function (res) {
            if (!res || !res.OnlineData) {
                return {"onlineData": retData};
            }
            retData = res.OnlineData;
        }
    });
    return {"onlineData": retData};
}

class StreamOnline extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch,streamQuery,location,query}=this.props;
        //数据层级opt
        for (var [k,v] of Object.entries(LEVEL)) {
            leveOpt.push(<Option key={k}>{v}</Option>);
        }
        var protocol = location.query.protocol, stream = location.query.stream;
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-"), dateTime = getMinut(thisTime, "-");
        var searchData = {
            "stream": stream,
            "protocol": protocol,
            "level": !query.level ? "3/3" : query.level,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime": !query.endtime ? parseInt(thisTime) + "" : query.endtime
        };
        dispatch(addOnlineQueryData({
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
            //console.log(ev);
            var name = ev.target.name;
            dispatch(addOnlineQueryData({
                [name]: parseInt(ev.date.valueOf() / 1000) + "",
                ["v_" + name]: ev.target.value
            }));
        });
        //初始化数据
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData = getCookieJson();
                var jsonData = {
                    "ckt": parseInt(thisTime) + "",
                    "username": cookieData.username,
                    "password": $.md5(cookieData.password + parseInt(thisTime))
                };
                var sendData = Object.assign({}, {...searchData}, {...jsonData});
                var bitData = getSreamBit(sendData).bitData, onlineData = getSreamOnline(sendData).onlineData;
                var timeDate = getDateRange(`${dateFormat} 00:00`, dateTime);
                var onlineTimeDate = [], bitTimeData = [], timev = timeDate.timev;
                for (var i = 0; i < timev.length; i++) {
                    if (!onlineData[timev[i]]) {
                        onlineTimeDate.push(0);
                    } else {
                        onlineTimeDate.push(onlineData[timev[i]]);
                    }
                    if (!bitData[timev[i]]) {
                        bitTimeData.push(0);
                    } else {
                        bitTimeData.push((bitData[timev[i]] / 1000 / 1000 / 60).toFixed(2));
                    }
                }
                this.seachLine(bitTimeData, onlineTimeDate, timeDate.time_list);
                loadingHide();
            }, 10);
        });
        // var cookieData=$.parseJSON(document.cookie);

    }

    seachLine(bitData, onlineData, timeData) {
        var series = [{
            name: '总量',
            type: 'line',
            smooth: true,
            data: bitData
        }, {
            name: '在线人数',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            data: onlineData
        }];
        var yAxis = [
            {
                type: 'value',
                name: "带宽(Mbps)",
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: "在线人数",
                axisLabel: {
                    formatter: function (value) {
                        return value
                    }
                }
            }
        ];
        var opt = towYAxisChartOpt(timeData, ['总量', '在线人数'], ['#88a44d', '#d98642'], yAxis, series);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '20px',
            orient: "vertical"
        };
        echarts.init(document.getElementById("onlineChart")).setOption({...opt, "grid": grid, "legend": le});
    }

    //查询
    subSearch(e) {
        e.preventDefault();
        const {dispatch,onLineData}=this.props;
        var query = onLineData.query;
        //var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData = getCookieJson();
                var thisTime = parseInt(new Date().getTime() / 1000).toString();
                var jsonData = {
                    "ckt": thisTime,
                    "username": cookieData.username,
                    "password": $.md5(cookieData.password + thisTime)
                };
                var sendData = Object.assign({}, {...query}, {...jsonData});
                delete sendData.v_endtime;
                delete sendData.v_starttime;
                var onlineData = getSreamOnline(sendData).onlineData, bitData = getSreamBit(sendData).bitData;
                var timeDate = getDateRange(query.v_starttime, query.v_endtime);
                var onlineTimeDate = [], bitTimeData = [], timev = timeDate.timev;
                for (var i = 0; i < timev.length; i++) {
                    if (!onlineData[timev[i]]) {
                        onlineTimeDate.push(0);
                    } else {
                        onlineTimeDate.push(onlineData[timev[i]]);
                    }
                    if (!bitData[timev[i]]) {
                        bitTimeData.push(0);
                    } else {
                        bitTimeData.push(bitData[timev[i]] / 1000 / 1000 / 60);
                    }
                }
                this.seachLine(bitTimeData, onlineTimeDate, timeDate.time_list);
                // dispatch(addOnlineData({...onlineData,...bitData}));
                loadingHide();
            }, 10);
        });

    }

    render() {
        const {onLineData,dispatch}=this.props;
        return (
            <div className="tab-cont">
                <form className="form-horizontal mb30">
                    <div className="row">
                        <div className="col-md-11">
                            <div className="form-group">
                                <div className="col-md-5">
                                    <label className="col-xs-3 text-right control-label">查询协议：</label>

                                    <div className="col-xs-9">
                                        <Select value={onLineData.query.protocol} disabled
                                                onChange={(val)=>dispatch(addOnlineQueryData({"protocol":val}))}>
                                            <Option value="hls">hls</Option>
                                            <Option value="rtmp">rtmp</Option>
                                            <Option value="flv">flv</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <label className="col-xs-3 text-right control-label">起始时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" name="starttime"
                                               value={!onLineData.query||!onLineData.query.v_starttime?"":onLineData.query.v_starttime}
                                               className="form-control date-time"/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-5">
                                    <label className="col-xs-3 text-right control-label">数据层级：</label>

                                    <div className="col-xs-9">
                                        <Select value={onLineData.query.level}
                                                onChange={(val)=>dispatch(addOnlineQueryData({"level":val}))}>
                                            {leveOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <label className="col-xs-3 text-right control-label">结束时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" name="endtime" className="form-control  date-time"
                                               value={!onLineData.query||!onLineData.query.v_endtime?"":onLineData.query.v_endtime}/>
                                    </div>
                                </div>
                                <div className="col-md-1">
                                    <input type="submit" className="btn btn-primary" onClick={(e)=>this.subSearch(e)}
                                           value="查询"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {/* <button type="button" className="btn mb10">导出excel</button>*/}
                <div id="onlineChart" className="mb30"
                     style={{"height": "350px","border": "1px solid #e5e5e5"}}></div>

            </div>
        )


    }
}
function getData(state) {
    return {
        "query":state.streamReducer.streamOnline.query,
        "onLineData": state.streamReducer.streamOnline,
        "streamQuery": state.streamReducer.streamSearchQuery
    }
}
export default connect(getData)(StreamOnline);
