import React, { Component } from "react";
import Header from "../shared/Header";
import BussinessSidebar from "../shared/BussinessSidebar";
import { withTranslation } from "react-i18next";

class Dashboard extends Component {
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
                        <i className="icon-materials"></i>
                        {t("bussiness_dashboard.agreements")}{" "}
                        <span className="badge badge-light">15</span>
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
                        <span className="badge badge-light">15</span>
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
                        <i className="icon-work"></i>
                        {t("bussiness_dashboard.resources")}{" "}
                        <span className="badge badge-light">15</span>
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
                        <i className="icon-offce-details"></i>
                        {t("bussiness_dashboard.requests")}{" "}
                        <span className="badge badge-light">15</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Dashboard);
