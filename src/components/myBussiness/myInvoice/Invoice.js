import React, { Component } from "react";
import axios from "axios";
import { url } from "../../../helper/helper";
import Header from "../../shared/Header";
import BussinessSidebar from "../../shared/BussinessSidebar";
import File from "../../../images/file-icon.png";
import Datetime from "react-datetime";
import moment from "moment";
import Select from "react-select";
import Autosuggest from "react-autosuggest";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import BusinessInfo from "../modals/BusinessInfo";
import PDFViewInvoice from "../modals/PDFViewInvoice";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import $ from "jquery";

const options = [];
let clients = [];

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

class Invoice extends Component {
  state = {
    business_info: [],
    email: "",
    emails: [],
    date: "",
    date_err: false,
    due_date: "",
    due_date_err: false,
    inv_no: "",
    inv_no_err: false,
    refer: "",
    refer_err: false,
    acc_no: "",
    acc_err: false,
    pay_term: "",
    pay_term_err: false,
    delay_interest: "",
    delay_interest_err: false,
    note: "",
    terms: "",
    service: "1",
    currency: "1",
    attachment: null,
    name: null,
    name_err: false,
    name_unq: null,
    type: "resource",
    agree_id: null,

    itemsInput: null,
    taxInput: null,
    subInput: null,
    taxCalcInput: null,
    totalInput: null,

    tender_id: 0,
    row_phase: [],
    selectedOption: null,
    value: "",
    suggestions: [],
    suggestions2: [],
    error: null,
    client_id_err: false,

    errors: [],
    show_errors: false,
    show_msg: false,

    agreements: [],
    projects: [],
    agreement: 0,
    project: 0,

    productcat: [],
    clientsList: [],

    loading: false,

    left: null,
    right: null,
  };

  componentDidMount = () => {
    $('.attachment input[type="file"]').change(function (e) {
      $(this)
        .next()
        .find(".filename")
        .html(e.target.files[0].name)
        .addClass("active");
      $(this).next().find(".clear").show();
    });
    $(".attachment label span.clear").click(function (e) {
      e.preventDefault();
      var content = $(this).prev(".filename").attr("data-text");
      $(this).prev(".filename").html(content).removeClass("active");
      $(this).parents(".file-select").find("input[type=file]").val("");
      $(this).hide();
    });

    this.loadResources();
    this.loadCategory();
    this.loadConfig();
    this.myRef = React.createRef();
  };

