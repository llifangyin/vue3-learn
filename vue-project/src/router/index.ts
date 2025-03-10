import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('../views/guide/AboutView.vue')
    },
    {
        path: '/guide',
        name: 'guide',
        redirect: '/guide/about',
        children: [
          {
            path: 'about',
            name: 'about',
            component: () => import('../views/guide/AboutView.vue')
          },
          {
            path: 'computed',
            name: 'computed',
            component: () => import('../views/guide/Computed.vue')
          },
          
          {
            path: 'lifecycle',
            name: 'lifecycle',
            component: () => import('../views/guide/lifecycle.vue')
          },
          {
            path: 'watch',
            name: 'watch',
            component: () => import('../views/guide/watch.vue')
          },
          {
            path: 'templateRefs',
            name: 'templateRefs',
            component: () => import('../views/guide/templateRefs.vue')
          },
          {
            path: 'component',
            name: 'component',
            component: () => import('../views/guide/component.vue')
          },
          {
            path: 'pinia',
            name: 'pinia',
            component: () => import('../views/guide/pinia.vue')
          },
          {
            path: 'attr',
            name: 'attr',
            component: () => import('../views/guide/attr.vue')
          },
          {
            path: 'slot',
            name: 'slot',
            component: () => import('../views/guide/slot_test.vue')
          },
          {
            path: 'async',
            name: 'async',
            component: () => import('../views/guide/async.vue')
          },
          {
            path: 'innerComponent',
            name: 'innerComponent',
            component: () => import('../views/guide/innerComponent.vue')
          },
          {
            path: 'keepalive',
            name: 'keepalive',
            component: () => import('../views/guide/keepalive.vue')
          },
          {
            path: 'teleport',
            name: 'teleport',
            component: () => import('../views/guide/teleport.vue')
          },
          {
            path: 'composables',
            name: 'composables',
            component: () => import('../views/guide/composables.vue')
          },
          {
            path: 'directive',
            name: 'directive',
            component: () => import('../views/guide/directive.vue')
          },
          {
            path: 'plugin',
            name: 'plugin',
            component: () => import('../views/guide/plugin.vue')
          },
          
        ]
    },
    {
      path: '/api',
      name: 'api',
      redirect: '/api/global',
      children: [
        {
          path: 'global',
          name: 'global',
          component: () => import('../views/api/global.vue')
        },
        {
          path: 'setup',
          name: 'setup',
          component: () => import('../views/api/setup.vue')
        },
        {
          path: 'reactivity-core',
          name: 'reactivity-core',
          component: () => import('../views/api/reactivity-core.vue')
        },
        {
          path: 'reactivity-utilities',
          name: 'reactivity-utilities',
          component: () => import('../views/api/reactivity-utilities.vue')
        },
        {
          path: 'reactivity-advanced',
          name: 'reactivity-advanced',
          component: () => import('../views/api/reactivity-advanced.vue')
        },
        {
          path: 'lifecycleApi',
          name: 'lifecycleApi',
          component: () => import('../views/api/lifecycleApi.vue')
        },
        {
          path: 'injection',
          name: 'injection',
          component: () => import('../views/api/injection.vue')
        },
        {
          path: 'helpers',
          name: 'helpers',
          component: () => import('../views/api/helpers.vue')
        },
        {
          path: 'builtInDirective',
          name: 'builtInDirective',
          component: () => import('../views/api/builtInDirective.vue')
        },
        {
          path: 'builtInComp',
          name: 'builtInComp',
          component: () => import('../views/api/builtInComp.vue')
        },
        {
          path: 'sfc',
          name: 'sfc',
          component: () => import('../views/api/sfc.vue')
        },
        {
          path: 'enhance',
          name: 'enhance',
          component: () => import('../views/api/enhance.vue')
        },
        {
          path: 'enhanceSsr',
          name: 'enhanceSsr',
          component: () => import('../views/api/enhanceSsr.vue')
        },
        {
          path: 'utilityTypes',
          name: 'utilityTypes',
          component: () => import('../views/api/utilityTypes.vue')
        },
        
      ]
      }
  ]
})

export default router
