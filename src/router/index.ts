import { createRouter, createWebHistory } from 'vue-router'
import priceCparison from '../views/priceCparison.vue'
import checkAddress from '../views/checkAddress.vue'
import documentation from '../views/documentation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'documentation',
      component: documentation,
    },
    {
      path: '/checkAddress',
      name: 'checkAddress',
      component: checkAddress,
    },
    {
      path: '/priceCparison',
      name: 'priceCparison',
      component: priceCparison,
    },
  ],
})

export default router
