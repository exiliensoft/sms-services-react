import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import NumberFormat from "react-number-format";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { createNewConversation } from "../../reducers/conversation/conversation.actions";
import { updateConversationModal } from "../../reducers/home/home.actions";
import { showNewConversationModal } from "../../reducers/home/home.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import { selectCurrentUser } from "../../reducers/user/user.selectors";

class NewConversationModal extends React.Component {
  state = {
    conversationGroup: "",
    conversationPhone: "",
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCreateNewConversation = (_) => {
    const obj = {
      group: this.state.conversationGroup,
      phone: this.state.conversationPhone,
    };
    this.props.createNewConversation(obj);
    this.props.updateConversationModal(false);
  };

  render() {
    return (
      <Card
        style={{
          width: "25rem",
          position: "absolute",
          margin: "0 0 0 1px",
          zIndex: 9999,
        }}
      >
        <Card.Header>Create Conversation</Card.Header>
        <Card.Body
          style={{ padding: ".5em", maxHeight: "40em", overflowY: "scroll" }}
        >
          <Form>
            <Form.Group>
              <Form.Label
                htmlFor="conversationGroup"
                className="col-form-label"
              >
                Group
              </Form.Label>
              <Form.Control
                as="select"
                name="conversationGroup"
                className="form-control"
                onChange={this.handleInputChange}
                value={this.state.conversationGroup}
              >
                <option>Choose</option>
                {[
                  ...this.props.groups.data,
                  ...this.props.groups.member_groups.filter(
                    (member_group) => {
                      if (member_group._user === this.props.currentUser.id) {
                        return true;
                      }
                      if (
                        member_group.members.find(
                          (member) =>
                            member._user_email === this.props.currentUser.email
                        ) &&
                        member_group.members.filter(
                          (member) =>
                            member._user_email === this.props.currentUser.email
                        )[0].status === 1
                      ) {
                        return true;
                      }
                      return false;
                    }
                  ),
                ].map((group) => {
                  return (
                    <option key={group.group_name} value={group.id}>
                      {group.group_name} - {group.owner}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label
                htmlFor="conversationPhone"
                className="col-form-label"
              >
                DID
              </Form.Label>
              <NumberFormat
                format="(###) ###-####"
                mask="_"
                ype="text"
                name="conversationPhone"
                placeholder="(555) 555-5555"
                className="form-control"
                id="conversationPhone"
                autoComplete="off"
                onChange={this.handleInputChange}
                value={this.state.conversationPhone}
              />
            </Form.Group>

            {!this.state.conversationGroup ||
            !this.state.conversationPhone ? (
              <Button variant="primary" disabled>
                {" "}
                Create Conversation{" "}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={this.handleCreateNewConversation}
              >
                Create Conversation
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  groups: selectGroupData,
  showNewConversationModal: showNewConversationModal,
});

const mapDispatchToProps = (dispatch) => ({
  createNewConversation: (conversation) =>
    dispatch(createNewConversation(conversation)),
  updateConversationModal: (value) => dispatch(updateConversationModal(value)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewConversationModal);
