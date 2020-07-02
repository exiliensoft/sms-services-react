import SocketActionTypes from './socket.types.js';

const INITIAL_STATE = {
   connected: false,
   port: '3001',
   socket: null
};

function socketReducer(state = INITIAL_STATE, action) {
   switch (action.type) {
      case SocketActionTypes.CONNECTION_CHANGED:
         return {
            ...state,
            connected: action.payload,
            isError: false
         };
      case SocketActionTypes.CONNECT_SOCKET:
         return {
            ...state,
            connected: true,
            socket: action.payload
         };
      default:
         return state
   }
}

export default socketReducer;

