<template>
	<div class="sign-wrapper">
		<div v-show="!modelValue" class="sign-container">
			<canvas
				ref="canvasRef"
				@mousedown="handleMouseDown"
				@mousemove="handleMouseMove"
				@mouseup="handleMouseUp"
				@touchstart="handleTouchStart"
				@touchmove="handleTouchMove"
				@touchend="handleTouchEnd"
			></canvas>
		</div>
		<div v-if="!props.disabled && !modelValue" class="sign-controls">
			<el-space>
				<el-button type="primary" @click="handleGenerate">
					<el-icon><Check /></el-icon>
					确认签名
				</el-button>
				<el-button @click="handleReset">
					<el-icon><Refresh /></el-icon>
					清空
				</el-button>
				<div>
					<el-color-picker v-model="currentLineColor" size="small" />
				</div>
			</el-space>
		</div>
		<div v-if="modelValue" class="flex flex-col items-center sign-preview">
			<el-image :src="modelValue" fit="contain" />
			<div class="mt-2">
				<el-button @click="handleReset">
					<el-icon><Refresh /></el-icon>
					重新签名
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { Check, Refresh } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { Point } from './types';

interface Props {
	width?: number;
	height?: number;
	lineWidth?: number;
	lineColor?: string;
	bgColor?: string;
	isCrop?: boolean;
	isClearBgColor?: boolean;
	modelValue?: string;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	width: 300,
	height: 150,
	lineWidth: 2,
	lineColor: '#000000',
	bgColor: '',
	isCrop: false,
	isClearBgColor: true,
	modelValue: '',
	disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);
const hasDrew = ref(false);
const currentLineColor = ref(props.lineColor);
const points = ref<Point[]>([]);
const startPoint = ref<Point>({ x: 0, y: 0 });
const scaleRatio = ref(1);

const backgroundColor = computed(() => props.bgColor || 'rgba(255, 255, 255, 0)');

function initCanvas(): void {
	const canvas = canvasRef.value;
	if (!canvas) return;

	const container = canvas.parentElement;
	if (!container) return;

	// Set fixed dimensions
	canvas.width = props.width;
	canvas.height = props.height;

	// Set display dimensions
	canvas.style.width = `${props.width}px`;
	canvas.style.height = `${props.height}px`;
	canvas.style.background = backgroundColor.value;

	ctx.value = canvas.getContext('2d');
	if (ctx.value) {
		ctx.value.strokeStyle = currentLineColor.value;
		ctx.value.lineWidth = props.lineWidth;
		ctx.value.lineCap = 'round';
		ctx.value.lineJoin = 'round';
	}
}

function handleResize(): void {
	const canvas = canvasRef.value;
	if (!canvas || !ctx.value) return;

	// Keep the same dimensions
	canvas.width = props.width;
	canvas.height = props.height;

	ctx.value = canvas.getContext('2d');
	if (!ctx.value) return;

	ctx.value.strokeStyle = currentLineColor.value;
	ctx.value.lineWidth = props.lineWidth;
	ctx.value.lineCap = 'round';
	ctx.value.lineJoin = 'round';
}

function drawPoint(point: Point): void {
	if (!ctx.value) return;

	ctx.value.beginPath();
	ctx.value.moveTo(startPoint.value.x, startPoint.value.y);
	ctx.value.lineTo(point.x, point.y);
	ctx.value.strokeStyle = currentLineColor.value;
	ctx.value.lineWidth = props.lineWidth * scaleRatio.value;
	ctx.value.lineCap = 'round';
	ctx.value.lineJoin = 'round';
	ctx.value.stroke();
	ctx.value.closePath();

	startPoint.value = point;
	points.value.push(point);
}

// Event handlers
function handleMouseDown(e: MouseEvent): void {
	if (props.disabled) return;

	e.preventDefault();
	isDrawing.value = true;
	hasDrew.value = true;

	const point = {
		x: e.offsetX,
		y: e.offsetY,
	};
	startPoint.value = point;
	points.value.push(point);
}

function handleMouseMove(e: MouseEvent): void {
	if (!isDrawing.value || props.disabled) return;

	e.preventDefault();
	drawPoint({
		x: e.offsetX,
		y: e.offsetY,
	});
}

function handleMouseUp(e: MouseEvent): void {
	if (props.disabled) return;

	e.preventDefault();
	isDrawing.value = false;
	points.value.push({ x: -1, y: -1 }); // Mark end of stroke
}

// Touch events
function handleTouchStart(e: TouchEvent): void {
	if (props.disabled || !canvasRef.value) return;

	e.preventDefault();
	hasDrew.value = true;

	const touch = e.touches[0];
	const rect = canvasRef.value.getBoundingClientRect();
	const point = {
		x: touch.clientX - rect.left,
		y: touch.clientY - rect.top,
	};

	startPoint.value = point;
	points.value.push(point);
}

function handleTouchMove(e: TouchEvent): void {
	if (props.disabled || !canvasRef.value) return;

	e.preventDefault();
	const touch = e.touches[0];
	const rect = canvasRef.value.getBoundingClientRect();

	drawPoint({
		x: touch.clientX - rect.left,
		y: touch.clientY - rect.top,
	});
}

function handleTouchEnd(e: TouchEvent): void {
	if (props.disabled) return;

	e.preventDefault();
	points.value.push({ x: -1, y: -1 }); // Mark end of stroke
}

// Actions
async function handleGenerate(): Promise<void> {
	try {
		const result = await generate();
		emit('update:modelValue', result);
	} catch (error) {
		ElMessage.warning('请先进行签名');
	}
}

function handleReset(): void {
	reset();
	emit('update:modelValue', '');
}

function generate(): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!hasDrew.value || !canvasRef.value || !ctx.value) {
			reject('请先进行签名');
			return;
		}

		const canvas = canvasRef.value;
		const context = ctx.value;

		// Save current drawing
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		// Add background
		context.globalCompositeOperation = 'destination-over';
		context.fillStyle = backgroundColor.value;
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Get result
		const result = canvas.toDataURL();

		// Restore original drawing
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.putImageData(imageData, 0, 0);
		context.globalCompositeOperation = 'source-over';

		resolve(result);
	});
}

function reset(): void {
	if (!ctx.value || !canvasRef.value) return;

	ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
	points.value = [];
	hasDrew.value = false;

	if (props.isClearBgColor) {
		canvasRef.value.style.background = 'rgba(255, 255, 255, 0)';
	}
}

// Lifecycle
onMounted(() => {
	initCanvas();
	window.addEventListener('resize', handleResize);
	document.addEventListener('mouseup', () => (isDrawing.value = false));
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', handleResize);
	document.removeEventListener('mouseup', () => (isDrawing.value = false));
});

// Watch
watch(
	() => backgroundColor.value,
	(newVal) => {
		if (canvasRef.value) {
			canvasRef.value.style.background = newVal;
		}
	}
);

defineExpose({ reset, generate });
</script>
