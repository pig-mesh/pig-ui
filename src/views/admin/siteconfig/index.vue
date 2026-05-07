<script setup lang="ts" name="siteconfig">
import { watchIgnorable } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSiteConfig, refreshSiteConfig, updateSiteConfig } from '/@/api/admin/system';
import { getObj, putObj as putClientObj } from '/@/api/admin/client';
import { getObjDetails, getValue, putObj } from '/@/api/admin/param';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { CaptchaType, PasswordRule } from '/@/stores/siteConfig';
import { getPasswordRuleOptions } from '/@/utils/passwordRule';

type SectionId = 'brand' | 'login' | 'security' | 'appearance' | 'integration' | 'maintenance';

type SiteConfigForm = {
	clarityId: string;
	captchaType: CaptchaType | string;
	passwordRule: PasswordRule | string;
	forceResetPwd: boolean;
	passwordExpireDays: number;
	loginFailureLock: boolean;
	loginErrorTimes: number;
	smsLoginEnable: boolean;
	socialLoginEnable: boolean;
	registerEnable: boolean;
	resetPassword: boolean;
	i18nEnable: boolean;
	darkModeEnable: boolean;
	antiDebugEnable: boolean;
	antiDebugKey: string;
	syncDingtalkEnabled: boolean;
	syncWechatEnabled: boolean;
	title: string;
	footer: string;
	privacyTip: string;
	logo: string;
};

type SectionMeta = {
	id: SectionId;
	icon: string;
	title: string;
	desc: string;
	tone: 'blue' | 'green' | 'amber' | 'purple' | 'slate' | 'red';
	rows: string[];
	showBadge?: boolean;
};

type SettingRowMeta = {
	key: string;
	section: SectionId;
	label: string;
	desc: string;
	keywords: string[];
};

type Snapshot = Record<string, string | number | boolean>;

const { t } = useI18n();
const message = useMessage();
const messageBox = useMessageBox();

// 从环境变量解析密码登录终端 ID，格式为 clientId:secret
const defaultClientId = (import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT as string)?.split(':')?.[0] ?? '';

const loading = ref(true);
const saving = ref(false);
const refreshing = ref(false);
const searchKeyword = ref('');
const activeSection = ref<SectionId>('brand');
const scrollContainerRef = ref<HTMLElement>();
const observer = shallowRef<IntersectionObserver>();
const sectionRefs = new Map<SectionId, HTMLElement>();
const savedSnapshot = shallowRef<Snapshot>({});
const passwordRuleOptions = computed(() => getPasswordRuleOptions(t));

const form = reactive<SiteConfigForm>({
	clarityId: '',
	captchaType: CaptchaType.ClickWord,
	passwordRule: PasswordRule.LetterNumber,
	forceResetPwd: false,
	passwordExpireDays: 90,
	loginFailureLock: true,
	loginErrorTimes: 5,
	smsLoginEnable: true,
	socialLoginEnable: true,
	registerEnable: true,
	resetPassword: true,
	i18nEnable: true,
	darkModeEnable: true,
	antiDebugEnable: false,
	antiDebugKey: 'pig',
	syncDingtalkEnabled: false,
	syncWechatEnabled: false,
	title: '',
	footer: '',
	privacyTip: '',
	logo: '',
});

const captchaOptions = computed(() => [
	{ label: t('siteconfig.clickWord'), value: CaptchaType.ClickWord },
	{ label: t('siteconfig.blockPuzzle'), value: CaptchaType.BlockPuzzle },
	{ label: t('siteconfig.math'), value: CaptchaType.Math },
	{ label: t('siteconfig.captchaOff'), value: CaptchaType.None },
]);

