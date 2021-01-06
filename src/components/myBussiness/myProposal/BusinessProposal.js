import React, { Component } from "react";
import axios from "axios";
import { Helper, url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class BusinessProposal extends Component {
  state = {
    feeds: [],
    drafts: [],
    notification_bid_id: 0,
    notification_sender_id: 0,
    proposal_client_id: 0,
    proposal_request_id: 0,
    draft: "",
  };

  componentDidMount = async () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    this.loadNotif(this.axiosCancelSource);
    this.loadDrafts(this.axiosCancelSource);
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.axiosCancelSource.cancel();
  }

  loadNotif = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/contracts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ feeds: result.data.data });
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

  loadDrafts = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/proposal/get/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          this.setState({ drafts: result.data });
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

  handleNameChange = (e) => {
    if (e.target.value !== "--Select--") {
      const { selectedIndex } = e.target.options;
      const { feeds } = this.state;
      const { notification_bid_id, notification_sender_id } = feeds[
        selectedIndex - 1
      ];
      this.setState({ notification_bid_id, notification_sender_id });
    }
  };

  handleNameChange1 = (e) => {
    if (e.target.value !== "--Select--") {
      const { selectedIndex } = e.target.options;
      const { drafts } = this.state;
      const { proposal_client_id, proposal_request_id, draft } = drafts[
        selectedIndex - 1
      ];
      this.setState({ proposal_client_id, proposal_request_id, draft });
    }
  };

  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <Header active={"bussiness"} />
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/business-dashboard"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("mycustomer.heading")}
            </Link>
            <Link
              to="/proposal-listing"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("b_sidebar.proposal.proposal")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("c_material_list.listing.create")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <BussinessSidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <div
                className="card"
                style={{ maxWidth: "1120px", maxHeight: "70vh" }}
              >
                <div className="card-body">
                  <ul className="nav tablist">
                    <li className="nav-item">
                      <Link className="nav-link" to="/business-propsal-create">
                        {t("myproposal.scratch")}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#request"
                        role="button"
                        aria-expanded="false"
                        aria-controls="request"
                      >
                        {t("myproposal.prop_request")}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#draft"
                        role="button"
                        aria-expanded="false"
                        aria-controls="draft"
                      >
                        {t("myproposal.prop_upd")}
                      </a>
                    </li>
                  </ul>
                  <div className="collapse" id="request">
                    <div className="modal-dialog modal-lg modal-visible">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="form-group">
                            <label for="select-proposal" />
                            Select proposal / agreement
                            <div className="row">
                              <div className="col-md-8">
                                <select
                                  onChange={this.handleNameChange}
                                  id="select-agreement"
                                  className="form-control"
                                >
                                  <option>--Select--</option>
                                  {this.state.feeds
                                    ? this.state.feeds.map(
                                        (
                                          {
                                            notification_status,
                                            tender_title,
                                            bid_status,
                                            sender_isLogged,
                                          },
                                          index
                                        ) =>
                                          bid_status === 3 &&
                                          !sender_isLogged ? (
                                            <option>{tender_title}</option>
                                          ) : null
                                      )
                                    : []}
                                </select>
                              </div>
                              <div className="col-md-4 mt-md-0 mt-4">
                                {this.state.notification_bid_id > 0 ||
                                this.state.notification_sender_id > 0 ? (
                                  <Link
                                    className="btn btn-blue"
                                    to={{
                                      pathname: `/business-propsal-create/${this.state.notification_bid_id}/${this.state.notification_sender_id}`,
                                    }}
                                  >
                                    Create Proposal
                                  </Link>
                                ) : null}

                                {/* <button type="submit" className="btn btn-blue">
                                Create Proposal
                              </button> */}
                              </div>
                            </div>
                          </div>
                          <br />
                          <br />
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="collapse" id="draft">
                    <div className="modal-dialog modal-lg modal-visible">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="form-group">
                            <label for="select-proposal" />
                            Select proposal / agreement
                            <div className="row">
                              <div className="col-md-8">
                                <select
                                  onChange={this.handleNameChange1}
                                  id="select-agreement"
                                  className="form-control"
                                >
                                  <option>--Select--</option>
                                  {typeof this.state.drafts !== "string"
                                    ? this.state.drafts.map(
                                        (
                                          {
                                            proposal_request_id,
                                            proposal_client_type,
                                            proposal_names,
                                          },
                                          index
                                        ) => (
                                          <option>{`${proposal_names}`}</option>
                                        )
                                      )
                                    : []}
                                </select>
                              </div>
                              <div className="col-md-4 mt-md-0 mt-4">
                                {this.state.proposal_request_id > 0 ? (
                                  <Link
                                    className="btn btn-blue"
                                    to={{
                                      pathname: `/business-propsal-create/${this.state.proposal_request_id}/${this.state.proposal_client_id}/${this.state.draft}`,
                                    }}
                                  >
                                    Update Proposal
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <br />
                          <br />
                          <br />
                        </div>
                      </div>
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

export default withTranslation()(BusinessProposal);
