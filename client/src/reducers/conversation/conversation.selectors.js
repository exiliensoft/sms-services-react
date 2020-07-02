import { createSelector } from 'reselect';
const selectConversation = state => state.conversations;

export const selectConversationData = createSelector(
    [selectConversation],
    conversations => conversations
);
export const selectConversationFetching = createSelector(
    [selectConversation],
    conversations => conversations.fetching
);

export const selectUsers = createSelector(
    [selectConversation],
    conversations => conversations.users
)

export const selectFilterGroups = createSelector(
    [selectConversation],
    conversations => conversations.filterGroups
)
