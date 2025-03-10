import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import service  from '@/utils/http.ts';

export const useExpreListStore = defineStore('expreList', () => {
  let expreList = ref([])
  let onlineExpreList = ref([])
  function getList() {
    service.get('/getUserList').then(res => {
      console.log(res,999987)
      expreList.value = res.data
      onlineExpreList.value = res.data.filter(item => {
        if(item.loginStatus){
          return item
        }
      })
    })
  }
  function setList(item) {
    expreList.value.push(item)
  }

  return { expreList, setList, getList,onlineExpreList }
})
export const useTabStore = defineStore('tabs', () => {
  let tabs = ref(1)
  function setTab(val:number) {
    tabs.value = val
  }

  return { tabs, setTab }
})