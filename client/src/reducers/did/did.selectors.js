import { createSelector } from "reselect";

const selectDid = (state) => state.dids;

export const selectPurchaseDids = createSelector(
  [selectDid],
  (numbers) => numbers.search_response
);

export const selectDidData = createSelector([selectDid], (numbers) => numbers);

export const selectDidFetching = createSelector(
  [selectDid],
  (numbers) => numbers.fetching
);
