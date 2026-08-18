# AUTOPILOT

## Goal

โปรเจคนี้มีสองส่วนที่ยัง**ไม่เชื่อมกัน**: `index.html` คือแอปจริง (vanilla, ไฟล์เดียว 3,756 บรรทัด,
54 tests ผ่าน) ส่วน `design-system/` คือ component library ที่สร้างขึ้นเมื่อ 20 ก.ค. (React + TS,
12 components, 31 tests ผ่าน) — ปัจจุบัน `index.html` **ไม่อ้างถึง design system เลยแม้แต่จุดเดียว**
งานที่ลงแรงไปทั้ง 51 commits จึงยังไม่มีผลต่อสิ่งที่ผู้ใช้เห็น

"เสร็จ" คือ: แอปจริงใช้**ภาษาการออกแบบเดียวกัน**กับ Phantom UI — สี, ระยะ, ตัวอักษร, และหน้าตา
ของ element พื้นฐาน มาจากแหล่งเดียวกัน แก้ที่เดียวแล้วเปลี่ยนทั้งระบบ

> **ข้อสมมติที่ตั้งไว้ (สำคัญ — ถ้าผิดให้หยุดแล้วบันทึกใน SUMMARY.md):**
> จะนำมาใช้เฉพาะ **ชั้น CSS** (`tokens.css`, `styles.css`, `fonts.css`) ไม่แปลงแอปเป็น React
> และไม่เพิ่ม build step เพราะ README ประกาศจุดขายไว้ชัดว่า *"No build tools, no npm, no backend
> — one index.html you can open straight in a browser"* การทำลายคุณสมบัตินั้นคือการทำลายตัวโปรเจค
> React components เอาไปใช้ตรงๆ ไม่ได้ แต่**ภาษาการออกแบบของมันเอาไปใช้ได้**

## Acceptance criteria

- [x] `index.html` ใช้ CSS custom properties จาก `design-system/src/tokens.css` แทนค่าสี/ระยะที่ hard-code
      — ยืนยันแล้ว 2026-08-19: `:root` ของ `index.html` เหมือน `tokens.css` ทุกตัว (12 token) และ CSS ใช้
      `var(--…)` 271 จุด · หมายเหตุ: `tokens.css` **ไม่มี token ของระยะ/รัศมี/ขนาดตัวอักษรเลย** ครึ่ง "ระยะ"
      จึงผ่านแบบว่างเปล่า — ดู "Open design decisions" ข้อ D
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
- [ ] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
      — **ยังไม่ผ่าน (ของเดิม ไม่ใช่ของที่เพิ่งเพิ่ม):** `index.html` บรรทัด 7–10 มี external reference อยู่แล้ว
      4 บรรทัด (preconnect ×2, JetBrains Mono stylesheet จาก fonts.googleapis, jsPDF จาก cdnjs)
      = ทรัพยากรจริง 2 ตัว — ดู "Open design decisions" ข้อ E
- [x] `node tools/test.mjs` เขียว 54/54 — ยืนยัน 2026-08-19
- [x] `npm --prefix design-system test` เขียว 31/31 — ยืนยัน 2026-08-19
- [ ] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)

## Verify

```
node tools/test.mjs && npm --prefix design-system test
```

## Out of scope

- **ห้ามแปลง `index.html` เป็น React และห้ามเพิ่ม build step / bundler / npm dependency ให้แอป**
- **ห้ามแยก `index.html` ออกเป็นหลายไฟล์** — การเป็นไฟล์เดียวคือตัวโปรเจค ไม่ใช่ข้อจำกัดชั่วคราว
- **ห้ามแตะ marker `// ==PURE-LOGIC-START==` / `==PURE-LOGIC-END==` / `==TESTS-START==` / `==TESTS-END==`**
  — `tools/test.mjs` ดึงโค้ดออกมาด้วย marker เหล่านี้ ถ้า marker หายหรือย้าย test runner จะ throw ทันที
- ห้ามลบหรือปิดเทสต์เพื่อให้ผ่าน
- ห้ามแตะ `storyboard-simulator.html` ในรอบนี้

