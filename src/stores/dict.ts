import {defineStore} from "pinia";


export const dict = defineStore('dict',{
    state: () => ({
        dict: [] as any[]
    }),
    actions:{
        getDict(_key:String){
            if (_key == null && _key == "") {
                return null;
            }
            try {
                for (let i = 0; i < this.dict.length; i++) {
                    if (this.dict[i].key == _key) {
                        return this.dict[i].value;
                    }
                }
            } catch (e) {
                return null;
            }
        },
        // 设置字典
        setDict(_key:String, value: Object) {
            if (_key !== null && _key !== "") {
                this.dict.push({
                    key: _key,
                    value: value
                });
            }
        },
        // 删除字典
        removeDict(_key: string) {
            var bln = false;
            try {
                for (let i = 0; i < this.dict.length; i++) {
                    if (this.dict[i].key == _key) {
                        this.dict.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        },
    }

})
