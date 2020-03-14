// 配置编译环境和线上环境之间的切换

const env = process.env
const baseUrl = ''
// 图表库为avue和pig2套地址
const iconfontVersion = ['567566_qo5lxgtishg', '667895_v7uduh4zui']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`
const codeUrl = `${window.location.origin}/code`

export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
