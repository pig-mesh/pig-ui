<template>
	<div style="position: relative">
		<div v-if="type === '2'" :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }" class="verify-img-out">
			<div :style="{ width: setSize.imgWidth, height: setSize.imgHeight }" class="verify-img-panel modern-shadow">
				<img :src="'data:image/png;base64,' + backImgBase" alt="" style="width: 100%; height: 100%; display: block" />
				<div v-show="showRefresh" class="verify-refresh" @click="refresh"><i class="iconfont icon-refresh"></i></div>
				<transition name="tips">
					<span v-if="tipWords" :class="passFlag ? 'suc-bg' : 'err-bg'" class="verify-tips">{{ tipWords }}</span>
				</transition>
			</div>
		</div>
		<!-- 公共部分 -->
		<div :style="{ width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height }" class="verify-bar-area modern-bar">
			<span class="verify-msg" v-text="text"></span>
			<div
				:style="{
					width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
					height: barSize.height,
					'border-color': leftBarBorderColor,
					transaction: transitionWidth,
				}"
				class="verify-left-bar"
			>
				<span class="verify-msg" v-text="finishText"></span>
				<div
					:style="{
						width: barSize.height,
						height: barSize.height,
						'background-color': moveBlockBackgroundColor,
						left: moveBlockLeft,
						transition: transitionLeft,
					}"
					class="verify-move-block"
					@mousedown="start"
					@touchstart="start"
				>
					<i :class="['verify-icon iconfont', iconClass]" :style="{ color: iconColor }"></i>
					<div
						v-if="type === '2'"
						:style="{
							width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
							height: setSize.imgHeight,
							top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
							'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
						}"
						class="verify-sub-block"
					>
						<img
							:src="'data:image/png;base64,' + blockBackImgBase"
							alt=""
							style="width: 100%; height: 100%; display: block; -webkit-user-drag: none"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/babel">
/**
 * VerifySlide
 * @description 滑块
 * */
