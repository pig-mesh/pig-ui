<script setup lang="ts" name="authredirect">
import request from '/@/utils/request';
import { ElMessageBox } from 'element-plus';
import other from "/@/utils/other";
import { rule } from '/@/utils/validate';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';

onMounted(async () => {
  const url = window.location.search
    .replace('#/authredirect', '')
    .replaceAll('/', '')

  // 优先获取 code 参数，获取不到 则换成 ticket
  let code = other.getQueryString(url, 'code')
  if (rule.validatenull(code)) {
    code = other.getQueryString(url, 'ticket')
  }

  //  分割登录参数
  let state = other.getQueryString(url, 'state')
  let type = state.split('-')[1]
  state = state.split('-')[0]

  // 登录请求
  if (type === 'LOGIN') {
    Session.clear();
    await useUserInfo().loginBySocial(state, code)
    window.close()
  } else {
    bind(state, code)
  }
})

const bind = (state: string, code: string) => {
  request({
    url: '/admin/social/bind',
    method: 'post',
    params: { state, code }
  }).then(() => {
    ElMessageBox.alert('社交账号绑定成功', '成功', {
      confirmButtonText: '确定',
      callback: () => {
        window.close()
      }
    })
  })
}
</script>