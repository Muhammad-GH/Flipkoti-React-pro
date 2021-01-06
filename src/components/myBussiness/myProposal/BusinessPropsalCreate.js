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
import ProjectPlanProposal from "../modals/ProjectPlanProposal";
import PDFView from "../modals/PDFView";
import { Link } from "react-router-dom";
import Select from "react-select/creatable";
import Autosuggest from "react-autosuggest";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { withTranslation } from "react-i18next";
import $ from "jquery";

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

class BusinessPropsalCreate extends Component {
  state = {
    logo: null,
    attachment: null,
    attachment_pre: null,
    logo_preview: null,
    customer: "",
    email: "",
    emails: [],
    date: "",
    dateFormat: "",
    dateFormat1: "",
    date_err: false,
    mat_pay: "",
    mat_pay_err: false,
    other: "",
    work_pay: "",
    work_pay_err: false,
    work: "",
    work_err: false,
    insurance: "",
    insurance_err: false,
    due_date: "",
    due_date_err: false,
    sdate: "",
    edate: "",
    sdate_err: false,
    edate_err: false,
    business_info: [],
    error: null,
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
    selectedOption: null,
    value: "",
    suggestions: [],
    suggestions2: [],
    userEmail: null,
    client_id: null,
    client_id_err: false,

    type: "all",

    workItems: null,
    workTotal: 0,
    matItems: null,
    matTotal: 0,
    work_template_name: "",
    mat_template_name: "",
    template_name: "",
    mat_template_id: 0,
    work_template_id: 0,

    proposal_status: 0,
    proposal_client_type: 0,
    proposal_tender_draft: 0,
    proposal_request_id_tender: 0,

    left: null,
    right: null,
  };

  componentDidMount = () => {
    this._isMounted = true;
    this.axiosCancelSource = axios.CancelToken.source();

    // jquery start
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
    // jquery finish

    if (this.props.match.params.customer !== undefined) {
      this.setState({ tender_id: this.props.match.params.tender });
      this.getEmail(this.props.match.params.customer);
      this.setDataTender(this.props.match.params.tender);
    }
    if (
      this.props.match.params.customer !== undefined &&
      this.props.match.params.draft !== undefined
    ) {
      this.setData(this.props.match.params.tender);
    }
    this.loadResources(this.axiosCancelSource);
    this.loadClient(this.axiosCancelSource);
    this.loadProposalID(this.axiosCancelSource);
    this.loadConfig(this.axiosCancelSource);
    this.myRef = React.createRef();
    this.myRefMat = React.createRef();
    this.myRefDet = React.createRef();
  };

  addCustomer = () => {
    this.loadClient(this.axiosCancelSource);
  };

  loadConfig = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/config/currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          const { left, right } = result.data;
          this.setState({ left, right });
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

  setDataTender = async (id) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/proposal/get/byTID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const {
          proposal_tender_id,
          work,
          mat,
          proposal_client_type,
          // proposal_client_id,
          // proposal_user_id,
          proposal_request_id,
          // proposal_pdf,
          proposal_attachment,
          emails,
          date,
          proposal_material_payment,
          proposal_other,
          proposal_work_payment,
          proposal_work_guarantee,
          proposal_insurance,
          proposal_due_date,
          proposal_start_date,
          proposal_end_date,
          proposal_status,
          email,
          proposal_names,
        } = result.data;

