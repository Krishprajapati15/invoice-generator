import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { BiTrash, BiPlusCircle } from "react-icons/bi";
import EditableField from "./EditableField";

class InvoiceItem extends React.Component {
  render() {
    const { onItemizedItemEdit, currency, onRowDel, items, onRowAdd } =
      this.props;
    return (
      <div className="invoice-item-table-wrapper">
        <Table responsive hover className="mb-0" style={{ background: "#fff" }}>
          <thead
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <tr>
              <th
                className="text-center text-white py-3"
                style={{ minWidth: 200, fontWeight: "600" }}
              >
                <i className="fas fa-box me-2"></i>ITEM DETAILS
              </th>
              <th
                className="text-center text-white py-3"
                style={{ minWidth: 80, fontWeight: "600" }}
              >
                <i className="fas fa-sort-numeric-up me-2"></i>QTY
              </th>
              <th
                className="text-center text-white py-3"
                style={{ minWidth: 140, fontWeight: "600" }}
              >
                <i className="fas fa-rupee-sign me-2"></i>PRICE/RATE
              </th>
              <th
                className="text-center text-white py-3"
                style={{ minWidth: 100, fontWeight: "600" }}
              >
                <i className="fas fa-calculator "></i>AMOUNT
              </th>
              <th
                className="text-center text-white py-3"
                style={{ minWidth: 70, fontWeight: "600" }}
              >
                <i className="fas fa-cog me-2"></i>ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <ItemRow
                onItemizedItemEdit={onItemizedItemEdit}
                item={item}
                onDelEvent={onRowDel}
                key={item.id}
                currency={currency}
                index={index}
              />
            ))}
            <tr
              style={{
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              }}
            >
              <td colSpan={5} className="p-4 text-center">
                <button
                  type="button"
                  onClick={onRowAdd}
                  style={{
                    background:
                      "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "25px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <BiPlusCircle size={20} className="me-2" />
                  Add New Item
                </button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

class ItemRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.item);
  }

  calculateAmount() {
    const price = parseFloat(this.props.item.price) || 0;
    const quantity = parseInt(this.props.item.quantity) || 0;
    return (price * quantity).toFixed(2);
  }

  render() {
    const { item, index } = this.props;
    const rowBg = index % 2 === 0 ? "#ffffff" : "#f8f9fa";

    return (
      <tr style={{ backgroundColor: rowBg, transition: "all 0.2s ease" }}>
        <td style={{ width: "100%", padding: "16px 14px" }}>
          <div style={{ marginBottom: "8px" }}>
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "name",
                placeholder: "Enter item name (e.g., Termaric)",
                value: item.name,
                id: item.id,
              }}
            />
          </div>
          <div>
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "description",
                placeholder:
                  "Enter item description (e.g., 1kg pack, premium quality)",
                value: item.description,
                id: item.id,
              }}
            />
          </div>
        </td>
        <td
          className="text-center"
          style={{ minWidth: "70px", padding: "16px 12px" }}
        >
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              type: "number",
              name: "quantity",
              min: 1,
              step: "1",
              placeholder: "1",
              value: item.quantity,
              id: item.id,
            }}
          />
        </td>
        <td
          className="text-center"
          style={{ minWidth: "130px", padding: "16px 12px" }}
        >
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              leading: this.props.currency,
              type: "number",
              name: "price",
              min: 0,
              step: "0.01",
              precision: 2,
              textAlign: "text-end",
              placeholder: "0.00",
              value: item.price, // This will be empty initially
              id: item.id,
            }}
          />
        </td>
        <td
          className="text-center align-middle"
          style={{ minWidth: "100px", padding: "16px 12px" }}
        >
          <div
            className="fw-bold p-2 rounded"
            style={{
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              color: "#1976d2",
              fontSize: "0.95rem",
            }}
          >
            {this.props.currency}
            {this.calculateAmount()}
          </div>
        </td>
        <td
          className="text-center"
          style={{ minWidth: "50px", padding: "12px" }}
        >
          <BiTrash
            onClick={this.onDelEvent.bind(this)}
            style={{
              height: "36px",
              width: "36px",
              padding: "8px",
              margin: "0 auto",
              cursor: "pointer",
              display: "block",
              borderRadius: "50%",
              transition: "all 0.2s ease",
            }}
            className="text-white bg-danger"
            title="Delete Item"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(220, 53, 69, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </td>
      </tr>
    );
  }
}

export default InvoiceItem;
