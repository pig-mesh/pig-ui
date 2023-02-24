<template>
  <div>
    <el-link
      type="primary"
      target="_blank"
      :href="
        'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx=' +
        locationY +
        '&pointy=' +
        locationX +
        '&name=' +
        label +
        '&ref=yudao'
      "
    >
      <img
        :src="
          'https://apis.map.qq.com/ws/staticmap/v2/?zoom=10&markers=color:blue|label:A|' +
          locationX +
          ',' +
          locationY +
          '&key=' +
          qqMapKey +
          '&size=250*180'
        "
      />
      <p />
      <el-icon><el-icon-map-location /></el-icon>{{ label }}
    </el-link>
  </div>
</template>

<script>
import { MapLocation as ElIconMapLocation } from '@element-plus/icons'
export default {
  components: {
    ElIconMapLocation,
  },
  name: 'wxLocation',
  props: {
    locationX: {
      required: true,
      type: Number,
    },
    locationY: {
      required: true,
      type: Number,
    },
    label: {
      // 地名
      required: true,
      type: String,
    },
    qqMapKey: {
      // QQ 地图的密钥 https://lbs.qq.com/service/staticV2/staticGuide/staticDoc
      required: false,
      type: String,
      default: 'TVDBZ-TDILD-4ON4B-PFDZA-RNLKH-VVF6E', // 需要自定义
    },
  },
}
</script>
