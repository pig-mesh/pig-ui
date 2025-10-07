import { fileGroupAdd, fileGroupDelete, fileGroupUpdate, fileCateLists, fileDelete, fileList, fileMove, fileRename } from '/@/api/admin/file';
import { usePaging } from './usePaging';
import { ElMessage, ElTree, type CheckboxValueType } from 'element-plus';
import { shallowRef, type Ref } from 'vue';
import { useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

/**
 * 文件分组管理钩子函数
 *
 * @param {number} type - 文件类型（10-图片, 20-视频, 30-文件）
 * @returns {Object} 返回分组管理相关的状态和方法
 * @returns {Ref<InstanceType<typeof ElTree>>} treeRef - 树组件引用
 * @returns {Ref<number | string>} cateId - 当前选中的分组ID
 * @returns {Ref<any[]>} cateLists - 分组列表数据
 * @returns {Function} handleAddCate - 添加分组方法
 * @returns {Function} handleEditCate - 编辑分组方法
 * @returns {Function} handleDeleteCate - 删除分组方法
 * @returns {Function} getCateLists - 获取分组列表方法
 * @returns {Function} handleCatSelect - 选中分组方法
 *
 * @example
 * ```typescript
 * const { cateId, cateLists, handleAddCate } = useCate(10);
 *
 * // 添加新分组
 * await handleAddCate('新分组名称');
 * ```
 */
export function useCate(type: number) {
	const { t } = useI18n();
	const treeRef = shallowRef<InstanceType<typeof ElTree>>();

	/** 分组列表数据 */
	const cateLists = ref<any[]>([]);

	/** 当前选中的分组ID */
	const cateId = ref<number | string>('');

	/**
	 * 获取分组列表
	 *
	 * @async
	 * @returns {Promise<void>}
	 *
	 * @description
	 * - 从API获取分组数据
	 * - 自动添加"全部"和"未分组"两个默认分组
	 * - 设置树组件的当前选中项
	 */
	const getCateLists = async () => {
		try {
			const { data } = await fileCateLists({ type });

			const defaultItems: any[] = [
				{
					name: t('material.allFiles'),
					id: '',
				},
				{
					name: t('material.ungrouped'),
					id: -1,
				},
			];

			cateLists.value = data;
			cateLists.value?.unshift(...defaultItems);

			setTimeout(() => {
				treeRef.value?.setCurrentKey(cateId.value);
			}, 0);
		} catch (error) {
			ElMessage.error(t('material.fetchCateListFailed'));
		}
	};

	/**
	 * 添加分组
	 *
	 * @async
	 * @param {string} value - 分组名称
	 * @returns {Promise<void>}
	 *
	 * @example
	 * ```typescript
	 * await handleAddCate('新图片分组');
	 * ```
	 */
	const handleAddCate = async (value: string) => {
		try {
			await fileGroupAdd({
				type,
				name: value,
				pid: -1,
			});
			await getCateLists();
			ElMessage.success(t('material.addGroupSuccess'));
		} catch (error) {
			ElMessage.error(t('material.addGroupFailed'));
		}
	};

	/**
	 * 编辑分组
	 *
	 * @async
	 * @param {string} value - 新的分组名称
	 * @param {number} id - 分组ID
	 * @returns {Promise<void>}
	 *
	 * @example
	 * ```typescript
	 * await handleEditCate('修改后的名称', 123);
	 * ```
	 */
	const handleEditCate = async (value: string, id: number) => {
		try {
			await fileGroupUpdate({
				id,
				name: value,
			});
			await getCateLists();
			ElMessage.success(t('material.editGroupSuccess'));
		} catch (error) {
			ElMessage.error(t('material.editGroupFailed'));
		}
	};

	/**
	 * 删除分组
	 *
	 * @async
	 * @param {number} id - 分组ID
	 * @returns {Promise<void>}
	 *
	 * @description
	 * - 需要用户确认后才执行删除操作
	 * - 删除后自动重置当前选中项并刷新列表
	 *
	 * @example
	 * ```typescript
	 * await handleDeleteCate(123);
	 * ```
	 */
	const handleDeleteCate = async (id: number) => {
		try {
			await useMessageBox().confirm(t('material.confirmDeleteGroup'));
		} catch (error) {
			return;
		}

		try {
			await fileGroupDelete({ id });
			cateId.value = '';
			await getCateLists();
		} catch (error) {
			ElMessage.error(t('material.deleteGroupFailed'));
		}
	};

	/**
	 * 选中分类
	 *
	 * @param {any} item - 分类项对象
	 * @param {number | string} item.id - 分类ID
	 *
	 * @example
	 * ```typescript
	 * handleCatSelect({ id: 123, name: '图片分组' });
	 * ```
	 */
	const handleCatSelect = (item: any) => {
		cateId.value = item.id;
	};

	return {
		treeRef,
		cateId,
		cateLists,
		handleAddCate,
		handleEditCate,
		handleDeleteCate,
		getCateLists,
		handleCatSelect,
	};
}

/**
 * 文件管理钩子函数
 *
 * @param {Ref<string | number>} cateId - 当前分类ID的响应式引用
 * @param {Ref<number>} type - 文件类型的响应式引用
 * @param {Ref<number>} limit - 最大选择数量限制
 * @param {number} size - 分页大小
 * @returns {Object} 返回文件管理相关的状态和方法
 *
 * @example
 * ```typescript
 * const cateId = ref('');
 * const type = ref(10);
 * const limit = ref(5);
 * const { select, selectFile, batchFileDelete } = useFile(cateId, type, limit, 15);
 * ```
 */
export function useFile(cateId: Ref<string | number>, type: Ref<number>, limit: Ref<number>, size: number) {
	const { t } = useI18n();

	/** 表格组件引用 */
	const tableRef = shallowRef();

	/** 列表显示类型：normal-网格, table-表格 */
	const listShowType = ref('normal');

	/** 移动目标分组ID */
	const moveId = ref(-1);

	/** 已选择的文件列表 */
	const select = ref<any[]>([]);

	/** 是否全选 */
	const isCheckAll = ref(false);

	/** 是否半选状态 */
	const isIndeterminate = ref(false);

	/** 文件查询参数 */
	const fileParams = reactive({
		original: '',
		type: type,
		groupId: cateId,
	});

	const { pager, getLists, resetPage } = usePaging({
		fetchFun: fileList,
		params: fileParams,
		firstLoading: true,
		size,
	});

	/**
	 * 获取文件列表
	 *
	 * @returns {void}
	 */
	const getFileList = () => {
		getLists();
	};

	/**
	 * 刷新文件列表（重置到第一页）
	 *
	 * @returns {void}
	 */
	const refresh = () => {
		resetPage();
	};

	/**
	 * 判断文件是否已被选中
	 *
	 * @param {number} id - 文件ID
	 * @returns {boolean} 是否已选中
	 *
	 * @example
	 * ```typescript
	 * const selected = isSelect(123); // true or false
	 * ```
	 */
	const isSelect = (id: number): boolean => {
		return !!select.value.find((item: any) => item.id == id);
	};

	/**
	 * 批量删除文件
	 *
	 * @async
	 * @param {number[]} [id] - 文件ID数组，不传则删除所有已选文件
	 * @returns {Promise<void>}
	 *
	 * @description
	 * - 需要用户确认后才执行删除操作
	 * - 删除后自动刷新列表并清空选择
	 *
	 * @example
	 * ```typescript
	 * // 删除指定文件
	 * await batchFileDelete([1, 2, 3]);
	 *
	 * // 删除所有已选文件
	 * await batchFileDelete();
	 * ```
	 */
	const batchFileDelete = async (id?: number[]) => {
		try {
			await useMessageBox().confirm(t('material.confirmDelete'));
		} catch {
			return;
		}

		try {
			const ids = id ? id : select.value.map((item: any) => item.id);
			await fileDelete({ ids });
			getFileList();
			clearSelect();
		} catch (error) {
			ElMessage.error(t('material.deleteFileFailed'));
		}
	};

	/**
	 * 批量移动文件
	 *
	 * @async
	 * @returns {Promise<void>}
	 *
	 * @description
	 * - 将已选文件移动到指定分组
	 * - 移动后重置目标分组并刷新列表
	 *
	 * @example
	 * ```typescript
	 * moveId.value = 456; // 设置目标分组ID
	 * await batchFileMove();
	 * ```
	 */
	const batchFileMove = async () => {
		try {
			const ids = select.value.map((item: any) => item.id);
			await fileMove({ ids, groupId: moveId.value });
			moveId.value = -1;
			getFileList();
			clearSelect();
		} catch (error) {
			ElMessage.error(t('material.moveFileFailed'));
		}
	};

	/**
	 * 选择/取消选择文件
	 *
	 * @param {any} item - 文件对象
	 * @param {number} item.id - 文件ID
	 * @returns {void}
	 *
	 * @description
	 * - 如果文件已选中，则取消选择
	 * - 如果未选中且未达到限制，则添加到选择列表
	 * - 当 limit=1 时，自动替换上一次选择
	 *
	 * @example
	 * ```typescript
	 * selectFile({ id: 123, name: 'image.jpg' });
	 * ```
	 */
	const selectFile = (item: any) => {
		const index = select.value.findIndex((items: any) => items.id == item.id);

		// 已选中则取消选择
		if (index != -1) {
			select.value.splice(index, 1);
			return;
		}

		// 达到选择上限
		if (select.value.length == limit.value) {
			if (limit.value == 1) {
				// 单选模式：替换选择
				select.value = [];
				select.value.push(item);
				return;
			}
			ElMessage.warning(t('material.selectLimitReached'));
			return;
		}

		select.value.push(item);
	};

	/**
	 * 清空所有选择
	 *
	 * @returns {void}
	 *
	 * @example
	 * ```typescript
	 * clearSelect();
	 * ```
	 */
	const clearSelect = () => {
		select.value = [];
	};

	/**
	 * 取消选择指定文件
	 *
	 * @param {number} id - 文件ID
	 * @returns {void}
	 *
	 * @example
	 * ```typescript
	 * cancelSelete(123);
	 * ```
	 */
	const cancelSelete = (id: number) => {
		select.value = select.value.filter((item: any) => item.id != id);
	};

	/**
	 * 全选/取消全选
	 *
	 * @param {CheckboxValueType} value - 是否全选
	 * @returns {void}
	 *
	 * @description
	 * - 切换表格的全选状态
	 * - 同步更新选择列表
	 *
	 * @example
	 * ```typescript
	 * selectAll(true);  // 全选
	 * selectAll(false); // 取消全选
	 * ```
	 */
	const selectAll = (value: CheckboxValueType) => {
		isIndeterminate.value = false;
		tableRef.value?.toggleAllSelection();

		if (value) {
			select.value = [...pager.lists];
			return;
		}

		clearSelect();
	};

	/**
	 * 重命名文件
	 *
	 * @async
	 * @param {string} value - 新的文件名
	 * @param {number} id - 文件ID
	 * @returns {Promise<void>}
	 *
	 * @description
	 * - 重命名后自动刷新文件列表
	 *
	 * @example
	 * ```typescript
	 * await handleFileRename('new-name.jpg', 123);
	 * ```
	 */
	const handleFileRename = async (value: string, id: number) => {
		try {
			await fileRename({
				id,
				original: value,
			});
			getFileList();
		} catch (error) {
			ElMessage.error(t('material.renameFileFailed'));
		}
	};

	return {
		listShowType,
		tableRef,
		moveId,
		pager,
		fileParams,
		select,
		isCheckAll,
		isIndeterminate,
		getFileList,
		refresh,
		batchFileDelete,
		batchFileMove,
		selectFile,
		isSelect,
		clearSelect,
		cancelSelete,
		selectAll,
		handleFileRename,
	};
}
