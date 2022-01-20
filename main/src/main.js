import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'

// 注册微应用
registerMicroApps([
  { 
    name: 'microApp', 
    entry: 'http://192.168.1.26:7071',
    container: '#appContainer',
    activeRule: '/micro-app',
    props: {}
  }
], 
{
  beforeLoad: [
    app => {
      console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
    },
  ],
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
    },
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
    },
  ],
})

setDefaultMountApp('/micro-app')

// 关闭沙箱就不会出现卡顿
start({
  // sandbox: false
})

createApp(App).use(store).mount('#app')
