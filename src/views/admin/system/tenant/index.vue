<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('tenant.name')" prop="name">
						<el-input :placeholder="$t('tenant.inputnameTip')" style="max-width: 180px" v-model="state.queryForm.name" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'sys_systenant_add'">
						{{ $t('common.addBtn') }}
					</el-button>

					<el-button plain @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
						{{ $t('common.refreshCacheBtn') }}
					</el-button>

					<el-button
						plain
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						icon="Delete"
						type="primary"
						v-auth="'sys_systenant_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>

					<right-toolbar
						:export="'sys_systenant_export'"
						@exportExcel="exportExcel"
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>

			<el-scrollbar>
				<div class="mx-auto mt-4">
					<div class="px-4">
						<div class="grid sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
							<div class="p-6 mb-6 bg-gray-100 rounded-lg dark:bg-gray-800" v-for="tenant in state.dataList" :key="tenant.id">
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ tenant.name }}</h3>
									</div>
									<div class="flex items-end">
										<svg
											t="1710908184286"
											viewBox="0 0 1024 1024"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											p-id="5178"
											class="w-5 h-5 mr-2 text-base text-gray-500 dark:text-gray-400"
										>
											<path
												d="M512 1003.52a497.92 497.92 0 1 1 497.92-497.92A498.56 498.56 0 0 1 512 1003.52zM512 71.68a433.92 433.92 0 1 0 433.92 433.92A434.56 434.56 0 0 0 512 71.68z"
												fill="#323333"
												p-id="5179"
											></path>
											<path
												d="M152.96 369.92a33.92 33.92 0 0 1 35.2-36.48 39.04 39.04 0 0 1 29.44 16l148.48 198.4V369.92a35.2 35.2 0 1 1 69.76 0V640a30.72 30.72 0 0 1-34.56 33.28 36.48 36.48 0 0 1-29.44-12.8l-147.2-198.4V640a30.72 30.72 0 0 1-34.56 33.28 31.36 31.36 0 0 1-37.12-33.28zM463.36 504.32a162.56 162.56 0 1 1 323.84 0 158.08 158.08 0 0 1-161.92 168.96 159.36 159.36 0 0 1-161.92-168.96z m252.16 0c-3.84-69.12-33.92-104.96-90.24-108.8s-84.48 39.68-88.32 108.8 33.28 104.32 88.32 108.16 86.4-36.48 90.24-108.16zM856.96 603.52A37.12 37.12 0 0 1 896 640c0 21.12-13.44 32-36.48 33.28s-35.84-12.16-37.12-33.28a37.76 37.76 0 0 1 34.56-36.48z"
												fill="#323333"
												p-id="5180"
											></path>
										</svg>
										<span class="mr-1 dark:text-gray-300">{{ tenant.code }}</span>
									</div>
								</div>
								<p class="my-3 text-sm font-normal text-gray-500 dark:text-gray-400">
									{{ $t('tenant.statusLabel') }}： {{ status_type.find((item: any) => item.value === tenant.status)?.label }}
								</p>
								<p class="my-3 text-sm font-normal text-gray-500 dark:text-gray-400">
									{{ $t('tenant.validityPeriodLabel') }}： {{ parseDate(tenant.startTime) }} - {{ parseDate(tenant.endTime) }}
								</p>
								<div class="flex items-center justify-between mt-6 text-sm font-semibold text-gray-900 dark:text-gray-100">
									<div class="flex">
										<svg
											t="1710908265535"
											class="w-6 h-5 mr-1 text-yellow-500"
											viewBox="0 0 1024 1024"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											p-id="6175"
											width="128"
											height="128"
										>
											<path
												d="M512.001274 15.045039a497.880869 497.880869 0 0 1 496.99699 497.086142c0 137.285182-55.886849 261.573274-145.67566 351.652466-89.81301 90.098296-214.335444 145.167493-351.32133 145.167494-137.262257 0-261.529972-55.069197-351.31751-145.173862-89.788811-90.079192-145.67566-214.367284-145.67566-351.646098a497.880869 497.880869 0 0 1 496.99317-497.086142zM489.215293 932.144136V771.518957a405.118201 405.118201 0 0 0-129.123952 26.595319 137.138718 137.138718 0 0 0-17.101903 6.511917c3.53042 7.062113 6.785742 14.098754 10.570881 20.887043 25.514032 45.602527 55.33538 80.88762 88.987717 101.223193a372.744559 372.744559 0 0 0 46.671078 5.40898z m320.120674-717.103117a128.736778 128.736778 0 0 0-10.591259-10.061441 441.222218 441.222218 0 0 1-58.315604 36.934404c27.141693 70.795612 43.939205 156.01602 46.672351 247.447775h144.843999a419.629601 419.629601 0 0 0-122.609487-274.320738z m-46.672352-40.41388a415.300634 415.300634 0 0 0-85.71329-49.415687 434.384259 434.384259 0 0 1 33.623044 51.562976c3.805517 7.062113 7.861934 15.201692 11.942549 23.339997 13.571483-8.138305 27.117495-16.556802 40.137509-25.493654z m-181.233302-77.3572c-15.172399-2.404557-30.921738-4.056417-46.64688-5.133883V253.306336a429.022402 429.022402 0 0 0 129.127773-26.588951c5.985921-2.177856 11.392353-4.356986 17.076431-6.787015-2.954752-7.337211-7.036641-14.373851-10.541588-20.887043-24.989309-46.15527-55.610477-80.888893-89.013189-101.774662z m-92.217567-5.133883c-15.723868 1.077466-31.473207 2.729325-46.671078 5.133883-33.652337 20.887043-63.473685 55.619393-88.987717 101.774662-3.781319 6.510644-7.036641 13.547285-10.816686 20.887042 5.684078 2.430029 11.392353 4.609159 17.351529 6.787016a428.859382 428.859382 0 0 0 129.123952 26.595318V92.130962z m-142.141419 33.075396a414.845959 414.845959 0 0 0-85.732395 49.415687c13.020014 8.940673 26.591498 17.355349 40.412607 25.493654a233.26369 233.26369 0 0 1 11.667451-23.339997c10.041064-19.007209 21.708515-35.811089 33.652337-51.562976z m-122.088585 79.763031c-3.255322 3.004423-7.060839 6.536116-10.316162 10.061441a419.628328 419.628328 0 0 0-122.614581 274.32456h144.874565c2.703853-91.430482 19.529385-176.648342 46.370508-247.447775a478.47757 478.47757 0 0 1-58.31433-36.934405zM92.051999 535.189712a420.779662 420.779662 0 0 0 122.614581 274.319464l10.316162 10.293237a425.318773 425.318773 0 0 1 58.318151-37.413278c-26.841123-71.096182-43.666655-155.742195-46.370508-247.19815H92.051999z m169.286933 314.488813a415.88267 415.88267 0 0 0 85.732395 49.383847 360.53328 360.53328 0 0 1-33.652337-51.562976c-4.075521-7.313012-8.137031-15.176219-11.667451-22.788528a416.635367 416.635367 0 0 0-40.412607 24.962563z m273.441954 82.465611a371.780443 371.780443 0 0 0 46.646879-5.40898c33.402711-20.335574 64.02388-55.620666 89.013189-101.223194 3.504948-6.787015 7.586836-13.823656 10.541589-20.887042a133.885943 133.885943 0 0 0-17.076431-6.511918 405.259571 405.259571 0 0 0-129.120132-26.594045v160.625179z m142.169439-33.081764a416.339892 416.339892 0 0 0 85.71329-49.383847 390.678122 390.678122 0 0 0-40.137509-24.962563c-4.075521 7.612308-8.137031 15.475516-11.942548 22.788528-10.592533 18.706639-21.684316 36.362558-33.623045 51.562976z m121.789288-79.259959l10.591259-10.293237a420.780936 420.780936 0 0 0 122.614582-274.319464H787.101455c-2.729325 91.455954-19.530658 176.101968-46.672351 247.198149a395.620965 395.620965 0 0 1 58.315604 37.414552z m-99.82478-558.105599a203.624467 203.624467 0 0 1-19.004662 7.33721 460.617875 460.617875 0 0 1-145.124191 29.826442v190.500018h206.195866c-2.452954-84.393841-17.375727-162.553409-42.064466-227.66367z m-209.69954 37.163652a456.062207 456.062207 0 0 1-144.873292-29.826442 187.929892 187.929892 0 0 1-19.530658-7.33721c-24.412368 65.110261-39.608965 143.269829-42.064466 227.66367H489.215293V298.860466z m0 426.554165v-190.224919H282.746877c2.454228 84.144215 17.652098 161.977742 42.064466 227.388572 6.510644-2.428756 13.020014-5.158081 19.530658-7.33721 45.019218-17.354076 93.864332-27.396413 144.873292-29.826443z m45.570687 0a465.365857 465.365857 0 0 1 144.874566 29.826443c6.50937 2.17913 12.743643 4.908455 19.254287 7.33721 24.688739-65.410831 39.608965-143.244357 42.064466-227.388572H534.78598v190.224919z"
												fill="#3B3F51"
												p-id="6176"
											></path>
										</svg>
										<span class="dark:text-gray-300">{{ tenant.tenantDomain }}</span>
									</div>
									<div class="flex items-center">
										<el-button
											class="!p-0"
											icon="User"
											v-auth="'sys_systenant_del'"
											@click="userListRef.openDrawer(tenant.id)"
											text
											type="primary"
											>{{ $t('tenant.userListBtn') }}
										</el-button>
										<el-button
											class="!p-0"
											icon="HomeFilled"
											@click="individuationRef.openDialog(tenant.id)"
											text
											type="primary"
											v-auth="'sys_systenant_edit'"
											>{{ $t('tenant.individuationBtn') }}
										</el-button>
										<el-button
											class="!p-0"
											icon="edit-pen"
											@click="formDialogRef.openDialog(tenant.id)"
											text
											type="primary"
											v-auth="'sys_systenant_edit'"
											>{{ $t('common.editBtn') }}
										</el-button>
										<el-button
											class="!p-0"
											icon="delete"
											:disabled="tenant.id === '1'"
											@click="handleDelete([tenant.id])"
											text
											type="primary"
											v-auth="'sys_systenant_del'"
											>{{ $t('common.delBtn') }}
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />

		<!-- 个性化设置  -->
		<individuation ref="individuationRef" />

		<!-- 用户列表抽屉 -->
		<user-list ref="userListRef" />

		<!-- 导入excel -->
		<upload-excel
			:title="$t('tenant.importTenantTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/tenant.xlsx"
			url="/admin/tenant/import"
		/>
	</div>
