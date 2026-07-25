import { computed, ref } from 'vue';
import { watchDeep, watchImmediate } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { Local } from '/@/utils/storage';

export type UserTableColumnKey = 'username' | 'name' | 'phone' | 'post' | 'role' | 'lockFlag';

export interface UserTableColumn {
	key: UserTableColumnKey;
	labelKey: string;
	prop?: string;
	fixed?: 'left' | 'right';
	visible: boolean;
}

interface StoredUserTableColumn {
	key: UserTableColumnKey;
	visible: boolean;
}

const STORAGE_PREFIX = 'sys-user-table-columns-v1';

const DEFAULT_COLUMNS: ReadonlyArray<Omit<UserTableColumn, 'visible'>> = [
	{ key: 'username', labelKey: 'sysuser.username', prop: 'username', fixed: 'left' },
	{ key: 'name', labelKey: 'sysuser.name', prop: 'name' },
	{ key: 'phone', labelKey: 'sysuser.phone', prop: 'phone' },
	{ key: 'post', labelKey: 'sysuser.post' },
	{ key: 'role', labelKey: 'sysuser.role' },
	{ key: 'lockFlag', labelKey: 'sysuser.lockFlag' },
];

const DEFAULT_COLUMN_MAP = new Map(DEFAULT_COLUMNS.map((column) => [column.key, column]));

const createDefaultColumns = (): UserTableColumn[] => DEFAULT_COLUMNS.map((column) => ({ ...column, visible: true }));

const isColumnKey = (value: unknown): value is UserTableColumnKey => DEFAULT_COLUMN_MAP.has(value as UserTableColumnKey);

const normalizeColumns = (value: unknown): UserTableColumn[] => {
	const storedColumns = new Map<UserTableColumnKey, boolean>();

	if (Array.isArray(value)) {
		value.forEach((item: unknown) => {
			if (!item || typeof item !== 'object') return;

			const { key, visible } = item as { key?: unknown; visible?: unknown };
			if (!isColumnKey(key) || storedColumns.has(key)) return;

			storedColumns.set(key, typeof visible === 'boolean' ? visible : true);
		});
	}

	DEFAULT_COLUMNS.forEach((column) => {
		if (!storedColumns.has(column.key)) storedColumns.set(column.key, true);
	});

	return Array.from(storedColumns, ([key, visible]) => ({ ...DEFAULT_COLUMN_MAP.get(key)!, visible }));
};

// Local.get 内部已捕获解析异常并返回 null，normalizeColumns 对 null 会回退默认列。
const readColumns = (key: string): UserTableColumn[] => normalizeColumns(Local.get(key));

const saveColumns = (key: string, columns: UserTableColumn[]) => {
	const storedColumns: StoredUserTableColumn[] = columns.map(({ key: columnKey, visible }) => ({ key: columnKey, visible }));

	try {
		Local.set(key, storedColumns);
	} catch {
		// 本地存储不可用时只放弃记忆列设置，不影响表格使用。
	}
};

export function useUserTableColumns() {
	const { userInfos } = storeToRefs(useUserInfo());
	const internalColumns = ref<UserTableColumn[]>(createDefaultColumns());

	const storageKey = computed(() => {
		const currentUser = userInfos.value.user;
		const accountId = currentUser?.userId || currentUser?.username;
		if (!accountId) return null;

		return `${STORAGE_PREFIX}:${userInfos.value.tenantId || 'default'}:${accountId}`;
	});

	const visibleColumns = computed(() => internalColumns.value.filter((column) => column.visible));

	watchImmediate(storageKey, (key) => {
		internalColumns.value = key ? readColumns(key) : createDefaultColumns();
	});

	watchDeep(internalColumns, (value) => {
		if (storageKey.value) saveColumns(storageKey.value, value);
	});

	const reorderColumns = (value: UserTableColumn[]) => {
		internalColumns.value = normalizeColumns(value);
	};

	const setColumnVisibility = (key: UserTableColumnKey, visible: boolean) => {
		internalColumns.value = internalColumns.value.map((column) => (column.key === key ? { ...column, visible } : column));
	};

	const resetColumns = () => {
		internalColumns.value = createDefaultColumns();
	};

	return {
		columns: internalColumns,
		visibleColumns,
		reorderColumns,
		setColumnVisibility,
		resetColumns,
	};
}
