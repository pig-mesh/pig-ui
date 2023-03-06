<template>
    <div class="layout-padding">
        <el-card class="layout-padding-auto">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-form-item :label="$t('task.taskName')" prop="taskName">
                        <el-input :placeholder="t('task.inputTaskNameTip')" style="max-width: 180px"
                                  v-model="state.queryForm.taskName"/>
                    </el-form-item>
                    <el-form-item class="ml2">
                        <el-button @click="getDataList" formDialogRef icon="search" type="primary"
                                   v-auth="'oa_task_view'">
                            {{ $t('common.queryBtn') }}
                        </el-button>
                        <el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <div class="mb8" style="width: 100%">
                    <el-button @click="exportExcel" class="ml10" formDialogRef icon="Download" type="primary"
                               v-auth="'oa_task_export'">
                        {{ $t('common.exportBtn') }}
                    </el-button>
                    <el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" formDialogRef icon="Delete"
                               type="primary"
                               v-auth="'oa_task_del'">
                        {{ $t('task.cancel') }}
                    </el-button>
                    <right-toolbar @queryTable="getDataList" class="ml10" style="float: right;margin-right: 20px"
                                   v-model:showSearch="showSearch"></right-toolbar>
                </div>
            </el-row>
            <el-table :data="state.dataList" @selection-change="handleSelectionChange" @sort-change="sortChangeHandle"
                      style="width: 100%" v-loading="state.loading">
                <el-table-column align="center" type="selection" width="60"/>
                <el-table-column :label="t('task.index')" type="index" width="80"/>
                <el-table-column :label="t('task.taskId')" prop="taskId" show-overflow-tooltip/>
                <el-table-column :label="t('task.taskName')" prop="taskName" show-overflow-tooltip/>
                <el-table-column :label="t('task.time')" prop="time" show-overflow-tooltip/>
                <el-table-column :label="$t('common.action')" width="200">
                    <template #default="scope">
                        <el-button @click="handleView(scope.row)" text type="primary">流程图
                        </el-button>
                        <el-button @click="formDialogRef.openDialog(scope.row.taskId)" text type="primary">审批
                        </el-button>
                        <el-button @click="commentDialogRef.openDialog(scope.row.taskId)" text type="primary">批注
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                        v-bind="state.pagination"/>
        </el-card>

        <!-- 编辑、新增  -->
        <form-dialog @refresh="getDataList(false)" ref="formDialogRef"/>
        <comment-dialog @refresh="getDataList(false)" ref="commentDialogRef"/>

        <el-dialog title="流程图" v-model="showPicDialog">
            <img :src="actPicUrl" style="width: 100%;">
        </el-dialog>
    </div>
</template>

<script lang="ts" name="systemTask" setup>
    import {BasicTableProps, useTable} from "/@/hooks/table";
    import {delObj, fetchList} from "/@/api/oa/task";
    import {useI18n} from "vue-i18n";
    import {useMessage, useMessageBox} from "/@/hooks/message";

    // 引入组件
    const FormDialog = defineAsyncComponent(() => import('./form.vue'));
    const CommentDialog = defineAsyncComponent(() => import('./comment.vue'));
    const {t} = useI18n()
    // 定义查询字典
    const formDialogRef = ref()
    const commentDialogRef = ref()
    // 搜索变量
    const queryRef = ref()
    const showSearch = ref(true)
    // 多选变量
    const selectObjs = ref([]) as any
    const multiple = ref(true)
    // 流程图URL
    const actPicUrl = ref('')
    // 定义变量内容
    const showPicDialog = ref(false)

    const state: BasicTableProps = reactive<BasicTableProps>({
        queryForm: {},
        pageList: fetchList
    })

    //  table hook
    const {
        getDataList,
        currentChangeHandle,
        sizeChangeHandle,
        sortChangeHandle,
        downBlobFile
    } = useTable(state)

    // 清空搜索条件
    const resetQuery = () => {
        // 清空搜索条件
        queryRef.value.resetFields()
        // 清空多选
        selectObjs.value = []
        getDataList()
    }

    // 导出excel
    const exportExcel = () => {
        downBlobFile('/admin/task/export', state.queryForm, 'task.xlsx')
    }

    // 多选事件
    const handleSelectionChange = (objs: any) => {
        selectObjs.value = []
        objs.forEach((val: any) => {
            selectObjs.value.push(val.taskId)
        });
        multiple.value = !objs.length
    }

    // 删除操作
    const handleDelete = (ids: string[]) => {
        useMessageBox().confirm(t('common.delConfirmText'))
            .then(() => {
                delObj(ids).then(() => {
                    getDataList();
                    useMessage().success(t('common.delSuccessText'));
                }).catch((err: any) => {
                    useMessage().error(err.msg)
                })
            })
    };

    //查看流程图
    const handleView = (row: any) => {
        actPicUrl.value = `/admin/task/view/${row.taskId}`
        showPicDialog.value = true
    }
</script>