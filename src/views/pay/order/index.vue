<template>
    <div class="layout-padding">
        <el-card class="layout-padding-auto">
            <el-row class="mb8" v-show="showSearch">
                <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
                    <el-form-item :label="$t('order.goodsOrderId')" prop="goodsOrderId">
                        <el-input :placeholder="t('order.inputGoodsOrderIdTip')" style="max-width: 180px"
                                  v-model="state.queryForm.goodsOrderId"/>
                    </el-form-item>
                    <el-form-item :label="$t('order.goodsName')" prop="goodsName">
                        <el-input :placeholder="t('order.inputGoodsNameTip')" style="max-width: 180px"
                                  v-model="state.queryForm.goodsName"/>
                    </el-form-item>
                    <el-form-item :label="$t('order.payOrderId')" prop="payOrderId">
                        <el-input :placeholder="t('order.inputPayOrderIdTip')" style="max-width: 180px"
                                  v-model="state.queryForm.payOrderId"/>
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
                               v-auth="'pay_order_add'">
                        {{ $t('common.addBtn') }}
                    </el-button>
                    <el-button @click="exportExcel" class="ml10" formDialogRef icon="Download" type="primary"
                               v-auth="'pay_order_export'">
                        {{ $t('common.exportBtn') }}
                    </el-button>
                    <el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" formDialogRef icon="Delete"
                               type="primary" v-auth="'pay_order_del'">
                        {{ $t('common.delBtn') }}
                    </el-button>
                    <right-toolbar @queryTable="getDataList" class="ml10" style="float: right;margin-right: 20px"
                                   v-model:showSearch="showSearch"></right-toolbar>
                </div>
            </el-row>
            <el-table :data="state.dataList" @selection-change="handleSelectionChange" @sort-change="sortChangeHandle"
                      style="width: 100%" v-loading="state.loading">
                <el-table-column align="center" type="selection" width="60"/>
                <el-table-column :label="t('order.index')" type="index" width="80"/>
                <el-table-column :label="t('order.goodsOrderId')" prop="goodsOrderId" show-overflow-tooltip/>
                <el-table-column :label="t('order.goodsId')" prop="goodsId" show-overflow-tooltip/>
                <el-table-column :label="t('order.goodsName')" prop="goodsName" show-overflow-tooltip/>
                <el-table-column :label="t('order.amount')" prop="amount" show-overflow-tooltip/>
                <el-table-column :label="t('order.userId')" prop="userId" show-overflow-tooltip/>
                <el-table-column :label="t('order.status')" prop="status" show-overflow-tooltip/>
                <el-table-column :label="t('order.payOrderId')" prop="payOrderId" show-overflow-tooltip/>
                <el-table-column :label="$t('common.action')" width="150">
                    <template #default="scope">
                        <el-button @click="formDialogRef.openDialog(scope.row.goodsOrderId)" text type="primary"
                                   v-auth="'pay_order_edit'">{{ $t('common.editBtn') }}
                        </el-button>
                        <el-button @click="handleDelete([scope.row.goodsOrderId])" text type="primary"
                                   v-auth="'pay_order_del'">{{
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

<script lang="ts" name="systemPayGoodsOrder" setup>
    import {BasicTableProps, useTable} from "/@/hooks/table";
    import {delObjs, fetchList} from "/@/api/pay/order";
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
    const dictType = ref([
        {
            label: '处理失败',
            value: '-1'
        },
        {
            label: '订单生成',
            value: '0'
        }, {
            label: '支付成功',
            value: '1'
        }, {
            label: '处理完成',
            value: '2'
        }
    ])

    // 导出excel
    const exportExcel = () => {
        downBlobFile('/pay/order/export', state.queryForm, 'order.xlsx')
    }

    // 多选事件
    const handleSelectionChange = (objs: any) => {
        selectObjs.value = []
        objs.forEach((val: any) => {
            selectObjs.value.push(val.goodsOrderId)
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