<template>
    <rect class="rect" ref="rect"></rect>
</template>
  
<script setup>
    import { useStore } from "../store/useStore";
    import * as d3 from "d3";
    import { ref, onMounted, watch } from "vue"; // Vue의 ref와 onMounted 함수를 가져오기 위한 import
    import { storeToRefs } from "pinia";
    
    // store 정의 
    const store = useStore();
    
    // props 지정 
    const props = defineProps(["d"]);
    
    // store to ref 정의 
    const { weeks, scale, area } = storeToRefs(store);
    
    // rect 요소를 참조하기 위한 ref 선언
    const rect = ref(null);
    
    // 컴포넌트가 마운트되었을 때 호출되는 함수 정의
    onMounted(() => {
        render(); // 컴포넌트가 마운트되면 render 함수를 호출하여 rect 요소를 그립니다.
    });
  
    // watch를 사용하여 props.d가 변경될 때마다 render 함수를 호출
    watch(() => props.d, () => {
        render();
    });
  
  // rect 요소를 그리기 위한 render 함수 정의
    const render = () => {
        if (!props.d || !scale.value.get("x") || !scale.value.get("y")) {
            console.log("No data or scales for rendering");
            return;
        }
    
        // d3를 사용하여 rect 요소를 선택하고 데이터를 바인딩
        d3.select(rect.value)
            .datum(props.d)
            .attr("x", d => scale.value.get("x")(new Date(d.w * 1000))) // x 좌표를 설정
            .attr("y", d => scale.value.get("y")(d.c)) // y 좌표를 설정
            .attr("width", area.value.width / weeks.value.length - 1) // 너비를 설정
            .attr("height", d => area.value.height - scale.value.get("y")(d.c)) // 높이를 설정
            .attr("fill", _ => "rgb(65, 184, 131)"); // 색상을 설정
    };
</script>

<style lang="scss" scoped>
// .rect {
//     fill: #41b883;
// }
</style>