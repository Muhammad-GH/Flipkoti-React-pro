import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Helper, url } from "../../helper/helper";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { HashRouter as Router, Link } from "react-router-dom";

class Materiallisitngs extends Component {
  materials_search = [];

  constructor(props) {
    super(props);
    this.state = {
      role: "",
      materials: [],
      productcats: [],
      productcat: "",
      search: null,
      checked: true,
      left: null,
      right: null,
    };
  }

  componentDidMount = async () => {
    this.loadData();
    this.loadConfig();
    this.loadCategory();
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/material-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const { role, data } = result.data;
        this.materials_search = data;
        this.setState({ role, materials: data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/config/currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const { left, right } = result.data;
        this.setState({ left, right });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadCategory = async () => {
    // if (this._isMounted) {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        this.setState({ productcats: result.data.data });
      })
      .catch((err) => {
        // if (axios.isCancel(err)) {
        //   // console.log("Request canceled", err.message);
        // } else {
        console.log(err.response);
        // }
      });
    // }
  };

  searchSpace = (event) => {
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  handleChange = (event) => {
    this.setState({ materials: this.materials_search });
    this.setState({ productcat: event.target.value }, () => {
      if (this.state.productcat == "--Select--") {
        this.loadData();
      }
      this.setState((prevstate) => ({
        materials: prevstate.materials.filter((data) => {
          return data.category.includes(this.state.productcat);
        }),
      }));
    });
  };

  handleCheck = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        materials: this.state.materials.filter((data) => {
          return data.tender_type.includes("Offer");
        }),
      });
    } else this.loadData();
  };

  handleCheck1 = (params) => {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({
        materials: this.state.materials.filter((data) => {
          return data.tender_type.includes("Request");
        }),
      });
    } else this.loadData();
  };

  render() {
    const { t, i18n } = this.props;

    const productLoop = this.state.productcats
      ? this.state.productcats.map(({ category_id, category_name }, index) => (
          <option value={category_name}>{category_name}</option>
        ))
      : [];

    const items = this.state.materials
      ? this.state.materials.filter((data) => {
          if (this.state.search == null) return data;
          else if (
            data.tender_type
              .toLowerCase()
              .includes(this.state.search.toLowerCase()) ||
            data.tender_title
              .toLowerCase()
              .includes(this.state.search.toLowerCase())
          ) {
            return data;
          }
        })
      : [];

    const itemsList = items
      ? items.map((material) => (
          <tr key={material.tender_id}>
            <td style={{ width: "50px" }}>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="check2"
                />
                <label className="form-check-label" htmlFor="check2"></label>
              </div>
            </td>
            <td data-label="Type: ">{material.tender_title}</td>
            <td data-label="Type: ">{material.tender_type}</td>
            <td data-label="Start Date: ">{material.created_at}</td>
            <td data-label="End Date: ">
              {material.tender_expiry_date.substring(0, 24)}
            </td>
            <td>
              {moment(material.tender_expiry_date).isBefore(moment()._d) ? (
                <span className="badge badge-warning">Expired</span>
              ) : (
                <span className="badge badge-primary">Posted</span>
              )}
            </td>
            <td data-label="Current bid: ">
              {material.quote
                ? `${this.state.left} ${material.quote} ${this.state.right}`
                : `${this.state.left} 0.00  ${this.state.right}`}
            </td>
            <td data-label="View: ">
              <Link
                to={{
                  pathname: `/listing-detail/${material.tender_id}`,
                }}
                className="btn btn-info"
              >
                Details
              </Link>
            </td>
          </tr>
        ))
      : [];

    return (
      <div>
        <Header active={"market"} />
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <Link
              to="/feeds"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("header.marketplace")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("c_material_list.listing.material_listings")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div className="page-content">
            <div className="container-fluid">
              <h3 className="head3">{t("feeds.search.title")}</h3>
              <div className="card">
                <div className="card-body">
                  <div className="filter">
                    <div className="row align-items-center">
                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <label htmlFor="product">
                            {t("feeds.search.product")}
                          </label>
                          <input
                            id="product"
                            onChange={(e) => this.searchSpace(e)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-6">
                        <div className="form-group">
                          <label htmlFor="productcat">
                            {t("feeds.search.product_category")}
                          </label>
                          <select
                            onChange={this.handleChange}
                            name="productcat"
                            id="productcat"
                            className="form-control"
                          >
                            <option>--Select--</option>
                            {productLoop}
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-12">
                        <div className="form-group">
                          <div className="form-check form-check-inline">
                            <input
                              onChange={this.handleCheck}
                              type="checkbox"
                              className="form-check-input"
                              id="exampleCheck1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="exampleCheck1"
                            >
                              {t("feeds.search.offer")}
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              onChange={this.handleCheck1}
                              type="checkbox"
                              className="form-check-input"
                              id="exampleCheck2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="exampleCheck2"
                            >
                              {t("feeds.search.request")}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <h2 className="head2">
                    {t("c_material_list.listing.my_listings")}
                  </h2>
                  <div className="btn-group">
                    <Link
                      className="btn btn-blue text-uppercase"
                      to="/create-material-list"
                    >
                      {t("c_material_list.listing.create")}
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table ">
                      <thead>
                        <tr style={{ fontSize: "15px" }}>
                          <th style={{ width: "50px" }}>
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="check1"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="check1"
                              ></label>
                            </div>
                          </th>
                          <th>{t("c_material_list.listing.title")}</th>
                          <th>{t("c_material_list.listing.type")}</th>
                          <th>{t("c_material_list.listing.start_date")}</th>
                          <th>{t("c_material_list.listing.end_date")}</th>
                          <th></th>
                          <th>{t("c_material_list.listing.current_bid")}</th>
                          <th>{t("c_material_list.listing.view")}</th>
                        </tr>
                      </thead>
                      <tbody>{itemsList}</tbody>
                    </table>
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

export default withTranslation()(Materiallisitngs);
