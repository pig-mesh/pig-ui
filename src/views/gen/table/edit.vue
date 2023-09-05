<template>
	<el-tabs v-model="activeName">
		<!-- 属性设置面板 -->
		<el-tab-pane label="属性设置" name="field">
			<sc-form-table ref="fieldTable" v-model="fieldList" :hideAdd="true" :hideDelete="true" drag-sort placeholder="暂无数据">
				<el-table-column label="主键" prop="primaryPk" width="80" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.primaryPk" true-label="1" false-label="0" disabled></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="字段名" prop="fieldName" show-overflow-tooltip></el-table-column>
				<el-table-column label="说明" prop="fieldComment" show-overflow-tooltip>
					<template #default="{ row }">
						<el-input v-model="row.fieldComment" placeholder="请输入说明"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="字段类型" prop="fieldType" show-overflow-tooltip></el-table-column>
				<el-table-column label="属性名" prop="attrName" show-overflow-tooltip>
					<template #default="{ row }">
						<el-input v-model="row.attrName" placeholder="请输入属性名"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="属性类型" prop="attrType" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.attrType" placeholder="请选择属性类型" @change="handleChangeRow(row)">
							<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="自动填充" prop="autoFill" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.autoFill" placeholder="请选择类型">
							<el-option v-for="item in fillList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="字典类型" prop="fieldDict" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.fieldDict" placeholder="请选择类型" filterable clearable :disabled="row.primaryPk === '1'">
							<el-option v-for="item in fieldDictList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
			</sc-form-table>
		</el-tab-pane>
		<!-- 列表设置面板 -->
		<el-tab-pane label="列表查询" name="third">
			<sc-form-table ref="gridTable" v-model="fieldList" :hideAdd="true" :hideDelete="true" placeholder="暂无数据">
				<el-table-column label="属性名" prop="attrName" show-overflow-tooltip></el-table-column>
				<el-table-column label="说明" prop="fieldComment" show-overflow-tooltip></el-table-column>
				<el-table-column label="列表显示" prop="gridItem" width="100" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.gridItem" true-label="1" false-label="0" :disabled="row.primaryPk === '1'"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="是否排序" prop="gridSort" width="100" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.gridSort" true-label="1" false-label="0" :disabled="row.primaryPk === '1'"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="查询显示" prop="gridSort" width="100" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.queryItem" true-label="1" false-label="0" :disabled="row.primaryPk === '1'"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="查询表单类型" prop="queryFormType" show-overflow-tooltip>
					<template #default="{ row }">
												<el-select v-model="row.queryFormType" placeholder="请选择查询表单类型" :disabled="row.primaryPk === '1'">
							<el-option v-for="item in queryTypeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="查询方式" prop="queryType" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.queryType" placeholder="请选择查询方式" :disabled="row.primaryPk === '1'">
							<el-option v-for="item in queryList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
			</sc-form-table>
		</el-tab-pane>
		<el-tab-pane label="表单页面" name="form">
			<sc-form-table ref="formTable" v-model="fieldList" :hideAdd="true" :hideDelete="true" placeholder="暂无数据">
				<el-table-column label="属性名" prop="attrName" show-overflow-tooltip></el-table-column>
				<el-table-column label="说明" prop="fieldComment" show-overflow-tooltip></el-table-column>
				<el-table-column label="表单类型" prop="formType" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.formType" placeholder="请选择表单类型" :disabled="row.primaryPk === '1'">
							<el-option v-for="item in formTypeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="是否显示" prop="formItem" width="100" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.formItem" true-label="1" false-label="0" :disabled="row.primaryPk === '1'"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="表单必填" prop="formRequired" width="100" show-overflow-tooltip>
					<template #default="{ row }">
						<el-checkbox v-model="row.formRequired" true-label="1" false-label="0" :disabled="row.primaryPk === '1'"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column label="表单效验" prop="formValidator" show-overflow-tooltip>
					<template #default="{ row }">
						<el-select v-model="row.formValidator" placeholder="请选择表单效验" :disabled="row.primaryPk === '1'">
							<el-option v-for="item in formValidatorList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</template>
				</el-table-column>
			</sc-form-table>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
import { useTableFieldSubmitApi, useTableApi, fetchDictList } from '/@/api/gen/table';
import { list } from '/@/api/gen/fieldtype';
import Sortable from 'sortablejs';

const scFormTable = defineAsyncComponent(() => import('/@/components/FormTable/index.vue'));

const activeName = ref();
const tableId = ref('');

const props = defineProps({
	tableName: {
		type: String,
	},
	dsName: {
		type: String,
	},
});

const visible = ref(false);

const sortable = ref() as any;

const typeList = ref([]) as any;
const fieldDictList = ref([]) as any;
const dsName = ref();
const tableName = ref();

