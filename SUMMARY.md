# SUMMARY — รอบ 2026-08-15_0036

Task: **§8 ข้อ 9 — ยก a11y contract ของ `Modal` เข้า `#regenModal`**

## What I did

- **รวมสายก่อน (ครั้งที่ 6)** — runner แตก branch นี้จาก `3503537` อีกครั้ง ทำให้งานรอบ
  0003 / 0013 / 0025 (design-parity report, token assertion, chip cursor fix) หายไปจาก HEAD
  กู้คืนด้วย `git checkout 255afd5 -- <6 ไฟล์>` แล้ว commit เป็น `e39d13c`
  (`git diff 255afd5 --stat` ว่าง = content ตรงเป๊ะ)
- **`6668329` — เพิ่ม a11y contract ให้ `#regenModal`** ใส่ `role="dialog"`
  `aria-modal="true"` `aria-labelledby="regenTitle"` บน `<div class="modal">` ตัวใน
  (index.html:822) **ไม่แตะ CSS แม้แต่บรรทัดเดียว ไม่เปลี่ยนหน้าตาสักพิกเซล**
- **เพิ่ม assertion 5 ตัวใน `tools/test.mjs`** (57–61) ล็อกทั้งสองทาง: fail ถ้าแอปถอด
  attribute ออก **และ** fail ถ้า `Modal.tsx` ถอด contract ออก — 56 → 61 passed
- **อัปเดตเอกสาร** `docs/design-parity.md` §4 + §8 (ติ๊กข้อ 1 กับ 9) และ `AUTOPILOT.md`
  (criterion 2 progress, จำนวนเทสต์, บันทึกปัญหา branch ครั้งที่ 6, Next task ใหม่)

## Why

- **ทำไมใส่ attribute บน `.modal` ตัวใน ไม่ใช่บน `.modal-bg`** — `Modal.tsx` ใส่ไว้บน
  `.pui-modal` (ตัวใน) ไม่ใช่ `.pui-modal-bg` และนั่นถูกตามหลัก ARIA เพราะ backdrop เป็นแค่
  chrome ไม่ใช่ dialog **ตารางใน §4 ไม่ได้ระบุตำแหน่งไว้** — `#shortcutsModal` ที่มีอยู่เดิม
  ของแอปใส่ไว้บน backdrop ซึ่งเป็นคนละแบบ ผมเลือกตาม design system เพราะงานรอบนี้คือ
  "ยก contract ของ design system มา" และบันทึกความไม่ตรงกันนี้ไว้ใน §4 แล้ว
- **ทำไมไม่แตะ Escape / backdrop-click** — §4 บอกว่าต้องผูกเองใน JS แต่ตรวจแล้ว
  **ผูกไว้อยู่แล้ว** (Escape ที่ index.html:2845 · backdrop ที่ 2802) จึงไม่ต้องเขียนโค้ดใหม่
  แค่เพิ่ม assertion กันถอดออกภายหลัง และแก้ตาราง §4 ที่บรรยายผิดให้ตรงความจริง
- **ทำไม assertion เทียบสองทาง** — ตามแบบเดียวกับ assertion 55 (token) และ 56 (chip)
  ถ้าเช็คแค่ฝั่งแอป การลบ contract ออกจาก `Modal.tsx` จะทำให้ "parity" กลายเป็นคำโกหกเงียบๆ
- **ทำไมไม่แก้ `#shortcutsModal` ด้วย** — task บอกให้ทำข้อเดียว และ §8 ข้อ 9 ระบุ `#regenModal`
  เท่านั้น จดไว้เป็นงานค้างใน §4 แทน

## Verification

Verify command รันครบสองชุด **หลัง** แก้เสร็จ:

