import {defineStore} from "pinia";


export const useMsg = defineStore('msg', {
    state: () => ({
        msgArray: [] as any[]
    }),
    actions: {
        getAllMsg() {
            console.log("2", this.msgArray)
            return this.msgArray
        },
        // 设置字典
        setMsg(value: Object) {
            this.msgArray.push(value)
            console.log("1", this.msgArray)
        },
        // 删除字典
        removeAll() {
            this.msgArray = []
        },
    }

})
