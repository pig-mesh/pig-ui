import {ElMessage} from "element-plus";


interface MessageImplements {
    info(title: string): void;
    wraning(title: string): void;
    success(title: string): void;
    error(title: string): void;
}

export function useMessage(){

    class MessageClass implements MessageImplements {
        // 普通提示
        info(title: string): void {
            ElMessage.info(title)
        }

        // 警告提示
        wraning(title: string): void {
            ElMessage.warning(title)
        }

        // 成功提示
        success(title: string): void {
            ElMessage.success(title)
        }

        // 错误提示
        error(title: string): void {
            ElMessage.error(title)
        }
    }

    return  new MessageClass()
}