import { aesEncrypt } from '../utils/ase';
import { resetSize } from '../utils/util';
import { reqCheck, reqGet } from '../api/index';
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
	name: 'VerifySlide',
	props: {
		captchaType: {
			type: String,
		},
		type: {
			type: String,
			default: '1',
		},
		//弹出式pop，固定fixed
		mode: {
			type: String,
			default: 'fixed',
		},
		vSpace: {
			type: Number,
			default: 5,
		},
		explain: {
			type: String,
			default: '向右滑动完成验证',
			/** @deprecated 使用 i18n 国际化替代 */
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
			default() {
				return {
					width: '50px',
					height: '50px',
				};
			},
		},
		barSize: {
			type: Object,
			default() {
				return {
					width: '310px',
					height: '40px',
				};
			},
		},
	},
	setup(props) {
		const { t } = useI18n();
		const { mode, captchaType, type, blockSize } = toRefs(props);
		const { proxy } = getCurrentInstance();
		let secretKey = ref(''), //后端返回的ase加密秘钥
			passFlag = ref(''), //是否通过的标识
			backImgBase = ref(''), //验证码背景图片
			blockBackImgBase = ref(''), //验证滑块的背景图片
			backToken = ref(''), //后端返回的唯一token值
			startMoveTime = ref(''), //移动开始的时间
			endMovetime = ref(''), //移动结束的时间
			tipsBackColor = ref(''), //提示词的背景颜色
			tipWords = ref(''),
			text = ref(''),
			finishText = ref(''),
			setSize = reactive({
				imgHeight: 0,
				imgWidth: 0,
				barHeight: 0,
				barWidth: 0,
			}),
			top = ref(0),
			left = ref(0),
			moveBlockLeft = ref(undefined),
			leftBarWidth = ref(undefined),
			// 移动中样式
			moveBlockBackgroundColor = ref(undefined),
			leftBarBorderColor = ref('#ddd'),
			iconColor = ref(undefined),
			iconClass = ref('icon-right'),
			status = ref(false), //鼠标状态
			isEnd = ref(false), //是够验证完成
			showRefresh = ref(true),
			transitionLeft = ref(''),
			transitionWidth = ref(''),
			startLeft = ref(0);

		const barArea = computed(() => {
			return proxy.$el.querySelector('.verify-bar-area');
		});

		function init() {
			text.value = t('verify.slide.explain');
			getPictrue();
			nextTick(() => {
				let { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
				setSize.imgHeight = imgHeight;
				setSize.imgWidth = imgWidth;
				setSize.barHeight = barHeight;
				setSize.barWidth = barWidth;
				proxy.$parent.$emit('ready', proxy);
			});

			window.removeEventListener('touchmove', function (e) {
				move(e);
			});
			window.removeEventListener('mousemove', function (e) {
				move(e);
			});

			//鼠标松开
			window.removeEventListener('touchend', function () {
				end();
			});
			window.removeEventListener('mouseup', function () {
				end();
			});

			window.addEventListener('touchmove', function (e) {
				move(e);
			});
			window.addEventListener('mousemove', function (e) {
				move(e);
			});

			//鼠标松开
			window.addEventListener('touchend', function () {
				end();
			});
			window.addEventListener('mouseup', function () {
				end();
			});
		}

		watch(type, () => {
			init();
		});
		onMounted(() => {
			// 禁止拖拽
			init();
			proxy.$el.onselectstart = function () {
				return false;
			};
		});

		//鼠标按下
		function start(e) {
			e = e || window.event;
			let x = null;
			if (!e.touches) {
				//兼容PC端
				x = e.clientX;
			} else {
				//兼容移动端
				x = e.touches[0].pageX;
			}
			startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left);
			startMoveTime.value = +new Date(); //开始滑动的时间
			if (isEnd.value == false) {
				text.value = '';
				moveBlockBackgroundColor.value = '#337ab7';
				leftBarBorderColor.value = '#337AB7';
				iconColor.value = '#fff';
				e.stopPropagation();
				status.value = true;
			}
		}

		//鼠标移动
		function move(e) {
			e = e || window.event;
			if (status.value && isEnd.value == false) {
				let x = null;
				if (!e.touches) {
					//兼容PC端
					x = e.clientX;
				} else {
					//兼容移动端
					x = e.touches[0].pageX;
				}
				var bar_area_left = barArea.value.getBoundingClientRect().left;
				var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
				if (move_block_left >= barArea.value.offsetWidth - parseInt(parseInt(blockSize.value.width) / 2) - 2) {
					move_block_left = barArea.value.offsetWidth - parseInt(parseInt(blockSize.value.width) / 2) - 2;
				}
				if (move_block_left <= 0) {
					move_block_left = parseInt(parseInt(blockSize.value.width) / 2);
				}
				//拖动后小方块的left值
				moveBlockLeft.value = move_block_left - startLeft.value + 'px';
				leftBarWidth.value = move_block_left - startLeft.value + 'px';
			}
		}

		//鼠标松开
		function end() {
			endMovetime.value = +new Date();
			//判断是否重合
			if (status.value && isEnd.value == false) {
				var moveLeftDistance = parseInt((moveBlockLeft.value || '').replace('px', ''));
				moveLeftDistance = (moveLeftDistance * 310) / parseInt(setSize.imgWidth);
				let data = {
					captchaType: captchaType.value,
					pointJson: secretKey.value
						? aesEncrypt(
								JSON.stringify({
									x: moveLeftDistance,
									y: 5.0,
								}),
								secretKey.value
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  )
						: JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
					token: backToken.value,
				};
				reqCheck(data).then((response) => {
					let res = response.data;
					if (res.repCode == '0000') {
						moveBlockBackgroundColor.value = '#5cb85c';
						leftBarBorderColor.value = '#5cb85c';
						iconColor.value = '#fff';
						iconClass.value = 'icon-check';
						showRefresh.value = false;
						isEnd.value = true;
						if (mode.value == 'pop') {
							setTimeout(() => {
								proxy.$parent.clickShow = false;
								refresh();
							}, 1500);
						}
						passFlag.value = true;
						const time = ((endMovetime.value - startMoveTime.value) / 1000).toFixed(2);
						tipWords.value = t('verify.slide.time', { time });
						var captchaVerification = secretKey.value
							? aesEncrypt(
									backToken.value +
										'---' +
										JSON.stringify({
											x: moveLeftDistance,
											y: 5.0,
										}),
									secretKey.value
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  )
							: backToken.value + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 });
						setTimeout(() => {
							tipWords.value = '';
							proxy.$parent.$parent.closeBox();
							proxy.$parent.$parent.$emit('success', { captchaVerification });
						}, 1000);
					} else {
						moveBlockBackgroundColor.value = '#d9534f';
						leftBarBorderColor.value = '#d9534f';
						iconColor.value = '#fff';
						iconClass.value = 'icon-close';
						passFlag.value = false;
						setTimeout(function () {
							refresh();
						}, 1000);
						proxy.$parent.$emit('error', proxy);
						tipWords.value = t('verify.slide.fail');
						setTimeout(() => {
							tipWords.value = '';
						}, 1000);
					}
				});
				status.value = false;
			}
		}

		const refresh = () => {
			showRefresh.value = true;
			finishText.value = '';

			transitionLeft.value = 'left .3s';
			moveBlockLeft.value = 0;

			leftBarWidth.value = undefined;
			transitionWidth.value = 'width .3s';

			leftBarBorderColor.value = '#ddd';
			moveBlockBackgroundColor.value = '#fff';
			iconColor.value = '#000';
			iconClass.value = 'icon-right';
			isEnd.value = false;

			getPictrue();
			setTimeout(() => {
				transitionWidth.value = '';
				transitionLeft.value = '';
				text.value = t('verify.slide.explain');
			}, 300);
		};

		// 请求背景图片和验证图片
		function getPictrue() {
			let data = {
				captchaType: captchaType.value,
			};
			reqGet(data).then((response) => {
				let res = response.data;
				if (res.repCode == '0000') {
					backImgBase.value = res.repData.originalImageBase64;
					blockBackImgBase.value = res.repData.jigsawImageBase64;
					backToken.value = res.repData.token;
					secretKey.value = res.repData.secretKey;
				} else {
					tipWords.value = res.repMsg;
				}
			});
		}

		return {
			secretKey, //后端返回的ase加密秘钥
			passFlag, //是否通过的标识
			backImgBase, //验证码背景图片
			blockBackImgBase, //验证滑块的背景图片
			backToken, //后端返回的唯一token值
			startMoveTime, //移动开始的时间
			endMovetime, //移动结束的时间
			tipsBackColor, //提示词的背景颜色
			tipWords,
			text,
			finishText,
			setSize,
			top,
			left,
			moveBlockLeft,
			leftBarWidth,
			// 移动中样式
			moveBlockBackgroundColor,
			leftBarBorderColor,
			iconColor,
			iconClass,
			status, //鼠标状态
			isEnd, //是够验证完成
			showRefresh,
			transitionLeft,
			transitionWidth,
			barArea,
			refresh,
			start,
			t,
		};
	},
};
</script>

