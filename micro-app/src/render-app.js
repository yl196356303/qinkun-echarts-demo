import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

let routerInstance = null
let appInstance = null

function render({ data = {} , container } = {}) {
  routerInstance = router
  appInstance = createApp(App)
  appInstance.use(store)
  appInstance.use(routerInstance)
  appInstance.mount(container ? container.querySelector('#micro-app') : '#micro-app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'data display app bootstraped')
}

export async function mount(props) {
  console.log('props from main framework', props)
  render(props)
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  // 卸载时应该重置vuex状态
  store.reset()
  appInstance.unmount()
  appInstance._container.innerHTML = ''
  appInstance = null
  routerInstance = null
  history.destroy()
}