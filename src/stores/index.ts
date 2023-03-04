// https://pinia.vuejs.org/
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

// 创建
const pinia = createPinia();
pinia.use(piniaPluginPersist);

// 导出
export default pinia;
