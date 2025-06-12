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
        <Table responsive bordered hover className="mb-0">
          <thead>
            <tr>
              <th className="text-center" style={{ minWidth: 200 }}>
                ITEM
              </th>
              <th className="text-center" style={{ minWidth: 80 }}>
                QTY
              </th>
              <th className="text-center" style={{ minWidth: 140 }}>
                PRICE/RATE
              </th>
              <th className="text-center" style={{ minWidth: 70 }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow
                onItemizedItemEdit={onItemizedItemEdit}
                item={item}
                onDelEvent={onRowDel}
                key={item.id}
                currency={currency}
              />
            ))}
            <tr>
              <td colSpan={4} className="p-2 text-center">
                <button
                  type="button"
                  onClick={onRowAdd}
                  style={{
                    background: "#e0e7ef",
                    color: "#3a6ea5",
                    border: "none",
                    padding: "8px 22px",
                    borderRadius: "20px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "1rem",
                    transition: "background 0.18s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#c7d5e7")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#e0e7ef")
                  }
                >
                  <BiPlusCircle size={22} className="me-2" />
                  Add Item
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
  render() {
    return (
      <tr>
        <td style={{ width: "100%", padding: "14px 12px" }}>
          <div style={{ marginBottom: "7px" }}>
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "name",
                placeholder: "Item name",
                value: this.props.item.name,
                id: this.props.item.id,
              }}
            />
          </div>
          <div>
            <EditableField
              onItemizedItemEdit={this.props.onItemizedItemEdit}
              cellData={{
                type: "text",
                name: "description",
                placeholder: "Item description",
                value: this.props.item.description,
                id: this.props.item.id,
              }}
            />
          </div>
        </td>
        <td
          className="text-center"
          style={{ minWidth: "70px", padding: "14px 10px" }}
        >
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              type: "number",
              name: "quantity",
              min: 1,
              step: "1",
              value: this.props.item.quantity,
              id: this.props.item.id,
            }}
          />
        </td>
        <td
          className="text-center"
          style={{ minWidth: "130px", padding: "14px 10px" }}
        >
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              leading: this.props.currency,
              type: "number",
              name: "price",
              min: 1,
              step: "0.01",
              presicion: 2,
              textAlign: "text-end",
              value: this.props.item.price,
              id: this.props.item.id,
            }}
          />
        </td>
        <td
          className="text-center"
          style={{ minWidth: "50px", padding: "10px" }}
        >
          <BiTrash
            onClick={this.onDelEvent.bind(this)}
            style={{
              height: "33px",
              width: "33px",
              padding: "7.5px",
              margin: "0 auto",
              cursor: "pointer",
              display: "block",
            }}
            className="text-white mt-1 btn btn-danger"
            title="Delete"
          />
        </td>
      </tr>
    );
  }
}

export default InvoiceItem;
