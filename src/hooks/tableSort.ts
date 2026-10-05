import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue';
import Sortable from 'sortablejs';
import type { BasicTableProps } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';

/** 分页表格拖动后提交当前页 ID 顺序，由服务端维护全局排序。 */
export function useTableSort(
	state: BasicTableProps,
	options: { permission: string; rowKey: string; save: (ids: (string | number)[]) => Promise<unknown>; refresh: () => void }
) {
	const tableRef = ref<{ $el: HTMLElement }>();
	const sortSaving = ref(false);
	const canSort = computed(() => auth(options.permission));
	let sortable: Sortable | undefined;
	let active = true;

	const destroy = () => {
		sortable?.destroy();
		sortable = undefined;
	};
	const init = async () => {
		await nextTick();
		destroy();
		if (!active || !canSort.value || state.loading || sortSaving.value) return;
		const tbody = tableRef.value?.$el.querySelector<HTMLElement>('.el-table__body-wrapper tbody');
		if (!tbody || (state.dataList?.length || 0) < 2) return;
		sortable = Sortable.create(tbody, {
			handle: '.table-sort-handle',
			draggable: '.el-table__row',
			animation: 300,
			onEnd: async ({ item, from, oldIndex, newIndex }) => {
				if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
				// 还原 Sortable 修改的 DOM，避免与 Vue 的 keyed rows 更新冲突。
				from.removeChild(item);
				from.insertBefore(item, from.children[oldIndex] || null);
				if (!canSort.value || state.loading || sortSaving.value) return;
				const rows = [...(state.dataList || [])];
				if (!rows[oldIndex] || !rows[newIndex]) return;
				rows.splice(newIndex, 0, rows.splice(oldIndex, 1)[0]);
				sortSaving.value = true;
				try {
					await options.save(rows.map((row) => row[options.rowKey]));
					useMessage().success('排序已保存');
				} catch (error: unknown) {
					const detail = error as { msg?: string; message?: string } | null;
					useMessage().error(detail?.msg || detail?.message || '排序保存失败');
				} finally {
					options.refresh();
					sortSaving.value = false;
				}
			},
		});
	};

	watch(() => [state.dataList, state.loading, sortSaving.value, canSort.value], init, { flush: 'post' });
	onMounted(init);
	onActivated(() => {
		active = true;
		void init();
	});
	const stop = () => {
		active = false;
		destroy();
	};
	onDeactivated(stop);
	onBeforeUnmount(stop);
	return { tableRef, sortSaving, canSort };
}
