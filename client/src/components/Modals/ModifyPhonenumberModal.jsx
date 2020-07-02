import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { updateModifyPhonenumberModal } from "../../reducers/home/home.actions";
import { showUpdatePhonenumberModal } from "../../reducers/home/home.selectors";
import { updatePhoneNumber } from "../../reducers/phonenumber/did.actions";
import { selectSmsGroupData } from "../../reducers/smsgroups/smsgroup.selectors";
import {
  addSMSGroupMember,
  deleteSMSGroup,
} from "../../reducers/smsgroups/smsgroups.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
class ModifyPhonenumberModal extends React.Component {
  state = {
    modifiedPhoneNumberDescription: this.props.showUpdatePhonenumberModal
      ? this.props.showUpdatePhonenumberModal.description
      : "",
    modifiedPhoneNumberSMSGroup: this.props.showUpdatePhonenumberModal
      ? this.props.showUpdatePhonenumberModal._sms_group
      : "",
    modifiedPhoneNumberId: this.props.showUpdatePhonenumberModal
      ? this.props.showUpdatePhonenumberModal._id
      : "",
    number: this.props.showUpdatePhonenumberModal
      ? this.props.showUpdatePhonenumberModal.number
      : "",
  };

  componentWillReceiveProps(props) {
    this.setState({
      modifiedPhoneNumberDescription: props.showUpdatePhonenumberModal
        ? props.showUpdatePhonenumberModal.description
        : "",
      modifiedPhoneNumberSMSGroup: props.showUpdatePhonenumberModal
        ? props.showUpdatePhonenumberModal._sms_group
        : "",
      modifiedPhoneNumberId: props.showUpdatePhonenumberModal
        ? props.showUpdatePhonenumberModal._id
        : "",
      number: props.showUpdatePhonenumberModal
        ? props.showUpdatePhonenumberModal.number
        : "",
    });
  }
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleModifyPhoneNumber = (_) => {
    this.props.updatePhoneNumber(this.state);
    this.props.updateModifyPhonenumberModal(null);
  };

  render() {
    let show = false;
    if (this.props.showUpdatePhonenumberModal) {
      show = true;
    }
    return (
      <Modal
        show={show}
        onHide={() => this.props.updateModifyPhonenumberModal(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Modify Phone Number
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            Invite members, add fields and create integrations.
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="modifyPhoneNumber" className="col-form-label">
                Phone Number
              </label>
              <input
                type="text"
                name="modifyPhoneNumber"
                className="form-control"
                id="modifyPhoneNumber"
                autoComplete="off"
                value={this.state.number}
                disabled
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="modifiedPhoneNumberDescription"
                className="col-form-label"
              >
                Phone Number Description
              </label>
              <textarea
                name="modifiedPhoneNumberDescription"
                className="form-control"
                id="modifiedPhoneNumberDescription"
                autoComplete="off"
                onChange={this.handleInputChange}
                value={this.state.modifiedPhoneNumberDescription}
              ></textarea>
            </div>
            <div className="form-group">
              {/* <Form.Group as={Col} controlId="formGridState"> */}
              <Form.Label>Point numbers to SMS Group:</Form.Label>
              <Form.Control
                as="select"
                name="modifiedPhoneNumberSMSGroup"
                onChange={this.handleInputChange}
                value={this.state.modifiedPhoneNumberSMSGroup}
              >
                <option>{this.props._sms_group}</option>
                {this.props.sms_groups.data
                  .filter((group) => group._user === this.props.currentUser.id)
                  .map((group) => {
                    return (
                      <option key={group.group_name} value={group.id}>
                        {group.group_name}
                      </option>
                    );
                  })}
              </Form.Control>
              {/* </Form.Group> */}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleModifyPhoneNumber}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  sms_groups: selectSmsGroupData,
  showUpdatePhonenumberModal: showUpdatePhonenumberModal,
});

const mapDispatchToProps = (dispatch) => ({
  deleteSMSGroup: (group) => dispatch(deleteSMSGroup(group)),
  updatePhoneNumber: (number) => dispatch(updatePhoneNumber(number)),
  addSMSGroupMember: (email) => dispatch(addSMSGroupMember(email)),
  updateModifyPhonenumberModal: (value) =>
    dispatch(updateModifyPhonenumberModal(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyPhonenumberModal);
