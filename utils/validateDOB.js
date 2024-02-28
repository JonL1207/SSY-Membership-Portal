const isValidDOB = (date) => {
  const dateToday = new Date();
  const yearDiff = dateToday.getFullYear() - date.getFullYear();
  const monthDiff = dateToday.getMonth() + 1 - (date.getMonth() + 1);
  const daysDiff = dateToday.getDate() - date.getDate();

  const age = Math.floor(((yearDiff * 365) + (monthDiff * 31) + daysDiff) / 365);

  if (age < 14 || age > 30) {
    return false;
  }

  return true;
};

module.exports = {
  isValidDOB,
};
