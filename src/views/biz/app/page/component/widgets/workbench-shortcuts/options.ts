import { FLOW_TASK_LINKS } from '/@/components/Link';

const shortcutDefaults = [
	{
		icon: 'send',
		color: '#2563eb',
	},
	{
		icon: 'clock-circle',
		color: '#d97706',
	},
	{
		icon: 'email',
		color: '#4f46e5',
	},
	{
		icon: 'check-circle',
		color: '#15803d',
	},
];

export default () => ({
	title: '常用功能',
	name: 'workbench-shortcuts',
	content: {
		enabled: 1,
		data: shortcutDefaults.map((item, index) => ({
			...item,
			name: FLOW_TASK_LINKS[index].name,
			link: { ...FLOW_TASK_LINKS[index] },
		})),
	},
	styles: {},
});
