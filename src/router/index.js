// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/index.vue')
  },
  // Adicione mais rotas conforme necessário
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
