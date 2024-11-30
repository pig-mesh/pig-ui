<template>
	<div v-show="showBox" :class="mode == 'pop' ? 'mask' : ''" @click="handleMaskClick">
		<div :class="mode == 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }" @click.stop>
			<div v-if="mode == 'pop'" class="verifybox-top">
				{{ t('verify.complete') }}
				<span class="verifybox-close" @click="closeBox">
					<i class="iconfont icon-close"></i>
				</span>
			</div>
			<div :style="{ padding: mode == 'pop' ? '15px' : '0' }" class="verifybox-bottom">
				<!-- 验证码容器 -->
				<component
					:is="componentType"
					v-if="componentType"
					ref="instance"
					:arith="arith"
					:barSize="barSize"
					:blockSize="blockSize"
					:captchaType="captchaType"
					:explain="explain"
					:figure="figure"
					:imgSize="imgSize"
					:mode="mode"
					:type="verifyType"
					:vSpace="vSpace"
				></component>
			</div>
		</div>
	</div>
</template>
<script>
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import { computed, ref, toRefs, watchEffect, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
const VerifySlide = defineAsyncComponent(() => import('/@/components/Verifition/Verify/VerifySlide.vue'));
const VerifyPoints = defineAsyncComponent(() => import('/@/components/Verifition/Verify/VerifyPoints.vue'));

export default {
	name: 'Vue2Verify',
	components: {
		VerifySlide,
		VerifyPoints,
	},
	props: {
		captchaType: {
			type: String,
			required: true,
		},
		figure: {
			type: Number,
		},
		arith: {
			type: Number,
		},
		mode: {
			type: String,
			default: 'pop',
		},
		vSpace: {
			type: Number,
		},
		explain: {
			type: String,
		},
		imgSize: {
			type: Object,
			default() {
				return {
					width: '310px',
					height: '155px',
				};
			},
		},
		blockSize: {
			type: Object,
		},
		barSize: {
			type: Object,
		},
	},
	setup(props) {
		const { t } = useI18n();
		const { captchaType, mode } = toRefs(props);
		const clickShow = ref(false);
		const verifyType = ref(undefined);
		const componentType = ref(undefined);

		const instance = ref({});

		const showBox = computed(() => {
			if (mode.value == 'pop') {
				return clickShow.value;
			} else {
				return true;
			}
		});
		/**
		 * refresh
		 * @description 刷新
		 * */
		const refresh = () => {
			if (instance.value.refresh) {
				instance.value.refresh();
			}
		};
		const closeBox = () => {
			clickShow.value = false;
			refresh();
		};
		const show = () => {
			if (mode.value == 'pop') {
				clickShow.value = true;
			}
		};
		watchEffect(() => {
			switch (captchaType.value) {
				case 'blockPuzzle':
					verifyType.value = '2';
					componentType.value = 'VerifySlide';
					break;
				case 'clickWord':
					verifyType.value = '';
					componentType.value = 'VerifyPoints';
					break;
			}
		});

		const handleMaskClick = (e) => {
			if (e.target.classList.contains('mask')) {
				closeBox();
			}
		};

		return {
			t,
			clickShow,
			verifyType,
			componentType,
			instance,
			showBox,
			closeBox,
			show,
			handleMaskClick,
		};
	},
};
</script>
<style>
.verifybox {
	position: fixed;
	box-sizing: border-box;
	border-radius: 2px;
	border: 1px solid #e4e7eb;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: auto;
	height: 280px;
	overflow: hidden;
	min-width: 320px;
	z-index: 1002;
}

.verifybox-top {
	padding: 0 15px;
	height: 50px;
	line-height: 50px;
	text-align: left;
	font-size: 16px;
	color: #45494c;
	border-bottom: 1px solid #e4e7eb;
	box-sizing: border-box;
}

.verifybox-bottom {
	padding: 15px;
	box-sizing: border-box;
	height: calc(100% - 50px);
	overflow: hidden;
}

.verifybox-close {
	position: absolute;
	top: 13px;
	right: 9px;
	width: 24px;
	height: 24px;
	text-align: center;
	cursor: pointer;
}

.mask {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	width: 100%;
	height: 100vh;
	background: transparent;
	pointer-events: auto;
}

.verify-tips {
	position: absolute;
	left: 0px;
	bottom: 0px;
	width: 100%;
	height: 30px;
	line-height: 30px;
	color: #fff;
}

.suc-bg {
	background-color: rgba(92, 184, 92, 0.5);
	filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}

.err-bg {
	background-color: rgba(217, 83, 79, 0.5);
	filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}

/* ---------------------------- */
/*常规验证码*/
.verify-code {
	font-size: 20px;
	text-align: center;
	cursor: pointer;
	margin-bottom: 5px;
	border: 1px solid #ddd;
}

.cerify-code-panel {
	height: 100%;
	overflow: hidden;
}

.verify-code-area {
	float: left;
}

.verify-input-area {
	float: left;
	width: 60%;
	padding-right: 10px;
}

.verify-change-area {
	line-height: 30px;
	float: left;
}

.varify-input-code {
	display: inline-block;
	width: 100%;
	height: 25px;
}

.verify-change-code {
	color: #337ab7;
	cursor: pointer;
}

.verify-btn {
	width: 200px;
	height: 30px;
	background-color: #337ab7;
	color: #ffffff;
	border: none;
	margin-top: 10px;
}

/*滑动验证码*/
.verify-bar-area {
	position: relative;
	background: #ffffff;
	text-align: center;
	-webkit-box-sizing: content-box;
	-moz-box-sizing: content-box;
	box-sizing: content-box;
	border: 1px solid #ddd;
	-webkit-border-radius: 4px;
}

.verify-bar-area .verify-move-block {
	position: absolute;
	top: 0px;
	left: 0;
	background: #fff;
	cursor: pointer;
	-webkit-box-sizing: content-box;
	-moz-box-sizing: content-box;
	box-sizing: content-box;
	box-shadow: 0 0 2px #888888;
	-webkit-border-radius: 1px;
	transition: none;
}

.verify-bar-area .verify-move-block:hover {
	background-color: #337ab7;
	color: #ffffff;
}

.verify-bar-area .verify-left-bar {
	position: absolute;
	top: -1px;
	left: -1px;
	background: #f0fff0;
	cursor: pointer;
	-webkit-box-sizing: content-box;
	-moz-box-sizing: content-box;
	box-sizing: content-box;
	border: 1px solid #ddd;
	transition: none;
}

.verify-img-panel {
	margin: 0;
	-webkit-box-sizing: content-box;
	-moz-box-sizing: content-box;
	box-sizing: content-box;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
	border-radius: 3px;
	position: relative;
}

.verify-img-panel .verify-refresh {
	width: 25px;
	height: 25px;
	text-align: center;
	padding: 5px;
	cursor: pointer;
	position: absolute;
	top: 0;
	right: 0;
	z-index: 2;
}

.verify-img-panel .icon-refresh {
	font-size: 20px;
	color: #fff;
}

.verify-img-panel .verify-gap {
	background-color: #fff;
	position: relative;
	z-index: 2;
	border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
	position: absolute;
	text-align: center;
	z-index: 3;
	/* border: 1px solid #fff; */
}

.verify-bar-area .verify-move-block .verify-icon {
	font-size: 18px;
}

.verify-bar-area .verify-msg {
	z-index: 3;
}

.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-check:before {
	content: ' ';
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9999;
	background-size: contain;
}

.icon-close:before {
	content: ' ';
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9999;
	background-size: contain;
}

.icon-right:before {
	content: ' ';
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-size: cover;
	z-index: 9999;
	background-size: contain;
}

.icon-refresh:before {
	content: ' ';
	display: block;
	width: 16px;
	height: 16px;
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9999;
	background-size: contain;
}

/* 在 <style> 标签内添加暗黑模式样式 */
html.dark {
	.verifybox {
		background-color: var(--el-bg-color);
		border: none;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}

	.verifybox-top {
		color: var(--el-text-color-primary);
		border-bottom: 1px solid var(--el-border-color-darker);
		background-color: var(--el-bg-color-darker);
	}

	.verify-bar-area {
		background: var(--el-bg-color-darker);
		border: none;
	}

	.verify-bar-area .verify-move-block {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
	}

	.verify-bar-area .verify-left-bar {
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
		border: none;
		opacity: 1;
	}

	.verify-img-panel {
		border: none;
		background-color: var(--el-bg-color-darker);
	}

	.verify-img-panel .verify-gap {
		background-color: rgba(255, 255, 255, 0.25);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
	}

	/* 暗黑模式下的图标颜色 */
	.icon-refresh:before,
	.icon-right:before,
	.icon-close:before,
	.verify-bar-area .verify-move-block:after {
		background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffffff" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
		opacity: 0.8;
	}

	.mask {
		background: transparent;
	}
}

/* 修改图标样式 */
.icon-refresh:before {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>');
}

.icon-right:before {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
}

.icon-close:before {
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
}

.verify-bar-area .verify-move-block {
	display: flex;
	align-items: center;
	justify-content: center;
}

.verify-bar-area .verify-move-block:after {
	content: '';
	width: 16px;
	height: 16px;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>');
	background-size: contain;
	background-repeat: no-repeat;
}
</style>
