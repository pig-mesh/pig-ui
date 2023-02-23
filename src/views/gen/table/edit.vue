<template>
<!--	<el-drawer v-model="visible" title="编辑" :size="1200" :with-header="false" :close-on-click-modal="false">-->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="属性设置" name="field">
				<vxe-table ref="fieldTable" align="center" border row-key class="sortable-row-gen" :data="fieldList"
                   :loading="loading"
					:checkbox-config="{ checkStrictly: true }" :edit-config="{ trigger: 'click', mode: 'cell' }">
					<vxe-column type="seq" width="60"></vxe-column>
					<vxe-column width="60" title="拖动">
						<template #default>
							<span class="drag-btn">
								<i class="vxe-icon-sort"></i>
							</span>
						</template>
						<template #header>
							<el-tooltip class="item" effect="dark" content="按住后可以上下拖动排序" placement="top-start">
								<i class="vxe-icon-question-circle-fill"></i>
							</el-tooltip>
						</template>
					</vxe-column>
					<vxe-column field="fieldName" title="字段名"></vxe-column>
					<vxe-column field="fieldComment" title="说明" :edit-render="{ name: 'input' }"></vxe-column>
					<vxe-column field="fieldType" title="字段类型"></vxe-column>
					<vxe-column field="attrName" title="属性名" :edit-render="{ name: 'input' }"></vxe-column>
					<vxe-column field="attrType" title="属性类型">
						<template #default="{ row }">
							<vxe-select v-model="row.attrType" @change="handleChangeRow(row)">
								<vxe-option v-for="item in typeList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
					</vxe-column>
					<vxe-column field="autoFill" title="自动填充">
						<template #default="{ row }">
							<vxe-select v-model="row.autoFill">
								<vxe-option v-for="item in fillList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
					</vxe-column>
					<vxe-column field="primaryPk" title="主键" width="60">
						<template #default="{ row }">
							<vxe-checkbox v-model="row.primaryPk"></vxe-checkbox>
						</template>
					</vxe-column>
					<vxe-column field="fieldDict" title="字典类型" width="140">
						<template #default="{ row }">
							<vxe-select v-model="row.fieldDict" filterable>
								<vxe-option v-for="item in fieldDictList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
					</vxe-column>
				</vxe-table>
			</el-tab-pane>
			<el-tab-pane label="列表查询" name="third">
				<vxe-grid ref="gridTable" align="center" border row-key :data="fieldList" :loading="loading" :columns="fieldListColumns"
					:checkbox-config="{ checkStrictly: true }" :edit-config="{ trigger: 'click', mode: 'cell' }">
						<template #gridItem="{ row }">
							<vxe-checkbox v-model="row.gridItem"></vxe-checkbox>
						</template>
						<template #gridSort="{ row }">
							<vxe-checkbox v-model="row.gridSort"></vxe-checkbox>
						</template>
						<template #queryFormType="{ row }">
							<vxe-select v-model="row.queryFormType">
								<vxe-option v-for="item in queryTypeList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
						<template #queryItem="{ row }">
							<vxe-checkbox v-model="row.queryItem"></vxe-checkbox>
						</template>
						<template #queryType="{ row }">
							<vxe-select v-model="row.queryType">
								<vxe-option v-for="item in queryList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
				</vxe-grid>
			</el-tab-pane>
			<el-tab-pane label="表单页面" name="form">
				<vxe-table ref="formTable" align="center" border row-key :data="fieldList" :loading="loading"
					:checkbox-config="{ checkStrictly: true }" :edit-config="{ trigger: 'click', mode: 'cell' }">
					<vxe-column field="attrName" title="属性名"></vxe-column>
					<vxe-column field="fieldComment" title="说明"></vxe-column>
					<vxe-column field="formType" title="表单类型" width="200">
						<template #default="{ row }">
							<vxe-select v-model="row.formType">
								<vxe-option v-for="item in formTypeList" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select>
						</template>
					</vxe-column>
					<vxe-column field="formItem" title="表单显示" width="100">
						<template #default="{ row }">
							<vxe-checkbox v-model="row.formItem"></vxe-checkbox>
						</template>
					</vxe-column>
					<vxe-column field="formRequired" title="表单必填" width="100">
						<template #default="{ row }">
							<vxe-checkbox v-model="row.formRequired"></vxe-checkbox>
						</template>
					</vxe-column>
					<vxe-column field="formValidator" title="表单效验">
            <template #default="{ row }">
              <vxe-select v-model="row.formValidator">
                <vxe-option v-for="item in formValidatorList" :key="item.value" :value="item.value"
                            :label="item.label"></vxe-option>
              </vxe-select>
            </template>
          </vxe-column>
				</vxe-table>
			</el-tab-pane>
		</el-tabs>
</template>

<script setup lang="ts">
import { TabsPaneContext } from 'element-plus/es'
import Sortable from 'sortablejs'
import { useTableFieldSubmitApi, useTableApi, fetchDictList } from '/@/api/gen/table'
import { list } from '/@/api/gen/fieldtype'
import { VxeTableInstance } from 'vxe-table'
import { useMessage } from '/@/hooks/message'
import { useI18n } from 'vue-i18n'


const { t } = useI18n();

// const previewRef = ref()
const activeName = ref()
const tableId = ref('')
const fieldTable = ref<VxeTableInstance>()
const formTable = ref<VxeTableInstance>()
const gridTable = ref<VxeTableInstance>()


