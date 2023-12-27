"use strict";
function toIOSDate(strDate) {
  return strDate ? strDate.replace(/-/g, "/") : strDate;
}
function getFirstDayOfWeek(year, month, day = 1) {
  let date = new Date(year, month - 1, day);
  return date.getDay();
}
function getDaysInMonth(year, month) {
  let date = new Date(year, month, 0);
  return date.getDate();
}
function getOperateMonthDate(y, m, num) {
  let month = m + num;
  let year = y;
  month > 12 ? (year++, month = 1) : null;
  month < 1 ? (year--, month = 12) : null;
  return {
    month,
    year
  };
}
exports.getDaysInMonth = getDaysInMonth;
exports.getFirstDayOfWeek = getFirstDayOfWeek;
exports.getOperateMonthDate = getOperateMonthDate;
exports.toIOSDate = toIOSDate;
