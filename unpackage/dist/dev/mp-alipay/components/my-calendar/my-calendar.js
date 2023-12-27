"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "my-calendar",
  props: {
    //当月打卡数据
    patchMonthData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  emits: ["selectData", "changeSwiper"],
  setup(__props, { emit }) {
    const props = __props;
    const current = common_vendor.ref(1);
    const nowYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const nowMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const today = (/* @__PURE__ */ new Date()).getDate();
    const toMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
    const toYear = (/* @__PURE__ */ new Date()).getFullYear();
    const weeksTxt = ["日", "一", "二", "三", "四", "五", "六"];
    const preM_date = common_vendor.ref([]);
    const thenM_date = common_vendor.ref([]);
    const nexM_date = common_vendor.ref([]);
    common_vendor.watch(
      [current.value, props.patchMonthData],
      ([newCurrentt, newPatchMonthData], [oldCurrentt, oldPatchMonthData]) => {
        console.log("111");
        switch (oldCurrentt) {
          case 1:
            if (newCurrentt == 2) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              calculateGrids(next.year, next.month, preM_date.value);
              fullDate(next.year, next.month, preM_date.value);
            } else if (newCurrentt == 0) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              calculateGrids(next.year, next.month, nexM_date.value);
              fullDate(next.year, next.month, nexM_date.value);
            }
            emit("changeSwiper", nowYear.value + "-" + nowMonth.value);
            break;
          case 2:
            if (newCurrentt == 0) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              calculateGrids(next.year, next.month, thenM_date.value);
              fullDate(next.year, next.month, thenM_date.value);
            } else if (newCurrentt == 1) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              calculateGrids(next.year, next.month, preM_date.value);
              fullDate(next.year, next.month, preM_date.value);
            }
            emit("changeSwiper", nowYear.value + "-" + nowMonth.value);
            break;
          case 0:
            if (newCurrentt == 1) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
              calculateGrids(next.year, next.month, nexM_date.value);
              fullDate(next.year, next.month, nexM_date.value);
            } else if (newCurrentt == 2) {
              let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              nowYear.value = newNow.year;
              nowMonth.value = newNow.month;
              let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
              calculateGrids(next.year, next.month, thenM_date.value);
              fullDate(next.year, next.month, thenM_date.value);
            }
            emit("changeSwiper", nowYear.value + "-" + nowMonth.value);
            break;
        }
        switch (current.value) {
          case 0:
            changePatchMonth(newPatchMonthData, preM_date.value);
            break;
          case 1:
            changePatchMonth(newPatchMonthData, thenM_date.value);
            break;
          case 2:
            changePatchMonth(newPatchMonthData, nexM_date.value);
            break;
        }
      },
      { deep: true }
    );
    common_vendor.onMounted(() => {
      init();
    });
    const init = () => {
      calculateGrids(nowYear.value, nowMonth.value, thenM_date.value);
      fullDate(nowYear.value, nowMonth.value, thenM_date.value);
      let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1);
      calculateGrids(next.year, next.month, nexM_date.value);
      fullDate(next.year, next.month, nexM_date.value);
      let last = getOperateMonthDate(nowYear.value, nowMonth.value, -1);
      calculateGrids(last.year, last.month, preM_date.value);
      fullDate(last.year, last.month, preM_date.value);
    };
    const toIOSDate = (strDate) => {
      return strDate ? strDate.replace(/-/g, "/") : strDate;
    };
    const getFirstDayOfWeek = (year, month, day = 1) => {
      let date = new Date(year, month - 1, day);
      return date.getDay();
    };
    const getDaysInMonth = (year, month) => {
      let date = new Date(year, month, 0);
      return date.getDate();
    };
    const getOperateMonthDate = (y, m, num) => {
      let month = m + num;
      let year = y;
      month > 12 ? (year++, month = 1) : null;
      month < 1 ? (year--, month = 12) : null;
      return {
        month,
        year
      };
    };
    const calculateGrids = (year, month, calendarDays) => {
      let newCalendarDays = [];
      const firstDayOfWeek = getFirstDayOfWeek(year, month);
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          newCalendarDays.push({
            date: null,
            // 显示的日期
            fullDate: null,
            // 日期yyyy-mm-dd格式
            isBeforeToday: true,
            // 今日之前
            patchStatus: ["--grey", "--grey"],
            // 打卡状态
            isThisMonth: false,
            // 是本月
            isToday: false,
            //是否为当日
            isSelect: false
            //当前日期是否被选中
          });
        }
      }
      const thisMonthDays = getDaysInMonth(year, month);
      const toDate = /* @__PURE__ */ new Date(toYear + "/" + toMonth + "/" + today);
      for (let i = 1; i <= thisMonthDays; i++) {
        const fullDate2 = year + "-" + month + "-" + i.toString().padStart(2, "0");
        const isBeforeToday = new Date(toIOSDate(fullDate2)) < toDate;
        const isToday = new Date(toIOSDate(fullDate2)).getTime() == toDate.getTime();
        newCalendarDays.push({
          date: i,
          fullDate: fullDate2,
          isBeforeToday,
          patchStatus: ["--grey", "--grey"],
          // 打卡状态
          isThisMonth: true,
          isToday,
          isSelect: false
          //当前日期是否被选中
        });
      }
      calendarDays.splice(0, calendarDays.length, ...newCalendarDays);
    };
    const fullDate = (year, month, calendarDays) => {
      const firstDayOfWeek = getFirstDayOfWeek(year, month);
      const lastMonthEndDay = getDaysInMonth(year, month - 1);
      const lastMonth = getOperateMonthDate(year, month, -1);
      for (let i = 0; i < firstDayOfWeek; i++) {
        const date = lastMonthEndDay - firstDayOfWeek + 1 + i;
        calendarDays[i].date = date;
        calendarDays[i].fullDate = lastMonth.year + "-" + lastMonth.month + "-" + date;
      }
      const endDay = getDaysInMonth(year, month);
      const lastDayOfWeek = getFirstDayOfWeek(year, month, endDay);
      const nextMonth = getOperateMonthDate(year, month, 1);
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        calendarDays.push({
          date: i,
          fullDate: `${nextMonth.year}-${nextMonth.month}-${i}`,
          isBeforeToday: false,
          // 今日之前
          patchStatus: ["--grey", "--grey"],
          // 打卡状态
          isThisMonth: false,
          // 是本月
          isToday: false,
          //是否是本日
          isSelect: false
          //当前日期是否被选中
        });
      }
    };
    const changePatchMonth = (patchMonthData, M_data) => {
      if (patchMonthData && M_data) {
        M_data.map((item) => {
          patchMonthData.forEach((item1) => {
            if (item.fullDate == item1.date) {
              item.patchStatus[0] = item1.result[0].patchResult == 4 ? "--primary-2" : item1.result[0].patchResult == 1 ? "--red" : item1.result[0].patchResult == 2 ? "--yellow" : "--white";
              item.patchStatus[1] = item1.result[1].patchResult == 4 ? "--primary-2" : item1.result[1].patchResult == 1 ? "--red" : item1.result[1].patchResult == 3 ? "--yellow" : "--white";
            }
          });
          return item;
        });
      }
    };
    const changeSwiper = (e) => {
      current.value = e.detail.current;
    };
    const selectData = (data, M_data) => {
      emit("selectData", data);
      M_data.map((item, index) => {
        item.isSelect = false;
        item.fullDate == data ? M_data[index].isSelect = true : null;
        return item;
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(nowYear.value || "--"),
        b: common_vendor.t(nowMonth.value || "--"),
        c: common_vendor.f(weeksTxt, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        d: common_vendor.f(preM_date.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.date),
            b: item.isThisMonth
          }, item.isThisMonth ? {
            c: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)`,
            d: item.patchStatus[0] != "--grey" ? 1 : ""
          } : {}, {
            e: common_vendor.n({
              otherMonth: !item.isThisMonth
            }),
            f: common_vendor.n({
              isToday: item.isToday
            }),
            g: common_vendor.n({
              isSelect: item.isSelect
            }),
            h: index,
            i: common_vendor.o(($event) => selectData(item.fullDate, preM_date.value))
          });
        }),
        e: common_vendor.f(thenM_date.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.date),
            b: item.isThisMonth
          }, item.isThisMonth ? {
            c: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)`,
            d: item.patchStatus[0] != "--grey" ? 1 : ""
          } : {}, {
            e: common_vendor.n({
              otherMonth: !item.isThisMonth
            }),
            f: common_vendor.n({
              isToday: item.isToday
            }),
            g: common_vendor.n({
              isSelect: item.isSelect
            }),
            h: index,
            i: common_vendor.o(($event) => selectData(item.fullDate, thenM_date.value))
          });
        }),
        f: common_vendor.f(nexM_date.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.date),
            b: item.isThisMonth
          }, item.isThisMonth ? {
            c: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)`,
            d: item.patchStatus[0] != "--grey" ? 1 : ""
          } : {}, {
            e: common_vendor.n({
              otherMonth: !item.isThisMonth
            }),
            f: common_vendor.n({
              isToday: item.isToday
            }),
            g: common_vendor.n({
              isSelect: item.isSelect
            }),
            h: index,
            i: common_vendor.o(($event) => selectData(item.fullDate, nexM_date.value))
          });
        }),
        g: current.value,
        h: common_vendor.o(changeSwiper)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-afe5605e"], ["__file", "E:/Users/szy/Desktop/project/小程序日历/components/my-calendar/my-calendar.vue"]]);
my.createComponent(Component);
