import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
import  'echarts/map/js/china'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,historyLineOpt} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL } from '../config.js';
import {addStreamData} from "../actions/streamActions.js"

class StreamContent extends React.Component {
    constructor(state) {
        super(state);
    }
    componentWillUnmount() {
       // var path=this.props.route.path;
        //if(path.indexOf("/stream")==-1){
            $(".f-stream").removeClass("f-curr");
        //}
    }

    componentWillMount() {
        const {location,dispatch}=this.props;
        var stream=location.query.stream;
        dispatch(addStreamData({"stream_name":stream}));

    }

    componentDidMount() {
        $(".f-stream").addClass("f-curr");
    }
    render() {
        const {query,location}=this.props;
        return (
            <div>
                <div className="b-header mb30">
                    <div className="row">
                        <div className="col-xs-11"><h4>{!query.stream_name?"":query.stream_name}</h4></div>
                        <div className="iconfont"><i className="back" title="返回" onClick={()=> this.context.router.push("/stream")}>&#xe62a;</i></div>
                    </div>
                </div>
                <div className="tab-box">
                    <div className="tab clearfix">
                        <Link to={`/streamCont/package?stream=${query.stream_name}&protocol=${location.query.protocol}`} className="br0" activeClassName="tab-active">首包</Link>
                        <Link to={`/streamCont/online?stream=${query.stream_name}&protocol=${location.query.protocol}`} activeClassName="tab-active">带宽&在线人数</Link>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "query":state.streamReducer.streamSearchQuery
    }
}
export default connect(getData)(StreamContent);
StreamContent.contextTypes={
    router: PropTypes.object
}