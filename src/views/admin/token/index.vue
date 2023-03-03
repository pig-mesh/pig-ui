<template>
    <div class="layout-padding">

        <el-card class="layout-padding-auto" shadow="hover">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-form-item :label="$t('systoken.username')" prop="username">
                        <el-input :placeholder="$t('systoken.inputUsernameTip')"
                            v-model="state.queryForm.username"></el-input>
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
                <el-table-column align="center" type="selection" width="50" />
                <el-table-column :label="$t('systoken.index')" type="index" width="80" />
                <el-table-column :label="$t('systoken.username')" prop="username" show-overflow-tooltip
                    width="150"></el-table-column>
                <el-table-column :label="$t('systoken.clientId')" prop="clientId" show-overflow-tooltip
                    width="100"></el-table-column>
                <el-table-column :label="$t('systoken.accessToken')" prop="accessToken" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button link type="success" v-if="filterOwnToken(scope.row)">
                            {{ scope.row.accessToken }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('systoken.expiresAt')" prop="expiresAt" show-overflow-tooltip></el-table-column>
                <el-table-column :label="$t('common.action')" width="100">
                    <template #default="scope">
                        <el-button @click="handleDelete([scope.row.accessToken])" size="small" text type="primary"
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
import { BasicTableProps, useTable } from "/@/hooks/table";
import { delObj, fetchList } from "/@/api/admin/token";
import { useI18n } from 'vue-i18n'
import { useMessage, useMessageBox } from "/@/hooks/message";
import { Session } from "/@/utils/storage";

const { t } = useI18n()
// 定义变量内容
const queryRef = ref()
const showSearch = ref(true)

// 多选rows
const selectObjs = ref([]) as any
// 是否可以多选
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
    queryForm: {
        username: ''
    },
    pageList: fetchList,

});

//  table hook
const {
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
        selectObjs.value.push(val.accessToken)
    });
    multiple.value = !objs.length
}

// 删除操作
const handleDelete = (accessTokens: string[]) => {
    useMessageBox().confirm(t('common.delConfirmText'))
        .then(() => {
            delObj(accessTokens).then(() => {
                getDataList();
                useMessage().success(t('common.delSuccessText'));
            }).catch((err: any) => {
                useMessage().error(err.msg)
            })
        })
};

// 判断当前token 是否和登录token一致
const filterOwnToken = (row: any) => {
    return Session.get('token') === row.accessToken
}
</script>