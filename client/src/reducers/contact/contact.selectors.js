import { createSelector } from "reselect";

const selectContact = (state) => state.contacts;

export const selectOpenContacts = createSelector(
  [selectContact],
  (contact) => contact.openContacts
);

export const selectContactsData = createSelector(
  [selectContact],
  (contact) => contact
);

export const selectContactsFetching = createSelector(
  [selectContact],
  (contact) => contact.fetching
);
