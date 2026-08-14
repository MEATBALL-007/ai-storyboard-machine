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
      *(done 2026-08-15 ใน `e5a1925`, อยู่บน branch นี้ผ่าน `0fc934e`: assertion ที่ 55 ใน `tools/test.mjs` เทียบ `:root` สองฝั่งแบบสองทาง
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

พบตอนรอบ 2026-08-15_0003, **รวมสายเสร็จแล้วในรอบ 2026-08-15_0013** (`0fc934e`)
แต่**ต้นเหตุยังไม่ถูกแก้** เพราะมันอยู่ฝั่ง runner ไม่ใช่ฝั่ง repo:

- `main` ยังอยู่ที่ `ef3220e "Add README"` — **ยังไม่มี branch ไหนถูก merge เข้า main เลยสักอัน**
- ทุกรอบแตก branch จากฐานเดียวกัน (`3503537`) ไม่ใช่จากปลาย branch ของรอบก่อน
  ผลคือ**งานของรอบก่อนหายไปจากสายตาของรอบถัดไปทุกครั้ง** — เกิดมาแล้ว 4 รอบติด
- branch พี่น้องที่แตกจาก `3503537` ทั้งหมด: `…08-13_1633` (`5bbdaa5`), `…08-14_0008` (`75c38ae`),
  `…08-14_0023` (`972502b`), `…08-15_0003` (`50c86a7`) — ไม่มีอันไหนเห็นอันไหน
- คำเตือนใน AUTOPILOT รอบ 0023 ที่ว่า "งานรอบ 2026-08-13 ไม่ได้ถูก commit" **สรุปผิด** —
  มัน commit แล้ว แค่อยู่คนละ branch ที่ไม่เคยถูก merge

**สิ่งที่ runner ต้องทำ (repo ทำเองไม่ได้):** merge PR ของรอบนี้เข้า `main` แล้วให้รอบถัดไป
แตก branch จาก `main` — หรืออย่างน้อยแตกจากปลาย branch ของรอบก่อน ถ้าไม่ทำ รอบหน้าจะกลับไป
เริ่มที่ `3503537` อีกและ**งานทั้งหมดในรอบนี้จะหายจากสายตาทันที**

**เช็คก่อนเริ่มงานทุกรอบ:** `git log --oneline --all --graph -20` — ถ้าเห็น branch พี่น้อง
แตกขนานกันจากฐานเดียวกัน แปลว่าปัญหานี้ยังอยู่ ให้รวมสายก่อนแล้วค่อยทำงานตาม Next task

## Next task

**criterion 2 ข้อแรก: `.chip{cursor:pointer}`** (§8 ข้อ 1 ของ `docs/design-parity.md`)

`.pui-chip` ใน design system มี `cursor:pointer` แต่ `.chip` ใน `index.html` ไม่มี ทั้งที่คลิกได้จริง
— เป็นบั๊ก UX ไม่ใช่ตัวเลือกดีไซน์ที่ต้องรอเจ้าของตอบ และ**ไม่เปลี่ยนหน้าตาสักพิกเซล** (แค่ cursor)

1. อ่าน §2 ของ `docs/design-parity.md` ก่อน — มันเทียบ `.chip` ↔ `.pui-chip` ไว้ทีละ property แล้ว
2. แก้เฉพาะ `cursor` **ห้ามแตะ padding** — §8 ข้อ 5 (`6px 2px` → `6px 10px`) เปลี่ยนหน้าตาจริง
   และเสี่ยง label ล้น ต้องดูด้วยตาก่อน เก็บไว้รอบอื่น
3. ดู `.chip` ตระกูลอื่นใน §2.1 ด้วยว่าโดนผลกระทบไหม
4. รัน Verify command ให้ครบสองชุด

**รอบถัดๆ ไป** ทำ §8 ต่อทีละข้อ ข้อละหนึ่งรอบ ลำดับที่ไม่ต้องรอเจ้าของตัดสินใจคือ
ข้อ 9 (a11y contract ของ `#regenModal`) → ข้อ 3 ทางเลือก A′ (`--accent-rgb`) → ข้อ 7 (badge variant)
ส่วนข้อ 2, 4, 5, 6, 8, 10 **เปลี่ยนหน้าตา** ต้องให้เจ้าของเลือกก่อน อย่าตัดสินใจแทน

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 55 automated tests
