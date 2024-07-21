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
const selectedWidth = ref(0);
const overlayCursor = ref("crosshair");
const selectCursor = ref("move");
const handleCursor = ref("ew-resize");

// store 값 정의 
const { area, scale, weeks, selectedWeeks } = storeToRefs(store);

// DOM 요소 참조를 위한 ref 선언 
const overlay = ref(null);


// 영역의 크기와 스타일을 계산하는 computed 속성

// width computed 함수 정의 
const width = computed(() => {
    return area.value.width;
});

// height computed 함수 정의 
const height = computed(() => {
    return area.value.height; 
});

// style computed 함수 정의 
const style = computed(() => {
    const areaMargin = area.value.margin / 2;
    return {
        transform: `translate(${areaMargin}px, ${areaMargin}px)`,
        fill: "rgba(0, 0, 0, 0)"
    };
});

const handleRight = computed(() => {
    return selectedRightX.value - 3;
});

const handleLeft = computed(() => {
    return selectedLeftX.value - 3;
});

// weeks 데이터가 변경될 때마다 isShow false로 변경
watch(weeks, (newWeeks) => {
    isShow.value = false;
});

// 이벤트 핸들러

/**
 * 오버레이 영역에서 마우스 버튼을 누를 때 호출되는 함수
 * 선택 영역 초기화 및 마우스 이동/버튼 떼기 이벤트 설정
 */
const mousedown = (e) => {
    isShow.value = false; // 선택영역 숨기기
    selectedX.value = 0; // 선택영역 초기 X 좌표 
    selectedWidth.value = 0; // 선택영역 초기 너비 
    selectedRightX.value = 0; // 선택영역 오른쪽 경계 초기화 
    selectedLeftX.value = 0; // 선택영역 왼쪽 경계 초기화 
    store.setSelectedWeeks(weeks.value); // 선택된 주 초기화 

    const w = d3.select(window); // 윈도우 객체 선택
    const defaultX = e.offsetX - area.value.margin / 2; // 마우스 클릭 위치 계산 

    w.on("mousemove", (event) => {
    let x = d3.pointer(event, overlay.value)[0]; // 마우스 현재 위치 계산 
    let moveX = x <= 0 ? 0 : x > area.value.width ? area.value.width : x; // 이동 가능한 범위 제한 

    if (defaultX < moveX) {  // 오른쪽으로 이동하는 경우 
        selectedX.value = defaultX;
        selectedRightX.value = moveX;
        selectedLeftX.value = defaultX;
        selectedWidth.value = moveX - defaultX;
    } else {
        // 왼쪽으로 이동하는 경우 
        selectedX.value = moveX;
        selectedRightX.value = defaultX;
        selectedLeftX.value = moveX;
        selectedWidth.value = defaultX - moveX;
    }

    isShow.value = true; // 선택영역 표시 
    
    })
    .on("mouseup", () => {
        if (selectedRightX.value - selectedLeftX.value < 3) { // 선택 영역 너무 작은 경우 숨기기
            isShow.value = false;
        }
        getData(getDataIndex(selectedLeftX.value), getDataIndex(selectedRightX.value)); // 선택된 데이터 업데이트
    w.on("mousemove", null).on("mouseup", null); // 이벤트 핸들러 제거

    });
    e.preventDefault();

};

/**
 * 선택 영역에서 마우스 버튼을 누를 때 호출되는 함수
 * 선택 영역 이동 및 마우스 이동/버튼 떼기 이벤트 설정
 */
 const selectionMousedown = () => {
    const w = d3.select(window); // 윈도우 객체 선택
    const defaultX = e.offsetX - area.value.margin / 2; // 마우스 클릭 위치 계산
    const addX = selectedX.value; // 현재 선택 영역의 시작 위치

    w.on("mousemove", (e) => {

        overlayCursor.value = "move"; // 커서 모양 변경
        let x = d3.pointer(e, overlay.value)[0]; // 마우스 현재 위치 계산
        let moveX = x <= 0 ? 0 : x > area.value.width ? area.value.width : x; // 이동 가능한 범위 제한
        
        if (defaultX < moveX) { // 오른쪽으로 이동하는 경우
            
            const maxX = area.value.width - selectedWidth.value;

            let x_ = addX + moveX - defaultX >= maxX ? maxX : addX + moveX - defaultX;
            selectedRightX.value = x_ + selectedWidth.value;
            selectedLeftX.value = x_;
            selectedX.value = x_;

        } else { // 왼쪽으로 이동하는 경우
            let x__ = addX - (defaultX - moveX) <= 0 ? 0 : addX - (defaultX - moveX);
            selectedRightX.value = x__ + selectedWidth.value;
            selectedLeftX.value = x__;
            selectedX.value = x__;

        }
     }).on("mouseup", () => {
        getData(getDataIndex(selectedLeftX.value), getDataIndex(selectedRightX.value)); // 선택된 데이터 업데이트
        overlayCursor.value = "crosshair"; // 커서 모양 변경
        w.on("mousemove", null).on("mouseup", null); // 이벤트 핸들러 제거
    });
    e.preventDefault(); // 기본 이벤트 방지
};

/**
 * 왼쪽 핸들에서 마우스 버튼을 누를 때 호출되는 함수
 * 선택 영역의 왼쪽 경계 이동 및 마우스 이동/버튼 떼기 이벤트 설정
 */
