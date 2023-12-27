// iso不认识"-"拼接的日期，所以转/
    export function toIOSDate(strDate: string){
      return strDate ? strDate.replace(/-/g, '/') : strDate
    }

    // 计算某月1号为星期几
    export function getFirstDayOfWeek(year: number, month: number, day: number = 1){
      let date = new Date(year, month - 1, day)
      // getDay方法返回的是一个0（代表星期日）到6（代表星期六）的数字
      return date.getDay()
    }

    // 计算某月一个有多少天
    export function getDaysInMonth(year: number, month: number){
      // 设置日期为下个月的第0天，就会得到这个月的最后一天
      let date = new Date(year, month, 0)
      // getDate方法返回的是日期，也就是这个月的总天数
      return date.getDate()
    }

    // 计算上、下月
    export function getOperateMonthDate(y: number, m: number, num: number){
      let month: number = m + num
      let year: number = y
      month > 12 ? (year++, (month = 1)) : null //12月下个月为下一年的一月
      month < 1 ? (year--, (month = 12)) : null //1月上个月为上一年的十二月
      return {
        month,
        year
      }
    }