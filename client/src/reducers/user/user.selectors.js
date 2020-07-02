import { createSelector } from 'reselect';

const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
   [selectUser],
   user => user
);

export const selectUserData = createSelector(
   [selectUser],
   user => user.collections
);
export const selectIsUserFetching = createSelector(
   [selectUser],
   user => user.isFetching
);

export const selectIsUserLoaded = createSelector(
   [selectUser],
   user => !!user.collections
);

export const selectSameDomainUsers = createSelector(
   [selectUser],
   user => user.sameDomainUsers

)