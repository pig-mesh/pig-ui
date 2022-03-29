import Vue from 'vue'
import DataDict from '@/util/dict'
import {remote} from '@/api/admin/dict'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'label',
        valueField: 'value',
        request(dictMeta) {
          return remote(dictMeta.type).then(res => res.data)
        },
      },
    },
  })
}

export default {
  install,
}
