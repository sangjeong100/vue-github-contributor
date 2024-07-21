<template>
    <!-- SVG 요소 내에 축을 그리기 위한 그룹 요소 -->
    <g :class="axis" :style="style" ref="axis"></g>
</template>

<script setup>
// Vue Composition API에서 사용하는 ref, computed, watch, onMounted 함수를 임포트합니다.
import { ref, computed, watch, onMounted } from 'vue';
import * as d3 from "d3";
import { useStore } from "../store/useStore";
import { storeToRefs } from "pinia";

// props 선언 
const props = defineProps(["axis", "t"]);
// Pinia 사용 선언 
const store = useStore();

// 축 요소에 대한 참조를 정의합니다.
/**
 * . axisRef는 Vue의 ref로 선언되지만,
 *  실제 DOM 요소가 마운트될 때 Vue에 의해 자동으로 설정됩니다. 
 * <g> 요소가 렌더링된 후, axisRef는 이 요소를 참조하게 됩니다.
 * 
 */
const axisRef = ref(null);

// store 값  가져옴 
const { area, carea, scale, cscale } = storeToRefs(store);

// style computed 정의 
const style = computed(() =>{
    const { x, y } = getAxisTransform();
    return {
        transform: `translate(${x}px,${y}px)`
    };
});


// areaType computed 정의 
const currentArea = computed(() => {
    //return props.t? props.t + "area" : "area";
    return props.t? carea.value : area.value;
});

// currentArea computed 정의 
const currentScale = computed(() => {
    //return props.t? props.t + "scale" : "scale";
    return props.t? cscale.value : scale.value;
});

// cscale 데이터가 변경될 때마다 render 함수를 호출하여 축을 재생성
watch(cscale, (newScale) => {
    //render(currentScale.value);
    render(newScale);
});

// 컴포넌트가 마운트될 때 render 함수를 호출하여 초기 축을 생성합니다.
onMounted(() => {
    render(currentScale.value);
});

// render 함수는 D3 라이브러리를 사용하여 주어진 스케일로 SVG 축을 생성합니다.
const render = (scale)=> {
    const $axis = d3.select(axisRef.value);
    $axis.call(generatorAxis(scale));
};

// generatorAxis 함수는 D3 축 생성기를 반환합니다.
const generatorAxis = (scale) => {
    const axis = {
        x: d3
            .axisBottom(scale.get("x"))
            .ticks(4)
            .tickSize(-currentArea.value.height),
        y: d3
            .axisLeft(scale.get("y"))
            .ticks(4)
            .tickSize(-currentArea.value.width)
    };
    return axis[props.axis];
};

// getAxisTransform 함수는 축의 변환 위치를 계산합니다.
const getAxisTransform = () => {
    let { margin, height } = currentArea.value;
    margin /= 2;
    const axisOffset = {
        x: { x: margin, y: height + margin },
        y: { x: margin, y: margin }
    };
    return axisOffset[props.axis];
};



</script>


<style lang="scss" scoped>
/* 축의 스타일 정의 */
.y line {
  stroke: lightgrey;
  stroke-opacity: 1;
  shape-rendering: crispEdges;
}
.y path,
.x path,
.x line {
  stroke-opacity: 0;
}
</style>