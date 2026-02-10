# Calculator Project

## Design-Code Sync

디자인 파일과 코드는 양방향으로 관리됩니다.

### 파일 매핑
| 디자인 (.pen) | 코드 |
|---|---|
| `design/calculator.pen` | `components/calculator.tsx`, `app/page.tsx` |

### 동기화 방법
- **디자인 → 코드**: "디자인을 코드에 반영해줘" 라고 요청
- **코드 → 디자인**: "코드를 디자인에 반영해줘" 라고 요청

### 주요 디자인 토큰
- 카드 배경: `#07080a`, opacity 0.9
- 연산자 버튼: `#3366FF`
- 숫자 버튼: `#FFFFFF` (border: `#E2E8F0`)
- 보조 버튼: `#F1F5F9`
- 디스플레이 배경: `#191928cc`
- 폰트: Inter
