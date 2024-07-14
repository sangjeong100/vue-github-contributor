<template>
  <div id="app"><Container/></div>
</template>


<script>

import Container from "./components/Container.vue";

export default {
  name: "App", // 컴포넌트 명칭 지정 
  components: {
    Container
  },
}
</script>


<style lang="scss" scoped>

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>