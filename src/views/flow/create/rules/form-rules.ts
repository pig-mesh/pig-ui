import type { DragRule } from 'form-create-designer';
import other from '/@/utils/other';
import { dayjs } from 'element-plus';
// Create a map of rule creators
const ruleCreators: Record<string, () => DragRule> = {
	selectUser: () => ({
		menu: 'biz',
		icon: 'icon-table-form2',
		label: '人员',
		name: 'SelectUser',
		mask: true,
		rule() {
			return {
				type: 'OrgSelector',
				field: 'SelectUser' + other.getNonDuplicateID(),
				title: '人员',
				$required: true,
				props: {
					type: 'user',
				},
			};
		},
		props() {
			return [
				{
					type: 'switch',
					title: '多选',
					field: 'multiple',
					value: true,
				},
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: false,
				},
				{
					type: 'switch',
					title: '选择自己',
					field: 'selectSelf',
					value: true,
				},
			];
		},
	}),
	selectDept: () => ({
		menu: 'biz',
		icon: 'icon-group',
		label: '部门',
		name: 'SelectDept',
		mask: true,
		rule() {
			return {
				type: 'OrgSelector',
				field: 'SelectDept' + other.getNonDuplicateID(),
				title: '部门',
				$required: true,
				props: {
					type: 'dept',
				},
			};
		},
		props() {
			return [
				{
					type: 'switch',
					title: '多选',
					field: 'multiple',
					value: true,
				},
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: false,
				},
			];
		},
	}),
	uploadFile: () => ({
		menu: 'biz',
		icon: 'icon-folder',
		label: '上传',
		name: 'UploadFile' + other.getNonDuplicateID(),
		mask: true,
		rule() {
			return {
				type: 'UploadFile',
				field: 'UploadFile',
				title: '文件上传',
				$required: true,
				props: {},
			};
		},
		props() {
			return [
				{
					type: 'input',
					title: '上传地址',
					field: 'uploadFileUrl',
					value: '/admin/sys-file/upload',
				},
				{
					type: 'number',
					title: '数量限制',
					field: 'limit',
					value: 5,
					props: {
						min: 1,
						max: 100,
					},
				},
				{
					type: 'number',
					title: '大小限制(MB)',
					field: 'fileSize',
					value: 5,
					props: {
						min: 1,
						max: 500,
					},
				},
				{
					type: 'select',
					title: '上传类型',
					field: 'type',
					value: 'default',
					options: [
						{ label: '默认', value: 'default' },
						{ label: '简单', value: 'simple' },
					],
				},
				{
					type: 'input',
					title: '上传目录',
					field: 'dir',
					value: '',
				},
				{
					type: 'switch',
					title: '自动上传',
					field: 'autoUpload',
					value: true,
				},
				{
					type: 'switch',
					title: '显示提示',
					field: 'isShowTip',
					value: true,
				},
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: false,
				},
				{
					type: 'select',
					title: '文件类型',
					field: 'fileType',
					value: ['png', 'jpg', 'jpeg', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx'],
					props: {
						multiple: true,
					},
					options: [
						{ label: 'PNG', value: 'png' },
						{ label: 'JPG', value: 'jpg' },
						{ label: 'JPEG', value: 'jpeg' },
						{ label: 'DOC', value: 'doc' },
						{ label: 'DOCX', value: 'docx' },
						{ label: 'XLS', value: 'xls' },
						{ label: 'XLSX', value: 'xlsx' },
						{ label: 'PPT', value: 'ppt' },
						{ label: 'PPTX', value: 'pptx' },
						{ label: 'PDF', value: 'pdf' },
						{ label: 'TXT', value: 'txt' },
					],
				},
			];
		},
	}),
	chinaArea: () => ({
		menu: 'biz',
		icon: 'icon-subform',
		label: '地区',
		name: 'ChinaArea',
		mask: true,
		rule() {
			return {
				type: 'ChinaArea',
				field: 'ChinaArea' + other.getNonDuplicateID(),
				title: '地区',
				$required: true,
				props: {},
			};
		},
		props() {
			return [
				{
					type: 'number',
					title: '层级',
					field: 'type',
					value: 4,
					props: {
						min: 1,
						max: 4,
					},
				},
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: false,
				},
				{
					type: 'switch',
					title: '子级必选',
					field: 'plus',
					value: false,
				},
				{
					type: 'switch',
					title: '懒加载',
					field: 'lazy',
					value: false,
				},
			];
		},
	}),
	sign: () => ({
		menu: 'biz',
		icon: 'icon-edit',
		label: '签名',
		name: 'Sign',
		mask: true,
		rule() {
			return {
				type: 'Sign',
				field: 'Sign' + other.getNonDuplicateID(),
				title: '签名',
				$required: true,
				props: {},
			};
		},
		props() {
			return [
				{
					type: 'number',
					title: '宽度',
					field: 'width',
					value: 300,
					props: {
						min: 100,
						max: 1000,
					},
				},
				{
					type: 'number',
					title: '高度',
					field: 'height',
					value: 150,
					props: {
						min: 50,
						max: 500,
					},
				},
				{
					type: 'number',
					title: '线宽',
					field: 'lineWidth',
					value: 4,
					props: {
						min: 1,
						max: 20,
					},
				},
				{
					type: 'colorPicker',
					title: '线条颜色',
					field: 'lineColor',
					value: '#000000',
				},
				{
					type: 'colorPicker',
					title: '背景颜色',
					field: 'bgColor',
					value: '',
				},
				{
					type: 'switch',
					title: '裁剪空白',
					field: 'isCrop',
					value: false,
				},
				{
					type: 'switch',
					title: '清除背景',
					field: 'isClearBgColor',
					value: true,
				},
			];
		},
	}),
	dictSelect: () => ({
		menu: 'biz',
		icon: 'icon-select',
		label: '字典',
		name: 'DictSelect' + other.getNonDuplicateID(),
		mask: true,
		rule() {
			return {
				type: 'DictSelect',
				field: 'DictSelect',
				title: '字典',
				$required: true,
				props: {},
			};
		},
		props() {
			return [
				{
					type: 'input',
					title: '字典类型',
					field: 'dictType',
					value: '',
					props: {
						placeholder: '请输入字典类型',
					},
				},
				{
					type: 'switch',
					title: '多选',
					field: 'multiple',
					value: false,
				},
				{
					type: 'switch',
					title: '可清除',
					field: 'clearable',
					value: true,
				},
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: false,
				},
			];
		},
	}),

	sequence: () => ({
		menu: 'biz',
		icon: 'icon-number',
		label: '流水号',
		name: 'Sequence',
		mask: true,
		rule() {
			const currentDate = dayjs().format('YYYYMMDD');
			const sequenceNumber = '00001';

			return {
				type: 'Input',
				field: 'Sequence' + other.getNonDuplicateID(),
				title: '流水号',
				$required: true,
				props: {
					disabled: true,
					type: 'Sequence',
					placeholder: currentDate + sequenceNumber,
				},
			};
		},
		props() {
			return [
				{
					type: 'switch',
					title: '禁用',
					field: 'disabled',
					value: true,
				},
			];
		},
	}),
};

// Export all rules as an array
export const rules: any[] = Object.values(ruleCreators).map((creator) => creator());
