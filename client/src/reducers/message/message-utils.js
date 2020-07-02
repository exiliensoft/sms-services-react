const prettyBytes = require("pretty-bytes");

export const addMessageToChat = (messages, data) => {
  const message = {
    id: data.id,
    message: data.message,
    message_type: "FROM",
    from: data.from,
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data.date)),
    internal: data.internal,
    sent: data.sent,
    failed: data.failed,
    attachment: data.attachment,
    attachment_name: data.attachment_name,
    attachment_size: data.attachment_size
      ? prettyBytes(data.attachment_size)
      : null,
    filename: data.filename,
  };
  const newMessage = [...messages.data, message];
  return {
    ...messages,
    data: newMessage,
  };
};

export const addReceviedMessageToChat = (messages, data) => {
  const message = {
    id: data.id,
    message: data.message,
    from: data.from,
    from_email: data.from_email,
    _did: data._did,
    message_type: data.from ? "FROM" : "TO",
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data.date)),
    internal: data.internal,
    attachment: data.attachment,
    attachment_name: data.attachment_name,
    attachment_size: data.attachment_size
      ? prettyBytes(data.attachment_size)
      : null,
    filename: data.filename,
    close_type: data.close_type,
    _group: data._group,
  };
  const newMessage = [...messages.data, message];
  return {
    ...messages,
    data: newMessage,
  };
};

export const updateMessageStatus = (messages, data) => {
  const { messageId, status } = data;
  const message = messages.data.find((obj) => obj.id === messageId);

  if (status === "sent") {
    if (message) {
      let newMessages = messages.data.map((item) =>
        item.id === messageId ? { ...item, sent: true } : item
      );
      return {
        ...messages,
        data: newMessages,
      };
    }
  }
  return messages;
};