## Next task

> รอบ 2026-08-19_0022 พบว่า task เดิม (**"เพิ่ม token เข้า `index.html` แล้ว map ค่า hard-code"**)
> **ทำเสร็จไปแล้ว** — `:root` ของ `index.html` กับ `design-system/src/tokens.css` มีค่าเหมือนกันเป๊ะทั้ง 12 ตัว
> และไม่เหลือค่า hard-code ตัวไหนใน CSS ที่ตรงกับ token เลยสักตัว (ตรวจด้วยสคริปต์ ดู SUMMARY.md)
> จึงไม่ทำงานทับ และเปลี่ยน Next task เป็นข้อถัดไปที่ยังไม่เสร็จจริง

ทำ **acceptance criterion ข้อ 7 (token มีแหล่งเดียว)** ให้จบ — ตอนนี้ token ถูก "ก๊อปด้วยมือ" ไว้สองที่
ที่*บังเอิญ*ตรงกัน ไม่มีอะไรบังคับให้ตรงกันต่อไป ถ้าใครแก้ `tokens.css` แอปจะเงียบๆ ล้าหลังทันที

สิ่งที่ต้องทำ:

1. เขียน `tools/sync-tokens.mjs` — อ่าน `design-system/src/tokens.css` (แหล่งจริงแหล่งเดียว) แล้ว
   เขียนทับบล็อก `:root{…}` ใน `<style>` ของ `index.html`
   - `node tools/sync-tokens.mjs --check` → exit 1 ถ้าไม่ตรง (พิมพ์ diff), exit 0 ถ้าตรง
   - `node tools/sync-tokens.mjs --write` → sync ให้ตรง
   - ต้องหาบล็อกด้วย marker ของตัวเอง (เช่น `/* ==TOKENS-START== */` … `/* ==TOKENS-END== */`)
     **ห้ามใช้ marker ของ test runner ซ้ำ** และห้ามแตะ marker เดิม
2. รันแบบ `--check` แล้วต้องผ่านทันที (ตอนนี้ค่าตรงกันอยู่แล้ว → ไม่มีอะไรเปลี่ยนหน้าตา)
3. เขียนใน `README.md` หัวข้อสั้นๆ ว่า "แก้สีที่ `design-system/src/tokens.css` แล้วรัน
   `node tools/sync-tokens.mjs --write`" — และย้ำว่า `index.html` ยังเปิดจาก `file://` ได้เหมือนเดิม
   เพราะสคริปต์นี้เป็นเครื่องมือของ dev (เหมือน `tools/test.mjs`) ไม่ใช่ build step ของแอป

ข้อจำกัด: **ห้ามเปลี่ยนค่าสีใดๆ** และห้ามแก้จำนวนเทสต์ (`node tools/test.mjs` ต้องยังเป็น 54/54)

---

## Open design decisions (ต้องให้เจ้าของตัดสิน — agent ห้ามเดาเอง)

ค่าที่เหลืออยู่ใน `<style>` ของ `index.html` **ไม่มีตัวไหนตรงกับ token เลย** จึง map ตรงๆ ไม่ได้
แต่ละกลุ่มต้องเลือกว่าจะ *ขยับสีของแอป* ให้เข้า token หรือ *เพิ่ม token ใหม่* เข้า design system:

