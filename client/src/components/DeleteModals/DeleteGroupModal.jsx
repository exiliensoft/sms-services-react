import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { deleteGroup } from "../../reducers/group/group.actions";
import { deleteGroupModal } from "../../reducers/home/home.actions";
import { showDeleteGroupModal } from "../../reducers/home/home.selectors";

class DeleteGroupModal extends React.Component {
  handleDeleteGroup = () => {
    this.props.deleteGroup(this.props.showDeleteGroupModal.id);
    this.props.deleteGroupModal(null);
  };

  render() {
    const show = this.props.showDeleteGroupModal ? true : false;
    if (!show) {
      return <></>;
    }
    return (
      <Modal show={show} onHide={() => this.props.deleteGroupModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-users"></i> Delete Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            This will remove the Group and all it's settings
          </div>
          <form>
            <div className="form-group">
              <div>
                <label htmlFor="modifyDid" className="col-form-label">
                  Are you sure you want to remove this group?
                </label>
              </div>
              <div>
                <label>
                  <div style={{ fontWeight: "bold" }}>Group Name:</div>
                  <div>{this.props.showDeleteGroupModal.group_name}</div>
                </label>
                <br />
                <label>
                  <div style={{ fontWeight: "bold" }}>Group Description: </div>
                  <div>{this.props.showDeleteGroupModal.group_description}</div>
                </label>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.showDeleteGroupModal
                      ? this.props.showDeleteGroupModal.members.map(
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
            onClick={() => this.props.deleteGroupModal(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={(_) =>
              this.handleDeleteGroup(this.props.showDeleteGroupModal.id)
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
  showDeleteGroupModal: showDeleteGroupModal,
});

const mapDispatchToProps = (dispatch) => ({
  deleteGroup: (groupId) => dispatch(deleteGroup(groupId)),
  deleteGroupModal: (value) => dispatch(deleteGroupModal(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGroupModal);