const sections = computed<SectionMeta[]>(() => [
	{
		id: 'brand',
		icon: 'Star',
		title: t('siteconfig.brandSection'),
		desc: t('siteconfig.brandSectionDesc'),
		tone: 'blue',
		rows: ['logo', 'title', 'footer', 'privacyTip'],
	},
	{
		id: 'login',
		icon: 'Key',
		title: t('siteconfig.loginSection'),
		desc: t('siteconfig.loginSectionDesc'),
		tone: 'green',
		rows: ['accountPassword', 'smsLogin', 'socialLogin', 'register', 'resetPassword'],
	},
	{
		id: 'security',
		icon: 'Lock',
		title: t('siteconfig.securitySection'),
		desc: t('siteconfig.securitySectionDesc'),
		tone: 'amber',
		rows: ['captchaMode', 'passwordRule', 'forceResetPwd', 'loginFailureLock', 'antiDebugEnable'],
	},
	{
		id: 'appearance',
		icon: 'Brush',
		title: t('siteconfig.appearanceSection'),
		desc: t('siteconfig.appearanceSectionDesc'),
		tone: 'purple',
		rows: ['i18nSwitch', 'darkMode'],
	},
	{
		id: 'integration',
		icon: 'Connection',
		title: t('siteconfig.integrationSection'),
		desc: t('siteconfig.integrationSectionDesc'),
		tone: 'slate',
		rows: ['syncDingtalk', 'syncWechat', 'clarityId'],
	},
	{
		id: 'maintenance',
		icon: 'Refresh',
		title: t('siteconfig.maintenanceSection'),
		desc: t('siteconfig.maintenanceSectionDesc'),
		tone: 'red',
		rows: ['clearCache'],
		showBadge: false,
	},
]);

const settingRows = computed<SettingRowMeta[]>(() => [
	{
		key: 'logo',
		section: 'brand',
		label: 'Logo',
		desc: t('siteconfig.logoDesc'),
		keywords: ['logo', 'brand', 'upload', '品牌', '展示', '上传'],
	},
	{
		key: 'title',
		section: 'brand',
		label: t('siteconfig.siteTitle'),
		desc: t('siteconfig.siteTitleDesc'),
		keywords: ['title', 'site', 'website', '网站', '标题', '浏览器'],
	},
	{
		key: 'footer',
		section: 'brand',
		label: t('siteconfig.footer'),
		desc: t('siteconfig.footerDesc'),
		keywords: ['footer', 'icp', 'copyright', '备案', '版权', '页脚'],
	},
	{
		key: 'privacyTip',
		section: 'brand',
		label: t('siteconfig.privacyTip'),
		desc: t('siteconfig.privacyTipDesc'),
		keywords: ['privacy', 'agreement', '隐私', '协议', '提示'],
	},
	{
		key: 'accountPassword',
		section: 'login',
		label: t('siteconfig.accountPassword'),
		desc: t('siteconfig.accountPasswordDesc'),
		keywords: ['account', 'password', 'login', '账号', '密码', '登录'],
	},
	{
		key: 'smsLogin',
		section: 'login',
		label: t('siteconfig.smsLogin'),
		desc: t('siteconfig.smsLoginDesc'),
		keywords: ['sms', 'mobile', 'code', '短信', '验证码', '手机号', '登录'],
	},
	{
		key: 'socialLogin',
		section: 'login',
		label: t('siteconfig.socialLogin'),
		desc: t('siteconfig.socialLoginDesc'),
		keywords: ['social', 'login', 'third', '社交', '第三方', '登录'],
	},
	{
		key: 'register',
		section: 'login',
		label: t('siteconfig.register'),
		desc: t('siteconfig.registerDesc'),
		keywords: ['register', 'signup', '注册', '开户'],
	},
	{
		key: 'resetPassword',
		section: 'login',
		label: t('siteconfig.resetPassword'),
		desc: t('siteconfig.resetPasswordDesc'),
		keywords: ['reset', 'forgot', 'password', '找回', '重置', '密码'],
	},
	{
		key: 'captchaMode',
		section: 'security',
		label: t('siteconfig.captchaMode'),
		desc: t('siteconfig.captchaModeDesc'),
		keywords: ['captcha', 'code', '验证码', '滑块', '拼图', '数学题'],
	},
	{
		key: 'passwordRule',
		section: 'security',
		label: t('siteconfig.passwordRule'),
		desc: t('siteconfig.passwordRuleDesc'),
		keywords: ['password', 'rule', 'strength', '密码', '强度', '规则'],
	},
	{
		key: 'forceResetPwd',
		section: 'security',
		label: t('siteconfig.forceResetPwd'),
		desc: t('siteconfig.forceResetPwdDesc'),
		keywords: ['force', 'reset', 'expire', '强制', '重置', '过期', '天'],
	},
	{
		key: 'loginFailureLock',
		section: 'security',
		label: t('siteconfig.loginFailureLock'),
		desc: t('siteconfig.loginFailureLockDesc'),
		keywords: ['lock', 'failure', 'login', '失败', '锁定', '次数'],
	},
	{
		key: 'antiDebugEnable',
		section: 'security',
		label: t('siteconfig.antiDebugEnable'),
		desc: t('siteconfig.antiDebugEnableDesc'),
		keywords: ['debug', 'devtools', '反调试', '开发者工具', 'ddtk'],
	},
	{
		key: 'i18nSwitch',
		section: 'appearance',
		label: t('siteconfig.i18nSwitch'),
		desc: t('siteconfig.i18nSwitchDesc'),
		keywords: ['i18n', 'language', 'locale', '国际化', '语言', '多语言'],
	},
	{
		key: 'darkMode',
		section: 'appearance',
		label: t('siteconfig.darkMode'),
		desc: t('siteconfig.darkModeDesc'),
		keywords: ['dark', 'theme', 'mode', '亮暗', '主题', '外观'],
	},
	{
		key: 'syncDingtalk',
		section: 'integration',
		label: t('siteconfig.syncDingtalk'),
		desc: t('siteconfig.syncDingtalkDesc'),
		keywords: ['dingtalk', 'dingding', 'sync', '钉钉', '导入', '同步'],
	},
	{
		key: 'syncWechat',
		section: 'integration',
		label: t('siteconfig.syncWechat'),
		desc: t('siteconfig.syncWechatDesc'),
		keywords: ['wecom', 'wechat', 'sync', '企业微信', '通讯录', '同步'],
	},
	{
		key: 'clarityId',
		section: 'integration',
		label: 'Microsoft Clarity',
		desc: t('siteconfig.analyticsDesc'),
		keywords: ['clarity', 'microsoft', 'analytics', '统计', '分析', '埋点'],
	},
	{
		key: 'clearCache',
		section: 'maintenance',
		label: t('siteconfig.clearCache'),
		desc: t('siteconfig.clearCacheDesc'),
		keywords: ['cache', 'redis', 'refresh', '缓存', '清除', '清空', '刷新'],
	},
]);

