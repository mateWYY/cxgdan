import { createRouter, createWebHistory } from 'vue-router'
import priceCparison from '../views/priceCparison.vue'
import checkAddress from '../views/checkAddress.vue'
import documentation from '../views/documentation.vue'

import expDelivery from '@/components/business/expDelivery.vue'
import queryRecords from '@/components/business/queryRecords.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'checkAddress',
      component: checkAddress,
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: documentation,
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
    },
  ],
})

export default router
