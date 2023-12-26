"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  Mycalendar();
}
const Mycalendar = () => "../../components/my-calendar/my-calendar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(_ctx.title)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/Users/szy/Desktop/project/小程序日历/pages/index/index.vue"]]);
my.createPage(MiniProgramPage);
