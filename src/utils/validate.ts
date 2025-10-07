// @ts-nocheck
/**
 * 判断是否为空
 * @param val 数据
 * @returns 是否为空值
 */
export const validateNull = (val: any) => {
	if (typeof val === 'boolean') {
		return false;
	}
	if (typeof val === 'number') {
		return false;
	}
	if (val instanceof Array) {
		if (val.length === 0) return true;
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === '{}') return true;
	} else {
		if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true;
		return false;
	}
	return false;
};

/**
 * 获取错误消息（支持国际化）
 * @param key - i18n key
 * @param defaultMsg - 默认消息
 * @param t - i18n 翻译函数
 * @returns 错误消息
 */
const getErrorMsg = (key: string, defaultMsg: string, t?: any): string => {
	return t ? t(`validate.${key}`) : defaultMsg;
};

export const rule = {
	/**
	 * 校验用户输入的长度避免超长
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	overLength(rule: any, value: any, callback: any, t?: any) {
		if (value?.length > 255) {
			callback(new Error(getErrorMsg('overLength', '输入内容过长，请重新输入', t)));
		} else {
			callback();
		}
	},
	/**
	 * 校验中文、英文、数字包括下划线
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	validatorNameCn(rule: any, value: any, callback: any, t?: any) {
		const acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
		if (value && !acount.test(value)) {
			callback(new Error(getErrorMsg('validatorNameCn', '请输入中文、英文、数字包括下划线', t)));
		} else {
			callback();
		}
	},
	/**
	 * 校验大写英文、下划线
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	validatorCapital(rule: any, value: any, callback: any, t?: any) {
		const acount = /^[A-Z_]+$/;
		if (value && !acount.test(value)) {
			callback(new Error(getErrorMsg('validatorCapital', '请输入大写英文、下划线', t)));
		} else {
			callback();
		}
	},

	/**
	 * 校验小写英文、下划线
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	validatorLowercase(rule: any, value: any, callback: any, t?: any) {
		const acount = /^[a-z_]+$/;
		if (value && !acount.test(value)) {
			callback(new Error(getErrorMsg('validatorLowercase', '请输入小写英文、下划线', t)));
		} else {
			callback();
		}
	},

	/**
	 * 校验小写英文
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	validatorLower(rule: any, value: any, callback: any, t?: any) {
		const acount = /^[a-z]+$/;
		if (value && !acount.test(value)) {
			callback(new Error(getErrorMsg('validatorLower', '请输入小写英文', t)));
		} else {
			callback();
		}
	},

	/**
	 * 校验首尾空白字符
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	checkSpace(rule: any, value: any, callback: any, t?: any) {
		const longrg = /[^\s]+$/;
		if (!longrg.test(value)) {
			callback(new Error(getErrorMsg('checkSpace', '请输入非空格信息', t)));
		} else {
			callback();
		}
	},

	/**
	 * 校验手机号
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	validatePhone(rule: any, value: any, callback: any, t?: any) {
		var isPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;

		if (value.indexOf('****') >= 0) {
			return callback();
		}

		if (!isPhone.test(value)) {
			callback(new Error(getErrorMsg('validatePhone', '请输入合法手机号', t)));
		} else {
			callback();
		}
	},

	/**
	 * 校验数字
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	number(rule, value, callback, t?: any) {
		validateFn('number', rule, value, callback, getErrorMsg('number', '包含非数字字符', t), t);
	},

	/**
	 * 校验字母
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	letter(rule, value, callback, t?: any) {
		validateFn('letter', rule, value, callback, getErrorMsg('letter', '包含非字母字符', t), t);
	},

	/**
	 * 校验字母和数字
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	letterAndNumber(rule, value, callback, t?: any) {
		validateFn('letterAndNumber', rule, value, callback, getErrorMsg('letterAndNumber', '只能输入字母或数字', t), t);
	},

	/**
	 * 校验手机号码
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	mobilePhone(rule, value, callback, t?: any) {
		validateFn('mobilePhone', rule, value, callback, getErrorMsg('mobilePhone', '手机号码格式有误', t), t);
	},

	/**
	 * 校验字母开头，可包含数字
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	letterStartNumberIncluded(rule, value, callback, t?: any) {
		validateFn('letterStartNumberIncluded', rule, value, callback, getErrorMsg('letterStartNumberIncluded', '必须以字母开头，可包含数字', t), t);
	},

	/**
	 * 校验禁止中文输入
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	noChinese(rule, value, callback, t?: any) {
		validateFn('noChinese', rule, value, callback, getErrorMsg('noChinese', '不可输入中文字符', t), t);
	},

	/**
	 * 校验必须中文输入
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	chinese(rule, value, callback, t?: any) {
		validateFn('chinese', rule, value, callback, getErrorMsg('chinese', '只能输入中文字符', t), t);
	},

	/**
	 * 校验电子邮箱
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	email(rule, value, callback, t?: any) {
		validateFn('email', rule, value, callback, getErrorMsg('email', '邮箱格式有误', t), t);
	},

	/**
	 * 校验URL网址
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	url(rule, value, callback, t?: any) {
		validateFn('url', rule, value, callback, getErrorMsg('url', 'URL格式有误', t), t);
	},

	/**
	 * 校验JSON格式
	 * @param rule - 校验规则
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	json(rule, value, callback, t?: any) {
		if (validateNull(value) || value.length <= 0) {
			callback();
			return;
		}

		try {
			JSON.parse(value);
			callback();
		} catch (error) {
			callback(new Error(getErrorMsg('json', 'json 格式有误', t)));
		}
	},

	/**
	 * 正则表达式校验
	 * @param rule - 校验规则（需包含 regExp 属性）
	 * @param value - 输入值
	 * @param callback - 回调函数
	 * @param t - i18n 翻译函数（可选）
	 */
	regExp(rule, value, callback, t?: any) {
		if (validateNull(value) || value.length <= 0) {
			callback();
			return;
		}

		const pattern = new RegExp(rule.regExp);

		if (!pattern.test(value)) {
			const errTxt = rule.errorMsg || (t ? t('validate.invalidValue') : 'invalid value');
			callback(new Error(errTxt));
		} else {
			callback();
		}
	},
};

