import axios from "axios";
import React from "react";
import { Alert, Button, Form, FormControl, InputGroup, ListGroup, Modal, Nav, Table } from "react-bootstrap";
import { connect } from "react-redux";
import Select from "react-select";
import { createStructuredSelector } from "reselect";
import { addField, deleteField, updateField } from "../../reducers/field/field.action";
import { selectFieldssData } from "../../reducers/field/field.selector";
import { updateModifySmsGroupModal, updateNewPhonenumberModal, updateNewSmsModal } from "../../reducers/home/home.actions";
import { showNewSmsGroupModal, showUpdateSmsGroupModal } from "../../reducers/home/home.selectors";
import { selectPhoneNumberData } from "../../reducers/phonenumber/did.selectors";
import { selectSmsGroupData } from "../../reducers/smsgroups/smsgroup.selectors";
import { createNewSMSGroup, updateSMSGroup } from "../../reducers/smsgroups/smsgroups.actions";
import { selectCurrentUser, selectSameDomainUsers } from "../../reducers/user/user.selectors";
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class SmsGroupModal extends React.Component {
  state = {
    newMember: undefined,
    id: this.props.showUpdateSmsGroupModal
      ? this.props.showUpdateSmsGroupModal._id
      : "",
    newGroupName: this.props.showUpdateSmsGroupModal
      ? this.props.showUpdateSmsGroupModal.group_name
      : "",
    newGroupDescription: this.props.showUpdateSmsGroupModal
      ? this.props.showUpdateSmsGroupModal.group_description
      : "",
    deleteSMSGroupMembers: [],
    smsGroupModalTab: "group_settings",
    newSMSGroupPhoneNumberReRoute: [],
    modifiedUncheckedPhoneNumberSMSGroup: [],
    searchField: "",
    members:
      this.props.showUpdateSmsGroupModal &&
      this.props.showUpdateSmsGroupModal.Members
        ? this.props.showUpdateSmsGroupModal.Members.map(
            (member) => member._user_email
          )
        : [],
    newField: "",
    newFieldType: 1,
    newFieldOptions: [],
    selected_fields: this.props.showUpdateSmsGroupModal
      ? this.props.showUpdateSmsGroupModal.fields
      : [],
    checked_fields: this.props.showUpdateSmsGroupModal
      ? this.props.showUpdateSmsGroupModal.checked_fields
      : [],
  };

  componentWillReceiveProps(props) {
    this.setState({
      id: props.showUpdateSmsGroupModal
        ? props.showUpdateSmsGroupModal._id
        : "",
      newGroupName: props.showUpdateSmsGroupModal
        ? props.showUpdateSmsGroupModal.group_name
        : "",
      newGroupDescription: props.showUpdateSmsGroupModal
        ? props.showUpdateSmsGroupModal.group_description
        : "",
      filterSMSGroups: [],
      members:
        props.showUpdateSmsGroupModal && props.showUpdateSmsGroupModal.Members
          ? props.showUpdateSmsGroupModal.Members.map(
              (member) => member._user_email
            )
          : [],
      newField: "",
      newFieldType: 1,
      newFieldOptions: [],
    });

    if (
      props.showUpdateSmsGroupModal &&
      (!this.props.showUpdateSmsGroupModal ||
        this.props.showUpdateSmsGroupModal.id !=
          props.showUpdateSmsGroupModal.id)
    ) {
      this.setState({
        selected_fields: props.showUpdateSmsGroupModal.fields,
      });
    }
    this.setState({
      fields: props.fields,
      checked_fields: props.showUpdateSmsGroupModal
        ? props.showUpdateSmsGroupModal.checked_fields
        : [],
    });
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFieldInputChange = (event, index) => {
    if (!event.target) {
      return;
    }
    let values = [...this.state.fields];
    values = values.map((value) => {
      if (value.id == index) {
        value.fieldName = event.target.value;
      }
      return value;
    });
    this.setState({ fields: values });
  };

  calculateAddedMembers = () => {
    return this.state.members.filter(
      (member) =>
        this.props.showUpdateSmsGroupModal.Members.map(
          (member) => member._user_email
        ).indexOf(member) === -1
    );
  };

  calculateDeletedMembers = () => {
    if (!this.props.showUpdateSmsGroupModal.Members) {
      return [];
    }
    return this.props.showUpdateSmsGroupModal.Members.map(
      (member) => member._user_email
    ).filter((member) => this.state.members.indexOf(member) === -1);
  };

  handleModifyGroup = (_) => {
    let addedMembers = this.calculateAddedMembers();
    let deletedMembers = this.calculateDeletedMembers();
    this.props.updateSMSGroup(this.props.showUpdateSmsGroupModal._id, {
      ...this.state,
      addedMembers,
      deletedMembers,
    });
    this.setState({
      smsGroupModalTab: "group_settings",
      selected_fields: [],
      checked_fields: [],
    });
    this.props.updateModifySmsGroupModal(false);
  };

  handleCreateNewGroup = () => {
    let addedMembers = this.state.members;
    this.props.createNewSMSGroup({ ...this.state, addedMembers });
    this.props.updateNewSmsModal(false);
    this.setState({
      smsGroupModalTab: "group_settings",
      selected_fields: [],
      checked_fields: [],
    });
  };

  handleNewSMSGroupPhoneNumberReRouteCheckBox = (event, groupId) => {
    const sms_group_numbers = this.props.dids.data.filter(
      (did) => did._sms_group === this.state.id
    );
    const number_id = sms_group_numbers.map((item) => item.id);

    if (event.target.checked) {
      if (number_id.filter((item) => item === groupId).length > 0) {
        this.setState({
          newSMSGroupPhoneNumberReRoute: this.state.newSMSGroupPhoneNumberReRoute.concat(
            [groupId]
          ),
          modifiedUncheckedPhoneNumberSMSGroup: this.state.modifiedUncheckedPhoneNumberSMSGroup.filter(
            (val) => {
              return val !== groupId;
            }
          ),
        });
      } else {
        this.setState({
          newSMSGroupPhoneNumberReRoute: this.state.newSMSGroupPhoneNumberReRoute.concat(
            [groupId]
          ),
        });
      }
    } else {
      if (number_id.filter((item) => item === groupId).length > 0) {
        this.setState({
          newSMSGroupPhoneNumberReRoute: this.state.newSMSGroupPhoneNumberReRoute.filter(
            (val) => {
              return val !== groupId;
            }
          ),
          modifiedUncheckedPhoneNumberSMSGroup: this.state.modifiedUncheckedPhoneNumberSMSGroup.concat(
            [groupId]
          ),
        });
      } else {
        this.setState({
          newSMSGroupPhoneNumberReRoute: this.state.newSMSGroupPhoneNumberReRoute.filter(
            (val) => {
              return val !== groupId;
            }
          ),
        });
      }
    }
  };

  rednerMemberCheckboxStatus = (email) => {
    return this.state.members.find((memberEmail) => {
      return memberEmail === email;
    });
  };

  checkboxSameDomainUser = (email) => {
    if (!this.state.members) {
      return;
    }
    if (this.state.members.find((memberEmail) => memberEmail === email)) {
      this.setState({
        members: this.state.members.filter((member) => member !== email),
      });
    } else {
      this.setState({ members: [...this.state.members, email] });
    }
  };

  fieldCheckbox = (id) => {
    if (this.state.selected_fields.includes(id)) {
      this.setState({
        selected_fields: this.state.selected_fields.filter(
          (value) => value != id
        ),
      });
    } else {
      this.setState({ selected_fields: [...this.state.selected_fields, id] });
    }
  };

  renderMembersList = (_) => {
    return this.state.members.map((email) => {
      if (
        this.props.sameDomainUsers.find((memberEmail) => memberEmail === email)
      ) {
        return null;
      }
      return (
        <ListGroup.Item key={email.trim()}>
          {email.trim()}
          <i
            className="ti-close"
            style={{ float: "right", marginRight: ".7em", marginTop: ".2em" }}
            onClick={() => {
              this.setState({
                members: this.state.members.filter(
                  (member) => member !== email
                ),
              });
            }}
          ></i>
        </ListGroup.Item>
      );
    });
  };

  addField = async () => {
    const field = await axios.post("/field", {
      fieldName: this.state.newField,
      type: this.state.newFieldType,
      options: this.state.newFieldOptions,
    });
    this.props.addField(field.data);
    this.setState({
      selected_fields: [...this.state.selected_fields, field.data.id],
    });
    this.setState({ newField: "", newFieldType: 1 });
  };

  renderSameDomainUsersList = (_) => {
    return this.props.sameDomainUsers.map((keyValue, i) => {
      if (keyValue === this.props.currentUser.email) {
        return;
      }
      return (
        <ListGroup.Item key={i}>
          {keyValue}
          <div
            className="form-item custom-control custom-checkbox"
            style={{ float: "right" }}
          >
            <input
              type="checkbox"
              className="custom-control-input"
              id={`customCheck${keyValue[1]}`}
              onChange={(_) => this.checkboxSameDomainUser(keyValue)}
              checked={this.rednerMemberCheckboxStatus(keyValue)}
            />
            <label
              className="custom-control-label"
              htmlFor={`customCheck${keyValue[1]}`}
            ></label>
          </div>
        </ListGroup.Item>
      );
    });
  };

  filteringSMSGroupName = (group_id) => {
    return this.props.sms_groups.data.map((group) => {
      if (group.id === group_id) {
        return group.group_name;
      }
    });
  };

  selectOnChange = (e) => {
    this.setState({
      selected_fields: [...this.state.selected_fields, e.value],
    });
    this.setState({ newField: null, newFieldType: 1 });
  };

  renderSMSGroupModalTabs = (_) => {
    switch (this.state.smsGroupModalTab) {
      case "group_settings":
        return (
          <form>
            <div className="form-group">
              <label htmlFor="newGroupName" className="col-form-label">
                Group Name
              </label>
              <input
                type="text"
                name="newGroupName"
                className="form-control"
                id="newGroupName"
                autoComplete="off"
                onChange={this.handleInputChange}
                value={this.state.newGroupName}
                maxLength="25"
              />
              {this.props.sms_groups.data
                .filter((group) =>
                  this.props.showUpdateSmsGroupModal
                    ? group.id != this.props.showUpdateSmsGroupModal._id
                    : true
                )
                .filter(
                  (group) =>
                    group.group_name.toLowerCase() ===
                    this.state.newGroupName.toLowerCase()
                ).length > 0 ? (
                <Alert variant="danger">This group name already exists!</Alert>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="newGroupDescription" className="col-form-label">
                Group Description
              </label>
              <textarea
                name="newGroupDescription"
                className="form-control"
                id="newGroupDescription"
                autoComplete="off"
                onChange={this.handleInputChange}
                value={this.state.newGroupDescription}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="message" className="col-form-label">
                Members
              </label>
              <InputGroup>
                <FormControl
                  placeholder="New Member's email"
                  aria-label="New Member's email"
                  aria-describedby="basic-addon2"
                  autoComplete="off"
                  type="email"
                  value={this.state.newMember}
                  name="newMember"
                  onChange={this.handleInputChange}
                />
                <InputGroup.Append>
                  {!emailRegEx.test(this.state.newMember) ? (
                    <Button disabled variant="outline-secondary">
                      Add
                    </Button>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        if (
                          this.state.members.find(
                            (email) => email === this.state.newMember
                          )
                        ) {
                          return null;
                        }
                        this.setState({
                          members: [
                            ...this.state.members,
                            this.state.newMember,
                          ],
                        });
                        this.setState({ newMember: "" });
                      }}
                    >
                      Add
                    </Button>
                  )}
                </InputGroup.Append>
              </InputGroup>
              <br />
              <div>
                <ListGroup>
                  {this.state.members ? this.renderMembersList() : null}
                  {this.props.sameDomainUsers
                    ? this.renderSameDomainUsersList()
                    : null}
                </ListGroup>
              </div>
            </div>
          </form>
        );

      case "dids":
        return (
          <>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Re-Route</th>
                  <th>Phone Number</th>
                  <th>Phone Number Description</th>
                  <th>Current Group</th>
                  <th>Voice</th>
                  <th>SMS</th>
                  <th>MMS</th>
                </tr>
              </thead>
              <tbody>
                {this.props.dids.data.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <Button
                        onClick={() => {
                          this.props.updateNewPhonenumberModal(true);
                          this.hide();
                        }}
                      >
                        Buy Phone Numbers
                      </Button>
                    </td>
                  </tr>
                ) : (
                  this.props.dids.data.map((did) => {
                    if (did._sms_group === this.state.id) {
                      console.log("--PHONNN__", did);
                      return (
                        <tr key={did.number}>
                          <td>
                            <Form.Check
                              defaultChecked="true"
                              type="checkbox"
                              onChange={(event) =>
                                this.handleNewSMSGroupPhoneNumberReRouteCheckBox(
                                  event,
                                  did.id
                                )
                              }
                            />
                          </td>
                          <td>{did.number}</td>
                          <td>{did.description}</td>
                          <td>{this.filteringSMSGroupName(did._sms_group)}</td>
                          <td>{did.voice_enabled ? "Voice" : ""}</td>
                          <td>{did.sms_enabled ? "SMS" : ""}</td>
                          <td>{did.mms_enabled ? "MMS" : ""}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={did.number}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              onChange={(event) =>
                                this.handleNewSMSGroupPhoneNumberReRouteCheckBox(
                                  event,
                                  did.id
                                )
                              }
                            />
                          </td>
                          <td>{did.number}</td>
                          <td>{did.description}</td>
                          <td>{this.filteringSMSGroupName(did._sms_group)}</td>
                          <td>{did.voice_enabled ? "Voice" : ""}</td>
                          <td>{did.sms_enabled ? "SMS" : ""}</td>
                          <td>{did.mms_enabled ? "MMS" : ""}</td>
                        </tr>
                      );
                    }
                  })
                )}
              </tbody>
            </Table>
          </>
        );
      case "fields_api":
        return <>{this.renderFields()}</>;
      default:
        return null;
    }
  };

  getCheckedFields = () => {
    return this.state.checked_fields.filter(
      (f) =>
        this.state.selected_fields.includes(f) &&
        this.state.fields.map((f) => f.id).includes(f)
    );
  };

  selectInputChange = (e, { action }) => {
    if (e) {
      this.setState({ newField: e });
    }
    return;
  };

  renderFields = () => {
    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Keys</th>
              <th>Name</th>
              <th>Type</th>
              <th>Button</th>
              <th>Fields</th>
            </tr>
          </thead>
          <tbody>
            {this.state.fields
              .filter((field) => this.state.selected_fields.includes(field.id))
              .map((field, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      {this.getCheckedFields().length}
                      <Form.Check
                        checked={this.getCheckedFields().includes(field.id)}
                        type="checkbox"
                        onChange={(event) => {
                          if (
                            this.getCheckedFields().length >= 2 &&
                            !this.getCheckedFields().includes(field.id)
                          ) {
                            return;
                          }
                          this.setState({
                            checked_fields: this.state.checked_fields.includes(
                              field.id
                            )
                              ? this.state.checked_fields.filter(
                                  (id) => id != field.id
                                )
                              : [...this.state.checked_fields, field.id],
                          });
                        }}
                      />
                    </td>
                    <td>
                      <InputGroup>
                        <FormControl
                          placeholder="Field name"
                          aria-label="Field name"
                          aria-describedby="basic-addon2"
                          autoComplete="off"
                          type="email"
                          value={field.fieldName}
                          name="field"
                          onChange={(e) =>
                            this.handleFieldInputChange(e, field.id)
                          }
                        />
                      </InputGroup>
                    </td>
                    <td>
                      {field.type == 1
                        ? "String"
                        : field.type == 2
                        ? "Integer"
                        : "Select"}
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={
                          this.props.fields.filter(
                            (f) => f.fieldName == field.fieldName
                          ).length >= 2 || field.fieldName == ""
                        }
                        onClick={(e) =>
                          this.props.updateField({
                            id: field.id,
                            fieldName: field.fieldName,
                            options: field.options,
                          })
                        }
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => this.fieldCheckbox(field.id)}
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          this.props.deleteField(field.id);
                          this.fieldCheckbox(field.id);
                        }}
                      >
                        X
                      </button>
                    </td>
                    <td>
                      {field.type == 3 && (
                        <>
                          {field.options.map((option, index) => {
                            return (
                              <input
                                type="text"
                                name="newFieldName"
                                className="form-control"
                                id="newFieldName"
                                autoComplete="off"
                                onChange={(e) =>
                                  this.setState({
                                    fields: this.state.fields.map((f) => {
                                      if (f.id != field.id) {
                                        return f;
                                      }
                                      return {
                                        ...f,
                                        options: f.options.map((op, in1) => {
                                          if (in1 != index) {
                                            return op;
                                          }
                                          return e.target.value;
                                        }),
                                      };
                                    }),
                                  })
                                }
                                value={option}
                                maxLength="25"
                              />
                            );
                          })}
                          <button
                            onClick={() =>
                              this.setState({
                                fields: this.state.fields.map((f) => {
                                  if (field.id != f.id) {
                                    return f;
                                  }
                                  return {
                                    ...f,
                                    options: [...f.options, ""],
                                  };
                                }),
                              })
                            }
                          >
                            Add
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td>
                <Form.Check
                  sele
                  checked={false}
                  type="checkbox"
                  onChange={(event) => {}}
                />
              </td>
              <td>
                <Select
                  options={this.props.fields
                    .filter(
                      (field) => !this.state.selected_fields.includes(field.id)
                    )
                    .map((field) => ({
                      value: field.id,
                      label: field.fieldName,
                    }))}
                  inputValue={this.state.newField || ""}
                  value={this.state.newField || ""}
                  onInputChange={this.selectInputChange}
                  components={{ DropdownIndicator: () => null }}
                  menuPlacement="auto"
                  onChange={this.selectOnChange}
                  onSelectResetsInput={false}
                  multiple="multiple"
                  clearIndicator={true}
                  hideSelectedOptions={true}
                  blurInputOnSelect={false}
                  placeholder="Field name"
                  closeMenuOnSelect={false}
                />
              </td>
              <td>
                <select
                  name="members"
                  className="form-control"
                  onChange={(event) =>
                    this.setState({ newFieldType: event.target.value })
                  }
                >
                  <option
                    key={"String"}
                    value={1}
                    selected={this.state.newFieldType == 1}
                  >
                    String
                  </option>
                  <option
                    key={"Integer"}
                    value={2}
                    selected={this.state.newFieldType == 2}
                  >
                    Integer
                  </option>
                  <option
                    key={"Integer"}
                    value={3}
                    selected={this.state.newFieldType == 3}
                  >
                    Select
                  </option>
                </select>
              </td>
              <td>
                <button
                  disabled={
                    this.props.fields
                      .map((field) => field.fieldName)
                      .includes(this.state.newField) ||
                    this.state.newField == "" ||
                    (this.state.newFieldType == 3 &&
                      this.state.newFieldOptions.length == 0) ||
                    this.state.newFieldOptions.filter((o) => o == "").length > 0
                  }
                  type="button"
                  onClick={() => this.addField()}
                >
                  Add
                </button>
              </td>
              <td>
                {this.state.newFieldType == 3 && (
                  <>
                    {this.state.newFieldOptions.map((option, index) => {
                      return (
                        <input
                          type="text"
                          name="newGroupName"
                          className="form-control"
                          id="newGroupName"
                          autoComplete="off"
                          onChange={(e) =>
                            this.setState({
                              newFieldOptions: this.state.newFieldOptions.map(
                                (option, i) => {
                                  if (i == index) {
                                    return e.target.value;
                                  }
                                  return option;
                                }
                              ),
                            })
                          }
                          value={option}
                          maxLength="25"
                        />
                      );
                    })}
                    <button
                      onClick={() =>
                        this.setState({
                          newFieldOptions: [...this.state.newFieldOptions, ""],
                        })
                      }
                    >
                      Add
                    </button>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  hide = () => {
    this.props.updateNewSmsModal(false);
    this.props.updateModifySmsGroupModal(null);
    this.setState({
      smsGroupModalTab: "group_settings",
      selected_fields: [],
      checked_fields: [],
    });
  };

  render() {
    const open =
      this.props.showNewSmsGroupModal ||
      (this.props.showUpdateSmsGroupModal ? true : false);
    const modify = !this.props.showNewSmsGroupModal;
    return (
      <Modal show={open} onHide={this.hide}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i>{" "}
            {modify ? "Update SMS Group" : "Add SMS Group"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            Invite members, add fields and create integrations.
          </div>
          <Nav fill variant="tabs" defaultActiveKey="1">
            <Nav.Item>
              <Nav.Link
                eventKey="1"
                onSelect={() =>
                  this.setState({ smsGroupModalTab: "group_settings" })
                }
              >
                Group Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="2"
                onSelect={() => this.setState({ smsGroupModalTab: "dids" })}
              >
                Phone Numbers
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="3"
                onSelect={() =>
                  this.setState({ smsGroupModalTab: "fields_api" })
                }
              >
                Fields & API
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {this.renderSMSGroupModalTabs()}
        </Modal.Body>
        <Modal.Footer>
          {!this.state.newGroupName ||
          this.props.sms_groups.data
            .filter((group) =>
              this.props.showUpdateSmsGroupModal
                ? group.id != this.props.showUpdateSmsGroupModal._id
                : true
            )
            .filter(
              (group) =>
                group.group_name.toLowerCase() ===
                this.state.newGroupName.toLowerCase()
            ).length > 0 ? (
            <Button variant="primary" disabled>
              {modify ? "Update Group" : "Create Group"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={
                modify ? this.handleModifyGroup : this.handleCreateNewGroup
              }
            >
              {modify ? "Update Group" : "Create Group"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  dids: selectPhoneNumberData,
  sms_groups: selectSmsGroupData,
  sameDomainUsers: selectSameDomainUsers,
  showNewSmsGroupModal: showNewSmsGroupModal,
  showUpdateSmsGroupModal: showUpdateSmsGroupModal,
  fields: selectFieldssData,
});

const mapDispatchToProps = (dispatch) => ({
  createNewSMSGroup: (group) => dispatch(createNewSMSGroup(group)),
  updateSMSGroup: (group_id, members, state) =>
    dispatch(updateSMSGroup(group_id, members, state)),
  updateNewSmsModal: (value) => dispatch(updateNewSmsModal(value)),
  updateModifySmsGroupModal: (value) =>
    dispatch(updateModifySmsGroupModal(value)),
  updateNewPhonenumberModal: (value) =>
    dispatch(updateNewPhonenumberModal(value)),
  addField: (body) => dispatch(addField(body)),
  deleteField: (id) => dispatch(deleteField(id)),
  updateField: (body) => dispatch(updateField(body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SmsGroupModal);
