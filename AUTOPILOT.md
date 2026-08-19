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

- [ ] `index.html` ใช้ CSS custom properties จาก `design-system/src/tokens.css` แทนค่าสี/ระยะที่ hard-code
      → **hex ที่ match token เป๊ะ: เสร็จแล้ว** (ตรวจ 2026-08-20) — hex literal ที่เหลือใน `<style>`
        (`#000` ×18, `#222`, `#333`, `#fff`, `#161616`, `#151515`, `#0a0a0a`, `#bbb`, `#ffb4a0`, `#7ac87a`)
        **ไม่มีตัวไหนตรงกับ token เลยสักตัว** — ไม่มีอะไรให้ map เพิ่ม
      → **ยังเหลือ: `rgba()` ที่ derive จากสี token** ~30 จุดใน `<style>` (`rgba(255,199,44,α)` = accent,
        `rgba(250,70,22,α)` = secondary, `rgba(13,13,13,α)` = bg) — แก้ `--accent` ตอนนี้ glow 30 จุดยังเหลืองอยู่
        จึงยัง "แก้ที่เดียวเปลี่ยนทั้งระบบ" ไม่จริง → นี่คือ Next task
      → **ระยะ/มุมโค้ง/ตัวอักษร ยังไม่เริ่ม** — `tokens.css` มีแค่ 12 token (สี 11 + `--mono`) ไม่มีกลุ่มนั้นเลย
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
      ⚠️ **ยังไม่เคย verify จริงสักรอบ** และ jsPDF/Google Fonts โหลดจาก CDN อยู่ (ของเดิม ไม่ใช่ของใหม่)
        → offline จริงๆ PDF export จะพัง ต้องตัดสินใจว่าจะ inline หรือยอมรับ
- [x] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
      → ณ 2026-08-20 ยังไม่มีการเพิ่ม; ของเดิมมี 4 จุดใน `<head>` (fonts.googleapis ×3, cdnjs jsPDF ×1)
- [x] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว 31/31
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      → `design-system/src/tokens.css` เป็นแหล่งเดียว, ขั้นตอน sync อยู่ใน README หัวข้อ
        "Design tokens — single source of truth", และ `tools/check-tokens.mjs` บังคับให้ตรงกันจริง
        (ทดสอบแล้วว่า fail จริงทั้งกรณี value เพี้ยนและ token หาย)

## Verify

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

## Out of scope

- **ห้ามแปลง `index.html` เป็น React และห้ามเพิ่ม build step / bundler / npm dependency ให้แอป**
- **ห้ามแยก `index.html` ออกเป็นหลายไฟล์** — การเป็นไฟล์เดียวคือตัวโปรเจค ไม่ใช่ข้อจำกัดชั่วคราว
- **ห้ามแตะ marker `// ==PURE-LOGIC-START==` / `==PURE-LOGIC-END==` / `==TESTS-START==` / `==TESTS-END==`**
  — `tools/test.mjs` ดึงโค้ดออกมาด้วย marker เหล่านี้ ถ้า marker หายหรือย้าย test runner จะ throw ทันที
- ห้ามลบหรือปิดเทสต์เพื่อให้ผ่าน
- ห้ามแตะ `storyboard-simulator.html` ในรอบนี้
- **ห้ามแทน `rgba()`/hex ที่อยู่ในโค้ด JS วาด canvas ด้วย `var()`** — `ctx.fillStyle` ไม่รู้จัก
  CSS custom property จะกลายเป็นสีดำเงียบๆ (literal ในโค้ด canvas บรรทัด ~1345–1740, ~3091–3194 ตั้งใจไว้แบบนั้น)

## Next task

ทำให้ "แก้ `--accent` ที่เดียวแล้วเปลี่ยนทั้งระบบ" **เป็นจริง** — ตอนนี้ยังไม่จริง เพราะใน `<style>`
(บรรทัด 11–574) มี `rgba()` ที่ derive จากสี token อยู่ **20 จุด** แบบ hard-code (จาก `rgba()` ทั้งหมด 39 จุด):
`rgba(255,199,44,α)` = `--accent` **15 จุด**, `rgba(250,70,22,α)` = `--secondary` **3 จุด**,
`rgba(13,13,13,α)` = `--bg` **2 จุด**
เปลี่ยน `--accent` เป็นสีอื่นวันนี้ → glow/ring/gradient 15 จุดยังเหลืองค้างอยู่
(อีก 19 จุดที่เหลือเป็น `rgba(0,0,0,α)` / `rgba(255,255,255,α)` / เขียว `rgba(122,200,122,α)` — ไม่มี token คู่กัน ปล่อยไว้)

วิธีทำ (ไม่เปลี่ยนหน้าตาแม้แต่พิกเซลเดียว):
1. เพิ่ม channel token ลง `design-system/src/tokens.css` — `--accent-rgb:255,199,44;`
   `--secondary-rgb:250,70,22;` `--bg-rgb:13,13,13;` (ค่าตรงกับ hex เดิมเป๊ะ)
2. copy `:root{}` block ทั้งก้อนมาที่ `<style>` ของ `index.html`
3. แทน `rgba(255,199,44,.4)` → `rgba(var(--accent-rgb),.4)` ให้ครบทุกจุด **เฉพาะใน `<style>` เท่านั้น**
4. `node tools/check-tokens.mjs` ต้องเขียว และต้องไม่เหลือ `rgba(255,199,44` / `rgba(250,70,22`
   / `rgba(13,13,13` ในช่วงบรรทัดของ `<style>`

> ใช้ `rgba(var(--x-rgb), α)` ไม่ใช่ `color-mix()` — ผลลัพธ์เท่ากันเป๊ะและไม่ต้องพึ่ง browser support ใหม่
> **อย่าแตะ `rgba()` ในโค้ด JS canvas** (ดู Out of scope) — `ctx.fillStyle` อ่าน `var()` ไม่ออก

รอบถัดไปค่อยเริ่ม spacing/radius token แล้วค่อยไล่หน้าตาทีละ element

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
