import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import Alert from "react-bootstrap/Alert";
import { Helper, url } from "../../helper/helper";
import i18n from "../../locales/i18n";
import { Translation } from "react-i18next";
import File from "../../images/file-icon.png";

class Myaccount extends Component {
  state = {
    logo: null,
    logo_preview: null,

    work: "",
    insurance: "",

    agreement_material_guarantee: "",
    agreement_work_guarantee: "",
    agreement_insurances: "",
    agreement_panelty: "",

    first_name: "",
    last_name: "",
    company_id: "",
    company_website: "",
    address: "",
    email: "",
    phone: "",
    zip: "",
    password: "",
    old_password: "",
    lang: localStorage.getItem("_lng"),
    password_err: false,
    info: [],
    success: Boolean,
    errors: [],
    translated: false,
  };

  componentDidMount = () => {
    this.loadData();
    this.myRef = React.createRef();
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    const { data } = await axios.get(`${url}/api/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    this.setState({
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
      work: data.work,
      insurance: data.insurance,
      agreement_material_guarantee: data.agreement_material_guarantee,
      agreement_work_guarantee: data.agreement_work_guarantee,
      agreement_insurances: data.agreement_insurances,
      agreement_panelty: data.agreement_panelty,
    });
  };

  //handlers
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
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handlePwd = async (event) => {
    if (this.state.password == "" || this.state.old_password == "") {
      this.setState({ password_err: true });
    }

    event.preventDefault();
    const data = new FormData();
    data.set("password", this.state.password);
    data.set("old_password", this.state.old_password);

    const token = await localStorage.getItem("token");
    axios
      .post(`${url}/api/storePwd`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ success: true, password_err: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ success: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
  };
  handleSubmit = async (event) => {
    // if (this.state.password == "" || this.state.old_password == "") {
    //   this.setState({ password_err: true });
    // }

    event.preventDefault();
    const data = new FormData();
    // if (this.state.logo !== null) {
    data.set("company_logo", this.state.logo);
    // }
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
        this.setState({ success: true, password_err: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err.response);
        // Object.entries(err.response.data.error).map(([key, value]) => {
        // this.setState({ errors: err.response.data.error });
        // })
        // this.setState({ success: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  handlePropDetails = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("work", this.state.work);
    data.set("insurance", this.state.insurance);

    const token = await localStorage.getItem("token");
    axios
      .post(`${url}/api/storePropDetails`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ success: true });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ errors: "fields required", success: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleAgreeDetails = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("agreement_work_guarantee", this.state.agreement_work_guarantee);
    data.set(
      "agreement_material_guarantee",
      this.state.agreement_material_guarantee
    );
    data.set("agreement_insurances", this.state.agreement_insurances);
    data.set("agreement_panelty", this.state.agreement_panelty);

    const token = await localStorage.getItem("token");
    axios
      .post(`${url}/api/storeAgreeDetails`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ success: true });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({ errors: "fields required", success: false });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
    localStorage.setItem("_lng", event.target.value);
    // window.location.reload()
    this.setState({ translated: true, lang: event.target.value });
    this.myRef.current.scrollTo(0, 0);
  };

  render() {
    let alert;
    if (this.state.success === false) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px", zIndex: 1 }}>
          {"Passwords don't match"}
        </Alert>
      );
    }
    if (this.state.success === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          Successfully Updated!
        </Alert>
      );
    }
    if (this.state.translated === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          Translation successful!
        </Alert>
      );
    }

    return (
      <div>
        <Header active={"market"} />
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              Marketplace
            </li>
            <Translation>
              {(t) => (
                <li className="breadcrumb-item active" aria-current="page">
                  {t("account.title")}
                </li>
              )}
            </Translation>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <Translation>
                {(t) => (
                  <h3 style={{ paddingBottom: "1%" }} className="head3">
                    {t("account.title")}
                  </h3>
                )}
              </Translation>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <form onSubmit={this.handleSubmit}>
                  <div className="card-body">
                    <div className="mt-3"></div>

                    <div className="form-group account_pic">
                      <div className="file-select file-sel inline">
                        <input
                          onChange={this.handleChange1}
                          type="file"
                          id="attachment1"
                        />
                        <div
                          className="selected-img"
                          style={{ display: "none" }}
                        >
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
                          <span className="status">
                            Upload your company logo
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="first_name">
                                {t("account.first_name")}
                              </label>
                            )}
                          </Translation>
                          <input
                            onChange={this.handleChange}
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            type="text"
                            value={this.state.first_name}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="first_name">
                                {t("account.last_name")}
                              </label>
                            )}
                          </Translation>
                          <input
                            name="last_name"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                            id="last_name"
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="first_name">
                                {t("account.address")}
                              </label>
                            )}
                          </Translation>
                          <input
                            onChange={this.handleChange}
                            id="street1"
                            name="address"
                            className="form-control"
                            type="text"
                            value={this.state.address}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => <label for="zip">{t("account.zip")}</label>}
                          </Translation>
                          <input
                            name="zip"
                            onChange={this.handleChange}
                            id="zip"
                            value={this.state.zip}
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 ">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="phone">{t("account.phone")}</label>
                            )}
                          </Translation>
                          <input
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleChange}
                            id="phone"
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="email">{t("account.email")}</label>
                            )}
                          </Translation>
                          <input
                            name="email"
                            onChange={this.handleChange}
                            id="email"
                            value={this.state.email}
                            className="form-control"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6">
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

                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
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

                      <div className="col-xl-4 col-lg-5 col-md-6 ">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="language">
                                {t("account.language")}
                              </label>
                            )}
                          </Translation>
                          <select
                            value={localStorage.getItem("_lng")}
                            onChange={this.changeLanguage}
                            name="language"
                            id="language"
                            class="form-control"
                          >
                            <option value="en">EN</option>
                            <option value="fi">FI</option>
                          </select>
                          {/* <input name="language" onChange={this.handleChange}
                            id="language" placeholder="Enter current password"
                            className="form-control"
                            type="password"
                          /> */}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>
                        <button className="btn btn-success">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Update Password */}
            <div className="container-fluid">
              <Translation>
                {(t) => (
                  <h3 style={{ paddingBottom: "1%" }} className="head3">
                    {t("account.pwd")}
                  </h3>
                )}
              </Translation>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <form onSubmit={this.handlePwd}>
                  <div className="card-body">
                    <div className="mt-3"></div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6 ">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="password">
                                {t("account.old_password")}
                              </label>
                            )}
                          </Translation>
                          <input
                            name="old_password"
                            onChange={this.handleChange}
                            id="password"
                            placeholder="Enter current password"
                            className="form-control"
                            type="password"
                            required
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.password_err === true
                              ? "Password is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="password">
                                {t("account.password")}
                              </label>
                            )}
                          </Translation>
                          <input
                            name="password"
                            onChange={this.handleChange}
                            id="password"
                            placeholder="Enter new password"
                            className="form-control"
                            type="password"
                            required
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.password_err === true
                              ? "Password is required"
                              : null}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>
                        <button className="btn btn-success">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Proposal Details */}
            <div className="container-fluid">
              <Translation>
                {(t) => (
                  <h3 style={{ paddingBottom: "1%" }} className="head3">
                    {t("account.proposal_guarantee")}
                  </h3>
                )}
              </Translation>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <form onSubmit={this.handlePropDetails}>
                  <div className="card-body">
                    <div className="mt-3"></div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="work">
                                {t("myproposal.guarantees_for_work")}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            maxLength="162"
                            id="work"
                            onChange={this.handleChange}
                            name="work"
                            value={this.state.work}
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="insurance">
                                {t("myproposal.insurance")}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            maxLength="162"
                            id="insurance"
                            onChange={this.handleChange}
                            name="insurance"
                            value={this.state.insurance}
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>
                        <button className="btn btn-success">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Agreement Details */}
            <div className="container-fluid">
              <Translation>
                {(t) => (
                  <h3 style={{ paddingBottom: "1%" }} className="head3">
                    {t("account.agreement_guarantee")}
                  </h3>
                )}
              </Translation>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <form onSubmit={this.handleAgreeDetails}>
                  <div className="card-body">
                    <div className="mt-3"></div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="materials">
                                {t("myagreement.materials_quarantees")}{" "}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            value={this.state.agreement_material_guarantee}
                            onChange={this.handleChange}
                            name="agreement_material_guarantee"
                            style={{ height: "70px" }}
                            id="materials"
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="work-quarantees">
                                {t("myagreement.work_quarantees")}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            value={this.state.agreement_work_guarantee}
                            onChange={this.handleChange}
                            name="agreement_work_guarantee"
                            style={{ height: "70px" }}
                            id="work-quarantees"
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="agreement-insurances">
                                {t("myagreement.agreement_insurances")}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            value={this.state.agreement_insurances}
                            onChange={this.handleChange}
                            name="agreement_insurances"
                            style={{ height: "70px" }}
                            id="agreement_insurances"
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <Translation>
                            {(t) => (
                              <label for="panelty-terms">
                                {t("myagreement.panelty_terms")}
                              </label>
                            )}
                          </Translation>
                          <textarea
                            value={this.state.agreement_panelty}
                            onChange={this.handleChange}
                            name="agreement_panelty"
                            style={{ height: "70px" }}
                            id="panelty-terms"
                            className="form-control"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>
                        <button className="btn btn-success">
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Myaccount;
