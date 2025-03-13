import { createRouter, createWebHistory } from 'vue-router'
import priceCparison from '../views/priceCparison.vue'
import checkAddress from '../views/checkAddress.vue'
import documentation from '../views/documentation.vue'

import expDelivery from '@/components/business/expDelivery.vue'
import queryRecords from '@/components/business/queryRecords.vue'

import documDan from '@/components/business/documDan.vue'
import documDanJg from '@/components/business/documDanJg.vue'

import priceCom from '@/components/business/priceCom.vue'
import priceComJl from '@/components/business/priceComJl.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'checkAddress',
      component: checkAddress,
      children: [{
        path: 'expDelivery',
        component: expDelivery,
      },{
        path: 'queryRecords',
        component: queryRecords,
      },]
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: documentation,
      children: [{
        path: 'documDan',
        component: documDan,
      },{
        path: 'documDanJg',
        component: documDanJg,
      },]
    },
    {
      path: '/checkAddress',
      name: 'checkAddress',
      component: checkAddress,
      children: [{
        path: 'expDelivery',
        component: expDelivery,
      },{
        path: 'queryRecords',
        component: queryRecords,
      },]
    },
    {
      path: '/priceCparison',
      name: 'priceCparison',
      component: priceCparison,
      children: [{
        path: 'priceCom',
        component: priceCom,
      },{
        path: 'priceComJl',
        component: priceComJl,
      },]
    },
  ],
})

export default router
