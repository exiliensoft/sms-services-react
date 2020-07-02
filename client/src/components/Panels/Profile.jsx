import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectContactsData } from "../../reducers/contact/contact.selectors";
import { toggleProfileHidden } from "../../reducers/home/home.actions";
import { selectProfileHidden } from "../../reducers/home/home.selectors";
import { selectMessageContactsData } from "../../reducers/message/message.selectors";
import { selectGroupData } from "../../reducers/group/group.selectors";
import ProfileInner from "../Profile/ProfileInner";

const Profile = ({
  toggleProfileHidden,
  profile,
  isOpen,
  groups,
  selectAllContacts,
}) => {
  const getFields = (contact) => {
    return [
      ...new Set(
        [].concat(
          ...[...groups.data, ...groups.member_groups]
            .filter((group) => group._user == contact._user)
            .map((group) => group.fieldData)
        )
      ),
    ];
  };
  let contact;
  if (selectAllContacts.data.find((contact) => contact.id === profile.id)) {
    contact = selectAllContacts.data.filter(
      (contact) => contact.id === profile.id
    )[0];
  } else {
    contact = profile;
  }

  return (
    <div className="sidebar-group">
      {isOpen && (
        <ProfileInner
          profile={contact}
          isOpen={true}
          toggleProfileHidden={toggleProfileHidden}
          fields={getFields(contact)}
          fieldValues={contact.Field_Values}
        />
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  isOpen: selectProfileHidden,
  profile: selectMessageContactsData,
  groups: selectGroupData,
  selectAllContacts: selectContactsData,
});

const mapDispatchToProps = (dispatch) => ({
  toggleProfileHidden: () => dispatch(toggleProfileHidden()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
