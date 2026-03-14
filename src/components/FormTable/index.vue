<!--
  FormTable 表单表格组件

  功能：基于 el-table 封装的可编辑表格，支持行新增/删除和拖拽排序。
  通过默认插槽传入 el-table-column 定义列，v-model 双向绑定表格数据。

  用法示例：
  <sc-form-table v-model="dataList" :add-template="{ name: '', value: '' }" drag-sort>
    <el-table-column label="名称" prop="name">
      <template #default="{ row }">
        <el-input v-model="row.name" />
      </template>
    </el-table-column>
  </sc-form-table>

  通过 ref 调用暴露的方法：
  - pushRow(row?)  : 新增一行（可传入自定义数据，默认使用 addTemplate）
  - deleteRow(index): 根据索引删除一行

  Props：
  - modelValue  : Array   - 表格数据（v-model）
  - addTemplate : Object  - 新增行模板对象
  - placeholder : string  - 空数据提示文本
  - dragSort    : boolean - 是否启用拖拽排序
  - hideAdd     : boolean - 是否隐藏新增按钮
  - hideDelete  : boolean - 是否隐藏删除按钮

  Events：
  - update:modelValue - 数据变化
  - delete            - 行删除，参数为被删除行数据
-->
<template>
	<div class="form-table" ref="scFormTableRef">
		<el-table
			:data="data"
			ref="tableRef"
			border
			stripe
			:cell-style="{ textAlign: 'center' }"
			:header-cell-style="{
				textAlign: 'center',
				background: 'var(--el-table-row-hover-bg-color)',
				color: 'var(--el-text-color-primary)',
			}"
			style="width: 100%"
			table-layout="auto"
		>
			<!-- 序号列：含新增/删除按钮 -->
			<el-table-column type="index" width="50" fixed="left">
				<template #header>
					<el-button v-if="!hideAdd" type="primary" icon="Plus" size="small" circle @click="rowAdd" />
					<el-tooltip v-else :content="t('formTable.index')" placement="top"> # </el-tooltip>
				</template>
				<template #default="{ row, $index }">
					<div :class="['form-table-handle', { 'form-table-handle-delete': !hideDelete }]">
						<span>{{ $index + 1 }}</span>
						<el-button
							v-if="!hideDelete"
							type="danger"
							icon="Delete"
							size="small"
							plain
							circle
							@click="rowDel(row, $index)"
						/>
					</div>
				</template>
			</el-table-column>
			<!-- 拖拽排序列 -->
			<el-table-column v-if="dragSort" label="" width="50">
				<template #header>
					<el-icon>
						<el-tooltip :content="t('formTable.dragSort')" placement="top">
							<WarningFilled />
						</el-tooltip>
					</el-icon>
				</template>
				<template #default>
					<div class="move" style="cursor: move">
						<el-icon><Sort /></el-icon>
					</div>
				</template>
			</el-table-column>
			<!-- 用户自定义列 -->
			<slot />
			<template #empty>
				{{ placeholder || t('formTable.noData') }}
			</template>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVModel } from '@vueuse/core';
import Sortable from 'sortablejs';

const { t } = useI18n();

const props = defineProps({
	/** 表格数据（v-model） */
	modelValue: {
		type: Array as PropType<Record<string, any>[]>,
		default: () => [],
	},
	/** 新增行模板，点击新增时深拷贝此对象作为新行 */
	addTemplate: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({}),
	},
	/** 空数据提示语，默认使用 i18n */
	placeholder: {
		type: String,
		default: '',
	},
	/** 是否启用拖拽排序 */
	dragSort: {
		type: Boolean,
		default: false,
	},
	/** 是否隐藏新增按钮 */
	hideAdd: {
		type: Boolean,
		default: false,
	},
	/** 是否隐藏删除按钮 */
	hideDelete: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'delete']);

/** 使用 useVModel 实现与父组件的数据双向绑定 */
const data = useVModel(props, 'modelValue', emit, { deep: true });

const scFormTableRef = ref<HTMLDivElement>();
const tableRef = ref();

/**
 * 初始化拖拽排序
 * 通过 Sortable.js 实现表格行拖拽，拖拽结束后重新排列数组并刷新渲染
 */
const initDragSort = () => {
	const tbody = tableRef.value?.$el.querySelector('.el-table__body-wrapper tbody');
	if (!tbody) return;

	Sortable.create(tbody, {
		handle: '.move',
		animation: 300,
		ghostClass: 'ghost',
		onEnd({ newIndex, oldIndex }) {
			if (newIndex == null || oldIndex == null) return;
			// 移动数组元素并就地更新，避免清空数组产生中间状态
			const item = data.value.splice(oldIndex, 1)[0];
			data.value.splice(newIndex, 0, item);
		},
	});
};

onMounted(() => {
	if (props.dragSort) {
		initDragSort();
	}
});

/** 通过 addTemplate 深拷贝新增一行 */
const rowAdd = () => pushRow();

/** 删除指定行并触发 delete 事件 */
const rowDel = (row: Record<string, any>, index: number) => {
	data.value.splice(index, 1);
	emit('delete', row);
};

/** 插入一行（供父组件通过 ref 调用） */
const pushRow = (row?: Record<string, any>) => {
	data.value.push(row || JSON.parse(JSON.stringify(props.addTemplate)));
};

/** 根据索引删除一行（供父组件通过 ref 调用） */
const deleteRow = (index: number) => {
	data.value.splice(index, 1);
};

defineExpose({ pushRow, deleteRow });
</script>

<style scoped>
.form-table {
	width: 100%;
	overflow-x: auto;
}
</style>
