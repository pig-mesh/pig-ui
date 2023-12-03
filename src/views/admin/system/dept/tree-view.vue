<template>
  <div style="height: 100%;">
    <vue3-tree-org
        ref="treeOrgRef"
        :props="props"
        :data="data"
        :define-menus="defineMenus"
        :default-expand-level="expandLevel"
        center
        :horizontal="horizontal"
        :collapsable="collapsable"
        :only-one-node="onlyOneNode"
        :filter-node-method="filterNodeMethod"
        :clone-node-drag="cloneNodeDrag"
        :node-add="addNode"
        :node-delete="delNode"
        :node-edit="editNode"
        @on-node-click="onNodeClick"
    />
  </div>
  <dept-form ref="deptDialogRef" @refresh="getOrgData()"/>
</template>

<script lang="ts" name="treeView" setup>
import {useMessage, useMessageBox} from "/@/hooks/message";
import {delObj, deptTree} from '/@/api/admin/dept';
import {getObj} from '/@/api/admin/tenant';
import {Session} from "/@/utils/storage";
import {useI18n} from "vue-i18n";

const DeptForm = defineAsyncComponent(() => import('./form.vue'));

const {t} = useI18n();

// 定义org组件key-value定义
const props = reactive({id: 'id', pid: 'parentId', label: 'name', expand: 'expand', children: 'children'})
const data = reactive({})

// 定义org组件右键定义
const defineMenus = reactive([
  {name: t('sysdept.addNodeText'), command: 'add'},
  {name: t('sysdept.editNodeText'), command: 'edit'},
  {name: t('sysdept.delNodeText'), command: 'delete'}
])

const cloneNodeDrag = ref(true)
const collapsable = ref(false)
const expandLevel = ref(2) //默认展开层级
const horizontal = ref(false)
const onlyOneNode = ref(false)
const treeOrgRef = ref();
const excelUploadRef = ref();
const deptDialogRef = ref();

/**
 * 过滤节点
 */
const filter = (deptName: string) => {
  treeOrgRef.value.filter(deptName);
}

/**
 * 节点过滤方法
 * @param {string} value 过滤条件
 * @param {object} data 节点数据
 * @returns {boolean} 返回过滤结果
 */
const filterNodeMethod = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

/**
 * 处理展开/折叠树
 */
const handleExpand = async () => {
  collapsable.value = !collapsable.value;
};


/**
 * 检查节点是否是根租户节点
 * @param {object} node 节点对象
 * @returns {boolean} 如果节点是根租户节点，返回true；否则返回false
 */
const checkNode = (node) => {
  if (node?.id === '0') {
    useMessage().error(t('sysdept.tenantNodeErrorText'));
    return false;
  }
  return true;
}

/**
 * 当用户左键点击节点，模拟触发组件的右键事件
 * @param e
 */
const onNodeClick = (e: any) => {
  const { clientX, clientY } = e
  const rightFun = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: false,
    view: window,
    button: 2,
    buttons: 0,
    clientX,
    clientY
  })
  e.target.dispatchEvent(rightFun)
}

/**
 * 添加部门
 * @param {object} node 节点对象
 */
const addNode = (node) => {
  deptDialogRef.value.openDialog('add', node?.id);
}

/**
 * 编辑部门
 * @param {object} node 节点对象
 */
const editNode = (node) => {
  if (!checkNode(node)) {
    return;
  }
  deptDialogRef.value.openDialog('edit', node?.id);
}

/**
 * 删除部门
 * @param {object} node 节点对象
 */
const delNode = async (node) => {
  if (!checkNode(node)) {
    return;
  }

  try {
    await useMessageBox().confirm(t('common.delConfirmText'));
  } catch {
    return;
  }

  try {
    await delObj(node.id);
    await getOrgData();
    useMessage().success(t('common.delSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  }
}

/**
 * 查询部门数据
 */
const getOrgData = async () => {
  // 查询当前租户信息
  const tenant = await getObj(Session.getTenant());
  deptTree().then(res => {
    Object.assign(data, {id: '0', name: tenant.data.name});
    data.children = res.data;
  });
}

onMounted(() => {
  getOrgData();
})

// 暴露变量
defineExpose({
  getOrgData,handleExpand,filter
});
</script>
