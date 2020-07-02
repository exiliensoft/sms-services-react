import { createSelector } from "reselect";

const selectFields = (state) => state.fields;

export const selectFieldssData = createSelector(
  [selectFields],
  (fields) => fields.fields
);

export const selectFieldssFetching = createSelector(
  [selectFields],
  (fields) => fields.fetching
);
