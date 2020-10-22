import React, { Component } from "react";
import { Helper, url } from "../../../helper/helper";

class PDFView extends Component {
  render() {
    const { businessInfo, userInfo } = this.props;
    return (
      <div
        className="modal fade"
        id="preview-info"
        tabindex="-1"
        role="dialog"
        aria-labelledby="previewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered preview-modal">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="pdf-section">
                <div className="pdf-header">
                  <div className="logo">
                    <img
                      src={
                        url +
                        "/images/marketplace/company_logo/" +
                        businessInfo.company_logo
                      }
                      alt="logo"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12">
                          <p>
                            <b>{businessInfo.company_id}</b>
                            <br />
                            <b>{`${businessInfo.first_name} ${businessInfo.last_name}`}</b>
                            <br />
                            <b>{businessInfo.email}</b>
                            <br />
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-lg-4">
                          <address>
                            Salaojalinja Oy Kaskelantie
                            <br />
                            {businessInfo.address}
                            <br />
                            Phone no: {businessInfo.phone}
                            <br />
                            Business ID: {businessInfo.id}
                            <br />
                            Tax No: SM1212547
                            <br />
                            Other info
                          </address>
                        </div>
                        <div className="col-md-6 col-lg-4">
                          <address>
                            <p className="mb-2">Proposal To</p>
                            Salarem
                            <br />
                            {userInfo.client_id}
                            <br />
                          </address>
                        </div>
                        <div className="col-md-12 col-lg-4"></div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="float-md-right float-sm-none">
                        <h2>Proposal</h2>
                        <address>
                          Request ID #FK{" "}
                          {`${businessInfo.user_id}${userInfo.proposal_id}`}
                          <br />
                          Proposal Date: {userInfo.date}
                          <br />
                          Due date: {userInfo.due_date}
                          <br />
                        </address>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pdf-content">
                  <h2>Proposal Summary</h2>
                  <div className="row mb-5">
                    <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
                      <h4>Total Cost</h4>
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td>Work Cost</td>
                            <td className="text-right">
                              {userInfo.left} {userInfo.workTotal}{" "}
                              {userInfo.right}
                            </td>
                          </tr>
                          <tr>
                            <td>Material Cost</td>
                            <td className="text-right">
                              {userInfo.left} {userInfo.matTotal}{" "}
                              {userInfo.right}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Cost</td>
                            <td className="text-right">
                              {userInfo.left}{" "}
                              {Number(userInfo.workTotal) +
                                Number(userInfo.matTotal)}{" "}
                              {userInfo.right}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h4>Materials payment terms</h4>
                      <div className="border p-3" style={{ height: "110px" }}>
                        <p>{userInfo.mat_pay}.</p>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h4>Work payment terms</h4>
                      <div className="border p-3" style={{ height: "110px" }}>
                        <p>{userInfo.work_pay}</p>
                      </div>
                    </div>
                  </div>
                  <h3>Project Plan</h3>
                  <div className="row mb-5">
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5>Work</h5>
                      <table className="table table-striped small">
                        <tbody>
                          {userInfo.workItems === null
                            ? null
                            : JSON.parse(userInfo.workItems).map((item) => (
                                <tr>
                                  <td>{item.items}</td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h5>Material</h5>
                      <table className="table table-striped small">
                        <tbody>
                          {userInfo.matItems === null
                            ? null
                            : JSON.parse(userInfo.matItems).map((item) => (
                                <tr>
                                  <td>{item.items}</td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-lg-4 col-md-12"></div>
                  </div>
                  <h2>Proposal details</h2>
                  <div className="row mb-5">
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h4>Guarantee for work</h4>
                      <div className="border p-3" style={{ height: "110px" }}>
                        <p>{userInfo.work}</p>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <h4>Insurance</h4>
                      <div className="border p-3" style={{ height: "110px" }}>
                        <p>{userInfo.insurance}</p>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12"></div>
                  </div>
                  <br />
                  <p className="h3 mb-3">
                    <b>Project start date:</b> {userInfo.start_date}
                  </p>
                  <p className="h3">
                    <b>Project End date:</b> {userInfo.end_date}
                  </p>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
                <div className="pdf-footer">
                  <p>Powered by FlipkotiPro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PDFView;
