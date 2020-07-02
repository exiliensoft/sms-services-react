import { createSelector } from "reselect";
const selectMessages = (state) => state.messages;

export const selectMessageData = createSelector(
  [selectMessages],
  (messages) => messages
);
export const selectMessageFetching = createSelector(
  [selectMessages],
  (messages) => messages.fetching
);
export const selectIsMessageLoaded = createSelector(
  // Not needed
  [selectMessages],
  (messages) => !!messages
);

export const selectMessageConversationId = createSelector(
  [selectMessages],
  (messages) => (messages ? messages.key : null)
);

export const selectMessageContactsData = createSelector(
  [selectMessages],
  (messages) => messages.contact
);

export const selectMessageGroup = createSelector(
  [selectMessages],
  (messages) => messages._group
);
