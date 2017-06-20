<template>
  <div class="header" v-bind:class="{hide:scrollDown}">
    <div class="inner">
      <router-link to="/" exact>
        <img class="logo" src="~public/logo-48.png" alt="logo">
      </router-link>
      <router-link to="/top">Top</router-link>
      <router-link to="/new">New</router-link>
      <router-link to="/show">Show</router-link>
      <a class="github" href="https://github.com/valentinvieriu/visual-hacker-news" target="_blank" rel="noopener">
        Built with Vue.js
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lastScroll: 0,
      scrollDown: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler);
  },
  methods :{
    scrollHandler(e) {
      if (this.lastScroll < window.scrollY && window.scrollY  > 300) {
        this.scrollDown = true;
      } else {
        this.scrollDown = false;
      }
      if ( Math.abs(this.lastScroll - window.scrollY) > 100 ) {
        this.lastScroll = window.scrollY;
      }
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler);
  }
}
</script>

<style scoped>
.header {
  background-color: #f60;
  position: fixed;
  z-index: 999;
  height: 55px;
  top: 0;
  left: 0;
  right: 0;
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.header.hide {
  transform: translate3d(0,-100%,0);
}
.inner {
  box-sizing: border-box;
  margin: 0px auto;
  padding: 15px;
}
a {
  color: rgba(255,255,255,0.8);
  line-height: 24px;
  transition: color 0.15s ease;
  display: inline-block;
  vertical-align: middle;
  font-weight: 300;
  letter-spacing: 0.075em;
  margin-right: 1.8em;
}
a:hover {
  color: #fff;
}
a.router-link-active {
  color: #fff;
  font-weight: 400;
}
a:nth-child(6) {
  margin-right: 0;
}
.github {
  color: #fff;
  font-size: 0.9em;
  margin: 0;
  float: right;
}
.logo {
  width: 24px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}
</style>
