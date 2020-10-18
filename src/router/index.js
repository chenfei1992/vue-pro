import Vue from 'vue'
import Router from 'vue-router'
import ListView from '../components/list-view/list-view.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/list-view',
      name: 'list-view',
      component: ListView
    }
  ]
})
