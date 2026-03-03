/**
 * 工作流辅助函数
 * @description 提供工作流节点配置、条件判断、字符串处理等工具方法
 *
 * @note 工具函数建议
 * - 防抖功能: 推荐使用 `useDebounceFn` from `@vueuse/core`
 * - Cookie管理: 推荐使用 `useCookies` from `@vueuse/integrations/useCookies`
 *
 * @example
 * ```typescript
 * // 防抖示例
 * import { useDebounceFn } from '@vueuse/core'
 * const debouncedFn = useDebounceFn(() => { ... }, 500)
 *
 * // Cookie示例
 * import { useCookies } from '@vueuse/integrations/useCookies'
 * const { get, set, remove } = useCookies()
 * ```
 */

import { computed } from 'vue';
import { useFlowStore } from '../stores/flow';
import { flattenFormItems } from './formUtils';
import { timeUnits } from './const';
import type { FormItem } from './formUtils';

/**
 * 节点配置接口
 */
export interface NodeConfig {
	assignedType?: number;
	nodeUserList?: any[];
	formUserId?: string;
	formUserName?: string;
	deptLeaderLevel?: number;
	assignExpress?: string;
	assignExpressName?: string;
	nobody?: {
		handler?: string;
		assignedUser?: any[];
	};
	conditionNodes?: ConditionNode[];
	[key: string]: any;
}

/**
 * 条件节点接口
 */
export interface ConditionNode {
	conditionList?: ConditionGroup[];
	groupMode?: boolean;
	conditionType?: number;
	ruleName?: string;
	expressionText?: string;
	[key: string]: any;
}

/**
 * 条件组接口
 */
export interface ConditionGroup {
	mode?: boolean;
	conditionList?: Condition[];
}

/**
 * 条件接口
 */
export interface Condition {
	key?: string;
	expression?: string;
	value?: any;
}

// 获取flow store和表单列表
const flowStore = useFlowStore();
const step2FormList = computed(() => {
	return flowStore.step2.formRule || [];
});

/**
 * 表单ID映射对象
 * 将表单项展平后以field为key建立映射
 */
export const formIdObj = computed(() => {
	const obj: Record<string, FormItem> = {};

	// 使用统一的工具函数处理表单项（包括子组件）
	const flattened = flattenFormItems(step2FormList.value);

	for (const item of flattened) {
		if (item.field) {
			obj[item.field] = item;
		}
	}

	// 添加发起人节点
	obj['root'] = {
		name: '发起人',
		type: 'SelectUser',
	};

	return obj;
});

/**
 * 数组转字符串
 * @param arr 包含name属性的对象数组
 */
export function arrToStr(arr?: any[]): string | undefined {
	if (arr) {
		return arr.map((item) => item.name).toString();
	}
}

/**
 * 切换数组中的元素
 * @param arr 目标数组
 * @param elem 要切换的元素
 * @param key 比较的键名
 */
export function toChecked(arr: any[], elem: any, key: string = 'id'): void {
	const index = arr.findIndex((item) => item[key] === elem[key]);
	if (index === -1) {
		arr.push(elem);
	} else {
		arr.splice(index, 1);
	}
}

/**
 * 检查审批人配置是否有效
 * @param nodeConfig 节点配置
 */
export function checkApproval(nodeConfig: NodeConfig): boolean {
	if (nodeConfig.assignedType === 1 || nodeConfig.assignedType === 3) {
		// 指定成员或角色
		if (!nodeConfig.nodeUserList || nodeConfig.nodeUserList.length === 0) {
			return false;
		}
	} else if (nodeConfig.assignedType === 8 && (!nodeConfig.formUserId || nodeConfig.formUserId.length === 0)) {
		// 表单人员
		return false;
	} else if (nodeConfig.assignedType === 10) {
		// 流程表达式
		if (!nodeConfig.assignExpress || nodeConfig.assignExpress.trim().length === 0) {
			return false;
		}
	}

	// 审批人为空的处理
	if (nodeConfig.nobody?.handler === 'TO_USER' && (!nodeConfig.nobody.assignedUser || nodeConfig.nobody.assignedUser.length === 0)) {
		return false;
	}

	return true;
}

/**
 * 获取审批人显示字符串
 * @param nodeConfig 节点配置
 */
export function setApproverStr(nodeConfig: NodeConfig): string {
	if (nodeConfig.assignedType === 1 || nodeConfig.assignedType === 3) {
		// 指定成员或角色
		if (nodeConfig.nodeUserList && nodeConfig.nodeUserList.length >= 1) {
			return nodeConfig.nodeUserList.map((res) => res.name).join(',');
		} else {
			return '';
		}
	} else if (nodeConfig.assignedType === 2) {
		// 部门主管
		return nodeConfig.deptLeaderLevel === 1 ? '直接部门主管' : '第' + nodeConfig.deptLeaderLevel + '级部门主管';
	} else if (nodeConfig.assignedType === 4) {
		return '发起人自选';
	} else if (nodeConfig.assignedType === 5) {
		return '发起人自己';
	} else if (nodeConfig.assignedType === 7) {
		return '到第' + nodeConfig.deptLeaderLevel + '级部门主管终止';
	} else if (nodeConfig.assignedType === 8 && nodeConfig.formUserId && nodeConfig.formUserId.length > 0) {
		// 表单人员
		return '表单：' + nodeConfig.formUserName;
	} else if (nodeConfig.assignedType === 10) {
		// 流程表达式
		if (nodeConfig.assignExpress && nodeConfig.assignExpress.trim().length > 0) {
			// 优先使用规则名称显示
			if (nodeConfig.assignExpressName && nodeConfig.assignExpressName.trim().length > 0) {
				return nodeConfig.assignExpressName.trim();
			} else {
				// 如果表达式很长，只显示前面部分
				const expression = nodeConfig.assignExpress.trim();
				if (expression.length > 30) {
					return '流程表达式：' + expression.substring(0, 30) + '...';
				} else {
					return '流程表达式：' + expression;
				}
			}
		} else {
			return '';
		}
	}
	return '';
}

