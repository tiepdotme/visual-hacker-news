<template>
  <div class="news-view">
    <transition :name="transition">
      <div class="news-list" v-if="displayedPage > 0">
        <transition-group tag="ul" name="item">
          <item v-for="item in displayedItems" :key="item.id" :item="item">
          </item>
        </transition-group>
      </div>
    </transition>
    <infinite-loading :on-infinite="loadItems" :next-page="page" :distance="750"></infinite-loading>
    
  </div>
</template>

<script>
import { watchList } from '../api'
import Item from '../components/Item.vue'
import InfiniteLoading from '../components/InfiniteLoading.vue'

export default {
  name: 'item-list',

  components: {
    Item,
    InfiniteLoading
  },

  props: {
    type: String
  },

  data () {
    return {
      transition: 'slide-up',
      displayedPage: Number(this.$store.state.route.params.page) || 1,
      displayedItems: this.$store.getters.activeItems
    }
  },

  computed: {
    page () {
     return this.$store.state.activePage[this.type] || Number(this.$store.state.route.params.page) || 1
    },
    maxPage () {
      const { itemsPerPage, lists } = this.$store.state
      return Math.ceil(lists[this.type].length / itemsPerPage)
    },
    hasMore () {
      return this.page < this.maxPage
    }
  },

  beforeMount () {
    if (this.$root._isMounted) {
      this.loadItems(this.page)
    }
    // watch the current list for realtime updates
    this.unwatchList = watchList(this.type, ids => {
      this.$store.commit('SET_LIST', { type: this.type, ids })
      this.$store.dispatch('ENSURE_ACTIVE_ITEMS').then(() => {
        this.displayedItems = this.$store.getters.activeItems
      })
    })
  },

  beforeDestroy () {
    this.unwatchList()
  },

  // watch: {
  //   page (to, from) {
  //     this.loadItems(to, from)
  //   }
  // },

  methods: {
    loadItems (to = this.page, from = -1) {
      this.$bar.start()
      return new Promise((resolve, reject) => { 
        this.$store.dispatch('FETCH_LIST_DATA', {
        type: this.type,
        page: to
        }).then(() => {

          if (!this.hasMore) { reject('We have reached teh end of the list'); return;}
          if (this.page < 0 || this.page > this.maxPage) {
            this.$router.replace(`/${this.type}/1`)
            return
          }
          // this.transition = from === -1
          //   ? null
          //   : to > from ? 'slide-left' : 'slide-right'
          this.displayedPage = to
          this.displayedItems = this.$store.getters.activeItems
          this.$bar.finish()
          // this.$router.replace({ path: `/${this.type}/${this.page+1}`, hash: 'infinite' });


          if (this.$store.getters.scrollPosition) {
            const x=this.$store.getters.scrollPosition.x;
            const y=this.$store.getters.scrollPosition.y;
            console.log(this.$store.getters.scrollPosition);
            this.$nextTick(function () {
            console.log('window.scroll',x,y);
            window.scroll(x,y);
            this.$store.commit('SET_SCROLL', {
                type: this.type,
                scrollPosition: null
              });
            });
          }
          resolve();
        })
        .catch( error => reject(error));
      });
    }
  }
}
</script>

<style scoped>
.news-view {
  padding-top: 20px;
}
.news-list-nav {
  background-color: #fff;
  border-radius: 2px;
}
.news-list {
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.news-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
  display: grid;
  grid-template-columns: repeat(auto-fill, 470px);
  grid-gap: 12px;
}
.news-list ul li {
  flex: 0 1 450px;
  min-width: 1px;
  /* margin: 10px; */
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}
.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}
@media (max-width: 980px) {
  .news-list ul{
    margin: 0px 0;
    grid-template-columns: repeat(auto-fill, 370px);
    grid-gap: 10px;
  }
  .news-list ul li {
    flex: 0 1 350px;
    /* margin: 5px; */
  }
}
</style>
