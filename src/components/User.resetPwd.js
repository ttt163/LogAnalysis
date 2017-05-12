import React, {Component,PropTypes} from 'react'
export default class ResetPwd extends Component {
    render() {
        return (
            <div className="modal fade" id="reset_password_modal" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <div className="m-close"></div>
                            </button>
                            <h4 className="modal-title">重置密码</h4>
                        </div>
                        <div className="modal-body">
                            <form className="form-horizontal check f-formSet1">
                                <div className="form-group">
                                    <div className="col-xs-offset-1 col-xs-10">
                                        <input className="form-control" type="text" placeholder="请输入新密码" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-xs-offset-1 col-xs-10">
                                            <input className="form-control" type="text" placeholder="请再输入新密码" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-xs-offset-1 col-xs-10">
                                                提示：密码必须为6-16位字符，且使用大写字母、小写字母、数字
                                                及标点符号四中字符中至少三种组合，且与登录名无相关性。
                                            </div>
                                        </div>
                                        <div className="form-group text-center">
                                            <div className="error"></div>
                                            <button type="submit" className="f-btn fbtn-ok"><span className="fbtn-ok-svg"></span> 提交</button>
                                            <button type="button" className="f-btn fbtn-miss ml15 f-resbtn" data-dismiss="modal"><span className="fbtn-miss-svg"></span> 取消</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

        )
    }
}