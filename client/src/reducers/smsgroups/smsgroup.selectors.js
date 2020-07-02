import { createSelector } from 'reselect';

const selectSMSGroups = state => state.smsgroups;

export const selectSmsGroupData = createSelector(
    [selectSMSGroups],
    group => group
);

export const fetchingSmsGroup = createSelector(
    [selectSMSGroups],
    group => group.fetching
);
