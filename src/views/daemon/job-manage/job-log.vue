<template>
  <div class="jobLog">
    <basic-container>
      <el-dialog v-model="dialogFormVisible"
                 title="执行日志"
                 width="90%"
                 @close="closeJobLogDialog">
        <avue-crud ref="crudLog"
                   v-model:page="pageLog"
                   :data="tableLogData"
                   :option="tableLogOption"
                   :table-loading="tableLogLoading"
                   @on-load="getJobLogList"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   @refresh-change="refreshChange">
        </avue-crud>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { fetchLogList } from "@/api/daemon/sys-job";
import { tableLogOption } from "@/const/crud/daemon/sys-job";
import { mapGetters } from "vuex";

export default {
  name: "jobLog",
  data () {
    return {
      tableLogData: [],
      dialogFormVisible: false,
      jobId: "",
      pageLog: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条,
      },
      tableLogLoading: false,
      tableLogOption: tableLogOption
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  mounted: function () { },
  methods: {
    init () {
      this.dialogFormVisible = true;
      this.getJobLogList(this.pageLog);
    },
    getJobLog (row) {
      this.dialogFormVisible = true;
      this.tableLogLoading = true;
      this.jobId = row.jobId;
      this.getJobLogList(this.pageLog);
    },
    getJobLogList (page) {
      fetchLogList(
        Object.assign(
          {
            descs: "create_time",
            current: page.currentPage,
            size: page.pageSize
          },
          { jobId: this.jobId }
        )
      ).then(response => {
        this.tableLogData = response.data.data.records;
        this.pageLog.total = response.data.data.total;
        this.pageLog.pageSize = response.data.data.size;
        this.tableLogLoading = false;
      });
    },
    sizeChange (pageSize) {
      this.pageLog.pageSize = pageSize;
    },
    currentChange (current) {
      this.pageLog.currentPage = current;
    },
    refreshChange () {
      this.getJobLogList(this.pageLog);
    },
    closeJobLogDialog () {
      this.jobId = "";
      this.pageLog.total = 0;
      this.pageLog.currentPage = 1;
      this.pageLog.pageSize = 10;
    }
  }
};
</script>
