<template>
	<canvas
		id="canvas"
		@mousedown="mouseDown"
		@mousemove="mouseMove"
		@mouseup="mouseUp"
		@touchstart="touchStart"
		@touchmove="touchMove"
		@touchend="touchEnd"
	></canvas>
</template>

<script lang="ts" setup>
const props = defineProps({
	width: {
		type: Number,
		default: 800,
	},
	height: {
		type: Number,
		default: 300,
	},
	lineWidth: {
		type: Number,
		default: 4,
	},
	lineColor: {
		type: String,
		default: '#000000',
	},
	bgColor: {
		type: String,
		default: '',
	},
	isCrop: {
		type: Boolean,
		default: false,
	},
	isClearBgColor: {
		type: Boolean,
		default: true,
	},
});
let canvas: any = null; //document.getElementById('canvas')
let hasDrew = false;
let resultImg = '';
let points: any = [];
let canvasTxt: any = null;
let startX = 0;
let startY = 0;
let isDrawing = false;
let sratio: any = 1;

onBeforeMount(() => {
	window.addEventListener('resize', resizeHandler);
});
onUnmounted(() => {
	window.removeEventListener('resize', resizeHandler);
});

onMounted(() => {
	//   const canvas = this.$refs.canvas
	canvas = document.getElementById('canvas');
	canvas.height = props.height;
	canvas.width = props.width;
	canvas.style.background = myBg.value;
	resizeHandler();
	// 在画板以外松开鼠标后冻结画笔
	document.onmouseup = () => {
		isDrawing = false;
	};
});

const ratio: any = computed(() => {
	return props.height / props.width;
});

const stageInfo: any = computed(() => {
	return canvas.getBoundingClientRect();
});
const myBg = computed(() => {
	return props.bgColor ? props.bgColor : 'rgba(255, 255, 255, 0)';
});

watch(myBg, (newVal) => {
	console.log('bg change', newVal);
	canvas.style.background = newVal;
});