const rowSearchMap = computed<Record<string, string>>(() => {
	return settingRows.value.reduce<Record<string, string>>((map, row) => {
		map[row.key] = [row.label, row.desc, ...row.keywords].join(' ').toLowerCase();
		return map;
	}, {});
});

const normalizedKeyword = computed(() => searchKeyword.value.trim().toLowerCase());

const isRowVisible = (key: string) => {
	const keyword = normalizedKeyword.value;
	if (!keyword) return true;
	return rowSearchMap.value[key]?.includes(keyword) ?? false;
};

const visibleSections = computed(() => sections.value.filter((section) => section.rows.some((rowKey) => isRowVisible(rowKey))));

const isSectionVisible = (id: SectionId) => visibleSections.value.some((section) => section.id === id);

const rowMeta = (key: string) => settingRows.value.find((row) => row.key === key);

const buildSnapshot = (): Snapshot => ({
	clarityId: form.clarityId,
	captchaType: form.captchaType,
	passwordRule: form.passwordRule,
	forceResetPwd: form.forceResetPwd,
	passwordExpireDays: form.passwordExpireDays,
	loginFailureLock: form.loginFailureLock,
	loginErrorTimes: form.loginErrorTimes,
	smsLoginEnable: form.smsLoginEnable,
	socialLoginEnable: form.socialLoginEnable,
	registerEnable: form.registerEnable,
	resetPassword: form.resetPassword,
	i18nEnable: form.i18nEnable,
	darkModeEnable: form.darkModeEnable,
	antiDebugEnable: form.antiDebugEnable,
	antiDebugKey: form.antiDebugKey,
	syncDingtalkEnabled: form.syncDingtalkEnabled,
	syncWechatEnabled: form.syncWechatEnabled,
	title: form.title,
	footer: form.footer,
	privacyTip: form.privacyTip,
	logo: form.logo,
});

const changedKeys = computed(() => {
	const current = buildSnapshot();
	const snapshot = savedSnapshot.value;
	if (!Object.keys(snapshot).length) return [];
	return Object.keys(current).filter((key) => current[key] !== snapshot[key]);
});

