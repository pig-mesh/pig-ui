import DisableDevtool from 'disable-devtool';

/**
 * 安全警告的HTML模板
 * 现代风格的警告提示，压缩优化版本
 */
const SECURITY_WARNING_TEMPLATE = `
<style>
.w-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:400px;padding:1.5rem;background:#fff;box-shadow:0 15px 20px rgba(0,0,0,.1);border-radius:12px;text-align:center;font-family:system-ui,-apple-system,sans-serif}
.w-icon{margin:0 auto 1.25rem;width:56px;height:56px;background:linear-gradient(45deg,#ff6b6b,#ff8787);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 8px rgba(255,107,107,.15);animation:p 2s infinite}
.w-icon::before{content:"!";color:#fff;font-size:2rem;font-weight:700}
.w-title{font-size:1.125rem;font-weight:600;color:#1f2937;margin-bottom:.75rem}
.w-desc{font-size:.875rem;color:#6b7280}
@keyframes p{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@media(prefers-color-scheme:dark){
  .w-box{background:#1f2937;box-shadow:0 15px 20px rgba(0,0,0,.2)}
  .w-icon{background:linear-gradient(45deg,#f87171,#fb7185)}
  .w-title{color:#f3f4f6}
  .w-desc{color:#9ca3af}
}
</style>
<div class="w-box">
  <div class="w-icon"></div>
  <div class="w-title">不合规操作，系统将自动关闭退出！</div>
  <div class="w-desc">如您频繁此类操作，系统将记录上报。</div>
</div>`;

/**
 * 初始化反调试功能，
 * 通过ddtk 参数来控制绕过反调试功能,
 * http://localhost/?ddtk=pig#/flow/task/started
 */
export function initAntiDebug(): void {
    if (import.meta.env.VITE_ENABLE_ANTI_DEBUG !== 'true') {
        return;
    }

    const debugKey = import.meta.env.VITE_ANTI_DEBUG_KEY || 'pig';

    DisableDevtool({
        md5: DisableDevtool.md5(debugKey),
        disableMenu: false,
        rewriteHTML: SECURITY_WARNING_TEMPLATE,
    });
}
