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

> รอบ 2026-08-20 พบว่า งาน "เพิ่ม token เข้า `index.html`" **ทำไปแล้วตั้งแต่ต้น** — บล็อก `:root`
> ที่ `index.html:18-25` เหมือน `design-system/src/tokens.css` ทุกตัวอักษร และไม่มีค่า hard-code
> ที่เหลืออยู่ตัวไหน "ตรงเป๊ะ" กับ token เลยสักตัว (พิสูจน์ไว้ใน SUMMARY.md) จึงไม่มีอะไรให้ substitute
> รอบนั้นทำได้แค่ใส่คอมเมนต์บอกที่มา + ลิสต์ค่าที่ไม่ match ไว้ให้เจ้าของตัดสินใจ

**ทำ acceptance criterion ข้อสุดท้าย (token มีแหล่งเดียว) ให้เป็นจริงแบบบังคับได้ ไม่ใช่แค่ธรรมเนียม**

ตอนนี้ `:root` ใน `index.html` เป็น **สำเนาที่ก๊อปด้วยมือ** ของ `tokens.css` — เหมือนกันอยู่ตอนนี้
แต่ไม่มีอะไรจับได้ถ้ามันเพี้ยน แก้ไฟล์ใดไฟล์หนึ่งบรรทัดเดียวก็พังเงียบๆ ให้ทำ:

1. เขียน `tools/check-tokens.mjs` — อ่านบล็อก `:root` จากทั้งสองไฟล์ แล้ว assert ว่า
   ชุด custom property + ค่า ตรงกันเป๊ะ ถ้าไม่ตรงให้ exit code ไม่ใช่ 0 พร้อมบอกว่าตัวไหนต่าง
2. **แยกเป็นสคริปต์ต่างหาก อย่าใส่เข้าไปใน `tools/test.mjs`** — ไม่งั้นเลข 54/54 ใน acceptance
   criteria จะเปลี่ยน ให้อัปเดต Verify เป็น
   `node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test`
3. เขียนขั้นตอน sync ลง README: "แก้ token ที่ `design-system/src/tokens.css` เท่านั้น แล้วก๊อป
   บล็อก `:root` ทั้งบล็อกมาทับใน `index.html` แล้วรัน `node tools/check-tokens.mjs`"
4. ติ๊ก acceptance criterion ข้อสุดท้ายเมื่อทั้ง 3 ข้อเสร็จ

**ยังห้ามเปลี่ยนหน้าตา** ห้ามแตะค่าสีใดๆ รอบนี้เป็นงานเครื่องมือ + เอกสารล้วน

รอบถัดๆ ไป (อย่าเพิ่งทำตอนนี้) เรียงไว้ให้แล้ว:
- เพิ่ม channel token (`--accent-rgb` ฯลฯ) เข้า `tokens.css` + สำเนาในแอป แล้วเปลี่ยน
  `rgba(255,199,44,.4)` → `rgba(var(--accent-rgb),.4)` — pixel เท่าเดิม ยุบได้ ~20 จุด
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
