import Main from './index.vue';
import { isVNode } from './util';
import { createApp } from 'vue';
let instance;
let instances = [];
let seed = 1;
const Mode = (function () {
  let MessageConstructor = Main;
  const obj = function (item = {}, opts = {}) {
    let id = 'Mode_' + seed++;
    let options = Object.assign({
      app: item
    }, opts)
    let userOnClose = options.onClose;
    options.onClose = function () {
      obj.close(id, userOnClose);
    };
    const parent = document.createElement('div')
    let app = createApp(MessageConstructor)
    instance = app.mount(parent);
    Object.keys(options).forEach(ele => {
      instance[ele] = options[ele]
    })
    instance.id = id;
    if (isVNode(instance.message)) {
      instance.$slots.default = [instance.message];
      instance.message = null;
    }
    document.body.appendChild(instance.$el);
    instance.isShow = true;
    instance.dom = instance.$el;
    instances.push(instance);
    return instance;
  }
  obj.close = function (id, userOnClose) {
    for (let i = 0, len = instances.length; i < len; i++) {
      if (id === instances[i].id) {
        if (typeof userOnClose === 'function') {
          userOnClose(instances[i]);
        }
        instances.splice(i, 1);
        document.getElementById(id).remove()
        break;
      }
    }
  };
  return obj
})()

export default Mode;
export const $Mode = Mode