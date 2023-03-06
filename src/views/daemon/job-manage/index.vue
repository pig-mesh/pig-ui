<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" ref="queryRef">
                    <el-form-item :label="$t('job.jobName')" prop="jobName">
                        <el-input
                                :placeholder="$t('job.inputjobNameTip')"
                                @keyup.enter="getDataList"
                                clearable
                                style="width: 240px"
                                v-model="state.queryForm.jobName"
                        />
                    </el-form-item>
                    <el-form-item :label="$t('job.jobGroup')" prop="jobGroup">
                        <el-input
                                :placeholder="$t('job.inputjobGroupTip')"
                                @keyup.enter="getDataList"
                                clearable
                                style="width: 240px"
                                v-model="state.queryForm.jobGroup"
                        />
                    </el-form-item>

                    <el-form-item :label="t('job.jobStatus')" prop="jobStatus">
                        <el-select :placeholder="t('job.inputjobStatusTip')" v-model="state.queryForm.jobStatus">
                            <el-option :key="index" :label="item.label" :value="item.value"
                                       v-for="(item, index) in job_status"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="t('job.jobExecuteStatus')" prop="jobExecuteStatus">
                        <el-select :placeholder="t('job.inputjobExecuteStatusTip')"
                                   v-model="state.queryForm.jobExecuteStatus">
                            <el-option :key="index" :label="item.label" :value="item.value"
                                       v-for="(item, index) in job_execute_status"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }}
                        </el-button>
                        <el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <div class="mb8" style="width: 100%">
                    <el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">
                        {{ $t('common.addBtn') }}
                    </el-button>
                    <el-button @click="exportExcel" class="ml10" icon="Download" type="primary">
                        {{ $t('common.exportBtn') }}
                    </el-button>
                    <el-button :disabled="multiple" @click="handleDelete(undefined)" class="ml10" icon="Delete"
                               type="primary">
                        {{ $t('common.delBtn') }}
                    </el-button>
                    <right-toolbar
                            @queryTable="getDataList"
                            class="ml10"
                            style="float: right; margin-right: 20px"
                            v-model:showSearch="showSearch"
                    ></right-toolbar>
                </div>
            </el-row>
            <el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
                      v-loading="state.loading">
                <el-table-column align="center" type="selection" width="50"/>
                <el-table-column :label="t('job.index')" fixed="left" type="index" width="80"/>
                <el-table-column :label="t('job.jobName')" fixed="left" prop="jobName" show-overflow-tooltip
                                 width="120"/>
                <el-table-column :label="t('job.jobGroup')" prop="jobGroup" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.jobStatus')" prop="jobStatus" show-overflow-tooltip width="120">
                    <template #default="scope">
                        <dict-tag :options="job_status" :value="scope.row.jobStatus"></dict-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('job.jobExecuteStatus')" prop="jobExecuteStatus" show-overflow-tooltip
                                 width="120">
                    <template #default="scope">
                        <dict-tag :options="job_execute_status" :value="scope.row.jobExecuteStatus"></dict-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="t('job.startTime')" prop="startTime" show-overflow-tooltip width="120"/>

                <el-table-column :label="t('job.previousTime')" prop="previousTime" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.nextTime')" prop="nextTime" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.jobType')" prop="jobType" show-overflow-tooltip width="120">
                    <template #default="scope">
                        <dict-tag :options="job_type" :value="scope.row.jobType"></dict-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('job.executePath')" prop="executePath" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.className')" prop="className" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.methodName')" prop="methodName" show-overflow-tooltip width="120"/>
                <el-table-column :label="t('job.methodParamsValue')" prop="methodParamsValue" show-overflow-tooltip
                                 width="120"/>
                <el-table-column :label="t('job.cronExpression')" prop="cronExpression" show-overflow-tooltip
                                 width="120"/>
                <el-table-column :label="t('job.misfirePolicy')" prop="misfirePolicy" show-overflow-tooltip width="200">
                    <template #default="scope">
                        <dict-tag :options="misfire_policy" :value="scope.row.misfirePolicy"></dict-tag>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('common.action')" fixed="right" width="300">
                    <template #default="scope">
                        <el-button @click="handleJobLog(scope.row)" text type="primary">日志</el-button>

                        <el-button @click="handleStartJob(scope.row)" text type="primary"
                                   v-if="scope.row.jobStatus !== '2'">启动
                        </el-button>

                        <el-button @click="handleShutDownJob(scope.row)" text type="primary"
                                   v-if="scope.row.jobStatus === '2'">暂停
                        </el-button>

                        <el-button @click="handleEditJob(scope.row)" text type="primary">{{ $t('common.editBtn') }}
                        </el-button>

                        <el-button @click="handleRunJob(scope.row)" text type="primary">执行</el-button>

                        <el-button @click="handleDelete(scope.row)" text type="primary">{{ $t('common.delBtn') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                        v-bind="state.pagination"/>
        </div>

        <!-- 编辑、新增  -->
        <form-dialog @refresh="getDataList()" ref="formDialogRef"/>
        <job-log ref="jobLogRef"></job-log>
    </div>
</template>

<script lang="ts" name="systemSysJob" setup>
    import {BasicTableProps, useTable} from '/@/hooks/table';
    import {delObj, fetchList, runJobRa, shutDownJobRa, startJobRa} from '/@/api/daemon/job';
    import {useMessage, useMessageBox} from '/@/hooks/message';
    import {useDict} from '/@/hooks/dict';
    import {useI18n} from 'vue-i18n';

    // 引入组件
    const FormDialog = defineAsyncComponent(() => import('./form.vue'));
    const JobLog = defineAsyncComponent(() => import('./job-log.vue'));
    const {t} = useI18n();
    // 定义查询字典

    const {job_status, job_execute_status, misfire_policy, job_type} = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');
    // 定义变量内容
    const formDialogRef = ref();
    const jobLogRef = ref();
    // 搜索变量
    const queryRef = ref();
    const showSearch = ref(true);
    // 多选变量
    const selectObjs = ref([]);
    const multiple = ref(true);

    const state: BasicTableProps = reactive<BasicTableProps>({
        queryForm: {
            jobName: '',
            jobGroup: '',
            jobStatus: '',
            jobExecuteStatus: '',
        },
        pageList: fetchList,
    });

    //  table hook
    const {getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile} = useTable(state);

    // 清空搜索条件
    const resetQuery = () => {
        queryRef.value.resetFields();
        getDataList();
    };

    // 多选事件
    const handleSelectionChange = (val: any) => {
        selectObjs.value = val;
        multiple.value = !val.length;
    };

    // 导出excel
    const exportExcel = () => {
        downBlobFile('/admin/sys-job/export', state.queryForm, 'job.xlsx');
    };

    const handleJobLog = (row: any) => {
        jobLogRef.value.openDialog(row.jobId);
    };

    const handleEditJob = (row: any) => {
        const jobStatus = row.jobStatus;
        if (jobStatus === '1' || jobStatus === '3') {
            formDialogRef.value.openDialog(row.jobId);
        } else {
            useMessage().error('运行中定时任务不可修改，请先暂停后操作');
        }
    };

    const handleStartJob = (row: any) => {
        const jobStatus = row.jobStatus;
        if (jobStatus === '1' || jobStatus === '3') {
            useMessageBox()
                .confirm('即将发布或启动(任务名称:' + row.jobName + '), 是否继续?')
                .then(() => {
                    startJobRa(row.jobId)
                        .then(() => {
                            getDataList();
                            useMessage().success(t('common.optSuccessText'));
                        })
                        .catch((err: any) => {
                            useMessage().error(err.msg);
                        });
                });
        } else {
            useMessage().error('定时任务已运行');
        }
    };

    const handleShutDownJob = (row: any) => {
        const jobStatus = row.jobStatus;
        if (jobStatus === '2') {
            useMessageBox()
                .confirm('即将暂停(任务名称:' + row.jobName + '), 是否继续?')
                .then(() => {
                    shutDownJobRa(row.jobId)
                        .then(() => {
                            getDataList();
                            useMessage().success(t('common.optSuccessText'));
                        })
                        .catch((err: any) => {
                            useMessage().error(err.msg);
                        });
                });
        } else {
            useMessage().error('已暂停，不要重复操作');
        }
    };

    const handleRunJob = (row: any) => {
        useMessageBox()
            .confirm('立刻执行一次任务(任务名称:' + row.jobName + '), 是否继续?')
            .then(() => {
                runJobRa(row.jobId)
                    .then(() => {
                        getDataList();
                        useMessage().success(t('common.optSuccessText'));
                    })
                    .catch((err: any) => {
                        useMessage().error(err.msg);
                    });
            });
    };

    // 删除操作
    const handleDelete = (row: any) => {
        if (!row) {
            selectObjs.value.forEach((val: any) => {
                handleDelete(val);
            });
            return;
        }
        useMessageBox()
            .confirm(t('common.delConfirmText') + '(任务名称:' + row.jobName + ')')
            .then(() => {
                delObj(row.jobId)
                    .then(() => {
                        getDataList();
                        useMessage().success(t('common.delSuccessText'));
                    })
                    .catch((err: any) => {
                        useMessage().error(err.msg);
                    });
            });
    };
</script>
