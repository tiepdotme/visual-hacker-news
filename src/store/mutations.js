import Vue from 'vue'

export default {
  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },

  SET_ACTIVE_PAGE: (state, { page }) => {
    Vue.set(state.activePage, state.activeType, page)
  },

  SET_LIST: (state, { type, ids }) => {
    state.lists[type] = ids
  },

  SET_ITEMS: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.id, item)
      }
    })
    return items;
  },

  SET_USER: (state, { id, user }) => {
    Vue.set(state.users, id, user || false) /* false means user not found */
  },

  SET_SCROLL: (state, { type, scrollPosition }) => {
    Vue.set(state.scrollPosition, type, scrollPosition)
  }
}
