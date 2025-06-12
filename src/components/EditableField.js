import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

class EditableField extends React.Component {
  render() {
    const { cellData, onItemizedItemEdit } = this.props;
    const {
      leading,
      type = "text",
      placeholder = "",
      min,
      max,
      step,
      name,
      id,
      value,
      textAlign,
    } = cellData;

    // Ensure the value is never undefined or null for controlled input
    const inputValue = value === undefined || value === null ? "" : value;

    return (
      <InputGroup className="my-1 flex-nowrap">
        {leading != null && (
          <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
            <span
              className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small"
              style={{ width: "20px", height: "20px" }}
            >
              {leading}
            </span>
          </InputGroup.Text>
        )}
        <Form.Control
          className={textAlign}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          name={name}
          id={id}
          value={inputValue}
          step={step}
          aria-label={name}
          onChange={onItemizedItemEdit}
          required
          autoComplete="off"
        />
      </InputGroup>
    );
  }
}

export default EditableField;