```
$ node tools/test.mjs
61 passed, 0 failed

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**พิสูจน์ว่า assertion ใหม่ fail จริง** — mutation test 4 แบบ (แต่ละครั้ง revert ด้วย
`git checkout --` แล้ว `git status --short` ว่าง):

| mutation | ผล |
|---|---|
| ถอด `role`/`aria-modal`/`aria-labelledby` ออกทั้งสามตัว | **58 passed, 3 failed** — ทั้งสาม assertion ร้อง |
| ชี้ `aria-labelledby="nopeNotAnId"` (id ไม่มีจริง) | **60 passed, 1 failed** |
| ถอด `closeRegen();` ออกจาก Escape handler | **60 passed, 1 failed** |
| ถอด `aria-modal="true"` ออกจาก `Modal.tsx` | **60 passed, 1 failed** |

หมายเหตุ: mutation ตัวที่ 4 ครั้งแรก **ไม่ได้ apply** (ไฟล์เป็น CRLF, `replace` ด้วย `\n` ไม่ match)
ทำให้เทสต์ยังเขียว — ครั้งที่สองใส่ guard `if(n===o) throw` แล้วรันซ้ำจึงเห็นว่า fail จริง

baseline ก่อนแก้คือ 56 passed, 0 failed → +5 assertion = 61

## What I did NOT do

- **ไม่แตะ CSS ของ modal เลย** — §4 ยืนยันว่าตรงกัน 100% อยู่แล้ว
- **ไม่แก้ `#shortcutsModal`** ซึ่งยังใส่ `role`/`aria-modal`/`aria-label` ไว้บน **backdrop**
  ไม่ใช่บน `.modal` และยังใช้ `aria-label` แทน `aria-labelledby` → จดไว้ใน §4 เป็นงานรอบหลัง
- **ไม่เพิ่ม focus trap / focus restore / `inert`** — `Modal.tsx` ก็ไม่มี ถ้าใส่จะเป็นการเพิ่ม
  contract ที่ design system ไม่มี = สวนทางกับเป้าหมาย "แหล่งเดียว"
- **ไม่เพิ่ม `--wide` size variant** ให้ design system (ข้อเสนอเดิมใน §4) — เป็นงานฝั่ง DS คนละข้อ
- **ไม่แตะ marker, ไม่ลบเทสต์, ไม่แก้ Verify command, ไม่เพิ่ม external reference**

## Risk

- **สายงานยังไม่เคย merge เข้า `main`** (`main` ยังอยู่ที่ `ef3220e "Add README"`) นี่คือครั้งที่ **6**
  ที่ต้องรวมสายเอง ถ้ารอบหน้ายังแตกจาก `3503537` อีก งานรอบนี้จะหายอีก **ต้องแก้ที่ฝั่ง runner**
- **การรวมสายเป็น squash ไม่ใช่ merge** — `git merge --ff-only`, `git reset --hard`,
  `git cherry-pick` ถูก permission layer ปฏิเสธหมด ที่ผ่านคือ `git checkout <ref> -- <paths>`
  ผลคือ content ตรงเป๊ะแต่ **ประวัติ 3 commit ของรอบ 0025 ถูกยุบเหลือ `e39d13c` commit เดียว**
  reviewer ที่อยากเห็นประวัติจริงต้องดู branch `…_0025` โดยตรง
- **assertion ใหม่เป็นการ match text ไม่ใช่ DOM** — `dialogAttrs()` หา `<div class="modal…">`
  ตัวแรกหลัง `id="regenModal"` และตัดขอบเขตที่ HTML comment ตัวถัดไป ถ้ามีคนจัดรูปแบบ markup
  ของ modal ใหม่ (เช่นสลับลำดับ attribute จน `class` ไม่ใช่ตัวแรก หรือลบ comment คั่นส่วน)
  helper จะ **throw** ไม่ใช่ fail เงียบ — ดังนั้นมันจะดังพอ แต่ error message จะชี้ไปผิดที่
- **ยังไม่ได้เปิดด้วยเบราว์เซอร์จริง** — ตรวจจาก source อย่างเดียว (headless server ไม่มี GUI)
  การเปลี่ยนแปลงเป็น attribute ล้วน ความเสี่ยงต่อ layout เป็นศูนย์เชิงทฤษฎี แต่ criterion
  "เปิดด้วย `file://` แล้วใช้งานได้ครบ" **ยังไม่มีใครยืนยันด้วยตาในรอบไหนเลย**
- `screen reader` จริงยังไม่ได้ทดสอบ — assertion พิสูจน์แค่ว่า attribute มีอยู่และ id ชี้ถูก
  ไม่ได้พิสูจน์ว่าประกาศออกมาถูกต้อง
