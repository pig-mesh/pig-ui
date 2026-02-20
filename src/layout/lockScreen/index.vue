<template>
	<div v-show="state.isShowLockScreen">
		<!-- 遮罩层 -->
		<div class="fixed inset-0 z-[9999990] bg-white"></div>
		<!-- 背景图 -->
		<div class="lock-screen-bg fixed inset-0 z-[9999991] bg-cover" :class="{ 'blur-sm': state.isShowLoockLogin }">
		</div>
		<!-- 主容器 -->
		<div class="fixed inset-0 z-[9999992]">
			<!-- 时间显示区域 -->
			<div ref="layoutLockScreenDateRef" class="absolute inset-0 z-[9999993] select-none text-white">
				<!-- 时间信息 -->
				<div class="absolute bottom-[50px] left-[30px]">
					<div class="text-[100px] text-white">
						{{ state.time.hm }}<span class="text-base">{{ state.time.s }}</span>
					</div>
					<div class="text-[40px] text-white">{{ state.time.mdq }}</div>
				</div>
				<!-- 滑动解锁提示 -->
				<div
					class="group absolute bottom-[50px] right-[30px] size-10 overflow-hidden rounded-full border border-white/30 bg-white/10 text-center leading-10 text-white opacity-80 transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:opacity-100 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]">
					<SvgIcon name="ele-Top" class="transition-transform duration-300 group-hover:-translate-y-10" />
					<div
						class="pointer-events-none absolute left-1/2 top-[150%] w-9 -translate-x-1/2 -translate-y-1/2 text-xs leading-tight text-white opacity-0 transition-all duration-300 group-hover:top-1/2 group-hover:opacity-100">
						{{ t('lockScreen.slideToUnlock') }}
					</div>
				</div>
			</div>
			<!-- 登录面板 -->
			<transition name="el-zoom-in-center">
				<div v-show="state.isShowLoockLogin"
					class="relative z-[9999994] flex h-full w-full flex-col justify-center text-white">
					<div class="m-auto text-center">
						<!-- 头像 -->
						<div class="mx-auto size-[180px]">
							<img v-if="formData.avatar" :src="baseURL + formData.avatar" class="rounded-full size-full" />
							<NameAvatar v-else :name="formData.username" :size="180" />
						</div>
						<!-- 用户名 -->
						<div class="my-4 mb-8 text-2xl">{{ formData.username }}</div>
						<!-- 密码输入 -->
						<div>
							<el-input ref="layoutLockScreenInputRef" v-model="state.lockScreenPassword"
								:placeholder="t('lockScreen.enterPassword')" type="password"
								@keyup.enter.native.stop="onLockScreenSubmit()">
								<template #append>
									<el-button @click="onLockScreenSubmit">
										<el-icon class="el-input__icon"><ele-Right /></el-icon>
									</el-button>
								</template>
							</el-input>
							<p class="text-red-500">{{ mes }}</p>
						</div>
					</div>
					<!-- 底部图标 -->
					<div class="absolute bottom-[30px] right-[30px] flex gap-4">
						<SvgIcon name="ele-Microphone" :size="20" class="cursor-pointer opacity-80 hover:opacity-100" />
						<SvgIcon name="ele-AlarmClock" :size="20" class="cursor-pointer opacity-80 hover:opacity-100" />
						<SvgIcon name="ele-SwitchButton" :size="20"
							class="cursor-pointer opacity-80 hover:opacity-100" />
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutLockScreen">
import { formatDate } from '/@/utils/formatTime';
import { Local } from '/@/utils/storage';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { checkPassword } from '/@/api/admin/user';
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';
import { useIntervalFn, usePointerSwipe } from '@vueuse/core';
import NameAvatar from '/@/components/NameAvatar/index.vue';

const { t } = useI18n();
const layoutLockScreenDateRef = ref<HTMLElement>();
const layoutLockScreenInputRef = ref();
const { themeConfig } = storeToRefs(useThemeConfig());

// 滑动解锁阈值（向上滑动超过此值触发解锁）
const UNLOCK_THRESHOLD = 150;

const state = reactive({
	isShowLoockLogin: false,
	time: {
		hm: '',
		s: '',
		mdq: '',
	},
	isShowLockScreen: false,
	lockScreenPassword: '',
});

