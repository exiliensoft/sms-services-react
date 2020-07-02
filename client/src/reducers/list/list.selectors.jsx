import { createSelector } from 'reselect';

const selectList = state => state.lists;

export const selectListsData = createSelector(
    [selectList],
    list => list
);

export const selectListFetching = createSelector(
    [selectList],
    list => list.fetching
);