const changedCount = computed(() => changedKeys.value.length);
const hasChanges = computed(() => changedCount.value > 0);

const sectionCount = (id: SectionId) => {
	if (id === 'brand') return [form.logo, form.title, form.footer, form.privacyTip].filter(Boolean).length;
	if (id === 'login') {
		return [true, form.smsLoginEnable, form.socialLoginEnable, form.registerEnable, form.resetPassword].filter(Boolean).length;
	}
	if (id === 'security') {
		return [form.captchaType !== CaptchaType.None, form.forceResetPwd, form.loginFailureLock, form.antiDebugEnable].filter(Boolean).length;
	}
	if (id === 'appearance') return [form.i18nEnable, form.darkModeEnable].filter(Boolean).length;
	if (id === 'integration') return [form.syncDingtalkEnabled, form.syncWechatEnabled, form.clarityId].filter(Boolean).length;
	return 0;
};

const sectionToneClass = (tone: SectionMeta['tone']) => {
	const classMap = {
		blue: 'bg-blue-50 text-blue-600 border-blue-100',
		green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
		amber: 'bg-amber-50 text-amber-600 border-amber-100',
		purple: 'bg-violet-50 text-violet-600 border-violet-100',
		slate: 'bg-slate-100 text-slate-600 border-slate-200',
		red: 'bg-red-50 text-red-600 border-red-100',
	};
	return classMap[tone];
};

const setSectionRef = (id: SectionId, el: Element | ComponentPublicInstance | null) => {
	if (el instanceof HTMLElement) {
		sectionRefs.set(id, el);
		return;
	}
	sectionRefs.delete(id);
};

const setupObserver = async () => {
	await nextTick();
	observer.value?.disconnect();
	if (!scrollContainerRef.value) return;

	observer.value = new IntersectionObserver(
		(entries) => {
			const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
			const id = visibleEntry?.target.getAttribute('data-section-id') as SectionId | null;
			if (id && isSectionVisible(id)) activeSection.value = id;
		},
		{
			root: scrollContainerRef.value,
			rootMargin: '-18% 0px -68% 0px',
			threshold: [0, 0.25, 0.5, 1],
		}
	);

	visibleSections.value.forEach((section) => {
		const el = sectionRefs.get(section.id);
		if (el) observer.value?.observe(el);
	});
};

