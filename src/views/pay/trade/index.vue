<template>
    <div class="layout-padding">
        <el-card class="layout-padding-auto">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-form-item :label="$t('trade.orderId')" prop="orderId">
                        <el-input :placeholder="t('trade.inputOrderIdTip')" style="max-width: 180px"
                                  v-model="state.queryForm.orderId"/>
                    </el-form-item>
                    <el-form-item :label="$t('trade.subject')" prop="subject">
                        <el-input :placeholder="t('trade.inputSubjectTip')" style="max-width: 180px"
                                  v-model="state.queryForm.subject"/>
                    </el-form-item>
                    <el-form-item class="ml2">
                        <el-button @click="getDataList" formDialogRef icon="search" type="primary">
                            {{ $t('common.queryBtn') }}
                        </el-button>
                        <el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <div class="mb8" style="width: 100%">
                    <el-button @click="formDialogRef.openDialog()" class="ml10" formDialogRef icon="folder-add"
                               type="primary"
                               v-auth="'pay_trade_add'">
                        {{ $t('common.addBtn') }}
                    </el-button>
                    <el-button @click="exportExcel" class="ml10" formDialogRef icon="Download" type="primary"
                               v-auth="'pay_trade_export'">
                        {{ $t('common.exportBtn') }}
                    </el-button>
                    <el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" formDialogRef
                               icon="Delete"
                               type="primary" v-auth="'pay_trade_del'">
                        {{ $t('common.delBtn') }}
                    </el-button>
                    <right-toolbar @queryTable="getDataList" class="ml10" style="float: right;margin-right: 20px"
                                   v-model:showSearch="showSearch"></right-toolbar>
                </div>
            </el-row>
            <el-table :data="state.dataList" @selection-change="handleSelectionChange" @sort-change="sortChangeHandle"
                      style="width: 100%" v-loading="state.loading">
                <el-table-column align="center" type="selection" width="60"/>
                <el-table-column :label="t('trade.index')" type="index" width="80"/>
                <el-table-column :label="t('trade.orderId')" prop="orderId" show-overflow-tooltip/>
                <el-table-column :label="t('trade.channelId')" prop="channelId" show-overflow-tooltip/>
                <el-table-column :label="t('trade.amount')" prop="amount" show-overflow-tooltip/>
                <el-table-column :label="t('trade.currency')" prop="currency" show-overflow-tooltip/>
                <el-table-column :label="t('trade.status')" prop="status" show-overflow-tooltip/>
                <el-table-column :label="t('trade.clientIp')" prop="clientIp" show-overflow-tooltip/>
                <el-table-column :label="t('trade.device')" prop="device" show-overflow-tooltip/>
                <el-table-column :label="t('trade.subject')" prop="subject" show-overflow-tooltip/>
                <el-table-column :label="t('trade.body')" prop="body" show-overflow-tooltip/>
                <el-table-column :label="t('trade.extra')" prop="extra" show-overflow-tooltip/>
                <el-table-column :label="t('trade.channelMchId')" prop="channelMchId" show-overflow-tooltip/>
                <el-table-column :label="t('trade.channelOrderNo')" prop="channelOrderNo" show-overflow-tooltip/>
                <el-table-column :label="t('trade.errCode')" prop="errCode" show-overflow-tooltip/>
                <el-table-column :label="t('trade.errMsg')" prop="errMsg" show-overflow-tooltip/>
                <el-table-column :label="t('trade.param1')" prop="param1" show-overflow-tooltip/>
                <el-table-column :label="t('trade.param2')" prop="param2" show-overflow-tooltip/>
                <el-table-column :label="t('trade.notifyUrl')" prop="notifyUrl" show-overflow-tooltip/>
                <el-table-column :label="t('trade.notifyCount')" prop="notifyCount" show-overflow-tooltip/>
                <el-table-column :label="t('trade.lastNotifyTime')" prop="lastNotifyTime" show-overflow-tooltip/>
                <el-table-column :label="t('trade.expireTime')" prop="expireTime" show-overflow-tooltip/>
                <el-table-column :label="t('trade.paySuccTime')" prop="paySuccTime" show-overflow-tooltip/>
                <el-table-column :label="$t('common.action')" width="150">
                    <template #default="scope">
                        <el-button @click="formDialogRef.openDialog(scope.row.orderId)" text type="primary"
                                   v-auth="'pay_trade_edit'">{{ $t('common.editBtn') }}
                        </el-button>
                        <el-button @click="handleDelete([scope.row.orderId])" text type="primary"
                                   v-auth="'sys_trade_del'">{{
                            $t('common.delBtn')
                            }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                        v-bind="state.pagination"/>
        </el-card>

        <!-- 编辑、新增  -->
        <form-dialog @refresh="getDataList(false)" ref="formDialogRef"/>
    </div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
    import {BasicTableProps, useTable} from "/@/hooks/table";
    import {delObjs, fetchList} from "/@/api/pay/trade";
    import {useMessage, useMessageBox} from "/@/hooks/message";
    import {useI18n} from "vue-i18n";

    // 引入组件
    const FormDialog = defineAsyncComponent(() => import('./form.vue'));
    const {t} = useI18n()
    // 定义查询字典

    // 定义变量内容
    const formDialogRef = ref()
    // 搜索变量
    const queryRef = ref()
    const showSearch = ref(true)
    // 多选变量
    const selectObjs = ref([]) as any
    const multiple = ref(true)

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
        downBlobFile('/pay/trade/export', state.queryForm, 'trade.xlsx')
    }

    // 多选事件
    const handleSelectionChange = (objs: any) => {
        selectObjs.value = []
        objs.forEach((val: any) => {
            selectObjs.value.push(val.orderId)
        });
        multiple.value = !objs.length
    }

    // 删除操作
    const handleDelete = (ids: string[]) => {
        useMessageBox().confirm(t('common.delConfirmText'))
            .then(() => {
                delObjs(ids).then(() => {
                    getDataList(false);
                    useMessage().success(t('common.delSuccessText'));
                }).catch((err: any) => {
                    useMessage().error(err.msg)
                })
            })
    };
</script>