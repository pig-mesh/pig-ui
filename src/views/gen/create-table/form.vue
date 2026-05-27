<template>
  <el-dialog :title="title" v-model="visible" width="90%"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="150px" v-loading="loading"
             :disabled="operType === 'view'">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('createTable.tableName')" prop="tableName">
            <el-input v-model="form.tableName" :placeholder="t('createTable.inputTableNameTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('createTable.comments')" prop="comments">
            <el-input v-model="form.comments" :placeholder="t('createTable.inputCommentsTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('createTable.columnInfo')" prop="columns">
            <sc-form-table v-model="form.columns" :add-method="onAddItem" :drag-sort="operType !== 'view'"
                           :show-index="false" :max-height="500">
              <el-table-column prop="name" :label="t('createTable.name')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-input v-model="row.name" :placeholder="t('createTable.name')"
                            @blur="suggestedFieldType(row)"/>
                </template>
              </el-table-column>
              <el-table-column prop="comment" :label="t('createTable.comment')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-input v-model="row.comment" :placeholder="t('createTable.comment')"/>
                </template>
              </el-table-column>
              <el-table-column prop="type" :label="t('createTable.typeName')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-select v-model="row.type" :placeholder="t('createTable.typeName')" clearable filterable>
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="length" :label="t('createTable.precision')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-input-number :min="0" :max="10000" v-model="row.length"
                                   :placeholder="t('createTable.precision')"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="scale" :label="t('createTable.scale')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-input-number :min="0" :max="10000" v-model="row.scale"
                                   :placeholder="t('createTable.scale')"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" :label="t('createTable.defaultValue')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-input v-model="row.defaultValue" :placeholder="t('createTable.defaultValue')"/>
                </template>
              </el-table-column>
              <el-table-column prop="primary" :label="t('createTable.primary')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-radio-group v-model="row.primary">
                    <el-radio v-for="(item, index) in tableDict" :key="index" :value="item.value" class="w-5">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column prop="nullable" :label="t('createTable.nullable')" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-radio-group v-model="row.nullable">
                    <el-radio v-for="(item, index) in tableDict" :key="index" :value="item.value" class="w-5">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </sc-form-table>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer v-if="operType !== 'view'">
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">{{
              $t('common.confirmButtonText')
            }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="CreateTableDialog">
import {useArrayUnique, useToggle} from '@vueuse/core';
import {useMessage, useMessageBox} from "/@/hooks/message";
import {getObj, addObj} from '/@/api/gen/create-table'
import {useI18n} from "vue-i18n"
import {rule, validateNull} from '/@/utils/validate';
import {list} from "/@/api/gen/fieldtype";
import {useListTableApi} from '/@/api/gen/table';

const ScFormTable = defineAsyncComponent(() => import('/@/components/FormTable/index.vue'));
const emit = defineEmits(['refresh']);

const {t} = useI18n();

const tableDict = [{value: false, label: '否'}, {value: true, label: '是'}]

interface CreateTableColumn {
  name: string;
  comment: string;
  type: string;
  length: number;
  scale: number;
  defaultValue?: any;
  primary: boolean;
  nullable: boolean;
  autoIncrement?: boolean;
}

interface CreateTablePayloadColumn {
  name: string;
  comment: string;
  type: string;
  length?: number;
  precision?: number;
  scale?: number;
  defaultValue?: any;
  primary: boolean;
  nullable: boolean;
  autoIncrement?: boolean;
}

const DEFAULT_COLUMNS: CreateTableColumn[] = [
  {name: 'id', comment: '主键', type: 'bigint', length: 20, scale: 0, defaultValue: null, primary: true, nullable: false},
  {name: 'create_by', comment: '创建人', type: 'varchar', length: 64, scale: 0, defaultValue: null, primary: false, nullable: true},
  {name: 'create_time', comment: '创建时间', type: 'datetime', length: 0, scale: 0, defaultValue: null, primary: false, nullable: true},
  {name: 'update_by', comment: '修改人', type: 'varchar', length: 64, scale: 0, defaultValue: null, primary: false, nullable: true},
  {name: 'update_time', comment: '修改时间', type: 'datetime', length: 0, scale: 0, defaultValue: null, primary: false, nullable: true},
  {name: 'del_flag', comment: '删除标记', type: 'char', length: 1, scale: 0, defaultValue: '0', primary: false, nullable: false},
  {name: 'tenant_id', comment: '租户ID', type: 'bigint', length: 0, scale: 0, defaultValue: null, primary: false, nullable: false},
];

const FIELD_TYPE_RULES: Array<{pattern: RegExp; type: string; length: number}> = [
  {pattern: /(time|date)/i, type: 'datetime', length: 0},
  {pattern: /id/i, type: 'bigint', length: 20},
  {pattern: /(flag|status)/i, type: 'char', length: 1},
];

// 定义变量内容
const dataFormRef = ref();
const [visible, toggleVisible] = useToggle(false);
const [loading, toggleLoading] = useToggle(false);
const operType = ref();
const title = ref('');
const fieldTypeValues = ref<string[]>([]);
const uniqueFieldTypeValues = useArrayUnique(fieldTypeValues);
const typeList = computed(() =>
  uniqueFieldTypeValues.value.map((columnType) => ({label: columnType, value: columnType}))
);

// 提交表单数据
const form = reactive({
  id: '',
  tableName: '',
  dsName: '',
  comments: '',
  databaseType: '',
  pkPolicy: '',
  primary: '',
  columnInfo: [] as CreateTablePayloadColumn[],
  columns: [] as CreateTableColumn[]
});
const hasIdColumn = computed(() => form.columns.some((column) => column.name === 'id'));

