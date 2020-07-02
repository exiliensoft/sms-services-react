import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { updateField_Values } from "../../reducers/contact/contact.actions";
function ProfileInputs(props) {
  const [fields, setFields] = useState(
    props.fields
      ? props.fields.map((field) => {
          if (
            props.fieldValues.find(
              (fieldValue) => fieldValue._field == field.id
            )
          ) {
            return {
              fieldName: field.fieldName,
              options: field.options,
              new: false,
              fieldValue: props.fieldValues.filter(
                (fieldValue) => fieldValue._field == field.id
              )[0].value,
              fieldValueId: props.fieldValues.filter(
                (fieldValue) => fieldValue._field == field.id
              )[0].id,
              type: field.type,
            };
          }
          return {
            fieldName: field.fieldName,
            options: field.options,
            new: true,
            fieldValue: "",
            type: field.type,
          };
        })
      : []
  );

  useEffect(() => {
    setFields(
      props.fields
        ? props.fields.map((field) => {
            if (
              props.fieldValues.find(
                (fieldValue) => fieldValue._field == field.id
              )
            ) {
              return {
                fieldName: field.fieldName,
                options: field.options,
                new: false,
                fieldValue: props.fieldValues.filter(
                  (fieldValue) => fieldValue._field == field.id
                )[0].value,
                fieldId: field.id,
                fieldValueId: props.fieldValues.filter(
                  (fieldValue) => fieldValue._field == field.id
                )[0].id,
                type: field.type,
              };
            }
            return {
              fieldName: field.fieldName,
              options: field.options,
              new: true,
              fieldValue: "",
              fieldId: field.id,
              type: field.type,
            };
          })
        : []
    );
  }, [props.fieldsValues, props.fields]);

  const handleChange = (id, e) => {
    let fieldValue = e.target.value;
    setFields((fields) => {
      return fields.map((field) => {
        if (field.fieldId != id) {
          return field;
        }
        if (field.type == 2 && isNaN(fieldValue)) {
          return field;
        }
        return Object.assign(fields.filter((field) => field.fieldId == id)[0], {
          fieldValue: fieldValue,
        });
      });
    });
  };

  const getFieldInput = (field) => {
    if (field.type == 3) {
      return (
        <>
          <label className="col-form-label">{field.fieldName}</label>
          <select
            name={field.fieldName}
            className="form-control"
            onChange={(e) => handleChange(field.fieldId, e)}
          >
            <option
              key={""}
              value={""}
              selected={!field.fieldValue || field.fieldValue == ""}
            >
              None
            </option>
            {field.fieldValue != "" &&
              !field.options.includes(field.fieldValue) && (
                <option
                  key={field.fieldValue}
                  value={field.fieldValue}
                  selected={true}
                >
                  {field.fieldValue}
                </option>
              )}
            {field.options.map((option) => (
              <option
                key={option}
                value={option}
                selected={field.fieldValue == option}
              >
                {option}
              </option>
            ))}
          </select>
        </>
      );
    }
    return (
      <>
        <label className="col-form-label">{field.fieldName}</label>
        <input
          type="text"
          value={field.fieldValue}
          className="form-control"
          placeholder={field.fieldName}
          onChange={(e) => handleChange(field.fieldId, e)}
        />
      </>
    );
  };
  return (
    <div>
      <form>
        <div className="form-group">
          {fields && fields.map((field) => getFieldInput(field))}{" "}
        </div>
      </form>
      <center>
        <Button
          variant="primary"
          onClick={() =>
            props.updateField_Values({
              fieldValues: fields,
              contactId: props.contact.id,
            })
          }
        >
          Update
        </Button>
      </center>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  updateField_Values: (body) => dispatch(updateField_Values(body)),
});

export default connect(null, mapDispatchToProps)(ProfileInputs);
