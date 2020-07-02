import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  addGroupMember,
  deleteGroup,
} from "../../reducers/group/group.actions";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { updateModifyDidModal } from "../../reducers/home/home.actions";
import { showUpdateDidModal } from "../../reducers/home/home.selectors";
import { updateDid } from "../../reducers/did/did.actions";
import { selectCurrentUser } from "../../reducers/user/user.selectors";
class ModifyDidModal extends React.Component {
  state = {
    modifiedDidDescription: this.props.showUpdateDidModal
      ? this.props.showUpdateDidModal.description
      : "",
    modifiedDidGroup: this.props.showUpdateDidModal
      ? this.props.showUpdateDidModal._group
      : "",
    modifiedDidId: this.props.showUpdateDidModal
      ? this.props.showUpdateDidModal._id
      : "",
    number: this.props.showUpdateDidModal
      ? this.props.showUpdateDidModal.number
      : "",
  };

  componentWillReceiveProps(props) {
    this.setState({
      modifiedDidDescription: props.showUpdateDidModal
        ? props.showUpdateDidModal.description
        : "",
      modifiedDidGroup: props.showUpdateDidModal
        ? props.showUpdateDidModal._group
        : "",
      modifiedDidId: props.showUpdateDidModal
        ? props.showUpdateDidModal._id
        : "",
      number: props.showUpdateDidModal ? props.showUpdateDidModal.number : "",
    });
  }
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleModifyDid = (_) => {
    this.props.updateDid(this.state);
    this.props.updateModifyDidModal(null);
  };

  render() {
    let show = false;
    if (this.props.showUpdateDidModal) {
      show = true;
    }
    return (
      <Modal show={show} onHide={() => this.props.updateModifyDidModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Modify Did
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            Invite members, add fields and create integrations.
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="modifyDid" className="col-form-label">
                Did
              </label>
              <input
                type="text"
                name="modifyDid"
                className="form-control"
                id="modifyDid"
                autoComplete="off"
                value={this.state.number}
                disabled
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="modifiedDidDescription"
                className="col-form-label"
              >
                Did Description
              </label>
              <textarea
                name="modifiedDidDescription"
                className="form-control"
                id="modifiedDidDescription"
                autoComplete="off"
                onChange={this.handleInputChange}
                value={this.state.modifiedDidDescription}
              ></textarea>
            </div>
            <div className="form-group">
              {/* <Form.Group as={Col} controlId="formGridState"> */}
              <Form.Label>Point numbers to Group:</Form.Label>
              <Form.Control
                as="select"
                name="modifiedDidGroup"
                onChange={this.handleInputChange}
                value={this.state.modifiedDidGroup}
              >
                <option>{this.props._group}</option>
                {this.props.groups.data
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
          <Button variant="primary" onClick={this.handleModifyDid}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  groups: selectGroupData,
  showUpdateDidModal: showUpdateDidModal,
});

const mapDispatchToProps = (dispatch) => ({
  deleteGroup: (group) => dispatch(deleteGroup(group)),
  updateDid: (number) => dispatch(updateDid(number)),
  addGroupMember: (email) => dispatch(addGroupMember(email)),
  updateModifyDidModal: (value) => dispatch(updateModifyDidModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyDidModal);
