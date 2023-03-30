<template>
	<div>
		<el-select v-model="tenant" style="width: 100%" placeholder="点击请选择租户" @change="handleCommand">
			<el-option v-for="tenant in tenantList" :key="tenant.id" :label="tenant.name" :value="tenant.id"></el-option>
		</el-select>
	</div>
</template>

<script setup lang="ts" name="tenant">
import { fetchList } from '/@/api/admin/tenant';
import { Local, Session } from '/@/utils/storage';

/**
 * 租户列表的 Ref 对象。
 */
const tenantList = ref([]);

/**
 * 当前租户的 Ref 对象。
 */
const tenant = ref();

/**
 * 页面加载后自动执行的函数，用于获取租户列表并自动填充当前租户。
 */
onMounted(async () => {
	await getTenantList(); // 获取租户列表
	tenant.value = Local.get('tenantId'); // 从本地存储读取当前租户信息
	handleAutoTenant(); // 自动根据域名匹配租户信息
});

/**
 * 获取租户列表的函数。
 * @returns Promise。
 */
const getTenantList = () => {
	return fetchList().then((response) => {
		// 从后端接口获取租户列表
		tenantList.value = response.data;
	});
};

/**
 * 自动匹配租户的函数。
 */
const handleAutoTenant = () => {
	let domain = window.location.host; // 获取当前页面所在的域名
	tenantList.value.forEach((tenant: any) => {
		// 遍历租户列表
		if (domain.indexOf(tenant.tenantDomain) >= 0) {
			// 如果域名匹配当前租户，则自动填充租户信息
			handleCommand(tenant.id);
		}
	});
};

/**
 * 写入租户信息到本地存储的函数，方便 axios 每次请求获取 tab 范围内的租户ID。
 * @param command - 需要存储的租户ID。
 */
const handleCommand = (command: string) => {
	Session.set('tenantId', command); // 写入到 session 存储
	Local.set('tenantId', command); // 写入到 local 存储
};
</script>
