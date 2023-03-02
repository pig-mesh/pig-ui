<template>
    <el-dialog :close-on-click-modal="false" :title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')"
               draggable v-model="visible">
        <el-form :model="state.ruleForm" :rules="dataRules" label-width="90px" ref="menuDialogFormRef"
                 v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="12" class="mb20">
                    <el-form-item :label="$t('sysmenu.menuType')" prop="menType">
                        <el-radio-group v-model="state.ruleForm.menuType">
                            <el-radio-button label="0">左菜单</el-radio-button>
                            <el-radio-button label="1">按钮</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20">
                    <el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
                        <el-tree-select :data="state.parentData" :placeholder="$t('sysmenu.inputParentIdTip')"
                                        :props="{ value: 'id', label: 'name', children: 'children' }"
                                        :render-after-expand="false" check-strictly
                                        class="w100" clearable
                                        v-model="state.ruleForm.parentId">
                        </el-tree-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20">
                    <el-form-item :label="$t('sysmenu.name')" prop="name">
                        <el-input :placeholder="$t('sysmenu.inputNameTip')" clearable
                                  v-model="state.ruleForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
                    <el-form-item :label="$t('sysmenu.path')" prop="path">
                        <el-input :placeholder="$t('sysmenu.inputPathTip')" v-model="state.ruleForm.path"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '1'">
                    <el-form-item :label="$t('sysmenu.permission')" prop="permission">
                        <el-input :placeholder="$t('sysmenu.inputPermissionTip')" maxlength="50"
                                  v-model="state.ruleForm.permission"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20">
                    <el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
                        <el-input-number :min="0" controls-position="right" v-model="state.ruleForm.sortOrder"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20">
                    <el-form-item :label="$t('sysmenu.icon')" prop="icon">
                        <IconSelector :placeholder="$t('sysmenu.inputIconTip')" v-model="state.ruleForm.icon"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0' && showembedded">
                    <el-form-item :label="$t('sysmenu.embedded')" prop="embedded">
                        <el-radio-group v-model="state.ruleForm.embedded">
                            <el-radio-button label="0">否</el-radio-button>
                            <el-radio-button label="1">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
                    <el-form-item :label="$t('sysmenu.keepAlive')" prop="keepAlive">
                        <el-radio-group v-model="state.ruleForm.keepAlive">
                            <el-radio-button label="0">否</el-radio-button>
                            <el-radio-button label="1">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
                    <el-form-item :label="$t('sysmenu.visible')" prop="visible">
                        <el-radio-group v-model="state.ruleForm.visible">
                            <el-radio-button label="0">否</el-radio-button>
                            <el-radio-button label="1">是</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button @click="onSubmit" type="primary">{{ $t('common.confirmButtonText') }}</el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" name="systemMenuDialog" setup>
    import {addObj, info, pageList, update} from "/@/api/admin/menu";
    import {useMessage} from "/@/hooks/message";
    import {rule} from "/@/utils/validate";

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    // 引入组件
    const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

    const visible = ref(false)
    const loading = ref(false)
    // 定义变量内容
    const menuDialogFormRef = ref();
    // 定义需要的数据
    const state = reactive({
        ruleForm: {
            id: '',
            menuId: '',
            name: '',
            permission: '',
            parentId: '',
            icon: '',
            path: '',
            sortOrder: 0,
            menuType: '0',
            keepAlive: '0',
            visible: '1',
            embedded: '0',
        },
        parentData: [] as any[], // 上级菜单数据
    });

    // 从后端获取菜单信息
    const getMenuData = () => {
        state.parentData = []
        pageList({
            type: '0'
        }).then(res => {
            let menu = {
                createBy: "",
                createTime: "",
                delFlag: "",
                icon: "",
                keepAlive: "",
                menuId: "",
                menuType: "",
                parentId: "",
                path: "",
                embedded: '0',
                sortOrder: 0,
                updateBy: "",
                updateTime: "",
                visible: "1",
                id: '-1', name: '根菜单', children: []
            };
            menu.children = res.data;
            state.parentData.push(menu)
        })
    };


    const showembedded = ref(false)


    watch(() => state.ruleForm.path, (val) => {
        if (val.startsWith('http')) {
            showembedded.value = true
        } else {
            showembedded.value = false
            state.ruleForm.embedded = '0'
        }
    })

    const dataRules = reactive({
        menType: [{required: true, message: "菜单类型不能为空", trigger: "blur"}],
        parentId: [{required: true, message: "上级菜单不能为空", trigger: "blur"}],
        name: [{required: true, message: "菜单名称不能为空", trigger: "blur"}],
        path: [{required: true, message: "路由路径不能为空", trigger: "blur"}
            , {validator: rule.noChinese, trigger: 'blur'}],
        permission: [{required: true, message: "排序不能为空", trigger: "blur"}],
        visible: [{required: true, message: "显示不能为空", trigger: "blur"}],
        sortOrder: [{required: true, message: "排序不能为空", trigger: "blur"}],
        keepAlive: [{required: true, message: "缓冲不能为空", trigger: "blur"}]
    })
    // 打开弹窗
    const openDialog = (type: string, row?: any) => {
        if (row?.id && type === 'edit') {
            state.ruleForm.id = row.id
            // 模拟数据，实际请走接口
            loading.value = true
            info(row.id).then(res => {
                Object.assign(state.ruleForm, res.data)
            }).finally(() => {
                loading.value = false
            })
        } else {
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                menuDialogFormRef?.value?.resetFields();
                state.ruleForm.parentId = row?.id || '-1'
            });

        }
        visible.value = true;
        getMenuData();
    };

    // 保存数据
    const onSubmit = () => {
        // 保存 调用刷新
        if (state.ruleForm.id) {
            loading.value = true
            update(state.ruleForm).then(() => {
                visible.value = false;
                emit('refresh');
            }).catch(err => {
                useMessage().error(err.msg)
            }).finally(() => {
                loading.value = false
            })
        } else {
            loading.value = true
            addObj(state.ruleForm).then(() => {
                visible.value = false;
                emit('refresh');
            }).catch(err => {
                useMessage().error(err.msg)
            }).finally(() => {
                loading.value = false
            })
        }

    };

    // 暴露变量 只有暴漏出来的变量 父组件才能使用
    defineExpose({
        openDialog,
    });
</script>
