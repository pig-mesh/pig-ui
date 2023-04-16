import * as components from '@element-plus/icons-vue';
import type { App } from 'vue';
export default {
	install: (app: App) => {
		for (const key in components) {
			const componentConfig = components[key];
			app.component(componentConfig.name, componentConfig);
		}
	},
};