const scrollToSection = async (id: SectionId) => {
	await nextTick();
	const el = sectionRefs.get(id);
	if (!el) return;
	activeSection.value = id;
	el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const resetSearch = () => {
	searchKeyword.value = '';
};

// ignoreUpdates 包裹的赋值不会触发对应的 watcher，用于回滚和初始加载时抑制同步副作用
const { ignoreUpdates: ignoreCaptchaType } = watchIgnorable(
	() => form.captchaType,
	async (nv, ov) => {
		try {
			const { data } = await getObj(defaultClientId);
			if (!data) {
				ignoreCaptchaType(() => {
					form.captchaType = ov;
				});
				message.error(t('siteconfig.clientNotFound'));
				return;
			}
			await putClientObj({ ...data, captchaFlag: nv === CaptchaType.None ? '0' : '1' });
			message.success(t('siteconfig.captchaSynced'));
		} catch (err: any) {
			ignoreCaptchaType(() => {
				form.captchaType = ov;
			});
			message.error(err?.msg || t('siteconfig.syncFailed'));
		}
	}
);

const loadConfig = async () => {
	loading.value = true;
	try {
		const [{ data: siteData }, { data: expireDays }, { data: loginErrorTimes }] = await Promise.all([
			getSiteConfig(),
			getValue('PASSWORD_EXPIRE_DAYS'),
			getValue('LOGIN_ERROR_TIMES'),
		]);
		// 初始加载时抑制 captchaType watcher，避免触发客户端同步副作用
		ignoreCaptchaType(() => Object.assign(form, siteData));
		form.passwordExpireDays = parseInt(expireDays) || 90;
		const parsedLoginErrorTimes = parseInt(loginErrorTimes);
		form.loginFailureLock = parsedLoginErrorTimes > 0;
		form.loginErrorTimes = parsedLoginErrorTimes > 0 ? parsedLoginErrorTimes : 5;
		savedSnapshot.value = buildSnapshot();
		await setupObserver();
	} finally {
		loading.value = false;
	}
};

const handleRefresh = async () => {
	try {
		await messageBox.confirm(t('siteconfig.clearCacheConfirm'));
	} catch {
		return;
	}

	refreshing.value = true;
	try {
		await refreshSiteConfig();
		await loadConfig();
		message.success(t('siteconfig.refreshSuccess'));
	} catch (err: any) {
		message.error(err?.msg || t('siteconfig.refreshFailed'));
	} finally {
		refreshing.value = false;
	}
};

const handleSave = async () => {
	saving.value = true;
	try {
		const { forceResetPwd, passwordExpireDays, loginFailureLock, loginErrorTimes, ...siteConfig } = form;
		await updateSiteConfig({ ...siteConfig, forceResetPwd });

		if (forceResetPwd) {
			const { data: param } = await getObjDetails({ publicKey: 'PASSWORD_EXPIRE_DAYS' });
			await putObj({ ...param, publicValue: String(passwordExpireDays) });
		}

		const { data: loginErrorTimesParam } = await getObjDetails({ publicKey: 'LOGIN_ERROR_TIMES' });
		await putObj({ ...loginErrorTimesParam, publicValue: loginFailureLock ? String(loginErrorTimes) : '0' });

		savedSnapshot.value = buildSnapshot();
		message.success(t('siteconfig.saveSuccess'));
	} catch (err: any) {
		message.error(err?.msg || t('siteconfig.saveFailed'));
	} finally {
		saving.value = false;
	}
};

watch(normalizedKeyword, async () => {
	await setupObserver();
	const firstVisible = visibleSections.value[0]?.id;
	if (firstVisible) activeSection.value = firstVisible;
});

onMounted(async () => {
	await loadConfig();
});

onUnmounted(() => {
	observer.value?.disconnect();
});
</script>

<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view !p-0 overflow-hidden">
			<div class="flex h-full min-h-0 bg-base-200">
				<aside class="hidden w-[232px] shrink-0 border-r border-base-300 bg-base-100/90 px-4 py-6 lg:block">
					<div class="sticky top-6">
						<div class="mb-4 px-1 text-xs font-semibold text-base-content/40">{{ $t('siteconfig.pageSections') }}</div>
						<nav class="space-y-1.5">
							<button
								v-for="section in sections"
								:key="section.id"
								type="button"
								class="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition-colors"
								:class="
									activeSection === section.id
										? 'bg-[var(--el-color-primary-light-9)] text-[var(--el-color-primary)]'
										: 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
								"
								@click="scrollToSection(section.id)"
							>
								<component :is="section.icon" class="h-4 w-4 shrink-0" />
								<span class="min-w-0 flex-1 truncate">{{ section.title }}</span>
								<span
									v-if="section.showBadge !== false"
									class="rounded-full bg-[var(--el-color-primary-light-9)] px-2 py-0.5 text-xs font-semibold text-[var(--el-color-primary)]"
								>
									{{ sectionCount(section.id) }}
								</span>
							</button>
						</nav>

						<div class="mt-8 px-1 text-xs font-semibold text-base-content/40">{{ $t('siteconfig.quickActions') }}</div>
						<div class="mt-2 space-y-1.5">
							<button
								type="button"
								class="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-base-content/75 transition-colors hover:bg-base-200 hover:text-base-content"
								:disabled="refreshing"
								@click="handleRefresh"
							>
								<Refresh class="h-4 w-4" />
								<span>{{ $t('siteconfig.clearCache') }}</span>
							</button>
						</div>
					</div>
				</aside>

				<main ref="scrollContainerRef" v-loading="loading" class="min-w-0 flex-1 overflow-y-auto">
					<div class="mx-auto flex max-w-[1180px] flex-col gap-5 px-5 py-6 lg:px-8">
						<header>
							<h1 class="text-2xl font-bold leading-8 text-base-content">{{ $t('siteconfig.pageTitle') }}</h1>
							<p class="mt-1 text-sm leading-6 text-base-content/55">{{ $t('siteconfig.pageDesc') }}</p>
						</header>

						<div
							class="rounded-xl border border-[var(--el-color-primary-light-7)] bg-base-100 p-1 shadow-[0_0_0_4px_var(--el-color-primary-light-9)]"
						>
							<el-input v-model="searchKeyword" :placeholder="t('siteconfig.searchPlaceholder')" clearable size="large">
								<template #prefix>
									<Search class="h-4 w-4 text-base-content/40" />
								</template>
								<template #suffix>
									<span class="hidden rounded-md border border-base-300 px-2 py-0.5 text-xs text-base-content/40 sm:inline">⌘ K</span>
								</template>
							</el-input>
						</div>

						<el-empty
							v-if="!visibleSections.length"
							class="rounded-xl border border-dashed border-base-300 bg-base-100"
							:description="t('siteconfig.noSearchResult')"
						>
							<el-button @click="resetSearch">{{ $t('siteconfig.clearSearch') }}</el-button>
						</el-empty>

						<section
							v-for="section in visibleSections"
							:key="section.id"
							:ref="(el) => setSectionRef(section.id, el)"
							:data-section-id="section.id"
							class="scroll-mt-5 overflow-hidden rounded-xl border bg-base-100 shadow-sm"
							:class="section.id === 'maintenance' ? 'border-red-200' : 'border-base-300'"
						>
							<div
								class="flex items-center justify-between gap-4 border-b px-6 py-5"
								:class="section.id === 'maintenance' ? 'border-red-100 bg-red-50/40' : 'border-base-300'"
							>
								<div class="flex min-w-0 items-center gap-4">
									<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border" :class="sectionToneClass(section.tone)">
										<component :is="section.icon" class="h-5 w-5" />
									</div>
									<div class="min-w-0">
										<h2 class="truncate text-lg font-bold text-base-content">{{ section.title }}</h2>
										<p class="mt-1 text-sm text-base-content/55">{{ section.desc }}</p>
									</div>
								</div>
								<span
									v-if="section.showBadge !== false"
									class="hidden shrink-0 rounded-full border border-base-300 bg-base-100 px-4 py-1.5 text-sm font-semibold text-base-content/50 sm:inline-flex"
								>
									{{ $t('siteconfig.enabledCount', { count: sectionCount(section.id) }) }}
								</span>
							</div>

							<div class="divide-y divide-base-300">
								<template v-if="section.id === 'brand'">
									<div v-show="isRowVisible('logo')" class="grid gap-4 px-6 py-5 lg:grid-cols-[160px_minmax(0,1fr)]">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('logo')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('logo')?.desc }}</div>
										</div>
										<div class="flex items-end gap-3">
											<UploadImg v-model="form.logo" :limit="1" height="88px" width="88px" />
											<el-button v-if="form.logo" icon="Delete" @click="form.logo = ''">{{ $t('siteconfig.remove') }}</el-button>
										</div>
									</div>

									<div v-show="isRowVisible('title')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_420px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('title')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('title')?.desc }}</div>
										</div>
										<el-input v-model="form.title" :placeholder="t('siteconfig.siteTitlePlaceholder')" />
									</div>

									<div v-show="isRowVisible('footer')" class="px-6 py-5">
										<div class="mb-3">
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('footer')?.label }}
												<Tip :content="t('siteconfig.footerTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('footer')?.desc }}</div>
										</div>
										<el-input v-model="form.footer" type="textarea" :rows="4" :placeholder="t('siteconfig.footerPlaceholder')" />
									</div>

									<div v-show="isRowVisible('privacyTip')" class="px-6 py-5">
										<div class="mb-3">
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('privacyTip')?.label }}
												<Tip :content="t('siteconfig.privacyTipTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('privacyTip')?.desc }}</div>
										</div>
										<el-input v-model="form.privacyTip" type="textarea" :rows="4" :placeholder="t('siteconfig.privacyTipPlaceholder')" />
									</div>
								</template>

								<template v-if="section.id === 'login'">
									<div v-show="isRowVisible('accountPassword')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_180px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('accountPassword')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('accountPassword')?.desc }}</div>
										</div>
										<el-tag class="justify-self-start lg:justify-self-end" type="info">{{ $t('siteconfig.defaultEnabled') }}</el-tag>
									</div>

									<div v-show="isRowVisible('smsLogin')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('smsLogin')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('smsLogin')?.desc }}</div>
										</div>
										<el-switch v-model="form.smsLoginEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.smsLogin')" />
									</div>

									<div v-show="isRowVisible('socialLogin')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('socialLogin')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('socialLogin')?.desc }}</div>
										</div>
										<el-switch
											v-model="form.socialLoginEnable"
											class="justify-self-start lg:justify-self-end"
											:aria-label="t('siteconfig.socialLogin')"
										/>
									</div>

									<div v-show="isRowVisible('register')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('register')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('register')?.desc }}</div>
										</div>
										<el-switch v-model="form.registerEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.register')" />
									</div>

									<div v-show="isRowVisible('resetPassword')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('resetPassword')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('resetPassword')?.desc }}</div>
										</div>
										<el-switch
											v-model="form.resetPassword"
											class="justify-self-start lg:justify-self-end"
											:aria-label="t('siteconfig.resetPassword')"
										/>
									</div>
								</template>

								<template v-if="section.id === 'security'">
									<div v-show="isRowVisible('captchaMode')" class="px-6 py-5">
										<div class="mb-4">
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('captchaMode')?.label }}
												<Tip :content="t('siteconfig.captchaModeTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('captchaMode')?.desc }}</div>
										</div>
										<div class="inline-flex rounded-lg border border-base-300 bg-base-200 p-1">
											<button
												v-for="item in captchaOptions"
												:key="item.value"
												type="button"
												class="h-10 min-w-[104px] rounded-md px-4 text-sm font-semibold transition-colors"
												:class="
													form.captchaType === item.value ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/60 hover:text-base-content'
												"
												@click="form.captchaType = item.value"
											>
												{{ item.label }}
											</button>
										</div>
									</div>

									<div v-show="isRowVisible('passwordRule')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_380px] lg:items-center">
										<div>
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('passwordRule')?.label }}
												<Tip :content="t('siteconfig.passwordRuleTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('passwordRule')?.desc }}</div>
										</div>
										<el-select v-model="form.passwordRule" :placeholder="t('siteconfig.passwordRulePlaceholder')">
											<el-option v-for="item in passwordRuleOptions" :key="item.value" :label="item.label" :value="item.value" />
										</el-select>
									</div>

									<div v-show="isRowVisible('forceResetPwd')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_300px] lg:items-center">
										<div>
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('forceResetPwd')?.label }}
												<Tip :content="t('siteconfig.forceResetPwdTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('forceResetPwd')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<template v-if="form.forceResetPwd">
												<el-input-number v-model="form.passwordExpireDays" :min="1" :max="3650" controls-position="right" class="!w-32" />
												<span class="text-sm text-base-content/55">{{ $t('siteconfig.daysExpire') }}</span>
											</template>
											<el-switch v-model="form.forceResetPwd" :aria-label="t('siteconfig.forceResetPwd')" />
										</div>
									</div>

									<div v-show="isRowVisible('loginFailureLock')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_300px] lg:items-center">
										<div>
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('loginFailureLock')?.label }}
												<Tip :content="t('siteconfig.loginFailureLockTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('loginFailureLock')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<template v-if="form.loginFailureLock">
												<el-input-number v-model="form.loginErrorTimes" :min="1" :max="99" controls-position="right" class="!w-32" />
												<span class="text-sm text-base-content/55">{{ $t('siteconfig.timesToLock') }}</span>
											</template>
											<el-switch v-model="form.loginFailureLock" :aria-label="t('siteconfig.loginFailureLock')" />
										</div>
									</div>

									<div v-show="isRowVisible('antiDebugEnable')" class="px-6 py-5">
										<div class="grid gap-4 lg:grid-cols-[1fr_80px] lg:items-center">
											<div>
												<div class="text-sm font-semibold text-base-content">{{ rowMeta('antiDebugEnable')?.label }}</div>
												<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('antiDebugEnable')?.desc }}</div>
											</div>
											<el-switch
												v-model="form.antiDebugEnable"
												class="justify-self-start lg:justify-self-end"
												:aria-label="t('siteconfig.antiDebugEnable')"
											/>
										</div>
										<div v-if="form.antiDebugEnable" class="mt-4 flex items-center gap-3 rounded-lg bg-base-200 p-4">
											<label class="flex shrink-0 items-center gap-1 text-xs font-semibold text-base-content/70">
												{{ $t('siteconfig.antiDebugKey') }}
												<Tip :content="t('siteconfig.antiDebugKeyTip')" />
											</label>
											<el-input v-model="form.antiDebugKey" :placeholder="t('siteconfig.antiDebugKeyPlaceholder')" />
										</div>
									</div>
								</template>

								<template v-if="section.id === 'appearance'">
									<div v-show="isRowVisible('i18nSwitch')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_280px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('i18nSwitch')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('i18nSwitch')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<el-select :model-value="t('siteconfig.defaultLanguage')" disabled class="!w-48">
												<el-option :label="t('siteconfig.defaultLanguage')" :value="t('siteconfig.defaultLanguage')" />
											</el-select>
											<el-switch v-model="form.i18nEnable" :aria-label="t('siteconfig.i18nSwitch')" />
										</div>
									</div>

									<div v-show="isRowVisible('darkMode')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_420px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('darkMode')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('darkMode')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<div class="inline-flex rounded-lg border border-base-300 bg-base-200 p-1">
												<span class="rounded-md px-4 py-2 text-sm font-semibold text-base-content/50">{{ $t('siteconfig.lightMode') }}</span>
												<span class="rounded-md px-4 py-2 text-sm font-semibold text-base-content/50">{{ $t('siteconfig.darkModeDefault') }}</span>
												<span class="rounded-md bg-base-100 px-4 py-2 text-sm font-semibold text-base-content shadow-sm">{{
													$t('siteconfig.followSystem')
												}}</span>
											</div>
											<el-switch v-model="form.darkModeEnable" :aria-label="t('siteconfig.darkMode')" />
										</div>
									</div>
								</template>

								<template v-if="section.id === 'integration'">
									<div v-show="isRowVisible('syncDingtalk')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_260px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('syncDingtalk')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('syncDingtalk')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<el-button>{{ $t('siteconfig.configAppKey') }}</el-button>
											<el-switch v-model="form.syncDingtalkEnabled" :aria-label="t('siteconfig.syncDingtalk')" />
										</div>
									</div>

									<div v-show="isRowVisible('syncWechat')" class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_260px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('syncWechat')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('syncWechat')?.desc }}</div>
										</div>
										<div class="flex items-center gap-3 lg:justify-end">
											<el-button>{{ $t('siteconfig.configCorpId') }}</el-button>
											<el-switch v-model="form.syncWechatEnabled" :aria-label="t('siteconfig.syncWechat')" />
										</div>
									</div>

									<div v-show="isRowVisible('clarityId')" class="px-6 py-5">
										<div class="mb-4">
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('clarityId')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('clarityId')?.desc }}</div>
										</div>
										<el-input v-model="form.clarityId" :placeholder="t('siteconfig.clarityPlaceholder')">
											<template #prepend>Clarity ID</template>
										</el-input>
									</div>
								</template>

								<template v-if="section.id === 'maintenance'">
									<div v-show="isRowVisible('clearCache')" class="grid gap-4 bg-red-50/20 px-6 py-5 lg:grid-cols-[1fr_180px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('clearCache')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('clearCache')?.desc }}</div>
										</div>
										<el-button type="danger" plain :loading="refreshing" @click="handleRefresh">
											{{ $t('siteconfig.clearCacheAction') }}
										</el-button>
									</div>
								</template>
							</div>
						</section>

						<div
							v-if="hasChanges"
							class="sticky bottom-4 z-20 mx-auto w-full max-w-[760px] rounded-xl border border-base-300 bg-base-100/95 px-4 py-3 shadow-lg backdrop-blur"
						>
							<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div class="flex items-center gap-3 text-sm font-semibold text-base-content">
									<span
										class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--el-color-primary-light-9)] text-[var(--el-color-primary)]"
									>
										<Edit class="h-4 w-4" />
									</span>
									{{ $t('siteconfig.modifiedCount', { count: changedCount }) }}
								</div>
								<div class="flex items-center gap-3">
									<el-button @click="loadConfig" :disabled="loading || saving">{{ $t('siteconfig.cancel') }}</el-button>
									<el-button type="primary" :loading="saving" @click="handleSave" v-auth="'sys_site_config_edit'">
										{{ $t('siteconfig.save') }}
									</el-button>
								</div>
							</div>
						</div>

						<div class="h-6"></div>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>
