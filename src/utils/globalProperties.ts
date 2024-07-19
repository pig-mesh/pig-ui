import {parseTime, parseDate, dateTimeStr, dateStr, timeStr} from './formatTime';
import {App} from "vue";

// 定义全局可以使用属性方法
export const properties = (app: App) => {
    app.config.globalProperties.parseTime = parseTime;
    app.config.globalProperties.parseDate = parseDate;
    app.config.globalProperties.dateTimeStr = dateTimeStr;
    app.config.globalProperties.dateStr = dateStr;
    app.config.globalProperties.timeStr = timeStr;
    app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;
};
