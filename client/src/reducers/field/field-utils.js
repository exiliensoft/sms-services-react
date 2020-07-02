export const updateField = (fields, newField) => {
  if (!fields.find((field) => newField.id == field.id)) return fields;
  return [
    ...fields.filter((field) => field.id != newField.id),
    { ...fields.filter((field) => field.id == newField.id)[0], ...newField },
  ];
};
