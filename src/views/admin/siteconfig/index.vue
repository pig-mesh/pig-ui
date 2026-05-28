<script setup lang="ts" name="siteconfig">
import { watchIgnorable } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSiteConfig, refreshSiteConfig, updateSiteConfig } from '/@/api/admin/system';
import type { SectionId, SectionMeta, SettingRowMeta, SiteConfigForm, Snapshot } from '/@/api/admin/system';
import { getObj, putObj as putClientObj } from '/@/api/admin/client';
import { getObjDetails, getValue, putObj } from '/@/api/admin/param';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { CaptchaType, PasswordRule } from '/@/stores/siteConfig';
import { getPasswordRuleOptions } from '/@/utils/passwordRule';

const { t } = useI18n();
const message = useMessage();
const messageBox = useMessageBox();

// 从环境变量解析密码登录终端 ID，格式为 clientId:secret
const defaultClientId = (import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT as string)?.split(':')?.[0] ?? '';

const loading = ref(true);
const saving = ref(false);
const refreshing = ref(false);
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
	},
	{
		id: 'login',
		icon: 'Key',
		title: t('siteconfig.loginSection'),
		desc: t('siteconfig.loginSectionDesc'),
		tone: 'green',
	},
	{
		id: 'security',
		icon: 'Lock',
		title: t('siteconfig.securitySection'),
		desc: t('siteconfig.securitySectionDesc'),
		tone: 'amber',
	},
	{
		id: 'appearance',
		icon: 'Brush',
		title: t('siteconfig.appearanceSection'),
		desc: t('siteconfig.appearanceSectionDesc'),
		tone: 'purple',
	},
	{
		id: 'integration',
		icon: 'Connection',
		title: t('siteconfig.integrationSection'),
		desc: t('siteconfig.integrationSectionDesc'),
		tone: 'slate',
	},
	{
		id: 'maintenance',
		icon: 'Refresh',
		title: t('siteconfig.maintenanceSection'),
		desc: t('siteconfig.maintenanceSectionDesc'),
		tone: 'red',
		showBadge: false,
	},
]);

