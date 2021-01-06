import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import File from "../../images/file-icon.png";
import { Helper, url } from "../../helper/helper";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import Datetime from "react-datetime";
import moment from "moment";
import { withTranslation } from "react-i18next";

class Createworklist extends Component {
  fileObj = [];
  fileArray = [];
  files = [];

  fileObj1 = [];
  fileArray1 = [];
  files1 = [];

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.loadState = this.loadState.bind(this);
    this.loadState1 = this.loadState1.bind(this);
    this.loadConfig = this.loadConfig.bind(this);

    this.state = {
      title: "",
      title_err: false,
      title1: "",
      title_err1: false,
      categoryId: "",
      categoryId_err: false,
      categoryId1: "",
      categoryId_err1: false,
      productcat: [],
      cities: [],
      cities1: [],
      states: [],
      states1: [],
      budget: "",
      budget_err: false,
      budget1: "",
      budget_err1: false,
      rate: "",
      rate_err: false,
      rate1: "",
      rate_err1: false,
      available_from: "",
      available_to: "",
      available_from_err: false,
      available_to_err: false,
      available_from1: "",
      available_to1: "",
      available_from_err1: false,
      available_to_err1: false,
      city: "",
      city_err: false,
      city1: "",
      state: "",
      state1: "",
      city_err1: false,
      pincode: "",
      pincode_err: false,
      pincode1: "",
      pincode_err1: false,
      post_expiry_date: moment(),
      upd_post_expiry_date: "",
      post_expiry_date_err: false,
      post_expiry_date1: moment(),
      upd_post_expiry_date1: "",
      post_expiry_date_err1: false,
      description: "",
      description_err: false,
      description1: "",
      description_err1: false,
      featured_image: null,
      attachment: null,
      slider_image: [],
      featured_image1: null,
      attachment1: null,
      slider_image1: [],
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      featured_image_err1: false,
      attachment_err1: false,
      slider_image_err1: false,
      checked: false,
      mat_checked: 0,
      attachment_preview: null,
      attachment_preview1: null,
      attachment_P: null,
      slider_image_preview: [null],
      slider_image_preview1: [null],
      errors: [],
      show_errors: false,
      show_msg: false,
      loading: false,
      loaded: 0,
      loaded1: 0,
      loaded2: 0,
      configs: [],
      datepicker_date_format: "",
      datepicker_time_format: "",

      tender_type: "Request",
    };
    this.myRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.loadData();
    }
    this.loadCategory();
    this.loadState();
    this.loadState1();
    this.loadConfig();
  };

  loadData = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/material-offer-detail/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const { data } = result;
        if (data[0].tender_type === "Request") {
          this.setState({
            title: data[0].tender_title,
            categoryId: data[0].tender_category_id,
            quantity: data[0].tender_quantity,
            budget: data[0].tender_budget,
            rate: data[0].tender_rate,
            available_from: data[0].tender_available_from,
            available_to: data[0].tender_available_to,
            description: data[0].tender_description,
            unit: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            pincode: data[0].tender_pincode,
            mat_checked: data[0].extra, // extra
            post_expiry_date: moment(data[0].tender_expiry_date).format(
              "DD-MM-YYYY HH:mm:ss"
            ),
            upd_post_expiry_date: data[0].tender_expiry_date,
            featured_image: data[0].tender_featured_image,
            attachment: data[0].tender_attachment,
            attachment_preview: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,
            tender_type: data[0].tender_type,
          });
          this.setState(
            {
              slider_image: data[0].tender_slider_images,
            },
            () => {
              const vals =
                url +
                "/images/marketplace/material/" +
                Object.values(this.state.slider_image);
              this.fileArray = [vals];
            }
          );

          this.ChangeCityByStateID(this.state.state);
        }
        if (data[0].tender_type === "Offer") {
          this.setState({
            title1: data[0].tender_title,
            categoryId1: data[0].tender_category_id,
            quantity1: data[0].tender_quantity,
            budget1: data[0].tender_budget,
            available_from1: data[0].tender_available_from,
            available_to1: data[0].tender_available_to,
            description1: data[0].tender_description,
            unit1: data[0].tender_unit,
            city1: data[0].tender_city_id,
            state1: data[0].city_state_id,
            cost_per_unit1: data[0].tender_cost_per_unit,
            pincode1: data[0].tender_pincode,
            row_phase: data[0].tender_delivery_type_cost,
            mat_checked: data[0].extra,
            post_expiry_date1: moment(data[0].tender_expiry_date).format(
              "DD-MM-YYYY HH:mm:ss"
            ),
            upd_post_expiry_date1: data[0].tender_expiry_date,

            featured_image1: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,

            attachment_preview1: data[0].tender_featured_image,
            warranty1: data[0].tender_warranty,
            attachment1: data[0].tender_attachment,
            tender_type: data[0].tender_type,
          });
          this.setState(
            {
              slider_image1: data[0].tender_slider_images,
            },
            () => {
              const vals =
                url +
                "/images/marketplace/material/" +
                Object.values(this.state.slider_image1);
              this.fileArray1 = [vals];
            }
          );
          this.ChangeCityByStateID(this.state.state1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ChangeCityByStateID = (state) => {
    this.setState({ cities: [], cities1: [] });
    const token = localStorage.getItem("token");
    let lang = localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/cityId/${state}/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ cities: result.data.data, cities1: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  loadState = async () => {
    const token = await localStorage.getItem("token");
    let lang = await localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/state/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ states: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  loadState1 = async () => {
    const token = await localStorage.getItem("token");
    let lang = await localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/state/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ states1: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  removeImg1 = (event) => {
    event.preventDefault();
    this.fileArray1 = [];
    this.setState({ slider_image1: [], loaded2: 0 });
  };

  loadConfig = async () => {
    const token = await localStorage.getItem("token");
    await axios
      .get(`${url}/api/config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ configs: result.data.data });
        if (this.state.configs) {
          this.state.configs.map((config) => {
            if (config.configuration_name == "datepicker_date_format") {
              this.setState({
                datepicker_date_format: config.configuration_val,
              });
            }
            if (config.configuration_name == "datepicker_time_format") {
              this.setState({
                datepicker_time_format: config.configuration_val,
              });
            }
          });
        }
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
        console.log(result.data.data);
        this.setState({ productcat: result.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadCities = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/city`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.data);
        this.setState({ cities: result.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removeImg = (event) => {
    event.preventDefault();
    this.fileArray = [];
    this.setState({ slider_image: [], loaded2: 0 });
  };

  handleState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleChange1 = (event) => {
    this.setState({ title: event.target.value });
  };
  handleChange2 = (event) => {
    this.setState({ categoryId: event.target.value });
  };
  handleChange_2 = (event) => {
    this.setState({ categoryId1: event.target.value });
  };
  handleChange3 = (event) => {
    this.setState({ budget: event.target.value });
  };
  handleChange4 = (event) => {
    this.setState({ rate: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ available_to: "" });
    this.setState({ available_from: moment(event._d).format("YYYY-MM-DD") });
  };
  handleChange_5 = (event) => {
    this.setState({ available_to1: "" });
    this.setState({ available_from1: moment(event._d).format("YYYY-MM-DD") });
  };
  handleChange6 = (event) => {
    this.setState({ available_to: moment(event._d).format("YYYY-MM-DD") });
  };
  handleChange_6 = (event) => {
    this.setState({ available_to1: moment(event._d).format("YYYY-MM-DD") });
  };
  handleChange7 = (event) => {
    this.setState({ city: event.target.value });
  };
  handleChange_7 = (event) => {
    this.setState({ city1: event.target.value });
  };
  ChangeCity = (event) => {
    this.setState({ cities: [], state: event.target.value });
    const token = localStorage.getItem("token");
    let lang = localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/cityId/${event.target.value}/${lang}`, {
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
  ChangeCity1 = (event) => {
    this.setState({ cities1: [], state1: event.target.value });
    const token = localStorage.getItem("token");
    let lang = localStorage.getItem("i18nextLng");
    axios
      .get(`${url}/api/cityId/${event.target.value}/${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ cities1: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  handleChange8 = (event) => {
    this.setState({ pincode: event.target.value });
  };
  handleChange9 = (event) => {
    this.setState({
      post_expiry_date: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange_9 = (event) => {
    this.setState({
      post_expiry_date1: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange10 = (event) => {
    this.setState({ description: event.target.value });
  };
  handleChange11 = (event) => {
    if (event.target.files[0]) {
      this.setState({ featured_image: null });
      if (
        event.target.files[0].name.split(".").pop() == "jpeg" ||
        event.target.files[0].name.split(".").pop() == "png" ||
        event.target.files[0].name.split(".").pop() == "jpg" ||
        event.target.files[0].name.split(".").pop() == "gif" ||
        event.target.files[0].name.split(".").pop() == "svg"
      ) {
        this.setState({
          featured_image: event.target.files[0],
          loaded: 50,
          featured_image_err: false,
          attachment_preview: URL.createObjectURL(event.target.files[0]),
        });
        if (this.state.loaded <= 100) {
          setTimeout(
            function () {
              this.setState({ loaded: 100 });
            }.bind(this),
            2000
          ); // wait 2 seconds, then reset to false
        }
      } else {
        this.setState({ featured_image_err: true, featured_image: null });
        alert("File type not supported");
      }
    } else {
      this.setState({
        featured_image: null,
        loaded: 0,
        featured_image_err: true,
        attachment_preview: null,
      });
    }
  };

  handleChange_11 = (event) => {
    if (event.target.files[0]) {
      this.setState({ featured_image1: null });
      if (
        event.target.files[0].name.split(".").pop() == "jpeg" ||
        event.target.files[0].name.split(".").pop() == "png" ||
        event.target.files[0].name.split(".").pop() == "jpg" ||
        event.target.files[0].name.split(".").pop() == "gif" ||
        event.target.files[0].name.split(".").pop() == "svg"
      ) {
        this.setState({
          featured_image1: event.target.files[0],
          loaded: 50,
          featured_image_err1: false,
          attachment_preview1: URL.createObjectURL(event.target.files[0]),
        });
        if (this.state.loaded <= 100) {
          setTimeout(
            function () {
              this.setState({ loaded: 100 });
            }.bind(this),
            2000
          ); // wait 2 seconds, then reset to false
        }
      } else {
        this.setState({ featured_image_err1: true, featured_image1: null });
        alert("File type not supported");
      }
    } else {
      this.setState({
        featured_image1: null,
        loaded: 0,
        featured_image_err1: true,
        attachment_preview1: null,
      });
    }
  };
  handleChange12 = (event) => {
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
      this.setState({
        attachment: event.target.files[0],
        loaded1: 50,
        attachment_err: false,
      });
      if (this.state.loaded1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({ attachment_err: true, attachment: null });
      return alert("File type not supported");
    }
  };
  handleChange_12 = (event) => {
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
      this.setState({
        attachment1: event.target.files[0],
        loaded1: 50,
        attachment_err1: false,
      });
      if (this.state.loaded1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({ attachment_err1: true, attachment1: null });
      return alert("File type not supported");
    }
  };
  handleChange13 = (event) => {
    if (event.target.files.length > 0) {
      this.files = [];
      Array.from(event.target.files).forEach((file) => {
        if (
          file.name.split(".").pop() == "jpeg" ||
          file.name.split(".").pop() == "png" ||
          file.name.split(".").pop() == "jpg" ||
          file.name.split(".").pop() == "gif" ||
          file.name.split(".").pop() == "svg"
        ) {
          this.files.push(file);
        }
      });
      this.fileObj = [];
      this.fileArray = [];
      this.fileObj.push(this.files);
      for (let i = 0; i < this.fileObj[0].length; i++) {
        this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
      }
      this.setState({
        slider_image: this.files,
        loaded2: 50,
        slider_image_err: false,
        slider_image_preview: this.fileArray,
      });
      if (this.state.loaded2 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded2: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({
        slider_image: [],
        loaded2: 0,
        slider_image_err: true,
        slider_image_preview: null,
      });
    }
  };
  handleChange_13 = (event) => {
    if (event.target.files.length > 0) {
      this.files1 = [];
      Array.from(event.target.files).forEach((file) => {
        if (
          file.name.split(".").pop() == "jpeg" ||
          file.name.split(".").pop() == "png" ||
          file.name.split(".").pop() == "jpg" ||
          file.name.split(".").pop() == "gif" ||
          file.name.split(".").pop() == "svg"
        ) {
          this.files1.push(file);
        }
      });
      this.fileObj1 = [];
      this.fileArray1 = [];
      this.fileObj1.push(this.files1);
      for (let i = 0; i < this.fileObj1[0].length; i++) {
        this.fileArray1.push(URL.createObjectURL(this.fileObj1[0][i]));
      }
      this.setState({
        slider_image1: this.files1,
        loaded2: 50,
        slider_image_err1: false,
        slider_image_preview1: this.fileArray1,
      });
      if (this.state.loaded2 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded2: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({
        slider_image1: [],
        loaded2: 0,
        slider_image_err1: true,
        slider_image_preview1: null,
      });
    }
  };

  handleCheck = (event) => {
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ mat_checked: 1 });
      } else {
        this.setState({ mat_checked: 0 });
      }
    });
  };

  // work request
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      title_err: false,
      categoryId_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      budget_err: false,
      rate_err: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err: false,
      available_to_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.categoryId == "--Select--" || this.state.categoryId == "") {
      this.setState({ categoryId_err: true });
    }
    if (this.state.pincode.length <= 0) {
      this.setState({ pincode_err: true });
    }
    if (
      this.state.post_expiry_date == "" ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    if (this.state.rate.length <= 0) {
      this.setState({ rate_err: true });
    }
    if (this.state.available_from.length <= 0) {
      this.setState({ available_from_err: true });
    }
    if (this.state.available_to.length <= 0) {
      this.setState({ available_to_err: true });
    }
    if (this.state.budget == "--Select--" || this.state.budget == "") {
      this.setState({ budget_err: true });
    }
    if (this.state.city == "--Select--" || this.state.city == "") {
      this.setState({ city_err: true });
    }
    if (this.state.featured_image == null) {
      this.setState({ featured_image_err: true });
    }
    if (this.state.attachment == null) {
      this.setState({ attachment_err: true });
    }
    if (this.state.slider_image.length <= 0) {
      this.setState({ slider_image_err: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title);
    data.set("categoryId", this.state.categoryId);
    data.set("budget", this.state.budget);
    data.set("rate", this.state.rate);
    data.set("available_from", this.state.available_from);
    data.set("available_to", this.state.available_to);
    data.set("city", this.state.city);
    data.set("pincode", this.state.pincode);
    data.set("extra", this.state.mat_checked);
    data.set("post_expiry_date", this.state.post_expiry_date);
    data.set("description", this.state.description);
    data.append("featured_image", this.state.featured_image);
    data.append("attachment", this.state.attachment);
    for (const key of Object.keys(this.state.slider_image)) {
      data.append("slider_image[]", this.state.slider_image[key]);
    }

    axios
      .post(`${url}/api/work-request/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          show_msg: true,
          loading: false,
          title: "",
          categoryId: "",
          budget: "",
          rate: "",
          available_from: "",
          available_to: "",
          city: "",
          pincode: "",
          post_expiry_date: "",
          description: "",
          loaded: 0,
          loaded1: 0,
          loaded2: 0,
          featured_image: null,
          attachment_preview: null,
          attachment: null,
          slider_image: [],
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/work-list");
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
  };
  handleUpdate = async (event) => {
    event.preventDefault();
    this.setState({
      title_err: false,
      categoryId_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      budget_err: false,
      rate_err: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err: false,
      available_to_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.categoryId == "--Select--" || this.state.categoryId == "") {
      this.setState({ categoryId_err: true });
    }
    if (this.state.pincode.length <= 0) {
      this.setState({ pincode_err: true });
    }
    if (
      this.state.post_expiry_date == "" ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    if (this.state.rate.length <= 0) {
      this.setState({ rate_err: true });
    }
    if (this.state.available_from.length <= 0) {
      this.setState({ available_from_err: true });
    }
    if (this.state.available_to.length <= 0) {
      this.setState({ available_to_err: true });
    }
    if (this.state.budget == "--Select--" || this.state.budget == "") {
      this.setState({ budget_err: true });
    }
    if (this.state.city == "--Select--" || this.state.city == "") {
      this.setState({ city_err: true });
    }
    if (this.state.featured_image == null) {
      this.setState({ featured_image_err: true });
    }
    if (this.state.attachment == null) {
      this.setState({ attachment_err: true });
    }
    if (this.state.slider_image.length <= 0) {
      this.setState({ slider_image_err: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title);
    data.set("categoryId", this.state.categoryId);
    data.set("budget", this.state.budget);
    data.set("rate", this.state.rate);
    data.set("available_from", this.state.available_from);
    data.set("available_to", this.state.available_to);
    data.set("city", this.state.city);
    data.set("pincode", this.state.pincode);
    data.set("extra", this.state.mat_checked);
    data.set("post_expiry_date", moment(this.state.upd_post_expiry_date));
    data.set("description", this.state.description);
    data.append("featured_image", this.state.featured_image);
    data.append("attachment", this.state.attachment);
    for (const key of Object.keys(this.state.slider_image)) {
      data.append("slider_image[]", this.state.slider_image[key]);
    }

    axios
      .post(
        `${url}/api/work-request/update/${this.props.match.params.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/work-list");
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  // work offer
  handleSubmit1 = async (event) => {
    event.preventDefault();
    this.setState({
      title_err1: false,
      categoryId_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      budget_err1: false,
      rate_err1: false,
      city_err1: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err1: false,
      available_to_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (
      this.state.categoryId1 == "--Select--" ||
      this.state.categoryId1 == ""
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.pincode1.length <= 0) {
      this.setState({ pincode_err1: true });
    }
    if (
      this.state.post_expiry_date1 == "" ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (this.state.rate1.length <= 0) {
      this.setState({ rate_err1: true });
    }
    if (this.state.available_from1.length <= 0) {
      this.setState({ available_from_err1: true });
    }
    if (this.state.available_to1.length <= 0) {
      this.setState({ available_to_err1: true });
    }
    if (this.state.budget1 == "--Select--" || this.state.budget1 == "") {
      this.setState({ budget_err1: true });
    }
    if (this.state.city1 == "--Select--" || this.state.city1 == "") {
      this.setState({ city_err1: true });
    }
    if (this.state.featured_image1 == null) {
      this.setState({ featured_image_err1: true });
    }
    if (this.state.attachment1 == null) {
      this.setState({ attachment_err1: true });
    }
    if (this.state.slider_image1.length <= 0) {
      this.setState({ slider_image_err1: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title1);
    data.set("categoryId", this.state.categoryId1);
    data.set("budget", this.state.budget1);
    data.set("rate", this.state.rate1);
    data.set("available_from", this.state.available_from1);
    data.set("available_to", this.state.available_to1);
    data.set("city", this.state.city1);
    data.set("pincode", this.state.pincode1);
    data.set("extra", this.state.mat_checked);
    data.set("post_expiry_date", this.state.post_expiry_date1);
    data.set("description", this.state.description1);
    data.append("featured_image", this.state.featured_image1);
    data.append("attachment", this.state.attachment1);
    for (const key of Object.keys(this.state.slider_image1)) {
      data.append("slider_image[]", this.state.slider_image1[key]);
    }

    axios
      .post(`${url}/api/work-offers/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          show_msg: true,
          loading: false,
          title1: "",
          categoryId1: "",
          budget1: "",
          rate1: "",
          available_from1: "",
          available_to1: "",
          city1: "",
          pincode1: "",
          post_expiry_date1: "",
          description1: "",
          loaded_: 0,
          loaded_1: 0,
          loaded_2: 0,
          featured_image1: null,
          attachment_preview1: null,
          attachment1: null,
          slider_image1: [],
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/work-list");
      })
      .catch((err) => {
        console.log(err.response.data);
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };
  handleUpdate1 = async (event) => {
    event.preventDefault();
    this.setState({
      title_err1: false,
      categoryId_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      budget_err1: false,
      rate_err1: false,
      city_err1: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      available_from_err1: false,
      available_to_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (
      this.state.categoryId1 == "--Select--" ||
      this.state.categoryId1 == ""
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.pincode1.length <= 0) {
      this.setState({ pincode_err1: true });
    }
    if (
      this.state.post_expiry_date1 == "" ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (this.state.rate1.length <= 0) {
      this.setState({ rate_err1: true });
    }
    if (this.state.available_from1.length <= 0) {
      this.setState({ available_from_err1: true });
    }
    if (this.state.available_to1.length <= 0) {
      this.setState({ available_to_err1: true });
    }
    if (this.state.budget1 == "--Select--" || this.state.budget1 == "") {
      this.setState({ budget_err1: true });
    }
    if (this.state.city1 == "--Select--" || this.state.city1 == "") {
      this.setState({ city_err1: true });
    }
    if (this.state.featured_image1 == null) {
      this.setState({ featured_image_err1: true });
    }
    if (this.state.attachment1 == null) {
      this.setState({ attachment_err1: true });
    }
    if (this.state.slider_image1.length <= 0) {
      this.setState({ slider_image_err1: true });
    }

    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title1);
    data.set("categoryId", this.state.categoryId1);
    data.set("budget", this.state.budget1);
    data.set("available_from", this.state.available_from1);
    data.set("available_to", this.state.available_to1);
    data.set("city", this.state.city1);
    data.set("pincode", this.state.pincode1);
    data.set("extra", this.state.mat_checked);
    data.set("post_expiry_date", moment(this.state.upd_post_expiry_date));
    data.set("description", this.state.description1);
    data.append("featured_image", this.state.featured_image1);
    data.append("attachment", this.state.attachment1);
    for (const key of Object.keys(this.state.slider_image1)) {
      data.append("slider_image[]", this.state.slider_image1[key]);
    }

    axios
      .post(
        `${url}/api/work-offer/update/${this.props.match.params.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/work-list");
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  };

  render() {
    const { t, i18n } = this.props;

    var yesterday = moment().subtract(1, "day");
    function valid(current) {
      return current.isAfter(yesterday);
    }
    var workStartDate = this.state.available_from
      ? moment(this.state.available_from)
      : null;
    function valid2(current) {
      return current.isAfter(workStartDate);
    }
    var availableStartDate = this.state.available_from1
      ? moment(this.state.available_from1)
      : null;
    function valid3(current) {
      return current.isAfter(availableStartDate);
    }

    let alert, loading;
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
          {t("success.work_ins")}
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

    const categoryId = this.state.productcat
      ? this.state.productcat.map(({ category_id, category_name }, index) => (
          <option value={category_id}>{category_name}</option>
        ))
      : [];
    const categoryId1 = this.state.productcat
      ? this.state.productcat.map(({ category_id, category_name }, index) => (
          <option value={category_id}>{category_name}</option>
        ))
      : [];

    const stateList = this.state.states
      ? this.state.states.map(({ state_id, state_identifier }, index) => {
          if (state_id !== undefined) {
            return <option value={state_id}>{state_identifier}</option>;
          }
        })
      : [];
    const stateList1 = this.state.states1
      ? this.state.states1.map(({ state_id, state_identifier }, index) => {
          if (state_id !== undefined) {
            return <option value={state_id}>{state_identifier}</option>;
          }
        })
      : [];

    const cityList = this.state.cities
      ? this.state.cities.map(({ city_id, city_identifier }, index) => {
          if (city_id !== undefined) {
            return <option value={city_id}>{city_identifier}</option>;
          }
        })
      : [];
    const cityList1 = this.state.cities1
      ? this.state.cities1.map(({ city_id, city_identifier }, index) => {
          if (city_id !== undefined) {
            return <option value={city_id}>{city_identifier}</option>;
          }
        })
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
            <li class="breadcrumb-item active" aria-current="page">
              {t("c_work_list.title")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container-fluid">
              <h3 className="head3">{t("c_work_list.title")}</h3>
              <div className="card">
                <div className="card-body">
                  <div class="row">
                    <div class="col">
                      <div class="form-group">
                        <label>{t("c_material_list.request.type_list")}</label>
                        <small
                          class="form-text text-muted"
                          style={{ fontSize: "15px" }}
                        >
                          {t("c_material_list.request.sub_title")}
                        </small>
                        <ul
                          class="nav tablist"
                          id="listing-type"
                          role="tablist"
                        >
                          {this.props.match.params.id ? (
                            this.state.tender_type === "Request" ? (
                              <li class="nav-item" role="presentation">
                                <a
                                  className={`nav-link ${
                                    this.state.tender_type === "Request"
                                      ? "active"
                                      : ""
                                  }`}
                                  id="type-request-tab"
                                  data-toggle="pill"
                                  href="#type-request"
                                  role="tab"
                                  aria-controls="type-request"
                                  aria-selected="true"
                                >
                                  {t("feeds.search.request")}
                                </a>
                              </li>
                            ) : (
                              <li class="nav-item" role="presentation">
                                <a
                                  className={`nav-link ${
                                    this.state.tender_type === "Offer"
                                      ? "active"
                                      : ""
                                  }`}
                                  id="type-offer-tab"
                                  data-toggle="pill"
                                  href="#type-offer"
                                  role="tab"
                                  aria-controls="type-offer"
                                  aria-selected="false"
                                >
                                  {t("feeds.search.offer")}
                                </a>
                              </li>
                            )
                          ) : (
                            <React.Fragment>
                              <li class="nav-item" role="presentation">
                                <a
                                  className={`nav-link ${
                                    this.state.tender_type === "Request"
                                      ? "active"
                                      : ""
                                  }`}
                                  id="type-request-tab"
                                  data-toggle="pill"
                                  href="#type-request"
                                  role="tab"
                                  aria-controls="type-request"
                                  aria-selected="true"
                                >
                                  {t("feeds.search.request")}
                                </a>
                              </li>
                              <li class="nav-item" role="presentation">
                                <a
                                  className={`nav-link ${
                                    this.state.tender_type === "Offer"
                                      ? "active"
                                      : ""
                                  }`}
                                  id="type-offer-tab"
                                  data-toggle="pill"
                                  href="#type-offer"
                                  role="tab"
                                  aria-controls="type-offer"
                                  aria-selected="false"
                                >
                                  {t("feeds.search.offer")}
                                </a>
                              </li>
                            </React.Fragment>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-content"
                    id="type-tabContent"
                    style={{ maxWidth: "960px" }}
                  >
                    <div
                      class={
                        this.state.tender_type === "Request"
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="type-request"
                      role="tabpanel"
                      aria-labelledby="type-request"
                    >
                      <form
                        name="type-request"
                        onSubmit={
                          this.props.match.params.id
                            ? this.handleUpdate
                            : this.handleSubmit
                        }
                      >
                        <div class="row gutters-40">
                          <div class="col-md-5 col-lg-4">
                            <div class="form-group">
                              <label for="title">
                                {t("c_material_list.request.input_title")}
                              </label>
                              <input
                                id="title"
                                style={
                                  this.state.title_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleChange1}
                                name="title"
                                type="text"
                                value={this.state.title}
                                class="form-control"
                                placeholder=""
                                required
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.title_err === true
                                  ? "Title is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="categoryId">
                                {t("c_material_list.request.category")}
                              </label>
                              <select
                                style={
                                  this.state.categoryId_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleChange2}
                                name="categoryId"
                                id="categoryId"
                                value={this.state.categoryId}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {categoryId}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.categoryId_err === true
                                  ? "CategoryId is required"
                                  : null}
                              </p>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-8">
                                <div class="form-group">
                                  <label for="budget">
                                    {t("c_work_list.budget")}
                                  </label>
                                  <select
                                    style={
                                      this.state.budget_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleChange3}
                                    name="budget"
                                    id="budget"
                                    value={this.state.budget}
                                    class="form-control"
                                  >
                                    <option>--Select--</option>
                                    <option value="Fixed">Fixed</option>
                                    <option value="Hourly">Hourly</option>
                                    <option value="per_m2">cost/m2</option>
                                  </select>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.budget_err === true
                                      ? "Budget is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-4">
                                <div class="form-group">
                                  <label for="rate">
                                    {t("c_work_list.rate")}
                                  </label>
                                  <input
                                    id="rate"
                                    style={
                                      this.state.rate_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleChange4}
                                    name="rate"
                                    type="number"
                                    class="form-control"
                                    placeholder=""
                                    value={this.state.rate}
                                    required
                                  />
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.rate_err === true
                                      ? "Rate is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-6">
                                <div class="form-group">
                                  <label for="available_from">
                                    {t("c_work_list.work_start")}
                                  </label>
                                  <div
                                    style={
                                      this.state.available_from_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <Datetime
                                      onChange={(date) =>
                                        this.handleChange5(date)
                                      }
                                      isValidDate={valid}
                                      name="available_from"
                                      value={this.state.available_from}
                                      dateFormat="DD-MM-YYYY"
                                      timeFormat={false}
                                    />
                                  </div>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.available_from_err === true
                                      ? "Available from is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="form-group">
                                  <label for="available_to">
                                    {t("c_work_list.work_end")}
                                  </label>
                                  <div
                                    style={
                                      this.state.available_to_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <Datetime
                                      onChange={(date) =>
                                        this.handleChange6(date)
                                      }
                                      isValidDate={valid2}
                                      name="available_from"
                                      value={this.state.available_to}
                                      dateFormat="DD-MM-YYYY"
                                      timeFormat={false}
                                    />
                                  </div>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.available_to_err === true
                                      ? "Available to is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <label for="state">
                                {t("feeds.search.state")}
                              </label>
                              <select
                                onChange={this.ChangeCity}
                                style={
                                  this.state.city_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="state"
                                id="state"
                                value={this.state.state}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {stateList}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.city_err === true
                                  ? "State is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="city">
                                {t("c_material_list.request.city")}
                              </label>
                              <select
                                onChange={this.handleChange7}
                                style={
                                  this.state.city_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="city"
                                id="city"
                                value={this.state.city}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {cityList}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.city_err === true
                                  ? "City is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="pincode">
                                {t("c_material_list.request.pincode")}
                              </label>
                              <input
                                style={
                                  this.state.pincode_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                id="pincode"
                                onChange={this.handleChange8}
                                name="pincode"
                                maxLength="10"
                                type="text"
                                class="form-control"
                                value={this.state.pincode}
                                placeholder=""
                                required
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.pincode_err === true
                                  ? "Pincode is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="post_expiry_date">
                                {t("c_material_list.request.post_expires_in")}
                              </label>
                              <div
                                style={
                                  this.state.post_expiry_date_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                              >
                                <Datetime
                                  onChange={(date) => this.handleChange9(date)}
                                  name="post_expiry_date"
                                  isValidDate={valid}
                                  value={this.state.post_expiry_date}
                                  dateFormat={this.state.datepicker_date_format}
                                  timeFormat={this.state.datepicker_time_format}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.post_expiry_date_err === true
                                  ? "Date is required"
                                  : null}
                              </p>
                            </div>

                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="material1"
                                  checked={
                                    this.state.mat_checked === 1 ? true : false
                                  }
                                  value="1"
                                  onChange={this.handleCheck}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="material1"
                                >
                                  {t("feeds.search.material")}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-7 col-lg-8">
                            <div class="form-group">
                              <label for="Desc">
                                {t("c_material_list.request.description")}
                              </label>
                              <textarea
                                onChange={this.handleChange10}
                                style={
                                  this.state.description_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="description"
                                id="Desc"
                                value={this.state.description}
                                class="form-control"
                                required
                              ></textarea>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.description_err === true
                                  ? "Description is required"
                                  : null}
                              </p>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-xl-5 col-sm-6">
                                <div class="form-group">
                                  <label for="main">
                                    {t("c_material_list.request.main")}
                                  </label>
                                  <div
                                    class="file-select"
                                    style={
                                      this.state.featured_image_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <input
                                      onChange={this.handleChange11}
                                      name="featured_image"
                                      type="file"
                                      id="main"
                                    />
                                    <label for="main">
                                      <img
                                        src={
                                          this.props.match.params.id
                                            ? url +
                                              "/images/marketplace/material/" +
                                              this.state.attachment_preview
                                            : this.state.attachment_preview !==
                                              null
                                            ? this.state.attachment_preview
                                            : File
                                        }
                                        alt=""
                                      />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded} />
                                    </label>
                                    <small class="form-text text-muted">
                                      jpeg, png, jpg, gif, svg
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.featured_image_err === true
                                        ? "Image is required"
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xl-5 col-sm-6">
                                <div
                                  class="form-group"
                                  style={
                                    this.state.attachment_err === true
                                      ? {
                                          //border: "1px solid #eb516d"
                                        }
                                      : {}
                                  }
                                >
                                  <label for="attachment">
                                    {t("c_material_list.request.attachment")}
                                  </label>
                                  <div class="file-select">
                                    <input
                                      onChange={this.handleChange12}
                                      name="attachment"
                                      type="file"
                                      id="attachment"
                                    />
                                    <label for="attachment">
                                      <img src={File} alt="" />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded1} />
                                    </label>
                                    <small class="form-text text-muted">
                                      {t(
                                        "c_material_list.request.attachment_text"
                                      )}
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.attachment_err === true
                                        ? null //"Attachment is required"
                                        : null}
                                    </p>
                                  </div>
                                  {this.state.attachment_P ? (
                                    <label for="attachments">
                                      <a
                                        href={
                                          url +
                                          "/images/marketplace/material/" +
                                          this.state.attachment_P
                                        }
                                        target="_blank"
                                        class="attachment"
                                      >
                                        <i class="icon-paperclip"></i>
                                        {this.state.attachment_P}
                                      </a>
                                    </label>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <label>
                                {t("c_material_list.request.product_images")}
                              </label>
                              <div class="row">
                                <div class="col-xl-10">
                                  <div class="row gutters-14">
                                    <div class="col-lg-3 col-sm-4 col-6">
                                      <div
                                        class="file-select"
                                        style={
                                          this.state.slider_image_err === true
                                            ? { border: "1px solid #eb516d" }
                                            : {}
                                        }
                                      >
                                        <input
                                          onChange={this.handleChange13}
                                          multiple
                                          name="slider_image[]"
                                          type="file"
                                          id="file1"
                                        />
                                        <label for="file1">
                                          {this.fileArray.length <= 0 ? (
                                            <img src={File} alt="..." />
                                          ) : (
                                            this.fileArray.map((url) => (
                                              <div>
                                                <img
                                                  style={{ height: "100px" }}
                                                  src={
                                                    this.fileArray.length <= 0
                                                      ? File
                                                      : url
                                                  }
                                                  alt="..."
                                                />
                                              </div>
                                            ))
                                          )}
                                          <span class="status">Upload</span>
                                          <ProgressBar
                                            now={this.state.loaded2}
                                          />
                                        </label>
                                        <small class="form-text text-muted">
                                          jpeg, png, jpg, gif, svg
                                        </small>
                                        {this.state.slider_image == "" ? (
                                          ""
                                        ) : (
                                          <button
                                            style={{ marginTop: "10px" }}
                                            onClick={this.removeImg}
                                            class="btn btn-danger"
                                          >
                                            Remove
                                          </button>
                                        )}
                                        <small
                                          class="form-text text-muted"
                                          style={{
                                            fontSize: "13px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {t(
                                            "c_material_list.request.product_images_text"
                                          )}
                                        </small>
                                        <p style={{ color: "#eb516d " }}>
                                          {this.state.slider_image_err === true
                                            ? "Slider image is required"
                                            : null}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xl-3 col-lg-12">
                            <div class="form-group">
                              <label class="d-none d-xl-block">&nbsp;</label>
                              <div class="clear"></div>
                              {loading ? (
                                loading
                              ) : (
                                <button class="btn btn-success">Submit</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div
                      class={
                        this.state.tender_type === "Offer"
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="type-offer"
                      role="tabpanel"
                      aria-labelledby="type-offer"
                    >
                      <form
                        name="type-offer"
                        onSubmit={
                          this.props.match.params.id
                            ? this.handleUpdate1
                            : this.handleSubmit1
                        }
                      >
                        <div class="row gutters-40">
                          <div class="col-md-5 col-lg-4">
                            <div class="form-group">
                              <label for="title1">
                                {t("c_material_list.request.input_title")}
                              </label>
                              <input
                                id="title1"
                                style={
                                  this.state.title_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="title1"
                                type="text"
                                class="form-control"
                                placeholder=""
                                value={this.state.title1}
                                required
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.title_err === true
                                  ? "Title is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="category1">
                                {t("c_material_list.request.category")}
                              </label>
                              <select
                                style={
                                  this.state.categoryId_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleChange_2}
                                name="categoryId1"
                                id="category1"
                                value={this.state.categoryId1}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {categoryId1}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.categoryId_err1 === true
                                  ? "CategoryId is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="budget1">
                                {t("c_work_list.budget")}
                              </label>
                              <select
                                style={
                                  this.state.budget_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="budget1"
                                id="budget1"
                                value={this.state.budget1}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Hourly">Hourly</option>
                                <option value="per_m2">cost/m2</option>
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.budget_err1 === true
                                  ? "Budget is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="availablity">
                                {t("c_work_list.availablity")}
                              </label>
                              <div class="row gutters-24">
                                <div class="col-6">
                                  <div
                                    style={
                                      this.state.available_from_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <Datetime
                                      onChange={(date) =>
                                        this.handleChange_5(date)
                                      }
                                      isValidDate={valid}
                                      name="available_from1"
                                      dateFormat="DD-MM-YYYY"
                                      value={this.state.available_from1}
                                      timeFormat={false}
                                    />
                                  </div>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.available_from_err1 === true
                                      ? "Available from is required"
                                      : null}
                                  </p>
                                </div>
                                <div class="col-6">
                                  <div
                                    style={
                                      this.state.available_to_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <Datetime
                                      onChange={(date) =>
                                        this.handleChange_6(date)
                                      }
                                      isValidDate={valid3}
                                      name="available_to1"
                                      dateFormat="DD-MM-YYYY"
                                      value={this.state.available_to1}
                                      timeFormat={false}
                                    />
                                  </div>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.available_to_err1 === true
                                      ? "Available to is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <label for="state">
                                {t("feeds.search.state")}
                              </label>
                              <select
                                onChange={this.ChangeCity1}
                                style={
                                  this.state.city_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="state"
                                id="state"
                                value={this.state.state1}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {stateList1}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.city_err1 === true
                                  ? "State is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="city">
                                {t("c_material_list.request.city")}
                              </label>
                              <select
                                onChange={this.handleChange_7}
                                style={
                                  this.state.city_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="city"
                                id="city"
                                value={this.state.city1}
                                class="form-control"
                              >
                                <option>--Select--</option>
                                {cityList1}
                              </select>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.city_err1 === true
                                  ? "City is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="pincode1">
                                {t("c_material_list.request.pincode")}
                              </label>
                              <input
                                style={
                                  this.state.pincode_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="pincode1"
                                maxLength="10"
                                id="pincode1"
                                type="text"
                                class="form-control"
                                placeholder=""
                                value={this.state.pincode1}
                                required
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.pincode_err1 === true
                                  ? "Pincode is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="post_expiry_date">
                                {t("c_material_list.request.post_expires_in")}
                              </label>
                              <div
                                style={
                                  this.state.post_expiry_date_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                              >
                                <Datetime
                                  onChange={(date) => this.handleChange_9(date)}
                                  name="post_expiry_date1"
                                  isValidDate={valid}
                                  value={this.state.post_expiry_date1}
                                  dateFormat={this.state.datepicker_date_format}
                                  timeFormat={this.state.datepicker_time_format}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.post_expiry_date_err1 === true
                                  ? "Date is required"
                                  : null}
                              </p>
                            </div>

                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="material2"
                                  checked={
                                    this.state.mat_checked === 1 ? true : false
                                  }
                                  value="1"
                                  onChange={this.handleCheck}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="material2"
                                >
                                  {t("feeds.search.material")}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-7 col-lg-8">
                            <div class="form-group">
                              <label for="Desc1">
                                {t("c_material_list.request.description")}
                              </label>
                              <textarea
                                style={
                                  this.state.description_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="description1"
                                id="Desc1"
                                value={this.state.description1}
                                required
                                class="form-control"
                              ></textarea>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.description_err1 === true
                                  ? "Description is required"
                                  : null}
                              </p>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-xl-5 col-sm-6">
                                <div class="form-group">
                                  <label for="main1">
                                    {t("c_material_list.request.main")}
                                  </label>
                                  <div
                                    class="file-select"
                                    style={
                                      this.state.featured_image_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <input
                                      onChange={this.handleChange_11}
                                      name="featured_image1"
                                      type="file"
                                      id="main1"
                                    />
                                    <label for="main1">
                                      <img
                                        src={
                                          this.props.match.params.id
                                            ? url +
                                              "/images/marketplace/material/" +
                                              this.state.attachment_preview1
                                            : this.state.attachment_preview1 !==
                                              null
                                            ? this.state.attachment_preview1
                                            : File
                                        }
                                        alt=""
                                      />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded} />
                                    </label>
                                    <small class="form-text text-muted">
                                      jpeg, png, jpg, gif, svg
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.featured_image_err1 === true
                                        ? "Featured image is required"
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xl-5 col-sm-6">
                                <div
                                  class="form-group"
                                  style={
                                    this.state.attachment_err1 === true
                                      ? {
                                          // border: "1px solid #eb516d"
                                        }
                                      : {}
                                  }
                                >
                                  <label for="attachment1">
                                    {t("c_material_list.request.attachment")}
                                  </label>
                                  <div class="file-select">
                                    <input
                                      onChange={this.handleChange_12}
                                      type="file"
                                      id="attachment1"
                                    />
                                    <label name="attachment" for="attachment1">
                                      <img src={File} alt="" />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded1} />
                                    </label>
                                    <small class="form-text text-muted">
                                      {t(
                                        "c_material_list.request.attachment_text"
                                      )}
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.attachment_err1 === true
                                        ? null // "Attachment is required"
                                        : null}
                                    </p>
                                  </div>
                                  {this.state.attachment_P ? (
                                    <label for="attachment1">
                                      <a
                                        href={
                                          url +
                                          "/images/marketplace/material/" +
                                          this.state.attachment_P
                                        }
                                        target="_blank"
                                        class="attachment"
                                      >
                                        <i class="icon-paperclip"></i>
                                        {this.state.attachment_P}
                                      </a>
                                    </label>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div class="form-group">
                              <label>
                                {t("c_material_list.request.product_images")}
                              </label>
                              <div class="row">
                                <div class="col-xl-10">
                                  <div class="row gutters-14">
                                    <div class="col-lg-3 col-sm-4 col-6">
                                      <div
                                        class="file-select"
                                        style={
                                          this.state.slider_image_err1 === true
                                            ? { border: "1px solid #eb516d" }
                                            : {}
                                        }
                                      >
                                        <input
                                          onChange={this.handleChange_13}
                                          multiple
                                          name="slider_image1[]"
                                          type="file"
                                          id="file11"
                                        />
                                        <label for="file11">
                                          {this.fileArray1.length <= 0 ? (
                                            <img src={File} alt="..." />
                                          ) : (
                                            this.fileArray1.map((url) => (
                                              <div>
                                                <img
                                                  style={{ height: "100px" }}
                                                  src={
                                                    this.fileArray1.length <= 0
                                                      ? File
                                                      : url
                                                  }
                                                  alt="..."
                                                />
                                              </div>
                                            ))
                                          )}
                                          <span class="status">Upload</span>
                                          <ProgressBar
                                            now={this.state.loaded2}
                                          />
                                        </label>
                                        <small class="form-text text-muted">
                                          jpeg, png, jpg, gif, svg
                                        </small>
                                        {this.state.slider_image1 == "" ? (
                                          ""
                                        ) : (
                                          <button
                                            style={{ marginTop: "10px" }}
                                            onClick={this.removeImg1}
                                            class="btn btn-danger"
                                          >
                                            Remove
                                          </button>
                                        )}

                                        <small
                                          class="form-text text-muted"
                                          style={{
                                            fontSize: "13px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {t(
                                            "c_material_list.request.product_images_text"
                                          )}
                                        </small>
                                        <p style={{ color: "#eb516d " }}>
                                          {this.state.slider_image_err1 === true
                                            ? "Slider image is required"
                                            : null}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xl-3 col-lg-12">
                            <div class="form-group">
                              <label class="d-none d-xl-block">&nbsp;</label>
                              <div class="clear"></div>
                              {loading ? (
                                loading
                              ) : (
                                <button class="btn btn-success">Submit</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
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

export default withTranslation()(Createworklist);
