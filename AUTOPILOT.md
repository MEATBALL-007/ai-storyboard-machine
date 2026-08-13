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
- [x] `node tools/test.mjs` เขียว 54/54 *(verified 2026-08-13; ถ้ารอบไหนเพิ่มเทสต์ ตัวเลขนี้ขยับขึ้นได้ — เกณฑ์คือ 0 failed)*
- [x] `npm --prefix design-system test` เขียว 31/31 *(verified 2026-08-13)*
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

> **ผลจากรอบ 2026-08-13:** งาน "เพิ่ม token เข้า `index.html`" **ทำเสร็จอยู่แล้วก่อนรอบนี้** —
> `:root` ใน `index.html` เหมือน `design-system/src/tokens.css` **ทุกไบต์** (เพราะ design system
> ถูกสกัดออกมาจากแอป ไม่ได้สร้างขึ้นแยกกัน) และในชั้น CSS ไม่เหลือค่า hard-code ที่ตรงกับ token
> เป๊ะแม้แต่ตัวเดียว ส่วน "ระยะ" map ไม่ได้เพราะ `tokens.css` **ไม่มี spacing/radius/font-size
> token เลย** (มีแค่ 11 สี + `--mono`) รายละเอียด + ลิสต์ค่าที่ไม่ match อยู่ใน `SUMMARY.md`

ทำ **acceptance criterion ข้อ 7 (token มีแหล่งเดียว)** ให้จบ — ตอนนี้ token สองชุดเหมือนกันโดย
"บังเอิญทางประวัติศาสตร์" ไม่มีอะไรกันมันเลื่อนออกจากกัน:

1. เพิ่ม assertion ใน `tools/test.mjs` ที่อ่าน `design-system/src/tokens.css` แล้วเทียบกับบล็อก
   `:root{...}` ใน `index.html` ว่า**เท่ากันทุกไบต์** (หลังตัด indent 2 ช่องด้านนอก) — ถ้าไม่เท่า
   ให้ fail พร้อมบอกบรรทัดที่ต่าง `tools/test.mjs` อ่าน `index.html` เป็น string อยู่แล้ว
   (บรรทัด 4) และการเช็คนี้อยู่**นอก** marker ทั้งหมด จึงไม่ต้องแตะ marker และไม่ต้องเพิ่ม dependency
2. เทสต์จะกลายเป็น 55 passed — **แก้ตัวเลขในเกณฑ์ข้อ 5 ให้ตรงในคอมมิตเดียวกัน** (ห้ามลดเทสต์
   เพื่อให้เลขตรง — สวิตช์ที่ถูกคือขยับเกณฑ์ขึ้น)
3. เขียนหัวข้อ **"Design tokens"** ใน `README.md`: `design-system/src/tokens.css` คือแหล่งเดียว,
   บล็อกใน `index.html` คือสำเนาที่ต้องเหมือนทุกไบต์, ขั้นตอนเวลาแก้ค่า (แก้ tokens.css → copy
   ทับบล็อกใน index.html → `node tools/test.mjs`), และเหตุผลที่ต้อง copy แทน `@import`
   (เพราะแอปต้องเปิดจาก `file://` ได้โดยไม่มี build/serve)

ห้ามเปลี่ยนค่าสีหรือหน้าตาในรอบนี้ — เป้าหมายคือทำให้การซ้ำกันของ token *ถูกบังคับ* ไม่ใช่แค่จริงอยู่เฉยๆ

**รอบถัดๆ ไป (ยังไม่ต้องทำ, และสองข้อแรกต้องรอเจ้าของตัดสินใจก่อน):**
- ตัดสินใจเรื่อง `rgba(255,199,44,α)` 29 จุด → เสนอเพิ่ม channel token (`--accent-rgb` ฯลฯ)
- ตัดสินใจเรื่อง spacing/radius/type scale + สีเขียว `#7ac87a` ที่ยังไม่มี token
- ค่อยทำ criterion 2: ให้ปุ่ม/chip/badge/modal/empty state หน้าตาตรงกับ component ทีละตัว

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