const createEmptyColumn = (): CreateTableColumn => ({
  name: '',
  comment: '',
  type: 'varchar',
  length: 255,
  scale: 0,
  defaultValue: null,
  primary: false,
  nullable: true,
});

const cloneDefaultColumns = () => DEFAULT_COLUMNS.map((column) => ({...column}));

const getInsertIndex = () => {
  const idIndex = form.columns.findIndex((column) => column.name === 'id');
  return idIndex >= 0 ? idIndex + 1 : form.columns.length;
};

/**
 * 校验表名
 * @param value 表名
 * @param callback 校验回调
 */
const validateTableName = async (_rule: any, value: string, callback: (error?: Error) => void) => {
  const tableName = normalizeTableName(value);
  if (!tableName || !form.dsName) {
    callback();
    return;
  }

  try {
    const {data = []} = await useListTableApi(form.dsName);
    const exists = data.some((item: any) => normalizeTableName(item.name ?? item.tableName) === tableName);
    callback(exists ? new Error('表名已存在') : undefined);
  } catch (err: any) {
    callback(new Error(err?.msg || '表名校验失败'));
  }
}

const normalizeTableName = (value: string) => String(value || '').trim().toLowerCase();

// 定义校验规则
const dataRules = ref({
  tableName: [
    {required: true, message: '表名称不能为空', trigger: 'blur'},
    {max: 32, message: '长度在 32 个字符', trigger: 'blur'},
    {validator: rule.validatorLowercase, trigger: 'blur'},
    {validator: validateTableName, trigger: 'blur'}
  ],
  comments: [{validator: rule.overLength, trigger: 'blur'}, {
    required: true,
    message: '表注释不能为空',
    trigger: 'blur'
  }],
  databaseType: [{required: true, message: '数据库类型不能为空', trigger: 'blur'}],
  pkPolicy: [{required: true, message: '主键策略不能为空', trigger: 'blur'}],
  columns: [{required: true, message: '字段信息不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (type: string, id: string, dsName: string) => {
  toggleVisible(true)
  operType.value = type;
  form.id = ''
  form.dsName = dsName
  if (type === 'add') {
    title.value = t('common.addBtn');
  } else if (type === 'edit') {
    title.value = t('common.editBtn');
  } else if (type === 'view') {
    title.value = t('common.viewBtn');
  }
  // 获取字典值
  getFieldTypeList()
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
    if (!id) onAddItem()
  });

  // 获取CreateTable信息
  if (id) {
    form.id = id
    getCreateTableData(id)
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    if (form.id) {
      await useMessageBox().confirm("注意：目前修改会重新建表" + form.tableName);
    }
  } catch {
    return;
  }

  try {
    toggleLoading(true)
    form.columnInfo = form.columns.map(toColumnPayload)
    await addObj(form);
    useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
    toggleVisible(false);
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    toggleLoading(false);
  }
};

// 初始化表单数据
const getCreateTableData = (id: string) => {
  // 获取数据
  toggleLoading(true)
  getObj(id).then((res: any) => {
    let columnInfo = res.data.columnInfo;
    res.data.columns = parseColumnList(columnInfo);
    Object.assign(form, res.data)
  }).finally(() => {
    toggleLoading(false)
  })
};

const onAddItem = () => {
  if (!hasIdColumn.value) {
    form.columns.push(...cloneDefaultColumns());
    return;
  }

  form.columns.splice(getInsertIndex(), 0, createEmptyColumn());
}

const getFieldTypeList = async () => {
  const {data} = await list();
  fieldTypeValues.value = data.map((item: any) => item.columnType).filter(Boolean);
};

// 字段建议
const suggestedFieldType = (row: CreateTableColumn) => {
  const rule = FIELD_TYPE_RULES.find((item) => item.pattern.test(row.name));
  if (rule) {
    row.type = rule.type
    row.length = rule.length
    return;
  }

  row.type = 'varchar'
  row.length = 255
}

const parseColumnList = (columnInfo: string) => {
  if (validateNull(columnInfo)) return [];
  try {
    const columns = JSON.parse(columnInfo);
    const columnList = Array.isArray(columns) ? columns : Object.values(columns);
    return columnList.map(normalizeColumn);
  } catch {
    return [];
  }
}

const normalizeColumn = (column: any): CreateTableColumn => {
  return {
    name: column.name || '',
    comment: column.comment || '',
    type: getColumnType(column),
    length: column.length ?? column.precision ?? 0,
    scale: column.scale ?? 0,
    defaultValue: validateNull(column.defaultValue) ? null : column.defaultValue,
    primary: toColumnBoolean(column.primary),
    nullable: toColumnBoolean(column.nullable),
    autoIncrement: toColumnBoolean(column.autoIncrement),
  };
}

const toColumnPayload = (column: CreateTableColumn): CreateTablePayloadColumn => {
  const length = column.length ?? 0;
  const isPrecision = isPrecisionType(column.type);

  return {
    name: column.name,
    comment: column.comment,
    type: column.type,
    length: isPrecision || length <= 0 ? undefined : length,
    precision: isPrecision && length > 0 ? length : undefined,
    scale: isPrecision ? column.scale ?? 0 : undefined,
    defaultValue: validateNull(column.defaultValue) ? null : column.defaultValue,
    primary: Boolean(column.primary),
    nullable: column.primary ? false : Boolean(column.nullable),
    autoIncrement: column.autoIncrement ? true : undefined,
  };
}

const toColumnBoolean = (value: any) => {
  return value === true || value === 1;
}

const getColumnType = (column: any) => {
  const type = column.type || column.Type;
  return typeof type === 'string' && type ? type : column.typeName || 'varchar';
}

const isPrecisionType = (type: string) => {
  return ['decimal', 'number', 'numeric'].includes(String(type).toLowerCase());
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
