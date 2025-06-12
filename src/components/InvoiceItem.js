import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import "./InvoiceFormCustome.css";

class InvoiceItem extends React.Component {
  render() {
    const { onItemizedItemEdit, currency, onRowDel, items } = this.props;
    return (
      <div>
        <Table responsive bordered hover className="mb-0">
          <thead>
            <tr>
              <th style={{ minWidth: 200 }}>ITEM</th>
              <th style={{ minWidth: 80 }}>QTY</th>
              <th style={{ minWidth: 140 }}>PRICE/RATE</th>
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
        <td style={{ width: "100%" }}>
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
        </td>
        <td style={{ minWidth: "70px" }}>
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
        <td style={{ minWidth: "130px" }}>
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
        <td className="text-center" style={{ minWidth: "50px" }}>
          <BiTrash
            onClick={this.onDelEvent.bind(this)}
            style={{
              height: "33px",
              width: "33px",
              padding: "7.5px",
              cursor: "pointer",
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
