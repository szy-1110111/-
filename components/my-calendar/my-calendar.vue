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
			<!-- 轮播页码 -->
			<swiper-item v-for="(currentData, index) in swiperPageM_data" :key="index">
				<view class="dateTable">
					<view class="dateText" :class="[
							{ otherMonth: !item.isThisMonth },
							{ isToday: item.isToday },
							{ isSelect: item.isSelect }
						]" v-for="(item, index) in currentData" :key="index" @click="selectData(item.fullDate)">
						{{ item.date }}
						<view v-if="item.isThisMonth" :style="{
								background: `linear-gradient(to bottom, var(${item.patchStatus[0]}) 55%, var(${
									item.patchStatus[1]
								}) 50%)`
							}" class="mark" :class="{ patchSucces: item.patchStatus[0] != '--grey' }"></view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, watch, onMounted, defineEmits } from 'vue'
	import type { DailyData } from './type'
	import { toIOSDate, getFirstDayOfWeek, getDaysInMonth, getOperateMonthDate } from './utils'
	const emit = defineEmits(['selectData', 'changeSwiper'])

	const current = ref(1)//轮播当前页码
	const nowYear = ref(new Date().getFullYear())//当前显示的年
	const nowMonth = ref(new Date().getMonth() + 1)//当前显示的月
	const today = new Date().getDate()  //系统本日
	const toMonth = new Date().getMonth() + 1 //系统本月
	const toYear = new Date().getFullYear() //系统本年
	const weeksTxt = ['日', '一', '二', '三', '四', '五', '六']
	const swiperPageM_data = ref([[], [], []] as DailyData[][])//日历轮播三个页面对应的日期及数据
	const props = defineProps({
		//当月打卡数据
		patchMonthData: {
			type: Array,
			default: () => {
				return []
			}
		}
	})
	// 监听打卡数据变动
	watch(props.patchMonthData, (newPatchMonthData, oldPatchMonthData) => {
		// 当前页数将打卡数据加入到对应的数据数组中
		changePatchMonth(newPatchMonthData, current.value)
	})
	//监听轮播页码的变动
	watch(current, (newCurrentt, oldCurrentt) => {
		let mothSetup = 0

		// 除current0和2之间的滚动其余滚动的年月步进类型，1：现年月增加1月；-1：现年月减少1月
		if ((newCurrentt + oldCurrentt == 3) || (newCurrentt + oldCurrentt == 1)) {
			mothSetup = oldCurrentt < newCurrentt ? 1 : -1
		}
		//current0和2之间的滚动的年月步进类型
		else if (newCurrentt + oldCurrentt == 2) {
			mothSetup = oldCurrentt < newCurrentt ? -1 : 1
		}
		let changeCurrent = 3 - (newCurrentt + oldCurrentt)//计算出数据变动页的current
		redrawData(changeCurrent, mothSetup)
		//传给调用模板页面请求当月打卡数据
		emit('changeSwiper', nowYear.value + '-' + nowMonth.value)
	},
		{ deep: true }
	)

	//初始化渲染日历
	const init = () => {
		// 填充上月，本月，下月数据
		swiperPageM_data.value.forEach((_, i) => {
			const { year, month } = i === 1 ? { year: nowYear.value, month: nowMonth.value } : getOperateMonthDate(nowYear.value, nowMonth.value, i - 1)
			calculateGrids(year, month, i)
			fullDate(year, month, i);
		})
	}

	onMounted(init)

	/**
	 * 翻页重绘需更新页面
	 * @param changeCurrent {number}
	 * @param mothSetup 
	 */
	function redrawData(changeCurrent : number, mothSetup : number) : void {
		//头部显示当前所在年月更新
		nowYear.value = getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup).year
		nowMonth.value = getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup).month
		//数据需变化轮播页码的日历数据更新
		let next = getOperateMonthDate(nowYear.value, nowMonth.value, mothSetup)
		calculateGrids(next.year, next.month, changeCurrent)
		fullDate(next.year, next.month, changeCurrent)
	}

	/** 
	 * 某月的日历数据导入
	 * @param year 
	 * @param month
	 * @param current
	 */
	const calculateGrids = (year : number, month : number, current : number) : void => {
		// 计算当月1号前空了几个格子，把它填充在传入的某月的M_data数组的前面
		//计算每个月时要清零
		const newCalendarDays : DailyData[] = []
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
		swiperPageM_data.value[current].splice(0, swiperPageM_data.value[current].length, ...newCalendarDays);
	}

	/**
	 * 填充日期数组
	 * @param year 
	 * @param month 
	 * @param current 
	 */
	const fullDate = (year : number, month : number, current : number) : void => {
		// 日历前填充上个月末尾日期
		const firstDayOfWeek = getFirstDayOfWeek(year, month) //1号星期几
		const lastMonthEndDay = getDaysInMonth(year, month - 1) //上个月天数
		const lastMonth = getOperateMonthDate(year, month, -1)
		for (let i = 0; i < firstDayOfWeek; i++) {
			const date = lastMonthEndDay - firstDayOfWeek + 1 + i
			swiperPageM_data.value[current][i].date = date
			swiperPageM_data.value[current][i].fullDate = lastMonth.year + '-' + lastMonth.month + '-' + date
		}
		// 日历后补下个月初日期
		const endDay = getDaysInMonth(year, month) //本月最后一天几号
		const lastDayOfWeek = getFirstDayOfWeek(year, month, endDay) //本月最后一天星期几
		const nextMonth = getOperateMonthDate(year, month, 1)
		for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
			swiperPageM_data.value[current].push({
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
	/**
	 * 父组件传值处理函数, 当月打卡状态获取并加入数据数组中
	 * @param patchMonthData 
	 * @param current 
	 */
	const changePatchMonth = (patchMonthData : unknown[], current : number) : void => {
		if (patchMonthData && swiperPageM_data.value[current]) {
			swiperPageM_data.value[current].map((item : any) => {
				patchMonthData.forEach((item1 : any) => {
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
	const changeSwiper = (e : any) => {
		current.value = e.detail.current
	}
	// 点击日历日期事件
	const selectData = (data : string) => {
		emit('selectData', data)
		// 选中改变日历选中日期样式
		swiperPageM_data.value[current.value].map((item : any, index : number) => {
			item.isSelect = false
			item.fullDate == data ? (swiperPageM_data.value[current.value][index].isSelect = true) : null
			return item
		})
	}
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
