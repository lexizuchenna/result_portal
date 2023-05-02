const moment = require("moment");

const formatDate = (date) => {
  return moment(date, "DD-MM-YYYY, h: mm").format("DD-MM-YYYY, h: mm");
};

const addNumbers = (num1, num2, num3, num4) => {
  return parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4);
};

const checkGrade = (num1, num2, num3, num4) => {
  let total = parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4);
  if (total >= 85) {
    return "E";
  } else if (total >= 79) {
    return "G";
  } else if (total >= 65) {
    return "S";
  } else if (total <= 64) {
    return "NI";
  } else if ((total = 0 || total === "" || !total)) {
    return "NA";
  }
};
const checkRemark = (num1, num2, num3, num4, num5) => {
  let total =
    parseInt(num1) +
    parseInt(num2) +
    parseInt(num3) +
    parseInt(num4) +
    parseInt(num5);
  if (total >= 85) {
    return "Excellent";
  } else if (total >= 79) {
    return "Good";
  } else if (total >= 65) {
    return "Satisfactory";
  } else {
    return "Needs Improvement";
  }
};

const ifEqual = (a, b, options) => {
  if (a == b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

const capitalize = (word) => {
  return word.toUpperCase();
};

module.exports = {
  formatDate,
  addNumbers,
  checkGrade,
  checkRemark,
  ifEqual,
  capitalize,
};
