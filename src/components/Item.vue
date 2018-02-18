<template>
  <li class="news-item">
    <div class="img-container" :style="{backgroundColor:randomColor}">
      <a :href="item.url" target="_blank" rel="noopener" v-if="item.url">
        <img 
          v-lazy="imgUrl" 
          :key="imgUrl.src" 
          :alt="item.title ">
      </a>
    </div>
    <div class="meta-container">
      <span class="title">
        <template v-if="item.url">
          <span class="host"> ({{ item.url | host }})</span> <br> 
          <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a> 
          
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
        </template>
      </span>
      <br>
      <span class="meta">
        <span v-if="item.type !== 'job'" class="by">
          by <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
        </span>
        <span class="time">
          {{ item.time | timeAgo }} ago
        </span>
        <span v-if="item.type !== 'job'" class="comments-link">
          | <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
          | <span class="score">score: {{ item.score }}</span>
        </span>
      </span>
      <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
    </div>
  </li>
</template>

<script>
import { timeAgo } from '../util/filters'
const isDev = process.env.NODE_ENV !== 'production'

export default {
  name: 'news-item',
  props: ['item'],
  computed: {
    imgUrl() {
      const baseUrl = `${isDev ? 'https://hnews.xyz/thumbnail' : '/thumbnail'}/?url=${encodeURIComponent(this.item.url)}&quality=33&width=1280&height=1280&resize=450x450`;
      return {
        src: `${baseUrl}`,
        // loading: `${baseUrl}&thumb=true`,
        loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      };
      // return `/thumbnail/?url=${encodeURIComponent(this.item.url)}&width=450&height=450&screen=1024&format=jpg`;
    },
    randomColor() {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
  },
  // https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer#component-caching
  serverCacheKey: ({ item: { id, __lastUpdated, time }}) => {
    return `${id}::${__lastUpdated}::${timeAgo(time)}`
  }
}
</script>

<style scoped>
.news-item {
  background-color: #000;
  border-bottom: 1px solid #eee;
  position: relative;
  line-height: 20px;
  border: 10px solid #fff;
}
.meta-container {
  padding: 10px 20px;
  padding: 10px 20px;
  background-color: rgba(0,0,0,0.9);
  position: absolute;
  bottom: 0px;
  right: 0px;
  left: 0px;
}
.meta-container .title a {
  font-size: 18px;
  line-height: 1.2em;
  font-weight: bold;
  color: #FFF;
}
.img-container {
  width: 450px;
  height: 450px;
}
.img-container img {
  width: 100%;
  height: auto;
  margin-bottom: 50px;
  opacity: 0.8;
  transition: opacity 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
.img-container img:hover {
  opacity: 1;
}
.score {
  color: #f60;
  font-size: 0.8em;
  text-align: center;
}
.meta,
.host {
  font-size: 0.85em;
  color: #999;
}
.meta a,
.host a {
  color: #999;
  text-decoration: underline;
}
.news-item .meta a:hover,
.news-item .host a:hover {
  color: #f60;
}
img[lazy=loading] {
  opacity: 0;
}
img[lazy=error] {
  opacity: 0.8; 
}
img[lazy=loaded] {
  /*your style here*/
}
@media (max-width: 980px) {
  .img-container {
    width: 350px;
    height: 350px;
  }
}
</style>
