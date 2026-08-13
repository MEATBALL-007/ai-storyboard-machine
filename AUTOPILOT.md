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
      *(บางส่วน: บล็อก `:root` เหมือน `tokens.css` ทุกบรรทัดแล้ว แต่ยังมีค่า hard-code เหลือ —
      accent-alpha 23 จุด, `#FFC72C` ดิบ 4 จุด, เขียว 3 เฉด 8 จุด, spacing/font-size ไม่เป็น token เลย
      ดูตัวเลขที่นับจริงใน `docs/design-parity.md` §7)*
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
      *(สำรวจครบแล้วใน `docs/design-parity.md` — Modal กับ EmptyState ตรง 100% อยู่แล้ว,
      Button–tab ตรง 100%, ที่เหลือรอการตัดสินใจ 10 ข้อใน §8 ยังไม่แก้อะไร)*
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
- [ ] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
- [x] `node tools/test.mjs` เขียว — 54/54 *(verified 2026-08-14; เกณฑ์คือ 0 failed ตัวเลขขยับขึ้นได้เมื่อเพิ่มเทสต์)*
- [x] `npm --prefix design-system test` เขียว 31/31 *(verified 2026-08-14)*
- [ ] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      *(ยังไม่ทำ: `tools/test.mjs` ปัจจุบันมี 54 assertion และ **ไม่มี**ตัวไหนเทียบ `:root` กับ `tokens.css`,
      README ก็ยังไม่มีหัวข้อ "Design tokens" — สองอย่างนี้ตรงกันได้ตอนนี้เพราะบังเอิญ ไม่ใช่เพราะถูกบังคับ)*

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

> **สถานะ (2026-08-14):** รายงานเทียบหน้าตาเสร็จแล้ว → `docs/design-parity.md`
> criterion 5 และ 6 ผ่าน (54/54, 31/31 verified) · criterion 1 ทำไปบางส่วน · criterion 7 **ยังไม่ได้ทำ**
> **คำเตือนเรื่องความน่าเชื่อถือของแผน:** โจทย์ของรอบ 2026-08-14_0023 ระบุว่า criterion 7 เสร็จแล้ว
> (อ้างว่ามี "assertion ที่ 55" ใน `tools/test.mjs` และหัวข้อ "Design tokens" ใน README)
> **ทั้งสองอย่างไม่มีอยู่จริงใน repo** — `tools/test.mjs` มี 54 assertion และ `grep "Design tokens" README.md`
> ไม่เจออะไร งานนั้นน่าจะอยู่ในรอบ 2026-08-13 ที่ไม่ได้ถูก commit อย่าเชื่อสถานะที่เขียนไว้ ให้ verify เอง

ทำ **criterion 7 (token มีแหล่งเดียว)** ให้จบ — เป็นงานที่**ไม่เปลี่ยนหน้าตาเลยแม้แต่พิกเซลเดียว**
และไม่ต้องรอการตัดสินใจด้านดีไซน์จากเจ้าของ:

1. เพิ่ม assertion ใน `tools/test.mjs` ที่ดึงบล็อก `:root{…}` ออกจาก `index.html` และจาก
   `design-system/src/tokens.css` แล้วเทียบว่าประกาศ `--name:value` ตรงกันครบทุกตัว
   (normalize whitespace/indent ก่อนเทียบ — `index.html` เยื้อง 4 space, `tokens.css` เยื้อง 2)
   assertion นี้อยู่ใน `tools/test.mjs` **ไม่ใช่**ใน marker section เพราะ sandbox ของ `vm` ไม่มี `fs`
   — และ**ห้ามแตะ marker ทั้งสี่ตัว**
2. เพิ่มหัวข้อ `## Design tokens` ใน `README.md` บอกว่า `design-system/src/tokens.css` คือแหล่งเดียว
   และขั้นตอนคือ "แก้ที่ `tokens.css` → คัดลอกบล็อกไปวางทับ `:root` ใน `index.html` → `node tools/test.mjs`
   จะ fail ถ้าลืม"
3. Verify: `node tools/test.mjs && npm --prefix design-system test` ต้องเขียว (จะเป็น 55/55)
   และต้องพิสูจน์ว่า assertion ใหม่จับได้จริง — แก้ค่าใน `tokens.css` ชั่วคราว รันแล้วต้อง fail แล้ว revert

**รอบถัดๆ ไป:** criterion 2 ต้องรอเจ้าของตอบคำถาม 10 ข้อใน `docs/design-parity.md` §8 ก่อน
ถ้าเจ้าของยังไม่ตอบ ให้ทำเฉพาะข้อ 1, 3(A′), 7, 9 ที่รายงานระบุว่า **ไม่กระทบหน้าตาเลย**
โดยทำทีละข้อ ข้อละหนึ่งรอบ (เริ่มที่ข้อ 1: `.chip{cursor:pointer}` — เป็นบั๊ก UX จริง ไม่ใช่ตัวเลือกดีไซน์)

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
