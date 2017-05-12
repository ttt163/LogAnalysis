import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,LEVEL} from '../config.js';
import {addQueryData,addChannelList} from "../actions/channelActions.js"
import { Select } from 'antd';
import {getCookieJson} from "./App.js";
import {loadingShow,loadingHide} from "../components/Loading.js"
const Option = Select.Option,leveOpt=[];
//数据层级opt
for (var [k,v] of Object.entries(LEVEL)) {
    leveOpt.push(<Option key={k}>{v}</Option>);
}
export function getChannelData(sendData){
    var retData=[];
    $.ajax({
        url:`${URL}/vhost/getList`,
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
class Channel extends React.Component {
    constructor(state) {
        super(state);
    }
    componentDidMount() {
        const {dispatch,query}=this.props;
        $(".f-channel").addClass("f-curr");
        //时间插件
        $('.date-day').datetimepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayBtn: true,
            minView: 2,
            pickerPosition: "bottom-left"
        }).on("changeDate",function(ev){
            // console.log(ev);
            var name=ev.target.name;
            dispatch(addQueryData({[name]:parseInt(ev.date.valueOf()/1000)+"",["v_"+name]:ev.target.value}));
        });
        var thisTime=new Date().getTime()/1000,dateFormat=defformat(thisTime,"-");
        var searchData={"vhost":!query.vhost?"":query.vhost,"protocol":!query.protocol?"hls":query.protocol,"level":!query.level?"3/3":query.level,"timestamp":!query.timestamp?parseInt(new Date(`${dateFormat} 00:00`).getTime()/1000)+"":query.timestamp};
        dispatch(addQueryData({...searchData,"v_timestamp":!query.v_timestamp?dateFormat:query.v_timestamp}));


        //var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData=getCookieJson();
                var jsonData={"ckt":parseInt(thisTime)+"","username":cookieData.username,"password":$.md5(cookieData.password+parseInt(thisTime))};
                var sendData=Object.assign({},{...searchData},{...jsonData});
                dispatch(addChannelList(getChannelData(sendData)));
                loadingHide();
            }, 10);
        });

    }
    componentWillUnmount() {
     $(".f-channel").removeClass("f-curr");
     }
    searchChannel(e){
        e.preventDefault();
        const {dispatch,query}=this.props;
        //var cookieData=$.parseJSON(document.cookie);
        loadingShow().then(()=>{
            setTimeout(()=> {
                var cookieData=getCookieJson();
                var thisTime=parseInt(new Date().getTime()/1000).toString();
                var jsonData={"ckt":thisTime,"username":cookieData.username,"password":$.md5(cookieData.password+thisTime)};
                var sendData=Object.assign({},{...query},{...jsonData});
                delete sendData.v_timestamp;
                dispatch(addChannelList(getChannelData(sendData)));
                loadingHide();
            }, 10);
        });

    }
    render() {
        const {dispatch,query,list}=this.props;
        return (
            <div>
                <div className="f-box mb30 search-box">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <div className="col-md-5">
                                <label className="col-xs-3 text-right control-label">频道名称：</label>
                                <div className="col-xs-9">
                                    <input className="form-control" value={query.vhost} onChange={(e)=>dispatch(addQueryData({"vhost":e.target.value}))}/>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <label className="col-xs-3 text-right control-label">日期：</label>
                                <div className="col-xs-9">
                                    <input type="text" value={query.v_timestamp} name="timestamp" className="form-control date-day"/>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-md-5">
                                <label className="col-xs-3 text-right control-label">查询协议：</label>
                                <div className="col-xs-9">
                                    <Select value={query.protocol} onChange={(val)=>dispatch(addQueryData({"protocol":val}))}>
                                        <Option value="hls">hls</Option>
                                        <Option value="rtmp">rtmp</Option>
                                        <Option value="flv">flv</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <label className="col-xs-3 text-right control-label">层级：</label>
                                <div className="col-xs-9">
                                    <Select value={query.level} onChange={(val)=>dispatch(addQueryData({"level":val}))}>
                                        {leveOpt}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-md-1">
                                <input type="submit" className="btn btn-primary" value="查询" onClick={(e)=>this.searchChannel(e)}/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="table-responsive" >
                    <table className="table f-table table-bordered table-striped table-hover">
                        <thead>
                        <tr>
                            <th >频道名称</th>
                            <th >大小</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!list||!list.length?<tr><td colSpan="2" className="text-center">暂无数据！</td></tr>:
                            list.map((item,index)=>(
                                <tr key={index}>
                                    <td className="text-center">
                                        <Link to={`/channelCont/bit?vhost=${item.Domain}`}>{item.Domain}</Link></td>
                                    <td className="text-center">{`${(item.Totalbyte/(1000*1000*1000)).toFixed(2)}GB`}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                {/* <div className="f-box list-box">
                    {!list||!list.length? <div className="mb10">暂无数据！</div>:
                        list.map((item,index)=>(
                            <div key={index} className="mb10">
                                <Link to={`/channelCont/bit?vhost=${item.Domain}`}>{item.Domain}</Link>
                                <span className="ml20">{`${(item.Totalbyte/(1024*1024*1024*8)).toFixed(4)}GB`}</span>
                            </div>
                        ))
                    }
                </div>*/}
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "list":state.channelReducer.channelList.list,
        "query":state.channelReducer.channelList.query
    }
}
export default connect(getData)(Channel);
