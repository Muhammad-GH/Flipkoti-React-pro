import React, { Component } from 'react'
import axios from 'axios'
import { Helper, url } from "../../../../helper/helper"

export default class Accept extends Component {

    state = {
        tb_message: '',
        agreed:false,
    }

    handleChange = (event) => {
        const {name, value} = event.target
        this.setState({[name]: value})
    }

    handleCheck = () => {
        this.setState({ agreed: !this.state.agreed })
    }
    
    handleSubmit = async() => {
        const token = await localStorage.getItem("token");
        const data = new FormData() 
        data.set('tb_message', this.state.tb_message)
        const response = await axios
        .post(`${url}/api/bid/accept/${this.props.id}/${this.refs.tb_user_id.value.trim()}`,data, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
        console.log(response)
    }
    

    render() {
        return (
            <div>
                {/* Modal  */}
            <div className="modal fade" id="accept" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-11">
                                <input ref="tb_user_id" name="tb_user_id" id="tb_user_id" class="form-control" type="hidden"/>
                                    <div className="form-group mb-5">
                                        <div className="profile flex">
                                            <img src={this.props.avatar}/>
                                            <div className="content">
                                                <h4 id="name"></h4>
                                                <p><b id="bid"></b></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <textarea name="tb_message" onChange={this.handleChange} id="message" className="form-control" placeholder="Your message"></textarea>
                                    </div>
                                    <div className="form-group mb-5">
                                        <div className="form-check">
                                            <input onClick={this.handleCheck} type="checkbox" className="form-check-input" id="agreement"/>
                                            <label className="form-check-label" htmlFor="agreement">I accept all the payment & agreement terms and condition</label>
                                        </div>
                                    </div>
                                    <button type="button" disabled={!this.state.agreed} onClick={this.handleSubmit} className="btn btn-outline-dark mt-3" data-dismiss="modal" aria-label="Close">Assign contract</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