// 使用 usePointerSwipe 统一处理 PC/移动端的滑动事件
const { distanceY } = usePointerSwipe(layoutLockScreenDateRef, {
	threshold: 10,
	onSwipe() {
		const el = layoutLockScreenDateRef.value;
		if (!el || distanceY.value <= 0) return; // 只处理向上滑动

		const offset = -distanceY.value;
		const opacity = Math.max(0, 1 - distanceY.value / UNLOCK_THRESHOLD);
		el.style.cssText = `top:${offset}px;cursor:pointer;opacity:${opacity};`;

		// 超过阈值，触发解锁动画
		if (distanceY.value > UNLOCK_THRESHOLD) {
			el.style.cssText = `top:${-el.clientHeight}px;cursor:pointer;transition:all 0.3s ease;`;
			setTimeout(() => {
				el.style.display = 'none';
				state.isShowLoockLogin = true;
				layoutLockScreenInputRef.value?.focus();
			}, 300);
		}
	},
	onSwipeEnd() {
		const el = layoutLockScreenDateRef.value;
		if (!el) return;

		// 未达到阈值，回弹到原位
		if (distanceY.value <= UNLOCK_THRESHOLD && !state.isShowLoockLogin) {
			el.style.cssText = `top:0px;opacity:1;transition:all 0.3s ease;`;
		}
	},
});
// 时间初始化
const updateTime = () => {
	state.time.hm = formatDate(new Date(), 'HH:MM');
	state.time.s = formatDate(new Date(), 'SS');
	state.time.mdq = formatDate(new Date(), 'mm月dd日，WWW');
};

// 使用 VueUse 的 useIntervalFn 管理时间更新定时器（自动清理）
updateTime();
useIntervalFn(updateTime, 1000);

// 存储布局配置
const setLocalThemeConfig = () => {
	themeConfig.value.isDrawer = false;
	Local.set('themeConfig', themeConfig.value);
};

/**
 * 初始化锁屏相关信息
 */
const handleLockScreenCountdown = () => {
	if (!themeConfig.value.isLockScreen) return;

	if (themeConfig.value.lockScreenTime <= 1) {
		state.isShowLockScreen = true;
		setLocalThemeConfig();
		pauseLockScreenTimer();
	} else {
		themeConfig.value.lockScreenTime--;
	}
};

const { pause: pauseLockScreenTimer, resume: resumeLockScreenTimer } = useIntervalFn(
	handleLockScreenCountdown,
	1000,
	{ immediate: false }
);

const initLockScreen = () => {
	if (themeConfig.value.isLockScreen) {
		resumeLockScreenTimer();
	} else {
		pauseLockScreenTimer();
	}
};
const mes = ref();

const updateLockScreenState = (isLocked: boolean) => {
	themeConfig.value.isLockScreen = isLocked;
	themeConfig.value.lockScreenTime = 30;
	setLocalThemeConfig();

	// 解锁成功时清除锁屏显示状态
	if (!isLocked) {
		state.isShowLockScreen = false;
	}
};

/**
 * 处理密码输入，验证密码正确性并解锁
 */
const onLockScreenSubmit = async () => {
	try {
		const { data, msg } = await checkPassword(state.lockScreenPassword);
		mes.value = msg;
		// 根据验证结果更新锁屏状态
		if (data) {
			updateLockScreenState(false);
		}
	} catch (err: any) {
		mes.value = err.msg;
		// 异常时解锁，避免用户被锁住
		updateLockScreenState(false);
	}
};

const formData = reactive<{ avatar?: string; username?: string }>({});

onMounted(() => {
	const data = useUserInfo().userInfos;
	Object.assign(formData, data.user);
	initLockScreen();
});
</script>

<style scoped>
/* 背景图片 */
.lock-screen-bg {
	background-image: url('/@/assets/lockScreen.png');
}

/* Element Plus 输入框样式覆盖 */
:deep(.el-input-group__append) {
	background: white;
	border-radius: 20%;
}

:deep(.el-input__inner) {
	border-right-color: var(--el-border-color-extra-light);
}

:deep(.el-input__inner:hover) {
	border-color: var(--el-border-color-extra-light);
}
</style>
