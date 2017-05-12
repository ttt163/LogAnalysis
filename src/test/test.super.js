
import React,{PropTypes,Component} from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import TestSub from "./test.sub.js"

//const withContext=({'name': 'Jonas123'},()=>{
    class TestSup extends Component {
        constructor(state) {
            super(state);
        }
        getChildContext(){
            return {
                name: "Jonas"
            };
        }
        render() {
            return (
                <div>
                    父组件：{this.context.name}
                    <TestSub />
                </div>

            );
        }
    }
const withContext={'name': 'Jonas123'};
//})
//React.withContext({'name': 'Jonas'}, function () {
export default TestSup;
//});

TestSup.contextTypes={
    name: React.PropTypes.string.isRequired
};
TestSup.childContextTypes={
    name: React.PropTypes.string.isRequired
};


/*function sel(state) {
    console.log(state);
    return {user:state.isLogin}
}
export default connect(sel)(Test)*/