/**
 * @desc  [自定义校验规则]
 * @example
 *  import { rule } from "@/utils/validate";
 *  rules: [
 *     { validator: (rule, value, callback) => rule.email(rule, value, callback, t), trigger: 'blur'}
 *  ]
 */

/**
 * 获取正则表达式
 * @param validatorName - 验证器名称
 * @returns 正则表达式字符串
 */
export const getRegExp = function (validatorName: string): string {
	const commonRegExp: Record<string, string> = {
		number: '^[-]?\\d+(\\.\\d+)?$',
		letter: '^[A-Za-z]+$',
		letterAndNumber: '^[A-Za-z0-9]+$',
		mobilePhone: '^[1][3-9][0-9]{9}$',
		letterStartNumberIncluded: '^[A-Za-z]+[A-Za-z\\d]*$',
		noChinese: '^[^\u4e00-\u9fa5]+$',
		chinese: '^[\u4e00-\u9fa5]+$',
		email: '^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$',
		url: '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
	};
	return commonRegExp[validatorName];
};

/**
 * ��用验证函数
 * @param validatorName - 验证器名称
 * @param rule - 校验规则
 * @param value - 输入值
 * @param callback - 回调函数
 * @param defaultErrorMsg - 默认错误消息
 * @param t - i18n 翻译函数（可选）
 */
const validateFn = (validatorName: string, rule: any, value: any, callback: any, defaultErrorMsg: string, t?: any) => {
  if (validateNull(value) || value.length <= 0) {
    callback();
    return;
  }

  const reg = new RegExp(getRegExp(validatorName));

  if (!reg.test(value)) {
    const errTxt = rule.errorMsg || defaultErrorMsg;
    callback(new Error(errTxt));
  } else {
    callback();
  }
};

/**
 * 脱敏占位符常量
 */
export const MASK_PATTERNS = {
	PASSWORD: '******', // 密码占位符
	PHONE: '*', // 手机号脱敏标识
	DEFAULT: '*', // 默认脱敏字符
} as const;

/**
 * 检测字符串是否为脱敏占位符
 * @param value 需要检测的值
 * @param maskChar 脱敏字符，默认为 '*'
 * @returns 是否为脱敏数据
 * @example
 * isMaskedValue('138****1234') // true
 * isMaskedValue('******') // true
 * isMaskedValue('13812341234') // false
 */
export const isMaskedValue = (value: string | undefined, maskChar: string = '*'): boolean => {
	if (!value || typeof value !== 'string') {
		return false;
	}
	return value.includes(maskChar);
};

/**
 * 清除单个脱敏字段
 * 如果字段值包含脱敏字符，则返回 undefined，否则返回原值
 * @param value 字段值
 * @param maskChar 脱敏字符，默认为 '*'
 * @returns 清理后的值（脱敏则返回 undefined）
 * @example
 * clearMaskedField('138****1234') // undefined
 * clearMaskedField('13812341234') // '13812341234'
 */
export const clearMaskedField = (value: string | undefined, maskChar: string = '*'): string | undefined => {
	return isMaskedValue(value, maskChar) ? undefined : value;
};

/**
 * 批量清除对象中的脱敏字段
 * 遍历指定字段，如果包含脱敏字符则设置为 undefined
 * @param obj 需要清理的对象
 * @param fields 需要清理的字段列表
 * @param maskChar 脱敏字符，默认为 '**'
 * @returns 清理后的对象（会修改原对象）
 * @mutates obj - 此函数会直接修改传入的对象，不会创建新对象
 * @example
 * const user = { phone: '138****1234', password: '******', name: 'John' };
 * clearMaskedFields(user, ['phone', 'password']);
 * // user = { phone: undefined, password: undefined, name: 'John' }
 */
export const clearMaskedFields = <T extends Record<string, any>>(
	obj: T,
	fields: (keyof T)[],
	maskChar: string = '**'
): T => {
	fields.forEach((field) => {
		if (obj[field] !== undefined && isMaskedValue(obj[field], maskChar)) {
			obj[field] = undefined;
		}
	});
	return obj;
};
