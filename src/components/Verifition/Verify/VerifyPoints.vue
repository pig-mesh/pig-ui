<template>
	<div style="position: relative">
		<div class="verify-img-out">
			<div
				class="verify-img-panel"
				:style="{
					width: setSize.imgWidth,
					height: setSize.imgHeight,
					'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
					'margin-bottom': vSpace + 'px',
				}"
			>
				<div
					class="verify-refresh bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
					style="z-index: 3"
					@click="refresh"
					v-show="showRefresh"
				>
					<i class="iconfont icon-refresh text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"></i>
				</div>
				<img
					:src="'data:image/png;base64,' + pointBackImgBase"
					ref="canvas"
					alt=""
					style="width: 100%; height: 100%; display: block"
					@click="bindingClick ? canvasClick($event) : undefined"
				/>

				<div
					v-for="(tempPoint, index) in tempPoints"
					:key="index"
					class="point-area"
					:style="{
						'background-color': '#1abd6c',
						color: '#fff',
						'z-index': 9999,
						width: '20px',
						height: '20px',
						'text-align': 'center',
						'line-height': '20px',
						'border-radius': '50%',
						position: 'absolute',
						top: parseInt(tempPoint.y - 10) + 'px',
						left: parseInt(tempPoint.x - 10) + 'px',
					}"
				>
					{{ index + 1 }}
				</div>
			</div>
		</div>
		<!-- 'height': this.barSize.height, -->
		<div
			class="verify-bar-area"
			:style="{ width: setSize.imgWidth, color: this.barAreaColor, 'border-color': this.barAreaBorderColor, 'line-height': this.barSize.height }"
		>
			<span class="verify-msg text-sm font-medium text-gray-600 dark:text-gray-300" v-html="text"></span>
		</div>
	</div>
</template>
<script type="text/babel">
/**
 * VerifyPoints
 * @description 点选
 * */
