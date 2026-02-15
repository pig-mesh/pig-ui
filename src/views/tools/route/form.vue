<template>
	<el-drawer :title="$t('route.routeConfig', '路由配置')" size="40%" v-model="visible">
		<el-tabs v-model="activeName">
			<el-tab-pane name="first">
				<template #label>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
						/>
					</svg>
					{{ $t('route.basicMode', '基础模式') }}
				</template>
				<el-form :model="formData" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
					<el-form-item :label="$t('route.routeId', '路由ID')" prop="routeId">
						<el-input clearable v-model="formData.routeId"></el-input>
					</el-form-item>
					<el-form-item :label="$t('route.routeName', '路由名称')" prop="routeName">
						<el-input clearable v-model="formData.routeName"></el-input>
					</el-form-item>
					<el-form-item :label="$t('route.path', '路由前缀')" prop="path">
						<template #label>
							{{ $t('route.path', '路由前缀') }}
							<tip :content="$t('route.pathTip', '访问微服务的公共前缀')" />
						</template>
						<el-input clearable v-model="formData.path">
							<template #prepend>/</template>
						</el-input>
					</el-form-item>
					<el-form-item :label="$t('route.serviceName', '目标服务')" prop="serviceName">
						<template #label>
							{{ $t('route.serviceName', '目标服务') }}
							<tip :content="$t('route.serviceNameTip', '注册到注册中心对应的服务名称')" />
						</template>
						<el-input clearable v-model="formData.serviceName"></el-input>
					</el-form-item>
					<el-collapse v-model="collapseActive">
						<el-collapse-item name="1">
							<template #title>
								<el-icon class="header-icon">
									<info-filled />
								</el-icon>
								{{ $t('route.advancedProperties', '高级属性') }}
							</template>
							<el-form-item :label="$t('route.cors', '允许跨域')" prop="cors">
								<el-switch v-model="formData.cors" :active-value="true" :inactive-value="false"></el-switch>
							</el-form-item>
							<el-form-item :label="$t('route.timeout', '超时时间')" prop="timeout">
								<el-input type="number" clearable v-model="formData.timeout">
									<template #suffix>{{ $t('route.timeoutUnit', '毫秒') }}</template>
								</el-input>
							</el-form-item>
							<el-form-item :label="$t('route.replenishRate', 'IP限制')" prop="replenishRate">
								<template #label>
									{{ $t('route.replenishRate', 'IP限制') }}
									<tip :content="$t('route.replenishRateTip', '每个IP每秒最大请求多少次')" />
								</template>
								<el-input type="number" clearable v-model="formData.replenishRate">
									<template #suffix>{{ $t('route.replenishRateUnit', '次/秒') }}</template>
								</el-input>
							</el-form-item>
							<el-form-item :label="$t('route.burstCapacity', '总数限制')" prop="burstCapacity">
								<template #label>
									{{ $t('route.burstCapacity', '总数限制') }}
									<tip :content="$t('route.burstCapacityTip', '当前服务器每秒最大的请求数量')" />
								</template>
								<el-input type="number" :min="1000" clearable v-model="formData.burstCapacity">
									<template #suffix>{{ $t('route.burstCapacityUnit', '次/秒') }}</template>
								</el-input>
							</el-form-item>
							<el-form-item :label="$t('route.sortOrder', '优先级')" prop="sortOrder">
								<el-input type="number" clearable v-model="formData.sortOrder"></el-input>
							</el-form-item>
						</el-collapse-item>
					</el-collapse>
				</el-form>
			</el-tab-pane>
			<el-tab-pane name="second">
				<template #label>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
						/>
					</svg>
					{{ $t('route.codeMode', '编码模式') }}
				</template>
				<json-editor ref="jsonEditorRef" v-model="jsonData" codec @change="handleJsonChange" />
			</el-tab-pane>
		</el-tabs>
		<div class="flex items-center justify-center mt-4">
			<el-button type="primary" @click="handleSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
		</div>
	</el-drawer>
</template>

<script lang="ts" name="routeForm" setup>
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue';

import { watchDeep } from '@vueuse/core';

import { addObj, fetchList, validateExist } from '/@/api/admin/route';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);
const { t } = useI18n();

const activeName = ref('first');
const visible = ref(false);
const loading = ref(false);
const jsonData = ref({});
const dataFormRef = ref();
const collapseActive = ref('1');

const formData = ref({
	routeId: '',
	routeName: '',
	path: '',
	sortOrder: 0,
	serviceName: '',
	timeout: 30000,
	burstCapacity: 100000,
	replenishRate: 10000,
	cors: false,
});

const demoData = reactive({
	routeId: new Date().getTime(),
	routeName: '路由名称',
	predicates: [{ args: { _genkey_0: '/路由前缀/**' }, name: 'Path' }],
	filters: [],
	uri: 'lb://服务名称',
	sortOrder: 0,
	metadata: {},
});

const selectRouteId = ref();

