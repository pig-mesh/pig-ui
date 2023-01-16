<template>
  <div>
    <basic-container>
      <div class="banner-text">
        <span>
          <img src="https://img.shields.io/badge/Pig-3.6-success.svg" alt="Build Status">
          <img src="https://img.shields.io/badge/Spring%20Cloud-2021-blue.svg" alt="Coverage Status">
          <img src="https://img.shields.io/badge/Spring%20Boot-2.7-blue.svg" alt="Downloads">
          <img src="https://img.shields.io/badge/Vue-3.2-blue.svg" alt="Downloads">
          <img src="https://img.shields.io/github/license/pig-mesh/pig" />
        </span>
        <br />
        <span>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <div>基于Spring Cloud 2021</div>
              <div>基于Spring Boot 2.7.7</div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <div>支持docker部署</div>
              <div>支持Rancher2 + Kubernetes部署</div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <div>基于Spring Authorization Server 深度定制</div>
              <div>完美兼容2.X，优化集群部署，提升性能</div>
            </el-collapse-item>
            <el-collapse-item name="4">
              <div>深度定制 Spring Cloud Alibaba 便于开发使用</div>
              <div>完善监控流程，支持微服务全组件接入监控</div>
              <div><a href="https://pig4cloud.com" target="_blank">详细介绍</a></div>
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
  name: 'wel',
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
          if (count === this.actor.length) {
            active = true
          } else {
            active = false
          }
          if (active) {
            num--
            this.text = this.actor.substr(0, num)
            if (num === 0) {
              this.isText = false
              setTimeout(() => {
                count = 0
                this.getData()
              }, timeoutend)
            }
          } else {
            num++
            this.text = this.actor.substr(0, num)
            if (num === this.actor.length) {
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
