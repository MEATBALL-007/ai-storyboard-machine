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
- [x] `node tools/test.mjs` เขียว 55/55 *(verified 2026-08-14; เกณฑ์คือ 0 failed — ตัวเลขขยับขึ้นได้เมื่อเพิ่มเทสต์)*
- [x] `npm --prefix design-system test` เขียว 31/31 *(verified 2026-08-14)*
- [x] token มีแหล่งเดียว — `design-system/src/tokens.css` เป็นแหล่งเดียว, `tools/test.mjs` บังคับให้
      บล็อกใน `index.html` เหมือนกันทุกบรรทัด, ขั้นตอนการแก้ค่าเขียนไว้ใน README หัวข้อ "Design tokens"

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

> **สถานะ (2026-08-14):** criterion 1, 5, 6, 7 เสร็จแล้ว — `:root` ใน `index.html` เหมือน
> `tokens.css` ทุกบรรทัด และตอนนี้ `tools/test.mjs` **บังคับ** ให้เหมือน (assertion ที่ 55)
> พร้อมขั้นตอนแก้ค่าใน README หัวข้อ "Design tokens"
> **หมายเหตุ:** `SUMMARY.md` ของรอบ 2026-08-13 ไม่ได้ถูก commit ลง repo — ลิสต์ค่าที่ไม่ match
> ที่รอบนั้นทำไว้จึงหายไป ต้องทำใหม่

ทำ **รายงานเทียบหน้าตา (ไม่เปลี่ยนหน้าตาอะไรเลยในรอบนี้)** แล้ว commit ไว้เป็น
`docs/design-parity.md` — นี่คืออินพุตที่เจ้าของต้องใช้ตัดสินใจก่อนจะทำ criterion 2 ได้:

1. สำหรับ **5 element** (ปุ่ม, chip, badge, modal, empty state) เทียบ CSS ใน `index.html` กับ
   `design-system/src/components/*/…css` ทีละ property — ตารางละ element: property / ค่าในแอป /
   ค่าใน design system / ต่างหรือไม่
2. ลิสต์ค่าที่**ยังไม่มี token** พร้อมจำนวนจุดที่ใช้: `rgba(255,199,44,α)` (~29 จุด),
   spacing / radius / font-size scale, และสีเขียว `#7ac87a` — เสนอทางเลือกไว้ข้อละ 2 ทาง
   (เพิ่ม token ใหม่ใน `tokens.css` vs. ปล่อย hard-code) พร้อมข้อดีข้อเสียสั้นๆ
3. **ห้ามแก้ `index.html` หรือ `tokens.css` ในรอบนี้** — ผลลัพธ์คือไฟล์ markdown ไฟล์เดียว
   การเลือกว่าจะขยับสีของแอปหรือขยับ token เป็นการตัดสินใจด้านดีไซน์ที่เจ้าของต้องเป็นคนเลือก

**รอบถัดๆ ไป:** เมื่อเจ้าของตัดสินใจแล้ว ค่อยทำ criterion 2 ทีละ element (ปุ่มก่อน) โดยแต่ละรอบ
เปลี่ยน element เดียว

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
