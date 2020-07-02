import { createSelector } from "reselect";

const selectHome = (state) => state.home;

export const selectProfileHidden = createSelector(
  [selectHome],
  (home) => home.profile
);

export const selectOpenSidebar = createSelector(
  [selectHome],
  (home) => home.openSidebar
);

export const selectNavLink = createSelector([selectHome], (home) => home.link);

export const selectHomeData = createSelector(
  [selectHome],
  (home) => home.collections
);
export const selectIsCollectionFetching = createSelector(
  [selectHome],
  (home) => home.isFetching
);

export const selectNewMessage = createSelector(
  [selectHome],
  (home) => home.newMessage
);

export const selectSameDomainUsers = createSelector(
  [selectHome],
  (home) => home.sameDomainUsers
);

export const showNewGroupModal = createSelector(
  [selectHome],
  (home) => home.newGroupModal
);
export const showUpdateGroupModal = createSelector(
  [selectHome],
  (home) => home.modifyGroupModal
);

export const showNewDidModal = createSelector(
  [selectHome],
  (home) => home.newDidModal
);

export const showUpdateDidModal = createSelector(
  [selectHome],
  (home) => home.ModifyDidModal
);

export const showNewConversationModal = createSelector(
  [selectHome],
  (home) => home.newConversationModal
);

export const showDeleteDidModal = createSelector(
  [selectHome],
  (home) => home.deleteDidModal
);

export const showDeleteGroupModal = createSelector(
  [selectHome],
  (home) => home.deleteGroupModal
);
export const showFilterConversationModal = createSelector(
  [selectHome],
  (home) => home.filterConversationModal
);
