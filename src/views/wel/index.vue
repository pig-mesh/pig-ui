<template>
  <div>
    <basic-container>
      <div class="banner-text">
        <span>
          <a href="https://avue.top/#/pay" target="_blank">
            <img src="https://img.shields.io/badge/Avue-2.6.15-green.svg" alt="Build Status">
          </a>
          <img src="https://img.shields.io/badge/Spring%20Boot-2.5.2.RELEASE-yellowgreen.svg" alt="Downloads">
          <img src="https://img.shields.io/badge/Spring%20Cloud-2020.0.3-blue.svg" alt="Coverage Status">
        </span>
        <br>

        <span>
          <el-collapse v-model="activeNames">
            <el-collapse-item  name="1">
              <div>基于Spring Cloud Gateway</div>
              <div>基于Spring Cloud 2020.0.3</div>
              <div>基于Spring Boot 2.5.2.RELEASE</div>
              <div>基于Spring Cloud Alibaba 2021</div>
            </el-collapse-item>
            <el-collapse-item  name="2">
              <div>基于Spring Security OAuth实现鉴权体系；</div>
              <div>深度定制，支持全流程的登录授权，Server Resource</div>
            </el-collapse-item>
            <el-collapse-item  name="3">
              <div>支持docker部署</div>
              <div>支持Rancher2 + Kubernetes部署</div>
              <div>支持企业Paas Rainbond 部署</div>
            </el-collapse-item>
            <el-collapse-item  name="4">
              <div>基于开源LCN 分布式事务解决方案深度定制</div>
              <div>完美兼容2.X，优化集群部署，提升性能</div>
            </el-collapse-item>
            <el-collapse-item  name="5">
              <div>扩展Spring Cache无缝兼容</div>
              <div>支持开发过程无感知</div>
            </el-collapse-item>
            <el-collapse-item  name="6">
              <div>基于activiti5.22整合OAuth2</div>
              <div>支持在线流程设计</div>
            </el-collapse-item>
            <el-collapse-item name="7">
              <div>支持数据库存储SCG路由信息</div>
              <div>支持前端动态编辑</div>
            </el-collapse-item>
            <el-collapse-item  name="8">
              <div>单点登录</div>
              <div>扩展SBA支持服务监听事件redis保存</div>
              <div>扩展Turbine,定制展示UI</div>
              <div>扩展ResourceServer完全屏蔽实现细节开发更简单</div>
            </el-collapse-item>
          </el-collapse>
        </span>
      </div>

    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Wel',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      DATA: [],
      text: '',
      actor: '',
      count: 0,
      isText: false
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++
      } else {
        this.count = 0
      }
      this.isText = true
      this.actor = this.DATA[this.count]
    },
    setData() {
      let num = 0
      let count = 0
      let active = false
      const timeoutstart = 5000
      const timeoutend = 1000
      const timespeed = 10
      setInterval(() => {
        if (this.isText) {
          if (count == this.actor.length) {
            active = true
          } else {
            active = false
          }
          if (active) {
            num--
            this.text = this.actor.substr(0, num)
            if (num == 0) {
              this.isText = false
              setTimeout(() => {
                count = 0
                this.getData()
              }, timeoutend)
            }
          } else {
            num++
            this.text = this.actor.substr(0, num)
            if (num == this.actor.length) {
              this.isText = false
              setTimeout(() => {
                this.isText = true
                count = this.actor.length
              }, timeoutstart)
            }
          }
        }
      }, timespeed)
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .el-collapse-item__header {
    display: block !important;
  }

  .wel-contailer {
    position: relative;
  }

  .banner-text {
    position: relative;
    padding: 0 20px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    display: none;
  }

  .actor {
    height: 250px;
    overflow: hidden;
    font-size: 18px;
    color: #333;
  }

  .actor:after {
    content: '';
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: #333;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }
</style>
