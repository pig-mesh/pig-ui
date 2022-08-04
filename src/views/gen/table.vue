<template>
  <basic-container>
    <avue-crud ref="crud"
               v-model:page="page"
               :data="tableData"
               :table-loading="tableLoading"
               :option="tableOption"
               @on-load="getList"
               @refresh-change="refreshChange"
               @size-change="sizeChange"
               @current-change="currentChange">
    </avue-crud>
  </basic-container>

</template>
<script>
import { getGenTable } from '@/api/gen/gen'
import { tableColumnOption } from '@/const/crud/gen/gen'

export default {
  name: "GenEdit",
  props: {
    queryData: {}
  },
  data () {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableColumnOption
    };
  },
  methods: {
    getList (page) {
      this.tableLoading = true
      getGenTable(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, this.queryData)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange (current) {
      this.page.currentPage = current
    },
    refreshChange () {
      this.getList(this.page)
    }
  }
};
</script>
