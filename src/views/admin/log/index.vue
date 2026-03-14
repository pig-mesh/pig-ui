<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <!-- 顶部折线图-->
      <log-line-chart/>

      <el-row class="mt-4 ml10" v-show="showSearch">
        <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
          <el-form-item :label="$t('syslog.logType')" prop="logType">
            <el-select :placeholder="$t('syslog.inputLogTypeTip')" clearable
                       v-model="state.queryForm.logType">
              <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in log_type"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('syslog.createTime')" prop="createTime">
            <el-date-picker
                :end-placeholder="$t('syslog.inputEndPlaceholderTip')"
                :start-placeholder="$t('syslog.inputStartPlaceholderTip')"
                range-separator="To"
                type="datetimerange"
                v-model="state.queryForm.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }}</el-button>
            <el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row>
        <div class="mb-2" style="width: 100%">
          <el-button :disabled="multiple" v-auth="'sys_log_del'" @click="handleDelete(selectObjs)" class="ml10"
                     icon="Delete" type="primary">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar
              :export="'sys_log_export'"
              @exportExcel="exportExcel"
              @queryTable="getDataList"
              class="ml10"
              style="float: right; margin-right: 20px"
              v-model:showSearch="showSearch"
          ></right-toolbar>
        </div>
      </el-row>
      <el-table
          ref="tableRef"
          :data="state.dataList"
          @selection-change="handleSelectionChange"
          @sort-change="sortChangeHandle"
          v-loading="state.loading"
          border
          :cell-style="tableStyle.cellStyle"
          :header-cell-style="tableStyle.headerCellStyle"
      >
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column :label="$t('syslog.index')" type="index" width="60"/>
        <el-table-column :label="$t('syslog.logType')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="log_type" :value="scope.row.logType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('syslog.title')" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.method')" prop="method" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.time')" prop="time" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.time">{{ scope.row.time }}/ms</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('syslog.createTime')" prop="createTime" show-overflow-tooltip sortable="custom"
                         width="200"></el-table-column>
        <el-table-column :label="$t('syslog.createBy')" prop="createBy" show-overflow-tooltip sortable="custom"
                         width="200"></el-table-column>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button icon="view" @click="LogDetailRef.openDialog(scope.row)" size="small" text type="primary">
              {{ $t('common.detailBtn') }}
            </el-button>
            <el-button v-auth="'sys_log_del'" icon="delete" @click="handleDelete([scope.row.id])" size="small" text
                       type="primary">
              {{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                  v-bind="state.pagination"></pagination>
      <log-detail ref="LogDetailRef"></log-detail>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, pageList } from '/@/api/admin/log';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

const LogDetail = defineAsyncComponent(() => import('./detail.vue'));
const LogLineChart = defineAsyncComponent(() => import('./line-chart.vue'));

/**
 * 日志详情对话框引用
 */
const LogDetailRef = ref();

/**
 * 日志类型字典
 */
const { log_type } = useDict('log_type');

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 查询表单引用
 */
const queryRef = ref();

/**
 * 是否显示搜索区域
 */
const showSearch = ref(true);

/**
 * 多选的日志ID数组
 */
const selectObjs = ref<string[]>([]);

/**
 * 是否禁用批量删除按钮（无选中项时禁用）
 */
const multiple = ref(true);

/**
 * 表格引用
 */
const tableRef = ref(null);

/**
 * 表格状态配置
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		logType: '',
		createTime: '',
		serviceId: '',
	},
	selectObjs: [],
	pageList: pageList,
	descs: ['create_time'],
	createdIsNeed: false,
});

/**
 * 表格相关钩子函数
 */
const { downBlobFile, getDataList, currentChangeHandle: baseCurrentChangeHandle, sortChangeHandle, sizeChangeHandle, tableStyle } =
	useTable(state);

/**
 * 分页切换事件，重置表格滚动位置
 * @param page - 目标页码
 */
const currentChangeHandle = (page: number): void => {
	// Reset table scroll position to top
	tableRef.value?.setScrollTop(0);
	// Call the original handler
	baseCurrentChangeHandle(page);
};

/**
 * 清空搜索条件并重新查询
 */
const resetQuery = (): void => {
	queryRef.value?.resetFields();
	getDataList();
};

/**
 * 导出Excel文件
 */
const exportExcel = (): void => {
	downBlobFile('/admin/log/export', state.queryForm, 'log.xlsx');
};

/**
 * 表格多选事件处理
 * @param objs - 选中的行对象数组
 */
const handleSelectionChange = (objs: { id: string }[]): void => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

/**
 * 删除日志记录
 * @param ids - 要删除的日志ID数组
 */
const handleDelete = async (ids: string[]): Promise<void> => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 组件挂载时初始化，根据路由参数设置serviceId并加载数据
 */
const route = useRoute();
onMounted(() => {
	const { serviceId } = route.query;
	if (serviceId) {
		state.queryForm.serviceId = serviceId;
	}
	getDataList();
});
</script>

<style lang="scss" scoped>
pre code.hljs {
  width: 65%;
}
</style>
