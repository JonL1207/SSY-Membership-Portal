/**
 * Format the users membership number using the SSY abbreviation, a random 4 digit number,
 * and the year to 2 digits. Allowing for 9999 new unique membership numbers per year.
 */
const generateMembershipNumber = () => {
  const abbreviation = "SSY";
  const year = new Date().getFullYear().toString().slice(2);
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  return abbreviation.concat(randomNumber.toString(), year);
};

module.exports = {
  generateMembershipNumber,
};
