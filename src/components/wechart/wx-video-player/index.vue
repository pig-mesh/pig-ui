<template>
  <div>
    <div v-if="!outTime" @click="playVideo()"><i class="el-icon-video-camera" style="font-size: 40px!important;"></i>
    </div>
    <div v-if="outTime">
      <i class="el-icon-video-play shipin-i"></i>
      <p />
      <i class="el-icon-time">该视频已过期</i>
    </div>
    <el-dialog
        v-loading="state.mainLoading"
        title="视频播放"
        v-model="state.dialogVideo"
        width="40%"
        append-to-body>
      <video-player
          v-if="state.playerOptions.sources[0].src"
          ref="videoPlayer"
          class="video-player vjs-custom-skin"
          :options="state.playerOptions"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
      >
      </video-player>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="wx-video-player">


const props = defineProps({
  objData: {
    type: Object,
    default: () => ({})
  }
})

const state = reactive({
  dialogVideo: false,
  outTime: false,
  mainLoading: false,
  playerOptions: {
    autoplay: true, //如果true,浏览器准备好时开始自动播放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: false, // 导致视频一结束就重新开始。
    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: 'zh-CN',
    aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    sources: [{
      type: 'video/mp4',
      src: '' //你的视频地址（必填）
    }],
    controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      fullscreenToggle: true //全屏按钮
    },
    width: document.documentElement.clientWidth,
    notSupportedMessage: '此视频暂无法播放，请稍后再试' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
  }
})


const playVideo = () => {
  state.dialogVideo = true
  getVideo()
}

const getVideo = () =>  {
  if (props.objData.type === '2') {
    // asdasd



  }else if(props.objData.type === '1'){
    //asdasd



  }
}

const onPlayerPlay = (e) => {
  console.log(e,'eee')

}

const onPlayerPause = (e) => {
  console.log(e, 'eee')

}




</script>

<style scoped>

</style>
