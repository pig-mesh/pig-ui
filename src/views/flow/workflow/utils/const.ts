/**
 * 工作流常量定义
 * @description 包含工作流相关的颜色、类型、选项等常量配置
 */

/**
 * 节点背景颜色 (RGB格式字符串)
 * [0] 发起人节点
 * [1] 审批人节点
 * [2] 抄送人节点
 */
export const bgColors: string[] = ['87, 106, 149', '255, 148, 62', '50, 150, 250', '', '', '', '', '', '', '', '148, 103, 255'];

/**
 * 节点占位符文本
 */
export const placeholderList: string[] = ['发起人', '审批人', '抄送人', '', '', '', '', '', '', '', '延时器'];

/**
 * 审批人类型选项
 */
export interface SetType {
	value: number;
	label: string;
}

export const setTypes: SetType[] = [
	{ value: 1, label: '指定成员' },
	{ value: 2, label: '部门主管' },
	{ value: 3, label: '角色' },
	{ value: 4, label: '发起人自选' },
	{ value: 5, label: '发起人自己' },
	// { value: 7, label: '连续多级主管' },
	{ value: 8, label: '表单人员' },
	{ value: 10, label: '流程表达式' },
];

/**
 * 选择模式
 */
export interface SelectMode {
	value: number;
	label: string;
}

export const selectModes: SelectMode[] = [
	{ value: 1, label: '选一个人' },
	{ value: 2, label: '选多个人' },
];

/**
 * 选择范围
 */
export interface SelectRange {
	value: number;
	label: string;
}

export const selectRanges: SelectRange[] = [
	{ value: 1, label: '全公司' },
	{ value: 2, label: '指定成员' },
	{ value: 3, label: '指定角色' },
];

/**
 * 操作类型
 */
export interface OptType {
	value: string;
	label: string;
}

export const optTypes: OptType[] = [
	{ value: '1', label: '小于' },
	{ value: '2', label: '大于' },
	{ value: '3', label: '小于等于' },
	{ value: '4', label: '等于' },
	{ value: '5', label: '大于等于' },
	{ value: '6', label: '介于两个数之间' },
];

/**
 * 比较运算符
 */
export interface Opt1 {
	value: string;
	label: string;
}

export const opt1s: Opt1[] = [
	{ value: '<', label: '<' },
	{ value: '≤', label: '≤' },
];

/**
 * 延时类型选项
 */
export interface TimerType {
	value: string;
	label: string;
}

export const timerTypes: TimerType[] = [
	{ value: 'DURATION', label: '固定时长' },
	{ value: 'DATETIME', label: '指定日期时间' },
	{ value: 'FORM_FIELD', label: '表单字段' },
];

/**
 * 时间单位选项
 */
export interface TimeUnit {
	value: string;
	label: string;
}

export const timeUnits: TimeUnit[] = [
	{ value: 'MINUTE', label: '分钟' },
	{ value: 'HOUR', label: '小时' },
	{ value: 'DAY', label: '天' },
	{ value: 'WEEK', label: '周' },
];
