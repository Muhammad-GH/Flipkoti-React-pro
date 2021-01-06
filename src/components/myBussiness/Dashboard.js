import React, { Component } from "react";
import axios from "axios";
import { url } from "../../helper/helper";
import Header from "../shared/Header";
import BussinessSidebar from "../shared/BussinessSidebar";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  state = {
    proposal: [],
    agreement: [],
    resource: [],
    invoice: [],
    request: [],
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.myProposal(this.axiosCancelSource);
    this.myAgreement(this.axiosCancelSource);
    this.myResource(this.axiosCancelSource);
    this.myInvoice(this.axiosCancelSource);
    this.myRequests(this.axiosCancelSource);
  };

  myProposal = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/dashboard_bussiness/proposal`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ proposal: result.data.data });
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
  myAgreement = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/dashboard_bussiness/agreement`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ agreement: result.data.data });
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
  myResource = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/dashboard_bussiness/resources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ resource: result.data.data });
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
  myInvoice = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/dashboard_bussiness/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ invoice: result.data.data });
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
  myRequests = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/dashboard_bussiness/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ request: result.data.data });
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

  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <Header active={"bussiness"} />
        <div class="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">
              {t("mycustomer.heading")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <BussinessSidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container">
              <h3 className="head3">{t("bussiness_dashboard.heading")}</h3>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-edit-file"></i>
                        {t("bussiness_dashboard.proposals")}{" "}
                        <span className="badge badge-light">
                          {this.state.proposal ? this.state.proposal.total : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          <Link to="/proposal-listing">
                            {t("bussiness_dashboard.Open")}
                          </Link>
                          <span className="badge badge-light">
                            {this.state.proposal ? this.state.proposal.open : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/proposal-listing">
                            {t("bussiness_dashboard.Old")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {" "}
                            {this.state.proposal ? this.state.proposal.old : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/proposal-listing">
                            {t("bussiness_dashboard.Expired")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {" "}
                            {this.state.proposal
                              ? this.state.proposal.expired
                              : 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-materials"></i>
                        {t("bussiness_dashboard.agreements")}{" "}
                        <span className="badge badge-light">
                          {this.state.agreement
                            ? this.state.agreement.total
                            : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          <Link to="/agreement-listing">
                            {t("bussiness_dashboard.Open")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.agreement
                              ? this.state.agreement.open
                              : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/agreement-listing">
                            {t("bussiness_dashboard.Old")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.agreement
                              ? this.state.agreement.old
                              : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/agreement-listing">
                            {t("bussiness_dashboard.Expired")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.agreement
                              ? this.state.agreement.expired
                              : 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-work"></i>
                        {t("bussiness_dashboard.projects")}{" "}
                        <span className="badge badge-light">10</span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          {t("bussiness_dashboard.Open")}{" "}
                          <span className="badge badge-light">60</span>
                        </li>
                        <li>
                          {t("bussiness_dashboard.Old")}{" "}
                          <span className="badge badge-light">40</span>
                        </li>
                        <li>
                          {t("bussiness_dashboard.Expired")}{" "}
                          <span className="badge badge-light">20</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-jobs"></i>
                        {t("bussiness_dashboard.billing")}{" "}
                        <span className="badge badge-light">
                          {" "}
                          {this.state.invoice ? this.state.invoice.total : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          <Link to="/invoice-list">
                            {t("bussiness_dashboard.Open")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {" "}
                            {this.state.invoice ? this.state.invoice.open : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/invoice-list">
                            {t("bussiness_dashboard.Old")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {" "}
                            {this.state.invoice ? this.state.invoice.old : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/invoice-list">
                            {t("bussiness_dashboard.Expired")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {" "}
                            {this.state.invoice
                              ? this.state.invoice.expired
                              : 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-work"></i>
                        {t("bussiness_dashboard.resources")}{" "}
                        <span className="badge badge-light">
                          {this.state.resource ? this.state.resource.total : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          <Link to="/customers-list">
                            {t("bussiness_dashboard.customers")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.resource
                              ? this.state.resource.customer
                              : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/resource-list">
                            {t("bussiness_dashboard.resources")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.resource
                              ? this.state.resource.resource
                              : 0}
                          </span>
                        </li>
                        <li>
                          <Link to="/resource-list">
                            {t("bussiness_dashboard.Expired")}{" "}
                          </Link>

                          <span className="badge badge-light">
                            {this.state.resource
                              ? this.state.resource.expired
                              : 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="card db-card">
                    <div className="card-header">
                      <h4>
                        <i className="icon-offce-details"></i>
                        {t("bussiness_dashboard.requests")}{" "}
                        <span className="badge badge-light">
                          {this.state.request ? this.state.request.total : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <ul>
                        <li>
                          {t("bussiness_dashboard.Open")}{" "}
                          <span className="badge badge-light">
                            {this.state.request ? this.state.request.open : 0}
                          </span>
                        </li>
                        <li>
                          {t("bussiness_dashboard.Old")}{" "}
                          <span className="badge badge-light">
                            {this.state.request ? this.state.request.old : 0}
                          </span>
                        </li>
                        <li>
                          {t("bussiness_dashboard.Expired")}{" "}
                          <span className="badge badge-light">
                            {this.state.request
                              ? this.state.request.expired
                              : 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Dashboard);
