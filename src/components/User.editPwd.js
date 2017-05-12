import React, {Component,PropTypes} from 'react'
export default class EditPwd extends Component {
    render() {
        return (
            <div className="modal fade" id="edit_password_modal" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog" style={{"width":"700px"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <div className="m-close"></div>
                            </button>
                            <h4 className="modal-title">修改密码</h4>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal f-form-horizontal" id="setPwd">
                                <input type="password" style={{display:'none'}} />
                                <input type="hidden" name="id" value="" />
                                <input type="hidden" name="_token" value="" />

                                <div className="form-group">
                                    <label className="col-xs-3 control-label"><span className='red'>*</span> 原密码：</label>

                                    <div className="col-xs-8">
                                        <input type="password" className="form-control" name="oldPwd" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label"><span className='red'>*</span> 新密码：</label>

                                    <div className="col-xs-8">
                                        <input type="password" className="form-control" name="password" id="newspwP" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-3 control-label"><span className='red'>*</span> 重新输入密码：</label>

                                    <div className="col-xs-8">
                                        <input type="password" className="form-control" name="rpassword" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-xs-offset-1 col-xs-10 textLeft">
                                        (提示：密码必须为6-16位字符，且使用大写字母、小写字母、数字及标点符号四种字符中至少三种组合，且与登录名无相关性。)
                                    </label>
                                </div>
                                <div className="form-group text-center">
                                    <div className="error f-pb30"></div>
                                    <button type='submit' className="f-btn fbtn-ok"><span className='fbtn-ok-svg'></span> 确认</button>
                                    <button type='button' className="f-btn fbtn-miss ml15" data-dismiss="modal"><span
                                        className='fbtn-miss-svg'></span> 取消
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

        )
    }
}