<style>
/* 现代化阴影效果 */
.modern-shadow {
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
	border-radius: 8px;
	overflow: hidden;
	border: none;
}

/* 现代化滑动条样式 */
.modern-bar {
	border-radius: 20px !important;
	background: #f7f9fc !important;
	border: 1px solid #edf2f7 !important;
}

.modern-bar:hover {
	border-color: #e2e8f0 !important;
	background: #f1f5f9 !important;
}

.verify-bar-area {
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

.verify-bar-area .verify-move-block {
	border-radius: 50% !important;
	background: linear-gradient(145deg, #ffffff, #f5f7fa) !important;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
}

.verify-bar-area .verify-move-block:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.verify-bar-area .verify-left-bar {
	border-radius: 0 20px 20px 0 !important;
	background: linear-gradient(90deg, #60a5fa20, #60a5fa40) !important;
	border: none !important;
}

.verify-img-panel .verify-refresh {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(4px);
	border-radius: 50%;
	width: 32px !important;
	height: 32px !important;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	margin: 8px;
}

.verify-img-panel .verify-refresh:hover {
	background: rgba(255, 255, 255, 1);
}

.verify-tips {
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	border-radius: 4px;
	padding: 4px 12px;
	font-size: 14px;
	font-weight: 500;
}

.suc-bg {
	background: rgba(34, 197, 94, 0.9) !important;
}

.err-bg {
	background: rgba(239, 68, 68, 0.9) !important;
}

/* 暗黑模式适配 */
html.dark {
	.modern-bar {
		background: rgba(30, 41, 59, 0.5) !important;
		border-color: rgba(51, 65, 85, 0.5) !important;
	}

	.verify-move-block {
		background: linear-gradient(145deg, #1e293b, #0f172a) !important;
		border: 1px solid rgba(255, 255, 255, 0.1) !important;
	}

	.verify-left-bar {
		background: linear-gradient(90deg, rgba(96, 165, 250, 0.1), rgba(96, 165, 250, 0.2)) !important;
	}

	.verify-refresh {
		background: rgba(30, 41, 59, 0.9) !important;
	}
}
</style>
