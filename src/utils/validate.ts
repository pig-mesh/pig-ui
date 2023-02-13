/**
 * @desc  [自定义校验规则]
 * @example
 *  import { validateRule } from "@/utils/validateRules";
 *  rules: [
 *     { validator: validateRule.emailValue, trigger: 'blur'}
 *  ]
 */

export const rule = {
  /**
     * 校验 请输入中文、英文、数字包括下划线
     * 名称校验
     */
  validatorNameCn(rule: any, value: any, callback: any) {
    const acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入中文、英文、数字包括下划线'))
    } else {
      callback()
    }
  },
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  validatorKey(rule: any, value: any, callback: any) {
    const acount = /^[A-Z_]+$/
    if (value && (!(acount).test(value))) {
      callback(new Error('请输入大写英文、下划线'))
    } else {
      callback()
    }
  },

  /**
   * 校验首尾空白字符的正则表达式
   *
   */
  checkSpace(rule: any, value: any, callback: any) {
    const longrg = /[^\s]+$/
    if (!longrg.test(value)) {
      callback(new Error('请输入非空格信息'))
    } else {
      callback()
    }
  },

  /**
   * 校验手机号
   */
  validatePhone(rule: any, value: any, callback: any) {
    var isPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
    if (!isPhone.test(value)) {
      callback(new Error('请输入合法手机号'))
    } else {
      callback()
    }
  },

  /**
 * 判断是否为空
 */
  validatenull(val: any) {
    if (typeof val === 'boolean') {
      return false
    }
    if (typeof val === 'number') {
      return false
    }
    if (val instanceof Array) {
      if (val.length === 0) return true
    } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true
    } else {
      if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
      return false
    }
    return false
  }
}


