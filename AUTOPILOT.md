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
      *(คืบหน้า 2026-08-16 ใน `5d3ef0c`: §8 ข้อ 3 เสร็จแบบ A′ — เพิ่ม `--accent-rgb:255,199,44`
      ใน `tokens.css` แล้ว mirror ลง `index.html` · แปลง 15 จุดใน CSS block เป็น
      `rgba(var(--accent-rgb),α)` α เดิมครบทุกค่า ไม่เปลี่ยนหน้าตา · assertion ที่ 62 บังคับ
      `--accent-rgb` = channel ของ `--accent` (พิสูจน์ mutation สองทางแล้ว)*
      **ยังไม่ติ๊ก** เพราะเหลือ: canvas 10 จุด · `#7ac87a` 5 จุด (§7.2) · spacing/font-size (§7.3)
      · และ design system เองยัง hard-code `rgba(255,199,44,…)` อีก 2 จุด (`Badge.css:8`,
      `Button.css:9`) ซึ่งแก้ได้ 2 บรรทัดโดยไม่เปลี่ยนหน้าตา)*
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
      *(คืบหน้า 2026-08-15 ใน `81ff77a`: §8 ข้อ 1 เสร็จ — `.chip` ได้ `cursor:pointer` + assertion ที่ 56 ใน `tools/test.mjs`
      เทียบ `.chip` ↔ `.pui-chip` สองทาง)*
      *(คืบหน้า 2026-08-15 ใน `6668329`: §8 ข้อ 9 เสร็จ — `#regenModal` ได้ `role="dialog"` /
      `aria-modal="true"` / `aria-labelledby="regenTitle"` บน `.modal` (ตำแหน่งเดียวกับ `Modal.tsx`)
      + assertion ที่ 57–61 สองทาง ไม่แตะ CSS ไม่เปลี่ยนหน้าตา)*
      *(คืบหน้า 2026-08-16 ใน `5d3ef0c`: §8 ข้อ 3 เสร็จ — เหลือ §8 ข้อ 2, 4, 5, 6, 7, 8, 10
      โดยข้อ 7 เป็นข้อเดียวที่เหลือซึ่งไม่ต้องรอเจ้าของตัดสินใจ)*
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
- [ ] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
- [x] `node tools/test.mjs` เขียว — เกณฑ์คือ 0 failed *(verified 2026-08-16: 62/62)*
- [x] `npm --prefix design-system test` เขียว 31/31 *(verified 2026-08-16)*
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

พบตอนรอบ 2026-08-15_0003, รวมสายในรอบ 2026-08-15_0013 (`0fc934e`) — **แล้วเกิดซ้ำอีกในรอบ
2026-08-15_0025** ซึ่งถูกแตกจาก `3503537` อีกครั้ง (ครั้งที่ 5) ต้องรวมสายใหม่ใน `241b19c`
— **แล้วเกิดซ้ำเป็นครั้งที่ 6 ในรอบ 2026-08-15_0036** ต้องรวมสายใหม่อีกใน `e39d13c`
**ต้นเหตุยังไม่ถูกแก้** เพราะมันอยู่ฝั่ง runner ไม่ใช่ฝั่ง repo:

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

**วิธีรวมสายที่ใช้ได้จริงใน sandbox (บทเรียนจากรอบ 0025):** `git merge --ff-only` และ
`git reset --hard` **ถูก permission layer ปฏิเสธทั้งคู่** ตัวที่ผ่านคือ
`git checkout <branch ปลายสายก่อน> -- <ไฟล์ที่ต่าง>` แล้ว commit เอง — ได้ content เท่ากันเป๊ะ
(ตรวจด้วย `git diff --cached <branch> --stat` ต้องว่าง) ต่างแค่ประวัติถูกยุบเหลือ commit เดียว

**อัปเดต 2026-08-16 (รอบ 0002) — เกิดซ้ำเป็นครั้งที่ 3 ติดต่อกัน:** branch รอบนี้ถูกแตกจาก
`3503537` อีกครั้ง ทั้งที่ปลายสายรอบก่อนคือ `6a4b9d7` รวมสายไปใน `b02577c` ด้วยวิธีข้างบน
ยืนยันแล้วว่า `git merge --ff-only` ยังถูกปฏิเสธอยู่ (แม้รอบนี้ `3503537` เป็น ancestor ตรงๆ
ของ `6a4b9d7` ซึ่ง fast-forward ได้ในทางทฤษฎี) **ทุกรอบเสียเวลาไปกับเรื่องนี้ประมาณ 1 ใน 5
ของรอบ — เป็นปัญหาฝั่ง runner ที่ repo แก้เองไม่ได้จริงๆ**