const props = defineProps({
  tableName: {
    type: String
  },
  dsName: {
    type: String
  }
})



const handleClick = (tab: TabsPaneContext) => {
	if (tab.paneName !== 'field') {
		formTable.value?.loadData(fieldList.value)
		gridTable.value?.loadData(fieldList.value)
	}
}

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)

const sortable = ref() as any

const typeList = ref([]) as any
const fieldDictList = ref([]) as any
const dsName = ref()
const tableName = ref()

const fieldList = ref([])
const fillList = reactive([
	{ label: 'DEFAULT', value: 'DEFAULT' },
	{ label: 'INSERT', value: 'INSERT' },
	{ label: 'UPDATE', value: 'UPDATE' },
	{ label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' }
])


const queryList = reactive([
	{ label: '=', value: '=' },
	{ label: '!=', value: '!=' },
	{ label: '>', value: '>' },
	{ label: '>=', value: '>=' },
	{ label: '<', value: '<' },
	{ label: '<=', value: '<=' },
	{ label: 'like', value: 'like' },
	{ label: 'left like', value: 'left like' },
	{ label: 'right like', value: 'right like' }
])

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
  { label: '图片上传', value: 'upload-img' }
])

const queryTypeList = reactive([
  { label: '单行文本', value: 'text' },
  { label: '多行文本', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '下拉框', value: 'select' },
  { label: '单选按钮', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
])

const formValidatorList = reactive([
  { label: '数字', value: 'number' },
  { label: '字母', value: 'letter' },
  { label: '字母和数字', value: 'letterAndNumber' },
  { label: '手机号码', value: 'mobilePhone' },
  { label: '字母开头，仅可包含数字', value: 'letterStartNumberIncluded' },
  { label: '禁止中文输入', value: 'noChinese' },
  { label: '必须中文输入', value: 'chinese' },
  { label: '电子邮箱', value: 'email' },
  { label: 'URL网址', value: 'url' }
])


const propToType = reactive({
  "tinyint":'number',
  "smallint":'number',
  "mediumint":'number',
  "int":'number',
  "integer":'number',
  "bigint":'number',
  "float":'number',
  "datetime":'datetime',
  "date":'date',
  "Long":'number',
  "Float":'number',
  "Double":'number',
  "BigDecimal":'number',
  "text":'textarea',
  "longtext":'editor',
  "bit":'radio',
  "char":'radio',
  "varchar":'text',
})

const handleChangeRow = (row: any) => {
  row.queryFormType = propToType[row.attrType]
  row.formType = propToType[row.attrType]
}

const openDialog = (dName: string, tName: string) => {
	visible.value = true
	tableName.value = tName
	dsName.value = dName

	activeName.value = 'field'

	rowDrop()
	getTable(dName, tName)
	getFieldTypeList()
	getDictList()
}

onMounted(() => {
  tableName.value = String(props.tableName)
  dsName.value = String(props.dsName)
  activeName.value = 'field'
  rowDrop()
  getTable(dsName.value, tableName.value)
  getFieldTypeList()
  getDictList()
})

const rowDrop = () => {
	nextTick(() => {
		const el: any = window.document.querySelector('.body--wrapper>.vxe-table--body tbody')
		sortable.value = Sortable.create(el, {
			handle: '.drag-btn',
			onEnd: (e: any) => {
				const { newIndex, oldIndex } = e
				const currRow = fieldList.value.splice(oldIndex, 1)[0]
				fieldList.value.splice(newIndex, 0, currRow)
			}
		})
	})
}
const loading = ref(false)

const getTable = (dsName: string, tableName: string) => {
	fieldList.value = [] // 避免第一次数据初始化， 表格显示历史数据
  loading.value = true
	useTableApi(dsName, tableName).then(res => {
		tableId.value = res.data.id
		fieldList.value = res.data.fieldList.map(item => {
      item.queryFormType = propToType[item.fieldType]
      item.formType = propToType[item.fieldType]
      return item
    })
	}).finally(() => {
    loading.value = false
  })
}

const getFieldTypeList = async () => {
	typeList.value = []

	// 获取数据
	const { data } = await list()

	// 设置属性类型值
	data.forEach((item: any) => typeList.value.push({ label: item.attrType, value: item.columnType }))
	// 增加Object类型
	typeList.value.push({ label: 'Object', value: 'Object' })
}

const getDictList = () => {
	fetchDictList().then((res) => {
		for (const item of res.data) {
			fieldDictList.value.push({ label: item.description, value: item.dictType })
		}
	})
}

// 表单提交
const submitHandle = () => {
  return new Promise((resolve) => {
    useTableFieldSubmitApi(dsName.value, tableName.value, fieldList.value).then(() => {
      useMessage().success(t('common.addSuccessText'))
      resolve(tableId.value)
      // visible.value = false // 关闭弹窗
      // emit('refreshDataList')
    })
  })
}

const fieldListColumns = reactive([
  { field: 'attrName', title: '属性名' },
  { field: 'fieldComment', title: '说明' },
  { field: 'gridItem', title: '列表显示', slots: { default: 'gridItem' }},
  { field: 'gridSort', title: '是否排序' , slots: { default: 'gridSort' }},
  { field: 'queryFormType', title: '查询表单类型' , slots: { default: 'queryFormType' }},
  { field: 'queryItem', title: '查询显示', slots: { default: 'queryItem' } },
  { field: 'queryType', title: '查询方式' , slots: { default: 'queryType' }},
])

defineExpose({
	openDialog,
  submitHandle
})
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
