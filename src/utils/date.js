/**
 * 时间戳转日期格式
 *
 * @param timestamp
 * @returns {string}
 */
export function timestampToDate (timestamp) {
  const date = new Date(timestamp)

  return date.getFullYear() + '-'
    + (date.getMonth() + 1) + '-'
    + date.getDate() + ' '
    + date.getHours() + '时'
    + date.getMinutes() + '分'
    + date.getSeconds() + '秒'
}
