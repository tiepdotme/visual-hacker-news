import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// route-level code splitting
// if you wan tdifferent chunks for the async use webpackMode: "lazy"
const createListView = id => () => import(/* webpackMode: "eager", webpackChunkName: "CreateListView" */'../views/CreateListView').then(m => m.default(id))
const ItemView = () => import(/* webpackMode: "eager", webpackChunkName: "ItemView" */'../views/ItemView.vue')
const UserView = () => import(/* webpackMode: "eager", webpackChunkName: "UserView" */'../views/UserView.vue')

export function createRouter (store) {
  return new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) { 
      if (savedPosition && to.name) { 
        // to.name && Vue.set(store.state.scrollPosition, to.name, savedPosition);
        store && store.commit('SET_SCROLL', {
          type: to.name,
          scrollPosition: savedPosition
        });
        return false
      };
      return {
        y: 0
      };
    },
    routes: [
      { path: '/top/:page(\\d+)?', component: createListView('top'), name: 'top' },
      { path: '/new/:page(\\d+)?', component: createListView('new'), name: 'new' },
      { path: '/show/:page(\\d+)?', component: createListView('show'), name: 'show' },
      { path: '/item/:id(\\d+)', component: ItemView, name: 'item'},
      { path: '/user/:id', component: UserView, name: 'user'},
      { path: '/', redirect: '/top' }
    ]
  })
}