const fieldList = ref([]);
const fillList = reactive([
	{ label: 'DEFAULT', value: 'DEFAULT' },
	{ label: 'INSERT', value: 'INSERT' },
	{ label: 'UPDATE', value: 'UPDATE' },
	{ label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' },
]);

const queryList = reactive([
	{ label: '=', value: '=' },
	{ label: '!=', value: '!=' },
	{ label: '>', value: '>' },
	{ label: '>=', value: '>=' },
	{ label: '<', value: '<' },
	{ label: '<=', value: '<=' },
	{ label: 'like', value: 'like' },
	{ label: 'left like', value: 'left like' },
	{ label: 'right like', value: 'right like' },
]);

const formTypeList = reactive([
	{ label: '单行文本', value: 'text' },
	{ label: '多行文本', value: 'textarea' },
	{ label: '数字', value: 'number' },
	{ label: '富文本编辑器', value: 'editor' },
	{ label: '下拉框', value: 'select' },
	{ label: '单选按钮', value: 'radio' },
	{ label: '复选框', value: 'checkbox' },
	{ label: '日期', value: 'date' },
	{ label: '日期时间', value: 'datetime' },
	{ label: '文件上传', value: 'upload-file' },
	{ label: '图片上传', value: 'upload-img' },
]);

const queryTypeList = reactive([
	{ label: '单行文本', value: 'text' },
	{ label: '多行文本', value: 'textarea' },
	{ label: '数字', value: 'number' },
	{ label: '下拉框', value: 'select' },
	{ label: '单选按钮', value: 'radio' },
	{ label: '复选框', value: 'checkbox' },
	{ label: '日期', value: 'date' },
	{ label: '日期时间', value: 'datetime' },
]);

const formValidatorList = reactive([
	{ label: '数字', value: 'number' },
	{ label: '字母', value: 'letter' },
	{ label: '字母和数字', value: 'letterAndNumber' },
	{ label: '手机号码', value: 'mobilePhone' },
	{ label: '字母开头，仅可包含数字', value: 'letterStartNumberIncluded' },
	{ label: '禁止中文输入', value: 'noChinese' },
	{ label: '必须中文输入', value: 'chinese' },
	{ label: '电子邮箱', value: 'email' },
	{ label: 'URL网址', value: 'url' },
]);

const propToType = reactive({
  tinyint: 'number',
  smallint: 'number',
  mediumint: 'number',
  int: 'number',
  integer: 'number',
  bigint: 'number',
  float: 'number',
  datetime: 'datetime',
  LocalDateTime: 'datetime',
  date: 'date',
  LocalDate: 'date',
  Long: 'number',
  Float: 'number',
  Double: 'number',
  BigDecimal: 'number',
  text: 'textarea',
  String: 'text',
  longtext: 'editor',
  bit: 'radio',
  Boolean: 'radio',
  char: 'radio',
  varchar: 'text',
});

const handleChangeRow = (row: any) => {
	row.queryFormType = propToType[row.attrType];
	row.formType = propToType[row.attrType];
};

const openDialog = (dName: string, tName: string) => {
	visible.value = true;
	tableName.value = tName;
	dsName.value = dName;

	activeName.value = 'field';

	rowDrop();
	getTable(dName, tName);
	getFieldTypeList();
	getDictList();
};

onMounted(() => {
	tableName.value = String(props.tableName);
	dsName.value = String(props.dsName);
	activeName.value = 'field';
	rowDrop();
	getTable(dsName.value, tableName.value);
	getFieldTypeList();
	getDictList();
});

const rowDrop = () => {
	nextTick(() => {
		const el: any = window.document.querySelector('#pane-field');
		sortable.value = Sortable.create(el, {
			handle: '.drag-btn',
			onEnd: (e: any) => {
				const { newIndex, oldIndex } = e;
				const currRow = fieldList.value.splice(oldIndex, 1)[0];
				fieldList.value.splice(newIndex, 0, currRow);
			},
		});
	});
};
const loading = ref(false);

const getTable = (dsName: string, tableName: string) => {
	fieldList.value = []; // 避免第一次数据初始化， 表格显示历史数据
	loading.value = true;
	useTableApi(dsName, tableName)
		.then((res) => {
			tableId.value = res.data.id;
			fieldList.value = res.data.fieldList.map((item) => {
				item.queryFormType ? item.queryFormType :  propToType[item.fieldType];
				item.formType ? item.formType : propToType[item.fieldType];
				return item;
			});
		})
		.finally(() => {
			loading.value = false;
		});
};

const getFieldTypeList = async () => {
	typeList.value = [];
	// 获取数据
	const { data } = await list();
	// 设置属性类型值
	const typeMap = new Map();
	data.forEach((item: any) => {
		const { attrType, columnType } = item;
		if (!typeMap.has(attrType)) {
			typeMap.set(attrType, columnType);
			typeList.value.push({ label: attrType, value: attrType });
		}
	});
	// 增加Object类型
	typeList.value.push({ label: 'Object', value: 'Object' });
};

const getDictList = () => {
	fetchDictList().then((res) => {
		for (const item of res.data) {
			fieldDictList.value.push({ label: item.description, value: item.dictType });
		}
	});
};

// 表单提交
const submitHandle = () => {
	return new Promise((resolve) => {
		useTableFieldSubmitApi(dsName.value, tableName.value, fieldList.value).then(() => {
			resolve(tableId.value);
		});
	});
};

defineExpose({
	openDialog,
	submitHandle,
});
</script>

<style lang="scss">
.sortable-row-gen .drag-btn {
	cursor: move;
	font-size: 12px;
}

.sortable-row-gen .vxe-body--row.sortable-ghost,
.sortable-row-gen .vxe-body--row.sortable-chosen {
	background-color: #dfecfb;
}

.vxe-select–panel {
	z-index: 9997 !important;
}
</style>
