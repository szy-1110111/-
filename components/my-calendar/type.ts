export interface DailyData{
	date:Number|null;// 显示的日期
	fullDate: string|null, // 日期yyyy-mm-dd格式
	isBeforeToday: boolean, // 今日之前
	patchStatus:string|number|string[] , // 打卡状态
	isThisMonth: boolean, // 是本月
	isToday?: boolean, //是否为当日
	isSelect: boolean //当前日期是否被选中
}