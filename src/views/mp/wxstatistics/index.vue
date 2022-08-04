<template>
  <basic-container>
    <el-row :span="24">
      <el-col :md="4">
        <el-row >
          <el-date-picker
            class="input_width"
            v-model="beginTime"
            placeholder="选择开始时间"
            @change="check">
          </el-date-picker>
        </el-row>
        <el-row>
          <el-date-picker
            class="input_width"
            v-model="endTime"
            placeholder="选择结束时间"
            @change="check">
          </el-date-picker>
        </el-row>
        <el-row>
          <avue-tree
            class="input_width"
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick"/>
        </el-row>
      </el-col>
      <el-col :md="20">
        <el-row>
          <el-col :span="12">
            <v-chart :options="userCumulate"/>
          </el-col>
          <el-col :span="12">
            <v-chart :options="interfaceSummary"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <v-chart :options="upstreamMsgDistMonth"/>
          </el-col>
          <el-col :span="12">
            <v-chart :options="userShard"/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </basic-container>
</template>

<style>
</style>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import { fetchAccountList, fetchStatistics } from '@/api/mp/wxaccount'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      beginTime: new Date() - 3600 * 1000 * 24 * 7,
      endTime: new Date() - 3600 * 1000 * 24,
      q: {
        interval: undefined,
        appId: undefined
      },
      treeOption: {
        nodeKey: 'id',
        addBtn: false,
        menu: false,
        props: {
          labelText: '标题',
          label: 'name',
          value: 'appid',
          children: 'children'
        }
      },
      treeData: [],
      userCumulate: {
        color: ['#409EFF'],
        title: {
          text: '用户分析数据'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 5// 设置线条粗细
              }
            }
          }
        }]
      },
      userShard: {
        color: ['#409EFF'],
        title: {
          text: '图文分享数据'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 5// 设置线条粗细
              }
            }
          }
        }]
      },
      upstreamMsgDistMonth: {
        color: ['#409EFF'],
        title: {
          text: '消息分析数据'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 5// 设置线条粗细
              }
            }
          }
        }]
      },
      interfaceSummary: {
        color: ['#409EFF'],
        tooltip: {
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '接口分析数据'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      }
    }
  },
  created() {
    this.getAccountList()
  },
  methods: {
    nodeClick(data) {
      this.check()
      this.q.appId = data.appid
      this.q.interval = new Date(this.beginTime).getTime() + '-' + new Date(this.endTime).getTime()
      fetchStatistics(this.q).then(response => {
        this.userCumulate.series[0].data = response.data.data[0]
        this.userCumulate.xAxis.data = response.data.data[4]
        this.userShard.series[0].data = response.data.data[1]
        this.userShard.xAxis.data = response.data.data[4]
        this.upstreamMsgDistMonth.series[0].data = response.data.data[2]
        this.upstreamMsgDistMonth.xAxis.data = response.data.data[4]
        this.interfaceSummary.series[0].data = response.data.data[3]
        this.interfaceSummary.xAxis.data = response.data.data[4]
      })
    },
    getAccountList() {
      fetchAccountList().then(response => {
        this.treeData = response.data.data
        // 默认选中第一个
        if (this.treeData.length > 0) {
          this.nodeClick(this.treeData[0])
        }
      })
    },
    check() {
      const start = new Date(this.beginTime)
      const end = new Date(this.endTime)

      if (end.getDate() >= new Date()) {
        this.$message.error('统计结束日小于，请重新选择')
        return false
      }

      if (end.getTime() - start.getTime() > 3600 * 1000 * 24 * 7) {
        this.$message.error('时间间隔7天以内，请重新选择')
        return false
      }
    }
  }
}
</script>

<style scoped>
  .input_width {
    width: 80%;
  }
</style>
