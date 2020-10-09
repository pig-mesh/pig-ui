<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="item in data" :key="item.k" :lazy="true" :label="item.k" :name="item.k">
      <Java :value="item.v" height="600px"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import Java from '@/components/editor/index'
  import {preview} from '@/api/gen/gen'

  export default {
    name: 'Preview',
    components: {Java},
    props: {
      queryData: {}
    },
    data() {
      return {
        data: [], height: '', activeName: 'Entity.java'
      }
    },
    created() {
      preview(this.queryData).then(res => {
        let map = res.data.data

        for (let key in map) {
          let k = key.replace(/^template\/|.vm$/g, '')
          let v = map[key]
          let obj = {k,v}
          this.data.push(obj)
        }
      })
    }
  }
</script>