const settingRows = computed<SettingRowMeta[]>(() => [
	{
		key: 'logo',
		section: 'brand',
		label: 'Logo',
		desc: t('siteconfig.logoDesc'),
	},
	{
		key: 'title',
		section: 'brand',
		label: t('siteconfig.siteTitle'),
		desc: t('siteconfig.siteTitleDesc'),
	},
	{
		key: 'footer',
		section: 'brand',
		label: t('siteconfig.footer'),
		desc: t('siteconfig.footerDesc'),
	},
	{
		key: 'privacyTip',
		section: 'brand',
		label: t('siteconfig.privacyTip'),
		desc: t('siteconfig.privacyTipDesc'),
	},
	{
		key: 'accountPassword',
		section: 'login',
		label: t('siteconfig.accountPassword'),
		desc: t('siteconfig.accountPasswordDesc'),
	},
	{
		key: 'smsLogin',
		section: 'login',
		label: t('siteconfig.smsLogin'),
		desc: t('siteconfig.smsLoginDesc'),
	},
	{
		key: 'socialLogin',
		section: 'login',
		label: t('siteconfig.socialLogin'),
		desc: t('siteconfig.socialLoginDesc'),
	},
	{
		key: 'register',
		section: 'login',
		label: t('siteconfig.register'),
		desc: t('siteconfig.registerDesc'),
	},
	{
		key: 'resetPassword',
		section: 'login',
		label: t('siteconfig.resetPassword'),
		desc: t('siteconfig.resetPasswordDesc'),
	},
	{
		key: 'captchaMode',
		section: 'security',
		label: t('siteconfig.captchaMode'),
		desc: t('siteconfig.captchaModeDesc'),
	},
	{
		key: 'passwordRule',
		section: 'security',
		label: t('siteconfig.passwordRule'),
		desc: t('siteconfig.passwordRuleDesc'),
	},
	{
		key: 'forceResetPwd',
		section: 'security',
		label: t('siteconfig.forceResetPwd'),
		desc: t('siteconfig.forceResetPwdDesc'),
	},
	{
		key: 'loginFailureLock',
		section: 'security',
		label: t('siteconfig.loginFailureLock'),
		desc: t('siteconfig.loginFailureLockDesc'),
	},
	{
		key: 'antiDebugEnable',
		section: 'security',
		label: t('siteconfig.antiDebugEnable'),
		desc: t('siteconfig.antiDebugEnableDesc'),
	},
	{
		key: 'i18nSwitch',
		section: 'appearance',
		label: t('siteconfig.i18nSwitch'),
		desc: t('siteconfig.i18nSwitchDesc'),
	},
	{
		key: 'darkMode',
		section: 'appearance',
		label: t('siteconfig.darkMode'),
		desc: t('siteconfig.darkModeDesc'),
	},
	{
		key: 'syncDingtalk',
		section: 'integration',
		label: t('siteconfig.syncDingtalk'),
		desc: t('siteconfig.syncDingtalkDesc'),
	},
	{
		key: 'syncWechat',
		section: 'integration',
		label: t('siteconfig.syncWechat'),
		desc: t('siteconfig.syncWechatDesc'),
	},
	{
		key: 'clarityId',
		section: 'integration',
		label: 'Microsoft Clarity',
		desc: t('siteconfig.analyticsDesc'),
	},
	{
		key: 'clearCache',
		section: 'maintenance',
		label: t('siteconfig.clearCache'),
		desc: t('siteconfig.clearCacheDesc'),
	},
]);

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
	if (tone === 'red') return 'bg-red-50 text-red-600 border-red-100';
	return 'bg-slate-100 text-slate-600 border-slate-200';
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
			if (id) activeSection.value = id;
		},
		{
			root: scrollContainerRef.value,
			rootMargin: '-18% 0px -68% 0px',
			threshold: [0, 0.25, 0.5, 1],
		}
	);

	sections.value.forEach((section) => {
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
						<div class="px-1 mb-4 text-xs font-semibold text-base-content/40">{{ $t('siteconfig.pageSections') }}</div>
						<nav class="space-y-1.5">
							<button
								v-for="section in sections"
								:key="section.id"
								type="button"
								class="flex items-center w-full gap-3 px-3 text-sm font-semibold text-left transition-colors rounded-lg h-11"
								:class="
									activeSection === section.id
										? 'bg-[var(--el-color-primary-light-9)] text-[var(--el-color-primary)]'
										: 'text-base-content/75 hover:bg-base-200 hover:text-base-content'
								"
								@click="scrollToSection(section.id)"
							>
								<component :is="section.icon" class="w-4 h-4 shrink-0" />
								<span class="flex-1 min-w-0 truncate">{{ section.title }}</span>
								<span
									v-if="section.showBadge !== false"
									class="rounded-full bg-[var(--el-color-primary-light-9)] px-2 py-0.5 text-xs font-semibold text-[var(--el-color-primary)]"
								>
									{{ sectionCount(section.id) }}
								</span>
							</button>
						</nav>

						<div class="px-1 mt-8 text-xs font-semibold text-base-content/40">{{ $t('siteconfig.quickActions') }}</div>
						<div class="mt-2 space-y-1.5">
							<button
								type="button"
								class="flex items-center w-full h-10 gap-3 px-3 text-sm font-semibold text-left transition-colors rounded-lg text-base-content/75 hover:bg-base-200 hover:text-base-content"
								:disabled="refreshing"
								@click="handleRefresh"
							>
								<Refresh class="w-4 h-4" />
								<span>{{ $t('siteconfig.clearCache') }}</span>
							</button>
						</div>
					</div>
				</aside>

				<main ref="scrollContainerRef" v-loading="loading" class="flex-1 min-w-0 overflow-y-auto">
					<div class="mx-auto flex max-w-[1180px] flex-col gap-2 px-1 py-2 lg:px-2">
						<section
							v-for="section in sections"
							:key="section.id"
							:ref="(el) => setSectionRef(section.id, el)"
							:data-section-id="section.id"
							class="overflow-hidden border shadow-sm scroll-mt-5 rounded-xl bg-base-100"
							:class="section.id === 'maintenance' ? 'border-red-200' : 'border-base-300'"
						>
							<div
								class="flex items-center justify-between gap-4 px-6 py-5 border-b"
								:class="section.id === 'maintenance' ? 'border-red-100 bg-red-50/40' : 'border-base-300'"
							>
								<div class="flex items-center min-w-0 gap-4">
									<div class="flex items-center justify-center border h-11 w-11 shrink-0 rounded-xl" :class="sectionToneClass(section.tone)">
										<component :is="section.icon" class="w-5 h-5" />
									</div>
									<div class="min-w-0">
										<h2 class="text-lg font-bold truncate text-base-content">{{ section.title }}</h2>
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
									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[160px_minmax(0,1fr)]">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('logo')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('logo')?.desc }}</div>
										</div>
										<div class="flex items-end gap-3">
											<UploadImg v-model="form.logo" :limit="1" height="88px" width="88px" />
											<el-button v-if="form.logo" icon="Delete" @click="form.logo = ''">{{ $t('siteconfig.remove') }}</el-button>
										</div>
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_420px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('title')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('title')?.desc }}</div>
										</div>
										<el-input v-model="form.title" :placeholder="t('siteconfig.siteTitlePlaceholder')" />
									</div>

									<div class="px-6 py-5">
										<div class="mb-3">
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('footer')?.label }}
												<Tip :content="t('siteconfig.footerTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('footer')?.desc }}</div>
										</div>
										<el-input v-model="form.footer" type="textarea" :rows="4" :placeholder="t('siteconfig.footerPlaceholder')" />
									</div>

									<div class="px-6 py-5">
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
									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_180px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('accountPassword')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('accountPassword')?.desc }}</div>
										</div>
										<el-tag class="justify-self-start lg:justify-self-end" type="info">{{ $t('siteconfig.defaultEnabled') }}</el-tag>
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('smsLogin')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('smsLogin')?.desc }}</div>
										</div>
										<el-switch v-model="form.smsLoginEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.smsLogin')" />
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
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

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('register')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('register')?.desc }}</div>
										</div>
										<el-switch v-model="form.registerEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.register')" />
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
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
									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
										<div>
											<div class="flex items-center gap-1 text-sm font-semibold text-base-content">
												{{ rowMeta('captchaMode')?.label }}
												<Tip :content="t('siteconfig.captchaModeTip')" />
											</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('captchaMode')?.desc }}</div>
										</div>
										<div class="inline-flex p-1 border rounded-lg border-base-300 bg-base-200">
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

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_380px] lg:items-center">
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

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_300px] lg:items-center">
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

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_300px] lg:items-center">
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

									<div class="px-6 py-5">
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
										<div v-if="form.antiDebugEnable" class="flex items-center gap-3 p-4 mt-4 rounded-lg bg-base-200">
											<label class="flex items-center gap-1 text-xs font-semibold shrink-0 text-base-content/70">
												{{ $t('siteconfig.antiDebugKey') }}
												<Tip :content="t('siteconfig.antiDebugKeyTip')" />
											</label>
											<el-input v-model="form.antiDebugKey" :placeholder="t('siteconfig.antiDebugKeyPlaceholder')" />
										</div>
									</div>
								</template>

								<template v-if="section.id === 'appearance'">
									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('i18nSwitch')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('i18nSwitch')?.desc }}</div>
										</div>
										<el-switch v-model="form.i18nEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.i18nSwitch')" />
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('darkMode')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('darkMode')?.desc }}</div>
										</div>
										<el-switch v-model="form.darkModeEnable" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.darkMode')" />
									</div>
								</template>

								<template v-if="section.id === 'integration'">
									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('syncDingtalk')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('syncDingtalk')?.desc }}</div>
										</div>
										<el-switch v-model="form.syncDingtalkEnabled" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.syncDingtalk')" />
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_80px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('syncWechat')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('syncWechat')?.desc }}</div>
										</div>
										<el-switch v-model="form.syncWechatEnabled" class="justify-self-start lg:justify-self-end" :aria-label="t('siteconfig.syncWechat')" />
									</div>

									<div class="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_380px] lg:items-center">
										<div>
											<div class="text-sm font-semibold text-base-content">{{ rowMeta('clarityId')?.label }}</div>
											<div class="mt-1 text-xs leading-5 text-base-content/50">{{ rowMeta('clarityId')?.desc }}</div>
										</div>
										<el-input v-model="form.clarityId" :placeholder="t('siteconfig.clarityPlaceholder')">
											<template #prepend>Clarity ID</template>
										</el-input>
									</div>
								</template>

								<template v-if="section.id === 'maintenance'">
									<div class="grid gap-4 bg-red-50/20 px-6 py-5 lg:grid-cols-[1fr_180px] lg:items-center">
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
										<Edit class="w-4 h-4" />
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