const handleLeftMousedown = () => {
  const w = d3.select(window); // 윈도우 객체 선택
  const handleType = e.target.dataset.handleType; // 핸들 타입 가져오기
  const addWidth = selectedWidth.value; // 현재 선택 영역의 너비
  const rightX = selectedRightX.value; // 현재 선택 영역의 오른쪽 경계
  w.on("mousemove", (e) => {
    overlayCursor.value = "ew-resize"; // 커서 모양 변경
    selectCursor.value = "ew-resize"; // 커서 모양 변경
    let x = d3.pointer(e, overlay.value)[0]; // 마우스 현재 위치 계산
    let moveX = x <= 0 ? 0 : x > area.value.width ? area.value.width : x; // 이동 가능한 범위 제한
    const handleX = handleType === "selectedRightX" ? selectedRightX.value : selectedLeftX.value; // 핸들 위치 계산
    if (handleX < moveX) { // 오른쪽으로 이동하는 경우
      if (rightX < moveX) {
        selectedX.value = rightX;
        selectedWidth.value = moveX - rightX;
      } else {
        selectedX.value = moveX;
        selectedWidth.value = addWidth - (moveX - handleX);
      }
    } else { // 왼쪽으로 이동하는 경우
      selectedX.value = moveX;
      selectedWidth.value = addWidth + (handleX - moveX);
    }
  }).on("mouseup", () => {
    selectedRightX.value = selectedX.value + selectedWidth.value; // 오른쪽 경계 업데이트
    selectedLeftX.value = selectedX.value; // 왼쪽 경계 업데이트
    getData(getDataIndex(selectedLeftX.value), getDataIndex(selectedRightX.value)); // 선택된 데이터 업데이트
    overlayCursor.value = "crosshair"; // 커서 모양 변경
    selectCursor.value = "move"; // 커서 모양 변경
    w.on("mousemove", null).on("mouseup", null); // 이벤트 핸들러 제거
  });
  e.preventDefault(); // 기본 이벤트 방지
};

/**
 * 오른쪽 핸들에서 마우스 버튼을 누를 때 호출되는 함수
 * 선택 영역의 오른쪽 경계 이동 및 마우스 이동/버튼 떼기 이벤트 설정
 */
const handleRightMousedown = () => {
  const w = d3.select(window); // 윈도우 객체 선택
  const handleType = e.target.dataset.handleType; // 핸들 타입 가져오기
  const addWidth = selectedWidth.value; // 현재 선택 영역의 너비
  const leftX = selectedLeftX.value; // 현재 선택 영역의 왼쪽 경계
  w.on("mousemove", (e) => {
    overlayCursor.value = "ew-resize"; // 커서 모양 변경
    selectCursor.value = "ew-resize"; // 커서 모양 변경
    let x = d3.pointer(e, overlay.value)[0]; // 마우스 현재 위치 계산
    let moveX = x <= 0 ? 0 : x > area.value.width ? area.value.width : x; // 이동 가능한 범위 제한
    const handleX = handleType === "selectedRightX" ? selectedRightX.value : selectedLeftX.value; // 핸들 위치 계산
    if (handleX < moveX) { // 오른쪽으로 이동하는 경우
      selectedWidth.value = addWidth + (moveX - handleX);
    } else { // 왼쪽으로 이동하는 경우
      if (leftX > moveX) {
        selectedX.value = moveX;
        selectedWidth.value = leftX - moveX;
      } else {
        selectedX.value = leftX;
        selectedWidth.value = addWidth - (handleX - moveX);
      }
    }
  }).on("mouseup", () => {
    selectedRightX.value = selectedX.value + selectedWidth.value; // 오른쪽 경계 업데이트
    selectedLeftX.value = selectedX.value; // 왼쪽 경계 업데이트
    getData(getDataIndex(selectedLeftX.value), getDataIndex(selectedRightX.value)); // 선택된 데이터 업데이트
    overlayCursor.value = "crosshair"; // 커서 모양 변경
    selectCursor.value = "move"; // 커서 모양 변경
    w.on("mousemove", null).on("mouseup", null); // 이벤트 핸들러 제거
  });
  e.preventDefault(); // 기본 이벤트 방지
};

/**
 * 주어진 x 좌표에 해당하는 데이터 인덱스를 반환하는 함수
 * @param {number} x - x 좌표
 * @returns {number} 데이터 인덱스
 */
 const getDataIndex = (x) => {
  const bisectDate = d3.bisector((d) => new Date(d.w * 1000)).left; // x 좌표를 기준으로 데이터 인덱스를 찾는 함수
  const x0 = scale.value.get("x").invert(x); // x 좌표를 날짜로 변환
  return bisectDate(weeks.value, x0, 1); // 해당 날짜에 대한 데이터 인덱스 반환
};

/**
 * 선택된 범위에 해당하는 데이터를 설정하는 함수
 * @param {number} defaultI - 시작 인덱스
 * @param {number} lastI - 끝 인덱스
 */
const getData = (defaultI, lastI) => {
  if (defaultI !== lastI) { // 시작 인덱스와 끝 인덱스가 다를 경우
    const start = Math.min(defaultI, lastI); // 작은 인덱스
    const last = Math.max(defaultI, lastI); // 큰 인덱스
    store.setSelectedWeeks(weeks.value.slice(start - 1, last + 1)); // 선택된 범위의 데이터 설정
  }
};


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