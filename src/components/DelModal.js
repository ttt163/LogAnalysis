/**
 * Created by Administrator on 2016/9/8.
 */
import React, { Component, PropTypes } from 'react'

export default class DealModal extends Component {
    render() {
        return (
            <div>
                <div className="mask"></div>
                <div id="delModal">
                    {/*弹框*/}
                    <div className="f-modal">
                        <div className="modal-dialog" style={{minWidth:'300px'}}>
                            <div className="modal-content">
                                <div className="f-modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                                        aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title"><span className='glyphicon glyphicon-info-sign'></span> [Title]</h4>
                                </div>
                                <div className="f-modal-body">
                                    <div className="form-group">
                                        <p>[Message]</p>
                                    </div>
                                    <div className="form-group text-center">
                                        <button className="f-btn fbtn-ok ok"><span className='fbtn-ok-svg'></span> [BtnOk]</button>
                                        <button className="f-btn fbtn-miss ml15 cancel" data-dismiss="modal"><span
                                            className='fbtn-miss-svg'></span> [BtnCancel]
                                        </button>
                                    </div>
                                </div>
                                <div className="f-modal-footer">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
