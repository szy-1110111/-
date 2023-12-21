<template>
  <!-- 日历主体 -->
  <view class="Cbody">
    <!-- 日历头部年月显示 -->
    <view class="Cheader">{{ nowYear || '--' }} 年 {{ nowMonth || '--' }} 月</view>
    <!-- 日历星期 -->
    <view class="Cweek">
      <view class="weekText" v-for="(item, index) in weeksTxt" :key="index">{{ item }}</view>
    </view>
    <swiper class="Cmain" :current="current" circular @change="changeSwiper">
      <!-- 前一个月 -->
      <swiper-item>
        <view class="dateTable">
          <view
            class="dateText"
            :class="[{ otherMonth: !item.isThisMonth }, { isToday: item.isToday }, { isSelect: item.isSelect }]"
            v-for="(item, index) in preM_date"
            :key="index"
            @click="selectData(item.fullDate, preM_date)"
          >
            {{ item.date }}
            <view
              v-if="item.isThisMonth"
              :style="{ background: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)` }"
              class="mark"
              :class="{ patchSucces: item.patchStatus[0] != '--grey' }"
            ></view>
          </view>
        </view>
      </swiper-item>

      <!-- 当前月 -->
      <swiper-item>
        <view class="dateTable">
          <view
            class="dateText"
            :class="[{ otherMonth: !item.isThisMonth }, { isToday: item.isToday }, { isSelect: item.isSelect }]"
            v-for="(item, index) in thenM_date"
            :key="index"
            @click="selectData(item.fullDate, thenM_date)"
          >
            {{ item.date }}
            <view
              v-if="item.isThisMonth"
              :style="{ background: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)` }"
              class="mark"
              :class="{ patchSucces: item.patchStatus[0] != '--grey' }"
            ></view>
          </view>
        </view>
      </swiper-item>

      <!-- 后一个月 -->
      <swiper-item>
        <view class="dateTable">
          <view
            class="dateText"
            :class="[{ otherMonth: !item.isThisMonth }, { isToday: item.isToday }, { isSelect: item.isSelect }]"
            v-for="(item, index) in nexM_date"
            :key="index"
            @click="selectData(item.fullDate, nexM_date)"
          >
            {{ item.date }}
            <view
              v-if="item.isThisMonth"
              :style="{ background: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${item.patchStatus[1]}) 50%)` }"
              class="mark"
              :class="{ patchSucces: item.patchStatus[0] != '--grey' }"
            ></view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
	import {ref,reactive,watch,onMounted,defineEmits }from 'vue'
	import { DailyData } from './type'
	const emit = defineEmits(['selectData'])
	
      const current=ref(1)//轮播当前页码
      const nowYear=ref(new Date().getFullYear())//当前显示的年
      const nowMonth=ref(new Date().getMonth() + 1)//当前显示的月
      const today=new Date().getDate()  //系统本日
      const toMonth= new Date().getMonth() + 1 //系统本月
      const toYear= new Date().getFullYear() //系统本年
      const weeksTxt=['日', '一', '二', '三', '四', '五', '六']
      const preM_date=ref([] as DailyData[])//上个月日期数据
      const thenM_date=ref([]as DailyData[] )//此月日期数据
      const nexM_date=ref([]as DailyData[] )//下个月日期数据

	const props= defineProps({
		//当月打卡数据
		patchMonthData: {
		  type: Array,
		  default: () => {
			return []
		  }
		}
	})


  // mounted() {
  //   this.init()
  // },
  watch([current.value,props.patchMonthData],([newCurrentt,newPatchMonthData],[oldCurrentt,oldPatchMonthData])=>{
	  switch (oldCurrentt) {
	    //中间页面滚动时
	    case 1:
	      if (newCurrentt == 2) {
	        //右滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
	        nowYear.value = newNow.year
	        nowMonth.value = newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value,nowMonth.value, 1)
	        calculateGrids(next.year, next.month, preM_date.value)
	        fullDate(next.year, next.month,preM_date.value)
	      } else if (newCurrentt == 0) {
	        //左滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        nowYear.value = newNow.year
	        nowMonth.value= newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        calculateGrids(next.year, next.month, nexM_date.value)
	        fullDate(next.year, next.month,nexM_date.value)
	      }
	      //传给调用模板页面请求当月打卡数据
	      this.$emit('changeSwiper', nowYear.value + '-' +nowMonth.value)
	      break
	    //末尾页面滚动时
	    case 2:
	      if (newCurrentt == 0) {
	        //右滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
	        nowYear.value = newNow.year
	        nowMonth.value = newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
	        calculateGrids(next.year, next.month, thenM_date.value)
	        fullDate(next.year, next.month, thenM_date.value)
	      } else if (newCurrentt == 1) {
	        //左滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        nowYear.value = newNow.year
	        nowMonth.value = newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        calculateGrids(next.year, next.month, preM_date.value)
	        fullDate(next.year, next.month, preM_date.value)
	      }
	      //传给调用模板页面请求当月打卡数据
	      this.$emit('changeSwiper', nowYear.value + '-' + nowMonth.value)
	      break
	    //头页面滚动时
	    case 0:
	      if (newCurrentt == 1) {
	        //右滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
	        nowYear.value = newNow.year
	        nowMonth.value = newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
	        calculateGrids(next.year, next.month, nexM_date.value)
	        fullDate(next.year, next.month, nexM_date.value)
	      } else if (newCurrentt == 2) {
	        //左滑
	        let newNow = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        nowYear.value= newNow.year
	        nowMonth.value = newNow.month
	        // 下个月日历
	        let next = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
	        calculateGrids(next.year, next.month, thenM_date.value)
	        fullDate(next.year, next.month, thenM_date.value)
	      }
	      //传给调用模板页面请求当月打卡数据
	      this.$emit('changeSwiper', nowYear.value + '-' + nowMonth.value)
	      break
	  }
	  // 打卡数据变动
	  // 当前页数将打卡数据加入到对应的数据数组中
	  switch (current.value) {
	    case 0:
	      changePatchMonth(newPatchMonthData, preM_date.value)
	      break
	    case 1:
	      changePatchMonth(newPatchMonthData, thenM_date.value)
	      break
	    case 2:
	      changePatchMonth(newPatchMonthData, nexM_date.value)
	      break
	  }
  })
	onMounted(()=>{
		init()
	})
    const init=()=>{
      calculateGrids(nowYear.value, nowMonth.value, thenM_date.value)
      fullDate(nowYear.value, nowMonth.value, thenM_date.value)
      // 下个月日历
      let next = getOperateMonthDate(nowYear.value, nowMonth.value, 1)
      calculateGrids(next.year, next.month, nexM_date.value)
      fullDate(next.year, next.month, nexM_date.value)
      // 上个月日历
      let last = getOperateMonthDate(nowYear.value, nowMonth.value, -1)
      calculateGrids(last.year, last.month, preM_date.value)
      fullDate(last.year, last.month, preM_date.value)
    }

