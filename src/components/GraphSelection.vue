<template>
  <g class="selection" :style="style">
     <!-- 선택 영역을 위한 오버레이 사각형 -->
    <rect
      class="overlay"
      ref="overlay"
      :width="width"
      :height="height"
      :cursor="overlayCursor"
      @mousedown="mousedown"
    ></rect>
    <!-- 선택된 영역 표시 사각형 -->
    <rect
      class="selection-rect"
      ref="selection"
      v-if="isShow"
      :x="selectedX"
      y="0"
      :width="selectedWidth"
      :height="height"
      :cursor="selectCursor"
      @mousedown="selectionMousedown"
    ></rect>
    <!-- 오른쪽 핸들 사각형 -->
    <rect
      class="handle-right"
      data-handle-type="selectedRightX"
      ref="selection"
      v-if="isShow"
      :x="handleRight"
      y="0"
      width="6"
      :height="height"
      :cursor="handleCursor"
      @mousedown="handleRightMousedown"
    ></rect>
    <!-- 왼쪽 핸들 사각형 -->
    <rect
      class="handle-left"
      data-handle-type="selectedLeftX"
      ref="selection"
      v-if="isShow"
      :x="handleLeft"
      y="0"
      width="6"
      :height="height"
      :cursor="handleCursor"
      @mousedown="handleLeftMousedown"
    ></rect>
  </g>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from '../store/useStore';
import { storeToRefs } from 'pinia';
import * as d3 from 'd3';

// pinia 스토어 정의
const store = useStore();

// ref 변수 정의 
const isShow = ref(false);
const selectedX = ref(20);
const selectedRightX = ref(0);
const selectedLeftX = ref(0);
const selecetdWidth = ref(0);
const overlayCursor = ref("crosshair");
const selectCursor = ref("move");
const handleCursor = ref("ew-resize");

// store 값 정의 
const { area, scale, weeks, selectedWeeks } = storeToRefs(store);

// width computed 함수 정의 
const width = computed(() => {
    return area.width;
});

// height computed 함수 정의 
const height = computed(() => {
    return area.height; 
});

// style computed 함수 정의 
const style = computed(() => {
});

</script>



<style lang="scss" scoped>
.selection-rect {
  fill: #24292e;
  fill-opacity: 0.1;
  shape-rendering: crispedges;
  stroke: #24292e;
  stroke-dasharray: 3 3;
  stroke-opacity: 0.4;
  stroke-width: 1px;
}
</style>