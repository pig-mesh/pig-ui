<template>
  <div id="tenant" v-if="!autoTenantEnable">
    <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
      <el-button circle>
        <SvgIcon name="local-tenant"/>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in tenantList" :key="item.id" :command="item">
            {{ item.name }}
            <el-icon class="ml8" v-if="selectBgFlag(item.id)">
              <Check/>
            </el-icon>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="tenant">
import 'driver.js/dist/driver.min.css';
import Driver from 'driver.js';
import {fetchList} from '/@/api/admin/tenant';
import {Local, Session} from '/@/utils/storage';
import {useI18n} from 'vue-i18n';
import Cookies from 'js-cookie';
import {useThemeConfig} from "/@/stores/themeConfig";
import pinia from "/@/stores";
import {storeToRefs} from "pinia";

const {t} = useI18n();

// 是否开启注册
const autoTenantEnable = ref(import.meta.env.VITE_AUTO_TENANT === 'true');

/**
 * 租户列表的 Ref 对象。
 */
const tenantList = ref([]);

/**
 * 当前租户的 Ref 对象。
 */
const tenant = ref();

/**
 * 获取租户列表的函数。
 * @returns Promise。
 */
const getTenantList = () => {
  return fetchList().then((response) => {
    // 从后端接口获取租户列表
    tenantList.value = response.data;
  });
};

/**
 * 自动匹配租户的函数。
 */
const handleAutoTenant = () => {
  let domain = window.location.host; // 获取当前页面所在的域名
  tenantList.value.forEach((tenant: any) => {
    // 遍历租户列表
    if (domain.indexOf(tenant.tenantDomain) >= 0) {
      // 如果域名匹配当前租户，则自动填充租户信息
      handleCommand(tenant);
    }
  });
};

/**
 * 写入租户信息到本地存储的函数，方便 axios 每次请求获取 tab 范围内的租户ID。
 * @param command - 需要存储的租户ID。
 */
const handleCommand = (tenant: any) => {
  Session.set('tenantId', tenant.id); // 写入到 session 存储
  Local.set('tenantId', tenant.id); // 写入到 local 存储
  Cookies.set('tenantId', tenant.id); //写入到 cookie 方便第三方使用
  // 刷新初始化租户信息
  window.location.reload()
};

/**
 * 引导新用户了解租户信息流程的函数。
 */
const guide = () => {
  const steps = [
    {
      element: '#tenant',
      popover: {
        title: t('tenant_guide.title'),
        description: t('tenant_guide.description'),
        position: 'left',
      },
    },
  ];

  const driver: Driver = new Driver({
    allowClose: false,
    doneBtnText: '结束',
    closeBtnText: '关闭',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
  });
  driver.defineSteps(steps);
  if (!Local.get('tenant-guide')) {
    driver.start();
    Local.set('tenant-guide', true);
  }
};

/**
 * 选择的租户高亮显示
 * @param {string} id - 租户id
 * @returns {Object} - 返回包含'background-color'和color属性的对象
 */
const selectBgFlag = (id: string) => {
  return id === Session.getTenant() ? 'Check' : '';
};


const initTenantConfig = () => {
  const stores = useThemeConfig(pinia);
  const {themeConfig} = storeToRefs(stores);
  // 初始化租户个性化设置
  tenantList.value.filter((item: any) => item.id === tenant.value).forEach((tenant: any) => {
    themeConfig.value.globalTitle = tenant?.websiteName || import.meta.env.VITE_GLOBAL_TITLE

    themeConfig.value.footerAuthor = tenant.footer || import.meta.env.VITE_FOOTER_TITLE

    themeConfig.value.background = tenant.background

    themeConfig.value.miniQr = tenant.miniQr

  })
}
/**
 * 初始化函数，包括获取租户列表、读取当前租户信息、自动匹配租户、以及引导新用户了解租户信息流程。
 */
onMounted(async () => {
  await getTenantList(); // 获取租户列表
  tenant.value = Session.getTenant(); // 从本地存储读取当前租户信息

  if (autoTenantEnable.value) {
    handleAutoTenant(); // 自动根据域名匹配租户信息
  }

  initTenantConfig()

  /**
   * 在下一帧中执行引导函数，确保 DOM 已渲染完成。
   */
  nextTick(() => {
    guide();
  });
});
</script>
