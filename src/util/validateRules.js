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
  validatorNameCn(rule, value, callback) {
    let acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
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
  validatorKey(rule, value, callback) {
    let acount = /^[A-Z_]+$/
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
  checkSpace(rule, value, callback) {
    let longrg = /[^\s]+$/;
    if(!longrg.test(value)){
      callback(new Error('请输入非空格信息'));
    } else {
      callback();
    }
  },
}
