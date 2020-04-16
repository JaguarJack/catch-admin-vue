/**
 * 时间戳转日期格式
 *
 * @param timestamp
 * @returns {string}
 */
export function timestampToDate (timestamp) {
    const date = new Date(timestamp)

    return date.getFullYear() + '-'
          + date.getMonth() + '-'
          + date.getDay() + ' '
          + date.getHours() + '时'
          + date.getMinutes() + '分'
          + date.getDay() + '秒'
}
