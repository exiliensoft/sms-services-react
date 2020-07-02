import { combineReducers } from "redux";
import contactReducer from "./contact/contact.reducer";
import conversationReducer from "./conversation/conversation.reducers";
import fieldReducer from "./field/field.reducer";
import groupsReducer from "./group/group.reducers";
import homeReducer from "./home/home.reducer";
import listReducer from "./list/list.reducer";
import messageReducer from "./message/message.reducer";
import didReducer from "./did/did.reducers";
import planReducer from "./plan/plan.reducers";
import socketReducer from "./socket/socket.reducer";
import userReducer from "./user/user.reducer";

const allReducer = combineReducers({
  user: userReducer,
  home: homeReducer,
  socket: socketReducer,
  groups: groupsReducer,
  dids: didReducer,
  contacts: contactReducer,
  plans: planReducer,
  conversations: conversationReducer,
  messages: messageReducer,
  lists: listReducer,
  fields: fieldReducer,
});

export default allReducer;