</template>

<script lang="ts" name="systemTenant" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchPage, fetchList } from '/@/api/admin/tenant';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const Individuation = defineAsyncComponent(() => import('./individuation.vue'));
const UserList = defineAsyncComponent(() => import('./userList.vue'));
const { t } = useI18n();

// 定义变量内容
const formDialogRef = ref();
const individuationRef = ref();
const userListRef = ref();
const excelUploadRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 字典
const { status_type } = useDict('status_type');

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchPage,
	pagination: {
		size: 6,
		pageSizes: [3, 6, 9, 12],
	},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile } = useTable(state);

/**
 * 重置搜索条件并刷新列表
 */
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

/**
 * 导出租户数据为 Excel 文件
 */
const exportExcel = () => {
	downBlobFile('/admin/tenant/export', { ...state.queryForm, ids: selectObjs.value }, 'tenant.xlsx');
};

/**
 * 删除租户操作
 * @param {string[]} ids - 要删除的租户 ID 数组
 */
const handleDelete = async (ids: string[]) => {
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
	} finally {
		handleRefreshCache();
	}
};

/**
 * 刷新租户缓存
 */
const handleRefreshCache = async () => {
	try {
		await fetchList();
		useMessage().success(t('tenant.syncCacheSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.syncCacheFailed'));
	}
};
</script>
