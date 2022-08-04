<template>
  <div class="moveBg"
       :id="id"
       v-show="isShow"
       @click="handleFocus"
       @mousemove="mouseMove"
       @mouseup="mouseUp"
       @mouseleave.stop="mouseLeave"
       :style="{pointerEvents:isBoxResizing||isBoxMoving?'auto':'none'}">
    <div class="box"
         :style="{left:nowRect.left+'px',top:nowRect.top+'px',bottom:nowRect.bottom+'px',right:nowRect.right+'px'}"
         :class="getExtBoxClasses()">
      <div class="box-top">
        <div class="box-top-left"
             @mousedown="resizeMouseDown"></div>
        <div class="box-top-center"
             @mousedown="resizeMouseDown"></div>
        <div class="box-top-right"
             @mousedown="resizeMouseDown"></div>
      </div>
      <div class="box-center">
        <div class="box-center-left"
             @mousedown="resizeMouseDown"></div>
        <div class="box-center-center loader">
          <div class="app-bar"
               :style="{backgroundColor:app.tabbarBgColor}"
               @mousedown.stop="positionMouseDown"
               v-on:dblclick="appBarDoubleClicked">
            <div class="controll">
              <div class="close"
                   @click.stop="close"></div>
              <!-- <div class="min"
                   @click.stop="hide"></div> -->
              <div class="full"
                   :class="app.disableResize?'full-disabled':''"
                   @click.stop="switchFullScreen">
              </div>
            </div>
            <div class="title"
                 :style="{color:app.tabbarTextColor}">{{app.title}}</div>
          </div>
          <iframe :src="location + app.path"
                  frameborder="0"
                  class="iframe"></iframe>
        </div>
        <div class="box-center-right"
             @mousedown="resizeMouseDown"></div>
      </div>
      <div class="box-bottom">
        <div class="box-bottom-left"
             @mousedown="resizeMouseDown"></div>
        <div class="box-bottom-center"
             @mousedown="resizeMouseDown"></div>
        <div class="box-bottom-right"
             @mousedown="resizeMouseDown"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { isURL } from '@/util/validate'
import { defineAsyncComponent } from 'vue'
export default {
  data () {
    return {
      onClose: null,
      isShow: false,
      app: {},
      defaultIndex: 10,
      activeIndex: 20,
      isBoxMoving: false,
      startPosition: { x: 0, y: 0 },
      nowRect: {
        left: 100, right: 100,
        top: 100, bottom: 100
      },
      startRect: {
        left: 0, right: 0, top: 0, bottom: 0
      },
      isBoxResizing: false,
      moveDirection: false,
      isMaxShowing: false,
      isFullScreen: false,
    }
  },
  computed: {
    location () {
      return isURL(this.app.path) ? '' : window.location.origin
    }
  },
  created () {
    if (this.app.width) {
      this.nowRect.left = this.nowRect.right = (document.body.clientWidth - this.app.width) / 2
    }
    if (this.app.height) {
      this.nowRect.bottom = (document.body.clientHeight - this.app.height) / 2 + 50
      this.nowRect.top = (document.body.clientHeight - this.app.height) / 2 - 50
    }
  },
  methods: {
    handleFocus () {
      let list = document.getElementsByClassName('moveBg');
      if (list.length == 1) return
      let max = 0;
      for (let i = 0; i < list.length; i++) {
        let ele = list[i]
        let box = ele.getElementsByClassName('box')[0].style;
        let zIndex = Number(box.zIndex)
        if (max < zIndex) {
          max = zIndex;
        }
      }
      max = max + 1;
      this.$el.getElementsByClassName('box')[0].style.zIndex = max;
    },
    close () {
      this.isShow = false
      if (typeof this.onClose === "function") {
        this.onClose(this);
      }
    },
    hide () {
      this.isShow = false
    },
    switchFullScreen () {
      if (this.app.disableResize) {
        return
      }
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        this.isMaxShowing = true
      } else {
        this.isMaxShowing = false
      }
    },
    getExtBoxClasses () {
      let str = "";
      if (!this.isBoxResizing && !this.isBoxMoving) {
        str += "box-animation "
      }
      if (this.isMaxShowing) {
        str += "isMaxShowing "
      }
      if (this.isFullScreen) {
        str += "isFullScreen "
      }
      if (this.app.disableResize) {
        str += "resize-disabled "
      }
      if (this.app.isTop) {
        str += "isTop "
      }
      return str
    },
    appBarDoubleClicked () {
      if (this.app.disableResize) {
        return
      }
      this.isMaxShowing = !this.isMaxShowing
      if (!this.isMaxShowing) {
        this.isFullScreen = false
      }
    },
    positionMouseDown (e) {
      if (this.isFullScreen || this.isMaxShowing) {
        return
      }
      this.startRect = {
        left: this.nowRect.left,
        right: this.nowRect.right,
        top: this.nowRect.top,
        bottom: this.nowRect.bottom,
      };
      this.startPosition.x = e.clientX
      this.startPosition.y = e.clientY
      this.isBoxMoving = true
    },
    mouseUp () {
      this.isBoxMoving = false
      this.isBoxResizing = false
      this.moveDirection = false
    },
    mouseLeave () {
      this.isBoxMoving = false
      this.isBoxResizing = false
      this.moveDirection = false
    },
    mouseMove (e) {
      if (this.isBoxResizing) {
        this.isFullScreen = false
        this.isMaxShowing = false
        switch (this.moveDirection) {
          case 'box-top-left':
            this.nowRect.top = this.startRect.top + (e.clientY - this.startPosition.y)
            this.nowRect.left = this.startRect.left + (e.clientX - this.startPosition.x)
            break
          case 'box-top-center':
            this.nowRect.top = this.startRect.top + (e.clientY - this.startPosition.y)
            break
          case 'box-top-right':
            this.nowRect.top = this.startRect.top + (e.clientY - this.startPosition.y)
            this.nowRect.right = this.startRect.right - (e.clientX - this.startPosition.x)
            break
          case 'box-center-left':
            this.nowRect.left = this.startRect.left + (e.clientX - this.startPosition.x)
            break
          case 'box-bottom-left':
            this.nowRect.left = this.startRect.left + (e.clientX - this.startPosition.x)
            this.nowRect.bottom = this.startRect.bottom - (e.clientY - this.startPosition.y)
            break
          case 'box-bottom-center':
            this.nowRect.bottom = this.startRect.bottom - (e.clientY - this.startPosition.y)
            break
          case 'box-center-right':
            this.nowRect.right = this.startRect.right - (e.clientX - this.startPosition.x)
            break
          case 'box-bottom-right':
            this.nowRect.right = this.startRect.right - (e.clientX - this.startPosition.x)
            this.nowRect.bottom = this.startRect.bottom - (e.clientY - this.startPosition.y)
            break
          default:
        }
        return;
      }
      if (this.isBoxMoving) {
        this.isFullScreen = false
        this.isMaxShowing = false
        this.nowRect.left = this.startRect.left + (e.clientX - this.startPosition.x)
        this.nowRect.right = this.startRect.right - (e.clientX - this.startPosition.x)
        this.nowRect.top = this.startRect.top + (e.clientY - this.startPosition.y)
        this.nowRect.bottom = this.startRect.bottom - (e.clientY - this.startPosition.y)
        return
      }
    },
    resizeMouseDown (e) {
      if (this.app.disableResize) {
        return
      }
      if (this.isFullScreen || this.isMaxShowing) {
        return
      }
      this.startRect = {
        left: this.nowRect.left,
        top: this.nowRect.top,
        right: this.nowRect.right,
        bottom: this.nowRect.bottom,
      };
      this.startPosition.x = e.clientX
      this.startPosition.y = e.clientY
      this.isBoxResizing = true
      this.moveDirection = e.target.className
    },
  }
}
</script>
<style scoped>
.iframe {
  width: 100%;
  height: calc(100% - 50px);
  margin-top: 5px;
  border-right: 5px;
}
.moveBg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.box {
  --resize: 5px;
  --resize-bg: transparent;
  --resize-main: transparent;
  --resize-bg-main: transparent;
}

