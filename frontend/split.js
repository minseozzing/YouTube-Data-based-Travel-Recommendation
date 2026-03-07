import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module 환경에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 읽어올 원본 파일과 저장할 폴더 경로 설정
const inputFile = path.join(__dirname, 'provinces.json'); // Mapshaper에서 뽑은 GeoJSON 파일
const outputDir = path.join(__dirname, 'public', 'geo');  // public 안에 geo 폴더 생성

// 폴더가 없으면 자동으로 만들기
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 2. 원본 파일 읽기
console.log('데이터 읽는 중... 조금만 기다려주세요 ⏳');
const rawData = fs.readFileSync(inputFile, 'utf8');
const geojson = JSON.parse(rawData);

// 3. 국가별(adm0_a3)로 데이터 묶기
const countryData = {};

geojson.features.forEach(feature => {
  // Natural Earth 데이터의 국가 코드 (예: KOR, JPN)
  const countryCode = feature.properties.adm0_a3;

  if (!countryCode) return;

  // 해당 국가의 배열이 없으면 새로 생성
  if (!countryData[countryCode]) {
    countryData[countryCode] = {
      type: "FeatureCollection",
      features: []
    };
  }
  
  // 구역 데이터를 해당 국가 배열에 쏙 넣기
  countryData[countryCode].features.push(feature);
});

// 4. 묶인 데이터를 각각의 파일로 저장하기
console.log('국가별 파일 생성 시작! 🚀');
let count = 0;

for (const [code, data] of Object.entries(countryData)) {
  const outputPath = path.join(outputDir, `${code}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(data));
  count++;
}

console.log(`✨ 분할 완료! public/geo 폴더에 총 ${count}개의 국가 파일이 예쁘게 생성되었습니다. 🎉`);