const resizeHandler = () => {
	canvas.style.width = props.width + 'px';
	const realw = parseFloat(window.getComputedStyle(canvas).width);
	canvas.style.height = ratio.value * realw + 'px';
	canvasTxt = canvas.getContext('2d');
	canvasTxt.scale(1 * sratio, 1 * sratio);
	sratio = realw / props.width;
	canvasTxt.scale(1 / sratio, 1 / sratio);
};
// pc
const mouseDown = (e) => {
	e = e || event;
	e.preventDefault();
	isDrawing = true;
	hasDrew = true;
	let obj = {
		x: e.offsetX,
		y: e.offsetY,
	};
	drawStart(obj);
};
const mouseMove = (e) => {
	e = e || event;
	e.preventDefault();
	if (isDrawing) {
		let obj = {
			x: e.offsetX,
			y: e.offsetY,
		};
		drawMove(obj);
	}
};
const mouseUp = (e) => {
	e = e || event;
	e.preventDefault();
	let obj = {
		x: e.offsetX,
		y: e.offsetY,
	};
	drawEnd(obj);
	isDrawing = false;
};
// mobile
const touchStart = (e) => {
	e = e || event;
	e.preventDefault();
	hasDrew = true;
	if (e.touches.length === 1) {
		let obj = {
			x: e.targetTouches[0].clientX - canvas.getBoundingClientRect().left,
			y: e.targetTouches[0].clientY - canvas.getBoundingClientRect().top,
		};
		drawStart(obj);
	}
};
const touchMove = (e) => {
	e = e || event;
	e.preventDefault();
	if (e.touches.length === 1) {
		let obj = {
			x: e.targetTouches[0].clientX - canvas.getBoundingClientRect().left,
			y: e.targetTouches[0].clientY - canvas.getBoundingClientRect().top,
		};
		drawMove(obj);
	}
};
const touchEnd = (e) => {
	e = e || event;
	e.preventDefault();
	if (e.touches.length === 1) {
		let obj = {
			x: e.targetTouches[0].clientX - canvas.getBoundingClientRect().left,
			y: e.targetTouches[0].clientY - canvas.getBoundingClientRect().top,
		};
		drawEnd(obj);
	}
};
// 绘制
const drawStart = (obj) => {
	startX = obj.x;
	startY = obj.y;
	canvasTxt.beginPath();
	canvasTxt.moveTo(startX, startY);
	canvasTxt.lineTo(obj.x, obj.y);
	canvasTxt.lineCap = 'round';
	canvasTxt.lineJoin = 'round';
	canvasTxt.lineWidth = props.lineWidth * sratio;
	canvasTxt.stroke();
	canvasTxt.closePath();
	points.push(obj);
};
const drawMove = (obj) => {
	canvasTxt.beginPath();
	canvasTxt.moveTo(startX, startY);
	canvasTxt.lineTo(obj.x, obj.y);
	canvasTxt.strokeStyle = props.lineColor;
	canvasTxt.lineWidth = props.lineWidth * sratio;
	canvasTxt.lineCap = 'round';
	canvasTxt.lineJoin = 'round';
	canvasTxt.stroke();
	canvasTxt.closePath();
	startY = obj.y;
	startX = obj.x;
	points.push(obj);
};
const drawEnd = (obj) => {
	canvasTxt.beginPath();
	canvasTxt.moveTo(startX, startY);
	canvasTxt.lineCap = 'round';
	canvasTxt.lineJoin = 'round';
	canvasTxt.stroke();
	canvasTxt.closePath();
	points.push(obj);
	points.push({ x: -1, y: -1 });
};
// 操作
const generate = () => {
	const pm = new Promise((resolve, reject) => {
		if (!hasDrew) {
			reject(`Warning: Not Signned!`);
			return;
		}
		var resImgData = canvasTxt.getImageData(0, 0, canvas.width, canvas.height);
		canvasTxt.globalCompositeOperation = 'destination-over';
		canvasTxt.fillStyle = myBg.value;
		canvasTxt.fillRect(0, 0, canvas.width, canvas.height);
		resultImg = canvas.toDataURL();
		var resultImg = resultImg;
		canvasTxt.clearRect(0, 0, canvas.width, canvas.height);
		canvasTxt.putImageData(resImgData, 0, 0);
		canvasTxt.globalCompositeOperation = 'source-over';
		if (props.isCrop) {
			const crop_area = getCropArea(resImgData.data);
			var crop_canvas: any = document.createElement('canvas');
			const crop_ctx: any = crop_canvas.getContext('2d');
			crop_canvas.width = crop_area[2] - crop_area[0];
			crop_canvas.height = crop_area[3] - crop_area[1];
			const crop_imgData = canvasTxt.getImageData(...crop_area);
			crop_ctx.globalCompositeOperation = 'destination-over';
			crop_ctx.putImageData(crop_imgData, 0, 0);
			crop_ctx.fillStyle = myBg.value;
			crop_ctx.fillRect(0, 0, crop_canvas.width, crop_canvas.height);
			resultImg = crop_canvas.toDataURL();
			crop_canvas = null;
		}
		resolve(resultImg);
	});
	return pm;
};

const emits = defineEmits(['update:bgColor']);
const reset = () => {
	canvasTxt.clearRect(0, 0, canvas.width, canvas.height);
	if (props.isClearBgColor) {
		// this.$emit('update:bgColor', '')
		emits('update:bgColor', '');
		canvas.style.background = 'rgba(255, 255, 255, 0)';
	}
	points = [];
	hasDrew = false;
	resultImg = '';
};
const getCropArea = (imgData) => {
	var topX = canvas.width;
	var btmX = 0;
	var topY = canvas.height;
	var btnY = 0;
	for (var i = 0; i < canvas.width; i++) {
		for (var j = 0; j < canvas.height; j++) {
			var pos = (i + canvas.width * j) * 4;
			if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
				btnY = Math.max(j, btnY);
				btmX = Math.max(i, btmX);
				topY = Math.min(j, topY);
				topX = Math.min(i, topX);
			}
		}
	}
	topX++;
	btmX++;
	topY++;
	btnY++;
	const data = [topX, topY, btmX, btnY];
	return data;
};

defineExpose({ reset, generate });
</script>

<style scoped>
canvas {
	max-width: 100%;
	display: block;
}
</style>