.box {
  display: flex;
  flex-direction: column;
  position: absolute;
  pointer-events: auto;
}

.box-top {
  display: flex;
  flex-direction: row;
}

.box-top-left {
  width: var(--resize);
  height: var(--resize);
  background: var(--resize-bg);
  cursor: nw-resize;
}

.box-top-center {
  height: var(--resize);
  background: var(--resize-bg-main);
  cursor: n-resize;
  flex-grow: 1;
}

.box-top-right {
  width: var(--resize);
  height: var(--resize);
  background: var(--resize-bg);
  cursor: ne-resize;
}

.box-center {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}

.box-center-left {
  width: var(--resize);
  height: 100%;
  background: var(--resize-bg-main);
  cursor: w-resize;
}

.box-center-center {
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0px 0px 3px #999;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.isTop .box-center-center {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  filter: none;
}

.box-animation {
  transition: width 0.1s, height 0.1s, left 0.1s, right 0.1s, top 0.1s,
    bottom 0.1s;
}

.isMaxShowing {
  left: -5px !important;
  right: -5px !important;
  top: 24px !important;
  bottom: 47px !important;
  height: calc(100% - 24px);
}

.isFullScreen {
  position: fixed !important;
  z-index: 999 !important;
  bottom: -5px !important;
}

.isMaxShowing .box-center-center,
.isFullScreen .box-center-center {
  border-radius: 0px !important;
}

.box-center-right {
  width: var(--resize);
  height: 100%;
  background: var(--resize-bg-main);
  cursor: e-resize;
}

.box-bottom {
  display: flex;
  flex-direction: row;
}

.box-bottom-left {
  width: var(--resize);
  height: var(--resize);
  background: var(--resize-bg);
  cursor: sw-resize;
}

.box-bottom-center {
  height: var(--resize);
  background: var(--resize-bg-main);
  cursor: s-resize;
  flex-grow: 1;
}

.box-bottom-right {
  width: var(--resize);
  height: var(--resize);
  background: var(--resize-bg);
  cursor: se-resize;
}

.loader {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;
}

.app-bar {
  height: 40px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.app-bar .controll {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
}

.app-bar .controll div {
  border-radius: 100%;
  height: 11px;
  width: 11px;
  margin-right: 8px;
  cursor: pointer;
}

.app-bar .title {
  flex-grow: 1;
  text-align: center;
  margin-right: 80px;
  font-weight: 500;
  text-shadow: none;
  font-size: 13px;
  cursor: move;
  color: #333;
}

.controll .close {
  background: #fc605c;
  border: 1px solid #fc635d;
}

.controll .min {
  background: #fcbb40;
  border: 1px solid #f8b438;
}

.controll .full {
  background: #34c648;
  border: 1px solid #2bc03f;
}

.full-disabled {
  background: #ccc !important;
  border: 1px solid #ccc !important;
}

.resize-disabled .box-top-left,
.resize-disabled .box-top-center,
.resize-disabled .box-top-right,
.resize-disabled .box-center-left,
.resize-disabled .box-center-right,
.resize-disabled .box-bottom-left,
.resize-disabled .box-bottom-center,
.resize-disabled .box-bottom-right {
  cursor: default;
}

.app-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>