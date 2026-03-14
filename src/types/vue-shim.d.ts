import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '/@/utils/formatTime';

declare module 'vue' {
	interface ComponentCustomProperties {
		parseTime: typeof parseTime;
		parseDate: typeof parseDate;
		dateTimeStr: typeof dateTimeStr;
		dateStr: typeof dateStr;
		timeStr: typeof timeStr;
		baseURL: string;
	}
}

// It's important to export something, even if it's an empty object,
// to make this file a module and ensure the augmentations are applied.
export {};
