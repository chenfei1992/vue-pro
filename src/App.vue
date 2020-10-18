<template>
  <div id="app">
    <div class="navBar" v-show="navBarShow" @click="navBarShow = !navBarShow">
      <router-link :to="{name:'list-view'}">list</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
//  字母索引与懒加载
import ListView from './components/list-view/list-view.vue'

export default {
  name: 'App',
  data(){
    return {
      navBarShow: true
    }
  },
  components: {
    ListView
  }
}
</script>

<style lang="scss">
  @import "./common/scss/index.scss";
  .navBar {
    height: 50px;
    line-height: 50px;
    text-align: center;
    background:hotpink;
    color: #fff;
    font-size: 20px;
  }
</style>
