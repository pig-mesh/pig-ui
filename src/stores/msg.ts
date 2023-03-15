import { defineStore } from 'pinia';

export const useMsg = defineStore('msg', {
	state: () => ({
		msgArray: [] as any[],
	}),
	actions: {
		getAllMsg() {
			return this.msgArray;
		},
		setMsg(value: Object) {
			this.msgArray.push(value);
		},
		removeAll() {
			this.msgArray = [];
		},
	},
});
