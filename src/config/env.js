// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
// 图表库为avue和pig2套地址
const iconfontVersion = ['//at.alicdn.com/t/font_567566_qo5lxgtishg.css', '//at.alicdn.com/t/font_667895_v7uduh4zui.css']
const codeUrl = `${window.location.origin}/code`

export {
  baseUrl,
  iconfontVersion,
  codeUrl,
  env
}
