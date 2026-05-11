export enum LinkTypeEnum {
	'SHOP_PAGES' = 'shop',
	'FLOW_TASKS' = 'flow-tasks',
	'CUSTOM_LINK' = 'custom',
}

export interface Link {
	path: string;
	name?: string;
	type: string;
	query?: Record<string, any>;
}

export const FLOW_TASK_LINKS: Link[] = [
	{
		path: '/pages/workbench/flow/tasks/index?type=started',
		name: '我的',
		type: LinkTypeEnum.FLOW_TASKS,
	},
	{
		path: '/pages/workbench/flow/tasks/index?type=pending',
		name: '待办',
		type: LinkTypeEnum.FLOW_TASKS,
	},
	{
		path: '/pages/workbench/flow/tasks/index?type=cc',
		name: '抄送',
		type: LinkTypeEnum.FLOW_TASKS,
	},
	{
		path: '/pages/workbench/flow/tasks/index?type=completed',
		name: '已办',
		type: LinkTypeEnum.FLOW_TASKS,
	},
];

export const WORKBENCH_SHORTCUT_LINKS = FLOW_TASK_LINKS;
