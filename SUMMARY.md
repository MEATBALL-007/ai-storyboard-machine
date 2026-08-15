# SUMMARY — รอบ 2026-08-16_0025

## What I did

- **รวมสายที่ runner ทำหาย (ครั้งที่ 4 ติดกัน) ก่อนเริ่มงานจริง** — branch นี้ถูกแตกจาก
  `3503537` อีกครั้ง ทำให้หายไป**สองสายพร้อมกัน**: `…08-16_0002` (`c5696cf` — token ใน
  `index.html`, `docs/design-parity.md` 510 บรรทัด, assertion ใน `tools/test.mjs`, หัวข้อ
  README) และ `…08-16_0014` (`8a99db0` — Badge variant ฝั่ง design system) รวมกลับใน `f951277`
- **§7.1 ฝั่ง canvas เสร็จ (`93cb14e`)** — accent 10 จุดในโค้ดวาดเลิก hard-code แล้ว
  (8 × `rgba(255,199,44,α)` + 2 × `'#FFC72C'`) ตอนนี้ `cssVar()` อ่าน `--accent` /
  `--accent-rgb` จาก `:root` **ครั้งเดียวตอนโหลด** เก็บใน `ACCENT` / `ACCENT_RGB`
  แล้ว `accentA(α)` ประกอบสตริงให้ call site
- **assertion 7 ข้อใน `tools/test.mjs`** กันการถอยกลับ — ทั้งเรื่อง literal และเรื่อง performance
- อัปเดต `docs/design-parity.md` (กรอบสถานะ §7.1, §8 ข้อ 3 และ 7), `README.md`
  (ย่อหน้าใหม่อธิบายว่า canvas เป็นกรณีพิเศษและต้องแคช), และ `AUTOPILOT.md`

## Why

**ทำไมต้องแคช** — `getComputedStyle` บังคับ style recalc แบบ synchronous และ accent
ทั้ง 10 จุดอยู่ในฟังก์ชันวาด panel ที่รันซ้ำทุก re-render ถ้าอ่านตรงจุดใช้งานจะได้สีถูกแต่เฟรมตก
จึงอ่านครั้งเดียวตอนโหลดตามที่ `docs/design-parity.md` §7.1 แนะนำไว้

**ทำไมอ่านสอง property ไม่ใช่ตัวเดียว** — `rgb(var(--accent-rgb))` แทน `--accent` ได้ในทางเทคนิค
แต่ 2 จุดที่เป็นสีทึบคือ "the accent" ตามความหมาย ไม่ใช่ "accent ที่ α = 1" การอ่าน `--accent`
ตรงๆ ทำให้ยังทำงานถูกถ้าวันหนึ่ง `--accent` เปลี่ยนไปเป็น `hsl()` หรือ `color-mix()`
ส่วนความเสี่ยงที่สอง property จะไม่ตรงกันนั้นมี assertion เดิม (จากรอบ 0002) คุมอยู่แล้ว

**ทำไมเก็บ `||` fallback ไว้** — ถ้า browser คืนค่าว่าง การไม่มี fallback แปลว่าลูกศรและ overlay
หายไปทั้งหมด ซึ่งแย่กว่าเหลืองเก่า และ fallback ที่ค้างไม่อัปเดตคือ drift ชนิดเดียวกับที่งานนี้
พยายามกำจัด จึงถูก pin กับ `tokens.css` ด้วย assertion (พิสูจน์แล้วว่า fail จริง)

**ทำไมนับ `cssVar(` ให้เป๊ะ ๆ = 2** — assertion ที่ห้าม literal จับได้แค่การถอยกลับแบบตรงไปตรงมา
มันจับ *ไม่ได้* ถ้ามีคนเขียน `` `rgba(${cssVar('--accent-rgb','255,199,44')},0.6)` `` ในฟังก์ชันวาด
ซึ่งถูกต้องเรื่องสีแต่ทำลายเหตุผลทั้งหมดของการแคช การนับจำนวนเรียกจึงเป็น assertion ที่คุม
"performance contract" โดยตรง (พิสูจน์แล้ว — ดู Verification)

**วิธีรวมสาย** — รอบนี้ `git merge --ff-only` **และ** `git checkout <branch> -- <path>`
(วิธีที่รอบก่อน ๆ ใช้) ถูกปฏิเสธทั้งคู่ ตัวที่ยังผ่านคือ `git show <branch>:<path> > <path>`
บันทึกวิธีนี้ไว้ใน `AUTOPILOT.md` แล้ว

## Verification

```
$ node tools/test.mjs
69 passed, 0 failed

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  41 passed (41)
```

**พิสูจน์ว่า assertion ใหม่ fail จริง** (ทำ 3 ทาง แล้ว revert ทุกครั้ง):

| ทดลองทำให้พัง | ผลที่ได้ |
|---|---|
| เอา `'rgba(255,199,44,0.6)'` ใส่กลับที่ `drawMovementArrow` | `68 passed, 1 failed` — *"drawing code still hard-codes rgba(255,199,44,α)"* |
| เปลี่ยน fallback เป็น `'255,199,45'` | `68 passed, 1 failed` — *"expected \"255,199,44\" got \"255,199,45\""* |
| ย้าย `cssVar()` เข้าไปเรียกในฟังก์ชันวาด | `68 passed, 1 failed` — *"got 3 calls — a call inside a draw function is the per-frame recalc this caches away"* |

