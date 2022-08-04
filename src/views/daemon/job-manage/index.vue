<template>
  <div class="jobIndex">
    <basic-container>
      <avue-crud ref="crud"
                 v-model:page="page"
                 v-model="form"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @row-save="save"
                 @row-update="update"
                 @refresh-change="refreshChange"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @search-change="handleFilter"
                 @search-reset="handleSearchReset">
        <template #jobStatus="scope">
          <div v-if="scope.row.jobStatus === '1'">
            <el-tag type="info">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
          <div v-else-if="scope.row.jobStatus === '2'">
            <el-tag type="success">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
          <div v-else-if="scope.row.jobStatus === '3'">
            <el-tag type="danger">{{ getDicNameJobStatus(scope.row.jobStatus) }}</el-tag>
          </div>
        </template>
        <template #jobExecuteStatus="scope">
          <div v-if="scope.row.jobExecuteStatus === '0'">
            <el-tag type="success">{{ getDicNameJobExecuteStatus(scope.row.jobExecuteStatus) }}</el-tag>
          </div>
          <div v-else>
            <el-tag type="danger">{{ getDicNameJobExecuteStatus(scope.row.jobExecuteStatus) }}</el-tag>
          </div>
        </template>
        <template #cronExpressionForm="{}">
          <div class="cron">
            <el-popover v-model="cronPopover">
              <cron i18n="cn"
                    @change="changeCron"
                    @close="cronPopover=false" />
              <template #reference>
                <el-input v-model="form.cronExpression"
                          placeholder="请输入定时策略"
                          @click="cronPopover=true" />
              </template>

            </el-popover>
          </div>
        </template>
        <template #menuLeft="{}">
          <el-button v-if="permissions.job_sys_job_add"
                     type="primary"
                     @click="handleAdd">
            新建任务
          </el-button>
          <el-tooltip content="暂停全部运行状态的定时任务"
                      placement="top">
            <el-button v-if="permissions.job_sys_job_shutdown_job"
                       type="warning"
                       @click="shutdownJobs">
              暂停全部任务
            </el-button>
          </el-tooltip>
          <el-tooltip content="启动全部暂停状态的定时任务"
                      placement="top">
            <el-button v-if="permissions.job_sys_job_start_job"
                       type="success"
                       @click="startJobs">
              启动全部任务
            </el-button>
          </el-tooltip>
          <el-tooltip content="谨慎使用"
                      placement="top">
            <el-button v-if="permissions.job_sys_job_refresh_job"
                       type="danger"
                       @click="refreshJobs">重置全部任务
            </el-button>
          </el-tooltip>
        </template>
        <template #menu="scope">
          <el-button type="text"
                     icon="el-icon-info"
                     @click="handleJobLog(scope.row)">日志
          </el-button>
          <el-button v-if="permissions.job_sys_job_start_job"
                     type="text"
                     icon="el-icon-caret-right"
                     @click="handleStartJob(scope.row)">启动
          </el-button>

          <el-button v-if="permissions.job_sys_job_shutdown_job"
                     type="text"
                     icon="el-icon-error"
                     @click="handleShutDownJob(scope.row)">暂停
          </el-button>
          <el-button v-if="permissions.job_sys_job_edit"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row,scope.index)">修改
          </el-button>
          <el-button v-if="permissions.job_sys_job_run_job"
                     type="text"
                     icon="el-icon-s-promotion"
                     @click="handleRunJob(scope.row)">执行
          </el-button>
          <el-button v-if="permissions.job_sys_job_del"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row,scope.index)">删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <jobLog v-if="dialogFormVisible"
            ref="logRef"></jobLog>
  </div>

</template>

<script>
import {
  addObj, delObj, fetchList, isValidTaskName, putObj, refreshJobsRa,
  runJobRa, shutDownJobRa, shutdownJobsRa, startJobRa, startJobsRa
} from '@/api/daemon/sys-job'
import { tableOption } from '@/const/crud/daemon/sys-job'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import { cron } from 'vue-cron'
import jobLog from './job-log.vue'