- **A. เฉดเทา/ดำที่ token ไม่ครอบคลุม** — `#000` (18 จุด: ตัวอักษรบนพื้น accent, พื้น canvas,
  พื้น animatic), `#0a0a0a` (4 จุด: sceneBar, animaticBar, animaticTrack, หัวข้อใน menu — เป็นเฉดที่ *เข้มกว่า*
  `--panel` #0C0C0C), `#161616`/`#151515` (เส้นคั่นในตาราง/รายการ — *อ่อนกว่า* `--line` #1c1c1c),
  `#222`/`#333` (scrollbar), `#fff`, `#bbb`
  → เลือก: snap เข้า token ที่ใกล้ที่สุด (หน้าตาจะขยับนิดหน่อย) หรือเพิ่ม `--panel2` / `--line-soft` / `--on-accent`
- **B. เขียว "สำเร็จ/ปกติ" ที่ไม่มี token** — ใช้อยู่ **สามเฉดที่ต่างกันเล็กน้อย**: `#7ac87a` (4 จุด),
  `rgba(122,200,122,…)` (ai-chip.live), `rgba(120,200,120,.15)` (sev.ok), `rgba(80,180,90,.85)` (pc-imgbadge)
  → ควรรวมเป็น `--success` ตัวเดียวใน `tokens.css`
- **C. สีแดงอ่อนของ toast error** — `#ffb4a0` (เป็นเฉดอ่อนของ `--secondary`) → ควรเป็น `--danger-fg` หรือคล้ายกัน
- **D. ค่า alpha ของ token ที่มีอยู่แล้ว** — เช่น accent ที่ .05/.07/.16/.32/.35/.4/.45/.5/.6/.85/.9,
  secondary ที่ .1/.18, bg ที่ .86/.92, ขาว/ดำอีกหลายระดับ (รวม ~30 จุด)
  เนื้อสีตรงกับ token เป๊ะ แต่ token ชุดปัจจุบันเป็น hex ทึบ จึงเขียน `rgba()` จาก token ไม่ได้
  → เลือก: เพิ่ม token แบบ channel (`--accent-rgb:255,199,44` แล้วใช้ `rgba(var(--accent-rgb),.4)` — ได้ค่าเท่าเดิมเป๊ะ
  และรองรับ browser กว้าง) หรือใช้ `color-mix()` (สั้นกว่าแต่ต้อง Chrome 111+/Safari 16.2+)
  **ยังมีอีกเรื่อง: `tokens.css` ไม่มี token ของ spacing / radius / font-size เลย** — ถ้าจะให้ criterion ข้อ 1
  มีความหมายจริงกับคำว่า "ระยะ" ต้องตัดสินใจว่าจะเพิ่มสเกลพวกนี้เข้า design system ไหม
- **E. CDN ที่มีอยู่เดิม vs. criterion ข้อ 4** — `index.html` บรรทัด 7–10 โหลด JetBrains Mono จาก
  Google Fonts และ jsPDF จาก cdnjs อยู่แล้ว เปิดจาก `file://` แบบออฟไลน์จึงได้ฟอนต์ fallback และ export PDF ไม่ได้
  `design-system/src/fonts/` มี woff2 ของ JetBrains Mono ครบ 4 น้ำหนัก (รวม ~86 KB) ที่ฝัง base64 ลงไฟล์เดียวได้
  → เลือก: ฝังฟอนต์ (ไฟล์โตขึ้น ~115 KB จาก 187 KB) เพื่อให้ออฟไลน์จริง หรือปล่อยไว้แล้วแก้ถ้อยคำ criterion ข้อ 4
- **F. สีในโค้ด `<script>` (canvas) ยังไม่ถูก token ควบคุมเลย** — บล็อก `<script>` (บรรทัด 871–4008)
  มี hex literal 47 จุด (ไม่ซ้ำ 35 ค่า) และ `rgba()` 70 จุด (ไม่ซ้ำ 52 ค่า) และ**ไม่เรียก `getComputedStyle` เลย**
  แปลว่าภาพที่วาดลง canvas (ซึ่งคือหัวใจของแอป) จะ **ไม่ตามค่า token** ต่อให้แก้ `tokens.css`
  → เป้าหมาย "แก้ที่เดียวแล้วเปลี่ยนทั้งระบบ" ยังไม่จริงสำหรับส่วนนี้ ต้องเลือกว่าจะอ่าน token ตอน runtime
  (`getComputedStyle(document.documentElement).getPropertyValue('--accent')` แล้ว cache ไว้) หรือยอมรับว่า
  canvas มี palette ของตัวเองแยกต่างหาก — งานนี้ใหญ่กว่าชั้น CSS มาก ควรเป็นเฟสแยก

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
