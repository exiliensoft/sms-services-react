import { createSelector } from 'reselect';

const selectGroups = state => state.groups;

export const selectGroupData = createSelector(
    [selectGroups],
    group => group
);

export const fetchingGroup = createSelector(
    [selectGroups],
    group => group.fetching
);
