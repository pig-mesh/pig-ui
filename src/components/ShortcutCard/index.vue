<template>
	<div
		class="group relative flex flex-col items-center gap-1 px-1 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-black/[0.04] active:scale-95 dark:hover:bg-white/[0.06]"
		@click="$emit('click')"
	>
		<!-- Close Button -->
		<div
			v-if="closable"
			class="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-black/[0.08] text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:bg-red-500/15 hover:text-red-500 dark:bg-white/10 dark:hover:bg-red-500/20 dark:hover:text-red-400"
			@click.stop="$emit('close')"
		>
			<SvgIcon name="ele-Close" :size="10" />
		</div>

		<!-- Icon Container with Gradient -->
		<div
			class="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
			:style="iconStyle"
		>
			<SvgIcon :name="props.icon" :size="16" color="#ffffff" />
		</div>

		<!-- Label -->
		<span class="text-[11px] font-medium text-gray-600 text-center leading-tight break-words max-w-[68px] dark:text-gray-300">
			{{ $t(props.label) }}
		</span>
	</div>
</template>

<script setup lang="ts" name="shortcut">
const props = defineProps({
	icon: {
		type: String,
		default: 'menu-outlined',
	},
	label: {
		type: String,
		default: '快捷方式',
	},
	color: {
		type: String,
		default: '',
	},
	closable: {
		type: Boolean,
		default: true,
	},
});

defineEmits(['click', 'close']);

// Curated gradient color palette
const gradientMap: Record<string, { from: string; to: string }> = {
	purple: { from: '#7C3AED', to: '#A855F7' },
	blue: { from: '#3B82F6', to: '#60A5FA' },
	teal: { from: '#14B8A6', to: '#2DD4BF' },
	orange: { from: '#F97316', to: '#FB923C' },
	pink: { from: '#EC4899', to: '#F472B6' },
	indigo: { from: '#6366F1', to: '#818CF8' },
};

const colorKeys = Object.keys(gradientMap);

// Get consistent color based on label hash (not random)
const getColorKey = (): string => {
	if (props.color && gradientMap[props.color]) {
		return props.color;
	}
	// Hash the label to get consistent color
	let hash = 0;
	const str = props.label || 'default';
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colorKeys[Math.abs(hash) % colorKeys.length];
};

const iconStyle = computed(() => {
	const colorKey = getColorKey();
	const gradient = gradientMap[colorKey];
	return {
		background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
	};
});
</script>
