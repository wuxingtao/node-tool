/**
 * @Desc: help
 * @Author: wu xingtao
 * @Date: 2023/1/9
 */
const getToDay = ()=>{
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

module.exports ={
  getToDay
}
