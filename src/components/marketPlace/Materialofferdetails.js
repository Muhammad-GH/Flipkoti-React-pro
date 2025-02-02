import React, { Component } from "react";
import axios from "axios";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import { Helper, url } from "../../helper/helper";
import Carousel from "react-bootstrap/Carousel";
import ProgressBar from "react-bootstrap/ProgressBar";
import { HashRouter as Router, Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { withTranslation } from "react-i18next";

class Materialofferdetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      slider: [],
      cities: [],
      imgs: [],
      active: null,
      tb_quote: 0.0,
      tb_description: null,
      tb_quantity: 0.0,
      tb_city_id: 0,
      tb_city_id_err: false,
      tb_delivery_type: null,
      tb_delivery_type_err: false,
      tb_delivery_charges: 0.0,
      tb_warrenty: 0,
      warrenty_err: false,
      tb_warrenty_type: "Days",
      attachment: null,
      featured_image: null,
      img_preview: null,
      loaded1: 0,
      loaded: 0,
      errors: [],
      show_errors: false,
      show_msg: false,
      saved: [],
      refresh: false,

      left: null,
      right: null,
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    this.loadData();
    this.loadCity();
    this.loadSaved();
    this.loadConfig();
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refresh !== this.state.refresh) {
      this.loadData();
      this.loadSaved();
    }
  }

  loadCity = async () => {
    const token = await localStorage.getItem("token");
    let lang = await localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/state/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ cities: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      warrenty_err: false,
      tb_city_id_err: false,
      tb_delivery_type_err: false,
    });

    if (
      this.state.tb_warrenty == "--Select--" ||
      this.state.tb_warrenty == null
    ) {
      return this.setState({ warrenty_err: true });
    }
    if (this.state.tb_city_id == "--Select--" || this.state.tb_city_id == 0) {
      return this.setState({ tb_city_id_err: true });
    }
    if (
      this.state.tb_delivery_type == "--Select--" ||
      this.state.tb_delivery_type == null
    ) {
      return this.setState({ tb_delivery_type_err: true });
    }

    const token = await localStorage.getItem("token");
    const data = new FormData();
    data.set("tb_tender_id", this.props.match.params.id);
    data.set("tb_quote", this.state.tb_quote);
    data.set("tb_description", this.state.tb_description);
    data.set("tb_quantity", this.state.tb_quantity);
    data.set("tb_city_id", this.state.tb_city_id);
    data.set("tb_delivery_type", this.state.tb_delivery_type);
    data.set("tb_delivery_charges", this.state.tb_delivery_charges);
    data.set("tb_warrenty", this.state.tb_warrenty);
    data.set("tb_warrenty_type", this.state.tb_warrenty_type);
    data.append("attachment", this.state.attachment);
    // data.append("featured_image", this.state.featured_image);

    axios
      .post(`${url}/api/bid/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
        this.myRef.current.scrollTo(0, 0);
        this.setState({
          show_msg: true,
          tb_quote: 0,
          tb_quantity: 0,
          tb_delivery_charges: 0,
          tb_warrenty: 0,
          tb_description: "",
          attachment: null,
          loaded1: 0,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        this.myRef.current.scrollTo(0, 0);
        this.setState({ show_errors: true });
      });
  };

  handleChange1 = (event) => {
    this.setState({ tb_quote: event.target.value });
  };
  handleChange2 = (event) => {
    this.setState({ tb_quantity: event.target.value });
  };
  handleChange3 = (event) => {
    this.setState({ tb_city_id: event.target.value });
  };
  handleChange4 = (event) => {
    this.setState({ tb_delivery_type: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ tb_delivery_charges: event.target.value });
  };
  handleChange6 = (event) => {
    this.setState({ tb_warrenty: event.target.value });
  };
  handleChange7 = (event) => {
    this.setState({ tb_warrenty_type: event.target.value });
  };
  handleChange8 = (event) => {
    this.setState({ tb_description: event.target.value });
  };
  handleChange9 = (event) => {
    if (event.target.files[0].size > 2097152) {
      return alert("cannot be more than 2 mb");
    }
    if (
      event.target.files[0].name.split(".").pop() == "pdf" ||
      event.target.files[0].name.split(".").pop() == "docx" ||
      event.target.files[0].name.split(".").pop() == "doc" ||
      event.target.files[0].name.split(".").pop() == "jpeg" ||
      event.target.files[0].name.split(".").pop() == "png" ||
      event.target.files[0].name.split(".").pop() == "jpg" ||
      event.target.files[0].name.split(".").pop() == "gif" ||
      event.target.files[0].name.split(".").pop() == "svg"
    ) {
      this.setState({ attachment: event.target.files[0], loaded1: 50 });
      if (this.state.loaded1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({ attachment: null });
      return alert("File type not supported");
    }
  };
  // handleChange10 = (event) => {
  //   this.setState({ featured_image: null });
  //   if (
  //     event.target.files[0].name.split(".").pop() == "jpeg" ||
  //     event.target.files[0].name.split(".").pop() == "png" ||
  //     event.target.files[0].name.split(".").pop() == "jpg" ||
  //     event.target.files[0].name.split(".").pop() == "gif" ||
  //     event.target.files[0].name.split(".").pop() == "svg"
  //   ) {
  //     this.setState({
  //       featured_image: event.target.files[0],
  //       loaded: 50,
  //       featured_image_err: false,
  //       img_preview: URL.createObjectURL(event.target.files[0]),
  //     });
  //     if (this.state.loaded <= 100) {
  //       setTimeout(
  //         function () {
  //           this.setState({ loaded: 100 });
  //         }.bind(this),
  //         2000
  //       ); // wait 2 seconds, then reset to false
  //     }
  //   } else {
  //     this.setState({ featured_image: null });
  //     alert("File type not supported");
  //   }
  // };

  save = async (id) => {
    const token = await localStorage.getItem("token");
    const data = new FormData();
    data.set("uft_tender_id", id);
    axios
      .post(`${url}/api/saved/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ refresh: false });
        this.setState({ refresh: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadSaved = async () => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/saved-icon`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ saved: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/material-offer-detail/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ details: result.data[0] });
        this.setState(
          {
            slider: this.state.details.tender_slider_images,
          },
          () => {
            const vals = Object.values(this.state.slider);
            this.setState({ imgs: vals });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { t, i18n } = this.props;

    let chunk, alert;
    if (this.state.show_errors === true) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px" }}>
          {t("success.bid_once")}
        </Alert>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {t("success.mat_bid")}
        </Alert>
      );
    }

    const values = Object.values(this.state.saved);
    const classname = (id) =>
      values.map((item) => {
        if (item.uft_tender_id === id) {
          return "icon-heart";
        }
      });

    if (this.state.details.tender_type === "Request") {
      chunk = (
        <div>
          <div class="form-group">
            <label for="delivery-charges">
              {t("list_details.delivery_charges")}
            </label>
            <input
              onChange={this.handleChange5}
              id="delivery-charges"
              class="form-control"
              type="text"
              placeholder="800"
              required
              value={this.state.tb_delivery_charges}
            />
          </div>
          <div class="form-group">
            <label for="warranty">{t("list_details.warranty")}</label>
            <div class="d-flex input-group">
              <input
                onChange={this.handleChange6}
                id="warranty"
                class="form-control"
                type="text"
                placeholder="20"
                required
                value={this.state.tb_warrenty}
              />
              <select onChange={this.handleChange7} class="form-control">
                <option>--Select--</option>
                <option>Days</option>
                <option>Month</option>
              </select>
              <p style={{ color: "#eb516d " }}>
                {this.state.warrenty_err === true
                  ? "Warrenty is required"
                  : null}
              </p>
            </div>
          </div>
        </div>
      );
    }

    let tender_delivery_type_cost = this.state.details.tender_delivery_type_cost
      ? this.state.details.tender_delivery_type_cost
      : [];

    return (
      <div>
        <Header active={"market"} />
        <div className="sidebar-toggle"></div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              {t("header.marketplace")}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {this.state.details.tender_category_type}{" "}
              {this.state.details.tender_type} details
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar />
          <div ref={this.myRef} class="page-content">
            {alert ? alert : null}
            <div class="container-fluid">
              <h3 class="head3">
                {" "}
                {this.state.details.tender_category_type}{" "}
                {this.state.details.tender_type} details
              </h3>
              <div class="card">
                <div class="card-body">
                  <div class="row details-view">
                    <div class="col-md">
                      <Carousel className="slider">
                        <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src={
                              url +
                              "/images/marketplace/material/" +
                              this.state.details.tender_featured_image
                            }
                            alt="First slide"
                          />
                        </Carousel.Item>
                        {this.state.imgs.map((img) => (
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={url + "/images/marketplace/material/" + img}
                              alt="First slide"
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>

                      <div class="details-content">
                        <div class="head">
                          <h4>{this.state.details.tender_title}</h4>
                          <p>{this.state.details.tender_type}</p>
                        </div>
                        <p>{this.state.details.tender_description}</p>
                        <p>
                          Category
                          <a href="#" class="badge">
                            {this.state.details.category}
                          </a>
                        </p>

                        {this.state.details.tender_attachment ? (
                          <a
                            href={
                              url +
                              "/images/marketplace/material/" +
                              this.state.details.tender_attachment
                            }
                            target="_blank"
                            class="attachment"
                          >
                            <i class="icon-paperclip"></i>
                            {this.state.details.tender_attachment}
                          </a>
                        ) : null}

                        <table>
                          <tr>
                            <th>
                              {this.state.details.tender_type === "Request"
                                ? t("list_details.volume_need")
                                : t("list_details.budget")}
                            </th>
                            <td>
                              {this.state.details.tender_budget
                                ? this.state.details.tender_budget + "€/"
                                : this.state.details.tender_quantity}{" "}
                              pcs
                            </td>
                          </tr>
                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>Qnt.</th>
                              <td>{this.state.details.tender_quantity}</td>
                            </tr>
                          ) : (
                            ""
                          )}

                          <tr>
                            <th>{t("list_details.location")}</th>
                            <td>
                              {this.state.details.tender_pincode}{" "}
                              {this.state.details.tender_city}
                            </td>
                          </tr>

                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>{t("list_details.warranty")}</th>
                              <td>{this.state.details.tender_warranty}</td>
                            </tr>
                          ) : (
                            ""
                          )}
                          {this.state.details.tender_type !== "Request" ? (
                            <tr>
                              <th>{t("list_details.delivery")}</th>
                              <td>
                                {tender_delivery_type_cost.map(
                                  (t) =>
                                    `${t.type} : ${this.state.left} ${t.cost} ${this.state.right} | `
                                )}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}

                          {this.state.details.extra === 2 ? (
                            <tr>
                              <th>{t("list_details.work")}</th>
                              <td>{t("list_details.included")}</td>
                            </tr>
                          ) : (
                            ""
                          )}

                          <tr>
                            <th>{t("list_details.expires_in")}</th>
                            <td>{this.state.details.tender_expiry_date}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    <div class="col-md">
                      <div class="details-form">
                        {this.state.details.isUser ? (
                          <div>
                            <h4>Cannot bid on your own job</h4>
                          </div>
                        ) : (
                          <form onSubmit={this.handleSubmit}>
                            <div class="form-group">
                              <div class="row align-items-center">
                                <div class="col-5">
                                  <label class="d-flex ">
                                    {t("list_details.your_quote")}
                                  </label>
                                </div>
                                <div class="col-7">
                                  <label class="d-flex align-items-center">
                                    {`${this.state.left}${this.state.right}/${this.state.details.tender_unit}`}
                                    <input
                                      onChange={this.handleChange1}
                                      class="form-control"
                                      type="number"
                                      required
                                      value={this.state.tb_quote}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="row align-items-center">
                                <div class="col-5">
                                  <label class="d-flex">
                                    {t("list_details.quantity")}
                                  </label>
                                </div>
                                <div class="col-7">
                                  <label class="d-flex align-items-center">
                                    {this.state.details.tender_unit}{" "}
                                    <input
                                      onChange={this.handleChange2}
                                      class="form-control"
                                      type="number"
                                      required
                                      value={this.state.tb_quantity}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <label for="shipping-from">
                                {t("list_details.shipping_from")}
                              </label>
                              <select
                                onChange={this.handleChange3}
                                id="shipping-from"
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {this.state.cities.map(
                                  ({ state_identifier, state_id }, index) => {
                                    if (state_identifier !== undefined) {
                                      return (
                                        <option value={state_id}>
                                          {state_identifier}
                                        </option>
                                      );
                                    }
                                  }
                                )}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.tb_city_id_err === true
                                  ? "City is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="delivery-type">
                                {t("list_details.delivery_type")}
                              </label>
                              <select
                                onChange={this.handleChange4}
                                id="delivery-type"
                                class="form-control"
                                value={this.state.tb_delivery_type}
                              >
                                <option>--Select--</option>
                                <option>Road</option>
                                <option>Flight</option>
                                <option>Ship</option>
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.tb_delivery_type_err === true
                                  ? "Delivery type is required"
                                  : null}
                              </p>
                            </div>

                            {chunk ? chunk : null}
                            <div class="form-group">
                              <label for="message">
                                {t("list_details.message")}:
                              </label>
                              <textarea
                                onChange={this.handleChange8}
                                id="message"
                                name="tb_description"
                                class="form-control"
                                required
                                value={this.state.tb_description}
                              ></textarea>
                            </div>
                            <div class="form-group">
                              <label for="attachment">
                                {t("c_material_list.request.attachment")}
                              </label>
                              <div class="file-select">
                                <input
                                  onChange={this.handleChange9}
                                  name="attachment"
                                  type="file"
                                  id="attachment"
                                />
                                <label for="attachment">
                                  <img src={File} />
                                  <span class="status">Upload status</span>
                                  <ProgressBar now={this.state.loaded1} />
                                </label>
                                <small class="form-text text-muted">
                                  Max 2 mb pdf, doc, jpeg, png, jpg, gif, svg
                                </small>
                              </div>
                            </div>
                            {/* <div class="form-group">
                            <label for="main">{t("list_details.image")}</label>
                            <div class="file-select">
                              <input
                                onChange={this.handleChange10}
                                name="featured_image"
                                type="file"
                                id="main"
                              />
                              <label for="main">
                                <img
                                  src={
                                    this.state.img_preview
                                      ? this.state.img_preview
                                      : File
                                  }
                                />
                                <span class="status">Upload status</span>
                                <ProgressBar now={this.state.loaded} />
                              </label>
                              <small class="form-text text-muted">
                                jpeg, png, jpg, gif, svg
                              </small>
                            </div>
                          </div> */}
                            <div class="form-group">
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                  id="terms"
                                />
                                <label class="form-check-label" for="terms">
                                  {t("list_details.i_agree_all")}{" "}
                                  <a href="#">
                                    {t("list_details.terms_of_service")}
                                  </a>
                                </label>
                              </div>
                            </div>
                            <button class="btn btn-secondary" type="submit">
                              Submit your bid
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                this.save(this.state.details.tender_id);
                              }}
                              class="btn btn-light"
                              type="submit"
                            >
                              <i
                                class={
                                  classname(
                                    this.state.details.tender_id
                                  ).filter(function (el) {
                                    return el;
                                  }) == "icon-heart"
                                    ? "icon-heart"
                                    : "icon-heart-o"
                                }
                              ></i>
                              Save this job
                            </button>
                          </form>
                        )}
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

export default withTranslation()(Materialofferdetails);
