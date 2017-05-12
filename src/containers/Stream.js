import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat,getMinut} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL } from '../config.js';
import {editSearchQuery,addStreamList} from "../actions/streamActions.js"
import { Select } from 'antd';
const Option = Select.Option;
import {getCookieJson} from "./App.js";
import {loadingShow,loadingHide} from "../components/Loading.js"
export function getStreamData(sendData){
    var retData=[];
    $.ajax({
        url:`${URL}/stream/getList`,
        type:'post',
        data:{...sendData},
        async: false,  //默认为true 异步
        dataType: "json",
        error:function(error){
           /* var res=$.parseJSON(error.responseText);
            new ShowDiag({
                msg: !res.info?'查询失败！':res.info,
                closetime: 2
            });*/
            return retData;
        },
        success:function(res){
            retData=res;
        }
    });
    return retData;
}
class Stream extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        $(".f-stream").addClass("f-curr");
        const {dispatch,query}=this.props;
        var thisTime=new Date().getTime()/1000,dateFormat=defformat(thisTime,"-"),dateTime=getMinut(thisTime,"-");
        var searchData={"url":!query.url?"":query.url,"protocol":!query.protocol?"hls":query.protocol,"level":!query.level?"3/3":query.level,"starttime":!query.starttime?parseInt(new Date(`${dateFormat} 00:00`).getTime()/1000)+"":query.starttime,"endtime":!query.endtime?parseInt(thisTime)+"":query.endtime};
        dispatch(editSearchQuery({...searchData,"v_starttime":!query.v_starttime?`${dateFormat} 00:00`:query.v_starttime,"v_endtime":!query.v_endtime?dateTime:query.v_endtime}));
        //时间插件
        $('.date-time').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            minView: 0,
            pickerPosition: "bottom-left"
        }).on("changeDate",function(ev){
            //console.log(ev);
            var name=ev.target.name;
            dispatch(editSearchQuery({[name]:parseInt(ev.date.valueOf()/1000)+"",["v_"+name]:ev.target.value}));
        });
        //列表数据
       // var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData=getCookieJson();
                var jsonData={"ckt":parseInt(thisTime)+"","username":cookieData.username,"password":$.md5(cookieData.password+parseInt(thisTime))};
                var sendData=Object.assign({},{...searchData},{...jsonData});
                dispatch(addStreamList({"list":getStreamData(sendData)}));
                loadingHide();
            }, 10);
        });

    }

    componentWillUnmount() {
        $(".f-stream").removeClass("f-curr");
    }
    sraechStram(e){
        e.preventDefault();
        const {dispatch,query}=this.props;
        //var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData=getCookieJson();
                var thisTime=parseInt(new Date().getTime()/1000).toString();
                var jsonData={"ckt":thisTime,"username":cookieData.username,"password":$.md5(cookieData.password+thisTime)};
                var sendData=Object.assign({},{...query},{...jsonData});
                delete sendData.v_endtime;
                delete sendData.v_starttime;
                dispatch(addStreamList({"list":getStreamData(sendData)}));
                loadingHide();
            }, 10);
        });

    }
    render() {
        const {query,streamList,dispatch}=this.props;
        return (
            <div>
                <div className="f-box mb30 search-box">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <div className="col-md-3">
                                <label className="col-xs-3 text-right control-label">url：</label>
                                <div className="col-xs-9">
                                    <input className="form-control" value={query.url} onChange={(e)=>dispatch(editSearchQuery({"url":e.target.value}))}/>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="col-xs-3 text-right control-label">查询类型：</label>
                                <div className="col-xs-9">
                                    <Select value={query.protocol} onChange={(val)=>dispatch(editSearchQuery({"protocol":val}))}>
                                        <Option value="hls">hls</Option>
                                        <Option value="rtmp">rtmp</Option>
                                        <Option value="flv">flv</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="col-xs-3 text-right control-label">数据层级：</label>
                                <div className="col-xs-9">
                                    <Select value={query.level} onChange={(val)=>dispatch(editSearchQuery({"level":val}))}>
                                        <Option value="1/3">1/3</Option>
                                        <Option value="2/3">2/3</Option>
                                        <Option value="3/3">3/3</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-md-3">
                                <label className="col-xs-3 text-right control-label">起始日期：</label>
                                <div className="col-xs-9">
                                    <input type="text" value={query.v_starttime}  className="form-control date-time" name="starttime" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="col-xs-3 text-right control-label">结束日期：</label>

                                <div className="col-xs-9">
                                    <input type="text" value={query.v_endtime} className="form-control date-time" name="endtime"/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-md-11 text-center">
                                <input type="submit" onClick={(e)=>this.sraechStram(e)} className="btn btn-primary" value="查询"/>
                                </div>
                            </div>
                    </form>
                </div>
                <div className="table-responsive" >
                    <table className="table f-table table-bordered table-striped table-hover">
                        <thead>
                        <tr>
                            <th >流名称</th>
                            <th >大小</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!streamList||!streamList.list||!streamList.list.length?<tr><td colSpan="2" className="text-center">暂无数据！</td></tr>:
                            streamList.list.map((item,index)=>(
                                <tr key={index}>
                                    <td className="text-center"> <Link to={`/streamCont/package?stream=${item.StreamName}&protocol=${item.Protocol}`}>{item.StreamName}</Link></td>
                                    <td className="text-center">{`${(item.TotalByte/(1000*1000*1000)).toFixed(2)}GB`}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                {/*  <div className="f-box list-box">
                    {!streamList||!streamList.list||!streamList.list.length? <div className="mb10">暂无数据！</div>:
                        streamList.list.map((item,index)=>(
                            <div key={index} className="mb10">
                                <Link to={`/streamCont/package?stream=${item.StreamName}&protocol=${item.Protocol}`}>{item.StreamName}</Link>
                                <span className="ml20">{`${(item.TotalByte/(1024*1024*1024*8)).toFixed(4)}GB`}</span>
                            </div>
                        ))
                    }
                </div>*/}
            </div>
        )


    }
}
function getData(state) {
   // .log(state);
    return {
        "streamList":state.streamReducer.streamList,
        "query":state.streamReducer.streamSearchQuery
    }
}
export default connect(getData)(Stream);

