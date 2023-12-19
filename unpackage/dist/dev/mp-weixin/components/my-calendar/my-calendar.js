"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      current: 1,
      //轮播页码
      nowYear: (/* @__PURE__ */ new Date()).getFullYear(),
      //当前选的年
      nowMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
      //当前选的月
      today: (/* @__PURE__ */ new Date()).getDate(),
      //系统本日
      toMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
      //系统本月
      toYear: (/* @__PURE__ */ new Date()).getFullYear(),
      //系统本年
      weeksTxt: ["日", "一", "二", "三", "四", "五", "六"],
      preM_date: [],
      //上个月日期数据
      thenM_date: [],
      //此月日期数据
      nexM_date: []
      //下个月日期数据
    };
  },
  props: {
    //当月打卡数据
    patchMonthData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    current(newVal, oldVal) {
      switch (oldVal) {
        case 1:
          if (newVal == 2) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.calculateGrids(next.year, next.month, "preM_date");
            this.fullDate(next.year, next.month, this.preM_date);
          } else if (newVal == 0) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.calculateGrids(next.year, next.month, "nexM_date");
            this.fullDate(next.year, next.month, this.nexM_date);
          }
          this.$emit("changeSwiper", this.nowYear + "-" + this.nowMonth);
          break;
        case 2:
          if (newVal == 0) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.calculateGrids(next.year, next.month, "thenM_date");
            this.fullDate(next.year, next.month, this.thenM_date);
          } else if (newVal == 1) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.calculateGrids(next.year, next.month, "preM_date");
            this.fullDate(next.year, next.month, this.preM_date);
          }
          this.$emit("changeSwiper", this.nowYear + "-" + this.nowMonth);
          break;
        case 0:
          if (newVal == 1) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
            this.calculateGrids(next.year, next.month, "nexM_date");
            this.fullDate(next.year, next.month, this.nexM_date);
          } else if (newVal == 2) {
            let newNow = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.nowYear = newNow.year;
            this.nowMonth = newNow.month;
            let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
            this.calculateGrids(next.year, next.month, "thenM_date");
            this.fullDate(next.year, next.month, this.thenM_date);
          }
          this.$emit("changeSwiper", this.nowYear + "-" + this.nowMonth);
          break;
      }
    },
    // 打卡数据变动
    patchMonthData(newVal, oldVal) {
      switch (this.current) {
        case 0:
          this.changePatchMonth(newVal, this.preM_date);
          break;
        case 1:
          this.changePatchMonth(newVal, this.thenM_date);
          break;
        case 2:
          this.changePatchMonth(newVal, this.nexM_date);
          break;
      }
    }
  },
  methods: {
    // 初始化日期数据
    init() {
      this.calculateGrids(this.nowYear, this.nowMonth, "thenM_date");
      this.fullDate(this.nowYear, this.nowMonth, this.thenM_date);
      let next = this.getOperateMonthDate(this.nowYear, this.nowMonth, 1);
      this.calculateGrids(next.year, next.month, "nexM_date");
      this.fullDate(next.year, next.month, this.nexM_date);
      let last = this.getOperateMonthDate(this.nowYear, this.nowMonth, -1);
      this.calculateGrids(last.year, last.month, "preM_date");
      this.fullDate(last.year, last.month, this.preM_date);
    },
    toIOSDate(strDate) {
      return strDate ? strDate.replace(/-/g, "/") : strDate;
    },
    // 计算某月1号为星期几
    getFirstDayOfWeek(year, month, day = 1) {
      let date = new Date(year, month - 1, day);
      return date.getDay();
    },
    // 计算某月一个有多少天
    getDaysInMonth(year, month) {
      let date = new Date(year, month, 0);
      return date.getDate();
    },
    // 计算上、下月
    getOperateMonthDate(y, m, num) {
      let month = m + num;
      let year = y;
      month > 12 ? (year++, month = 1) : null;
      month < 1 ? (year--, month = 12) : null;
      return {
        month,
        year
      };
    },
    // 某月的日历数据导入
    calculateGrids(year, month, target) {
      let calendarDays = [];
      const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          calendarDays.push({
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
      const thisMonthDays = this.getDaysInMonth(year, month);
      const toDate = /* @__PURE__ */ new Date(this.toYear + "/" + this.toMonth + "/" + this.today);
      for (let i = 1; i <= thisMonthDays; i++) {
        const fullDate = year + "-" + month + "-" + i.toString().padStart(2, "0");
        const isBeforeToday = new Date(this.toIOSDate(fullDate)) < toDate;
        const isToday = new Date(this.toIOSDate(fullDate)).getTime() == toDate.getTime();
        calendarDays.push({
          date: i,
          fullDate,
          isBeforeToday,
          patchStatus: ["--grey", "--grey"],
          // 打卡状态
          isThisMonth: true,
          isToday,
          isSelect: false
          //当前日期是否被选中
        });
      }
      this.$set(this, target, calendarDays);
    },
    // 填充日期数组
    fullDate(year, month, calendarDays) {
      const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
      const lastMonthEndDay = this.getDaysInMonth(year, month - 1);
      const lastMonth = this.getOperateMonthDate(year, month, -1);
      for (let i = 0; i < firstDayOfWeek; i++) {
        const date = lastMonthEndDay - firstDayOfWeek + 1 + i;
        calendarDays[i].date = date;
        calendarDays[i].fullDate = lastMonth.year + "-" + lastMonth.month + "-" + date;
      }
      const endDay = this.getDaysInMonth(year, month);
      const lastDayOfWeek = this.getFirstDayOfWeek(year, month, endDay);
      const nextMonth = this.getOperateMonthDate(year, month, 1);
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
    },
    // 父组件传值处理函数
    // 当月打卡状态获取并加入数据数组中
    changePatchMonth(patchMonthData, M_data) {
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
    },
    // 交互事件函数
    // 滑动动画结束，改变前后页的日历数组
    changeSwiper(e) {
      this.current = e.detail.current;
    },
    // 点击日历日期事件
    selectData(data, M_data) {
      this.$emit("selectData", data);
      M_data.map((item, index) => {
        item.isSelect = false;
        item.fullDate == data ? M_data[index].isSelect = true : null;
        return item;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.nowYear || "--"),
    b: common_vendor.t($data.nowMonth || "--"),
    c: common_vendor.f($data.weeksTxt, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_vendor.f($data.preM_date, (item, index, i0) => {
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
        i: common_vendor.o(($event) => $options.selectData(item.fullDate, $data.preM_date), index)
      });
    }),
    e: common_vendor.f($data.thenM_date, (item, index, i0) => {
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
        i: common_vendor.o(($event) => $options.selectData(item.fullDate, $data.thenM_date), index)
      });
    }),
    f: common_vendor.f($data.nexM_date, (item, index, i0) => {
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
        i: common_vendor.o(($event) => $options.selectData(item.fullDate, $data.nexM_date), index)
      });
    }),
    g: $data.current,
    h: common_vendor.o((...args) => $options.changeSwiper && $options.changeSwiper(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-afe5605e"], ["__file", "E:/Users/szy/Desktop/project/小程序日历/components/my-calendar/my-calendar.vue"]]);
wx.createComponent(Component);
