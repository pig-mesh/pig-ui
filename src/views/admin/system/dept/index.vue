<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="filter">
					<el-form-item prop="deptName" :label="$t('sysdept.name')">
						<el-input :placeholder="$t('sysdept.inputdeptNameTip')" style="max-width: 180px" v-model="state.queryForm.deptName"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="filter">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="top-right-btn" v-if="!defaultTreeViewRef" v-auth="'sys_dept_add'" @click="handleAdd">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button @click="handleExpand"> {{ $t('common.expandBtn') }}</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_dept_add'"
						@exportExcel="exportExcel"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					>
						<el-tooltip class="item" effect="dark" :content="$t('queryTree.view')" placement="top">
							<el-button circle icon="Grid" @click="handleView"></el-button>
						</el-tooltip>
					</right-toolbar>
				</div>
			</el-row>

			<tree-view ref="treeViewRef" v-if="defaultTreeViewRef" />
			<table-view ref="tableViewRef" v-if="!defaultTreeViewRef" />

			<upload-excel
				ref="excelUploadRef"
				:title="$t('sysdept.importTip')"
				url="/admin/dept/import"
				temp-url="/admin/sys-file/local/file/dept.xlsx"
				@refreshDataList="getDataList"
			/>
		</div>
	</div>
</template>

<script lang="ts" name="systemDept" setup>
import { downBlobFile } from '/@/utils/other';

const TreeView = defineAsyncComponent(() => import('./tree-view.vue'));
const TableView = defineAsyncComponent(() => import('./table-view.vue'));

/** 是否默认使用树形视图（true=树形，false=表格） */
const defaultTreeViewRef = ref(true);

/** 树形视图组件引用 */
const treeViewRef = ref();

/** 表格视图组件引用 */
const tableViewRef = ref();

/** Excel上传组件引用 */
const excelUploadRef = ref();

/** 是否显示搜索区域 */
const showSearch = ref(true);

/** 查询表单引用 */
const queryRef = ref();

/**
 * 组件状态
 * @property {Object} queryForm - 查询表单
 * @property {string} queryForm.deptName - 部门名称
 */
const state = reactive({
	queryForm: {
		deptName: '',
	},
});

/**
 * 过滤节点
 * @description 根据当前视图类型（树形/表格）调用对应的过滤方法
 */
const filter = () => {
	if (defaultTreeViewRef.value) {
		treeViewRef.value.filter(state.queryForm.deptName);
	} else {
		tableViewRef.value.state.queryForm.deptName = state.queryForm.deptName;
		tableViewRef.value.getDataList();
	}
};

/**
 * 新增部门
 * @description 表格视图下调用新增方法
 */
const handleAdd = () => {
	tableViewRef.value.handleAdd();
};

/**
 * 切换视图模式
 * @description 在树形视图和表格视图之间切换
 */
const handleView = () => {
	defaultTreeViewRef.value = !defaultTreeViewRef.value;
};

/**
 * 处理展开/折叠树
 * @description 根据当前视图类型调用对应的展开/折叠方法
 */
const handleExpand = () => {
	if (defaultTreeViewRef.value) {
		treeViewRef.value.handleExpand();
	} else {
		tableViewRef.value.handleExpand();
	}
};

/**
 * 导出部门数据为Excel文件
 */
const exportExcel = () => {
	downBlobFile('/admin/dept/export', state.queryForm, 'dept.xlsx');
};

/**
 * 获取数据列表
 * @description 根据当前视图类型调用对应的数据获取方法
 */
const getDataList = () => {
	if (defaultTreeViewRef.value) {
		treeViewRef.value.getOrgData();
	} else {
		tableViewRef.value.getDataList();
	}
};

/**
 * 重置查询条件
 * @description 清空表单字段并重新加载数据
 */
const resetQuery = () => {
	queryRef.value.resetFields();
};
</script>
