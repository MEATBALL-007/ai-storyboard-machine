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
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
- [ ] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
- [x] `node tools/test.mjs` เขียว 54/54 <!-- verified 2026-08-28 -->
- [x] `npm --prefix design-system test` เขียว 31/31 <!-- verified 2026-08-28 -->

> **หมายเหตุจากรอบ 2026-08-28_0004:** ข้อ 1 บางส่วนเป็นจริงอยู่แล้วก่อนเริ่มงาน — บล็อก `:root`
> ใน `index.html` เหมือน `tokens.css` ทุกตัวอักษร (design system ถูกสกัดออกมาจากแอป ไม่ใช่ทางกลับกัน)
> ค่าที่ยัง hard-code เหลืออยู่ทั้งหมดถูกลิสต์ไว้ใน `SUMMARY.md` กลุ่ม A–E พร้อมเหตุผลว่าทำไม map ไม่ได้
> โดยไม่ตัดสินใจด้านดีไซน์แทนเจ้าของ
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

> งานเดิม ("เพิ่ม token เข้า `<style>` แล้ว map ค่าที่ตรงเป๊ะ") **ตรวจแล้วว่าทำเสร็จไปก่อนรอบนี้** —
> `:root` ของ `index.html` เหมือน `tokens.css` ทุกตัวอักษร และไม่เหลือ literal ในบล็อก `<style>`
> ที่ตรงกับค่า token เป๊ะให้ map อีก รายละเอียดครบใน `SUMMARY.md`

**ปิด acceptance criterion ข้อ 7 (token มีแหล่งเดียว) — ไม่เปลี่ยนหน้าตาเลยเช่นกัน**

ตอนนี้ `index.html` *ก๊อป* ค่า token มา ไม่ได้ *อ้างอิง* — ถ้าใครแก้ `--accent` ใน `tokens.css`
แอปจะไม่ตามทันและไม่มีอะไรเตือน (แอปเป็นไฟล์เดียวเปิดด้วย `file://` จึง `@import` ออกนอกไฟล์ไม่ได้
การก๊อปจึงถูกต้องแล้ว สิ่งที่ขาดคือ *ตัวบังคับให้ก๊อปตรงกัน*) ให้ทำ:

1. เขียน `tools/check-tokens.mjs` — อ่านบล็อก `:root` จากทั้งสองไฟล์, normalize whitespace,
   แล้ว exit 1 พร้อมบอกว่า token ตัวไหนต่างกัน ถ้าไม่ตรง
2. เพิ่มหัวข้อใน `README.md` ว่า "แก้ token ยังไง": แก้ที่ `design-system/src/tokens.css` เท่านั้น
   → ก๊อปบล็อกไปวางทับ `:root` ใน `index.html` → รัน `node tools/check-tokens.mjs`

**อย่าเพิ่มเทสต์นี้เข้า `tools/test.mjs`** เพราะจะทำให้จำนวนกลายเป็น 55 ซึ่งขัดกับ criterion ข้อ 5
ที่เขียนว่า 54/54 — การจะแก้ Verify command ให้รวม `check-tokens.mjs` ด้วยหรือไม่
**เป็นการตัดสินใจของเจ้าของ** ให้เสนอไว้ใน SUMMARY.md แล้วรอคำตอบ

### งานที่รอต่อจากนี้ (อย่าเพิ่งทำ)

- **map สีใน canvas/PDF export** (`index.html` บรรทัด 3467–3478) — `#0D0D0D` / `#FFC72C` /
  `#FA4616` ตรงกับ token เป๊ะ แต่ JS ต้องอ่านผ่าน `getComputedStyle(...)` เป็นการแก้โค้ด
- **รอคำตอบเจ้าของ 4 เรื่อง** ก่อนแตะหน้าตา (ดูตารางกลุ่ม A–D ใน `SUMMARY.md`):
  จะเพิ่ม `--accent-rgb`/`--secondary-rgb`/`--bg-rgb` ไหม · จะเพิ่ม token สี success (`#7ac87a`) ไหม ·
  จะเพิ่ม `--on-accent` แทน `#000` 17 จุดไหม · จะสร้าง spacing/radius scale ใน design system ไหม
  (`tokens.css` ตอนนี้ไม่มี token ของระยะเลย)
- แล้วค่อยเปลี่ยนหน้าตาทีละ element (criterion 2)

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