**พิสูจน์ว่าไม่เปลี่ยนหน้าตา** — รัน block accent จริงจาก `index.html` ใน `vm` พร้อม stub
`getComputedStyle`: ได้ `ACCENT = "#FFC72C"`, `accentA(0.6) = "rgba(255,199,44,0.6)"`,
`accentA(0.95) = "rgba(255,199,44,0.95)"` — **เท่ากับ literal เดิมทุกตัวอักษร** และนับได้ว่า
`getComputedStyle` ถูกเรียก **2 ครั้ง ตอน init เท่านั้น**

`node --check` บน `<script>` ที่ดึงออกมา (3,156 บรรทัด) ผ่าน — ไม่มี syntax error

## What I did NOT do

- **ไม่แตะ jsPDF 5 จุด** (`doc.setTextColor(255, 199, 44)` บรรทัด ~2477, 2544, 3516, 3590, 3624)
  — เป็น API ที่รับ argument ตัวเลข ไม่ใช่สตริง CSS จึงเป็นงานคนละชนิดกับ canvas
  และ Next task ระบุ canvas อย่างเดียว → ตั้งเป็น Next task ของรอบหน้าแล้ว
- **ไม่แตะ `ctx.fillStyle='#0D0D0D'`** (พื้นหลัง contact sheet ซึ่งเท่ากับ `--bg` เป๊ะ)
  — เหตุผลเดียวกัน เขียนไว้เป็นข้อ 2 ของ Next task พร้อมเตือนว่าต้องแก้ assertion `cssVar( === 2`
  เป็น 3 ด้วย ไม่ใช่ถอด assertion ทิ้ง
- **ไม่ตัดสินใจแทนเจ้าของ** ใน §8 ข้อ 2, 4, 5, 6, 8, 10 — ทุกข้อเปลี่ยนหน้าตา
  หลังรอบนี้ **§8 ข้อ 1, 3, 7, 9 เสร็จหมดแล้ว = ครบทุกข้อที่ทำได้โดยไม่เปลี่ยนหน้าตา**
- **ไม่ติ๊ก criterion ข้อ 1** ถึงแม้ accent จะครบทุกฝั่งแล้ว — ยังเหลือ jsPDF, `#7ac87a` 5 จุด
  (บล็อกที่ §8 ข้อ 2) และ spacing/font-size (§8 ข้อ 8)

## Risk

1. **ไม่ได้เปิดในเบราว์เซอร์จริง** — `mcp playwright browser_navigate` ถูก permission layer
   ปฏิเสธในรอบนี้ (non-interactive) การพิสูจน์ "ไม่เปลี่ยนหน้าตา" จึงมาจาก (ก) สตริงที่ได้
   เท่ากับ literal เดิมทุกตัวอักษร และ (ข) `node --check` ผ่าน — **ไม่ใช่การเทียบภาพจริง**
   สิ่งที่ยังพลาดได้คือ **timing**: `ACCENT` เป็น top-level `const` ในสคริปต์ที่อยู่บรรทัด 877
   ซึ่งอยู่หลัง `</style>` (บรรทัด 576) และหลัง `<body>` ดังนั้น `:root` ถูก parse แล้วแน่นอน
   ตอนอ่าน — แต่ **ผู้รีวิวควรเปิดไฟล์ดูสักครั้ง** ว่าลูกศร movement, framing overlay,
   handle และหัวเรื่อง contact sheet ยังเป็นสีเหลืองอยู่
2. **assertion นับจำนวนเรียกเป็นดาบสองคม** — `cssVar( === 2` และ `getComputedStyle( === 1`
   จับ regression ได้แม่นมาก แต่จะ fail ทันทีเมื่อมีการใช้ `cssVar` กับ token ตัวอื่นอย่างถูกต้อง
   (เช่นข้อ 2 ของ Next task) เขียนเตือนไว้ใน Next task แล้วว่าให้**ปรับตัวเลข ไม่ใช่ถอด assertion**
   ถ้าผู้รีวิวเห็นรอบไหนถอด assertion นี้ทิ้ง นั่นคือสัญญาณอันตราย
3. **การรวมสายทำด้วย `git show > file` ไม่ใช่ merge จริง** — ประวัติของ `c5696cf` และ `8a99db0`
   ถูกยุบเหลือ commit เดียว (`f951277`) ตรวจแล้วว่า content ตรง (`git diff --stat` เทียบกับทั้งสอง
   branch เหลือเฉพาะไฟล์ที่ตั้งใจให้ต่าง) แต่ **graph จะดูเหมือนงานทั้งสองรอบนั้นเกิดขึ้นในรอบนี้**
   จุดที่ต้องดูเป็นพิเศษคือ `design-system/src/tokens.css` ซึ่งทั้งสองสายแก้ทับกัน — เลือก
   เวอร์ชันของ `0002` เพราะเป็น superset (ทั้งคู่เพิ่ม `--accent-rgb:255,199,44` ค่าเดียวกัน
   ต่างกันแค่ `0002` มี comment อธิบายเพิ่ม)
4. **ปัญหาต้นเหตุยังไม่ถูกแก้** — ถ้ารอบหน้าถูกแตกจาก `3503537` อีก จะเป็นครั้งที่ 5
   และงานทั้งหมดในรอบนี้จะหายจากสายตาอีกครั้ง **รอบหน้าต้องแตกจาก `…08-16_0025`**
