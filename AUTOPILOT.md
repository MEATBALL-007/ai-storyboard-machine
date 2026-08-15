# AUTOPILOT

> **⚠ อ่านก่อน — ไฟล์นี้เป็นฉบับรอบแรก ไม่ใช่ฉบับล่าสุด (บันทึก 2026-08-16 รอบ 0014)**
> branch `auto/…/2026-08-16_0014` ถูกตัดมาจาก `design-system` (`3503537`) ไม่ได้ตัดจากปลายรอบก่อน
> จึง**ไม่มี**งานของรอบ 0008–0002 อยู่เลย (ไม่มี `docs/design-parity.md`, `tools/test.mjs` มี 54 ไม่ใช่ 62)
> ฉบับที่เป็นความจริงอยู่บน `auto/…/2026-08-16_0002` (`c5696cf`) — **เวลา merge ให้ฝั่งนั้นชนะไฟล์นี้**
> รอบนี้แก้ด้วย git ไม่ได้: `git merge` / `reset` / `checkout <sha>` ถูก sandbox ปฏิเสธทั้งหมด
> ดูรายละเอียดใน `SUMMARY.md`

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
- [ ] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว *(รอบ 0014: 41/41 — เดิม 31 + 10 จาก Badge variant ใหม่)*
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

**ขั้น 0 — งานของ runner ไม่ใช่ของ agent (ต้องทำก่อน มิฉะนั้นรอบต่อไปจะพังซ้ำเป็นรอบที่ 4):**
ตัด branch รอบหน้าจาก `auto/…/2026-08-16_0002` (`c5696cf`) **แล้ว merge `auto/…/2026-08-16_0014`
เข้าไป** อย่าตัดจาก `design-system` อีก — หรือถ้าจะให้ agent จัดการเอง ต้องอนุญาต
`git merge` / `git checkout <sha> -- <path>` ใน sandbox ตอนนี้ถูกปฏิเสธทั้งหมด
ถ้าตัดจาก `design-system` ซ้ำอีก brief ที่ runner แสดง (เล่าถึง §8, `docs/design-parity.md`,
62 tests) จะไม่ตรงกับไฟล์จริงบน branch อีกครั้ง

**ขั้น 1 — งานจริงรอบหน้า: canvas accent (§7.1 กรอบท้ายหัวข้อของ `docs/design-parity.md`)**
ใน `index.html` มี accent ที่ hard-code ในโค้ดวาด canvas อยู่ ~10 จุด (8 จุดเป็น `rgba(255,199,44,α)`
และ 2 จุดเป็นสตริง `'#FFC72C'`) — canvas อ่าน CSS custom property เองไม่ได้ ต้องดึงผ่าน
`getComputedStyle(document.documentElement).getPropertyValue('--accent')`
**แคชผลไว้ครั้งเดียวตอน init ห้ามเรียกในลูปวาด** (`getComputedStyle` บังคับ style recalc
เรียกทุกเฟรมคือ jank) แล้วทำ assertion ใน `tools/test.mjs` กันการถอยกลับ

**ยังต้องรอเจ้าของตัดสินใจ (อย่าตัดสินแทน):** §8 ข้อ 2, 4, 5, 6, 8, 10 — ทุกข้อ**เปลี่ยนหน้าตา**
รวมถึง `--ok` (เขียว 3 เฉดที่ไม่ตรงกัน) ซึ่งบล็อก badge variant `--ok-solid` อยู่

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
