import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import axios from "axios";


const app = createApp(App)

app.config.globalProperties.$axios = axios;

app.use(store)
app.use(router)

// 新增代码：注册全部组件
app.use(ElementPlus)
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}

app.mount('#app')

