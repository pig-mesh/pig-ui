function All() {}

import { useFlowStore } from '../stores/flow';

let flowStore = useFlowStore();
const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
});
const formIdObj = computed(() => {
	var obj = {};
	for (var item of step2FormList.value) {
		obj[item.id] = item;
	}
	obj['root'] = {
		name: '发起人',
		type: 'SelectUser',
	};
	return obj;
});

All.prototype = {
	timer: '',
	debounce(fn, delay = 500) {
		var _this = this;
		return function (arg) {
			//获取函数的作用域和变量
			let that = this;
			let args = arg;
			clearTimeout(_this.timer); // 清除定时器
			_this.timer = setTimeout(function () {
				fn.call(that, args);
			}, delay);
		};
	},
	setCookie(val) {
		//cookie设置[{key:value}]、获取key、清除['key1','key2']
		for (var i = 0, len = val.length; i < len; i++) {
			for (var key in val[i]) {
				document.cookie = key + '=' + encodeURIComponent(val[i][key]) + '; path=/';
			}
		}
	},
	getCookie(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split('; ');
		for (var i = 0, len = arrCookie.length; i < len; i++) {
			var arr = arrCookie[i].split('=');
			if (name == arr[0]) {
				return decodeURIComponent(arr[1]);
			}
		}
	},
	clearCookie(name) {
		var myDate = new Date();
		myDate.setTime(-1000); //设置时间
		for (var i = 0, len = name.length; i < len; i++) {
			document.cookie = '' + name[i] + "=''; path=/; expires=" + myDate.toGMTString();
		}
	},
	arrToStr(arr) {
		if (arr) {
			return arr
				.map((item) => {
					return item.name;
				})
				.toString();
		}
	},
	toggleClass(arr, elem, key = 'id') {
		return arr.some((item) => {
			return item[key] == elem[key];
		});
	},
	toChecked(arr, elem, key = 'id') {
		var isIncludes = this.toggleClass(arr, elem, key);
		!isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
	},
	removeEle(arr, elem, key = 'id') {
		var includesIndex;
		arr.map((item, index) => {
			if (item[key] == elem[key]) {
				includesIndex = index;
			}
		});
		arr.splice(includesIndex, 1);
	},
	checkApproval(nodeConfig) {
		if (nodeConfig.assignedType == 1) {
			//指定成员
			if (nodeConfig.nodeUserList.length == 0) {
				return false;
			}
		} else if (nodeConfig.assignedType == 3) {
			//指定角色
			if (nodeConfig.nodeUserList.length == 0) {
				return false;
			}
		} else if (nodeConfig.assignedType == 8 && nodeConfig.formUserId.length == 0) {
			//表单
			return false;
		}

		//审批人为空
		if (nodeConfig.nobody.handler === 'TO_USER' && nodeConfig.nobody.assignedUser.length == 0) {
			return false;
		}

		return true;
	},
	setApproverStr(nodeConfig) {
		if (nodeConfig.assignedType == 1) {
			//指定成员
			if (nodeConfig.nodeUserList.length >= 1) {
				return nodeConfig.nodeUserList.map((res) => res.name).join(',');
			} else {
				return '';
			}
		} else if (nodeConfig.assignedType == 3) {
			//指定角色
			if (nodeConfig.nodeUserList.length >= 1) {
				return nodeConfig.nodeUserList.map((res) => res.name).join(',');
			} else {
				return '';
			}
		} else if (nodeConfig.assignedType == 2) {
			return nodeConfig.deptLeaderLevel == 1 ? '直接部门主管' : '第' + nodeConfig.deptLeaderLevel + '级部门主管';
		} else if (nodeConfig.assignedType == 4) {
			//发起人自选
			return '发起人自选';
		} else if (nodeConfig.assignedType == 5) {
			return '发起人自己';
		} else if (nodeConfig.assignedType == 7) {
			return '到第' + nodeConfig.deptLeaderLevel + '级部门主管终止';
		} else if (nodeConfig.assignedType == 8 && nodeConfig.formUserId.length > 0) {
			//表单
			return '表单：' + nodeConfig.formUserName;
		}
		return '';
	},
	dealStr(str, obj) {
		let arr = [];
		let list = str.split(',');
		for (var elem in obj) {
			list.map((item) => {
				if (item == elem) {
					arr.push(obj[elem].value);
				}
			});
		}
		return arr.join('或');
	},
	conditionStr(nodeConfig, index) {
		var { conditionList, groupMode } = nodeConfig.conditionNodes[index];
		if (conditionList.length == 0) {
			return index == nodeConfig.conditionNodes.length - 1 ? '其他条件进入此流程' : '请设置条件';
		} else {
			var groupConArr = [];
			for (var groupCondition of conditionList) {
				let mode = groupCondition.mode;

				var conArr = [];

				for (var con of groupCondition.conditionList) {
					const { key, expression, value } = con;
					if (!key) {
						continue;
					}

					let valueElement = formIdObj.value[key];
					var name = valueElement.name;

					var valueShow = value;
					if (valueElement.type === 'SelectUser' || valueElement.type === 'SelectDept') {
						valueShow = value.map((res) => res.name).join(',');
					} else if (valueElement.type === 'SingleSelect') {
						valueShow =  value.map(res=>res.value).join(",")
					} else {
						if (!valueShow) {
							valueShow = '?';
						}
					}

					if (expression === '==') {
						conArr.push(name + ' 等于 ' + valueShow);
					} else if (expression === 'in') {
						conArr.push(name + ' 属于 ' + valueShow);
					} else if (expression === 'notin') {
						conArr.push(name + ' 不属于 ' + valueShow);
					} else if (expression === '!=') {
						conArr.push(name + ' 不等于 ' + valueShow);
					} else if (expression === '>') {
						conArr.push(name + ' 大于 ' + valueShow);
					} else if (expression === '>=') {
						conArr.push(name + ' 大于等于 ' + valueShow);
					} else if (expression === '<') {
						conArr.push(name + ' 小于 ' + valueShow);
					} else if (expression === '<=') {
						conArr.push(name + ' 小于等于 ' + valueShow);
					} else if (expression === 'contain') {
						conArr.push(name + " 包含 " + valueShow);
					} else if (expression === 'notcontain') {
						conArr.push(name + " 不包含 " + valueShow);
					}
				}

				if (mode) {
					let s = conArr.join(' 且 ');
					if (conArr.length > 0) {
						groupConArr.push('(' + s + ')');
					}
				} else {
					let s = conArr.join(' 或 ');
					if (conArr.length > 0) {
						groupConArr.push('(' + s + ')');
					}
				}
			}

			return groupConArr.length > 0
				? groupConArr.join(groupMode ? ' 且 ' : ' 或 ')
				: index == nodeConfig.conditionNodes.length - 1
				? '默认条件'
				: '请设置条件';
		}
	},
	copyerStr(nodeConfig) {
		if (nodeConfig.nodeUserList?.length != 0) {
			return this.arrToStr(nodeConfig.nodeUserList);
		}
	},
};

export default new All();
