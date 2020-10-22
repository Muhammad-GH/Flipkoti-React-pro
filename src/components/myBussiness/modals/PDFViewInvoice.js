import React from "react";
import { Helper, url } from "../../../helper/helper";

const PDFViewInvoice = ({ businessInfo, userInfo }) => {
  return (
    <div
      className="modal fade"
      id="preview-info"
      tabIndex={-1}
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
              <span aria-hidden="true">×</span>
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
                          <p className="mb-2">
                            <b>Bill to</b>
                          </p>
                          Salarem
                          <br />
                          {userInfo.client_id}
                          <br />
                        </address>
                      </div>
                      <div className="col-md-12 col-lg-4" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="float-md-right float-sm-none">
                      <h2>Invoice</h2>
                      <address>
                        Invoice no: {userInfo.invoice_number}
                        <br />
                        Invoice date: {userInfo.date}
                        <br />
                        Reference: {userInfo.reference}
                        <br />
                        Account number: {userInfo.acc_no}
                        <br />
                        Payment duration: {userInfo.pay_term}
                        <br />
                        Due date: {userInfo.due_date}
                        <br />
                        Delay Interest: {userInfo.interest}%
                      </address>
                      <div className="due-amount">
                        <h5>Amount due</h5>
                        <span className="price">
                          {userInfo.left} {userInfo.totalInput} {userInfo.right}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pdf-content">
                <div className="table-responsive-md">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <h3 className="m-0">Description</h3>
                        </th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>
                          <h3 className="m-0">Amount</h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userInfo.itemsInput
                        ? JSON.parse(userInfo.itemsInput).map((item) => (
                            <tr>
                              <td>{item.items}</td>
                              <td>{item.qty}</td>
                              <td>{item.unit}</td>
                              <td>{item.price}</td>
                              <td>
                                {userInfo.left} {item.amount} {userInfo.right}
                              </td>
                            </tr>
                          ))
                        : null}

                      <tr>
                        <td colSpan={6} style={{ padding: "0 !important" }}>
                          <table
                            className="table table-bordered"
                            style={{
                              width: "initial",
                              float: "right",
                              marginTop: 0,
                            }}
                          >
                            <tbody>
                              <tr>
                                <td />
                                <td>Subtotal</td>
                                <td>
                                  {userInfo.left} {userInfo.subInput}{" "}
                                  {userInfo.right}
                                </td>
                              </tr>
                              <tr>
                                <td>Vat</td>
                                <td>{userInfo.taxInput}%</td>
                                <td>
                                  {userInfo.left} {userInfo.taxCalcInput}{" "}
                                  {userInfo.right}
                                </td>
                              </tr>
                              <tr>
                                <td />
                                <td>Total</td>
                                <td>
                                  <b>
                                    {userInfo.left} {userInfo.totalInput}{" "}
                                    {userInfo.right}
                                  </b>{" "}
                                         
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
                <br />
                <br />
                <div className="row">
                  <div className="col-md-6">
                    <h4>Notes</h4>
                    <p>{userInfo.note} </p>
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                  <div className="col-md-6">
                    <h4>Terms &amp; Condition </h4>
                    <p>{userInfo.terms}</p>
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
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
};

export default PDFViewInvoice;
