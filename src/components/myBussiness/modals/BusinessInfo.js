import React, { Component } from "react";
import axios from "axios";
import { Helper, url } from "../../../helper/helper";
import { Translation } from "react-i18next";

class BusinessInfo extends Component {
  state = {
    logo: null,
    logo_preview: null,

    first_name: "",
    last_name: "",
    company_id: "",
    company_website: "",
    address: "",
    email: "",
    phone: "",
    zip: "",
    lang: localStorage.getItem("_lng"),
    info: [],
    success: Boolean,
    errors: [],
  };

  componentDidMount = () => {
    this.loadData();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  loadData = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${url}/api/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.setState({
      info: data,
      logo_preview: data.company_logo,
      first_name: data.first_name,
      last_name: data.last_name,
      company_id: data.company_id
        ? data.company_id
        : "_" + Math.random().toString(36).substr(2, 9),
      address: data.address,
      email: data.email,
      phone: data.phone,
      zip: data.zip,
      company_website: data.company_website,
    });
    this.props.onInfo(this.state.info);
  };

  handleChange1 = (event) => {
    this.setState({ logo: null });
    if (
      event.target.files[0].name.split(".").pop() == "jpeg" ||
      event.target.files[0].name.split(".").pop() == "png" ||
      event.target.files[0].name.split(".").pop() == "jpg" ||
      event.target.files[0].name.split(".").pop() == "gif" ||
      event.target.files[0].name.split(".").pop() == "svg"
    ) {
      this.setState({
        logo: event.target.files[0],
        logo_preview: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      this.setState({ logo: null });
      alert("File type not supported");
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    if (this.state.logo !== null) {
      data.set("company_logo", this.state.logo);
    }
    data.set("first_name", this.state.first_name);
    data.set("last_name", this.state.last_name);
    data.set("address", this.state.address);
    data.set("email", this.state.email);
    data.set("phone", this.state.phone);
    data.set("zip", this.state.zip);
    data.set("company_id", this.state.company_id);
    data.set("company_website", this.state.company_website);
    data.set("lang", this.state.lang);
    // data.set("password", this.state.password);
    // data.set("old_password", this.state.old_password);

    const token = await localStorage.getItem("token");
    axios
      .post(`${url}/api/storeDetails`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        alert("Updated");
        window.location.reload();
      })
      .catch((err) => {
        window.location.reload();
      });
  };

  render() {
    return (
      <div>
        <div
          class="modal fade"
          id="edit-info"
          tabindex="-1"
          role="dialog"
          aria-labelledby="editInfoModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editInfoModalLabel">
                  Edit Business Information
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group" style={{ width: "30%" }}>
                    <div className="file-select file-sel inline">
                      <input
                        onChange={this.handleChange1}
                        type="file"
                        id="attachment1"
                      />
                      <div className="selected-img" style={{ display: "none" }}>
                        <img src={this.state.logo_preview} alt="" />
                        <span>remove</span>
                      </div>
                      <label for="attachment1">
                        <img
                          src={
                            this.state.logo_preview === null
                              ? File
                              : url +
                                "/images/marketplace/company_logo/" +
                                this.state.logo_preview
                          }
                          alt=""
                        />
                        <span className="status">Upload your company logo</span>
                      </label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="f-name">First Name</label>
                        <input
                          id="f-name"
                          onChange={this.handleChange}
                          name="first_name"
                          class="form-control"
                          type="text"
                          value={this.state.first_name}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="l-name">Last Name</label>
                        <input
                          id="l-name"
                          onChange={this.handleChange}
                          name="last_name"
                          class="form-control"
                          type="text"
                          value={this.state.last_name}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="address">Address</label>
                        <input
                          id="address"
                          onChange={this.handleChange}
                          name="address"
                          class="form-control"
                          type="text"
                          value={this.state.address}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="zip">Zip</label>
                        <input
                          id="zip"
                          onChange={this.handleChange}
                          name="zip"
                          class="form-control"
                          type="text"
                          value={this.state.zip}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="phone">Phone</label>
                        <input
                          id="phone"
                          onChange={this.handleChange}
                          name="phone"
                          class="form-control"
                          type="text"
                          value={this.state.phone}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="email">Email</label>
                        <input
                          id="email"
                          onChange={this.handleChange}
                          name="email"
                          class="form-control"
                          type="email"
                          value={this.state.email}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label for="company_id">Customer ID</label>
                        <input
                          name="company_id"
                          onChange={this.handleChange}
                          id="company_id"
                          value={this.state.company_id}
                          className="form-control"
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label for="company_website">Customer Website</label>
                        <input
                          name="company_website"
                          onChange={this.handleChange}
                          id="company_website"
                          value={this.state.company_website}
                          className="form-control"
                          type="url"
                        />
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary mt-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessInfo;
