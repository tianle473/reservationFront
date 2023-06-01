<template>
  <div id="app">
    <router-view>
      
    </router-view>
  </div>
</template>

<script>
import login from './main/login.vue'
import user from './main/userpage.vue'

export default {
  name: 'App',
  components: { 
    login,
    user
  },
  created() {
    
  },
  data() {
    return {
      num:1,
    }
  },
  watch:{
    add(){

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:0;
  padding:0;
  border:0;
  width: 100%;
}
</style>
