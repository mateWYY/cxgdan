import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import a from '@/assets/img/a.png';
import b from '@/assets/img/b.png';
import c from '@/assets/img/c.png';
import d from '@/assets/img/d.png';
import e from '@/assets/img/e.png';
import f from '@/assets/img/f.png';
import { createPersistedState } from 'pinia-plugin-persistedstate'
import VueClickAway from "vue3-click-away";     // 点击其他地方关闭模块

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueClickAway) 

app.config.globalProperties.imgTypeFn = (val:string) => {
    if(!val){
        return
    }
    if(val.includes('安能')){
        return a
    }
    if(val.includes('顺心')){
        return b
    }
    if(val.includes('百世')){
        return c
    }
    if(val.includes('韵达')){
        return d
    }
    if(val.includes('壹米')){
        return e
    }
    if(val.includes('中通')){
        return f
    }
}

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(ElementPlus)
const pinia = createPinia()
pinia.use(createPersistedState({
    storage: localStorage, 
    auto: true  // 自动存储所有仓库数据到localStorage
}))
app.use(pinia)
app.use(router)

app.mount('#app')
