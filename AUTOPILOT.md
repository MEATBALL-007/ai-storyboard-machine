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
- [x] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว 31/31
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      → `design-system/src/tokens.css` เป็นแหล่งเดียว, ขั้นตอน sync อยู่ใน README หัวข้อ
      "Design tokens — single source of truth", และ `tools/check-tokens.mjs` บังคับให้ตรงกันจริง

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

## Next task

**เพิ่ม channel token เข้า `tokens.css` แล้วยุบ `rgba()` ที่ hard-code ค่าสีเดียวกันในแอป**

ตอนนี้ในแอปมี `rgba(255,199,44,…)` (= `--accent` #FFC72C) และ `rgba(250,70,22,…)`
(= `--secondary` #FA4616) กระจายอยู่หลายจุด — ค่าตรงกับ token เป๊ะแต่เขียนเป็นตัวเลขดิบ
เพราะ CSS ใส่ alpha ให้ hex token ตรงๆ ไม่ได้ วิธีมาตรฐานคือเพิ่ม **channel token**:

1. เพิ่มใน `design-system/src/tokens.css`:
   `--accent-rgb:255,199,44; --secondary-rgb:250,70,22;`
   (ค่าต้องแปลงจาก `--accent`/`--secondary` ให้ตรงเป๊ะ — ห้ามขยับสี)
2. ก๊อกบล็อก `:root` ทั้งบล็อกมาทับใน `index.html` ตามขั้นตอนใน README
3. แทนที่ `rgba(255,199,44,X)` → `rgba(var(--accent-rgb),X)` และ
   `rgba(250,70,22,X)` → `rgba(var(--secondary-rgb),X)` **ทุกจุด**
   — สีที่เรนเดอร์ออกมาต้องเท่าเดิมทุกพิกเซล
   ⚠️ แทนเฉพาะใน `<style>` เท่านั้น **ห้ามแตะ `rgba()` ที่อยู่ในโค้ด JS วาด canvas**
   เพราะ `ctx.fillStyle` ไม่รู้จัก CSS custom property จะกลายเป็นสีดำเงียบๆ
4. รัน Verify ให้ครบ 3 คำสั่ง

รอบถัดๆ ไป (อย่าเพิ่งทำตอนนี้):
- ตัดสินใจเรื่อง near-miss (`#0a0a0a` vs `--panel`, `#161616`/`#151515` vs `--line`) — **ต้องถามเจ้าของ**
- เพิ่ม token กลุ่ม spacing/radius/type เข้า `tokens.css` (ตอนนี้ยังไม่มีเลยสักตัว)
- ค่อยจับหน้าตาทีละ element ให้ตรง component

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
