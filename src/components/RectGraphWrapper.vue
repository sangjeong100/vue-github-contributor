<template>
    <article>
      <h3>Rect Graph</h3>
      <svg :width="width" :height="height">
        <Axis v-for="([key, value], index) of scale" :key="index" :axis="key" />
        <g class="contents" :style="graphStyle">
          <RectGraph v-for="(d, index) in weeks" :key="index" :d="d" />
        </g>
      </svg>
    </article>
  </template>
  
  <script setup>
  import { useStore } from "../store/useStore"; // Pinia store 사용
  import Axis from "./Axis.vue";
  import RectGraph from "./RectGraph.vue";
  import { storeToRefs } from "pinia";
  import { computed } from "vue";
  
  // Pinia store 정의
  const store = useStore();
  
  // props 정의
  const props = defineProps(["width", "height", "graphStyle"]);
  
  // store의 데이터 가져오기
  const { scale, weeks } = storeToRefs(store);
  
  // graphStyle을 computed 속성으로 선언
  const graphStyle = computed(() => {
    return props.graphStyle;
  });
  </script>
  
  <style scoped>
  .contents {
    transform: translate(10px, 10px);
  }
  </style>