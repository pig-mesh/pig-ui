import FcDesigner from 'form-create-designer';
import { processFormItemsWithPerms } from './formPermissions';

/**
 * 表单项接口定义
 */
export interface FormItem {
	field?: string;
	title?: string;
	name?: string;
	type?: string;
	required?: boolean;
	props?: Record<string, any>;
	children?: FormItem[];
	hidden?: boolean;
	[key: string]: any;
}

/**
 * 递归展平嵌套表单项 - 提取所有带field的表单项
 * @param items 表单项数组
 * @param filterTypes 可选的类型过滤器,如果提供则只返回指定类型的表单项
 * @returns 展平后的表单项数组
 *
 * @example
 * // 展平所有表单项
 * const flattened = flattenFormItems(formItems);
 *
 * // 只展平特定类型的表单项
 * const filtered = flattenFormItems(formItems, ['OrgSelector', 'input']);
 */
export function flattenFormItems(items: FormItem[], filterTypes?: string[]): FormItem[] {
	const flattened: FormItem[] = [];

	if (!items || !Array.isArray(items)) {
		return flattened;
	}

	items.forEach((item) => {
		// 如果有子组件,递归处理子组件
		if (item.children && Array.isArray(item.children)) {
			flattened.push(...flattenFormItems(item.children, filterTypes));
		} else if (item.field) {
			// 如果指定了类型过滤器,检查类型是否匹配
			if (filterTypes && filterTypes.length > 0) {
				if (item.type && filterTypes.includes(item.type)) {
					flattened.push(item);
				}
			} else {
				// 没有类型过滤器,添加所有有field的表单项
				flattened.push(item);
			}
		}
	});

	return flattened;
}

/**
 * 设置动态表单规则 - 整合解析和权限处理
 * @param formItems 原始表单项JSON字符串
 * @param formPerms 表单权限配置 {field: 'R'|'E'|'H'}
 * @param formData 表单数据(可以是JSON字符串或对象)
 * @param parseFormData 是否解析formData(默认false),某些场景下formData已经是对象,不需要解析
 * @returns 处理后的规则和数据
 *
 * @example
 * const { rule, parsedFormData } = setupDynamicFormRule(
 *   formItemsJson,
 *   { field1: 'R', field2: 'E' },
 *   formDataJson
 * );
 */
export function setupDynamicFormRule(
	formItems: string,
	formPerms: Record<string, string>,
	formData: any,
	parseFormData: boolean = false
): {
	rule: FormItem[];
	parsedFormData: any;
} {
	// 解析表单项
	const parsedFormItems = FcDesigner.formCreate.parseJson(formItems);

	// 递归处理所有表单项的权限
	const itemsWithPerms = processFormItemsWithPerms(parsedFormItems, formPerms);

	// 解析表单数据(如果需要)
	const parsedData = parseFormData ? FcDesigner.formCreate.parseJson(formData) : formData;

	return {
		rule: itemsWithPerms,
		parsedFormData: parsedData,
	};
}
