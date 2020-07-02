import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { toggleContact } from "../../reducers/contact/contact.actions";
import { selectContactsData, selectOpenContacts } from "../../reducers/contact/contact.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import ProfileInner from "../Profile/ProfileInner";

class Contacts extends React.Component {
  getFields = (contact) => {
    return [
      ...new Set(
        [].concat(
          ...[
            ...this.props.groups.data,
            ...this.props.groups.member_groups,
          ]
            .filter((group) => group._user == contact._user)
            .map((group) => group.fieldData)
            .filter((group) => group != null)
        )
      ),
    ];
  };

  updateOpenContacts = (value) => {
    this.props.toggleContact({ _id: value });
  };

  render(props) {
    return (
      <>
        {this.props.selectAllContacts.data
          .filter((contact) =>
            this.props.selectOpenContacts.includes(contact.id)
          )
          .map((contact) => {
            return (
              <>
                <div className="sidebar-group">
                  <div class="sidebar active">
                    <ProfileInner
                      isOpen={true}
                      profile={contact}
                      fields={this.getFields(contact)}
                      fieldValues={contact.Field_Values}
                      refresh={Math.random()}
                      toggleProfileHidden={(c) => this.updateOpenContacts(c.id)}
                    />
                  </div>
                </div>
              </>
            );
          })}
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectOpenContacts: selectOpenContacts,
  selectAllContacts: selectContactsData,
  groups: selectGroupData,
});

const mapDispatchToProps = (dispatch) => ({
  toggleContact: (payload) => dispatch(toggleContact(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
