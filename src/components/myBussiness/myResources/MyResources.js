import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Helper, url } from "../../../helper/helper";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

class MyResources extends Component {
  state = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    type: "Sub Contractor",
    permission: 0,
    success: 0,
    loading: false,
    errors: null,
    email_unq: null,
    permissions: [],
    permission_id: "",
  };

  componentDidMount = async (params) => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.myRef = React.createRef();
    this.loadData(this.axiosCancelSource);
    this.loadPermission(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadPermission = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/resourcePermission`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            permissions: response.data.data,
          });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.log(err.response);
        }
      });
  };

  loadData = async (axiosCancelSource) => {
    if (this.props.match.params.id) {
      const token = await localStorage.getItem("token");
      axios
        .get(`${url}/api/resource/${this.props.match.params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        })
        .then((response) => {
          if (this._isMounted) {
            const {
              first_name,
              last_name,
              phone,
              email,
              company,
              type,
              permission_id,
            } = response.data.data;
            this.setState({
              first_name: first_name,
              last_name: last_name,
              email: email,
              company: company,
              type: type,
              phone,
              permission: permission_id,
            });
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("Request canceled", err.message);
          } else {
            console.log(err.response);
          }
        });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("first_name", this.state.first_name);
    data.set("last_name", this.state.last_name);
    data.set("phone", this.state.phone);
    data.set("email", this.state.email);
    data.set("company", this.state.company);
    data.set("type", this.state.type);
    data.set("permission", this.state.permission);
    axios
      .post(`${url}/api/resources`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          success: 1,
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          company: "",
          type: "",
          permission: "",
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/resource-list");
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        if (err.response.status === 500) {
          this.setState({ errors: "Some Issue Occured" });
        }
        // this.setState({ success: 2 });
        this.myRef.current.scrollTo(0, 0);
      });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const params = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone: this.state.phone,
      email: this.state.email,
      company: this.state.company,
      type: this.state.type,
      permission_id: this.state.permission,
    };

    axios
      .put(`${url}/api/resource/update/${this.props.match.params.id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/resource-list");
      })
      .catch((err) => {
        if (err.response.status === 406) {
          if (err.response.data.error.email) {
            this.setState({
              email_unq: err.response.data.error.email[0],
            });
          }
        }
        this.setState({ loading: false });
      });
  };

  handleChange = (event) => {
    if (event.target.value !== "--Select--") {
      const { name, value } = event.target;
      this.setState({ [name]: value });
    }
  };

  render() {
    const { t, i18n } = this.props;

    let alert, loading;
    if (this.state.loading === true) {
      loading = (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }
    if (this.state.success === 1) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {this.props.match.params.id
            ? t("success.res_upd")
            : t("success.res_ins")}
        </Alert>
      );
    } else if (this.state.success === 2) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px" }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, "");
            return stringData;
          })}
        </Alert>
      );
    }
    return (
      <div>
        <Header active={"bussiness"} />
        <div class="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/business-dashboard"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("mycustomer.heading")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("invoice.heading")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <BussinessSidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <h3 className="head3" style={{ paddingBottom: "1%" }}>
                {t("b_sidebar.resources.create_resources")}
              </h3>

              <div className="card" style={{ maxWidth: "1120px" }}>
                <form
                  onSubmit={
                    this.props.match.params.id
                      ? this.handleUpdate
                      : this.handleSubmit
                  }
                >
                  <div class="card-body">
                    <div className="mt-3"></div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="first_name">
                            {t("account.first_name")}
                          </label>
                          <input
                            id="first_name"
                            name="first_name"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            required
                            value={this.state.first_name}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <label for="last_name">
                            {t("account.last_name")}
                          </label>
                          <input
                            id="last_name"
                            name="last_name"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            required
                            value={this.state.last_name}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="email">{t("account.email")}</label>
                          <input
                            id="email"
                            name="email"
                            onChange={this.handleChange}
                            className="form-control"
                            type="email"
                            required
                            value={this.state.email}
                          />
                          <p style={{ color: "#eb516d " }}>
                            {this.state.email_unq ? this.state.email_unq : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <label for="company">{t("account.company")}</label>
                          <input
                            id="company"
                            name="company"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            required
                            value={this.state.company}
                          />
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="type">{t("account.type")}</label>
                          <select
                            onChange={this.handleChange}
                            name="type"
                            id="type"
                            required
                            class="form-control"
                            value={this.state.type}
                          >
                            <option value="Sub Contractor">
                              Sub Contractor
                            </option>
                            <option value="Supplier">Supplier</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <label for="company">{t("account.phone")}</label>
                          <input
                            id="phone"
                            name="phone"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            required
                            maxLength="18"
                            value={this.state.phone}
                          />
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="permission">
                            {t("account.permission")}
                          </label>
                          <select
                            onChange={this.handleChange}
                            name="permission"
                            id="permission"
                            required
                            class="form-control"
                            value={this.state.permission}
                          >
                            <option>--Select--</option>
                            {typeof this.state.permissions !== "undefined"
                              ? this.state.permissions.map(
                                  ({ role_name, id }, index) => (
                                    <option value={id}>{role_name}</option>
                                  )
                                )
                              : null}
                          </select>
                        </div>
                      </div>
                    </div>
                    <p style={{ color: "#eb516d " }}>
                      {this.state.errors ? this.state.errors : null}
                    </p>
                    <div>
                      <div className="form-group">
                        <label className="d-none d-xl-block">&nbsp;</label>
                        <div className="clear"></div>
                        {loading ? (
                          loading
                        ) : (
                          <button className="btn btn-success">
                            {this.props.match.params.id ? "Update" : "Create"}
                          </button>
                        )}
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

export default withTranslation()(MyResources);