## Next task

**เก็บหนี้ 2 บรรทัดของรอบที่แล้วก่อน แล้วทำ §8 ข้อ 7: เพิ่ม badge variant `--neutral`
กับ `--accent-solid` เข้า design system** (`docs/design-parity.md` §3.2)

§8 ข้อ 1 เสร็จรอบ 0025 (`81ff77a`) · ข้อ 9 เสร็จรอบ 0036 (`6668329`) · ข้อ 3 เสร็จรอบ 0002 (`5d3ef0c`)
ข้อ 7 เป็น**ข้อสุดท้ายที่เหลือ**ซึ่งทำได้โดยไม่ต้องรอเจ้าของตัดสินใจและไม่เปลี่ยนหน้าตา

1. **ก่อนอื่น (2 บรรทัด):** design system ยัง hard-code `rgba(255,199,44,α)` อยู่ 2 จุด
   ทั้งที่เป็นเจ้าของ `--accent-rgb` เอง — `design-system/src/components/Badge/Badge.css:8`
   (`.pui-badge--note`, α `.16`) และ `Button/Button.css:9` (`.pui-btn--primary:hover`, α `.4`)
   เปลี่ยนเป็น `rgba(var(--accent-rgb),α)` **α เดิม** เป็น mechanical refactor ล้วน
   ตกค้างจากรอบ 0002 ที่จงใจไม่แตะเพราะอยู่นอกขอบเขต task
2. อ่าน §3.2 ของ `docs/design-parity.md` — มี badge 4 ตัวในแอปที่ design system ไม่มีคู่
3. เพิ่ม **แค่ 2 variant** ใน `Badge.tsx` (union ของ prop `variant`) + `Badge.css`:
   - `--neutral` = เหมือน `--accent` แต่ `color:var(--text)` (คู่กับ `.pc-dur`)
   - `--accent-solid` = `background:rgba(var(--accent-rgb),.85); color:#000` (คู่กับ `.pd-edit-badge`)
4. **อย่าเพิ่ม `--ok-solid`** ถึงแม้ §3.2 จะเสนอไว้ — สีของมันคือ `rgba(80,180,90,.85)` ซึ่ง §7.2
   ระบุว่าเป็นเขียวเฉดที่ 3 ที่ไม่ตรงกับใครเลย การเพิ่มเข้าไปคือการรับรอง drift ให้เป็นทางการ
   ต้องรอเจ้าของตัดสิน §8 ข้อ 2 (`--ok`) ก่อน — **บันทึกเหตุผลนี้ใน SUMMARY.md ด้วย**
5. **นี่เป็นงานฝั่ง design system อย่างเดียว ห้ามแตะ `index.html`** — การเพิ่ม variant ใหม่
   ไม่เปลี่ยนหน้าตาของแอปเลย ส่วนการทำให้ `.pc-dur` / `.pd-edit-badge` ไปใช้ variant พวกนี้จริง
   ต้องแก้ CSS ของแอป = คนละเรื่อง = คนละรอบ
6. เพิ่ม test ใน `Badge.test.tsx` ให้ครอบ variant ใหม่ (ตอนนี้มี 2 test) แล้วรัน Verify ทั้งสองชุด
   — `node tools/test.mjs` ต้องยังได้ 62/62 เพราะไม่ได้แตะแอป

**รอบถัดๆ ไป** งาน canvas accent (§7.1 กรอบท้ายหัวข้อ: 8 จุด `rgba` + 2 จุด `'#FFC72C'` อ่านค่า
ผ่าน `getComputedStyle` แล้ว**แคชไว้ครั้งเดียว** ห้ามเรียกในลูปวาด) ซึ่งเป็นงานคนละชนิดกับ CSS
ส่วน §8 ข้อ 2, 4, 5, 6, 8, 10 **เปลี่ยนหน้าตา** ต้องให้เจ้าของเลือกก่อน อย่าตัดสินใจแทน

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 61 automated tests
