const UserNameField = ({ record: { properties: { last_name: lastName = '', first_name: firstName = '' }, email } }) => `${firstName} ${lastName}`.trim() || email;

export default UserNameField;
