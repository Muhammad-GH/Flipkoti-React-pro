import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Helper, url } from "../../helper/helper";
import { Link, Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";

class MyNotifications extends Component {
  state = {
    notifs: [],
  };

  componentDidMount = () => {
    this.loadNotif();
  };

  loadNotif = async () => {
    const token = await localStorage.getItem("token");
    const response = await axios.get(`${url}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      this.setState({ notifs: response.data.data });
    }
  };

  render() {
    const { t, i18n } = this.props;

    const notifications = this.state.notifs
      ? this.state.notifs.map((notif) => (
          <div>
            {notif.sender_isLogged &&
            notif.notification_type === "accept-bid" ? (
              <Link to="/my-contracts">
                <div class="card mb-1">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <p>Submit proposal to {notif.sender}</p>
                      </div>
                      <div class="col-lg-4">
                        <b class="fw-500">{notif.created_at}</b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === "decline-bid" ? (
              <Link to="/my-contracts">
                <div class="card mb-1">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <p>Proposal declined by {notif.sender}</p>
                      </div>
                      <div class="col-lg-4">
                        <b class="fw-500">{notif.created_at}</b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : notif.sender_isLogged &&
              notif.notification_type === "bid_made" ? (
              <Link
                to={{
                  pathname: `/listing-detail/${notif.notification_bid_id}`,
                }}
              >
                <div class="card mb-1">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <p>
                          {notif.notification_message} by {notif.sender}
                        </p>
                      </div>
                      <div class="col-lg-4">
                        <b class="fw-500">{notif.created_at}</b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}
            {notif.sender_isLogged &&
            notif.notification_type === "proposal_sent" ? (
              <React.Fragment>
                {notif.notification_type === "accept-bid" ? (
                  <Link to="/my-contracts">
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {notif.notification_type === "accept-bid"
                                ? `Bid accepted by ${notif.sender}`
                                : notif.notification_type === "decline-bid"
                                ? `Bid declined by ${notif.sender}`
                                : null}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.notification_type === "decline-bid" ? (
                  <Link to="/my-contracts">
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {notif.notification_type === "accept-bid"
                                ? `Bid accepted by ${notif.sender}`
                                : notif.notification_type === "decline-bid"
                                ? `Bid declined by ${notif.sender}`
                                : null}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
                <Link
                  to={{
                    pathname: `/proposal-listing`,
                  }}
                >
                  <div class="card mb-1">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-lg-4">
                          <p>
                            {notif.sender_isLogged &&
                            notif.notification_type === "proposal_sent"
                              ? `Proposal sent by ${notif.sender} on email`
                              : null}
                          </p>
                        </div>
                        <div class="col-lg-4">
                          <b class="fw-500">{notif.created_at}</b>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </React.Fragment>
            ) : null}

            {notif.sender_isLogged &&
            notif.notification_type === "agreement_sent" ? (
              <Link
                to={{
                  pathname: `/agreement-listing`,
                }}
              >
                <div class="card mb-1">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <p>
                          {notif.sender_isLogged &&
                          notif.notification_type === "agreement_sent"
                            ? `Agreement sent by ${notif.sender} on email`
                            : null}
                        </p>
                      </div>
                      <div class="col-lg-4">
                        <b class="fw-500">{notif.created_at}</b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {notif.sender_isLogged &&
            notif.notification_type === "invoice_sent" ? (
              <Link
                to={{
                  pathname: `/invoice-list`,
                }}
              >
                <div class="card mb-1">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-4">
                        <p>
                          {notif.sender_isLogged &&
                          notif.notification_type === "invoice_sent"
                            ? `Invoice sent by ${notif.sender} on email`
                            : null}
                        </p>
                      </div>
                      <div class="col-lg-4">
                        <b class="fw-500">{notif.created_at}</b>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {(notif.sender_isLogged &&
              notif.notification_type === "agreement_accepted") ||
            notif.notification_type === "agreement_declined" ||
            notif.notification_type === "agreement_revision" ? (
              <React.Fragment>
                {notif.sender_isLogged &&
                notif.notification_type === "agreement_revision" ? (
                  <Link
                    to={{
                      pathname: `/agreement-listing`,
                    }}
                  >
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {`Agreement revision by ${notif.sender} for request ${notif.notification_user_id}${notif.notification_bid_id}`}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type !== "agreement_revision" ? (
                  <Link>
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {`Agreement ${notif.notification_message} by ${notif.sender}`}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </React.Fragment>
            ) : null}

            {(notif.sender_isLogged &&
              notif.notification_type === "proposal_accepted") ||
            notif.notification_type === "proposal_declined" ||
            notif.notification_type === "proposal_revision" ? (
              <React.Fragment>
                {notif.sender_isLogged &&
                notif.notification_type === "proposal_revision" ? (
                  <Link
                    to={{
                      pathname: `/proposal-listing`,
                    }}
                  >
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {`Proposal revision by ${notif.sender} for request ${notif.notification_user_id}${notif.notification_bid_id}`}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : notif.sender_isLogged &&
                  notif.notification_type !== "proposal_revision" ? (
                  <Link>
                    <div class="card mb-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-lg-4">
                            <p>
                              {`Proposal ${notif.notification_message} by ${notif.sender}`}
                            </p>
                          </div>
                          <div class="col-lg-4">
                            <b class="fw-500">{notif.created_at}</b>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </React.Fragment>
            ) : null}
          </div>
        ))
      : [];

    return (
      <div>
        <Header />
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              {t("my_notif.title")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("my_notif.title")}</h3>

              {notifications}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MyNotifications);
