<template>
  <el-dialog
      :title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')"
      v-model="visible"
      width="600"
      :close-on-click-modal="false"
      draggable
  >
    <el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="dataRules" label-width="100px" v-loading="loading">
      <el-form-item :label="$t('sysmenu.menuType')" prop="menuType">
        <el-radio-group v-model="state.ruleForm.menuType">
          <el-radio border label="0">{{ $t('sysmenu.menuTypeMenu') }}</el-radio>
          <el-radio border label="1">{{ $t('sysmenu.menuTypeButton') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
        <el-tree-select
            v-model="state.ruleForm.parentId"
            :data="state.parentData"
            :render-after-expand="false"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            class="w100"
            clearable
            check-strictly
            :placeholder="$t('sysmenu.inputParentIdTip')"
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item prop="name">
        <template #label>
          {{ state.ruleForm.menuType === '0' ? t('sysmenu.name') : t('sysmenu.buttonName') }}
        </template>
        <el-input v-model="state.ruleForm.name" clearable :placeholder="$t('sysmenu.inputNameTip')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysmenu.path')" prop="path" v-if="state.ruleForm.menuType === '0'">
        <el-input v-model="state.ruleForm.path" :placeholder="$t('sysmenu.inputPathTip')"/>
      </el-form-item>
      <el-form-item :label="$t('sysmenu.permission')" prop="permission" v-if="state.ruleForm.menuType === '1'">
        <template #label>
          {{ t('sysmenu.permission') }}
          <tip content="对应后台接口@PreAuthorize注解入参字符串"></tip>
        </template>
        <el-input v-model="state.ruleForm.permission" maxlength="30" :placeholder="$t('sysmenu.inputPermissionTip')"/>
      </el-form-item>
      <el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
        <el-input-number v-model="state.ruleForm.sortOrder" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item :label="$t('sysmenu.icon')" prop="icon" v-if="state.ruleForm.menuType === '0'">
        <IconSelector :placeholder="$t('sysmenu.inputIconTip')" v-model="state.ruleForm.icon"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="keepAlive" v-if="state.ruleForm.menuType === '0'">
            <template #label> {{ $t('sysmenu.keepAlive') }}
              <tip content="组件保留状态，避免重新渲染"/>
            </template>
            <el-radio-group v-model="state.ruleForm.keepAlive">
              <el-radio border label="0">{{ $t('sysmenu.noOption') }}</el-radio>
              <el-radio border label="1">{{ $t('sysmenu.yesOption') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="visible" v-if="state.ruleForm.menuType === '0'">
            <template #label> {{ $t('sysmenu.visible') }}
              <tip content="左侧菜单树是否显示"/>
            </template>
            <el-radio-group v-model="state.ruleForm.visible">
              <el-radio border label="0">{{ $t('sysmenu.noOption') }}</el-radio>
              <el-radio border label="1">{{ $t('sysmenu.yesOption') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mt-4">
        <el-col :span="12">
          <el-form-item prop="param" v-if="state.ruleForm.menuType === '0'">
            <template #label> {{ $t('sysmenu.param') }}
              <tip content="多个路径指向同一个组件"/>
            </template>
            <el-radio-group v-model="state.ruleForm.param">
              <el-radio border label="0">{{ $t('sysmenu.noOption') }}</el-radio>
              <el-radio border label="1">{{ $t('sysmenu.yesOption') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="embedded"
                        v-if="state.ruleForm.menuType === '0' && state.ruleForm.path?.startsWith('http')">
            <template #label> {{ $t('sysmenu.embedded') }}
              <tip content="iframe嵌套还是打开独立的Tab"/>
            </template>
            <el-radio-group v-model="state.ruleForm.embedded">
              <el-radio border label="0">{{ $t('sysmenu.noOption') }}</el-radio>
              <el-radio border label="1">{{ $t('sysmenu.yesOption') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item class="mt-4" :label="$t('sysmenu.component')" prop="component" v-if="state.ruleForm.menuType === '0'
         && state.ruleForm.param === '1'">
        <el-input v-model="state.ruleForm.component" :placeholder="$t('sysmenu.inputComponentTip')"/>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="systemMenuDialog">
import {useI18n} from 'vue-i18n';
import {getObj, pageList, putObj, addObj, validateExist} from '/@/api/admin/menu';
import {useMessage} from '/@/hooks/message';
import {rule, validateNull} from "/@/utils/validate";
import Tip from "/@/components/Tip/index.vue";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const {t} = useI18n();
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/IconSelector/index.vue'));

// 定义变量内容
const visible = ref(false);
const loading = ref(false);
const menuDialogFormRef = ref();

/**
 * 组件状态
 * @property {Object} ruleForm - 菜单表单数据
 * @property {string} ruleForm.menuId - 菜单ID（编辑时有值）
 * @property {string} ruleForm.name - 菜单名称或按钮名称
 * @property {string} ruleForm.permission - 权限标识（按钮类型必填）
 * @property {string} ruleForm.parentId - 父节点ID，'-1' 表示根节点
 * @property {string} ruleForm.icon - 菜单图标
 * @property {string} ruleForm.path - 菜单路径
 * @property {string} ruleForm.param - 是否路径参数（'0'-否，'1'-是）
 * @property {string} ruleForm.component - 组件路径
 * @property {number} ruleForm.sortOrder - 排序号
 * @property {string} ruleForm.menuType - 菜单类型（'0'-菜单，'1'-按钮）
 * @property {string} ruleForm.keepAlive - 是否缓存（'0'-否，'1'-是）
 * @property {string} ruleForm.visible - 是否可见（'0'-否，'1'-是）
 * @property {string} ruleForm.embedded - 是否内嵌（'0'-否，'1'-是）
 * @property {Array} parentData - 上级菜单树形数据
 */
const state = reactive({
  ruleForm: {
    menuId: '',
    name: '',
    permission: '',
    parentId: '',
    icon: '',
    path: '',
    param: '0',
    component: '',
    sortOrder: 0,
    menuType: '1',
    keepAlive: '0',
    visible: '1',
    embedded: '0',
  },
  parentData: [] as any[],
});

/**
 * 操作信息
 * @description 用于跟踪编辑操作的父节点变化，实现精确刷新
 * @property {boolean} isEdit - 是否为编辑操作
 * @property {string} originalParentId - 编辑前的父节点ID
 * @property {string} currentParentId - 当前选择的父节点ID
 */
const operationInfo = reactive({
  isEdit: false,
  originalParentId: '',
  currentParentId: '',
});

// 表单校验规则
const dataRules = reactive({
  menuType: [{required: true, message: t('sysmenu.menuTypeRequired'), trigger: 'blur'}],
  parentId: [{required: true, message: t('sysmenu.parentIdRequired'), trigger: 'blur'}],
  name: [{validator: rule.overLength, trigger: 'blur'}, {
    required: true,
    message: t('sysmenu.nameRequired'),
    trigger: 'blur'
  }],
  path: [{validator: rule.overLength, trigger: 'blur'}, {required: true, message: t('sysmenu.pathRequired'), trigger: 'blur'}],
  icon: [{validator: rule.overLength, trigger: 'blur'}, {required: true, message: t('sysmenu.iconRequired'), trigger: 'blur'}],
  permission: [{validator: rule.overLength, trigger: 'blur'}, {
    required: true,
    message: t('sysmenu.permissionRequired'),
    trigger: 'blur'
  }, {
    validator: (rule: any, value: any, callback: any) => {
      validateExist(rule, value, callback, state.ruleForm.menuId !== '');
    },
    trigger: 'blur',
  }],
  sortOrder: [{required: true, message: t('sysmenu.sortOrderRequired'), trigger: 'blur'}],
  component: [{min: 5, max: 255, message: t('sysmenu.componentLengthInvalid'), trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        if (state.ruleForm.menuType === '0' && state.ruleForm.param === '1' && validateNull(state.ruleForm.component)) {
          callback(new Error(t('sysmenu.componentRequired')));
        } else {
          return callback();
        }
      },
      trigger: 'blur',
    }],
});

/**
 * 打开菜单编辑弹窗
 * @description 根据操作类型（新增/编辑）初始化表单和操作信息
 * @param {string} type - 操作类型（'add'-新增，'edit'-编辑）
 * @param {any} [row] - 当前行数据（新增时作为父节点，编辑时为要编辑的数据）
 */
const openDialog = (type: string, row?: any) => {
  state.ruleForm.menuId = '';
  visible.value = true;

  // 重置操作信息
  operationInfo.isEdit = type === 'edit';
  operationInfo.originalParentId = '';
  operationInfo.currentParentId = ''; // 新增时为空，编辑时会在 getMenuDetail 中赋值

  nextTick(() => {
    menuDialogFormRef.value?.resetFields();
    // 新增时设置默认父节点
    if (type !== 'edit') {
      state.ruleForm.parentId = row?.id || '-1';
      operationInfo.currentParentId = row?.id || '-1';
    }
  });

  if (row?.id && type === 'edit') {
    state.ruleForm.menuId = row.id;
    // 获取当前节点菜单信息
    getMenuDetail(row.id);
  }
  // 渲染上级菜单列表树
  getAllMenuData();
};

/**
 * 获取菜单节点的详细信息
 * @description 编辑时调用，加载菜单详情并初始化表单
 * @param {string} id - 菜单ID
 */
const getMenuDetail = async (id: string) => {
  const { data } = await getObj({menuId: id});
  const menuDetail = data[0];

  if (menuDetail?.component) {
    state.ruleForm.param = '1'
  }

  // 记录编辑前的父节点ID和当前父节点ID
  operationInfo.originalParentId = menuDetail.parentId;
  operationInfo.currentParentId = menuDetail.parentId;

  Object.assign(state.ruleForm, menuDetail);
};

/**
 * 获取上级菜单树形数据
 * @description 加载所有菜单类型（type='0'）的数据，用于父节点选择
 */
const getAllMenuData = async () => {
  state.parentData = [];
  const { data } = await pageList({
    type: '0',
  });

  const menu = {
    id: '-1',
    name: t('sysmenu.rootMenu'),
    children: data,
  };
  state.parentData.push(menu);
};

/**
 * 提交表单数据
 * @description 验证并提交新增/编辑表单，成功后通知父组件刷新
 * @fires refresh - 提交成功后触发，携带刷新信息
 */
const onSubmit = async () => {
  // 立即设置 loading，防止重复点击
  if (loading.value) return;
  loading.value = true;

  try {
    const valid = await menuDialogFormRef.value.validate().catch(() => {
    });
    if (!valid) {
      loading.value = false;
      return false;
    }

    state.ruleForm.menuId ? await putObj(state.ruleForm) : await addObj(state.ruleForm);
    useMessage().success(t(state.ruleForm.menuId ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;

    // 根据操作类型传递不同的刷新信息
    if (operationInfo.isEdit) {
      // 编辑操作：需要刷新原父节点和新父节点（如果父节点发生变化）
      const refreshInfo = {
        isEdit: true,
        originalParentId: operationInfo.originalParentId,
        currentParentId: state.ruleForm.parentId
      };
      emit('refresh', refreshInfo);
    } else {
      // 新增操作：只需要刷新父节点
      const refreshInfo = {
        isEdit: false,
        parentId: state.ruleForm.parentId
      };
      emit('refresh', refreshInfo);
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 暴露变量 只有暴漏出来的变量 父组件才能使用
defineExpose({
  openDialog,
});
</script>
