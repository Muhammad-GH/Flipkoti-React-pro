import React, { Component } from "react";
import axios from "axios";
import { Helper, url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import File from "../../../images/file-icon.png";
import Datetime from "react-datetime";
import moment from "moment";
import BusinessInfo from "../modals/BusinessInfo";
import AddCustomer from "../modals/AddCustomer";
import Select from "react-select";
import Autosuggest from "react-autosuggest";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import PDFViewAgreement from "../modals/PDFViewAgreement";
import RatingModal from "../modals/RatingModal";
import { withTranslation } from "react-i18next";

const options = [];
const clients = [];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : clients.filter(
        (lang) => lang.value.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.value;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => <div>{suggestion.value}</div>;

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions2 = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : options.filter(
        (lang) => lang.value.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue2 = (suggestion) => suggestion.value;

// Use your imagination to render suggestions.
const renderSuggestion2 = (suggestion) => <div>{suggestion.value}</div>;

class AgreementCreate extends Component {
  state = {
    logo: null,
    logo_preview: null,
    business_info: [],
    agreement_proposal_id: 0,
    email: "",
    emails: [],
    date: "",
    dateFormat: "",
    due_date: "",
    date_err: false,
    due_date_err: false,
    error: null,
    agreement_terms: "fixed",
    agreement_type: "",
    agreement_type_err: false,
    row_phase: [],
    mat_pay: "",
    mat_pay_err: false,
    other: "",
    work_pay: "",
    work_pay_err: false,
    agreement_insurances: "",
    agreement_insurances_err: false,
    agreement_milestones: [],
    agreement_transport_payment: "",
    agreement_transport_payment_err: false,
    agreement_legal_category: "",
    agreement_client_res: "",
    agreement_client_res_other: "",
    agreement_contractor_res: "",
    agreement_contractor_res_other: "",
    agreement_additional_work_price: "",
    agreement_material_guarantee: "",
    agreement_material_guarantee_err: false,
    agreement_work_guarantee: "",
    agreement_work_guarantee_err: false,
    agreement_panelty: "",
    agreement_panelty_err: false,
    agreement_rate: "",
    agreement_service_fee: "",
    agreement_estimated_payment: "",
    attachment: null,
    attachment_pre: null,
    name: null,
    name_err: false,

    errors: [],
    name_unq: null,
    show_errors: false,
    show_msg: false,
    loading: false,
    loading_1: false,

    tender_id: 0,
    proposal_id: 0,
    agreement_id: 0,
    selectedOption: null,
    value: "",
    suggestions: [],
    suggestions2: [],
    userEmail: null,
    client_id: null,
    client_id_err: false,
    configuration_val: null,

    work_template: null,
    mat_template: null,

    agreement_status: 0,
    agreement_client_type: 0,
    agreement_tender_draft: 0,
    agreement_request_id_tender: 0,

    left: null,
    right: null,
  };

  componentDidMount = () => {
    if (this.props.match.params.customer !== undefined) {
      this.setState({
        tender_id: this.props.match.params.tender,
        agreement_proposal_id: this.props.match.params.tender,
      });
      this.getEmail(this.props.match.params.tender);
      this.setProposalData(this.props.match.params.tender);
      this.setDataTender(this.props.match.params.tender);
    }
    if (
      this.props.match.params.customer !== undefined &&
      this.props.match.params.draft !== undefined
    ) {
      this.setData(this.props.match.params.tender);
    }
    this.loadResources();
    this.loadClient();
    this.loadAgreementID();
    this.loadConfig();
    this.loadCurrency();
    this.myRef = React.createRef();
    this.myRefType = React.createRef();
    this.myRefTerms = React.createRef();

    if (window.localStorage) {
      if (!localStorage.getItem("firstLoad")) {
        localStorage["firstLoad"] = true;
        window.location.reload();
      } else localStorage.removeItem("firstLoad");
    }
  };

  setDataTender = async (id) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/agreement/get/byTID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const {
          agreement_id,
          agreement_tender_id,
          agreement_proposal_id,
          agreement_client_type,
          agreement_client_id,
          agreement_user_id,
          agreement_request_id,
          agreement_names,
          agreement_other,
          agreement_pdf,
          agreement_attachment,
          emails,
          date,
          agreement_due_date,
          agreement_terms,
          agreement_type,
          agreement_milestones,
          agreement_rate,
          agreement_service_fee,
          agreement_estimated_payment,
          agreement_material_payment,
          agreement_work_payment,
          agreement_work_guarantee,
          agreement_material_guarantee,
          agreement_transport_payment,
          agreement_legal_category,
          agreement_client_res,
          agreement_contractor_res,
          agreement_additional_work_price,
          agreement_insurance,
          agreement_panelty,
          agreement_general,
          agreement_status,
          email,
        } = result.data;

        this.setState({
          agreement_proposal_id,
          tender_id: agreement_tender_id,
          emails: emails ? emails.split(",") : [],
          date: date === "null" || date === null ? "" : date,
          dateFormat:
            date === "null" || date === null
              ? ""
              : date.split("-").reverse().join("-"),
          due_date:
            agreement_due_date === "null" || agreement_due_date === null
              ? ""
              : agreement_due_date,
          agreement_terms,
          agreement_type,
          row_phase: JSON.parse(agreement_milestones),
          agreement_rate,
          agreement_service_fee,
          agreement_estimated_payment,
          mat_pay: agreement_material_payment,
          work_pay: agreement_work_payment,
          agreement_work_guarantee,
          agreement_material_guarantee,
          agreement_transport_payment,
          agreement_legal_category,
          agreement_client_res,
          agreement_contractor_res,
          agreement_additional_work_price,
          agreement_insurances: agreement_insurance,
          agreement_panelty,
          agreement_general,
          agreement_other,
          userEmail: email,
          value: email === 0 ? "" : email,
          attachment_pre: agreement_attachment,
          attachment: agreement_attachment,
          agreement_status,
          agreement_client_type,
          name: agreement_names,

          agreement_tender_draft: 1,
          agreement_request_id_tender: agreement_request_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addCustomer = () => {
    this.loadClient();
  };

  getEmail = async (id) => {
    if (id > 0) {
      const token = await localStorage.getItem("token");
      axios
        .get(`${url}/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          if (result.data.length > 0) {
            this.setState({
              userEmail: result.data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  loadCurrency = async () => {
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

  setProposalData = async (id) => {
    const token = await localStorage.getItem("token");
    const response = await axios.get(`${url}/api/proposal/get/byPID/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      if (response.data.data.length > 0) {
        const { work_template, mat_template } = response.data.data[0];
        this.setState({ work_template, mat_template });
      }
    }
  };
  setProposalDataReq = async (id) => {
    const token = await localStorage.getItem("token");
    const response = await axios.get(`${url}/api/agreement/get/byRID/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const { work_template, mat_template } = response.data.data[0];
      this.setState({ work_template, mat_template });
    }
  };

  setData = async (id) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/agreement/get/byID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const {
          agreement_tender_id,
          agreement_proposal_id,
          agreement_client_type,
          agreement_client_id,
          agreement_user_id,
          agreement_request_id,
          agreement_other,
          agreement_pdf,
          agreement_attachment,
          emails,
          date,
          agreement_due_date,
          agreement_terms,
          agreement_type,
          agreement_milestones,
          agreement_rate,
          agreement_service_fee,
          agreement_estimated_payment,
          agreement_material_payment,
          agreement_work_payment,
          agreement_work_guarantee,
          agreement_material_guarantee,
          agreement_transport_payment,
          agreement_legal_category,
          agreement_client_res,
          agreement_contractor_res,
          agreement_additional_work_price,
          agreement_insurance,
          agreement_panelty,
          agreement_general,
          email,
          agreement_status,
          agreement_names,
        } = result.data[0];
        this.setState({
          agreement_proposal_id,
          tender_id: agreement_tender_id,
          emails: emails ? emails.split(",") : [],
          date: date === "null" || date === null ? "" : date,
          dateFormat:
            date === "null" || date === null
              ? ""
              : date.split("-").reverse().join("-"),
          due_date:
            agreement_due_date === "null" || agreement_due_date === null
              ? ""
              : agreement_due_date,
          agreement_terms,
          agreement_type,
          row_phase: JSON.parse(agreement_milestones),
          agreement_rate,
          agreement_service_fee,
          agreement_estimated_payment,
          mat_pay: agreement_material_payment,
          work_pay: agreement_work_payment,
          agreement_work_guarantee,
          agreement_material_guarantee,
          agreement_transport_payment,
          agreement_legal_category,
          agreement_client_res,
          agreement_contractor_res,
          agreement_additional_work_price,
          agreement_insurances: agreement_insurance,
          agreement_panelty,
          agreement_general,
          agreement_other,
          userEmail: email,
          value: email === 0 ? "" : email,
          attachment_pre: agreement_attachment,
          attachment: agreement_attachment,
          agreement_status,
          agreement_client_type,
          name: agreement_names,
        });

        this._c_total.value = agreement_rate;
        this.agreement_legal_category.value = agreement_legal_category;
        this.agreement_client_res.value = agreement_client_res;
        this.agreement_contractor_res.value = agreement_contractor_res;
      })
      .catch((err) => {
        console.log(err);
      });

    if (this.state.agreement_client_type === "user") {
      this.setProposalDataReq(id);
    }
  };

  loadAgreementID = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/agreement/get/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (
          Object.keys(result.data).length === 0 &&
          result.data.constructor === Object
        ) {
          this.setState({ agreement_id: 1 });
        } else {
          this.setState({ agreement_id: result.data.agreement_id + 1 });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/config/fee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const { configuration_val } = result.data.data[0];
        this.setState({ configuration_val: configuration_val });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadResources = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/resources-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        result.data.data.map((res) => {
          var keys = ["value", "label"];
          var _key = {};
          keys.forEach((key, i) => (_key[key] = res.email));
          options.push(_key);
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  loadClient = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/resources-list/Client`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        result.data.data.map((res) => {
          var keys = ["value", "label"];
          var _key = {};
          keys.forEach((key, i) => (_key[key] = res.email));
          clients.push(_key);
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  handleAuto = (selectedOption) => {
    this.setState({ selectedOption });
  };
  onChange = (event, { newValue }) => {
    this.setState({
      client_id_err: false,
      value: newValue,
    });
  };
  onChange2 = (event, { newValue }) => {
    this.setState({
      email: newValue,
    });
  };
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionsFetchRequested2 = ({ value }) => {
    this.setState({
      suggestions2: getSuggestions2(value),
    });
  };

  // // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested2 = () => {
    this.setState({
      suggestions2: [],
    });
  };
  handleBusinessInfo = (val) => {
    this.setState({ business_info: val });
    this.setState({
      agreement_work_guarantee: this.state.business_info
        .agreement_work_guarantee,
      agreement_material_guarantee: this.state.business_info
        .agreement_material_guarantee,
      agreement_insurances: this.state.business_info.agreement_insurances,
      agreement_panelty: this.state.business_info.agreement_panelty,
    });
  };
  handleAppend = (event) => {
    event.preventDefault();
    let row_phase = this.state.row_phase;
    let keys = ["des", "due_date", "amount"];
    let gg = `${""},${""},${"amount"}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase.push(result);
    this.setState({ row_phase: row_phase });
  };
  handleDelete = (item) => {
    this.setState({
      emails: this.state.emails.filter((i) => i !== item),
    });
  };
  handlePaste = (evt) => {
    evt.preventDefault();

    var paste = evt.clipboardData.getData("text");
    var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      var toBeAdded = emails.filter((email) => !this.isInList(email));

      this.setState({
        emails: [...this.state.emails, ...toBeAdded],
      });
    }
  };
  isValid(email) {
    let error = null;

    if (this.isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (!this.isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      this.setState({ error });

      return false;
    }

    return true;
  }
  isInList(email) {
    return this.state.emails.includes(email);
  }
  isEmail(email) {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  }
  handleChange2 = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: null });
  };
  handleRes = ({ value }) => {
    this.setState({ email: value, error: null });
  };
  handleKeyDown = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var email = this.state.email.trim();

      if (email && this.isValid(email)) {
        this.setState({
          emails: [...this.state.emails, this.state.email],
          email: "",
        });
      }
    }
  };
  handleChange3 = (event) => {
    this.setState({ due_date: "" });
    this.setState({
      date: moment(event._d).format("DD-MM-YYYY"),
      dateFormat: moment(event._d).format("YYYY-MM-DD"),
    });
  };
  handleChange4 = (event) => {
    this.setState({ due_date: moment(event._d).format("DD-MM-YYYY") });
  };
  handleChange7 = (event) => {
    if (event.target.files[0].size > 2097152) {
      return alert("cannot be more than 2 mb");
    }
    if (
      event.target.files[0].name.split(".").pop() == "pdf" ||
      event.target.files[0].name.split(".").pop() == "PDF" ||
      event.target.files[0].name.split(".").pop() == "docx" ||
      event.target.files[0].name.split(".").pop() == "doc" ||
      event.target.files[0].name.split(".").pop() == "jpeg" ||
      event.target.files[0].name.split(".").pop() == "png" ||
      event.target.files[0].name.split(".").pop() == "PNG" ||
      event.target.files[0].name.split(".").pop() == "jpg" ||
      event.target.files[0].name.split(".").pop() == "JPG" ||
      event.target.files[0].name.split(".").pop() == "gif" ||
      event.target.files[0].name.split(".").pop() == "svg"
    ) {
      this.setState({ attachment: event.target.files[0] });
    } else {
      this.setState({ attachment: null });
      return alert("File type not supported");
    }
  };
  handleAttachmentRemove = () => {
    this.setState({ attachment: null });
  };

  handleDraft = async (event) => {
    event.preventDefault();

    this.setState({
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      name_err: false,
      name_unq: null,
    });

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      client_id = this.props.match.params.customer;
    } else {
      if (this.state.value === null || this.state.value === "") {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    }

    if (this.state.name == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }

    let agreement_type =
      this.state.agreement_terms === "hourly"
        ? "hourly"
        : this.state.agreement_type;

    const token = await localStorage.getItem("token");
    this.setState({ loading_1: true });
    const data = new FormData();
    // data.set('logo', this.state.logo)
    data.set("agreement_request_id", this.requestInput.value);
    data.set("agreement_tender_id", 0);
    data.set("agreement_client_id", client_id);
    data.set("agreement_proposal_id", this.state.agreement_proposal_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("agreement_terms", this.state.agreement_terms);
    data.set("agreement_type", agreement_type);
    data.set("agreement_material_payment", this.state.mat_pay);
    data.set("agreement_insurance", this.state.agreement_insurances);
    data.set("agreement_other", this.state.other);
    data.set("agreement_work_payment", this.state.work_pay);
    data.set("agreement_work_guarantee", this.state.agreement_work_guarantee);
    data.set("agreement_legal_category", this.agreement_legal_category.value);
    data.set("agreement_client_res", this.agreement_client_res.value);
    data.set("agreement_contractor_res", this.agreement_contractor_res.value);
    data.set("sent", 0);
    data.set(
      "agreement_additional_work_price",
      this.state.agreement_additional_work_price
    );
    data.set(
      "agreement_material_guarantee",
      this.state.agreement_material_guarantee
    );
    data.set(
      "agreement_transport_payment",
      this.state.agreement_transport_payment
    );
    data.set("agreement_due_date", this.state.due_date);
    data.set("agreement_panelty", this.state.agreement_panelty);
    data.set("agreement_rate", this._c_total.value);
    data.set("agreement_milestones", this._milestone.value);
    data.set(
      "agreement_service_fee",
      this._fee.value === "NaN" ? 0 : this._fee.value
    );
    data.set(
      "agreement_estimated_payment",
      this.est_pay.value ? this.est_pay.value : 0
    );
    data.set("agreement_names", this.state.name);
    data.set(
      "agreement_client_res_other",
      this.state.agreement_client_res_other
    );
    data.set(
      "agreement_contractor_res_other",
      this.state.agreement_contractor_res_other
    );
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/agreement/draft`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({ show_msg: true, loading_1: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response.data.error.agreement_names) {
            this.setState({
              name_unq: err.response.data.error.agreement_names[0],
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        if (err.response.status === 500) {
          alert("Request cannot be processed, try again later");
        }
        this.setState({ loading_1: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  handleSubmit = async (e, event) => {
    e.preventDefault();

    this.setState({
      date_err: false,
      due_date_err: false,
      agreement_type_err: false,
      mat_pay_err: false,
      work_pay_err: false,
      agreement_transport_payment_err: false,
      agreement_material_guarantee_err: false,
      agreement_work_guarantee_err: false,
      agreement_insurances_err: false,
      agreement_panelty_err: false,
      name_err: false,
    });

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      client_id =
        this.props.match.params.customer == 0
          ? this.state.value
          : this.props.match.params.customer;
    } else {
      if (this.state.value === null || this.state.value === "") {
        return alert("please select a resource");
      }
      client_id = this.state.value;
    }

    let agreement_type =
      this.state.agreement_terms === "hourly"
        ? "hourly"
        : this.state.agreement_type;

    if (this.state.date == "" || this.state.date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ date_err: true });
    }
    if (this.state.due_date == "" || this.state.due_date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ due_date_err: true });
    }
    if (agreement_type == "" || agreement_type == null) {
      this.myRefType.current.scrollIntoView();
      return this.setState({ agreement_type_err: true });
    }
    if (this.state.mat_pay == "" || this.state.mat_pay == null) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ mat_pay_err: true });
    }
    if (this.state.work_pay == "" || this.state.work_pay == null) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ work_pay_err: true });
    }
    if (
      this.state.agreement_transport_payment == "" ||
      this.state.agreement_transport_payment == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_transport_payment_err: true });
    }
    if (
      this.state.agreement_material_guarantee == "" ||
      this.state.agreement_material_guarantee == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_material_guarantee_err: true });
    }
    if (
      this.state.agreement_work_guarantee == "" ||
      this.state.agreement_work_guarantee == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_work_guarantee_err: true });
    }
    if (
      this.state.agreement_insurances == "" ||
      this.state.agreement_insurances == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_insurances_err: true });
    }
    if (
      this.state.agreement_panelty == "" ||
      this.state.agreement_panelty == null
    ) {
      this.myRefTerms.current.scrollIntoView();
      return this.setState({ agreement_panelty_err: true });
    }
    if (this.state.name == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }

    this.setState({ loading: true });

    const token = await localStorage.getItem("token");
    const data = new FormData();
    data.set("agreement_request_id", this.requestInput.value);
    data.set("agreement_tender_id", 0);
    data.set("agreement_client_id", client_id);
    data.set("agreement_proposal_id", this.state.agreement_proposal_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("agreement_terms", this.state.agreement_terms);
    data.set("agreement_type", agreement_type);
    data.set("agreement_material_payment", this.state.mat_pay);
    data.set("agreement_insurance", this.state.agreement_insurances);
    data.set("agreement_other", this.state.other);
    data.set("agreement_work_payment", this.state.work_pay);
    data.set("agreement_work_guarantee", this.state.agreement_work_guarantee);
    data.set("agreement_legal_category", this.agreement_legal_category.value);
    data.set("agreement_client_res", this.agreement_client_res.value);
    data.set(
      "agreement_client_res_other",
      this.state.agreement_client_res_other
    );
    data.set("agreement_contractor_res", this.agreement_contractor_res.value);
    data.set(
      "agreement_contractor_res_other",
      this.state.agreement_contractor_res_other
    );
    data.set(
      "agreement_additional_work_price",
      this.state.agreement_additional_work_price
    );
    data.set(
      "agreement_material_guarantee",
      this.state.agreement_material_guarantee
    );
    data.set(
      "agreement_transport_payment",
      this.state.agreement_transport_payment
    );
    data.set("agreement_due_date", this.state.due_date);
    data.set("agreement_panelty", this.state.agreement_panelty);
    data.set("agreement_rate", this._c_total.value);
    data.set("agreement_milestones", this._milestone.value);
    data.set(
      "agreement_service_fee",
      this._fee.value === "NaN" ? 0 : this._fee.value
    );
    data.set(
      "agreement_estimated_payment",
      this.est_pay.value ? this.est_pay.value : 0
    );
    data.set("sent", event);
    data.set("logo", this.state.business_info.company_logo);
    data.set("company_id", this.state.business_info.company_id);
    data.set(
      "names",
      `${this.state.business_info.first_name} ${this.state.business_info.last_name}`
    );
    data.set("email", this.state.business_info.email);
    data.set("address", this.state.business_info.address);
    data.set("phone", this.state.business_info.phone);
    data.set("bussiness_id", this.state.business_info.id);
    data.set("mat_template", JSON.stringify(this.state.mat_template));
    data.set("work_template", JSON.stringify(this.state.work_template));
    data.set("agreement_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/agreement/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          show_msg: true,
          loading: false,
          date: "",
          mat_pay: "",
          agreement_insurances: "",
          other: "",
          work_pay: "",
          agreement_work_guarantee: "",
          agreement_client_res_other: "",
          agreement_contractor_res_other: "",
          agreement_additional_work_price: "",
          agreement_material_guarantee: "",
          agreement_transport_payment: "",
          due_date: "",
          agreement_panelty: "",
          mat_template: null,
          work_template: null,
          name: "",
          attachment: null,
        });
        this.agreement_legal_category.value = "";
        this.agreement_client_res.value = "";
        this.agreement_contractor_res.value = "";
        this._c_total.value = "";
        this._milestone.value = "";
        this._fee.value = "";
        this.est_pay.value = "";
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/agreement-listing");
      })
      .catch((err) => {
        if (err.response.status === 406) {
          if (err.response.data.error.agreement_names) {
            this.setState({
              name_unq: err.response.data.error.agreement_names[0],
            });
          }
          if (err.response.data.error.agreement_client_id) {
            this.setState({
              client_id_err: true,
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        if (err.response.status === 500) {
          alert("Request cannot be processed, try again later");
        }
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  handleUpdate = async (event) => {
    event.preventDefault();

    let client_id;
    if (
      this.state.tender_id !== 0 ||
      this.props.match.params.draft !== undefined
    ) {
      if (this.props.match.params.customer > 0) {
        client_id = this.props.match.params.customer;
      } else if (this.state.value === null || this.state.value === "") {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    } else {
      if (this.state.value === null || this.state.value === "") {
        client_id = 0;
      } else {
        client_id = this.state.value;
      }
    }

    let agreement_type =
      this.state.agreement_terms === "hourly"
        ? "hourly"
        : this.state.agreement_type;

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("agreement_request_id", this.requestInput.value);
    data.set("agreement_tender_id", this.state.tender_id);
    data.set("agreement_client_id", client_id);
    data.set("agreement_proposal_id", this.state.agreement_proposal_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("agreement_terms", this.state.agreement_terms);
    data.set("agreement_type", agreement_type);
    data.set("agreement_material_payment", this.state.mat_pay);
    data.set("agreement_insurance", this.state.agreement_insurances);
    data.set("agreement_other", this.state.other);
    data.set("agreement_work_payment", this.state.work_pay);
    data.set("agreement_work_guarantee", this.state.agreement_work_guarantee);
    data.set("agreement_legal_category", this.agreement_legal_category.value);
    data.set("agreement_client_res", this.agreement_client_res.value);
    data.set("agreement_contractor_res", this.agreement_contractor_res.value);
    data.set(
      "agreement_additional_work_price",
      this.state.agreement_additional_work_price
    );
    data.set(
      "agreement_material_guarantee",
      this.state.agreement_material_guarantee
    );
    data.set(
      "agreement_transport_payment",
      this.state.agreement_transport_payment
    );
    data.set("agreement_due_date", this.state.due_date);
    data.set("agreement_panelty", this.state.agreement_panelty);
    data.set("agreement_rate", this._c_total.value);
    data.set("agreement_milestones", this._milestone.value);
    data.set(
      "agreement_service_fee",
      this._fee.value === "NaN" ? 0 : this._fee.value
    );
    data.set(
      "agreement_estimated_payment",
      this.est_pay.value ? this.est_pay.value : 0
    );
    data.set("agreement_names", this.state.name);
    data.set(
      "agreement_client_res_other",
      this.state.agreement_client_res_other
    );
    data.set(
      "agreement_contractor_res_other",
      this.state.agreement_contractor_res_other
    );
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/agreement/put`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({ show_msg: true, loading: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        if (err.response.data.error) {
          Object.entries(err.response.data.error).map(([key, value]) => {
            this.setState({ errors: err.response.data.error });
          });
          this.setState({ show_errors: true, loading: false });
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        if (err.response.status === 500) {
          alert("Request cannot be processed, try again later");
        }
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  hiddenFields = () => {
    this.setState({
      client_id:
        this.state.value === "" ? this.state.userEmail : this.state.value,
      agreement_milestones: this._milestone.value,
      agreement_legal_category: this.agreement_legal_category.value,
      agreement_client_res: this.agreement_client_res.value,
      agreement_contractor_res: this.agreement_contractor_res.value,
      agreement_estimated_payment: this.est_pay.value,
    });
  };

  render() {
    const { t, i18n } = this.props;

    var yesterday = moment().subtract(1, "day");
    function valid(current) {
      return current.isAfter(yesterday);
    }

    var date = this.state.date ? moment(this.state.dateFormat) : null;
    function valid2(current) {
      return current.isAfter(date);
    }

    const userInfo = {
      client_id: this.state.client_id,
      agreement_id: this.state.agreement_id,
      date: this.state.date,
      due_date: this.state.due_date,
      agreement_terms: this.state.agreement_terms,
      agreement_type: this.state.agreement_type,
      mat_pay: this.state.mat_pay,
      work_pay: this.state.work_pay,
      agreement_insurances: this.state.agreement_insurances,
      agreement_transport_payment: this.state.agreement_transport_payment,
      agreement_legal_category: this.state.agreement_legal_category,
      agreement_client_res: this.state.agreement_client_res,
      agreement_client_res_other: this.state.agreement_client_res_other,
      agreement_contractor_res: this.state.agreement_contractor_res,
      agreement_contractor_res_other: this.state.agreement_contractor_res_other,
      agreement_milestones: this.state.agreement_milestones,
      agreement_additional_work_price: this.state
        .agreement_additional_work_price,
      agreement_material_guarantee: this.state.agreement_material_guarantee,
      agreement_work_guarantee: this.state.agreement_work_guarantee,
      agreement_panelty: this.state.agreement_panelty,
      agreement_service_fee: this.state.agreement_service_fee,
      agreement_estimated_payment: this.state.agreement_estimated_payment,
      work_template: this.state.work_template,
      mat_template: this.state.mat_template,
      left: this.state.left,
      right: this.state.right,
    };

    let alert, loading, loading_1;
    if (this.state.show_errors === true) {
      alert = (
        <Alert variant="danger" style={{ fontSize: "13px", zIndex: 1 }}>
          {Object.entries(this.state.errors).map(([key, value]) => {
            const stringData = value.reduce((result, item) => {
              return `${item} `;
            }, "");
            return stringData;
          })}
        </Alert>
      );
    }
    if (this.state.show_msg === true) {
      alert = (
        <Alert variant="success" style={{ fontSize: "13px" }}>
          {t("success.agreement")}
        </Alert>
      );
    }
    if (this.state.loading === true) {
      loading = (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }
    if (this.state.loading_1 === true) {
      loading_1 = (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }

    const {
      selectedOption,
      value,
      email,
      suggestions,
      suggestions2,
    } = this.state;

    let req_id =
      this.props.match.params.draft === "update"
        ? this.props.match.params.tender
        : this.state.agreement_tender_draft === 1
        ? this.state.agreement_request_id_tender
        : `${this.state.business_info.user_id}${this.state.agreement_id}`;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Email id or name of client",
      value,
      className: "form-control",
      onChange: this.onChange,
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps2 = {
      placeholder: "Email id ",
      value: this.state.email,
      className: "form-control",
      onChange: this.onChange2,
      onKeyDown: this.handleKeyDown,
      onPaste: this.handlePaste,
    };

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
              to="/agreement-listing"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("b_sidebar.agreement.agreement")}
            </Link>
            <li className="breadcrumb-item active" aria-current="page">
              {t("c_material_list.listing.create")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <BussinessSidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <div
                className="d-md-flex justify-content-between"
                style={{ maxWidth: "1120px" }}
              >
                <h3 className="head3">{t("myproposal.cre_prop")}</h3>
                <div className="mt-md-n3 mt-sm-4 mb-sm-4 mb-md-0">
                  <button
                    onClick={this.hiddenFields}
                    className="btn btn-gray mb-md-0 mb-3 mr-4 clk2"
                    data-toggle="modal"
                    data-target="#preview-info"
                  >
                    Preview Agreement
                  </button>

                  {this.props.match.params.draft !== undefined ||
                  this.state.agreement_tender_draft === 1 ? (
                    <button
                      onClick={this.handleUpdate}
                      class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0 clk2"
                    >
                      Update as a draft
                    </button>
                  ) : loading ? (
                    loading
                  ) : (
                    <button
                      onClick={this.handleDraft}
                      class="btn btn-gray mb-md-0 mb-3 mr-4 clk2"
                    >
                      Save as a draft
                    </button>
                  )}

                  <button
                    onClick={(e) => this.handleSubmit(e, 1)}
                    className="btn btn-primary mb-md-0 mb-4 clk2"
                  >
                    Submit &amp; Send
                  </button>
                </div>
              </div>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-12 col-lg-12">
                      <div className="form-group">
                        <label for="name">{t("myproposal.name")}</label>
                        <input
                          id="name"
                          className="form-control"
                          type="text"
                          name="name"
                          value={this.state.name}
                          onChange={this.handleChange2}
                        />
                        <p style={{ color: "#eb516d " }}>
                          {this.state.name_err === true
                            ? "Name is required"
                            : null}
                          {this.state.name_unq ? this.state.name_unq : null}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <input
                      type="hidden"
                      ref={(input) => {
                        this._milestone = input;
                      }}
                      class="_milestone"
                    />
                    <input
                      type="hidden"
                      ref={(input) => {
                        this._fee = input;
                      }}
                      class="_fee"
                    />
                    <input
                      type="hidden"
                      ref={(input) => {
                        this.est_pay = input;
                      }}
                      class="_est_pay"
                    />
                    <input
                      type="hidden"
                      ref={(input) => {
                        this._c_total = input;
                      }}
                      class="_c_total"
                    />
                    <div className="col-lg-5 col-md-6">
                      <div className="form-group">
                        <div className="file-select file-sel inline">
                          <label for="attachment1sdsd" style={{ width: "70%" }}>
                            <img
                              src={
                                this.state.business_info.company_logo === null
                                  ? File
                                  : url +
                                    "/images/marketplace/company_logo/" +
                                    this.state.business_info.company_logo
                              }
                              alt=""
                            />
                          </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          <a
                            data-toggle="collapse"
                            href="#business-info"
                            role="button"
                            aria-expanded="false"
                            aria-controls="business-info"
                          >
                            [+]
                          </a>{" "}
                          {t("myproposal.buss_info")}{" "}
                          <a
                            href="#"
                            data-toggle="modal"
                            data-target="#edit-info"
                          >
                            Edit
                          </a>
                        </label>
                        <div className="collapse" id="business-info">
                          <div className="form-detail">
                            <p>{this.state.business_info.company_id}</p>
                            <p>{`${this.state.business_info.first_name} ${this.state.business_info.last_name}`}</p>
                            <p></p>
                            <p>{this.state.business_info.email}</p>
                            <p>{this.state.business_info.company_website}</p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label for="customer-info">
                          {t("myproposal.cus_info")}
                        </label>
                        {this.state.tender_id !== 0 ? (
                          <input
                            id="customer-info"
                            class="form-control"
                            type="text"
                            value={this.state.userEmail}
                            readOnly={true}
                          />
                        ) : this.props.match.params.draft !== undefined ? (
                          <React.Fragment>
                            <div class="input-group">
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={
                                  this.onSuggestionsFetchRequested
                                }
                                onSuggestionsClearRequested={
                                  this.onSuggestionsClearRequested
                                }
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                                value={this.state.value}
                              />
                              <label>
                                <a
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#add-cus"
                                >
                                  [+]
                                </a>
                              </label>
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.client_id_err === true
                                ? "Customer not found"
                                : null}
                            </p>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <div class="input-group">
                              <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={
                                  this.onSuggestionsFetchRequested
                                }
                                onSuggestionsClearRequested={
                                  this.onSuggestionsClearRequested
                                }
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                                value={this.state.value}
                              />
                              <label>
                                <a
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#add-cus"
                                >
                                  [+]
                                </a>
                              </label>
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.client_id_err === true
                                ? "Customer not found"
                                : null}
                            </p>
                          </React.Fragment>
                        )}
                      </div>
                      <div className="form-group">
                        <label for="mails" style={{ marginRight: "60%" }}>
                          {t("myproposal.mail_multi")}
                        </label>
                        {this.state.emails.map((item) => (
                          <div className="tag-item" key={item}>
                            {item}
                            <button
                              type="button"
                              className="button"
                              onClick={() => this.handleDelete(item)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <Autosuggest
                          suggestions={suggestions2}
                          onSuggestionsFetchRequested={
                            this.onSuggestionsFetchRequested2
                          }
                          onSuggestionsClearRequested={
                            this.onSuggestionsClearRequested2
                          }
                          getSuggestionValue={getSuggestionValue2}
                          renderSuggestion={renderSuggestion2}
                          inputProps={inputProps2}
                        />

                        {this.state.error && (
                          <p className="error">{this.state.error}</p>
                        )}
                        <small className="form-text text-muted">
                          eg {t("myproposal.eg")}
                        </small>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-6">
                      <div className="form-group">
                        <label for="request-id">{t("myproposal.req_id")}</label>
                        <input
                          id="request-id"
                          className="form-control"
                          type="text"
                          ref={(input) => {
                            this.requestInput = input;
                          }}
                          value={req_id}
                          readOnly="readOnly"
                        />
                      </div>
                      <div className="form-group">
                        <label for="date">{t("myproposal.date")}</label>
                        <Datetime
                          onChange={(date) => this.handleChange3(date)}
                          isValidDate={valid}
                          id="date"
                          name="date"
                          dateFormat="DD-MM-YYYY"
                          timeFormat={false}
                          value={this.state.date}
                        />
                        <p style={{ color: "#eb516d " }}>
                          {this.state.date_err === true
                            ? "Date is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="due-date">{t("myproposal.due_date")}</label>
                        <Datetime
                          onChange={(date) => this.handleChange4(date)}
                          isValidDate={valid2}
                          id="due-date"
                          name="due-date"
                          dateFormat="DD-MM-YYYY"
                          timeFormat={false}
                          value={this.state.due_date}
                        />
                        <p style={{ color: "#eb516d " }}>
                          {this.state.due_date_err === true
                            ? "Due date is required"
                            : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="my-5"></p>
                  <ul className="nav nav-tabs" id="paymentTerms" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className={
                          this.state.agreement_terms === "fixed"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="fixed-tab"
                        data-toggle="tab"
                        href="#fixed"
                        role="tab"
                        aria-controls="fixed"
                        aria-selected="true"
                        onClick={() =>
                          this.setState({ agreement_terms: "fixed" })
                        }
                      >
                        {t("myagreement.fixed")}
                      </a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a
                        className={
                          this.state.agreement_terms === "hourly"
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="hourly-tab"
                        data-toggle="tab"
                        href="#hourly"
                        role="tab"
                        aria-controls="hourly"
                        aria-selected="false"
                        onClick={() =>
                          this.setState({ agreement_terms: "hourly" })
                        }
                      >
                        {t("myagreement.hourly")}
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content" id="paymentTermsContent">
                    <div
                      className={
                        this.state.agreement_terms === "fixed"
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="fixed"
                      role="tabpanel"
                      aria-labelledby="fixed-tab"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <br />
                          <h3 className="head3 mb-1">
                            {t("myagreement.payment_terms")}
                          </h3>
                          <div
                            className="row justify-content-between"
                            style={{ color: "#a7a7a7" }}
                          >
                            <div className="col-sm-3">
                              <b>{t("myagreement.fixed")}</b>
                            </div>
                            <div className="col-sm-9">
                              <b className="float-sm-right">
                                Client’s budget: €
                                {userInfo.mat_template && userInfo.work_template
                                  ? Number(this.state.mat_template.total) +
                                    Number(this.state.work_template.total)
                                  : 0}{" "}
                                EUR{" "}
                              </b>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div ref={this.myRefType} className="form-group">
                            <label className="mt-4 mb-3">
                              <b>{t("myagreement.how_paid")}</b>
                            </label>
                            <div className="form-check mb-4">
                              <input
                                type="radio"
                                name="paymethod"
                                className="form-check-input"
                                id="milestone"
                                checked={
                                  this.state.agreement_type === "milestone"
                                    ? true
                                    : false
                                }
                                onClick={() =>
                                  this.setState({ agreement_type: "milestone" })
                                }
                              />
                              <label
                                className="form-check-label"
                                for="milestone"
                              >
                                <b>{t("myagreement.by_mile")}</b>
                                <br />
                                <span className="light">
                                  {t("myagreement.mile_text")}
                                </span>
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                name="paymethod"
                                className="form-check-input"
                                id="project"
                                checked={
                                  this.state.agreement_type === "project"
                                    ? true
                                    : false
                                }
                                onClick={() =>
                                  this.setState({
                                    agreement_type: "project",
                                    // row_phase:
                                    //   this.props.match.params.draft !==
                                    //   undefined
                                    //     ? this.state.row_phase
                                    //     : [],
                                  })
                                }
                              />
                              <label className="form-check-label" for="project">
                                <b>{t("myagreement.by_proj")}</b>
                                <br />
                                <span className="light">
                                  {t("myagreement.proj_text")}
                                </span>
                              </label>
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.agreement_type_err === true
                                ? "Agreement type is required"
                                : null}
                            </p>
                          </div>
                          <div className="form-group">
                            {this.state.agreement_type === "milestone" ? (
                              <label className="mt-4 mb-4">
                                <b>{t("myagreement.mile_que")}</b>
                              </label>
                            ) : null}

                            {this.props.match.params.draft !== undefined ||
                            this.state.agreement_tender_draft === 1 ? null : (
                              <Row
                                val={{
                                  des: "des",
                                  due_date: "due_date",
                                  amount: "amount",
                                }}
                                val2={{ des: "", due_date: "", amount: "" }}
                                key={0}
                                ind={0}
                                t={t}
                              />
                            )}
                            {this.state.row_phase.map((r, index) => (
                              <Row
                                val={{
                                  des: "des",
                                  due_date: "due_date",
                                  amount: "amount",
                                }}
                                val2={r}
                                key={index}
                                ind={index + 1}
                                t={t}
                              />
                            ))}
                          </div>
                          <div className="form-group mb-0">
                            {this.state.agreement_type === "milestone" ? (
                              <label>
                                <a onClick={this.handleAppend}>
                                  {t("myagreement.add_mile")}
                                </a>
                              </label>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="hr mg-20 mb-5"></div>
                      <div className="row">
                        <div className="col-lg-7 offset-lg-5 col-md-10 offset-md-2">
                          <div className="row mb-3">
                            <div className="col-sm-8">
                              <h4 className="head4 mb-2">
                                {t("myagreement.total_proj")}
                              </h4>
                              <p>{t("myagreement.total_proj_txt")}</p>
                            </div>
                            <div className="col-sm-4 text-sm-right">
                              <h5 className="head5">
                                {this.state.left}{" "}
                                <span id="c_total">
                                  {this.props.match.params.draft !==
                                    undefined ||
                                  this.state.agreement_tender_draft === 1
                                    ? this.state.agreement_rate
                                    : "0.00"}
                                </span>{" "}
                                {this.state.right}
                              </h5>
                            </div>
                          </div>
                          {this.state.configuration_val > 0 ? (
                            <div className="row mb-3">
                              <div className="col-sm-8">
                                <h4 className="head4 mb-2">
                                  <span>
                                    {this.state.configuration_val}%{" "}
                                    {t("myagreement.flip_fee")}{" "}
                                  </span>
                                  <a href="#"> {t("myagreement.chk_terms")}</a>
                                </h4>
                                <p>&nbsp</p>
                              </div>
                              <div className="col-sm-4 text-sm-right">
                                <input
                                  type="hidden"
                                  id="config"
                                  value={this.state.configuration_val}
                                />
                                <h5 className="head5 fee">
                                  {this.state.left}{" "}
                                  <span id="per">
                                    {this.props.match.params.draft !==
                                      undefined ||
                                    this.state.agreement_tender_draft === 1
                                      ? this.state.agreement_service_fee
                                      : "0.00"}
                                  </span>{" "}
                                  {this.state.right}
                                </h5>
                              </div>
                            </div>
                          ) : null}
                          {this.state.configuration_val > 0 ? (
                            <div className="row mb-3">
                              <div className="col-sm-8">
                                <h4 className="head4 mb-2">
                                  {t("myagreement.chk_terms_txt")}{" "}
                                  <a href="#">
                                    {t("myagreement.chk_terms_txt_terms")}
                                  </a>
                                </h4>
                                <p>{t("myagreement.more_terms")}</p>
                              </div>
                              <div className="col-sm-4 text-sm-right">
                                <h5 className="head5 est_pay">
                                  {this.state.left}{" "}
                                  <span id="1_est">
                                    {this.props.match.params.draft !==
                                      undefined ||
                                    this.state.agreement_tender_draft === 1
                                      ? this.state.agreement_estimated_payment
                                      : "0.00"}
                                  </span>{" "}
                                  {this.state.right}
                                </h5>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="hr mg-20"></div>
                    </div>

                    <div
                      className={
                        this.state.agreement_terms === "hourly"
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="hourly"
                      role="tabpanel"
                      aria-labelledby="hourly-tab"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <br />
                          <h3 className="head3 mb-1">
                            {t("myagreement.payment_terms")}
                          </h3>
                          <p className="mb-5" style={{ color: "#a7a7a7" }}>
                            <b>{t("myagreement.hourly")}</b>
                          </p>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-xl-4 col-lg-5 col-md-6">
                                <label className="mb-md-0">
                                  {t("myagreement.hr_rate")}
                                </label>
                              </div>
                              <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                                <div className="row gutters-14 align-items-center">
                                  <div className="col">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control text-right my-input1"
                                        placeholder={this.state.agreement_rate}
                                      />
                                      <div className="input-group-prepend">
                                        <div className="input-group-text">
                                          <i className="icon-euro"></i>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col flexgrow0">
                                    <label className="mb-0">/hr</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-xl-4 col-lg-5 col-md-6">
                                <label className="mb-md-0">
                                  {this.state.configuration_val}%{" "}
                                  {t("myagreement.flip_fee")}.{" "}
                                  <a href="#">{t("myagreement.chk_terms")}</a>
                                </label>
                              </div>
                              <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                                <div className="row gutters-14 align-items-center">
                                  <div className="col">
                                    <div className="input-group">
                                      <input
                                        type="hidden"
                                        id="config1"
                                        value={this.state.configuration_val}
                                      />

                                      <input
                                        type="text"
                                        className="form-control text-right fee1"
                                        placeholder={
                                          this.state.agreement_service_fee
                                        }
                                        readOnly
                                      />
                                      <div className="input-group-prepend">
                                        <div className="input-group-text">
                                          <i className="icon-euro"></i>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="col"
                                    style={{ flexGrow: "0" }}
                                  >
                                    <label className="mb-0">/hr</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="row align-items-center">
                              <div className="col-xl-4 col-lg-5 col-md-6">
                                <label className="mb-md-0">
                                  {t("myagreement.chk_terms_txt")}{" "}
                                  <a href="#">
                                    {t("myagreement.chk_terms_txt_terms")}
                                  </a>
                                </label>
                              </div>
                              <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                                <div className="row gutters-14 align-items-center">
                                  <div className="col">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control text-right"
                                        id="c_total1"
                                        placeholder={
                                          this.state.agreement_estimated_payment
                                        }
                                      />
                                      <div className="input-group-prepend">
                                        <div className="input-group-text">
                                          <i className="icon-euro"></i>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col flexgrow0">
                                    <label className="mb-0">/hr</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hr mg-20"></div>
                    </div>
                  </div>
                  <div className="clear"></div>
                  <h2 className="head2 my-4">
                    {t("myagreement.agreement_terms")}
                  </h2>
                  <div ref={this.myRefTerms} className="row">
                    <div className="col-xl-5 col-lg-5 col-md-6">
                      <div className="form-group">
                        <label for="m-payment">{t("myproposal.mat_pay")}</label>
                        <select
                          value={this.state.mat_pay}
                          onChange={this.handleChange2}
                          name="mat_pay"
                          id="m-payment"
                          className="form-control"
                        >
                          <option>--select--</option>
                          <option>Payment aftre total delivery</option>
                          <option>payment after project done</option>
                          <option>As per inovice</option>
                          <option value="other">Custom message</option>
                        </select>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.mat_pay_err === true
                            ? "Payment is required"
                            : null}
                        </p>
                      </div>
                      <div
                        className="form-group"
                        id="custom-message"
                        style={{ display: "none" }}
                      >
                        <textarea
                          onChange={this.handleChange2}
                          name="other"
                          className="form-control"
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label for="work-payment">
                          {t("myproposal.work_pay")}
                        </label>
                        <select
                          value={this.state.work_pay}
                          onChange={this.handleChange2}
                          name="work_pay"
                          id="work-payment"
                          className="form-control"
                        >
                          <option>--select--</option>
                          {this.state.agreement_terms === "fixed" ? (
                            <option>Payment aftre work</option>
                          ) : null}
                          {this.state.agreement_terms === "hourly" ? (
                            <option>Pay hourly</option>
                          ) : null}
                        </select>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.work_pay_err === true
                            ? "Payment is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="transport-payment">
                          {t("myagreement.transportation_payment_terms")}
                        </label>
                        <select
                          value={this.state.agreement_transport_payment}
                          onChange={this.handleChange2}
                          name="agreement_transport_payment"
                          id="transport-payment"
                          className="form-control"
                        >
                          <option>--select--</option>
                          <option>included</option>
                          <option>Not included</option>
                        </select>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.agreement_transport_payment_err === true
                            ? "Transport payment is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label>{t("myagreement.client_resposibilities")}</label>

                        {(this.props.match.params.customer !== undefined &&
                          this.props.match.params.draft !== undefined) ||
                        this.state.agreement_tender_draft === 1 ? (
                          <p>{this.state.agreement_client_res}</p>
                        ) : null}

                        <div id="client-resposibilities">
                          <select
                            name="agreement_client_res"
                            id="client-resposibilities"
                            className="form-control"
                          >
                            <option value="Water">
                              {t("agreement_vals.responsibilities.water")}
                            </option>
                            <option value="Timber">
                              {t("agreement_vals.responsibilities.timber")}
                            </option>
                            <option value="Electricity">
                              {t("agreement_vals.responsibilities.electricity")}
                            </option>
                            <option value="Plumbing">
                              {t("agreement_vals.responsibilities.plumbing")}
                            </option>
                            <option value="etc">etc</option>
                            <option value="custom 1">Custom 1</option>
                          </select>
                          <input
                            ref={(input) => {
                              this.agreement_client_res = input;
                            }}
                            style={{ display: "none" }}
                            type="text"
                            name="selected_values"
                            disabled="disabled"
                            placeholder="Selected"
                          />
                        </div>
                      </div>
                      <div
                        className="form-group"
                        id="custom-message2"
                        style={{ display: "none" }}
                      >
                        <textarea
                          onChange={this.handleChange2}
                          name="agreement_client_res_other"
                          className="form-control"
                          value={this.state.agreement_client_res_other}
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label>
                          {t("myagreement.contractor_resposibilities")}
                        </label>
                        {(this.props.match.params.customer !== undefined &&
                          this.props.match.params.draft !== undefined) ||
                        this.state.agreement_tender_draft === 1 ? (
                          <p>{this.state.agreement_contractor_res}</p>
                        ) : null}
                        <div id="contractor-resposibilities">
                          <select
                            name="agreement_contractor_res"
                            id="contractor-resposibilities"
                            className="form-control"
                          >
                            <option value="Water">
                              {t("agreement_vals.responsibilities.water")}
                            </option>
                            <option value="Timber">
                              {t("agreement_vals.responsibilities.timber")}
                            </option>
                            <option value="Electricity">
                              {t("agreement_vals.responsibilities.electricity")}
                            </option>
                            <option value="Plumbing">
                              {t("agreement_vals.responsibilities.plumbing")}
                            </option>
                            <option value="etc">etc</option>
                            <option value="custom">Custom</option>
                          </select>
                          <input
                            ref={(input) => {
                              this.agreement_contractor_res = input;
                            }}
                            style={{ display: "none" }}
                            type="text"
                            name="selected_values"
                            disabled="disabled"
                            placeholder="Selected"
                          />
                        </div>
                      </div>
                      <div
                        className="form-group"
                        id="custom-message1"
                        style={{ display: "none" }}
                      >
                        <textarea
                          onChange={this.handleChange2}
                          name="agreement_contractor_res_other"
                          className="form-control"
                          value={this.state.agreement_contractor_res_other}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label for="legal-agreement">
                          {t("myagreement.legal_agreement_category")}
                        </label>
                        <p>{this.state.agreement_legal_category}</p>
                        <div id="legal-agreement">
                          <select
                            name="agreement_legal_category"
                            id="legal-agreement"
                            className="form-control"
                          >
                            <option value="Timber">
                              {t("agreement_vals.legal.timber")}
                            </option>
                            <option value="Electricity">
                              {t("agreement_vals.legal.electricity")}
                            </option>
                            <option value="Plumbing">
                              {t("agreement_vals.legal.plumbing")}
                            </option>
                            <option value="etc">etc</option>
                          </select>
                          <input
                            ref={(input) => {
                              this.agreement_legal_category = input;
                            }}
                            style={{ display: "none" }}
                            type="text"
                            name="selected_values"
                            disabled="disabled"
                            placeholder="Selected"
                          />
                        </div>
                      </div>

                      <div className="form-group" id="check_con">
                        <div
                          className="form-check form-check-inline"
                          id="klon1"
                        >
                          <input
                            className="form-check-input"
                            id=""
                            type="checkbox"
                          />
                          <label
                            className="form-check-label"
                            for="agreement-issues"
                          >
                            <div className="mb-2">
                              {t("myagreement.agreement_general_legal_issues")}
                            </div>

                            <br />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-5 col-lg-6 col-md-6">
                      <div className="form-group">
                        <label for="materials">
                          {t("myagreement.materials_quarantees")}{" "}
                        </label>
                        <textarea
                          value={this.state.agreement_material_guarantee}
                          onChange={this.handleChange2}
                          name="agreement_material_guarantee"
                          style={{ height: "70px" }}
                          id="materials"
                          className="form-control"
                        ></textarea>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.agreement_material_guarantee_err === true
                            ? "Guarantee is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="work-quarantees">
                          {t("myagreement.work_quarantees")}
                        </label>
                        <textarea
                          value={this.state.agreement_work_guarantee}
                          onChange={this.handleChange2}
                          name="agreement_work_guarantee"
                          style={{ height: "70px" }}
                          id="work-quarantees"
                          className="form-control"
                        ></textarea>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.agreement_work_guarantee_err === true
                            ? "Guarantee is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="agreement-insurances">
                          {t("myagreement.agreement_insurances")}
                        </label>
                        <input
                          value={this.state.agreement_insurances}
                          type="text"
                          onChange={this.handleChange2}
                          name="agreement_insurances"
                          id="agreement-insurances"
                          className="form-control"
                        />
                        <p style={{ color: "#eb516d " }}>
                          {this.state.agreement_insurances_err === true
                            ? "Insurance is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="panelty-terms">
                          {t("myagreement.panelty_terms")}
                        </label>
                        <textarea
                          value={this.state.agreement_panelty}
                          onChange={this.handleChange2}
                          name="agreement_panelty"
                          style={{ height: "70px" }}
                          id="panelty-terms"
                          className="form-control"
                        ></textarea>
                        <small className="form-text text-muted">
                          mention the delay terms
                        </small>
                        <p style={{ color: "#eb516d " }}>
                          {this.state.agreement_panelty_err === true
                            ? "Penalty is required"
                            : null}
                        </p>
                      </div>
                      <div className="form-group">
                        <label for="a-work-price">
                          {t("myagreement.additional_work_prices")}
                        </label>
                        <textarea
                          id="a-work-price"
                          className="form-control"
                          value={this.state.agreement_additional_work_price}
                          onChange={this.handleChange2}
                          name="agreement_additional_work_price"
                          placeholder=""
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className="row">
                    <div className="col-xl-10 col-lg-11">
                      <div className="form-group">
                        <label>{t("myagreement.attachments")}</label>

                        <div className="file-select attachment">
                          <input
                            onChange={this.handleChange7}
                            type="file"
                            id="attachments"
                            name="attachments"
                          />
                          <label for="attachments">
                            <i className="icon-attachment"></i>
                            <span
                              className="filename font-weight-bold"
                              data-text="Attach File"
                            >
                              Upload attachments
                            </span>
                            <span
                              onClick={this.handleAttachmentRemove}
                              className="clear"
                            >
                              +
                            </span>
                          </label>
                        </div>

                        {this.state.attachment_pre ? (
                          <label for="attachments">
                            <a
                              href={
                                url +
                                "/images/marketplace/agreement/" +
                                this.state.attachment_pre
                              }
                              target="_blank"
                              class="attachment"
                            >
                              <i class="icon-paperclip"></i>
                              {this.state.attachment_pre}
                            </a>
                          </label>
                        ) : null}
                        <p className="form-text text-muted">
                          {t("myagreement.legal_txt")}
                        </p>
                      </div>
                    </div>

                    <div className="col-12 mt-5">
                      <button
                        class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                        data-toggle="modal"
                        data-target="#closeagreement"
                      >
                        Close Greement
                      </button>
                      <button
                        onClick={this.hiddenFields}
                        className="btn btn-gray mb-md-0 mb-3 mr-4 clk2"
                        data-toggle="modal"
                        data-target="#preview-info"
                      >
                        Preview Agreement
                      </button>
                      {this.props.match.params.draft !== undefined ||
                      this.state.agreement_tender_draft === 1 ? (
                        <button
                          onClick={this.handleUpdate}
                          class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0 clk2"
                        >
                          Update as a draft
                        </button>
                      ) : loading ? (
                        loading
                      ) : (
                        <button
                          onClick={this.handleDraft}
                          class="btn btn-gray mb-md-0 mb-3 mr-4 clk2"
                        >
                          Save as a draft
                        </button>
                      )}

                      {/* {loading ? (
                        loading
                      ) : ( */}
                      <button
                        onClick={(e) => this.handleSubmit(e, 1)}
                        className="btn btn-primary mb-md-0 mb-4 clk2"
                      >
                        Submit &amp; Send
                      </button>
                      {/* )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BusinessInfo onInfo={this.handleBusinessInfo} />
            <RatingModal />
            <AddCustomer addCus={this.addCustomer} />
            <PDFViewAgreement
              businessInfo={this.state.business_info}
              userInfo={userInfo}
            />
          </div>
        </div>
      </div>
    );
  }
}
var yesterday = moment().subtract(1, "day");
function valid(current) {
  return current.isAfter(yesterday);
}

const Row = (props) => (
  <div className="row">
    <div className="col" style={{ flexGrow: "0" }}>
      {props.val2.amount && props.ind >= 1 ? (
        <button
          style={{ borderRadius: "50px" }}
          class="btn-dark remove-input"
          id="myRemoveinput"
        >
          X
        </button>
      ) : null}

      <div className="form-group">
        <label>&nbsp;</label>
        <p className="form-text"></p>
      </div>
    </div>
    <div className="col">
      <div className="row milestone">
        <div className="col-md-6">
          <div className="form-group">
            <label>
              <b>{props.t("c_material_list.request.description")}</b>
            </label>
            <input
              type="text"
              className="form-control"
              name={props.val.des}
              placeholder={props.val2.des}
              // value={props.val2.des}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="row gutters-14">
            <div className="col-sm">
              <div className="form-group">
                <label>
                  <b>{props.t("myproposal.due_date")}</b>
                </label>
                <div className="input-group">
                  <Datetime
                    name={props.val.due_date}
                    isValidDate={valid}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    defaultValue={props.val2.due_date}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <i className="icon-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm">
              <div className="form-group">
                <label>
                  <b>{props.t("invoice.amount")}</b>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control text-right my-input"
                    placeholder={props.val2.amount}
                    // value={props.val2.amount}
                    name={props.val.amount}
                  />
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="icon-euro"></i>
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

export default withTranslation()(AgreementCreate);
