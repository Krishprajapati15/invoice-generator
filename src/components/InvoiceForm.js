import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: "₹",
      currentDate: "",
      invoiceNumber: 1,
      dateOfIssue: "",
      billTo: "",
      billToEmail: "",
      billToAddress: "",
      // Fixed company details for all invoices
      billFrom: "VD Foods",
      billFromEmail: "vdfoods77@gmail.com",
      billFromAddress: "Mo: 9104029941",
      notes:
        "Thank you for choosing VD FOODS. We truly appreciate your trust in us  your support inspires us to deliver the finest spices and purest oils from tradition to your kitchen.",
      total: "0.00",
      subTotal: "0.00",
      taxRate: "",
      taxAmmount: "0.00",
      discountRate: "",
      discountAmmount: "0.00",
      shippingCharge: "",
      // Default logo from public folder
      logo: `${process.env.PUBLIC_URL}/logo.png`,
      logoPreview: `${process.env.PUBLIC_URL}/logo.png`,
    };
    this.state.items = [
      {
        id: 0,
        name: "",
        description: "",
        price: "", // Changed to empty string instead of "1.00"
        quantity: 1,
      },
    ];
    this.editField = this.editField.bind(this);
    this.handleRowDel = this.handleRowDel.bind(this);
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.onItemizedItemEdit = this.onItemizedItemEdit.bind(this);
  }

  componentDidMount() {
    this.handleCalculateTotal();
  }

  // Add componentDidUpdate to recalculate when items change
  componentDidUpdate(prevProps, prevState) {
    // Only recalculate if items, tax rate, discount rate, or shipping charge changed
    if (
      prevState.items !== this.state.items ||
      prevState.taxRate !== this.state.taxRate ||
      prevState.discountRate !== this.state.discountRate ||
      prevState.shippingCharge !== this.state.shippingCharge
    ) {
      this.handleCalculateTotal();
    }
  }

  handleRowDel(items) {
    var index = this.state.items.indexOf(items);
    if (index !== -1) {
      const newItems = [...this.state.items];
      newItems.splice(index, 1);
      this.setState({ items: newItems }, () => {
        this.handleCalculateTotal();
      });
    }
  }

  handleAddEvent(evt) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var newItem = {
      id: id,
      name: "",
      price: "", // Changed to empty string
      description: "",
      quantity: 1,
    };
    const newItems = [...this.state.items, newItem];
    this.setState({ items: newItems }, () => {
      this.handleCalculateTotal();
    });
  }

  handleCalculateTotal() {
    var items = this.state.items;
    var subTotal = 0;

    // Fixed the calculation logic
    items.forEach(function (item) {
      const price = parseFloat(item.price) || 0; // Handle empty price
      const quantity = parseInt(item.quantity) || 0;
      subTotal += price * quantity;
    });

    subTotal = parseFloat(subTotal.toFixed(2));

    // Calculate tax amount
    const taxRate = parseFloat(this.state.taxRate) || 0;
    const taxAmount = parseFloat((subTotal * (taxRate / 100)).toFixed(2));

    // Calculate discount amount
    const discountRate = parseFloat(this.state.discountRate) || 0;
    const discountAmount = parseFloat(
      (subTotal * (discountRate / 100)).toFixed(2)
    );

    // Calculate shipping charge
    const shippingCharge = parseFloat(this.state.shippingCharge) || 0;

    // Calculate total
    const total = parseFloat(
      (subTotal - discountAmount + taxAmount + shippingCharge).toFixed(2)
    );

    this.setState({
      subTotal: subTotal.toFixed(2),
      taxAmmount: taxAmount.toFixed(2),
      discountAmmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    });
  }

  onItemizedItemEdit(evt) {
    const item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value,
    };

    const items = [...this.state.items]; // Create a copy
    const newItems = items.map(function (currentItem) {
      if (currentItem.id == item.id) {
        return {
          ...currentItem,
          [item.name]: item.value,
        };
      }
      return currentItem;
    });

    this.setState({ items: newItems }, () => {
      this.handleCalculateTotal();
    });
  }

  editField = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        this.handleCalculateTotal();
      }
    );
  };

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = (event) => this.setState({ isOpen: false });

  render() {
    return (
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="container py-4">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-black mb-2">
              Invoice Generator
            </h1>
            <p className="lead text-muted">
              Create professional invoices for VD Foods
            </p>
          </div>

          <Form onSubmit={this.openModal}>
            <Row className="g-4">
              {/* Main Invoice Form */}
              <Col xl={8} lg={7}>
                {/* Company Logo Section */}
                <Card
                  className="shadow-sm border-0 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center text-white">
                      {this.state.logoPreview && (
                        <img
                          src={this.state.logoPreview}
                          alt="VD Foods Logo"
                          style={{
                            maxHeight: 60,
                            marginRight: 20,
                            padding: "8px",
                            background: "rgba(255,255,255,0.9)",
                            borderRadius: "12px",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            console.warn("Logo failed to load:", e.target.src);
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <h3 className="mb-1 fw-bold">VD FOODS</h3>
                        <p className="mb-0 opacity-75">
                          Premium Quality Food Products
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Invoice Details Card */}
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Body className="p-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                      <div>
                        <div className="mb-3">
                          <span className="fw-bold text-primary">
                            Current Date:{" "}
                          </span>
                          <span className="badge bg-light text-dark fs-6">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <label className="fw-bold text-primary me-3">
                            Due Date:
                          </label>
                          <Form.Control
                            type="date"
                            value={this.state.dateOfIssue}
                            name={"dateOfIssue"}
                            onChange={(event) => this.editField(event)}
                            style={{ maxWidth: "180px" }}
                            className="border-2"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="text-end">
                        <label className="fw-bold text-primary d-block mb-2">
                          Invoice Number
                        </label>
                        <Form.Control
                          type="number"
                          value={this.state.invoiceNumber}
                          name={"invoiceNumber"}
                          onChange={(event) => this.editField(event)}
                          min="1"
                          style={{ maxWidth: "120px" }}
                          className="text-center fs-5 fw-bold border-2 border-primary"
                          required="required"
                        />
                      </div>
                    </div>

                    <hr
                      className="my-4"
                      style={{ borderTop: "2px solid #e9ecef" }}
                    />

                    {/* Billing Information */}
                    <Row className="g-4">
                      {/* Bill To Section */}
                      <Col lg={6}>
                        <div className="h-100 p-3 bg-white rounded-3 border border-success">
                          <h5 className="fw-bold text-primary mb-3">
                            <i className="fas fa-user me-2"></i>Bill To
                          </h5>
                          <Form.Control
                            placeholder="Customer Name"
                            value={this.state.billTo}
                            type="text"
                            name="billTo"
                            className="mb-3 border-2"
                            onChange={(event) => this.editField(event)}
                            autoComplete="name"
                            required="required"
                          />
                          <Form.Control
                            placeholder="Customer Email"
                            value={this.state.billToEmail}
                            type="email"
                            name="billToEmail"
                            className="mb-3 border-2"
                            onChange={(event) => this.editField(event)}
                            autoComplete="email"
                            required="required"
                          />
                          <Form.Control
                            placeholder="Customer Address"
                            value={this.state.billToAddress}
                            type="text"
                            name="billToAddress"
                            className="border-2"
                            autoComplete="address"
                            onChange={(event) => this.editField(event)}
                            required="required"
                          />
                        </div>
                      </Col>

                      {/* Bill From Section - Fixed Details */}
                      <Col lg={6}>
                        <div
                          className="h-100 p-3"
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                          }}
                        >
                          <h5 className="fw-bold text-white mb-3">
                            <i className="fas fa-building me-2"></i>Bill From
                          </h5>
                          <div className="text-Black">
                            <div className="mb-2 p-2 bg-white bg-opacity-20 rounded">
                              <strong>VD FOODS</strong>
                            </div>
                            <div className="mb-2 p-2 bg-white bg-opacity-20 rounded">
                              vdfoods77@gmail.com
                            </div>
                            <div className="p-2 bg-white bg-opacity-20 rounded">
                              Mo: 9104029941
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Items Section */}
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-info text-white py-3">
                    <h5 className="mb-0 fw-bold">
                      <i className="fas fa-list me-2"></i>Invoice Items
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <InvoiceItem
                      onItemizedItemEdit={this.onItemizedItemEdit}
                      onRowAdd={this.handleAddEvent}
                      onRowDel={this.handleRowDel}
                      currency={this.state.currency}
                      items={this.state.items}
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* Sidebar */}
              <Col xl={4} lg={5}>
                <div className="sticky-top" style={{ top: "20px" }}>
                  {/* Invoice Summary */}
                  <Card className="shadow-sm border-0 mb-4">
                    <Card.Header className="bg-success text-white py-3">
                      <h6 className="mb-0 fw-bold">Invoice Summary</h6>
                    </Card.Header>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span className="fw-bold">
                          {this.state.currency}
                          {this.state.subTotal}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Discount:</span>
                        <span>
                          <small className="text-muted">
                            ({this.state.discountRate || 0}%)
                          </small>
                          <span className="fw-bold ms-2">
                            {this.state.currency}
                            {this.state.discountAmmount || 0}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <span>
                          <small className="text-muted">
                            ({this.state.taxRate || 0}%)
                          </small>
                          <span className="fw-bold ms-2">
                            {this.state.currency}
                            {this.state.taxAmmount || 0}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Shipping:</span>
                        <span className="fw-bold">
                          {this.state.currency}
                          {this.state.shippingCharge || "0.00"}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fs-5 fw-bold text-primary">
                          Total:
                        </span>
                        <span className="fs-5 fw-bold text-success">
                          {this.state.currency}
                          {this.state.total || 0}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Settings Card */}
                  <Card className="shadow-sm border-0">
                    <Card.Header className="bg-info text-white py-3">
                      <h6 className="mb-0 fw-bold">Invoice Settings</h6>
                    </Card.Header>
                    <Card.Body className="p-3">
                      {/* Currency Display */}
                      <div className="mb-3">
                        <Form.Label className="fw-bold text-primary">
                          Currency:
                        </Form.Label>
                        <div className="p-3 bg-light rounded text-center">
                          <strong className="text-success fs-5">
                            ₹ Indian Rupee
                          </strong>
                        </div>
                      </div>

                      {/* Tax Rate */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-primary">
                          Tax Rate:
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            name="taxRate"
                            type="number"
                            value={this.state.taxRate}
                            onChange={(event) => this.editField(event)}
                            placeholder="0.0"
                            min="0.00"
                            step="0.01"
                            max="100.00"
                          />
                          <InputGroup.Text className="bg-primary text-white fw-bold">
                            %
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {/* Discount Rate */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-primary">
                          Discount Rate:
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            name="discountRate"
                            type="number"
                            value={this.state.discountRate}
                            onChange={(event) => this.editField(event)}
                            placeholder="0.0"
                            min="0.00"
                            step="0.01"
                            max="100.00"
                          />
                          <InputGroup.Text className="bg-warning text-white fw-bold">
                            %
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {/* Shipping Charge */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-primary">
                          Shipping Charge:
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-info text-white fw-bold">
                            {this.state.currency}
                          </InputGroup.Text>
                          <Form.Control
                            name="shippingCharge"
                            type="number"
                            value={this.state.shippingCharge}
                            onChange={(event) => this.editField(event)}
                            placeholder="0.00"
                            min="0.00"
                            step="0.01"
                          />
                        </InputGroup>
                      </Form.Group>

                      {/* Notes Section */}
                      <Form.Group>
                        <Form.Label className="fw-bold text-primary">
                          Notes:
                        </Form.Label>
                        <Form.Control
                          name="notes"
                          value={this.state.notes}
                          onChange={(event) => this.editField(event)}
                          as="textarea"
                          rows={3}
                          className="border-2"
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
            <Card className="shadow-sm border-0 mb-4 mt-4">
              <Card.Body className="text-center p-4">
                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="w-100 py-3 fw-bold"
                  style={{ borderRadius: "12px" }}
                >
                  <i className="fas fa-download me-2"></i>
                  Generate Invoice
                </Button>
              </Card.Body>
            </Card>
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
          </Form>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