const dataRules = ref({
	routeId: [
		{ required: true, message: t('route.routeIdRequired', '路由标识不能为空'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, selectRouteId.value);
			},
			trigger: 'blur',
		},
		{ min: 3, max: 64, message: t('route.routeIdLength', '长度在 3 到 64 个字符'), trigger: 'blur' },
	],
	routeName: [
		{ required: true, message: t('route.routeNameRequired', '路由名称不能为空'), trigger: 'blur' },
		{ min: 3, max: 64, message: t('route.routeNameLength', '长度在 3 到 64 个字符'), trigger: 'blur' },
	],
	path: [
		{ required: true, message: t('route.pathRequired', '路由前缀不能为空'), trigger: 'blur' },
		{ validator: rule.validatorLower, trigger: 'blur' },
		{ min: 3, max: 64, message: t('route.pathLength', '长度在 3 到 64 个字符'), trigger: 'blur' },
	],
	serviceName: [
		{ required: true, message: t('route.serviceNameRequired', '目标服务不能为空'), trigger: 'blur' },
		{ min: 3, max: 64, message: t('route.serviceNameLength', '长度在 3 到 64 个字符'), trigger: 'blur' },
	],
	sortOrder: [{ required: true, message: t('route.sortOrderRequired', '排序值不能为空'), trigger: 'blur' }],
});

/**
 * 监听表单数据变化并同步更新 JSON 数据
 */
watchDeep(formData, (val) => {
		jsonData.value = {
			routeId: val.routeId,
			routeName: val.routeName,
			sortOrder: val.sortOrder,
			predicates: [{ args: { _genkey_0: `/${val.path}/**` }, name: 'Path' }],
			uri: `lb://${val.serviceName}`,
			metadata: {
				'response-timeout': val.timeout,
				...(val.cors
					? {
							cors: {
								allowedOrigins: '*',
								allowedMethods: '*',
								allowedHeaders: '*',
								allowedCredentials: true,
							},
					  }
					: {}),
			},
			filters: [
				{
					name: 'RequestRateLimiter',
					args: {
						'redis-rate-limiter.replenishRate': val.replenishRate,
						'redis-rate-limiter.burstCapacity': val.burstCapacity,
						'key-resolver': '#{@remoteAddrKeyResolver}',
					},
				},
			],
		};
});

/**
 * 将 JSON 数据同步到表单数据
 */
const handleJsonChange = (val: any) => {
	formData.value.routeId = val.routeId;
	formData.value.routeName = val.routeName;
	formData.value.sortOrder = val.sortOrder;

	// 提取 predicates 中 Path 类型的路由前缀
	val.predicates?.forEach((item: any) => {
		if (item.name === 'Path') {
			// 提取路径并移除前后缀
			formData.value.path = item.args._genkey_0.replace('/**', '').replace('/', '');
		}
	});

	// 提取服务名称
	formData.value.serviceName = val.uri.replace('lb://', '');

	// 提取 filters 中的限流配置
	val.filters?.forEach((item: any) => {
		if (item.name === 'RequestRateLimiter') {
			formData.value.replenishRate = item.args['redis-rate-limiter.replenishRate'];
			formData.value.burstCapacity = item.args['redis-rate-limiter.burstCapacity'];
		}
	});

	// 提取 metadata 中的超时配置
	formData.value.timeout = val.metadata?.['response-timeout'] || 30000;

	// 提取 metadata 中的跨域配置
	formData.value.cors = !!val.metadata?.['cors'];

	jsonData.value = val;
};

const validateJsonData = (data: any): boolean => {
	// 校验 predicates 字段
	if (!data.predicates || !Array.isArray(data.predicates) || data.predicates.length === 0) {
		useMessage().error(t('route.predicatesInvalid', '路由前缀配置不合法'));
		return false;
	}

	// 检查是否存在 Path 规则
	const pathPredicate = data.predicates.find((p: any) => p.name === 'Path');
	if (!pathPredicate) {
		useMessage().error(t('route.pathRuleRequired', '路由配置中必须包含 Path 规则'));
		return false;
	}

	// 校验服务 URI 格式
	if (!data.uri || typeof data.uri !== 'string' || !data.uri.startsWith('lb://')) {
		useMessage().error(t('route.uriInvalid', '目标服务不合法'));
		return false;
	}

	// 校验限流配置
	if (data.filters && Array.isArray(data.filters)) {
		const rateLimiter = data.filters.find((f: any) => f.name === 'RequestRateLimiter');
		if (rateLimiter && rateLimiter.args?.['redis-rate-limiter.burstCapacity'] < 1000) {
			useMessage().error(t('route.burstCapacityMin', '总数限制不能小于1000'));
			return false;
		}
	}

	return true;
};

const handleSubmit = async () => {
	loading.value = true;

	try {
		const valid = await dataFormRef.value?.validate().catch(() => false);
		if (!valid) return;

		if (!validateJsonData(jsonData.value)) return;

		await addObj(jsonData.value);
		useMessage().success(t('common.optSuccessText'));
		visible.value = false;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
		emit('refresh');
	}
};

const getRouteData = async (id: string) => {
	try {
		const { data } = await fetchList({ routeId: id });
		const [result] = data;

		// 解析 JSON 字符串字段
		if (result.predicates) {
			result.predicates = JSON.parse(result.predicates);
		}

		if (result.filters) {
			result.filters = JSON.parse(result.filters);
		}

		if (result.metadata) {
			result.metadata = JSON.parse(result.metadata);
		}

		return result;
	} catch {
		throw new Error('Fetch route data failed');
	}
};

const openDialog = async (id?: string) => {
	selectRouteId.value = id;
	visible.value = true;

	// 重置表单
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		// 编辑模式: 加载现有数据
		try {
			const data = await getRouteData(id);
			jsonData.value = data;
			handleJsonChange(data);
		} catch {
			// 加载路由数据失败时静默处理
		}
	} else {
		// 新增模式: 使用演示数据
		jsonData.value = demoData;
	}
};

defineExpose({
	openDialog,
});
</script>
