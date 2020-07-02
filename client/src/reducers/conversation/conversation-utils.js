export const updateMessageUnreadCount = (chats, data) => {
  const { conversation, clear, message, tags } = data;
  const conversationData = chats.data.find((obj) => obj.id === conversation);

  if (conversationData) {
    let newConversations;
    if (clear) {
      newConversations = chats.data.map((item) =>
        item.id === conversation ? { ...item, unread: 0 } : item
      );
      return { ...chats, data: newConversations };
    } else {
      newConversations = chats.data.map((item) =>
        item.id === conversation
          ? {
              ...item,
              unread: item.unread + 1,
              unreplied: true,
              last_message: message || item.message,
              tags,
            }
          : item
      );
      return { ...chats, data: newConversations };
    }
  }

  return chats;
};

export const updateMessageUnrepliedStatus = (chats, data) => {
  const { conversation, status, message } = data;
  const conversationData = chats.data.find((obj) => obj.id === conversation);

  if (conversationData) {
    let newConversations = chats.data.map((item) =>
      item.id === conversation
        ? { ...item, unreplied: status, last_message: message, is_close: false }
        : item
    );
    return { ...chats, data: newConversations };
  }

  return chats;
};

export const updateCloseConversationStatus = (chats, data) => {
  const { conversation, status } = data;
  const conversationData = chats.data.find((obj) => obj.id === conversation);

  if (conversationData) {
    let newConversations = chats.data.map((item) =>
      item.id === conversation ? { ...item, is_close: status } : item
    );
    return { ...chats, data: newConversations };
  }

  return chats;
};

export const updateSeenStatus = (chats, { conversationId, id }) => {
  const conversationData = chats.data.find((obj) => obj.id === conversationId);

  if (conversationData) {
    let newConversations = chats.data.map((item) => {
      if (item.id === conversationId) {
        if (item.tags && item.tags[id] > 0) {
          item.tags[id] = 0;
        }
        return item;
      } else {
        return item;
      }
    });
    return { ...chats, data: newConversations };
  }

  return chats;
};

export const updateConversation = (chats, newChat) => {
  const conversationData = chats.find((obj) => obj.id === newChat.id);
  if (conversationData) {
    let newConversations = chats.map((item) => {
      if (item.id === newChat.id) {
        return newChat;
      } else {
        return item;
      }
    });
    return newConversations;
  }
  return chats;
};
