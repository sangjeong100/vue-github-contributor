<template>
  <div id="app"><router-view></router-view></div>
</template>



<script setup>

import { useStore } from './store/useStore';
import { onMounted } from 'vue';

const store = useStore();

onMounted(() => {
  // 복구된 데이터를 확인하기 위해 로드 후 상태를 콘솔에 출력
  console.log('복구된 데이터:', store.contributors);
});

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