import { resetSize } from '../utils/util';
import { aesEncrypt } from '../utils/ase';
import { reqGet, reqCheck } from '../api/index';
import { onMounted, reactive, ref, nextTick, toRefs, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
export default {
	name: 'VerifyPoints',
	props: {
		//弹出式pop，固定fixed
		mode: {
			type: String,
			default: 'fixed',
		},
		captchaType: {
			type: String,
		},
		//间隔
		vSpace: {
			type: Number,
			default: 5,
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
		const { mode, captchaType } = toRefs(props);
		const { proxy } = getCurrentInstance();
		const { t } = useI18n();
		let secretKey = ref(''), //后端返回的ase加密秘钥
			checkNum = ref(3), //默认需要点击的字数
			fontPos = reactive([]), //选中的坐标信息
			checkPosArr = reactive([]), //用户点击的坐标
			num = ref(1), //点击的记数
			pointBackImgBase = ref(''), //后端获取到的背景图片
			poinTextList = reactive([]), //后端返回的点击字体顺序
			backToken = ref(''), //后端返回的token值
			setSize = reactive({
				imgHeight: 0,
				imgWidth: 0,
				barHeight: 0,
				barWidth: 0,
			}),
			tempPoints = reactive([]),
			text = ref(''),
			barAreaColor = ref(undefined),
			barAreaBorderColor = ref(undefined),
			showRefresh = ref(true),
			bindingClick = ref(true);

		const init = () => {
			//加载页面
			fontPos.splice(0, fontPos.length);
			checkPosArr.splice(0, checkPosArr.length);
			num.value = 1;
			getPictrue();
			nextTick(() => {
				let { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy);
				setSize.imgHeight = imgHeight;
				setSize.imgWidth = imgWidth;
				setSize.barHeight = barHeight;
				setSize.barWidth = barWidth;
				proxy.$parent.$emit('ready', proxy);
			});
		};
		onMounted(() => {
			// 禁止拖拽
			init();
			proxy.$el.onselectstart = function () {
				return false;
			};
		});
		const canvas = ref(null);
		const canvasClick = (e) => {
			checkPosArr.push(getMousePos(canvas, e));
			if (num.value == checkNum.value) {
				num.value = createPoint(getMousePos(canvas, e));
				//按比例转换坐标值
				let arr = pointTransfrom(checkPosArr, setSize);
				checkPosArr.length = 0;
				checkPosArr.push(...arr);
				//等创建坐标执行完
				setTimeout(() => {
					// var flag = this.comparePos(this.fontPos, this.checkPosArr);
					//发送后端请求
					var captchaVerification = secretKey.value
						? aesEncrypt(backToken.value + '---' + JSON.stringify(checkPosArr), secretKey.value)
						: backToken.value + '---' + JSON.stringify(checkPosArr);
					let data = {
						captchaType: captchaType.value,
						pointJson: secretKey.value ? aesEncrypt(JSON.stringify(checkPosArr), secretKey.value) : JSON.stringify(checkPosArr),
						token: backToken.value,
					};
					reqCheck(data).then((response) => {
						let res = response.data;
						if (res.repCode == '0000') {
							barAreaColor.value = '#4cae4c';
							barAreaBorderColor.value = '#5cb85c';
							text.value = t('verify.points.success');
							bindingClick.value = false;
							showRefresh.value = false;
							if (mode.value == 'pop') {
								setTimeout(() => {
									proxy.$parent.clickShow = false;
									refresh();
								}, 1500);
							}
							setTimeout(() => {
								text.value = '';
								proxy.$parent.$parent.closeBox();
								proxy.$parent.$parent.$emit('success', { captchaVerification });
							}, 1000);
						} else {
							proxy.$parent.$parent.$emit('error', proxy);
							barAreaColor.value = '#d9534f';
							barAreaBorderColor.value = '#d9534f';
							text.value = t('verify.points.fail');
							setTimeout(() => {
								refresh();
							}, 700);
						}
					});
				}, 400);
			}
			if (num.value < checkNum.value) {
				num.value = createPoint(getMousePos(canvas, e));
			}
		};
		//获取坐标
		const getMousePos = function (obj, e) {
			var x = e.offsetX;
			var y = e.offsetY;
			return { x, y };
		};
		//创建坐标点
		const createPoint = function (pos) {
			tempPoints.push(Object.assign({}, pos));
			return num.value + 1;
		};
		const refresh = function () {
			tempPoints.splice(0, tempPoints.length);
			barAreaColor.value = '#000';
			barAreaBorderColor.value = '#ddd';
			bindingClick.value = true;
			fontPos.splice(0, fontPos.length);
			checkPosArr.splice(0, checkPosArr.length);
			num.value = 1;
			getPictrue();
			text.value = t('verify.points.fail');
			showRefresh.value = true;
		};

		// 请求背景图片和验证图片
		function getPictrue() {
			let data = {
				captchaType: captchaType.value,
			};
			reqGet(data).then((response) => {
				let res = response.data;
				if (res.repCode == '0000') {
					pointBackImgBase.value = res.repData.originalImageBase64;
					backToken.value = res.repData.token;
					secretKey.value = res.repData.secretKey;
					poinTextList.value = res.repData.wordList;
					// 使用国际化 + 关键字彩色高亮
					const wordsStr = poinTextList.value.join(',');
					const highlightWords = `<span class="text-blue-600 dark:text-blue-400 font-semibold">${wordsStr}</span>`;
					text.value = t('verify.points.explain', { words: highlightWords });
				} else {
					text.value = res.repMsg;
				}
			});
		}
		//坐标转换函数
		const pointTransfrom = function (pointArr, imgSize) {
			var newPointArr = pointArr.map((p) => {
				let x = Math.round((310 * p.x) / parseInt(imgSize.imgWidth));
				let y = Math.round((155 * p.y) / parseInt(imgSize.imgHeight));
				return { x, y };
			});
			return newPointArr;
		};
		return {
			secretKey,
			checkNum,
			fontPos,
			checkPosArr,
			num,
			pointBackImgBase,
			poinTextList,
			backToken,
			setSize,
			tempPoints,
			text,
			barAreaColor,
			barAreaBorderColor,
			showRefresh,
			bindingClick,
			init,
			canvas,
			canvasClick,
			getMousePos,
			createPoint,
			refresh,
			getPictrue,
			pointTransfrom,
		};
	},
};
</script>
