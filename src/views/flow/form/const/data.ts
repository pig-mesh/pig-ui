import { FormGroupVO } from './types';

const formGroupConfig: FormGroupVO[] = [
	{
		name: '文本',
		type: 'Text',
		formList: [
			{
				name: '流水号',
				icon: 'Timer',
				type: 'Sequence',
				typeName: '说明',
				placeholder: 'PREFIX2023072300001',
				required: false,
				props: {
					value: '',
					prefix: '',
				},
			},
			{
				name: '单行文本',
				type: 'Input',
				typeName: '单行文本',
				icon: 'EditPen',
				placeholder: '请填写',
				required: false,
				props: {
					value: '',
				},
			},
			{
				name: '多行文本',
				icon: 'More',
				type: 'Textarea',
				typeName: '多行文本',
				placeholder: '请填写',
				required: false,
				props: {
					value: '',
				},
			},
			{
				name: '富文本',
				type: 'RichEditor',
				typeName: '富文本',
				icon: 'Notebook',
				placeholder: '请填写',
				required: false,
				props: {
					value: '',
				},
			},
			{
				name: '签名',
				icon: 'EditPen',
				type: 'Sign',
				typeName: '说明',
				placeholder: '请填写',
				required: false,
				props: {
					value: '',
				},
			},
			{
				name: '说明',
				icon: 'ChatLineSquare',
				type: 'Description',
				typeName: '说明',
				placeholder: '请填写',
				required: false,
				props: {
					value: '',
				},
			},
		],
	},
	{
		name: '数值',
		type: 'Number',
		formList: [
			{
				name: '数字',
				type: 'Number',
				icon: 'Edit',

				typeName: '数字',
				placeholder: '请填写',
				required: false,
				props: {
					radixNum: 0,
				},
			},
			{
				name: '金额',
				type: 'Money',
				icon: 'Money',

				typeName: '金额',
				placeholder: '请填写',
				required: false,
				props: {
					radixNum: 0,
				},
			},
		],
	},
	{
		name: '日期-时间',
		type: 'DateTime',
		formList: [
			{
				name: '日期',
				type: 'Date',
				icon: 'Calendar',

				typeName: '日期',
				placeholder: '请选择',
				required: false,
				props: {
					radixNum: 0,
				},
			},
			{
				name: '日期时间',
				type: 'DateTime',
				icon: 'AlarmClock',

				typeName: '日期时间',
				placeholder: '请选择',
				required: false,
				props: {
					radixNum: 0,
				},
			},
			{
				name: '时间',
				type: 'Time',
				icon: 'Timer',

				typeName: '时间',
				placeholder: '请选择',
				required: false,
				props: {
					radixNum: 0,
				},
			},
		],
	},
	{
		name: '选项',
		type: 'Option',
		formList: [
			{
				name: '单选',
				icon: 'Select',
				type: 'SingleSelect',
				typeName: '单选',
				placeholder: '请选择',
				required: false,
				props: {
					options: [
						{
							key: '',
							value: '',
						},
					],
				},
			},
			{
				name: '多选',
				type: 'MultiSelect',
				typeName: '多选',
				icon: 'Finished',
				placeholder: '请选择',
				required: false,
				props: {
					value: [],
					options: [
						{
							key: '',
							value: '',
						},
					],
				},
			},
			{
				name: '省市区',
				type: 'Area',
				typeName: '省市区',
				icon: 'MapLocation',
				placeholder: '请选择',
				required: false,
				props: {
					value: '',
				},
			},
		],
	},
	{
		name: '其他',
		type: 'Other',
		formList: [
			{
				name: '图片',
				type: 'UploadImage',
				typeName: '图片',
				icon: 'Picture',
				placeholder: '请选择',
				required: false,
				props: {
					value: '',
					maxSize: 10,
					suffixArray: ['image/jpeg', 'image/png', 'image/gif'],
				},
			},

			{
				name: '文件',
				type: 'UploadFile',
				typeName: '文件',
				icon: 'Upload',
				placeholder: '请选择',
				required: false,
				props: {
					value: '',
					min: 1,
					max: 10,
					maxSize: 10,
					suffixArray: ['png', 'jpg', 'jpeg', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx'],
				},
			},
			{
				name: '用户',
				type: 'SelectUser',
				typeName: '用户',
				placeholder: '请选择',
				icon: 'User',

				required: false,
				props: {
					multi: false,
					self: false,
					value: [],
				},
			},
			{
				name: '部门',
				icon: 'OfficeBuilding',
				type: 'SelectDept',
				typeName: '部门',
				placeholder: '请选择',
				required: false,
				props: {
					multi: false,
					self: false,
					value: [],
				},
			},
		],
	},
];

export { formGroupConfig };
