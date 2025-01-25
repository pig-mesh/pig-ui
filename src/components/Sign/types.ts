export interface SignProps {
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

export interface Point {
	x: number;
	y: number;
}

export interface SignInstance {
	reset: () => void;
	generate: () => Promise<string>;
}
