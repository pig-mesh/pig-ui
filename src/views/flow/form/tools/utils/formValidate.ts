export function inputValidate(configValue: any, proxy: any) {
	let minLength = configValue.props.minLength;
	let maxLength = configValue.props.maxLength;
	let value = configValue.props.value;
	let regex = configValue.props.regex;
	let regexDesc = configValue.props.regexDesc;

	if (minLength && maxLength && maxLength < minLength) {
		return {
			valid: false,
			msg: configValue.name + ':长度设置错误',
		};
	}
	if (regex) {
		if (!regexDesc) {
			return {
				valid: false,
				msg: configValue.name + ':请填写正则表达式提示语',
			};
		}
	}

	if (value) {
		if (minLength) {
			if (value.length < minLength) {
				return {
					valid: false,
					msg: configValue.name + ':默认值长度不能小于' + minLength,
				};
			}
		}
		if (maxLength) {
			if (value.length > maxLength) {
				return {
					valid: false,
					msg: configValue.name + ':默认值长度不能大于' + maxLength,
				};
			}
		}
		if (regex) {
			var reg = new RegExp(regex, 'g');
			if (!reg.test(value)) {
				return {
					valid: false,
					msg: configValue.name + ':默认值不符合正则表达式',
				};
			}
		}
	}
	return {
		valid: true,
	};
}

export function descriptionValidate(configValue: any, proxy: any) {
	let placeHolder = configValue.placeholder;
	if (!placeHolder) {
		return {
			valid: false,
			msg: configValue.name + ':请设置提示',
		};
	}
	return {
		valid: true,
	};
}
export function numberValidate(configValue: any, proxy: any) {
	let min = configValue.props.min;
	let max = configValue.props.max;
	let defaultValue = configValue.props.value;
	let radixNum = configValue.props.radixNum;

	if (min && max && max < min) {
		return {
			valid: false,
			msg: configValue.name + ':值范围设置错误',
		};
	}

	if (radixNum) {
		if (min) {
			let num = proxy.$getNumberRadixNum(min);
			if (num > radixNum) {
				return {
					valid: false,
					msg: configValue.name + ':最小值小数点位数不能超过' + radixNum,
				};
			}
		}
		if (max) {
			let num = proxy.$getNumberRadixNum(max);
			if (num > radixNum) {
				return {
					valid: false,
					msg: configValue.name + ':最大值小数点位数不能超过' + radixNum,
				};
			}
		}
	}

	if (defaultValue) {
		if (radixNum) {
			let num = proxy.$getNumberRadixNum(defaultValue);
			if (num > radixNum) {
				return {
					valid: false,
					msg: configValue.name + ':默认值小数点位数不能超过' + radixNum,
				};
			}
		}
		if (min) {
			if (defaultValue < min) {
				return {
					valid: false,
					msg: configValue.name + ':默认值不能小于' + min,
				};
			}
		}
		if (max) {
			if (defaultValue > max) {
				return {
					valid: false,
					msg: configValue.name + ':默认值不能大于' + max,
				};
			}
		}
	}

	return {
		valid: true,
	};
}
export function layoutValidate(configValue: any, proxy: any) {
	let min = configValue.props.min;
	let max = configValue.props.max;

	if (min && max && max < min) {
		return {
			valid: false,
			msg: configValue.name + ':数量范围设置错误',
		};
	}
	let value = configValue.props.value;
	if (value.length == 0) {
		return {
			valid: false,
			msg: configValue.name + ':内部表单不能为空',
		};
	}
	for (var item of value) {
		let formValidateDictElement = formValidateDict[item.type];
		if (formValidateDictElement) {
			let result = formValidateDictElement(item, proxy);

			if (!result.valid) {
				return {
					valid: false,
					msg: configValue.name + ':' + result.msg,
				};
			}
		}
	}

	return {
		valid: true,
	};
}
export function selectValidate(configValue: any, proxy: any) {
	var options = configValue.props.options;
	if (!options) {
		options = [];
	}

	if (options.length < 1) {
		return {
			valid: false,
			msg: configValue.name + ':请设置选项',
		};
	}

	{
		var keyList = options.map((w) => w.key);
		let newList = Array.from(new Set(keyList));
		if (keyList.length > newList.length) {
			return {
				valid: false,
				msg: configValue.name + ':选项值不能重复',
			};
		}
	}
	{
		let length = options.filter((res) => !res.key || !res.value).length;
		if (length > 0) {
			return {
				valid: false,
				msg: configValue.name + ':选项不能为空',
			};
		}
	}

	{
		var keyList = options.map((w) => w.value);
		let newList = Array.from(new Set(keyList));
		if (keyList.length > newList.length) {
			return {
				valid: false,
				msg: configValue.name + ':选项标签不能重复',
			};
		}
	}
	return {
		valid: true,
	};
}
export function fileValidate(configValue: any, proxy: any) {
	let min = configValue.props.min;
	let max = configValue.props.max;

	if (min && max && max < min) {
		return {
			valid: false,
			msg: configValue.name + ':数量设置错误',
		};
	}

	return {
		valid: true,
	};
}

export let formValidateDict = {
	Input: inputValidate,
	Textarea: inputValidate,
	Number: numberValidate,
	Money: numberValidate,
	Description: descriptionValidate,
	SingleSelect: selectValidate,
	MultiSelect: selectValidate,
	UploadFile: fileValidate,
	Layout: layoutValidate,
	UploadImage: fileValidate,
};
