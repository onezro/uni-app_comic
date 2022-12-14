import App from './App'
import Vue from 'vue'
import store from './store/index.js'
Vue.prototype.$baseUrl = "https://www.kuaikanmanhua.com/"
Vue.prototype.$store = store
// #ifndef VUE3


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif