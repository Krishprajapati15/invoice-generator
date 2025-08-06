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
      textAlign = "",
      precision,
    } = cellData;

    // For price fields, allow empty values, for others ensure they're not undefined/null
    let inputValue;
    if (name === "price") {
      inputValue =
        value === undefined || value === null || value === "" ? "" : value;
    } else {
      inputValue = value === undefined || value === null ? "" : value;
    }

    const handleChange = (event) => {
      if (onItemizedItemEdit) {
        onItemizedItemEdit(event);
      }
    };

    return (
      <InputGroup className="my-1 flex-nowrap">
        {leading != null && (
          <InputGroup.Text
            className="fw-bold border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px 0 0 8px",
              minWidth: "45px",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>{leading}</span>
          </InputGroup.Text>
        )}
        <Form.Control
          className={`border-2 ${textAlign} ${
            leading ? "rounded-start-0" : ""
          }`}
          style={{
            borderColor: "#e3f2fd",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            borderRadius: leading ? "0 8px 8px 0" : "8px",
          }}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          name={name}
          id={id}
          value={inputValue}
          onChange={handleChange}
          onFocus={(e) => {
            e.target.style.borderColor = "#667eea";
            e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e3f2fd";
            e.target.style.boxShadow = "none";
          }}
          // Add precision handling for number inputs
          {...(precision &&
            type === "number" && {
              onBlur: (e) => {
                if (e.target.value && !isNaN(e.target.value)) {
                  const formattedValue = parseFloat(e.target.value).toFixed(
                    precision
                  );
                  e.target.value = formattedValue;
                  // Trigger the change event with formatted value
                  const syntheticEvent = {
                    target: {
                      ...e.target,
                      value: formattedValue,
                      name: name,
                      id: id,
                    },
                  };
                  handleChange(syntheticEvent);
                }
                e.target.style.borderColor = "#e3f2fd";
                e.target.style.boxShadow = "none";
              },
            })}
        />
      </InputGroup>
    );
  }
}

export default EditableField;
