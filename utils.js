const isDate = (date) => {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
};

const hasPassed = (date) => {
  return date < new Date();
};

module.exports = {
  isDate,
  hasPassed
};