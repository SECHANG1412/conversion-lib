# conversion-lib

JavaScript 단위 변환 라이브러리입니다. 길이, 무게, 넓이, 부피, 온도, 두께/평량, 속도, 압력을 지원합니다.

## 설치

```bash
npm install
```

## 사용법

```javascript
import { convertUnit, getUnits, getCategories, formatResult } from './src/index.js';

// 1km → m
convertUnit('length', 1, 'km', 'm'); // 1000

// 섭씨 → 화씨
convertUnit('temperature', 100, 'c', 'f'); // 212

// 평량(gsm) → 두께(μm)
convertUnit('thickness', 80, 'gsm', 'um'); // 80

// 사용 가능한 단위 목록
getUnits('weight'); // ['mg', 'g', 'kg', ...]

// 카테고리 목록
getCategories();
```

## 지원 카테고리

| 카테고리 | 키 | 예시 단위 |
|---------|-----|----------|
| 길이 | `length` | mm, cm, m, km, inch, ft, mile |
| 무게 | `weight` | mg, g, kg, lb, oz |
| 넓이 | `area` | m², ft², acre, ha, 평(pyeong) |
| 부피 | `volume` | mL, L, cup, gallon |
| 온도 | `temperature` | °C, °F, K |
| 두께/평량 | `thickness` | μm, mm, mil, pt, gsm |
| 속도 | `speed` | m/s, km/h, mph |
| 압력 | `pressure` | Pa, bar, atm, psi |

## 샘플 앱

```bash
npm run sample
```

브라우저에서 `http://localhost:3000` 을 열면 `sample/` 폴더의 데모 UI를 확인할 수 있습니다.

## 테스트

```bash
npm test
```
