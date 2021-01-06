import React, { Component } from "react";
import axios from "axios";
import Header from "../../shared/Header";
import { Link } from "react-router-dom";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Helper, url } from "../../../helper/helper";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { withTranslation } from "react-i18next";

class MyResources extends Component {
  state = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    type: "Client",
    type_err: false,
    success: 0,
    loading: false,
    errors: null,
    email_unq: null,
  };

  componentDidMount = (params) => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.myRef = React.createRef();
    this.loadData(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadData = async (axiosCancelSource) => {
    if (this.props.match.params.id) {
      const token = await localStorage.getItem("token");
      const response = await axios.get(
        `${url}/api/resource/${this.props.match.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: axiosCancelSource.token,
        }
      );
      if (response.status === 200) {
        const {
          first_name,
          last_name,
          email,
          company,
          type,
          phone,
        } = response.data.data;
        this.setState({
          first_name: first_name,
          last_name: last_name,
          email: email,
          company: company,
          type: type,
          phone,
        });
      }
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ email_unq: null, errors: null });

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("first_name", this.state.first_name);
    data.set("last_name", this.state.last_name);
    data.set("phone", this.state.phone);
    data.set("email", this.state.email);
    data.set("company", this.state.company);
    data.set("type", this.state.type);
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
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/customers-list");
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
      email: this.state.email,
      company: this.state.company,
      type: this.state.type,
      phone: this.state.phone,
    };

    axios
      .put(`${url}/api/resource/update/${this.props.match.params.id}`, null, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ success: 1 });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/customers-list");
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
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
            ? t("success.cus_upd")
            : t("success.cus_ins")}
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
              {t("mycustomer.heading_2")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <BussinessSidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <h3 className="head3" style={{ paddingBottom: "1%" }}>
                {t("b_sidebar.cus.create_customers")}
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
                            value={this.state.first_name}
                            required
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
                            value={this.state.last_name}
                            required
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
                            value={this.state.email}
                            required
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
                            value={this.state.company}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="company">{t("account.phone")}</label>
                          <input
                            id="phone"
                            name="phone"
                            onChange={this.handleChange}
                            className="form-control"
                            type="text"
                            value={this.state.phone}
                            required
                            maxLength="18"
                          />
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
