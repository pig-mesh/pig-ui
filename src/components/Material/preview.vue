<template>
  <div v-show="modelValue">
    <div v-if="type == 'image'">
      <el-image-viewer v-if="previewLists.length" :url-list="previewLists" hide-on-click-modal @close="handleClose"/>
    </div>
    <div v-if="type == 'video'">
      <el-dialog v-model="visible" width="740px" :title="t('material.preview')" :before-close="handleClose">
        <video-player ref="playerRef" :src="url" width="100%" height="450px"/>
      </el-dialog>
    </div>
    <div v-if="type == 'file'">
      <el-drawer v-model="visible" size="100%">
        <iframe
            :src="src"
            width="100%" height="100%" frameborder="0" class="h-screen" v-if="src"></iframe>
        <span v-else>{{ t('material.noPreviewServer') }}</span>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Base64 } from 'js-base64';
import { validateNull } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const VideoPlayer = defineAsyncComponent(() => import('/@/components/VideoPlayer/index.vue'));

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
  fileName: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'image',
  },
});
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const playerRef = shallowRef();

const visible = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit('update:modelValue', value);
  },
});

const handleClose = () => {
  emit('update:modelValue', false);
};

const previewLists = ref<any[]>([]);

watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        nextTick(() => {
          previewLists.value = [props.url];
          playerRef.value?.play();
        });
      } else {
        nextTick(() => {
          previewLists.value = [];
          playerRef.value?.pause();
        });
      }
    }
);

const kkServerURL = import.meta.env.VITE_KK_SERVER_URL
const localURL = import.meta.env.VITE_KK_LOCAL_URL
const src = computed(() => {
  if (validateNull(kkServerURL)) {
    return undefined;
  }
  return `${kkServerURL}?url=` + encodeURIComponent(Base64.encode(`${localURL}${props.url}&fullfilename=${props.fileName}`));
});
</script>
