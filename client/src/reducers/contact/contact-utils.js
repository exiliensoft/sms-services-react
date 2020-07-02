export const toggle = (openContacts, contactData) => {
  if (openContacts.find((contact) => contact === contactData._id)) {
    return openContacts.filter((contact) => contact !== contactData._id);
  }
  return openContacts.concat([contactData._id]);
};
