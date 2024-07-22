<template>
    <router-link :to="{ name: 'Home' }">
        뒤로가기
    </router-link>
    <h3>{{ username }}'s Details</h3>
    <h3><NameCard/></h3>
    <section>
        <D3Graph>
            <AreaGraphWrapper :width="width" :height="height" :graphStyle="style" />
        </D3Graph>
        <D3Graph>
            <LineGraphWrapper :width="width" :height="height" :graphStylee="style" />
        </D3Graph> 
        <D3Graph>
            <RectGraphWrapper :width="width" :height="height" :graphStyle="style" />
        </D3Graph>
    </section>
</template>

<script setup>
    //import InputForm from "./InputForm.vue";
    import D3Graph from "./D3Graph.vue";
    import AreaGraphWrapper from "./AreaGraphWrapper.vue";
    import RectGraphWrapper from "./RectGraphWrapper.vue";
    import LineGraphWrapper from "./LineGraphWrapper.vue";
    import { useStore } from "../store/useStore";
    import { ref, computed, onMounted } from "vue";
    import { storeToRefs } from "pinia";
    import { useRoute } from 'vue-router';
    import NameCard from "./NameCard.vue";

    const route = useRoute();
    const username = route.params.username;

    const store = useStore();

    const { area, author } = storeToRefs(store);
    
    const msg = ref("Welcome to Your Vue.js App");

    // 페이지가 로드될 때 사용자 정보를 가져오거나 상태를 복구
    onMounted(() => {
    const username = route.params.username;
    if (!author.value.login || author.value.login !== username) {
        // 상태에 해당 사용자가 없다면 로드하거나 복구
        const contributor = store.contributors.find(contributor => contributor.author.login === username);
        if (contributor) {
        store.setData(contributor);
        } else {
        // 필요한 경우 API를 호출하여 데이터를 가져올 수 있음
        console.log("사용자 데이터를 로드할 필요가 있습니다.");
        }
    }
    });


    const width = computed(() => {
        return area.value.width + area.value.margin;
    });

    const height = computed(() => {
        return area.value.height + area.value.margin;
    });

    const style = computed(() => {
        const areaMargin = area.value.margin / 2;
        return {
            transform: `translate(${areaMargin}px, ${areaMargin}px)`
        };
    });

</script>

<style lang="scss" scoped>

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>