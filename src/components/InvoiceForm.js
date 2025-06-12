import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import {
  BsCalendar,
  BsHash,
  BsBuilding,
  BsPerson,
  BsEnvelope,
  BsGeoAlt,
  BsPlusCircle,
} from "react-icons/bs";
import "./InvoiceFormCustome.css";

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: "$",
      currentDate: "",
      invoiceNumber: 1,
      dateOfIssue: "",
      billTo: "",
      billToEmail: "",
      billToAddress: "",
      billFrom: "",
      billFromEmail: "",
      billFromAddress: "",
      notes: "",
      total: "0.00",
      subTotal: "0.00",
      taxRate: "",
      taxAmmount: "0.00",
      discountRate: "",
      discountAmmount: "0.00",
      shippingCharge: "",
      logo: null,
      logoPreview: null,
      items: [
        {
          id: 0,
          name: "",
          description: "",
          price: "1.00",
          quantity: 1,
        },
      ],
    };
    this.editField = this.editField.bind(this);
  }
  componentDidMount(prevProps) {
    this.handleCalculateTotal();
  }
  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState({ items: this.state.items });
  }
  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var items = {
      id: id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    this.state.items.push(items);
    this.setState({ items: this.state.items });
  }
  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    items.forEach(function (item) {
      subTotal = parseFloat(
        subTotal + parseFloat(item.price).toFixed(2) * parseInt(item.quantity)
      ).toFixed(2);
    });

    this.setState(
      {
        subTotal: parseFloat(subTotal).toFixed(2),
      },
      () => {
        this.setState(
          {
            taxAmmount: parseFloat(
              parseFloat(subTotal) * (this.state.taxRate / 100)
            ).toFixed(2),
          },
          () => {
            this.setState(
              {
                discountAmmount: parseFloat(
                  parseFloat(subTotal) * (this.state.discountRate / 100)
                ).toFixed(2),
              },
              () => {
                this.setState({
                  total:
                    parseFloat(subTotal) -
                    parseFloat(this.state.discountAmmount) +
                    parseFloat(this.state.taxAmmount) +
                    parseFloat(this.state.shippingCharge || 0),
                });
              }
            );
          }
        );
      }
    );
  }
  onItemizedItemEdit(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };
    var items = this.state.items.slice();
    var newItems = items.map(function (itm) {
      for (var key in itm) {
        if (key === item.name && itm.id === item.id) {
          itm[key] = item.value;
        }
      }
      return itm;
    });
    this.setState({ items: newItems });
    this.handleCalculateTotal();
  }
  editField = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.handleCalculateTotal();
  };
  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };
  handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({
        logo: file,
        logoPreview: URL.createObjectURL(file),
      });
    }
  };
  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };
  closeModal = (event) => this.setState({ isOpen: false });
  render() {
    return (
      <div className="invoice-main-card">
        <div className="invoice-left-section">
          {/* Header with Logo and Title */}
          <div className="invoice-header">
            <div className="invoice-logo-upload">
              <div>
                <Form.Label className="fw-bold">Upload Logo:</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={this.handleLogoChange}
                  style={{ maxWidth: "200px" }}
                />
              </div>
              {this.state.logoPreview && (
                <img
                  src={this.state.logoPreview}
                  alt="Logo Preview"
                  className="invoice-logo-preview"
                />
              )}
            </div>
            <div className="invoice-title">Create Invoice</div>
          </div>

          {/* Invoice Meta Row */}
          <div className="invoice-meta-row">
            <div className="invoice-meta-item">
              <BsCalendar className="invoice-meta-icon" />
              <span>
                <span className="fw-bold">Date:</span>&nbsp;
                <span>{new Date().toLocaleDateString()}</span>
              </span>
            </div>
            <div className="invoice-meta-item">
              <BsCalendar className="invoice-meta-icon" />
              <span className="fw-bold d-block me-2">Due:</span>
              <Form.Control
                type="date"
                value={this.state.dateOfIssue}
                name={"dateOfIssue"}
                onChange={(event) => this.editField(event)}
                style={{
                  maxWidth: "150px",
                  marginLeft: "0.7rem",
                  minWidth: "120px",
                }}
                required="required"
              />
            </div>
            <div className="invoice-meta-item">
              <BsHash className="invoice-meta-icon" />
              <span className="fw-bold me-2">#</span>
              <Form.Control
                type="number"
                value={this.state.invoiceNumber}
                name={"invoiceNumber"}
                onChange={(event) => this.editField(event)}
                min="1"
                style={{
                  maxWidth: "70px",
                  marginLeft: "0.7rem",
                }}
                required="required"
              />
            </div>
          </div>

          {/* Billing Section */}
          <div className="invoice-billing-row">
            <div className="invoice-bill-card">
              <div className="invoice-bill-title">
                <BsPerson /> Bill to:
              </div>
              <Form.Control
                placeholder={"Who is this invoice to?"}
                rows={3}
                value={this.state.billTo}
                type="text"
                name="billTo"
                className="my-2"
                onChange={(event) => this.editField(event)}
                autoComplete="name"
                required="required"
              />
              <InputGroup className="mb-2">
                <InputGroup.Text>
                  <BsEnvelope />
                </InputGroup.Text>
                <Form.Control
                  placeholder={"Email address"}
                  value={this.state.billToEmail}
                  type="email"
                  name="billToEmail"
                  onChange={(event) => this.editField(event)}
                  autoComplete="email"
                  required="required"
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>
                  <BsGeoAlt />
                </InputGroup.Text>
                <Form.Control
                  placeholder={"Billing address"}
                  value={this.state.billToAddress}
                  type="text"
                  name="billToAddress"
                  autoComplete="address"
                  onChange={(event) => this.editField(event)}
                  required="required"
                />
              </InputGroup>
            </div>
            <div className="invoice-bill-card">
              <div className="invoice-bill-title">
                <BsBuilding /> Bill from:
              </div>
              <Form.Control
                placeholder={"Who is this invoice from?"}
                rows={3}
                value={this.state.billFrom}
                type="text"
                name="billFrom"
                className="my-2"
                onChange={(event) => this.editField(event)}
                autoComplete="name"
                required="required"
              />
              <InputGroup className="mb-2">
                <InputGroup.Text>
                  <BsEnvelope />
                </InputGroup.Text>
                <Form.Control
                  placeholder={"Email address"}
                  value={this.state.billFromEmail}
                  type="email"
                  name="billFromEmail"
                  onChange={(event) => this.editField(event)}
                  autoComplete="email"
                  required="required"
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>
                  <BsGeoAlt />
                </InputGroup.Text>
                <Form.Control
                  placeholder={"Billing address"}
                  value={this.state.billFromAddress}
                  type="text"
                  name="billFromAddress"
                  autoComplete="address"
                  onChange={(event) => this.editField(event)}
                  required="required"
                />
              </InputGroup>
            </div>
          </div>

          {/* Itemized Items Table */}
          <div className="invoice-items-table">
            <div className="beautiful-add-item-row">
              <div className="beautiful-add-item-label">
                <span>Add an item or service to your invoice</span>
              </div>
              <Button
                className="beautiful-add-btn"
                onClick={this.handleAddEvent.bind(this)}
                variant="outline-primary"
              >
                <BsPlusCircle size={22} className="me-2" />
                Add Item
              </Button>
            </div>
            <InvoiceItem
              onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
              onRowAdd={this.handleAddEvent.bind(this)}
              onRowDel={this.handleRowDel.bind(this)}
              currency={this.state.currency}
              items={this.state.items}
            />
          </div>

          {/* Notes & Terms */}
          <div className="invoice-notes-section custom-notes-section">
            <div className="d-flex align-items-center mb-2">
              <div className="custom-notes-icon me-2">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" fill="#e0e7ff" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#6366f1"
                    fontFamily="Arial"
                    fontWeight="bold"
                    dominantBaseline="middle"
                  >
                    📝
                  </text>
                </svg>
              </div>
              <div className="invoice-notes-title mb-0">Notes</div>
            </div>
            <Form.Control
              placeholder="Thanks for your business!"
              name="notes"
              value={this.state.notes}
              onChange={(event) => this.editField(event)}
              as="textarea"
              className="invoice-notes-field custom-notes-field"
              rows={2}
              aria-label="Invoice notes"
            />
            <div className="d-flex align-items-center mt-4 mb-2">
              <div className="custom-notes-icon me-2">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect
                    width="20"
                    height="20"
                    x="2"
                    y="2"
                    rx="5"
                    fill="#e0e7ff"
                  />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#6366f1"
                    fontFamily="Arial"
                    fontWeight="bold"
                    dominantBaseline="middle"
                  >
                    ⚖️
                  </text>
                </svg>
              </div>
              <div className="invoice-notes-title mb-0">Terms</div>
            </div>
            <Form.Control
              placeholder="For example: Payment is due within 30 days."
              name="terms"
              value={this.state.terms}
              onChange={(event) => this.editField(event)}
              as="textarea"
              className="invoice-terms-field custom-notes-field"
              rows={2}
              aria-label="Invoice terms"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="invoice-sidebar">
          {/* Download Button and Modal */}
          <Button
            variant="success"
            type="submit"
            className="invoice-download-btn"
            onClick={this.openModal}
          >
            Download Invoice
          </Button>
          <InvoiceModal
            showModal={this.state.isOpen}
            closeModal={this.closeModal}
            info={this.state}
            items={this.state.items}
            currency={this.state.currency}
            subTotal={this.state.subTotal}
            taxAmmount={this.state.taxAmmount}
            discountAmmount={this.state.discountAmmount}
            total={this.state.total}
          />
          {/* Summary Card */}
          <div className="invoice-summary-card">
            <div className="invoice-summary-line">
              <span className="invoice-summary-label">Subtotal:</span>
              <span className="invoice-summary-value">
                {this.state.currency}
                {this.state.subTotal}
              </span>
            </div>
            <div className="invoice-summary-line">
              <span className="invoice-summary-label">Discount:</span>
              <span className="invoice-summary-value">
                <span className="small ">
                  ({this.state.discountRate || 0}%)
                </span>
                &nbsp;
                {this.state.currency}
                {this.state.discountAmmount || 0}
              </span>
            </div>
            <div className="invoice-summary-line">
              <span className="invoice-summary-label">Tax:</span>
              <span className="invoice-summary-value">
                <span className="small ">({this.state.taxRate || 0}%)</span>
                &nbsp;
                {this.state.currency}
                {this.state.taxAmmount || 0}
              </span>
            </div>
            <div className="invoice-summary-line">
              <span className="invoice-summary-label">Shipping:</span>
              <span className="invoice-summary-value">
                {this.state.currency}
                {this.state.shippingCharge || "0.00"}
              </span>
            </div>
            <hr className="invoice-divider" />
            <div className="invoice-summary-line invoice-total-line">
              <span>Total:</span>
              <span>
                {this.state.currency}
                {this.state.total || 0}
              </span>
            </div>
          </div>
          {/* Sidebar Controls */}
          <div className="invoice-sidebar-controls">
            <Form.Group className="form-group">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) =>
                  this.onCurrencyChange({ currency: event.target.value })
                }
                className="invoice-currency-select"
                aria-label="Change Currency"
                value={this.state.currency}
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="€">EUR (Euro - European Union)</option>
                <option value="₹">INR (Indian Rupee)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="C$">CAD (Canadian Dollar)</option>
                <option value="A$">AUD (Australian Dollar)</option>
                <option value="S$">SGD (Singapore Dollar)</option>
                <option value="¥">CNY (Chinese Yuan Renminbi)</option>
                <option value="₩">KRW (South Korean Won)</option>
                <option value="₽">RUB (Russian Ruble)</option>
                <option value="R$">BRL (Brazilian Real)</option>
                <option value="R">ZAR (South African Rand)</option>
                <option value="₺">TRY (Turkish Lira)</option>
                <option value="₪">ILS (Israeli New Shekel)</option>
                <option value="د.إ">AED (UAE Dirham)</option>
                <option value="₫">VND (Vietnamese Dong)</option>
                <option value="฿">THB (Thai Baht)</option>
                <option value="₱">PHP (Philippine Peso)</option>
                <option value="CHF">CHF (Swiss Franc)</option>
                <option value="kr">SEK (Swedish Krona)</option>
                <option value="kr">NOK (Norwegian Krone)</option>
                <option value="kr">DKK (Danish Krone)</option>
                <option value="zł">PLN (Polish Zloty)</option>
                <option value="Ft">HUF (Hungarian Forint)</option>
                <option value="Kč">CZK (Czech Koruna)</option>
                <option value="₦">NGN (Nigerian Naira)</option>
                <option value="₡">CRC (Costa Rican Colon)</option>
                <option value="₲">PYG (Paraguayan Guarani)</option>
                <option value="₴">UAH (Ukrainian Hryvnia)</option>
                <option value="лв">BGN (Bulgarian Lev)</option>
                <option value="RON">RON (Romanian Leu)</option>
                <option value="₸">KZT (Kazakhstani Tenge)</option>
                <option value="د.م.">MAD (Moroccan Dirham)</option>
                <option value="₺">TRY (Turkish Lira)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={this.state.taxRate}
                  onChange={(event) => this.editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={this.state.discountRate}
                  onChange={(event) => this.editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label className="fw-bold">Shipping charge:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="shippingCharge"
                  type="number"
                  value={this.state.shippingCharge}
                  onChange={(event) => this.editField(event)}
                  className="bg-white border"
                  placeholder="0.00"
                  min="0.00"
                  step="0.01"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  {this.state.currency}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
