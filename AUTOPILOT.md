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
- [x] `node tools/test.mjs` เขียว — เกณฑ์คือ 0 failed *(verified 2026-08-15: 55/55)*
- [x] `npm --prefix design-system test` เขียว 31/31 *(verified 2026-08-15)*
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      *(done 2026-08-15 ใน `e5a1925`: assertion ที่ 55 ใน `tools/test.mjs` เทียบ `:root` สองฝั่งแบบสองทาง
      + หัวข้อ `## Design tokens` ใน README — พิสูจน์แล้วว่า fail จริงทั้งกรณีค่าเปลี่ยน / token หาย / token เกิน)*

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

## ⚠️ ปัญหาเชิงโครงสร้าง: ทุกรอบทำงานซ้ำเพราะ branch ไม่เคยถูก merge

พบตอนรอบ 2026-08-15_0003 (ดู SUMMARY.md ของรอบนั้นเป็นหลักฐาน):

- `main` ยังอยู่ที่ `ef3220e "Add README"` — **ยังไม่มี branch ไหนถูก merge เข้า main เลยสักอัน**
- ทุกรอบแตก branch จากฐานเดียวกัน (`3503537`) ไม่ใช่จากปลาย branch ของรอบก่อน
  ผลคือ**งานของรอบก่อนหายไปจากสายตาของรอบถัดไปทุกครั้ง**
- ของที่มีอยู่จริงแต่ไม่อยู่บน branch นี้:
  - `75c38ae` บน `auto/…/2026-08-14_0008` — token parity assertion + README "Design tokens"
    (**คือ criterion 7 เป๊ะๆ** รอบนี้ทำซ้ำโดยไม่รู้ตัวก่อนจะไปเจอ)
  - `a1c6348` + `972502b` บน `auto/…/2026-08-14_0023` — `docs/design-parity.md` และ AUTOPILOT ฉบับที่มี §8
- คำเตือนใน AUTOPILOT รอบ 0023 ที่ว่า "งานรอบ 2026-08-13 ไม่ได้ถูก commit" **สรุปผิด** —
  มัน commit แล้ว แค่อยู่คนละ branch ที่ไม่เคยถูก merge

**ห้ามเริ่มงานใหม่ก่อนแก้เรื่องนี้** ไม่งั้นทุกรอบจะเผาไปกับการทำของเดิมซ้ำและสรุปสถานะผิดซ้ำ

## Next task

**รวม branch ให้เป็นสายเดียวก่อน — อย่าเพิ่งแตะเรื่องดีไซน์**

1. เอา `docs/design-parity.md` กลับมา: `git cherry-pick a1c6348` (ถ้าชนให้เอาไฟล์นั้นมาตรงๆ)
   ไฟล์นี้คือรายงานเทียบหน้าตาที่ criterion 2 ต้องใช้ และตอนนี้ไม่มีอยู่บน branch นี้
2. เทียบ token parity assertion สองเวอร์ชันแล้วเหลือไว้เวอร์ชันเดียว: ของรอบนี้ (`e5a1925`,
   เทียบราย token แบบสองทาง ไม่สนลำดับ/การขึ้นบรรทัด) กับของ `75c38ae` (เทียบทีละบรรทัดตามตำแหน่ง
   ซึ่งจะ fail ผิดๆ ถ้ามีคนสลับลำดับบรรทัด) — **ไม่ต้องเอาทั้งสองอัน** ซ้ำกันเปล่าๆ
3. เขียนใน SUMMARY.md ว่า runner ต้อง merge PR เข้า main (หรือแตก branch รอบใหม่จากปลาย branch รอบก่อน)
   ไม่งั้นปัญหานี้จะเกิดอีกในรอบหน้าทันที — เรื่องนี้แก้ที่ repo ฝ่ายเดียวไม่ได้

**หลังจากนั้น** ค่อยทำ criterion 2 ตาม §8 ของ `docs/design-parity.md` ทีละข้อ ข้อละหนึ่งรอบ
เริ่มที่ข้อ 1: `.chip{cursor:pointer}` — เป็นบั๊ก UX จริง ไม่ใช่ตัวเลือกดีไซน์ที่ต้องรอเจ้าของตอบ

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 55 automated tests