        this.setState({
          tender_id: proposal_tender_id,
          emails: emails ? emails.split(",") : [],
          date: date === "null" || date === null ? "" : date,
          dateFormat:
            date === "null" || date === null
              ? ""
              : date.split("-").reverse().join("-"),
          mat_pay: proposal_material_payment,
          other: proposal_other,
          work_pay: proposal_work_payment,
          work:
            proposal_work_guarantee === "null" ? "" : proposal_work_guarantee,
          insurance: proposal_insurance === "null" ? "" : proposal_insurance,
          due_date: proposal_due_date === "null" ? "" : proposal_due_date,
          sdate:
            proposal_start_date === "null" || proposal_start_date === null
              ? ""
              : proposal_start_date,
          dateFormat1:
            proposal_start_date === "null" || proposal_start_date === null
              ? ""
              : proposal_start_date.split("-").reverse().join("-"),
          edate: proposal_end_date === "null" ? "" : proposal_end_date,
          userEmail: email,
          value: email,
          attachment_pre: proposal_attachment,
          name: proposal_names,

          matItems: mat === null ? null : mat.items,
          matTotal: mat === null ? 0 : mat.total,
          mat_template_name: mat === null ? "" : mat.template_name,
          mat_template_id: mat === null ? 0 : mat.id,
          workItems: work === null ? null : work.items,
          workTotal: work === null ? 0 : work.total,
          work_template_name: work === null ? "" : work.template_name,
          work_template_id: work === null ? 0 : work.id,

          proposal_status,
          proposal_client_type,
          proposal_tender_draft: 1,
          proposal_request_id_tender: proposal_request_id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setData = async (id) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/proposal/get/byID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const {
          proposal_tender_id,
          work,
          mat,
          proposal_client_type,
          // proposal_client_id,
          // proposal_user_id,
          // proposal_request_id,
          // proposal_pdf,
          proposal_attachment,
          emails,
          date,
          proposal_material_payment,
          proposal_other,
          proposal_work_payment,
          proposal_work_guarantee,
          proposal_insurance,
          proposal_due_date,
          proposal_start_date,
          proposal_end_date,
          proposal_status,
          email,
          proposal_names,
        } = result.data[0];

        this.setState({
          tender_id: proposal_tender_id,
          emails: emails ? emails.split(",") : [],
          date: date === "null" ? "" : date,
          // dateFormat:
          //   date === "null" ? "" : date.split("-").reverse().join("-"),
          mat_pay: proposal_material_payment,
          other: proposal_other,
          work_pay: proposal_work_payment,
          work:
            proposal_work_guarantee === "null" ? "" : proposal_work_guarantee,
          insurance: proposal_insurance === "null" ? "" : proposal_insurance,
          due_date: proposal_due_date === "null" ? "" : proposal_due_date,
          sdate: proposal_start_date === "null" ? "" : proposal_start_date,
          // dateFormat1:
          //   proposal_start_date === "null"
          //     ? ""
          //     : proposal_start_date.split("-").reverse().join("-"),
          edate: proposal_end_date === "null" ? "" : proposal_end_date,
          userEmail: email,
          value: email === 0 ? "" : email,
          attachment_pre: proposal_attachment,
          attachment: proposal_attachment,
          name: proposal_names,

          matItems: mat === null ? null : mat.items,
          matTotal: mat === null ? 0 : mat.total,
          mat_template_name: mat === null ? "" : mat.template_name,
          mat_template_id: mat === null ? 0 : mat.id,
          workItems: work === null ? null : work.items,
          workTotal: work === null ? 0 : work.total,
          work_template_name: work === null ? "" : work.template_name,
          work_template_id: work === null ? 0 : work.id,

          proposal_status,
          proposal_client_type,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getEmail = async (id) => {
    if (id > 0) {
      const token = await localStorage.getItem("token");
      axios
        .get(`${url}/api/usersp/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          if (result.data.length > 0) {
            this.setState({
              userEmail: result.data[0].email,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleworkItems = (items, total, type, name, id) => {
    console.log(name);
    if (type == "Material") {
      this.setState({
        matItems: items,
        matTotal: total,
        mat_template_name: name,
        mat_template_id: id,
      });
    }
    if (type == "Work") {
      this.setState({
        workItems: items,
        workTotal: total,
        work_template_name: name,
        work_template_id: id,
      });
    }
  };

  loadProposalID = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/proposal/get/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          if (
            Object.keys(result.data).length === 0 &&
            result.data.constructor === Object
          ) {
            this.setState({ proposal_id: 1 });
          } else {
            this.setState({ proposal_id: result.data.proposal_id + 1 });
          }
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

  loadResources = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/resources-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          result.data.data.map((res) => {
            var keys = ["value", "label"];
            var _key = {};
            keys.forEach((key, i) => (_key[key] = res.email));
            options.push(_key);
          });
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

  loadClient = async (axiosCancelSource) => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/resources-list/Client`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: axiosCancelSource.token,
      })
      .then((result) => {
        if (this._isMounted) {
          result.data.data.map((res) => {
            var keys = ["value", "label"];
            var _key = {};
            keys.forEach((key, i) => (_key[key] = res.email));
            clients.push(_key);
          });
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

  handleAuto = (e) => {
    this.setState({ value: e.target.value });
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

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested2 = () => {
    this.setState({
      suggestions2: [],
    });
  };

  handleBusinessInfo = (val) => {
    this.setState({ business_info: val });

    this.setState({
      work:
        this.props.match.params.draft !== undefined ||
        this.state.proposal_tender_draft === 1
          ? this.state.work
          : this.state.business_info.work,

      insurance:
        this.props.match.params.draft !== undefined ||
        this.state.proposal_tender_draft === 1
          ? this.state.insurance
          : this.state.business_info.insurance,
    });
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
  handleKeyDownCus = (evt) => {
    if (["Enter"].includes(evt.key)) {
      evt.preventDefault();
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
  handleChange5 = (event) => {
    this.setState({ edate: "" });
    this.setState({
      sdate: moment(event._d).format("DD-MM-YYYY"),
      dateFormat1: moment(event._d).format("YYYY-MM-DD"),
    });
  };
  handleChange6 = (event) => {
    this.setState({ edate: moment(event._d).format("DD-MM-YYYY") });
  };

  handleDraft = async (event) => {
    event.preventDefault();

    this.setState({
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      insurance_err: false,
      work_err: false,
      sdate_err: false,
      edate_err: false,
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

    // if (this.state.mat_pay == "" || this.state.mat_pay == "--Select--") {
    //   this.setState({ mat_pay_err: true });
    // }
    // if (this.state.work_pay == "" || this.state.work_pay == "--Select--") {
    //   this.setState({ work_pay_err: true });
    // }
    // if (this.state.date == "" || this.state.date == "--Select--") {
    //   this.setState({ date_err: true });
    // }
    // if (this.state.due_date == "" || this.state.due_date == "--Select--") {
    //   this.setState({ due_date_err: true });
    // }
    // if (this.state.insurance == "") {
    //   this.setState({ insurance_err: true });
    // }
    // if (this.state.work == "") {
    //   this.setState({ work_err: true });
    // }
    // if (this.state.sdate == "") {
    //   this.setState({ sdate_err: true });
    // }
    // if (this.state.edate == "") {
    //   this.setState({ edate_err: true });
    // }

    const token = await localStorage.getItem("token");
    this.setState({ loading_1: true });
    const data = new FormData();
    // data.set('logo', this.state.logo)
    data.set("proposal_request_id", this.requestInput.value);
    data.set("proposal_tender_id", this.state.tender_id);
    data.set("proposal_client_id", client_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("proposal_material_payment", this.state.mat_pay);
    data.set("proposal_other", this.state.other);
    data.set("proposal_work_payment", this.state.work_pay);
    data.set("proposal_work_guarantee", this.state.work);
    data.set("proposal_insurance", this.state.insurance);
    data.set("proposal_due_date", this.state.due_date);
    data.set("proposal_start_date", this.state.sdate);
    data.set("proposal_end_date", this.state.edate);
    data.set("sent", 0);
    data.set("proposal_client_type", this.state.proposal_client_type);
    data.set("work_template_id", this.state.work_template_id);
    data.set("mat_template_id", this.state.mat_template_id);
    data.set("proposal_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/proposal/draft`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          show_msg: true,
          loading_1: false,
          emails: [],
          date: "",
          mat_pay: "",
          other: "",
          work_pay: "",
          work: "",
          insurance: "",
          due_date: "",
          sdate: "",
          edate: "",
          proposal_client_type: 0,
          work_template_id: 0,
          mat_template_id: 0,
          workTotal: 0,
          matTotal: 0,
          matItems: null,
          workItems: null,
          name: "",
          attachment: null,
        });
        this.myRef.current.scrollTo(0, 0);
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response.data.error.proposal_names) {
            this.setState({
              name_unq: err.response.data.error.proposal_names[0],
            });
          }
        }
        if (err.response.status === 403) {
          this.setState({
            client_id_err: true,
            loading: false,
          });
        }
        this.setState({ loading_1: false });
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

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("proposal_request_id", this.requestInput.value);
    data.set("proposal_tender_id", this.state.tender_id);
    data.set("proposal_client_id", client_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("proposal_material_payment", this.state.mat_pay);
    data.set("proposal_other", this.state.other);
    data.set("proposal_work_payment", this.state.work_pay);
    data.set("proposal_work_guarantee", this.state.work);
    data.set("proposal_insurance", this.state.insurance);
    data.set("proposal_due_date", this.state.due_date);
    data.set("proposal_start_date", this.state.sdate);
    data.set("proposal_end_date", this.state.edate);
    data.set("proposal_client_type", this.state.proposal_client_type);
    data.set("work_template_id", this.state.work_template_id);
    data.set("mat_template_id", this.state.mat_template_id);
    data.set("proposal_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/proposal/put`, data, {
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

  handleSubmit = async (e, event) => {
    e.preventDefault();
    if (this.state.matItems === null || this.state.workItems === null) {
      return alert("Please select templates before submission");
    }

    this.setState({
      mat_pay_err: false,
      work_pay_err: false,
      date_err: false,
      due_date_err: false,
      insurance_err: false,
      work_err: false,
      sdate_err: false,
      edate_err: false,
      name_err: false,
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

    if (this.state.date == "" || this.state.date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ date_err: true });
    }
    if (this.state.due_date == "" || this.state.due_date == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ due_date_err: true });
    }

    if (
      this.state.mat_pay === "" ||
      this.state.mat_pay === "--Select--" ||
      this.state.mat_pay === "null"
    ) {
      this.myRefMat.current.scrollIntoView();
      return this.setState({ mat_pay_err: true });
    }
    if (
      this.state.work_pay === "" ||
      this.state.work_pay === "--Select--" ||
      this.state.work_pay === "null"
    ) {
      this.myRefMat.current.scrollIntoView();
      return this.setState({ work_pay_err: true });
    }

    if (this.state.insurance === "" || this.state.insurance === "null") {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ insurance_err: true });
    }
    if (this.state.work === "" || this.state.work === "null") {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ work_err: true });
    }
    if (this.state.sdate == "" || this.state.sdate == null) {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ sdate_err: true });
    }
    if (this.state.edate == "" || this.state.edate == null) {
      this.myRefDet.current.scrollIntoView(0, 0);
      return this.setState({ edate_err: true });
    }

    if (this.state.name == null) {
      this.myRef.current.scrollTo(0, 0);
      return this.setState({ name_err: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("proposal_request_id", this.requestInput.value);
    data.set("proposal_tender_id", this.state.tender_id);
    data.set("proposal_client_id", client_id);
    data.set("emails", this.state.emails);
    data.set("date", this.state.date);
    data.set("proposal_material_payment", this.state.mat_pay);
    data.set("proposal_other", this.state.other);
    data.set("proposal_work_payment", this.state.work_pay);
    data.set("proposal_work_guarantee", this.state.work);
    data.set("proposal_insurance", this.state.insurance);
    data.set("proposal_due_date", this.state.due_date);
    data.set("proposal_start_date", this.state.sdate);
    data.set("proposal_end_date", this.state.edate);
    data.set("sent", event);
    data.set("proposal_client_type", this.state.proposal_client_type);
    data.set("work_template_id", this.state.work_template_id);
    data.set("mat_template_id", this.state.mat_template_id);
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
    data.set("workTotal", this.state.workTotal);
    data.set("matTotal", this.state.matTotal);
    data.set(
      "matItems",
      JSON.parse(this.state.matItems).map((item) => item.items)
    );
    data.set(
      "workItems",
      JSON.parse(this.state.workItems).map((item) => item.items)
    );
    data.set("proposal_names", this.state.name);
    data.append("attachment", this.state.attachment);
    axios
      .post(`${url}/api/proposal/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          show_msg: true,
          loading: false,
          emails: [],
          date: "",
          mat_pay: "",
          other: "",
          work_pay: "",
          work: "",
          insurance: "",
          due_date: "",
          sdate: "",
          edate: "",
          proposal_client_type: 0,
          work_template_id: 0,
          mat_template_id: 0,
          workTotal: 0,
          matTotal: 0,
          matItems: null,
          workItems: null,
          name: "",
          attachment: null,
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/proposal-listing");
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        if (err.response.status === 406) {
          if (err.response.data.error.proposal_names) {
            this.setState({
              name_unq: err.response.data.error.proposal_names[0],
            });
          }
          if (err.response.data.error.proposal_client_id) {
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

  hiddenFields = (event) => {
    event.preventDefault();
    let client_id =
      this.state.value === "" ? this.state.userEmail : this.state.value;
    this.setState({ client_id });
  };

  render() {
    const { t, i18n } = this.props;

    var yesterday = moment().subtract(1, "day");
    function valid(current) {
      return current.isAfter(yesterday);
    }

    var date = this.state.date ? moment(this.state.dateFormat) : null;

    console.log(this.state.date);
    function valid2(current) {
      return current.isAfter(date);
    }
    var date1 = this.state.sdate ? moment(this.state.dateFormat1) : null;
    function valid4(current) {
      return current.isAfter(date1);
    }

    const userInfo = {
      client_id: this.state.client_id,
      proposal_id: this.state.proposal_id,
      date: this.state.date,
      due_date: this.state.due_date,
      workTotal: this.state.workTotal,
      matTotal: this.state.matTotal,
      mat_pay: this.state.mat_pay,
      work_pay: this.state.work_pay,
      matItems: this.state.matItems,
      workItems: this.state.workItems,
      work: this.state.work,
      insurance: this.state.insurance,
      start_date: this.state.sdate,
      end_date: this.state.edate,
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
          {t("success.prop_ins")}
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

    const { selectedOption } = this.state;
    let req_id =
      this.props.match.params.draft === "update"
        ? this.props.match.params.tender
        : this.state.proposal_tender_draft === 1
        ? this.state.proposal_request_id_tender
        : `${this.state.business_info.user_id}${this.state.proposal_id}`;

    const { value, email, suggestions, suggestions2 } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Email id or name of client",
      value,
      className: "form-control",
      onChange: this.onChange,
      onKeyDown: this.handleKeyDownCus,
    };
    const inputPropsDate = {
      onKeyDown: this.handleKeyDownCus,
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
                    className="btn btn-gray mb-md-0 mb-3 mr-4"
                    data-toggle="modal"
                    data-target="#preview-info"
                  >
                    Preview Proposal
                  </button>

                  {this.props.match.params.draft !== undefined ||
                  this.state.proposal_tender_draft === 1 ? (
                    <button
                      onClick={this.handleUpdate}
                      class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                    >
                      Update as a draft
                    </button>
                  ) : loading ? (
                    loading
                  ) : (
                    <button
                      onClick={this.handleDraft}
                      class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                    >
                      Save as a draft
                    </button>
                  )}

                  <button
                    onClick={(e) => this.handleSubmit(e, 1)}
                    className="btn btn-sm btn-primary mb-3 mb-sm-0"
                  >
                    Submit & Send
                  </button>
                </div>
              </div>
              <div className="card" style={{ maxWidth: "1120px" }}>
                <div className="card-body">
                  <form>
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
                      <div className="col-lg-5 col-md-6">
                        <div className="form-group">
                          <div className="file-select file-sel inline">
                            <label
                              for="attachment1sdsd"
                              style={{ width: "70%" }}
                            >
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
                          <label for="request-id">
                            {t("myproposal.req_id")}
                          </label>

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
                            inputProps={inputPropsDate}
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
                          <label for="due-date">
                            {t("myproposal.due_date")}
                          </label>
                          <Datetime
                            onChange={(date) => this.handleChange4(date)}
                            isValidDate={valid2}
                            inputProps={inputPropsDate}
                            name="due_date"
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
                    <div className="mt-5"></div>
                    <div className="row">
                      <div className="col-lg-5 col-md-6">
                        <h2 className="head2 mb-5">
                          {t("myproposal.proposal_summary")}
                        </h2>
                        <div className="form-group">
                          <label>Total cost for bid</label>
                          <div className="form-detail">
                            <div className="row">
                              <div className="col">
                                <p>{t("myproposal.work_total")}</p>
                              </div>
                              <div className="col">
                                <p>
                                  {this.state.left} {this.state.workTotal}{" "}
                                  {this.state.right}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p>{t("myproposal.material_total")}</p>
                              </div>
                              <div className="col">
                                <p>
                                  {this.state.left} {this.state.matTotal}{" "}
                                  {this.state.right}
                                </p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col">
                                <p>Total cost</p>
                              </div>
                              <div className="col">
                                <p>
                                  {this.state.left}{" "}
                                  {Number(this.state.workTotal) +
                                    Number(this.state.matTotal)}{" "}
                                  {this.state.right}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div ref={this.myRefMat} className="form-group">
                          <label for="m-payment">
                            {t("myproposal.mat_pay")}
                          </label>
                          <select
                            value={this.state.mat_pay}
                            onChange={this.handleChange2}
                            name="mat_pay"
                            id="m-payment"
                            className="form-control"
                          >
                            <option>--Select--</option>
                            <option>Payment aftre total delivery</option>
                            <option>payment after project done</option>
                            <option>As per inovice</option>
                            <option value="other">Custom message</option>
                          </select>
                          <p style={{ color: "#eb516d " }}>
                            {this.state.mat_pay_err === true
                              ? "payment is required"
                              : null}
                          </p>
                        </div>
                        <div
                          className="form-group"
                          id="custom-message"
                          style={{ display: "none" }}
                        >
                          <textarea
                            className="form-control"
                            onChange={this.handleChange2}
                            name="other"
                            value={this.state.other}
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
                            <option>--Select--</option>
                            <option>Payment aftre work</option>
                            <option>Payment aftre work</option>
                            <option>Payment aftre work</option>
                            <option>Pay hourly</option>
                          </select>
                          <p style={{ color: "#eb516d " }}>
                            {this.state.work_pay_err === true
                              ? "payment is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-6">
                        <h2 className="head2 mb-5">
                          {t("myproposal.project_plan")}
                        </h2>
                        <div className="form-group">
                          <div className="plan-list">
                            <div className="row gutters-24">
                              {this.state.workItems === null ? (
                                <div className="col-lg-6">
                                  <button
                                    className="btn btn-light add-plan"
                                    data-toggle="modal"
                                    data-target="#add-plan"
                                    onClick={(e) =>
                                      this.setState(
                                        { type: "Work" },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    {t("myproposal.work_cost")}
                                  </button>
                                </div>
                              ) : null}

                              {this.state.matItems === null ? (
                                <div className="col-lg-6">
                                  <button
                                    className="btn btn-light add-plan"
                                    data-toggle="modal"
                                    data-target="#add-plan"
                                    onClick={(e) =>
                                      this.setState(
                                        { type: "Material" },
                                        e.preventDefault()
                                      )
                                    }
                                  >
                                    {t("myproposal.mat_cost")}
                                  </button>
                                </div>
                              ) : null}
                            </div>
                            <h3>
                              {t("feeds.search.work")}

                              {this.state.workItems === null ? null : (
                                <span
                                  className="edit-plan"
                                  data-toggle="modal"
                                  data-target="#add-plan"
                                  onClick={() =>
                                    this.setState({
                                      template_name: this.state
                                        .work_template_name,
                                      type: "Work",
                                    })
                                  }
                                >
                                  <i className="icon-edit"></i>
                                </span>
                              )}
                            </h3>

                            <ul>
                              {this.state.workItems === null
                                ? null
                                : JSON.parse(
                                    this.state.workItems
                                  ).map((item) => <li>{item.items}</li>)}
                            </ul>
                            <h3>
                              {t("feeds.search.material")}
                              {this.state.matItems === null ? null : (
                                <span
                                  className="edit-plan"
                                  data-toggle="modal"
                                  data-target="#add-plan"
                                  onClick={() =>
                                    this.setState({
                                      template_name: this.state
                                        .mat_template_name,
                                      type: "Material",
                                    })
                                  }
                                >
                                  <i className="icon-edit"></i>
                                </span>
                              )}
                            </h3>
                            <ul>
                              {this.state.matItems === null
                                ? null
                                : JSON.parse(
                                    this.state.matItems
                                  ).map((item) => <li>{item.items}</li>)}
                            </ul>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5"></div>
                    <div ref={this.myRefDet} className="row">
                      <div className="col-xl-12">
                        <h2 className="head2">
                          {t("myproposal.proposal_details")}
                        </h2>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="form-group">
                          <label for="work">
                            {t("myproposal.guarantees_for_work")}
                          </label>
                          <textarea
                            maxLength="162"
                            id="work"
                            onChange={this.handleChange2}
                            name="work"
                            value={this.state.work}
                            className="form-control"
                          ></textarea>
                          <p style={{ color: "#eb516d " }}>
                            {this.state.work_err === true
                              ? "Work is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6 offset-xl-1">
                        <div className="form-group">
                          <label for="insurance">
                            {t("myproposal.insurance")}
                          </label>
                          <textarea
                            maxLength="162"
                            id="insurance"
                            onChange={this.handleChange2}
                            name="insurance"
                            value={this.state.insurance}
                            className="form-control"
                          ></textarea>
                          <p style={{ color: "#eb516d " }}>
                            {this.state.insurance_err === true
                              ? "Insurance is required"
                              : null}
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-5 col-md-6">
                        <div className="row">
                          <div className="form-group col">
                            <label for="sdate">
                              {t("c_material_list.listing.start_date")}
                            </label>
                            <Datetime
                              onChange={(date) => this.handleChange5(date)}
                              isValidDate={valid}
                              inputProps={inputPropsDate}
                              id="sdate"
                              name="sdate"
                              dateFormat="DD-MM-YYYY"
                              timeFormat={false}
                              value={this.state.sdate}
                            />
                            <p style={{ color: "#eb516d " }}>
                              {this.state.sdate_err === true
                                ? "Start date is required"
                                : null}
                            </p>
                          </div>
                          <div className="form-group">
                            <label>&nbsp;</label>
                            <p className="saprator">to</p>
                          </div>
                          <div className="form-group col">
                            <label for="edate">
                              {t("c_material_list.listing.end_date")}
                            </label>
                            <Datetime
                              onChange={(date) => this.handleChange6(date)}
                              isValidDate={valid4}
                              inputProps={inputPropsDate}
                              id="edate"
                              name="edate"
                              dateFormat="DD-MM-YYYY"
                              timeFormat={false}
                              value={this.state.edate}
                            />
                            <p style={{ color: "#eb516d " }}>
                              {this.state.edate_err === true
                                ? "End date is required"
                                : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-9 col-lg-10">
                        <div className="form-group">
                          <label for="issues">
                            {t("c_material_list.request.attachment")}
                          </label>

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
                                  "/images/marketplace/proposal/" +
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
                        </div>
                      </div>
                    </div>

                    <div className="mt-5"></div>
                    <div className="row">
                      <div className="col-12">
                        <button
                          onClick={this.hiddenFields}
                          className="btn btn-gray mb-md-0 mb-3 mr-4"
                          data-toggle="modal"
                          data-target="#preview-info"
                        >
                          Preview Proposal
                        </button>

                        {this.props.match.params.draft !== undefined ||
                        this.state.proposal_tender_draft === 1 ? (
                          <button
                            onClick={this.handleUpdate}
                            class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                          >
                            Update as a draft
                          </button>
                        ) : loading_1 ? (
                          loading_1
                        ) : (
                          <button
                            onClick={this.handleDraft}
                            class="btn btn-sm btn-gray mr-3 mb-3 mb-sm-0"
                          >
                            Save as a draft
                          </button>
                        )}

                        {loading ? (
                          loading
                        ) : (
                          <button
                            onClick={(e) => this.handleSubmit(e, 1)}
                            className="btn btn-sm btn-primary mb-3 mr-4 mb-sm-0"
                          >
                            Submit & Send
                          </button>
                        )}
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </form>
                </div>
              </div>
            </div>

            <BusinessInfo onInfo={this.handleBusinessInfo} />
            <AddCustomer addCus={this.addCustomer} />
            <ProjectPlanProposal
              onSelectWorkTemplate={this.handleworkItems}
              tempName={this.state.template_name}
              onType={this.state.type}
              left={this.state.left}
              right={this.state.right}
            />

            <PDFView
              businessInfo={this.state.business_info}
              userInfo={userInfo}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(BusinessPropsalCreate);
