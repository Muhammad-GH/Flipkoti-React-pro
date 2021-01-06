import React, { Component } from "react";
import axios from "axios";
import { Helper, url } from "../../../helper/helper";
import { withTranslation } from "react-i18next";

class AddCustomer extends Component {
  state = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    company: "",
    type: "Client",
    type_err: false,
    success: 0,
    errors: [],
  };

  componentDidMount = (params) => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.type == "" || this.state.type == "--Select--") {
      this.setState({ type_err: true });
    }

    const token = await localStorage.getItem("token");

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
        });
        alert("Created!");
        this.props.addCus();
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // });
        // this.setState({ success: 2 });
        alert("Email already exists");
      });
  };

  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <div
          class="modal fade"
          id="add-cus"
          tabindex="-1"
          role="dialog"
          aria-labelledby="editInfoModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editInfoModalLabel">
                  Add Customer
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
                  <div class="row">
                    <div class="col-md-6">
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
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div className="form-group">
                        <label for="last_name">{t("account.last_name")}</label>
                        <input
                          id="last_name"
                          name="last_name"
                          onChange={this.handleChange}
                          className="form-control"
                          type="text"
                          value={this.state.last_name}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
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
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div className="form-group">
                        <label for="company">{t("account.company")}</label>
                        <input
                          id="company"
                          name="company"
                          onChange={this.handleChange}
                          className="form-control"
                          type="text"
                          value={this.state.company}
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div className="form-group">
                        <label for="company">{t("account.phone")}</label>
                        <input
                          id="phone"
                          name="phone"
                          onChange={this.handleChange}
                          className="form-control"
                          type="text"
                          value={this.state.phone}
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

export default withTranslation()(AddCustomer);