// iso不认识"-"拼接的日期，所以转/
    const toIOSDate=(strDate: string)=>{
      return strDate ? strDate.replace(/-/g, '/') : strDate
    }

    // 计算某月1号为星期几
    const getFirstDayOfWeek=(year: number, month: number, day: number = 1)=>{
      let date = new Date(year, month - 1, day)
      // getDay方法返回的是一个0（代表星期日）到6（代表星期六）的数字
      return date.getDay()
    }

    // 计算某月一个有多少天
    const getDaysInMonth=(year: number, month: number)=> {
      // 设置日期为下个月的第0天，就会得到这个月的最后一天
      let date = new Date(year, month, 0)
      // getDate方法返回的是日期，也就是这个月的总天数
      return date.getDate()
    }

    // 计算上、下月
    const getOperateMonthDate=(y: number, m: number, num: number)=> {
      let month: number = m + num
      let year: number = y
      month > 12 ? (year++, (month = 1)) : null //12月下个月为下一年的一月
      month < 1 ? (year--, (month = 12)) : null //1月上个月为上一年的十二月
      return {
        month,
        year
      }
    }

    // 某月的日历数据导入
    const calculateGrids=(year: number, month: number, calendarDays: DailyData[])=> {
      // 计算当月1号前空了几个格子，把它填充在传入的某月的M_data数组的前面
      //计算每个月时要清零
      let newCalendarDays = []
      const firstDayOfWeek = getFirstDayOfWeek(year, month)
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          newCalendarDays.push({
            date: null, // 显示的日期
            fullDate: null, // 日期yyyy-mm-dd格式
            isBeforeToday: true, // 今日之前
            patchStatus: ['--grey', '--grey'], // 打卡状态
            isThisMonth: false, // 是本月
            isToday: false, //是否为当日
            isSelect: false //当前日期是否被选中
          })
        }
      }
      //  绘制当月天数占的格子，并把它放到数据数组中
      const thisMonthDays = getDaysInMonth(year, month)
      const toDate = new Date(toYear + '/' + toMonth + '/' + today)
      for (let i = 1; i <= thisMonthDays; i++) {
        const fullDate = year + '-' + month + '-' + i.toString().padStart(2, '0')
        const isBeforeToday = new Date(toIOSDate(fullDate)) < toDate
        const isToday = new Date(toIOSDate(fullDate)).getTime() == toDate.getTime()
        newCalendarDays.push({
          date: i,
          fullDate,
          isBeforeToday,
          patchStatus: ['--grey', '--grey'], // 打卡状态
          isThisMonth: true,
          isToday: isToday,
          isSelect: false //当前日期是否被选中
        })
      }
	  calendarDays.splice(0, calendarDays.length, ...newCalendarDays);
      // this.$set(this, target, calendarDays)
      console.log(thenM_date.value)
    }

    // 填充日期数组
    const fullDate=(year: number, month: number, calendarDays: DailyData[]) =>{
      // 日历前填充上个月末尾日期
      const firstDayOfWeek = getFirstDayOfWeek(year, month) //1号星期几
      const lastMonthEndDay = getDaysInMonth(year, month - 1) //上个月天数
      const lastMonth = getOperateMonthDate(year, month, -1)
      for (let i = 0; i < firstDayOfWeek; i++) {
        const date = lastMonthEndDay - firstDayOfWeek + 1 + i
        calendarDays[i].date = date
        calendarDays[i].fullDate = lastMonth.year + '-' + lastMonth.month + '-' + date
      }
      // 日历后补下个月初日期
      const endDay = getDaysInMonth(year, month) //本月最后一天几号
      const lastDayOfWeek = getFirstDayOfWeek(year, month, endDay) //本月最后一天星期几
      const nextMonth = getOperateMonthDate(year, month, 1)
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        calendarDays.push({
          date: i,
          fullDate: `${nextMonth.year}-${nextMonth.month}-${i}`,
          isBeforeToday: false, // 今日之前
          patchStatus: ['--grey', '--grey'], // 打卡状态
          isThisMonth: false, // 是本月
          isToday: false, //是否是本日
          isSelect: false //当前日期是否被选中
        })
      }
    }

    // 父组件传值处理函数
    // 当月打卡状态获取并加入数据数组中
    const changePatchMonth=(patchMonthData: [], M_data: [])=> {
      if (patchMonthData && M_data) {
        M_data.map((item: any) => {
          patchMonthData.forEach((item1: any) => {
            if (item.fullDate == item1.date) {
              item.patchStatus[0] =
                item1.result[0].patchResult == 4
                  ? '--primary-2'
                  : item1.result[0].patchResult == 1
                  ? '--red'
                  : item1.result[0].patchResult == 2
                  ? '--yellow'
                  : '--white' //上班打卡状态标记颜色
              item.patchStatus[1] =
                item1.result[1].patchResult == 4
                  ? '--primary-2'
                  : item1.result[1].patchResult == 1
                  ? '--red'
                  : item1.result[1].patchResult == 3
                  ? '--yellow'
                  : '--white' //下班打卡状态标记颜色
            }
          })
          return item
        })
      }
    }

    // 交互事件函数
    // 滑动动画结束，改变前后页的日历数组
    const changeSwiper=(e: any) =>{
      current.value = e.detail.current
    }
    // 点击日历日期事件
    const selectData=(data: string, M_data: [any])=> {
      emit('selectData', data)
      // 选中改变日历选中日期样式
      M_data.map((item: any, index: number) => {
        item.isSelect = false
        item.fullDate == data ? (M_data[index].isSelect = true) : null
        return item
      })
    }
  // }
