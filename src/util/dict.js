import { remote } from '@/api/admin/dict'
export default (app) => {
  app.mixin({
    data () {
      return {
        dict: {}
      }
    },
    created () {
      if (this.$options.dict) {
        let result = [];
        let list = this.$options.dict;
        list.forEach(ele => {
          result.push(new Promise(resolve => {
            let obj = {}
            obj[ele] = []
            remote(ele).then(res => {
              obj[ele] = res.data
              resolve(obj)
            }).catch(() => {
              resolve(obj)
            })
          }))
        })
        Promise.all(result).then(res => {
          res.forEach(ele => {
            this.dict = Object.assign(this.dict, ele)
          })
        })
      }
    }
  })
}