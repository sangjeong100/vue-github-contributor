
<template>
    <path :d="area_" :fill="fill"/>
    <!-- 
        <path> 태그는 SVG (Scalable Vector Graphics) 요소 중 하나로, 
        벡터 그래픽 경로를 정의하는 데 사용됩니다. 
        이 경로는 직선, 곡선, 호 등 다양한 형태를 가질 수 있습니다. 
        주로 그래프, 아이콘, 도형 등을 그리기 위해 사용됩니다. -->
</template>

<script setup>
// Vue Composition API에서 사용하는 ref, computed, watch 함수를 임포트합니다.
import { ref, computed, watch } from 'vue';
// Pinia 스토어를 임포트합니다.
import { useStore } from '../store/useStore';
import { storeToRefs } from 'pinia';
// D3 라이브러리를 임포트하여 데이터 시각화를 처리 
import * as d3 from 'd3';

// 컴포넌트의 props 정의, props.t는 파라미터로 전달될 수 있음 
const props = defineProps(['t']); // t: type : '' or 'c'

// pinia 스토어 사용 
const store = useStore();

// Pinia 스토어의 상태를 개별 ref로 변환
const { weeks, scale, area, cscale, carea, selectedWeeks } = storeToRefs(store);

// 반응형 데이터로 경로 데이터를 저장할 area_변수 선언 
const area_ = ref('');




// fill 속성은 props.t 값에 따라 채우기 색상을 동적 결정 
const fill = computed(() => {
    return props.t ? 'rgb(255, 150, 150)' : 'rgb(65, 184, 131)';
});

// weeks 데이터가 변경될 때마다 render 함수를 호출하여 경로를 재생성합니다.
watch(weeks, (newWeeks) => {
    render(newWeeks);  // props.t가 없으면 주 데이터를 사용하여 경로를 생성합니다.
})

// render 함수는 D3 라이브러리를 사용하여 주어진 데이터로 SVG 경로를 생성합니다.
const render = (weeks) => {
    // props.t 값에 따라 스케일과 영역 타입을 설정 
    //const scaleType = props.t ? props.t + 'scale' : 'scale';
    //const areaType = props.t ? props.t + 'area' : 'area';

    // props.t 값에 따라 스케일과 영역 타입을 설정 
    const scaleType = props.t ? cscale.value : scale.value;
    const areaType = props.t ? carea.value : area.value;

    // D3의 area 생성기를 사용하여 경로 데이터를 생성 
    const areaGenerator = d3.area()
                            .curve(d3.curveBasis) // 경로의 커브 설정 
                            .x((d) => scaleType.get('x')(new Date(d.w * 1000))) // x 좌표를 설정 
                            .y0(areaType.height) // y0 좌표 설정 
                            .y1((d) => scaleType.get('y')(d.c)); // y1 좌표 설정 
    area_.value = areaGenerator(weeks);
}

</script>


<style lang="scss" scoped>

</style>