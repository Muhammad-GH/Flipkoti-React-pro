/* eslint-disable jsx-a11y/alt-text */
import React, { Component, useState } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import File from "../../images/file-icon.png";
import { Helper, url } from "../../helper/helper";
import Alert from "react-bootstrap/Alert";
import moment from "moment";
import { withTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import Datetime from "react-datetime";

class Createmateriallist extends Component {
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
    this.loadCategory1 = this.loadCategory1.bind(this);
    this.loadState = this.loadState.bind(this);
    this.loadState1 = this.loadState1.bind(this);
    this.loadConfig = this.loadConfig.bind(this);

    this.state = {
      title: "",
      title1: "",
      title_err: false,
      title1_err: false,
      categoryId: "",
      categoryId1: "",
      categoryId_err: false,
      categoryId_err1: false,
      productcat: [],
      productcat1: [],
      cities: [],
      cities1: [],
      quantity: "",
      quantity1: "",
      quantity_err: false,
      quantity_err1: false,
      unit: "kg",
      unit1: "kg",
      unit_err: false,
      unit_err1: false,
      city: "",
      city1: "",
      state: "",
      state1: "",
      states: [],
      states1: [],
      city_err: false,
      city_err1: false,
      cost_per_unit: "",
      cost_per_unit1: "",
      cost_per_unit_err: false,
      cost_per_unit_err1: false,
      warranty: "",
      warranty1: "",
      warranty_err: false,
      warranty_err1: false,
      warranty_type: 1,
      pincode: "",
      pincode1: "",
      pincode_err: false,
      pincode_err1: false,
      post_expiry_date: moment(),
      post_expiry_date1: moment(),
      upd_post_expiry_date: "",
      post_expiry_date_err: false,
      post_expiry_date_err1: false,
      description: "",
      description1: "",
      description_err: "",
      description_err1: "",
      featured_image: null,
      featured_image1: null,
      featured_image_err: null,
      featured_image_err1: null,
      attachment: null,
      attachment_P: null,
      attachment1: null,
      attachment_err: null,
      attachment_err1: null,
      slider_image: [],
      slider_image1: [],
      slider_image_err: false,
      slider_image_err1: false,
      attachment_preview: null,
      attachment_preview1: null,
      slider_image_preview: [null],
      slider_image_preview1: [null],
      delivery_type: [],
      delivery_type1: [],
      delivery_cost: [],
      delivery_cost1: [],
      delivery_type_err: false,
      delivery_type_err1: false,
      delivery_cost_err: false,
      delivery_cost_err1: false,
      checked: false,
      work_checked: 0,
      errors: [],
      show_errors: false,
      show_msg: false,
      loading: false,
      loaded: 0,
      loaded_: 0,
      loaded1: 0,
      loaded_1: 0,
      loaded2: 0,
      loaded_2: 0,
      configs: [],
      row_phase: [],
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
    this.loadCategory1();
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
            description: data[0].tender_description,
            unit: data[0].tender_unit,
            city: data[0].tender_city_id,
            state: data[0].city_state_id,
            pincode: data[0].tender_pincode,
            work_checked: data[0].extra, // extra
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
            description1: data[0].tender_description,
            unit1: data[0].tender_unit,
            city1: data[0].tender_city_id,
            state1: data[0].city_state_id,
            cost_per_unit1: data[0].tender_cost_per_unit,
            pincode1: data[0].tender_pincode,
            row_phase: data[0].tender_delivery_type_cost,
            work_checked: data[0].extra,
            post_expiry_date1: moment(data[0].tender_expiry_date).format(
              "DD-MM-YYYY HH:mm:ss"
            ),
            upd_post_expiry_date: data[0].tender_expiry_date,
            featured_image1: data[0].tender_featured_image,
            attachment1: data[0].tender_attachment,
            attachment_preview1: data[0].tender_featured_image,
            attachment_P: data[0].tender_attachment,
            warranty1: data[0].tender_warranty,
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

  addDelivery = (event) => {
    event.preventDefault();
    if (this.state.delivery_type1.length > 0 && this.state.delivery_cost1 > 0) {
      let row_phase = this.state.row_phase;
      let keys = ["type", "cost"];
      let gg = `${this.state.delivery_type1},${this.state.delivery_cost1}`.split(
        ","
      );
      let result = {};

      var index = row_phase.findIndex(function (obj) {
        return obj.type === gg[0];
      });
      if (index === -1) {
        // Object with the specific type not found.
        keys.forEach((key, i) => (result[key] = gg[i]));
        row_phase.push(result);
        this.setState({ row_phase: row_phase });
      }
    }
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
        this.setState({ productcat: result.data.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  loadCategory1 = async () => {
    const token = await localStorage.getItem("token");
    axios
      .get(`${url}/api/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        this.setState({ productcat1: result.data.data });
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

  removeImg = (event) => {
    event.preventDefault();
    this.fileArray = [];
    this.setState({ slider_image: [], loaded2: 0 });
  };
  removeImg1 = (event) => {
    event.preventDefault();
    this.fileArray1 = [];
    this.setState({ slider_image1: [], loaded_2: 0 });
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
  handleChange13 = (event) => {
    this.setState({ delivery_type1: event.target.value });
  };
  handleChange15 = (event) => {
    this.setState({ cost_per_unit: event.target.value });
  };
  handleChange16 = (event) => {
    this.setState({ delivery_cost1: event.target.value });
  };
  handleChange3 = (event) => {
    this.setState({ quantity: event.target.value });
  };
  handleChange4 = (event) => {
    this.setState({ unit: event.target.value });
  };
  handleChange_4 = (event) => {
    this.setState({ unit1: event.target.value });
  };
  handleChange5 = (event) => {
    this.setState({ city: event.target.value });
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
  handleChange6 = (event) => {
    this.setState({ pincode: event.target.value });
  };
  handleChange14 = (event) => {
    this.setState({ warranty: event.target.value });
  };
  handleChange7 = (event) => {
    this.setState({
      post_expiry_date: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange_7 = (event) => {
    this.setState({
      post_expiry_date1: event._d,
      upd_post_expiry_date: event._d,
    });
  };
  handleChange8 = (event) => {
    this.setState({ description: event.target.value });
  };
  handleChange9 = (event) => {
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
  handleChange_9 = (event) => {
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
          loaded_: 50,
          featured_image_err1: false,
          attachment_preview1: URL.createObjectURL(event.target.files[0]),
        });
        if (this.state.loaded_ <= 100) {
          setTimeout(
            function () {
              this.setState({ loaded_: 100 });
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
        loaded_: 0,
        featured_image_err1: true,
        attachment_preview1: null,
      });
    }
  };
  handleChange10 = (event) => {
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
  handleChange_10 = (event) => {
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
      console.log(event.target.files[0]);
      this.setState({
        attachment1: event.target.files[0],
        loaded_1: 50,
        attachment_err1: false,
      });
      if (this.state.loaded_1 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded_1: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({ attachment_err1: true, attachment1: null });
      return alert("File type not supported");
    }
  };

  handleChange11 = (event) => {
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
  handleChange_11 = (event) => {
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
        loaded_2: 50,
        slider_image_err1: false,
        slider_image_preview1: this.fileArray1,
      });
      if (this.state.loaded_2 <= 100) {
        setTimeout(
          function () {
            this.setState({ loaded_2: 100 });
          }.bind(this),
          2000
        ); // wait 2 seconds, then reset to false
      }
    } else {
      this.setState({
        slider_image1: [],
        loaded_2: 0,
        slider_image_err1: true,
        slider_image_preview1: null,
      });
    }
  };

  handleCheck = (event) => {
    this.setState({ checked: !this.state.checked }, () => {
      if (this.state.checked) {
        this.setState({ work_checked: 2 });
      } else {
        this.setState({ work_checked: 0 });
      }
    });
  };

  handleUpdate = async (event) => {
    event.preventDefault();
    this.setState({
      title_err: false,
      quantity_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      categoryId_err: false,
      unit_err: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      cost_per_unit_err: false,
      delivery_type_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.quantity.length <= 0) {
      this.setState({ quantity_err: true });
    }
    // if (this.state.pincode.length <= 0) {
    //   this.setState({ pincode_err: true });
    // }
    if (
      this.state.post_expiry_date == "" ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    if (this.state.categoryId == "--Select--" || this.state.categoryId == "") {
      this.setState({ categoryId_err: true });
    }
    if (this.state.unit == "select" || this.state.unit == "") {
      this.setState({ unit_err: true });
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
    if (this.state.cost_per_unit.length <= 0) {
      this.setState({ cost_per_unit_err: true });
    }
    if (
      this.state.delivery_type == "--Select--" ||
      this.state.delivery_type == ""
    ) {
      this.setState({ delivery_type_err: true });
    }
    if (this.state.delivery_cost.length <= 0) {
      this.setState({ delivery_cost_err: true });
    }
    if (this.state.warranty.length <= 0) {
      this.setState({ warranty_err: true });
    }
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title);
    data.set("categoryId", this.state.categoryId);
    data.set("quantity", this.state.quantity);
    data.set("description", this.state.description);
    data.set("unit", this.state.unit);
    data.set("city", this.state.city);
    data.set("pincode", this.state.pincode);
    data.set("extra", this.state.work_checked);
    data.set("post_expiry_date", moment(this.state.upd_post_expiry_date));
    data.append("featured_image", this.state.featured_image);
    data.append("attachment", this.state.attachment);

    for (const key of Object.keys(this.state.slider_image)) {
      data.append("slider_image[]", this.state.slider_image[key]);
    }

    axios
      .post(
        `${url}/api/material-request/update/${this.props.match.params.id}`,
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
        this.props.history.push("/material-list");
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

  // material request
  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      title_err: false,
      quantity_err: false,
      pincode_err: false,
      post_expiry_date_err: false,
      description_err: false,
      categoryId_err: false,
      unit_err: false,
      city_err: false,
      featured_image_err: false,
      attachment_err: false,
      slider_image_err: false,
      cost_per_unit_err: false,
      delivery_type_err: false,
      delivery_cost_err: false,
      warranty_err: false,
    });
    if (this.state.title.length <= 0) {
      this.setState({ title_err: true });
    }
    if (this.state.quantity.length <= 0) {
      this.setState({ quantity_err: true });
    }
    // if (this.state.pincode.length <= 0) {
    //   this.setState({ pincode_err: true });
    // }
    if (
      this.state.post_expiry_date == "" ||
      this.state.post_expiry_date == undefined
    ) {
      this.setState({ post_expiry_date_err: true });
    }
    if (this.state.description.length <= 0) {
      this.setState({ description_err: true });
    }
    if (this.state.categoryId == "--Select--" || this.state.categoryId == "") {
      this.setState({ categoryId_err: true });
    }
    if (this.state.unit == "select" || this.state.unit == "") {
      this.setState({ unit_err: true });
    }
    if (this.state.city === "--Select--" || this.state.city === "") {
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
    if (this.state.cost_per_unit.length <= 0) {
      this.setState({ cost_per_unit_err: true });
    }
    if (
      this.state.delivery_type == "--Select--" ||
      this.state.delivery_type == ""
    ) {
      this.setState({ delivery_type_err: true });
    }
    if (this.state.delivery_cost.length <= 0) {
      this.setState({ delivery_cost_err: true });
    }
    if (this.state.warranty.length <= 0) {
      this.setState({ warranty_err: true });
    }
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title);
    data.set("categoryId", this.state.categoryId);
    data.set("quantity", this.state.quantity);
    data.set("description", this.state.description);
    data.set("unit", this.state.unit);
    data.set("city", this.state.city);
    data.set("pincode", this.state.pincode);
    data.set("extra", this.state.work_checked);
    data.set("post_expiry_date", this.state.post_expiry_date);
    data.append("featured_image", this.state.featured_image);
    data.append("attachment", this.state.attachment);

    for (const key of Object.keys(this.state.slider_image)) {
      data.append("slider_image[]", this.state.slider_image[key]);
    }

    axios
      .post(`${url}/api/material-request/create`, data, {
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
          quantity: "",
          description: "",
          unit: "",
          city: "",
          pincode: "",
          work_checked: 0,
          post_expiry_date: "",
          featured_image: null,
          attachment_preview: null,
          loaded: 0,
          loaded1: 0,
          loaded2: 0,
          attachment: null,
          slider_image: [],
        });
        this.fileArray = [];
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/material-list");
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // });show_errors: true,
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });
  };
  // material offer
  handleSubmit1 = async (event) => {
    event.preventDefault();
    this.setState({
      title_err1: false,
      quantity_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      categoryId_err1: false,
      unit_err1: false,
      city_err1: false,
      featured_image_err1: false,
      attachment_err1: false,
      slider_image_err1: false,
      cost_per_unit_err1: false,
      delivery_type_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (this.state.quantity1.length <= 0) {
      this.setState({ quantity_err1: true });
    }
    // if (this.state.pincode1.length <= 0) {
    //   this.setState({ pincode_err1: true });
    // }
    if (
      this.state.post_expiry_date1 == "" ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (
      this.state.categoryId1 == "--Select--" ||
      this.state.categoryId1 == ""
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.unit1 == "select" || this.state.unit1 == "") {
      this.setState({ unit_err1: true });
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
    if (this.state.cost_per_unit1.length <= 0) {
      this.setState({ cost_per_unit_err1: true });
    }
    if (
      this.state.delivery_type1 == "--Select--" ||
      this.state.delivery_type1 == ""
    ) {
      this.setState({ delivery_type_err1: true });
    }
    if (this.state.delivery_cost1.length <= 0) {
      this.setState({ delivery_cost_err1: true });
    }
    if (this.state.warranty1.length <= 0) {
      this.setState({ warranty_err1: true });
    }
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title1);
    data.set("categoryId", this.state.categoryId1);
    data.set("quantity", this.state.quantity1);
    data.set("description", this.state.description1);
    data.set("unit", this.state.unit1);
    data.set("cost_per_unit", this.state.cost_per_unit1);
    data.set("warranty", this.state.warranty1);
    data.set("delivery_type[]", this.state.delivery_type1);
    data.set("delivery_cost[]", this.state.delivery_cost1);
    data.set("tender_delivery_type_cost", JSON.stringify(this.state.row_phase));
    data.set("city", this.state.city1);
    data.set("pincode", this.state.pincode1);
    data.set("extra", this.state.work_checked);
    data.set("post_expiry_date", this.state.post_expiry_date1);
    data.append("featured_image", this.state.featured_image1);
    data.append("attachment", this.state.attachment1);

    for (const key of Object.keys(this.state.slider_image1)) {
      data.append("slider_image[]", this.state.slider_image1[key]);
    }
    axios
      .post(`${url}/api/material-offers/create`, data, {
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
          quantity1: "",
          description1: "",
          unit1: "",
          city1: "",
          cost_per_unit1: "",
          pincode1: "",
          delivery_cost1: [],
          delivery_type1: [],
          work_checked1: 0,
          post_expiry_date1: "",
          featured_image1: null,
          attachment_preview1: null,
          loaded_: 0,
          warranty1: "",
          loaded_1: 0,
          loaded_2: 0,
          attachment1: null,
          slider_image1: [],
        });
        this.myRef.current.scrollTo(0, 0);
        this.props.history.push("/material-list");
      })
      .catch((err) => {
        // Object.entries(err.response.data.error).map(([key, value]) => {
        //   this.setState({ errors: err.response.data.error });
        // }); show_errors: true,
        this.setState({ loading: false });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // console.log(JSON.stringify(this.state.row_phase));
    // for (var pair of data.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
  };

  handleUpdate1 = async (event) => {
    event.preventDefault();
    this.setState({
      title_err1: false,
      quantity_err1: false,
      pincode_err1: false,
      post_expiry_date_err1: false,
      description_err1: false,
      categoryId_err1: false,
      unit_err1: false,
      city_err1: false,
      featured_image_err1: false,
      attachment_err1: false,
      slider_image_err1: false,
      cost_per_unit_err1: false,
      delivery_type_err1: false,
      delivery_cost_err1: false,
      warranty_err1: false,
    });
    if (this.state.title1.length <= 0) {
      this.setState({ title_err1: true });
    }
    if (this.state.quantity1.length <= 0) {
      this.setState({ quantity_err1: true });
    }
    // if (this.state.pincode1.length <= 0) {
    //   this.setState({ pincode_err1: true });
    // }
    if (
      this.state.post_expiry_date1 == "" ||
      this.state.post_expiry_date1 == undefined
    ) {
      this.setState({ post_expiry_date_err1: true });
    }
    if (this.state.description1.length <= 0) {
      this.setState({ description_err1: true });
    }
    if (
      this.state.categoryId1 == "--Select--" ||
      this.state.categoryId1 == ""
    ) {
      this.setState({ categoryId_err1: true });
    }
    if (this.state.unit1 == "select" || this.state.unit1 == "") {
      this.setState({ unit_err1: true });
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
    if (this.state.cost_per_unit1.length <= 0) {
      this.setState({ cost_per_unit_err1: true });
    }
    if (
      this.state.delivery_type1 == "--Select--" ||
      this.state.delivery_type1 == ""
    ) {
      this.setState({ delivery_type_err1: true });
    }
    if (this.state.delivery_cost1.length <= 0) {
      this.setState({ delivery_cost_err1: true });
    }
    if (this.state.warranty1.length <= 0) {
      this.setState({ warranty_err1: true });
    }
    const token = await localStorage.getItem("token");
    this.setState({ loading: true });
    const data = new FormData();
    data.set("title", this.state.title1);
    data.set("categoryId", this.state.categoryId1);
    data.set("budget", this.state.budget);
    data.set("quantity", this.state.quantity1);
    data.set("description", this.state.description1);
    data.set("unit", this.state.unit1);
    data.set("cost_per_unit", this.state.cost_per_unit1);
    data.set("warranty", this.state.warranty1);
    data.set("delivery_type[]", this.state.delivery_type1);
    data.set("delivery_cost[]", this.state.delivery_cost1);
    data.set("tender_delivery_type_cost", JSON.stringify(this.state.row_phase));
    data.set("city", this.state.city1);
    data.set("pincode", this.state.pincode1);
    data.set("extra", this.state.work_checked);
    data.set("post_expiry_date", moment(this.state.upd_post_expiry_date));
    data.append("featured_image", this.state.featured_image1);
    data.append("attachment", this.state.attachment1);

    for (const key of Object.keys(this.state.slider_image1)) {
      data.append("slider_image[]", this.state.slider_image1[key]);
    }

    axios
      .post(
        `${url}/api/material-offer/update/${this.props.match.params.id}`,
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
        this.props.history.push("/material-list");
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({
          loading: false,
        });
        this.myRef.current.scrollTo(0, 0);
      });

    // Display the key/value pairs
    // console.log(JSON.stringify(this.state.row_phase));
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
          {t("success.mat_ins")}
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
    const categoryId1 = this.state.productcat1
      ? this.state.productcat1.map(({ category_id, category_name }, index) => (
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
              {t("c_material_list.request.title")}
            </li>
          </ol>
        </nav>
        <div className="main-content">
          <Sidebar dataFromParent={this.props.location.pathname} />
          <div ref={this.myRef} className="page-content">
            {alert ? alert : null}
            <div className="container">
              <h3 className="head3">{t("c_material_list.request.title")}</h3>
              <div class="card">
                <div class="card-body">
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
                                onChange={this.handleChange1}
                                name="title"
                                type="text"
                                value={this.state.title}
                                className="form-control"
                                style={
                                  this.state.title_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                required
                                placeholder=""
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
                                required
                                style={
                                  this.state.categoryId_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleChange2}
                                name="categoryId"
                                id="categoryId"
                                class="form-control"
                                value={this.state.categoryId}
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
                                  <label for="quantity">
                                    {t("c_material_list.request.vol_need")}
                                  </label>
                                  <input
                                    onChange={this.handleChange3}
                                    style={
                                      this.state.quantity_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    name="quantity"
                                    id="quantity"
                                    type="number"
                                    value={this.state.quantity}
                                    class="form-control"
                                    placeholder=""
                                    required
                                  />
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.quantity_err === true
                                      ? "Quantity is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-4">
                                <div class="form-group">
                                  <label for="unit">
                                    {t("c_material_list.request.unit")}
                                  </label>
                                  <select
                                    required
                                    onChange={this.handleChange4}
                                    value={this.state.unit}
                                    style={
                                      this.state.unit_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    name="unit"
                                    id="unit"
                                    class="form-control"
                                  >
                                    <option value="Kg">Kg</option>
                                    <option value="M2">M2</option>
                                    <option value="Liter">Liter</option>
                                    <option value="Pcs">Pcs</option>
                                  </select>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.unit_err === true
                                      ? "Unit is required"
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
                                required
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
                                required
                                onBlur={this.handleChange5}
                                onChange={this.handleChange5}
                                style={
                                  this.state.city_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                name="city"
                                id="city"
                                value={this.state.city}
                                className="form-control clickAble"
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
                                onChange={this.handleChange6}
                                maxLength="10"
                                name="pincode"
                                style={
                                  this.state.pincode_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                id="pincode"
                                value={this.state.pincode}
                                type="text"
                                class="form-control"
                                placeholder=""
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.pincode_err === true
                                  ? "Pincode is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="expires">
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
                                  onChange={(date) => this.handleChange7(date)}
                                  name="post_expiry_date"
                                  isValidDate={valid}
                                  value={this.state.post_expiry_date}
                                  dateFormat={this.state.datepicker_date_format}
                                  timeFormat={this.state.datepicker_time_format}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.post_expiry_date_err === true
                                  ? "Date field is required"
                                  : null}
                              </p>
                            </div>

                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="work"
                                  checked={
                                    this.state.work_checked === 2 ? true : false
                                  }
                                  value="2"
                                  onChange={this.handleCheck}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="work"
                                >
                                  {t("feeds.search.work")}
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
                                required
                                onChange={this.handleChange8}
                                name="description"
                                style={
                                  this.state.description_err === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                id="Desc"
                                value={this.state.description}
                                class="form-control"
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
                                    style={
                                      this.state.featured_image_err === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    class="file-select"
                                  >
                                    <input
                                      onChange={this.handleChange9}
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
                                      />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded} />
                                    </label>
                                    <small class="form-text text-muted">
                                      jpeg, png, jpg, gif, svg
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.featured_image_err === true
                                        ? "Featured image is required"
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xl-5 col-sm-6">
                                <div class="form-group">
                                  <label for="attachment">
                                    {t("c_material_list.request.attachment")}
                                  </label>
                                  <div
                                    class="file-select"
                                    style={
                                      this.state.attachment_err === true
                                        ? {
                                            // border: "1px solid #eb516d"
                                          }
                                        : {}
                                    }
                                  >
                                    <input
                                      onChange={this.handleChange10}
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
                                      {t(
                                        "c_material_list.request.attachment_text"
                                      )}
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.attachment_err === true
                                        ? null // "Attachment is required"
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
                                          onChange={this.handleChange11}
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
                              <label for="title">
                                {t("c_material_list.request.input_title")}
                              </label>
                              <input
                                id="title"
                                style={
                                  this.state.title_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="title1"
                                type="text"
                                value={this.state.title1}
                                class="form-control"
                                placeholder=""
                                required
                              />
                              <p style={{ color: "#eb516d " }}>
                                {this.state.title_err1 === true
                                  ? "Title is required"
                                  : null}
                              </p>
                            </div>
                            <div class="form-group">
                              <label for="category">
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
                                id="categoryId1"
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
                            <div class="row gutters-24">
                              <div class="col-5">
                                <div
                                  class="form-group"
                                  style={{ width: "100px" }}
                                >
                                  <label for="unitCost">
                                    {t("c_material_list.offer.cost_unit")}
                                  </label>
                                  <div
                                    class="input-group"
                                    style={
                                      this.state.cost_per_unit_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                  >
                                    <input
                                      onChange={this.handleState}
                                      name="cost_per_unit1"
                                      id="unitCost"
                                      type="number"
                                      class="form-control"
                                      placeholder=""
                                      required
                                      value={this.state.cost_per_unit1}
                                    />
                                    <div class="input-group-prepend">
                                      <span class="input-group-text">€</span>
                                    </div>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.cost_per_unit_err1 === true
                                        ? "Cost per unit is required"
                                        : null}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xl col-4">
                                <div class="form-group">
                                  <label for="unit1">
                                    {t("c_material_list.request.unit")}
                                  </label>
                                  <select
                                    style={
                                      this.state.unit_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    name="unit1"
                                    value={this.state.unit1}
                                    onChange={this.handleChange_4}
                                    id="unit1"
                                    class="form-control"
                                  >
                                    <option>Kg</option>
                                    <option>M2</option>
                                    <option>Liter</option>
                                    <option value="Pcs">Pcs</option>
                                  </select>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.unit_err1 === true
                                      ? "Unit is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-xl col-sm-12">
                                <div class="form-group">
                                  <label for="quantity">
                                    {t("c_material_list.offer.quantity")}
                                  </label>
                                  <input
                                    style={
                                      this.state.quantity_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleState}
                                    name="quantity1"
                                    id="quantity"
                                    type="number"
                                    class="form-control"
                                    placeholder=""
                                    required
                                    value={this.state.quantity1}
                                  />
                                </div>
                                <p style={{ color: "#eb516d " }}>
                                  {this.state.quantity_err1 === true
                                    ? "Quantity is required"
                                    : null}
                                </p>
                              </div>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-xl-5 col-7">
                                <div class="form-group">
                                  <label for="dtype">
                                    {t("c_material_list.offer.delivery_type")}
                                  </label>
                                  <select
                                    style={
                                      this.state.delivery_type_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleChange13}
                                    name="delivery_type1[]"
                                    id="dtype"
                                    class="form-control"
                                  >
                                    <option>--Select--</option>
                                    <option>Road</option>
                                    <option>Flight</option>
                                    <option>Ship</option>
                                  </select>
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.delivery_type_err1 === true
                                      ? "Delivery type is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-xl col-5">
                                <div class="form-group">
                                  <label for="cost">
                                    {t("c_material_list.offer.cost")}
                                  </label>
                                  <input
                                    style={
                                      this.state.delivery_cost_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleChange16}
                                    name="delivery_cost1[]"
                                    id="cost"
                                    type="text"
                                    class="form-control"
                                    placeholder=""
                                    value={this.state.delivery_cost1}
                                  />
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.delivery_cost_err1 === true
                                      ? "Delivery cost is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-xl-3 col-lg-12">
                                <div class="form-group">
                                  <label class="d-none d-xl-block">
                                    &nbsp;
                                  </label>
                                  <div class="clear"></div>
                                  <button
                                    onClick={this.addDelivery}
                                    class=" addDelButton"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div class="col-12">
                                <ul class="list-striped">
                                  {this.state.row_phase.map((r, index) => (
                                    <Row val={r} key={index} />
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div class="form-group">
                              <label for="expires1">
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
                                  onChange={(date) => this.handleChange_7(date)}
                                  name="post_expiry_date1"
                                  isValidDate={valid}
                                  value={this.state.post_expiry_date1}
                                  dateFormat={this.state.datepicker_date_format}
                                  timeFormat={this.state.datepicker_time_format}
                                />
                              </div>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.post_expiry_date_err1 === true
                                  ? "Date field is required"
                                  : null}
                              </p>
                            </div>

                            <div className="form-group">
                              <div className="form-check form-check-inline">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="work1"
                                  checked={
                                    this.state.work_checked === 2 ? true : false
                                  }
                                  value="2"
                                  onChange={this.handleCheck}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="work1"
                                >
                                  {t("feeds.search.work")}
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
                                style={
                                  this.state.description_err1 === true
                                    ? { border: "1px solid #eb516d" }
                                    : {}
                                }
                                onChange={this.handleState}
                                name="description1"
                                id="Desc"
                                class="form-control"
                                required
                                value={this.state.description1}
                              ></textarea>
                              <p style={{ color: "#eb516d " }}>
                                {this.state.description_err1 === true
                                  ? "Description is required"
                                  : null}
                              </p>
                            </div>
                            <div class="row gutters-24">
                              <div class="col-xl-5 col-md-6">
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
                                    name="state1"
                                    id="state1"
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
                                  <label for="city1">
                                    {t("c_material_list.request.city")}
                                  </label>
                                  <select
                                    style={
                                      this.state.city_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleState}
                                    name="city1"
                                    id="city1"
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
                              </div>
                              <div class="col-xl-5 col-md-6">
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
                                  />
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.pincode_err1 === true
                                      ? "Pincode is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
                              <div class="col-xl-5 col-md-6">
                                <div class="form-group">
                                  <label for="warranty">
                                    {t("c_material_list.offer.warranty")}
                                  </label>
                                  <input
                                    style={
                                      this.state.warranty_err1 === true
                                        ? { border: "1px solid #eb516d" }
                                        : {}
                                    }
                                    onChange={this.handleState}
                                    name="warranty1"
                                    id="warranty1"
                                    type="number"
                                    class="form-control"
                                    required
                                    value={this.state.warranty1}
                                  />
                                  <p style={{ color: "#eb516d " }}>
                                    {this.state.warranty_err1 === true
                                      ? "Warranty is required"
                                      : null}
                                  </p>
                                </div>
                              </div>
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
                                      onChange={this.handleChange_9}
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
                                      />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded_} />
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
                                <div class="form-group">
                                  <label for="attachment">
                                    {t("c_material_list.request.attachment")}
                                  </label>
                                  <div
                                    class="file-select"
                                    style={
                                      this.state.attachment_err1 === true
                                        ? {
                                            // border: "1px solid #eb516d"
                                          }
                                        : {}
                                    }
                                  >
                                    <input
                                      onChange={this.handleChange_10}
                                      name="attachment1"
                                      type="file"
                                      id="attachment1"
                                    />
                                    <label for="attachment1">
                                      <img src={File} />
                                      <span class="status">Upload status</span>
                                      <ProgressBar now={this.state.loaded_1} />
                                    </label>
                                    <small class="form-text text-muted">
                                      {t(
                                        "c_material_list.request.attachment_text"
                                      )}
                                    </small>
                                    <p style={{ color: "#eb516d " }}>
                                      {this.state.attachment_err1 === true
                                        ? null //"Attachment is required"
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
                                          onChange={this.handleChange_11}
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
                                            now={this.state.loaded_2}
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
                              )}{" "}
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

const Row = (props) => (
  <li>
    {props.val.type}- {props.val.cost}
  </li>
);

export default withTranslation()(Createmateriallist);
