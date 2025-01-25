type FormItem = {
	field: string;
	props?: Record<string, any>;
	children?: FormItem[];
	hidden?: boolean;
	[key: string]: any;
};

export function applyPermissionsToItem(item: FormItem, formPerms: Record<string, string>): FormItem {
	// 如果权限为空，默认设置为只读 'R'
	const permission = formPerms?.[item.field] || 'E';

	// 检查字段权限
	if (permission === 'R') {
		return {
			...item,
			props: {
				...(item.props || {}),
				disabled: true,
			},
		};
	}

	if (permission === 'H') {
		return {
			...item,
			hidden: true,
		};
	}

	// 如果是 'E' 或其他情况，返回原始item
	return item;
}

export function processFormItemsWithPerms(items: FormItem[], formPerms: Record<string, string>): FormItem[] {
	return items.map((item) => {
		// 处理当前项的权限
		const processedItem = applyPermissionsToItem(item, formPerms);

		// 如果有子项，递归处理子项的权限
		if (Array.isArray(item.children)) {
			return {
				...processedItem,
				children: processFormItemsWithPerms(item.children, formPerms),
			};
		}

		return processedItem;
	});
}
