<template>
  <div class="wx-voice-div" @click="playVoice">
    <i :class="playing !== true ? 'el-icon-video-play' : 'el-icon-video-pause'">
      <span class="amr-duration" v-if="duration">{{ duration }} 秒</span>
    </i>
    <div v-if="content">
      <el-tag type="success" size="mini">语音识别</el-tag>
      {{ content }}
    </div>
  </div>
</template>

<script>
// 因为微信语音是 amr 格式，所以需要用到 amr 解码器：https://www.npmjs.com/package/benz-amr-recorder
const BenzAMRRecorder = require('benz-amr-recorder')

export default {
  name: 'wxVoicePlayer',
  props: {
    url: {
      // 语音地址，例如说：https://www.iocoder.cn/xxx.amr
      type: String,
      required: true,
    },
    content: {
      // 语音文本
      type: String,
      required: false,
    },
  },
  data() {
    return {
      amr: undefined, // BenzAMRRecorder 对象
      playing: false, // 是否在播放中
      duration: undefined, // 播放时长
    }
  },
  methods: {
    playVoice() {
      debugger
      // 情况一：未初始化，则创建 BenzAMRRecorder
      if (this.amr === undefined) {
        this.amrInit()
        return
      }

      if (this.amr.isPlaying()) {
        this.amrStop()
      } else {
        this.amrPlay()
      }
    },
    amrInit() {
      const amr = new BenzAMRRecorder()
      this.amr = amr
      // 设置播放
      const that = this
      amr.initWithUrl(this.url).then(function () {
        that.amrPlay()
        that.duration = amr.getDuration()
      })
      // 监听暂停
      amr.onEnded(function () {
        that.playing = false
      })
    },
    amrPlay() {
      this.playing = true
      this.amr.play()
    },
    amrStop() {
      this.playing = false
      this.amr.stop()
    },
  },
}
</script>

<style lang="scss" scoped>
.wx-voice-div {
  padding: 5px;
  background-color: #eaeaea;
  border-radius: 10px;
}
.amr-duration {
  font-size: 11px;
  margin-left: 5px;
}
</style>
