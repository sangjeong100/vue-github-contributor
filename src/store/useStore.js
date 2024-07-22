import { defineStore } from 'pinia'; 
import getScale from '../utils/getScale';
import axios from "axios";

const GITHUB_ACCESS_TOKEN = import.meta.env.VITE_GITHUB_ACCESS_TOKEN;

// Pinia 사용 

// Pinia store 정의 
export const useStore = defineStore('main', {
    state: () => ({ 
            weeks: [], // 주별 데이터 배열
            total: 0, // 총 커밋 수
            author: {}, // 작성자 정보
            scale: {}, // 스케일 객체
            cscale: {}, // 압축된 스케일 객체
            area: { // 일반 영역의 크기와 여백 설정
                width: 700,
                height: 270,
                margin: 40
              },
            carea: { // 압축된 영역의 크기와 여백 설정
            width: 350,
            height: 135,
            margin: 40
            },
            selectedWeeks: [], // 선택된 주 데이터 배열
            isLoading: false, // 데이터 로딩 상태
            error: null, // 에러 메시지
            contributors: [] // 기여자 리스트 추가
    }),
    actions: {
        // 데이터를 설정하는 액션
        setData(data) {

            console.log(data);

            this.weeks = data.weeks; // 주 데이터를 설정 
            this.total = data.total; // 총 커밋 수를 설정 
            this.author = data.author; // 작성자 정보를 설정 
            this.scale = getScale(this.weeks, this, 'area'); // 일반 영역의 스케일을 계산하여 설정
            this.selectedWeeks = this.weeks; // 선택된 주 데이터를 전체 주 데이터로 설정 
            this.cscale = getScale(this.weeks, this, 'carea'); // 압축된 영역의 스케일을 계산하여 설정 
        },
        // 선택된 주 데이터를 설정하는 액션  
        setSelectedWeeks(data) {
            this.selectedWeeks = data; 
        },
        // 스케일을 설정하는 액션 ( why seCscale이 아니여? ) 
        setScale(data) {
            this.cscale = getScale(data, this, 'carea');
        },
        // 에러를 설정하는 액션 
        setError(error) {
            this.error = error;
        },
        // 로딩 상태를 설정하는 액션 
        setLoading(isLoading) {
            this.isLoading = isLoading;
        },
        setContributors(contributors) {
            this.contributors = contributors;
        },
        // 데이터를 가져오는 액션
        async fetchData(org = 'i-leaders-Sync', repo= 'Sync'){

            this.setLoading(true);
            this.setError(null);

            let retryCount = 0;
            const maxRetries = 5;

            while (retryCount < maxRetries) {
                try {
                    const result = await axios.get(`https://api.github.com/repos/${org}/${repo}/stats/contributors`,{
                        headers: {
                            Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`
                        }
                    });

                    if(result.status === 202) {
                        // 데이터가 아직 준비되지 않은 경우 재시도
                        retryCount++;
                        const backoffTime = Math.pow(2, retryCount) * 1000;
                        await new Promise(resolve => setTimeout(resolve, backoffTime));
                    } else{
                        const { data } = result;
                        this.setContributors(data); // 데이터를 커밋하여 상태를 업데이트 
                        this.setLoading(false);
                        return;
                    }

                } catch(e) {
                    if (e.response && e.response.status === 404) {
                        this.setError('Repository not found');
                        this.setLoading(false);
                        return;
                      } else if (retryCount >= maxRetries - 1) {
                        this.setError('Failed to fetch data after multiple attempts');
                        this.setLoading(false);
                        return;
                    }
                    retryCount++;
                }
            }
        }
    }
},{
    persist: { 
        // npm i pinia-plugin-persist
        enabled: true,
        strategies: [{ storage: localStorage }],
      },
}
);