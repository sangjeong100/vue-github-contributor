import * as d3 from "d3";

// 데이터, 상태, 타입을 받아서 스케일 맵을 반환하는 함수
export default (data, state, type) => {
    // 새로운 Map 객체를 생성하여 스케일을 저장
    const scaleMap = new Map();

    // x 축에 사용할 시간 스케일 생성
    const x = d3   
        .scaleTime() // 시간 스케일 사용
        .domain(d3.extent(data, d => new Date(d.w * 1000))) // 데이터의 최소 및 최대 시간을 도메인으로 설정 (도메인: 입력 값의 범위)
        .range([0, state[type].width]); // 출력 값의 범위를 설정 (0에서 해당 타입의 너비까지)
    scaleMap.set("x", x); // 스케일 맵에 'x' 키로 저장

    // y 축에 사용할 선형 스케일 생성
    const y = d3
        .scaleLinear() // 선형 스케일 사용
        .domain([0, d3.max(data, d => d.c)]) // 데이터의 최대 값을 도메인으로 설정, 최소 값은 0 (도메인: 입력 값의 범위)
        .range([state[type].height, 0]); // 출력 값의 범위를 설정 (해당 타입의 높이에서 0까지)
    scaleMap.set("y", y); // 스케일 맵에 'y' 키로 저장

    // 스케일 맵 반환
    return scaleMap;
}