export default {
  name: 'jobIndex',
  components: { cron, jobLog },
  data () {
    return {
      form: {},
      cronPopover: false,
      queryParams: {}, // 全局检索条件
      tableData: [],
      dialogFormVisible: false,
      jobId: '',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条,
      },
      tableLoading: false,
      tableOption: tableOption,
      JobExecuteStatusDicCache: [],
      JobStatusDicCache: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted: function () {
    this.getDicJobExecuteStatusCache('job_execute_status')// 获取定时任务运行时状态
    this.getDicJobStatusCache('job_status')// 获取定时任务状态
  },
  methods: {
    changeCron (val) {
      this.form.cronExpression = val
    },
    /**
     * 定时任务分页查询
     */
    getList () {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: this.page.currentPage,
        size: this.page.pageSize
      }, this.queryParams)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    /**
     * 清除全局检索条件
     */
    handleSearchReset () {
      this.queryParams = {}
    },
    /**
     * 定时任务检索查询分页查询
     */
    handleFilter (params, done) {
      this.queryParams = params
      this.page.currentPage = 1
      this.getList(this.page)
      done()
    },
    /**
     * 启动定时任务
     */
    handleStartJob (row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$confirm(
          '即将发布或启动(任务名称:' + row.jobName + '), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          startJobRa(row.jobId).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.$notify({
                title: '成功',
                message: '启动成功',
                type: 'success'
              })
              this.refreshChange()
            }
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '启动失败'
            })
          })
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '定时任务已运行'
        })
      }
    },
    /**
     * 执行定时任务
     */
    handleRunJob (row) {
      this.$confirm(
        '立刻执行一次任务(任务名称:' + row.jobName + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        runJobRa(row.jobId).then(response => {
          const code = response.data.code
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '执行成功',
              type: 'success'
            })
            this.refreshChange()
          }
        }).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '执行失败'
          })
        })
      })

    },
    handleAdd () {
      this.$refs.crud.rowAdd()
    },
    handleUpdate (row, index) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$refs.crud.rowEdit(row, index)
      } else {
        this.$notify.error({
          title: '错误',
          message: '运行中定时任务不可修改，请先暂停后操作'
        })
      }
    },
    /**
     * 暂停定时任务
     */
    handleShutDownJob (row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '2') {
        this.$confirm(
          '即将暂停(任务名称:' + row.jobName + '), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          shutDownJobRa(row.jobId).then(response => {
            const code = response.data.code
            if (code === 0) {
              this.getList(this.page)
              this.$notify({
                title: '成功',
                message: '暂停成功',
                type: 'success'
              })
            }
            this.refreshChange()
          }).catch(() => {
            this.$notify.error({
              title: '错误',
              message: '暂停失败'
            })
          })
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: '已暂停，不要重复操作'
        })
      }
    },
    /**
     * 刷新回调
     */
    refreshChange () {
      this.getList(this.page)
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange (current) {
      this.page.currentPage = current
    },
    shutdownJobs () {
      this.$confirm(
        '即将暂停全部运行中定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        shutdownJobsRa().then(response => {
          const code = response.data.code
          const data = response.data.data
          if (code === 0) {
            this.getList(this.page)
            this.$notify.success(data)
          } else {
            this.$notify.error('暂停失败')
          }
        }).catch(() => {
          this.$notify.error('暂停失败')
        })
      })
    },
    /**
     * 启动全部暂停定时任务
     */
    startJobs () {
      this.$confirm(
        '即将启动全部暂定中定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        startJobsRa().then(response => {
          const code = response.data.code
          if (code === 0) {
            this.getList(this.page)
            this.$notify.success('启动成功')
          } else {
            this.$notify.error('启动失败')
          }
        }).catch(() => {
          this.$notify.error('启动失败')
        })
      })
    },
    /**
     * 刷新定时任务
     */
    refreshJobs () {
      this.$confirm(
        '即将刷新全部定时任务, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        refreshJobsRa().then(response => {
          const code = response.data.code
          if (code === 0) {
            this.getList(this.page)
            this.$notify.success('重置成功')
          } else {
            this.$notify.error('重置失败')
          }
        }).catch(() => {
          this.$notify.error('重置失败')
        }
        )
      })
    },
    /**
     * 新增定时任务持久化处理
     */
    save (row, done, loading) {
      isValidTaskName({
        'jobName': row.jobName,
        'jobGroup': row.jobGroup
      }).then(response => {
        const result = response.data.code
        if (result !== 0) {
          this.$notify.error('任务名称与任务组重复，请确认后重新添加')
        } else {
          addObj(row).then(() => {
            this.$notify.success('创建成功')
            this.getList(this.page)
          }).catch(() => {
            loading()
          })
        }
        done()
      })
    },
    /**
     * 更新定时任务持久化处理
     */
    update (row, index, done, loading) {
      putObj(row).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    },
    /**
     * 删除定时任务持久化处理
     */
    handleDelete (row) {
      const jobStatus = row.jobStatus
      if (jobStatus === '1' || jobStatus === '3') {
        this.$confirm('是否确认删除(任务名称:' + row.jobName + '), 是否继续?删除后不可恢复', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.jobId)
        }).then(() => {
          this.getList(this.page)
          this.$notify.success('删除成功')
        }).catch(function () {
        })
      } else {
        this.$notify.error('运行中定时任务不可删除，请先暂停后操作')
      }
    },
    handleJobLog (row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.logRef.getJobLog(row)
      })
    },
    /**
     * 获取字典显示名称并缓存
     */
    getDicJobExecuteStatusCache (type) {
      remote(type).then(response => {
        const code = response.data.code
        if (code === 0) {
          const _data = response.data.data
          this.JobExecuteStatusDicCache = _data
        }
      })
    },
    /**
     * 获取字典显示名称并缓存
     */
    getDicJobStatusCache (type) {
      remote(type).then(response => {
        const code = response.data.code
        if (code === 0) {
          const _data = response.data.data
          this.JobStatusDicCache = _data
        }
      })
    },
    /**
     * 获取字典定时任务执行状态字典值显示名称
     */
    getDicNameJobExecuteStatus (value) {
      let re = ''
      this.JobExecuteStatusDicCache.forEach(obj => {
        if (obj.value === value) {
          re = obj.label
          return
        }
      })
      return re
    },
    /**
     * 获取字典定时任务状态字典值显示名称
     */
    getDicNameJobStatus (value) {
      let re = ''
      this.JobStatusDicCache.forEach(obj => {
        if (obj.value === value) {
          re = obj.label
          return
        }
      })
      return re
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
