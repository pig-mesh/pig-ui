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
            <el-table :data="form.columns" border style="width: 100%" max-height="500">
              <el-table-column type="index" :label="t('createTable.index')" width="80">
                <template #header>
                  <el-button icon="Plus" size="small" type="primary" circle @click="onAddItem"></el-button>
                </template>
                <template #default="scope">
                  <el-button icon="Minus" size="small" type="danger" circle
                             @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="t('createTable.name')" show-overflow-tooltip>
                <template #default="scope">
                  <el-input v-model="scope.row.name" :placeholder="t('createTable.name')"/>
                </template>
              </el-table-column>
              <el-table-column prop="comment" :label="t('createTable.comment')" show-overflow-tooltip>
                <template #default="scope">
                  <el-input v-model="scope.row.comment" :placeholder="t('createTable.comment')"/>
                </template>
              </el-table-column>
              <el-table-column prop="typeName" :label="t('createTable.typeName')" show-overflow-tooltip>
                <template #default="scope">
                  <el-select v-model="scope.row.typeName" :placeholder="t('createTable.typeName')" clearable filterable>
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="precision" :label="t('createTable.precision')" show-overflow-tooltip>
                <template #default="scope">
                  <el-input-number :min="0" :max="10000" v-model="scope.row.precision"
                                   :placeholder="t('createTable.precision')"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="scale" :label="t('createTable.scale')" show-overflow-tooltip>
                <template #default="scope">
                  <el-input-number :min="0" :max="10000" v-model="scope.row.scale"
                                   :placeholder="t('createTable.scale')"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="defaultValue" :label="t('createTable.defaultValue')" show-overflow-tooltip>
                <template #default="scope">
                  <el-input v-model="scope.row.defaultValue" :placeholder="t('createTable.defaultValue')"/>
                </template>
              </el-table-column>
              <el-table-column prop="primary" :label="t('createTable.primary')" show-overflow-tooltip>
                <template #default="scope">
                  <el-radio-group v-model="scope.row.primary">
                    <el-radio v-for="(item, index) in tableDict" :key="index" :label="item.value" class="w-5">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column prop="nullable" :label="t('createTable.nullable')" show-overflow-tooltip>
                <template #default="scope">
                  <el-radio-group v-model="scope.row.nullable">
                    <el-radio v-for="(item, index) in tableDict" :key="index" :label="item.value" class="w-5">
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
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
import {useMessage, useMessageBox} from "/@/hooks/message";
import {getObj, addObj, putObj} from '/@/api/gen/create-table'
import {useI18n} from "vue-i18n"
import {rule, validateNull} from '/@/utils/validate';
import {useDict} from "/@/hooks/dict";
import {list} from "/@/api/gen/fieldtype";
import {fetchList} from '/@/api/gen/table';

const emit = defineEmits(['refresh']);

const {t} = useI18n();
const {yes_no_type} = useDict('yes_no_type');

const tableDict = [{value: -1, label: '否'}, {value: 1, label: '是'}]

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const operType = ref();
const title = ref('');
const typeList = ref([]) as any;

// 提交表单数据
const form = reactive({
  id: '',
  tableName: '',
  dsName: '',
  comments: '',
  databaseType: '',
  pkPolicy: '',
  primary: '',
  columnsInfo: '',
  columnInfo: '',
  columns: [] as any
});

/**
 * 校验数据源名
 * @param {校验数据源名} rule
 * @param {*} value
 * @param {*} callback
 */
let validateTableName = async (rule, value, callback) => {
  const {data} = await fetchList({tableName: value})
  if (data.total === 0) {
    callback()
  } else {
    callback(new Error('表名已存在'))
  }
}

// 定义校验规则
const dataRules = ref({
  tableName: [
    {required: true, message: '表名称不能为空', trigger: 'blur'},
    {max: 32, message: '长度在 32 个字符', trigger: 'blur'},
    {validator: rule.validatorLowercase, trigger: 'blur'},
    {validator: validateTableName, trigger: 'blur'}
  ],
  comments: [{required: true, message: '表注释不能为空', trigger: 'blur'}],
  databaseType: [{required: true, message: '数据库类型不能为空', trigger: 'blur'}],
  pkPolicy: [{required: true, message: '主键策略不能为空', trigger: 'blur'}],
  columns: [{required: true, message: '字段信息不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (type: string, id: string, dsName: string) => {
  visible.value = true
  operType.value = type;
  form.id = ''
  form.dsName = dsName
  index = 1
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
    loading.value = true;
    form.columnInfo = JSON.stringify(form.columns)
    let columns = {} as any
    form.columns.forEach(each => {
      if (validateNull(each.defaultValue)) each.defaultValue = null
      columns[each.name] = each
    })
    form.columnsInfo = JSON.stringify(columns)
    await addObj(form);
    useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 初始化表单数据
const getCreateTableData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    let columnInfo = res.data.columnInfo;
    res.data.columns = validateNull(columnInfo) ? [] : JSON.parse(columnInfo);
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

let index = 1;
const onAddItem = () => {
  let find = form.columns.find(f => f.name === 'id');
  if (find) {
    let obj = {
      name: '',
      comment: '',
      typeName: 'varchar',
      precision: 255,
      scale: 0,
      defaultValue: null,
      primary: -1,
      nullable: 1
    };

    // 从 index为 1 的位置开始添加, 并且新增的字段要依次向后
    form.columns.splice(index++, 0, obj)
    return
  }
  let id = {
    name: 'id',
    comment: '主键',
    typeName: 'bigint',
    precision: 20,
    scale: 0,
    defaultValue: null,
    primary: 1,
    nullable: -1
  };
  let create_user = {
    name: 'create_by',
    comment: '创建人',
    typeName: 'varchar',
    precision: 64,
    scale: 0,
    defaultValue: null,
    primary: -1,
    nullable: 1
  };
  let create_time = {
    name: 'create_time',
    comment: '创建时间',
    typeName: 'datetime',
    precision: 0,
    scale: 0,
    defaultValue: null,
    primary: -1,
    nullable: 1
  };

  let update_user = {
    name: 'update_by',
    comment: '修改人',
    typeName: 'varchar',
    precision: 64,
    scale: 0,
    defaultValue: null,
    primary: -1,
    nullable: 1
  };

  let update_time = {
    name: 'update_time',
    comment: '修改时间',
    typeName: 'datetime',
    precision: 0,
    scale: 0,
    defaultValue: null,
    primary: -1,
    nullable: 1
  };

  let del_flag = {
    name: 'del_flag',
    comment: '删除标记',
    typeName: 'char',
    precision: 1,
    scale: 0,
    defaultValue: '0',
    primary: -1,
    nullable: -1
  };

  let tenant_id = {
    name: 'tenant_id',
    comment: '租户ID',
    typeName: 'bigint',
    precision: 0,
    scale: 0,
    primary: -1,
    nullable: -1
  };

  form.columns.push(id);
  form.columns.push(create_user);
  form.columns.push(create_time);
  form.columns.push(update_user);
  form.columns.push(update_time);
  form.columns.push(del_flag);
  form.columns.push(tenant_id);
}

const getFieldTypeList = async () => {
  typeList.value = [];
  // 获取数据
  const {data} = await list();
  // 设置属性类型值
  const typeMap = new Map();
  data.forEach((item: any) => {
    const {attrType, columnType} = item;
    if (!typeMap.has(attrType)) {
      typeMap.set(columnType, attrType);
      typeList.value.push({label: columnType, value: columnType});
    }
  });
};

const handleDelete = (index: number, row: any) => {
  form.columns.splice(index, 1)
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
