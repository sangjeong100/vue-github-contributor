<template>
    <article>
        <h3>Area Graph (Github Contributor of Insight Clone coding)</h3>
        <h4>{{ period }}</h4>
        <svg :width="width" :height="height">
             <!-- 각 축(Axis) 컴포넌트 렌더링 -->
            <Axis v-for="([key, value], index) of scale" :key="index" :axis="key" />
            <!-- 그래프 내용 및 선택 영역을 포함하는 그룹 -->
            <g class="contents" :style="graphStyle">
                <AreaGraph />
            </g>
            <!-- 그래프 선택 영역 컴포넌트 -->
            <GraphSelection />
        </svg>
        <!-- 명함(NameCard) 컴포넌트 -->
        <NameCard />
    </article>
</template>

<script setup>
import { useStore } from "../store/useStore";
import AreaGraph from "./AreaGraph.vue";
import Axis from "./Axis.vue";
import GraphSelection from "./GraphSelection.vue";
import NameCard from "./NameCard.vue";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";

// pinia 정의 
const store = useStore();

// props 정의 
const props = defineProps(["width", "height", "graph-style"]);

// data 정의 
const period = ref("");

// store 데이터 정의 
const { scale, selectedWeeks } = storeToRefs(store);

// 선택된 weeks 변화 시, 기간 표시 변화 처리 
watch(selectedWeeks, (newSelectedWeeks) => {
    if (newSelectedWeeks.length > 0) {
        const start = new Date(newSelectedWeeks[0].w * 1000).toDateString().slice(3);
        const last = new Date(newSelectedWeeks[newSelectedWeeks.length - 1].w * 1000).toDateString().slice(3);

        // 표시 기간 변경 
        const formattedStart = start.slice(0, start.lastIndexOf(" ")) + ", " + start.slice(start.lastIndexOf(" ") + 1);
        const formattedLast = last.slice(0, last.lastIndexOf(" ")) + ", " + last.slice(last.lastIndexOf(" ") + 1);
        period.value = `${formattedStart} - ${formattedLast}`;
    } else {
        // 선택된 주가 없을 때 표시 기간 초기화
        period.value = '';
    }
});


</script>

<style lang="scss" scoped>

h4{
    font-size: 24px;
    text-align: left;
}

</style>