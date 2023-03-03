<template>
    <div class="layout-padding">

        <el-card class="layout-padding-auto" shadow="hover">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-form-item :label="$t('syslog.logType')" prop="logType">
                        <el-select :placeholder="$t('syslog.inputLogTypeTip')" class="w100"
                                   clearable
                                   v-model="state.queryForm.logType">
                            <el-option :key="item.value" :label="item.label" :value="item.value"
                                       v-for="item in log_type"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('syslog.createTime')" prop="createTime">
                        <el-date-picker :end-placeholder="$t('syslog.inputEndPlaceholderTip')" :start-placeholder="$t('syslog.inputStartPlaceholderTip')"
                                        range-separator="To"
                                        type="datetimerange" v-model="state.queryForm.createTime"
                                        value-format="YYYY-MM-DD HH:mm:ss"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDataList(true)" icon="Search" type="primary">{{ $t('common.queryBtn') }}
                        </el-button>
                        <el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <div class="mb8" style="width: 100%">
                    <el-button @click="exportExcel" class="ml10" icon="Download" type="primary"
                               v-auth="'sys_user_export'">
                        {{ $t('common.exportBtn') }}
                    </el-button>
                    <el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete"
                               type="primary" v-auth="'sys_user_del'">
                        {{ $t('common.delBtn') }}
                    </el-button>
                    <right-toolbar @queryTable="getDataList" class="ml10" style="float: right;margin-right: 20px"
                                   v-model:showSearch="showSearch"></right-toolbar>
                </div>
            </el-row>
            <el-table :data="state.dataList" @selection-change="handleSelectionChange" @sort-change="sortChangeHandle"
                      style="width: 100%" v-loading="state.loading">
                <el-table-column align="center" type="selection" width="50"/>
                <el-table-column :label="$t('syslog.index')" type="index" width="80"/>
                <el-table-column :label="$t('syslog.logType')" show-overflow-tooltip>
                    <template #default="scope">
                        <dict-tag :options="log_type" :value="scope.row.logType"></dict-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('syslog.title')" prop="title" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('syslog.method')" prop="method" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('syslog.serviceId')" prop="serviceId"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('syslog.time')" prop="time" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('syslog.createTime')" prop="createTime" show-overflow-tooltip sortable="custom"
                                 width="200"></el-table-column>
                <el-table-column :label="$t('common.action')" width="100">
                    <template #default="scope">
                        <el-button @click="handleDelete([scope.row.id])" size="small" text type="primary"
                                   v-auth="'sys_user_del'">
                            {{ $t('common.delBtn') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination">
            </pagination>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
    import {BasicTableProps, useTable} from "/@/hooks/table";
    import {delObj, pageList} from "/@/api/admin/log";
    import {useI18n} from 'vue-i18n'
    import {useMessage, useMessageBox} from "/@/hooks/message";
    import {useDict} from "/@/hooks/dict";

    const {log_type} = useDict('log_type')

    const {t} = useI18n()

    // 定义变量内容
    const queryRef = ref();
    const showSearch = ref(true)

    // 多选rows
    const selectObjs = ref([]) as any;
    // 是否可以多选
    const multiple = ref(true);


    const state: BasicTableProps = reactive<BasicTableProps>({
        queryForm: {
            logType: '',
            createTime: ''
        },
        selectObjs: [],
        pageList: pageList,
        descs: ['create_time']
    });

    //  table hook
    const {
        downBlobFile,
        getDataList,
        currentChangeHandle,
        sortChangeHandle,
        sizeChangeHandle
    } = useTable(state)


    // 清空搜索条件
    const resetQuery = () => {
        queryRef.value.resetFields()
        getDataList()
    }

    // 多选事件
    const handleSelectionChange = (objs: any) => {
        objs.forEach((val: any) => {
            selectObjs.value.push(val.id)
        });
        multiple.value = !objs.length
    }

    // 导出excel
    const exportExcel = () => {
        downBlobFile('/admin/log/export', state.queryForm, 'log.xlsx')
    }

    // 删除数据
    const handleDelete = (ids: string[]) => {
        useMessageBox().confirm(`${t('common.delConfirmText')}?`).then(() => {
            // 删除用户的接口
            delObj(ids).then(() => {
                getDataList();
                useMessage().success(t('common.delSuccessText'))
            }).catch(err => {
                useMessage().error(err.msg)
            })
        })
    };
</script>

<style scoped>

</style>
