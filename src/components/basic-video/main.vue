<template>
  <div :style="styleName"
       class="basic-video">
    <div class="basic-video__border">
      <span :style="borderStyleName"></span>
      <span :style="borderStyleName"></span>
      <span :style="borderStyleName"></span>
      <span :style="borderStyleName"></span>
    </div>
    <img :style="imgStyleName"
         class="basic-video__img"
         :src="background" />
    <video class="basic-video__main"
           ref="main"
           autoplay
           muted></video>
  </div>
</template>

<script>
import RecordVideo from './plugin'
export default {
  name: 'basic-video',
  props: {
    background: {
      type: String
    },
    width: {
      type: [String, Number],
      default: 500
    }
  },
  computed: {
    styleName () {
      return {
        width: `${this.width}px`
      }
    },
    imgStyleName () {
      return {
        width: `${this.width / 2}px`
      }
    },
    borderStyleName () {
      return {
        width: `${this.width / 15}px`,
        height: `${this.width / 15}px`,
        borderWidth: `${5}px`
      }
    },
  },
  data () {
    return {
      videoObj: null
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.videoObj = new RecordVideo(this.$refs.main);
      const videoPromise = this.videoObj.init();
      videoPromise
        .then(() => {
          this.videoObj.mediaRecorder.addEventListener('stop', this.getData, false);
        })
    },
    startRecord () {
      this.videoObj.startRecord()
    },
    stopRecord () {
      this.videoObj.stopRecord();
    },
    getData () {
      const blob = new Blob(this.videoObj.chunks, {
        type: 'video/mp4'
      });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener('loadend', () => {
        var video_base64 = reader.result;
        this.$emit('data-change', video_base64)
      });
    }
  }
}
</script>
<style  lang="scss" scoped>
.basic-video {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  &__border {
    span {
      position: absolute;
      width: 30px;
      height: 30px;
      border-width: 4px;
      color: #0073eb;
      border-style: solid;
      &:nth-child(1) {
        left: 15px;
        top: 15px;
        border-right: 0;
        border-bottom: 0;
      }
      &:nth-child(2) {
        right: 15px;
        top: 15px;
        border-left: 0;
        border-bottom: 0;
      }
      &:nth-child(3) {
        bottom: 15px;
        left: 15px;
        border-right: 0;
        border-top: 0;
      }
      &:nth-child(4) {
        bottom: 15px;
        right: 15px;
        border-left: 0;
        border-top: 0;
      }
    }
  }
  &__img {
    width: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &__main {
    width: 100%;
  }
}
</style>
