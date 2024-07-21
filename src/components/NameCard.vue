<template>
    <div class="name-card" v-show="show">
      <div class="header">
        <a :href="author.html_url" target="_blank">
            <img :src="author.avatar_url" alt=""/>
        </a>
        <div class="text-content">
            <a :href="author.html_url" target="_blank">{{ author.login }}</a>
            <div class="text-addition">
                <span class="commit">{{ selectedValue.c }} commit</span>
                <span class="add">{{ selectedValue.a }} ++</span>
                <span class="delete">{{ selectedValue.d }} --</span>
            </div>
        </div>
        </div>
        <div class="card-graph">
            <svg :width="width" :height="height">
                <Axis
                    v-for="([key, value], index) of cscale"
                    :key="index"
                    :axis="key"
                    :t="`c`"
                />
                <g class="contents" :style="style">
                    <AreaGraph :t="`c`" />
                </g>
            </svg>
        </div>
    </div>
</template>
  
<script setup>
    import { useStore } from "../store/useStore";
    import AreaGraph from "./AreaGraph.vue";
    import Axis from "./Axis.vue";
    import { storeToRefs } from "pinia";
    import { ref, reactive, computed, watch } from "vue";

    // store 선언 
    const store = useStore();
    
    // 반응형 변수 선언 
    const type = ref("c");
    const show = ref(false);
    const selectedValue = reactive({});

    // store 변수 가져오기 
    const { author, carea, cscale, selectedWeeks } = storeToRefs(store);

    // computed 함수 선언 

    // width 반환 
    const width = computed(() => {
        return carea.value.width + carea.value.margin;
    });

    // height 반환 
    const height = computed(() => {
        return carea.value.height + carea.value.margin;
    });

    // style 반환 
    const style = computed(() => {
        const areaMargin = carea.value.margin / 2;
        return {
            transform: `translate(${areaMargin}px, ${areaMargin}px)`
        };
    });

    // 선택된 주 변환시, 선택값 변경 
    watch(selectedWeeks, (newSelectedWeeks) => {
        // selectedWeeks 배열을 순회하며 누적 값을 계산
        const selectedVal = newSelectedWeeks.reduce((acc, cur, i) => ({
            a: acc.ㅁ + cur.a,
            d: acc.d + cur.d,
            c: acc.c + cur.c
        }), 
        { a:0, d:0, c:0 } // 초기 누적값 설정 
        );

        selectedValue.value = formatNumber(selectedVal); // 포맷팅된 값을 selectedValue에 할당
        show.value = selectedVal.c > 0; // 선택된 주의 커밋 수가 0보다 큰 경우 show를 true로 설정

    
    },{deep: true}); // deep 옵션을 사용하여 배열 내부의 변화를 감지
                    // deep 옵션이 없으면 배열 자체 변경 또는 길이 변경만 반응 가능 

    // 숫자 형식을 포맷팅하는 함수
    const formatNumber = (obj) => {
        for(let prop in obj) {
            obj[prop] = new Intl.NumberFormat().format(obj[prop]);
        }
    };

  
</script>



<style lang="scss" scoped>
    .name-card {
        width: 390px;
    }
    img {
        width: 38px;
        height: 38px;
        border-radius: 5px;
        margin: 5px;
    }
    a {
       font-size: 20px;
    }
    .header {
        display: flex;
    }
    .text-content {
        text-align: left;
        margin: 5px;
        width: 100%;
    }
    .text-addition {
        font-size: 12px;
        width: 70%;
    }
    .text-addition span {
        margin-right: 10px;
    }
    .add {
        color: #28a745 !important;
    }
    .delete {
        color: #cb2431 !important;
    }
    .commit {
        color: #586069 !important;
    }
</style>