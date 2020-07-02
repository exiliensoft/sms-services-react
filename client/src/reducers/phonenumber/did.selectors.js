import { createSelector } from "reselect";

const selectPhoneNumber = (state) => state.dids;

export const selectPurchaseDids = createSelector(
  [selectPhoneNumber],
  (numbers) => numbers.search_response
);

export const selectPhoneNumberData = createSelector(
  [selectPhoneNumber],
  (numbers) => numbers
);

export const selectPhoneNumberFetching = createSelector(
  [selectPhoneNumber],
  (numbers) => numbers.fetching
);