/**
 * 处理字符串分割
 * @param str 逗号分隔的字符串
 * @param obj 值映射对象
 */
export function dealStr(str: string, obj: Record<string, { value: string }>): string {
	const arr: string[] = [];
	const list = str.split(',');
	for (const elem in obj) {
		list.forEach((item) => {
			if (item === elem) {
				arr.push(obj[elem].value);
			}
		});
	}
	return arr.join('或');
}

/**
 * 获取条件分支显示字符串
 * @param nodeConfig 节点配置
 * @param index 条件节点索引
 */
export function conditionStr(nodeConfig: NodeConfig, index: number): string {
	if (!nodeConfig.conditionNodes || !nodeConfig.conditionNodes[index]) {
		return '';
	}

	const conditionNode = nodeConfig.conditionNodes[index];
	const { conditionList = [], groupMode, conditionType, ruleName, expressionText } = conditionNode;

	// 如果是表达式方式（conditionType === 1）
	if (conditionType === 1) {
		if (ruleName && ruleName.trim()) {
			return ruleName.trim();
		} else if (expressionText && expressionText.trim()) {
			// 如果没有规则名称但有表达式，显示表达式的简短版本
			const expression = expressionText.trim();
			if (expression.length > 30) {
				return '表达式：' + expression.substring(0, 30) + '...';
			} else {
				return '表达式：' + expression;
			}
		} else {
			return index === nodeConfig.conditionNodes.length - 1 ? '其他条件进入此流程' : '请设置表达式';
		}
	}

	// 条件组方式的原有逻辑
	if (conditionList.length === 0) {
		return index === nodeConfig.conditionNodes.length - 1 ? '其他条件进入此流程' : '请设置条件';
	} else {
		const groupConArr: string[] = [];

		for (const groupCondition of conditionList) {
			const mode = groupCondition.mode;
			const conArr: string[] = [];

			if (!groupCondition.conditionList) continue;

			for (const con of groupCondition.conditionList) {
				const { key, expression, value } = con;
				if (!key) continue;

				const valueElement = formIdObj.value[key];
				if (!valueElement) continue;

				const name = valueElement.title || valueElement.name;
				let valueShow: string = value;

				if (valueElement.type === 'SelectUser' || valueElement.type === 'SelectDept' || valueElement.type === 'SelectRole' || valueElement.type === 'SelectPost' || valueElement.type === 'OrgSelector') {
					valueShow = value.map((res: any) => res.name).join(',');
				} else if (valueElement.type === 'SingleSelect') {
					valueShow = value.map((res: any) => res.value).join(',');
				} else {
					if (!valueShow) {
						valueShow = '?';
					}
				}

				// 构建条件字符串
				switch (expression) {
					case '==':
						conArr.push(name + ' 等于 ' + valueShow);
						break;
					case 'in':
						conArr.push(name + ' 属于 ' + valueShow);
						break;
					case 'notin':
						conArr.push(name + ' 不属于 ' + valueShow);
						break;
					case '!=':
						conArr.push(name + ' 不等于 ' + valueShow);
						break;
					case '>':
						conArr.push(name + ' 大于 ' + valueShow);
						break;
					case '>=':
						conArr.push(name + ' 大于等于 ' + valueShow);
						break;
					case '<':
						conArr.push(name + ' 小于 ' + valueShow);
						break;
					case '<=':
						conArr.push(name + ' 小于等于 ' + valueShow);
						break;
					case 'contain':
						conArr.push(name + ' 包含 ' + valueShow);
						break;
					case 'notcontain':
						conArr.push(name + ' 不包含 ' + valueShow);
						break;
				}
			}

			if (conArr.length > 0) {
				const s = conArr.join(mode ? ' 且 ' : ' 或 ');
				groupConArr.push('(' + s + ')');
			}
		}

		return groupConArr.length > 0
			? groupConArr.join(groupMode ? ' 且 ' : ' 或 ')
			: index === nodeConfig.conditionNodes.length - 1
			? '默认条件'
			: '请设置条件';
	}
}

/**
 * 获取抄送人显示字符串
 * @param nodeConfig 节点配置
 */
export function copyerStr(nodeConfig: NodeConfig): string | undefined {
	if (nodeConfig.nodeUserList && nodeConfig.nodeUserList.length !== 0) {
		return arrToStr(nodeConfig.nodeUserList);
	}
}

/**
 * 获取延时器显示字符串
 * @param nodeConfig 节点配置
 */
export function timerStr(nodeConfig: NodeConfig): string {
	const timerConfig = nodeConfig.timerConfig;
	if (!timerConfig) return '';

	const { timerType, duration, dateTime, formFieldName } = timerConfig;

	if (timerType === 'DURATION' && duration) {
		const unitLabel = timeUnits.find((u) => u.value === duration.unit)?.label ?? '分钟';
		return `等待${duration.value}${unitLabel}`;
	}
	if (timerType === 'DATETIME' && dateTime) {
		return `等待至 ${dateTime}`;
	}
	if (timerType === 'FORM_FIELD' && formFieldName) {
		return `等待至「${formFieldName}」`;
	}
	return '';
}

/**
 * 工作流辅助函数默认导出对象
 * @deprecated 建议使用具名导出的函数,这个对象主要用于向后兼容
 */
const workflowHelpers = {
	arrToStr,
	toChecked,
	checkApproval,
	setApproverStr,
	dealStr,
	conditionStr,
	copyerStr,
	timerStr,
};

export default workflowHelpers;
