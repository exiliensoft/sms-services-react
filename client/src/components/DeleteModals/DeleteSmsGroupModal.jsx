import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { deleteSmsGroupModal } from "../../reducers/home/home.actions";
import { showDeleteSmsGroupModal } from "../../reducers/home/home.selectors";
import { deleteSMSGroup } from "../../reducers/smsgroups/smsgroups.actions";

class DeleteSmsGroupModal extends React.Component {
  handleDeleteSMSGroup = () => {
    this.props.deleteSMSGroup(this.props.showDeleteSmsGroupModal.id);
    this.props.deleteSmsGroupModal(null);
  };

  render() {
    const show = this.props.showDeleteSmsGroupModal ? true : false;
    if (!show) {
      return <></>;
    }
    return (
      <Modal show={show} onHide={() => this.props.deleteSmsGroupModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Delete SMS Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            This will remove the SMS Group and all it's settings
          </div>
          <form>
            <div className="form-group">
              <div>
                <label htmlFor="modifyPhoneNumber" className="col-form-label">
                  Are you sure you want to remove this group?
                </label>
              </div>
              <div>
                <label>
                  <div style={{ fontWeight: "bold" }}>Group Name:</div>
                  <div>{this.props.showDeleteSmsGroupModal.group_name}</div>
                </label>
                <br />
                <label>
                  <div style={{ fontWeight: "bold" }}>Group Description: </div>
                  <div>
                    {this.props.showDeleteSmsGroupModal.group_description}
                  </div>
                </label>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.showDeleteSmsGroupModal
                      ? this.props.showDeleteSmsGroupModal.members.map(
                          (member) => {
                            return (
                              <tr key={member._user_email}>
                                <td>{member._user_email}</td>
                              </tr>
                            );
                          }
                        )
                      : null}
                  </tbody>
                </Table>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => this.props.deleteSmsGroupModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={(_) =>
              this.handleDeleteSMSGroup(this.props.showDeleteSmsGroupModal.id)
            }
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  showDeleteSmsGroupModal: showDeleteSmsGroupModal,
});

const mapDispatchToProps = (dispatch) => ({
  deleteSMSGroup: (groupId) => dispatch(deleteSMSGroup(groupId)),
  deleteSmsGroupModal: (value) => dispatch(deleteSmsGroupModal(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteSmsGroupModal);
