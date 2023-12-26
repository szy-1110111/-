"use strict";
const common_vendor = require("../../common/vendor.js");
const components_myCalendar_utils = require("./utils.js");
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
    const swiperPageM_data = common_vendor.ref([[], [], []]);
    common_vendor.watch(props.patchMonthData, (newPatchMonthData, oldPatchMonthData) => {
      changePatchMonth(newPatchMonthData, current.value);
    });
    common_vendor.watch(
      current,
      (newCurrentt, oldCurrentt) => {
        let mothSetup = 0;
        if (newCurrentt + oldCurrentt == 3 || newCurrentt + oldCurrentt == 1) {
          oldCurrentt - newCurrentt < 0 ? mothSetup = 1 : mothSetup = -1;
        }
        if (newCurrentt + oldCurrentt == 2) {
          oldCurrentt - newCurrentt < 0 ? mothSetup = -1 : mothSetup = 1;
        }
        let changeCurrent = 3 - (newCurrentt + oldCurrentt);
        redrawData(changeCurrent, mothSetup);
        emit("changeSwiper", nowYear.value + "-" + nowMonth.value);
      },
      { deep: true }
    );
    common_vendor.onMounted(() => {
      init();
    });
    const init = () => {
      calculateGrids(nowYear.value, nowMonth.value, 1);
      fullDate(nowYear.value, nowMonth.value, 1);
      let next = components_myCalendar_utils.getOperateMonthDate(nowYear.value, nowMonth.value, 1);
      calculateGrids(next.year, next.month, 2);
      fullDate(next.year, next.month, 2);
      let last = components_myCalendar_utils.getOperateMonthDate(nowYear.value, nowMonth.value, -1);
      calculateGrids(last.year, last.month, 0);
      fullDate(last.year, last.month, 0);
    };
    function redrawData(changeCurrent, mothSetup) {
      nowYear.value = components_myCalendar_utils.getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup).year;
      nowMonth.value = components_myCalendar_utils.getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup).month;
      let next = components_myCalendar_utils.getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup);
      calculateGrids(next.year, next.month, changeCurrent);
      fullDate(next.year, next.month, changeCurrent);
    }
    const calculateGrids = (year, month, current2) => {
      let newCalendarDays = [];
      const firstDayOfWeek = components_myCalendar_utils.getFirstDayOfWeek(year, month);
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
      const thisMonthDays = components_myCalendar_utils.getDaysInMonth(year, month);
      const toDate = /* @__PURE__ */ new Date(toYear + "/" + toMonth + "/" + today);
      for (let i = 1; i <= thisMonthDays; i++) {
        const fullDate2 = year + "-" + month + "-" + i.toString().padStart(2, "0");
        const isBeforeToday = new Date(components_myCalendar_utils.toIOSDate(fullDate2)) < toDate;
        const isToday = new Date(components_myCalendar_utils.toIOSDate(fullDate2)).getTime() == toDate.getTime();
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
      swiperPageM_data.value[current2].splice(0, swiperPageM_data.value[current2].length, ...newCalendarDays);
    };
    const fullDate = (year, month, current2) => {
      const firstDayOfWeek = components_myCalendar_utils.getFirstDayOfWeek(year, month);
      const lastMonthEndDay = components_myCalendar_utils.getDaysInMonth(year, month - 1);
      const lastMonth = components_myCalendar_utils.getOperateMonthDate(year, month, -1);
      for (let i = 0; i < firstDayOfWeek; i++) {
        const date = lastMonthEndDay - firstDayOfWeek + 1 + i;
        swiperPageM_data.value[current2][i].date = date;
        swiperPageM_data.value[current2][i].fullDate = lastMonth.year + "-" + lastMonth.month + "-" + date;
      }
      const endDay = components_myCalendar_utils.getDaysInMonth(year, month);
      const lastDayOfWeek = components_myCalendar_utils.getFirstDayOfWeek(year, month, endDay);
      const nextMonth = components_myCalendar_utils.getOperateMonthDate(year, month, 1);
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        swiperPageM_data.value[current2].push({
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
    const changePatchMonth = (patchMonthData, current2) => {
      if (patchMonthData && swiperPageM_data.value[current2]) {
        swiperPageM_data.value[current2].map((item) => {
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
    const selectData = (data) => {
      emit("selectData", data);
      swiperPageM_data.value[current.value].map((item, index) => {
        item.isSelect = false;
        item.fullDate == data ? swiperPageM_data.value[current.value][index].isSelect = true : null;
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
        d: common_vendor.f(swiperPageM_data.value, (currentData, index, i0) => {
          return {
            a: common_vendor.f(currentData, (item, index2, i1) => {
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
                h: index2,
                i: common_vendor.o(($event) => selectData(item.fullDate), index2)
              });
            }),
            b: index
          };
        }),
        e: current.value,
        f: common_vendor.o(changeSwiper)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-afe5605e"], ["__file", "E:/Users/szy/Desktop/project/小程序日历/components/my-calendar/my-calendar.vue"]]);
wx.createComponent(Component);