// }
</script>

<style lang="less" scoped>
:root {
  --white: #ffffff;
  --grey: #959595;
  --primary-2: #409cff;
  --red: #f7220e;
  --yellow: #f7a90d;
  --primary-1: #eef7f2;
  --greyLight-2: #c8d0e7;
  --primary: #57c3c2;
}
.Cbody {
  margin: 20rpx;
  width: 95vw;
  height: 55vh;
  border-radius: 20rpx;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .Cheader {
    height: 90rpx;
    padding-top: 10rpx;
    box-sizing: border-box;
    font-size: 38rpx;
    width: 100%;
    text-align: center;
    background-color: var(--white);
  }
  .Cweek {
    height: 80rpx;
    box-sizing: border-box;
    width: 100%;
    display: grid;
    border-top: #d9d8d8 1rpx dashed;
    background-color: var(--white);
    grid-template-columns: repeat(7, 1fr);
    overflow: hidden;
    border-radius: 0 0 20rpx 20rpx;
    .weekText {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .Cmain {
    transition: all 0.5s ease;
    flex: 1;
    width: 100%;
    margin-top: 10rpx;
    padding: 14rpx 0;
    box-sizing: content-box;
    background-color: var(--white);
    border-radius: 20rpx 20rpx 0 0;
    overflow: hidden;
    .dateTable {
      display: grid;
      padding: 0 10rpx;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);
      gap: 10rpx;
      height: 100%;
      .dateText {
        transition: all 0.4s ease;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        box-sizing: border-box;
        .mark {
          width: 8rpx;
          height: 8rpx;
          border-radius: 50%;
        }
      }
    }
  }
}
.isToday {
  background-color: var(--primary-1);
  border: var(--primary) solid 2rpx;
}
.otherMonth {
  color: var(--grey);
}
.patchSucces {
  height: 18rpx !important;
  width: 18rpx !important;
}
.isSelect {
  background-color: var(--primary) !important;
  color: var(--white) !important;
}
</style>
