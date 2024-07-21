<template>
    <article>
        <h3>Line Graph</h3>
        <svg :width="props.width" :height="props.height">
            <!-- 각 축(Axis) 컴포넌트 렌더링 -->
            <Axis v-for="([key, value], index) of scale" :key="key" :axis="key" />
            <!-- 그래프 내용 -->
            <g class="contents" :style="props.graphStyle">
                <LineGraph/>
            </g>
        </svg>
    </article>
</template>

<script setup>

    import LineGraph from "./LineGraph.vue";
    import { useStore } from "../store/useStore";
    import { storeToRefs } from "pinia";

    const store = useStore();

    const props = defineProps(["width", "height", "graphStyle"]);

    const { scale } = storeToRefs(store);


</script>

<style lang="scss" scoped>

</style>