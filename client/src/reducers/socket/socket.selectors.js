import { createSelector } from 'reselect';

const selectSocket = state => state.socket;

export const selectSocketData = createSelector(
   [selectSocket],
   socket => socket.socket
);

export const selectIsSocketConnected = createSelector(
   [selectSocket],
   socket => socket.connected
);
