import { createStore } from 'vuex'; 
import getScale from '../utils/getScale';
import axis from "axios";
import dotenv from 'dotenv';

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

// vuex store 정의 
const store = createStore({
    state() { // vuex 변수 선언 
        return {
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
            cache: {} // API 응답 캐시
        };
    },
    mutations: { 
         // 데이터를 설정하는 뮤테이션
        setData(state, data) {
            state.weeks = data[0].weeks; // 주 데이터를 설정
            state.total = data[0].total; // 총 커밋 수를 설정
            state.author = data[0].author; // 작성자 정보를 설정
            state.scale = getScale(state.weeks, state, "area"); // 일반 영역의 스케일을 계산하여 설정
            state.selectedWeeks = state.weeks; // 선택된 주 데이터를 전체 주 데이터로 설정
            state.cscale = getScale(state.weeks, state, "carea"); // 압축된 영역의 스케일을 계산하여 설정
        },
         // 선택된 주 데이터를 설정하는 뮤테이션
        setSelectedWeeks(state, data) {
            state.selectedWeeks = data;
        },
        // 스케일을 설정하는 뮤테이션
        setScale(state, data) {
            state.cscale = getScale(data, state, "carea");
        },
        setError(state, error) {
        // error를 세팅하는 뮤테이션 
            state.error = error;
        },
        setCache(state, { key, data}) {
            // cache를 설정하는 뮤테이션
            state.cache[key] = data; 
        },
        setLoading(state, isLoading){
            // 로딩 여부 설정하는 뮤테이션
            state.isLoading = isLoading;
        }
    },
    actions: {
        // 데이터를 가져오는 액션
        async fetchData({ dispatch, commit, state}, {org = 'i-leaders-Sync', repo = 'Sync'}) {
            const cacheKey = `${org}/${repo}`;
            
            // 캐시에 존재하면, 캐시 데이터 반환 
            if (state.cache[cacheKey]) {
                commit('setData', state.cache[cacheKey]);
                return;
            }
            commit('setLoading', true);
            commit('setError', null);
            
            let retryCount = 0;
            const maxRetries = 5;

            while (retryCount < maxRetries) {
                try {
                    const result 
                        = await axios.get(`https://api.github.com/repos/${org}/${repo}/stats/contributors`
                            ,{
                                headers: {
                                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
                                }
                            });
                                    
                    
                    if(result.status === 202) {
                        // 데이터가 아직 준비되지 않은 경우 재시도 
                        retryCount++;
                        const backoffTime = Math.pow(2, retryCount) * 1000;
                        await new Promise(resolve => setTimeout(resolve, backoffTime));
                    } else {
                        const { data } = result;
                        commit('setData', data); // 데이터를 커밋하여 상태를 업데이트
                        commit('setCache', { key: cacheKey, data });
                        commit('setLoading', false);
                        return;
                    }
                
                } catch(e) {
                    if (e.response && e.response.status === 404) {
                        commit('setError', 'Repository not found');
                        commit('setLoading', false);
                        return;
                      } else if (retryCount >= maxRetries - 1) {
                        commit('setError', 'Failed to fetch data after multiple attempts');
                        commit('setLoading', false);
                        return;
                      }
                      retryCount++;
                }

            }
        }
    }
});

export default store; // 생성된 스토어를 내보냅니다.