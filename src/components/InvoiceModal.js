import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function GenerateInvoice() {
  const element = document.querySelector("#invoiceCapture");
  if (!element) return;

  // Store original styles
  const originalStyles = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    width: element.style.width,
    transform: element.style.transform,
    zIndex: element.style.zIndex,
    backgroundColor: element.style.backgroundColor,
  };

  // Apply fixed desktop layout styles for PDF generation
  const desktopStyles = {
    position: "fixed",
    left: "50%",
    top: "50%",
    width: "800px", // Fixed width for consistent layout
    transform: "translate(-50%, -50%)",
    zIndex: "9999",
    backgroundColor: "white",
  };

  // Apply desktop styles
  Object.assign(element.style, desktopStyles);

  // Force layout recalculation
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight;

  // Wait a bit for layout to settle
  setTimeout(() => {
    html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      logging: false,
      width: 800,
      height: element.scrollHeight,
      windowWidth: 800,
      windowHeight: element.scrollHeight,
    })
      .then((canvas) => {
        // Restore original styles immediately after capture
        Object.assign(element.style, originalStyles);

        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: [612, 792],
        });

        pdf.internal.scaleFactor = 1;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Handle multi-page PDFs if content is too tall
        if (pdfHeight > pdf.internal.pageSize.getHeight()) {
          let position = 0;
          const pageHeight = pdf.internal.pageSize.getHeight();

          while (position < pdfHeight) {
            pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
            position += pageHeight;

            if (position < pdfHeight) {
              pdf.addPage();
            }
          }
        } else {
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save("invoice-001.pdf");
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        // Restore original styles on error
        Object.assign(element.style, originalStyles);
      });
  }, 100);
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoLoaded: false,
    };
  }

  handleLogoLoad = () => {
    this.setState({ logoLoaded: true });
  };

  handleLogoError = (e) => {
    console.warn("Logo failed to load:", e.target.src);
    e.target.style.display = "none";
  };

  render() {
    return (
      <div>
        <Modal
          show={this.props.showModal}
          onHide={this.props.closeModal}
          size="lg"
          centered
        >
          <div id="invoiceCapture" className="invoice-pdf-container">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              {/* Logo and BillFrom Section */}
              <div className="w-100 d-flex align-items-start invoice-header-content">
                {/* Logo Preview - Enhanced with better error handling */}
                {this.props.info.logoPreview && (
                  <div
                    className="invoice-logo-container"
                    style={{ marginRight: 24, minWidth: 120 }}
                  >
                    <img
                      src={this.props.info.logoPreview}
                      alt="Company Logo"
                      className="invoice-logo"
                      style={{
                        maxHeight: 64,
                        maxWidth: 120,
                        borderRadius: 6,
                        objectFit: "contain",
                        background: "#fff",
                        padding: "4px",
                        border: "1px solid #e0e0e0",
                        display: "block",
                      }}
                      onLoad={this.handleLogoLoad}
                      onError={this.handleLogoError}
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                <div className="invoice-header-text">
                  <h4 className="fw-bold my-2 invoice-company-name">
                    {this.props.info.billFrom || "John Uberbacher"}
                  </h4>
                  <h6 className="fw-bold text-secondary mb-1 invoice-number">
                    Invoice #: {this.props.info.invoiceNumber || ""}
                  </h6>
                </div>
              </div>
              <div className="text-end ms-4 invoice-amount-due">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {this.props.currency} {this.props.total}
                </h5>
              </div>
            </div>
            <div className="p-4 invoice-content">
              <Row className="mb-4 invoice-billing-info">
                <Col md={4} className="invoice-bill-to">
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo || ""}</div>
                  <div>{this.props.info.billToAddress || ""}</div>
                  <div>{this.props.info.billToEmail || ""}</div>
                </Col>
                <Col md={4} className="invoice-bill-from">
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom || ""}</div>
                  <div>{this.props.info.billFromAddress || ""}</div>
                  <div>{this.props.info.billFromEmail || ""}</div>
                </Col>
                <Col md={4} className="invoice-date">
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{this.props.info.dateOfIssue || ""}</div>
                </Col>
              </Row>
              <Table className="mb-0 invoice-items-table">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>QTY</th>
                    <th style={{ width: "50%" }}>DESCRIPTION</th>
                    <th className="text-end" style={{ width: "20%" }}>
                      PRICE
                    </th>
                    <th className="text-end" style={{ width: "20%" }}>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td>{item.quantity}</td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end">
                          {this.props.currency} {item.price}
                        </td>
                        <td className="text-end">
                          {this.props.currency}{" "}
                          {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table className="invoice-totals-table">
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      SUBTOTAL
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {this.props.currency} {this.props.subTotal}
                    </td>
                  </tr>
                  {this.props.taxAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        TAX
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.taxAmmount}
                      </td>
                    </tr>
                  )}
                  {this.props.discountAmmount != 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>
                        DISCOUNT
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {this.props.currency} {this.props.discountAmmount}
                      </td>
                    </tr>
                  )}
                  {this.props.info.shippingCharge &&
                    parseFloat(this.props.info.shippingCharge) !== 0 && (
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          SHIPPING
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          {this.props.currency}{" "}
                          {parseFloat(this.props.info.shippingCharge).toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    )}
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>
                      TOTAL
                    </td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {this.props.currency} {this.props.total}
                    </td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes && (
                <div
                  className="invoice-notes"
                  style={{
                    background:
                      "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
                    border: "1px solid #28a745",
                    borderRadius: "12px",
                  }}
                >
                  <div className="py-3 px-4 mt-3">
                    <div className="fw-bold mb-2 text-success">
                      <i className="fas fa-sticky-note me-2"></i>Thank You Note:
                    </div>
                    <div className="text-success">{this.props.info.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button
                  variant="success"
                  className="d-block w-100 mt-3 mt-md-0"
                  onClick={GenerateInvoice}
                >
                  <BiCloudDownload
                    style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                    className="me-2"
                  />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* CSS for PDF consistency */}
        <style jsx>{`
          /* Desktop-specific styles for PDF generation */
          .invoice-pdf-container {
            min-width: 800px;
          }

          /* Ensure consistent layout during PDF generation */
          @media print {
            .invoice-pdf-container {
              width: 800px !important;
              min-width: 800px !important;
            }

            .invoice-header-content {
              display: flex !important;
              flex-direction: row !important;
            }

            .invoice-billing-info {
              display: flex !important;
            }

            .invoice-billing-info > div {
              flex: 1 !important;
            }

            .invoice-items-table,
            .invoice-totals-table {
              width: 100% !important;
            }
          }
        `}</style>
        <hr className="mt-4 mb-3" />
      </div>
    );
  }
}

export default InvoiceModal;