  deleteRow = (index) => {
    var row_phase = [...this.state.row_phase];
    row_phase.splice(index, 1);
    this.setState({ row_phase });
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
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ productcat: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  loadProjects = async (type, id) => {
    if (id.includes("com")) {
      const token = await localStorage.getItem("token");
      axios
        .get(`${url}/api/invoice/getProjects/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          console.log(result);
          this.setState({ projects: result.data.data });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  changeCat = (e) => {
    if (e.target.value !== "--Select--") {
      let row_phase = this.state.row_phase;
      let obj = {
        des: e.target.value,
        amount: 0,
        qty: 0,
        cost: 0,
      };
      row_phase.push(obj);
      this.setState({
        row_phase: row_phase,
      });
    }
  };

  changeAgreement = (event) => {
    console.log(event.target.value);
    if (event.target.value !== "--Select--") {
      const token = localStorage.getItem("token");
      if (event.target.value.split(",")[1] === " hourly") {
        axios
          .get(
            `${url}/api/invoice/getTasksById/${
              event.target.value.split(",")[0]
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            this.setState({ row_phase: [] });
            this.setState({
              row_phase: JSON.parse(result.data.data[0].items),
              agree_id: result.data.data[0].id,
              agreement: result.data.data[0].project_id,
            });
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        axios
          .get(
            `${url}/api/invoiceAgreements/${event.target.value.split(",")[0]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            this.setState({ row_phase: [] });
            this.setState({
              row_phase: JSON.parse(result.data.data.items),
              agree_id: result.data.data.id,
              agreement: result.data.data.agreement_id,
            });
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
  };

  selectTerm = (event) => {
    if (event.target.value !== "--Select--") {
      const token = localStorage.getItem("token");
      if (event.target.value.split(",")[1] !== "null") {
        axios
          .get(
            `${url}/api/invoice/getPaymentTerms/${
              event.target.value.split(",")[0]
            }/${event.target.value.split(",")[1]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            this.setState({ agreements: result.data.data });
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else {
        axios
          .get(
            `${url}/api/invoice/getTasks/${event.target.value.split(",")[0]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            this.setState({ agreements: result.data.data });
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    }
  };

  handleAppend = (event) => {
    event.preventDefault();
    let row_phase = this.state.row_phase;
    let keys = ["items", "qty", "cost", "amount"];
    let gg = `${""},${0},${0},${0}`.split(",");
    let result = {};
    keys.forEach((key, i) => (result[key] = gg[i]));
    row_phase.push(result);
    this.setState({ row_phase: row_phase });
  };

  handleAttachment = (event) => {
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
  handleAuto = (selectedOption) => {
    this.setState({ selectedOption });
  };
  onChange = (event, { newValue }) => {
    this.loadProjects(this.state.type, newValue);
    this.setState({
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
  };
  handleDate = (event) => {
    this.setState({ date: moment(event._d).format("DD-MM-YYYY") });
  };
  handleDate1 = (event) => {
    this.setState({ due_date: moment(event._d).format("DD-MM-YYYY") });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  changeType = (event) => {
    if (event.target.value === "client") {
      this.setState({ clientsList: [] });
      this.loadClient();
      this.setState({ type: "resource" });
    }
    if (event.target.value === "user") {
      this.setState({ clientsList: [] });
      this.loadUser();
      this.setState({ type: "user" });
    }
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
        clients.length = 0;
        result.data.data.map((res) => {
          var keys = ["value", "label"];
          var _key = {};
          keys.forEach((key, i) => (_key[key] = res.email));
          _key["name"] = res.full_name;
          _key["id"] = res.id;
          clients.push(_key);
          this.setState({ clientsList: clients });
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  loadUser = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/invoice/agreementUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        clients.length = 0;
        result.data.data.map((res) => {
          if (res.email) {
            var keys = ["value", "label"];
            var _key = {};
            keys.forEach((key, i) => (_key[key] = res.email));
            _key["name"] = res.full_name;
            _key["id"] = res.agreement_client_id;
            clients.push(_key);
            this.setState({ clientsList: clients });
          }
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
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

  handleDraft = async (event) => {
    event.preventDefault();

    this.setState({
      date_err: false,
      inv_no_err: false,
      refer_err: false,
      acc_err: false,
      pay_term_err: false,
      due_date_err: false,
      delay_interest_err: false,
      name_err: false,
      name_unq: null,
      client_id_err: false,
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

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("tender_id", this.state.tender_id);
    data.set("client_id", client_id);
    data.set("date", this.state.date);
    data.set("type", this.state.type);
    data.set("agree_id", this.state.agree_id);
    data.set("agreement", this.state.agreement);
    data.set("due_date", this.state.due_date);
    data.set("invoice_number", this.state.inv_no);
    data.set("reference", this.state.refer);
    data.set("acc_no", this.state.acc_no);
    data.set("pay_term", this.state.pay_term);
    data.set("interest", this.state.delay_interest);
    data.set("cc", this.state.emails);
    data.set("service", this.state.service);
    data.set("currency", this.state.currency);
    data.set("items", this.itemsInput.value);
    data.set("tax", this.taxInput.value);
    data.set("sub_total", this.subInput.value);
    data.set("tax_calc", this.taxCalcInput.value);
    data.set("total", this.totalInput.value);
    data.set("note", this.state.note);
    data.set("terms", this.state.terms);
    data.set("sent", 0);
    data.set("invoice_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/invoice/draft`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({ show_msg: true, loading: false });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        this.myRef.current.scrollTo(0, 0);
        if (err.response.status === 406) {
          if (err.response.data.error.invoice_names) {
            this.setState({
              name_unq: err.response.data.error.invoice_names[0],
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      date_err: false,
      inv_no_err: false,
      refer_err: false,
      acc_err: false,
      pay_term_err: false,
      due_date_err: false,
      delay_interest_err: false,
      name_err: false,
      name_unq: null,
      client_id_err: false,
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

    if (this.state.date == "") {
      return this.setState({ date_err: true });
    }
    if (this.state.inv_no == "") {
      return this.setState({ inv_no_err: true });
    }
    if (this.state.refer == "") {
      return this.setState({ refer_err: true });
    }
    if (this.state.acc_no == "") {
      return this.setState({ acc_err: true });
    }
    if (this.state.pay_term == "") {
      return this.setState({ pay_term_err: true });
    }
    if (this.state.due_date == "") {
      return this.setState({ due_date_err: true });
    }
    if (this.state.delay_interest == "") {
      return this.setState({ delay_interest_err: true });
    }
    if (this.state.name == null) {
      return this.setState({ name_err: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("tender_id", this.state.tender_id);
    data.set("client_id", client_id);
    data.set("type", this.state.type);
    data.set("agree_id", this.state.agree_id);
    data.set("agreement", this.state.agreement);
    data.set("date", this.state.date);
    data.set("due_date", this.state.due_date);
    data.set("invoice_number", this.state.inv_no);
    data.set("reference", this.state.refer);
    data.set("acc_no", this.state.acc_no);
    data.set("pay_term", this.state.pay_term);
    data.set("interest", this.state.delay_interest);
    data.set("cc", this.state.emails);
    data.set("service", this.state.service);
    data.set("currency", this.state.currency);
    data.set("items", this.itemsInput.value);
    data.set("tax", this.taxInput.value);
    data.set("sub_total", this.subInput.value);
    data.set("tax_calc", this.taxCalcInput.value);
    data.set("total", this.totalInput.value);
    data.set("note", this.state.note);
    data.set("terms", this.state.terms);
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
    data.set("sent", 1);
    data.set("invoice_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/invoice/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          show_msg: true,
          date: "",
          due_date: "",
          inv_no: "",
          refer: "",
          acc_no: "",
          pay_term: "",
          delay_interest: "",
          emails: [],
          email: "",
          agreement: 0,
          agree_id: null,
          service: "",
          note: "",
          terms: "",
          attachment: "",
          name: "",
          itemsInput: null,
          taxInput: null,
          subInput: null,
          taxCalcInput: null,
          totalInput: null,
          row_phase: [],
          selectedOption: null,
          agreements: [],
          projects: [],
          productcat: [],
          clientsList: [],
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        this.myRef.current.scrollTo(0, 0);
        if (err.response.status === 406) {
          if (err.response.data.error.invoice_names) {
            this.setState({
              name_unq: err.response.data.error.invoice_names[0],
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
          });
        }
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  hiddenFields = () => {
    this.setState({
      client_id:
        this.state.tender_id !== 0 ||
        this.props.match.params.draft !== undefined
          ? this.state.userEmail
          : this.state.value,
      itemsInput: this.itemsInput.value,
      taxInput: this.taxInput.value,
      subInput: this.subInput.value,
      taxCalcInput: this.taxCalcInput.value,
      totalInput: this.totalInput.value,
    });
  };

  render() {
    const { t, i18n } = this.props;

    var yesterday = moment().subtract(1, "day");
    function valid(current) {
      return current.isAfter(yesterday);
    }

    let loading;

    const userInfo = {
      client_id: this.state.client_id,
      date: this.state.date,
      due_date: this.state.due_date,
      invoice_number: this.state.inv_no,
      reference: this.state.refer,
      acc_no: this.state.acc_no,
      pay_term: this.state.pay_term,
      interest: this.state.delay_interest,
      cc: this.state.emails,
      service: this.state.service,
      currency: this.state.currency,
      itemsInput: this.state.itemsInput,
      taxInput: this.state.taxInput,
      subInput: this.state.subInput,
      taxCalcInput: this.state.taxCalcInput,
      totalInput: this.state.totalInput,
      note: this.state.note,
      terms: this.state.terms,

      left: this.state.left,
      right: this.state.right,
    };

    if (this.state.loading === true) {
      loading = (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    }

    let alert;
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
          {t("success.inv_ins")}
        </Alert>
      );
    }

    const {
      selectedOption,
      value,
      email,
      suggestions,
      suggestions2,
    } = this.state;

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
              to="/invoice-list"
              className="breadcrumb-item active"
              aria-current="page"
            >
              {t("invoice.invoice")}
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
              <h3 className="head3">{t("invoice.create_invoice")}</h3>
              <div className="row mt-4" style={{ maxWidth: "1120px" }}>
                <div className="col text-right">
                  <button
                    onClick={this.hiddenFields}
                    className="btn btn-primary ml-3 mb-3 clk3"
                    data-toggle="modal"
                    data-target="#preview-info"
                  >
                    Preview
                  </button>
                  {loading ? (
                    loading
                  ) : (
                    <button
                      onClick={this.handleSubmit}
                      className="btn btn-gray ml-3 mb-3 clk3"
                    >
                      Send
                    </button>
                  )}
                  {/* {loading ? (
                    loading
                  ) : ( */}
                  <button
                    onClick={this.handleDraft}
                    className="btn btn-gray ml-3 mb-3 clk3"
                  >
                    Save as Draft
                  </button>
                  {/* // )} */}
                </div>
              </div>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12">
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
                  <div className="row gutters-70 mt-3">
                    <div className="col-sm-12 col-md">
                      <h4 className="head4">
                        {t("myproposal.buss_info")}{" "}
                        <a
                          href="#"
                          className="float-right"
                          data-toggle="modal"
                          data-target="#edit-info"
                        >
                          Edit
                        </a>
                      </h4>
                      <address>
                        <p>
                          {this.state.business_info.company_id}
                          <br />
                          Company ID: {this.state.business_info.id}
                        </p>
                        <p>
                          {this.state.business_info.address}
                          <br />
                          {this.state.business_info.zip}
                        </p>
                        <p>
                          {this.state.business_info.email}
                          <br />
                          {this.state.business_info.phone}
                          <br />
                          {this.state.business_info.company_website}
                        </p>
                      </address>
                    </div>
                    <div className="col-sm-12 col-md">
                      <div className="form-group">
                        <label>Company Logo</label>
                        <div className="file-select inline">
                          <label for="attachments">
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
                    </div>
                    <div className="col-sm-12 col-lg-5">
                      <input
                        type="hidden"
                        ref={(input) => {
                          this.itemsInput = input;
                        }}
                        id="_items"
                      />
                      <input
                        type="hidden"
                        ref={(input) => {
                          this.subInput = input;
                        }}
                        id="_sub_total"
                      />
                      <input
                        type="hidden"
                        ref={(input) => {
                          this.taxInput = input;
                        }}
                        id="_tax"
                      />
                      <input
                        type="hidden"
                        ref={(input) => {
                          this.taxCalcInput = input;
                        }}
                        id="_tax_calc"
                      />
                      <input
                        type="hidden"
                        ref={(input) => {
                          this.totalInput = input;
                        }}
                        id="_total"
                      />

                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="invoice-date">
                              {t("invoice.invoice_date")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <Datetime
                                onChange={(date) => this.handleDate(date)}
                                isValidDate={valid}
                                id="invoice-date"
                                name="invoice_date"
                                dateFormat="DD-MM-YYYY"
                                timeFormat={false}
                                value={this.state.date}
                              />
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <i className="icon-calendar"></i>
                                </div>
                              </div>
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.date_err === true
                                ? "Date is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="invoice-number">
                              {t("invoice.invoice_number")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="number"
                                onChange={this.handleChange}
                                className="form-control"
                                id="invoice-number"
                                name="inv_no"
                                value={this.state.inv_no}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.inv_no_err === true
                                ? "Invoice-number is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="reference">
                              {t("invoice.reference")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="text"
                                onChange={this.handleChange}
                                className="form-control"
                                id="reference"
                                name="refer"
                                value={this.state.refer}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.refer_err === true
                                ? "Reference is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="account-number">
                              {t("invoice.account_number")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="number"
                                onChange={this.handleChange}
                                id="account-number"
                                name="acc_no"
                                className="form-control"
                                value={this.state.acc_no}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.acc_err === true
                                ? "Account-number is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="payment-term">
                              {t("myagreement.payment_terms")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="text"
                                onChange={this.handleChange}
                                className="form-control"
                                id="payment-term"
                                name="pay_term"
                                value={this.state.pay_term}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.pay_term_err === true
                                ? "Payment-term is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="due-date">
                              {t("myproposal.due_date")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <Datetime
                                onChange={(date) => this.handleDate1(date)}
                                isValidDate={valid}
                                id="due-date"
                                name="due_date"
                                dateFormat="DD-MM-YYYY"
                                timeFormat={false}
                                value={this.state.due_date}
                              />
                              <div className="input-group-append">
                                <div className="input-group-text">
                                  <i className="icon-calendar"></i>
                                </div>
                              </div>
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.due_date_err === true
                                ? "Due-date is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-lg-5">
                            <label for="delay-interest">
                              {t("invoice.delay_interest")}
                            </label>
                          </div>
                          <div className="col-sm-6 col-lg-7">
                            <div className="input-group">
                              <input
                                type="number"
                                id="delay-interest"
                                onChange={this.handleChange}
                                className="form-control"
                                name="delay_interest"
                                value={this.state.delay_interest}
                              />
                            </div>
                            <p style={{ color: "#eb516d " }}>
                              {this.state.delay_interest_err === true
                                ? "Delay-interest is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hr mg-30"></div>
                  <div style={{ maxWidth: "610px" }}>
                    <div className="form-group">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <label>{t("invoice.bill_to")}</label>
                        </div>
                        <div className="col-md-4">
                          {/* <Select
                            value={selectedOption}
                            onChange={this.handleAuto}
                            options={clients}
                          /> */}
                          <select
                            onChange={this.changeType}
                            class="form-control"
                          >
                            <option>--Select--</option>
                            <option value="user">user</option>
                            <option value="client">client</option>
                          </select>
                        </div>
                        <div className="col-md-6">
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
                        </div>
                      </div>
                      <p style={{ color: "#eb516d " }}>
                        {this.state.client_id_err === true
                          ? "Resource not found"
                          : null}
                      </p>
                    </div>
                    <div className="row">
                      <div className="col-md-6 offset-md-2">
                        <address>
                          <p>
                            {selectedOption ? selectedOption.name : null}
                            <br />
                            {selectedOption ? selectedOption.value : null}
                          </p>
                        </address>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <label>CC</label>
                        </div>
                        <div className="col-md-6">
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
                          {/* <input
                            id="mails"
                            type="text"
                            name="email"
                            value={this.state.email}
                            className="form-control"
                            placeholder="Type or paste email addresses and press `Enter`..."
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange2}
                            onPaste={this.handlePaste}
                          /> */}
                          {this.state.error && (
                            <p className="error">{this.state.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4"></div>
                  <div className="filter gray mt-4">
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="form-group">
                          <div className="row align-items-center gutters-14">
                            <div className="col flexgrow0">
                              <label className="mb-0" for="work_mat">
                                <b>{t("invoice.work_mat")}</b>
                              </label>
                            </div>
                            <div className="col">
                              <select
                                onChange={this.changeCat}
                                id="work_mat"
                                className="form-control"
                              >
                                <option>--Select--</option>
                                {typeof this.state.productcat !== "undefined"
                                  ? this.state.productcat.map(
                                      (
                                        { category_id, category_name },
                                        index
                                      ) => (
                                        <option value={category_name}>
                                          {category_name}
                                        </option>
                                      )
                                    )
                                  : []}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6">
                        <div className="form-group">
                          <div className="row align-items-center gutters-14">
                            <div className="col flexgrow0 mr-4">
                              <label className="mb-0" for="project">
                                <b>{t("b_sidebar.project.project")}</b>
                              </label>
                            </div>
                            <div className="col">
                              <select
                                onChange={this.selectTerm}
                                name="project"
                                id="project"
                                className="form-control"
                              >
                                <option>--Select--</option>
                                {typeof this.state.projects !== "undefined"
                                  ? this.state.projects.map(
                                      ({ id, aggrement_id, name }, index) => (
                                        <option value={`${id},${aggrement_id}`}>
                                          {aggrement_id ? `${name}` : `${name}`}
                                        </option>
                                      )
                                    )
                                  : []}
                              </select>
                            </div>
                            <div className="col">
                              <select
                                onChange={this.changeAgreement}
                                name="project"
                                id="project"
                                className="form-control"
                              >
                                <option>--Select--</option>
                                {typeof this.state.agreements !== "string"
                                  ? this.state.agreements.map(
                                      (
                                        { id, agreement_id, type, task_name },
                                        index
                                      ) => (
                                        <option value={`${id}, ${type}`}>
                                          {agreement_id
                                            ? `${task_name}`
                                            : `${task_name}`}
                                        </option>
                                      )
                                    )
                                  : []}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive-lg scroller mt-3 mb-5">
                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr className="text-right">
                          <th className="text-left"></th>
                          <th className="text-left">{t("invoice.item")}</th>
                          <th>{t("invoice.quantity")}</th>
                          <th>{t("invoice.unit")}</th>
                          <th>{t("invoice.price")}</th>
                          <th colspan="2">
                            {this.state.left} {t("invoice.amount")}{" "}
                            {this.state.right}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.row_phase.map((r, index) => {
                          return (
                            <Row
                              val={r}
                              key={index}
                              idx={index}
                              deleteRow={this.deleteRow}
                            />
                          );
                        })}

                        <tr className="text-right">
                          <td colspan="6">
                            <button
                              onClick={this.handleAppend}
                              class="btn btn-link p-0"
                            >
                              Add row
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                        </tr>
                        <tr>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                          <td className="border-0">&nbsp;</td>
                        </tr>

                        <tr>
                          <td></td>
                          <td className="p-0 border-0" colspan="5">
                            <table className="table table-bordered mt-0">
                              <tbody>
                                <tr className="text-right">
                                  <td></td>
                                  <td>
                                    {this.state.left} {t("invoice.subtotal")}{" "}
                                    {this.state.right}
                                  </td>
                                  <td id="5result">
                                    {this.state.row_phase.length <= 0
                                      ? 0
                                      : this.state.row_phase[0].amount}
                                  </td>
                                </tr>
                                <tr className="text-right">
                                  <td>VAT%</td>
                                  <td
                                    className="tax1 text-left"
                                    suppressContentEditableWarning={true}
                                    contentEditable={true}
                                  >
                                    0
                                  </td>
                                  <td>
                                    {this.state.left}
                                    <span className="tax_res">0.00</span>
                                    {this.state.right}
                                  </td>
                                </tr>
                                <tr className="text-right">
                                  <td></td>
                                  <td>
                                    <b>
                                      {this.state.left} {t("invoice.total")}{" "}
                                      {this.state.right}
                                    </b>
                                  </td>
                                  <td>
                                    <b>
                                      {this.state.left}
                                      <span className="total">0.00</span>
                                      {this.state.right}
                                    </b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-group d-inline-block">
                        <div className="file-select attachment">
                          <input
                            onChange={this.handleAttachment}
                            type="file"
                            id="file"
                          />
                          <label for="file">
                            <i className="icon-attachment"></i>
                            <span
                              className="filename font-weight-bold"
                              data-text="Attach File"
                            >
                              {t("invoice.attach_file")}
                            </span>
                            <span
                              onClick={this.handleAttachmentRemove}
                              className="clear"
                            >
                              +
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md">
                      <div className="form-group">
                        <label for="note">
                          {t("invoice.note_to_recipient")}
                        </label>
                        <textarea
                          name="note"
                          value={this.state.note}
                          onChange={this.handleChange}
                          id="note"
                          className="form-control"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md offset-md-1">
                      <div className="form-group">
                        <label for="terms">
                          {t("invoice.terms_and_conditions")}
                        </label>
                        <textarea
                          id="terms"
                          name="terms"
                          onChange={this.handleChange}
                          className="form-control"
                          value={this.state.terms}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col text-right">
                      <button
                        onClick={this.hiddenFields}
                        className="btn btn-primary ml-3 mb-3 clk3"
                        data-toggle="modal"
                        data-target="#preview-info"
                      >
                        Preview
                      </button>

                      {loading ? (
                        loading
                      ) : (
                        <button
                          onClick={this.handleSubmit}
                          className="btn btn-gray ml-3 mb-3 clk3"
                        >
                          Send
                        </button>
                      )}

                      {/* {loading ? (
                        loading
                      ) : ( */}
                      <button
                        onClick={this.handleDraft}
                        className="btn btn-gray ml-3 mb-3 clk3"
                      >
                        Save as Draft
                      </button>
                      {/* )} */}
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>

            <BusinessInfo onInfo={this.handleBusinessInfo} />
            <PDFViewInvoice
              businessInfo={this.state.business_info}
              userInfo={userInfo}
            />
          </div>
        </div>
      </div>
    );
  }
}

const Row = (props) => {
  return (
    <tr className="text-right i-val customerIDCell">
      <td
        class="remove-row1"
        onClick={(e) => props.deleteRow(props.idx)}
        id="myRemove"
      >
        ×
      </td>
      <td
        suppressContentEditableWarning={true}
        className="text-left"
        contentEditable="true"
      >
        {props.val.des}{" "}
      </td>
      <td
        className="duration1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        {props.val.due_date}
      </td>
      <td suppressContentEditableWarning={true} contentEditable="true">
        {props.val.hourly}
      </td>
      <td
        className="cost_hr1"
        suppressContentEditableWarning={true}
        contentEditable="true"
      >
        0
      </td>
      <td className="mat_cost1" colspan="2">
        {props.val.amount}
      </td>
    </tr>
  );
};

export default withTranslation()(Invoice);
