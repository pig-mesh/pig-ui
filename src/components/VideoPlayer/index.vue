<template>
    <div class="video-player-wrapper">
        123
        <video
            ref="playerRef"
            controls
            :src="src"
            :poster="poster"
            :width="width"
            :height="height"
            :style="{ width, height }"
            class="object-contain w-full rounded-lg"
        ></video>
    </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

defineProps({
    src: {
        type: String,
        required: true
    },
    width: String,
    height: String,
    poster: String
})

const playerRef = shallowRef<HTMLVideoElement>()

const play = () => {
    playerRef.value?.play()
}

const pause = () => {
    playerRef.value?.pause()
}

defineExpose({
    play,
    pause
})
</script>
