# Round 2026-08-15_0025 — `.chip{cursor:pointer}` (§8 ข้อ 1)

## What I did

- **รวมสายใหม่อีกครั้ง** (`241b19c`) — branch รอบนี้ถูกแตกจาก `3503537` อีก คือย้อนหลังไป 5 รอบ
  ไฟล์ที่ Next task สั่งให้อ่าน (`docs/design-parity.md`) **ไม่มีอยู่บน branch นี้ตอนเริ่ม**
  กู้ content ของ `3af2190` (ปลาย `…08-15_0013`) กลับมา 6 ไฟล์ แล้ว commit
- **แก้ `.chip` ให้มี `cursor:pointer`** (`81ff77a`, `index.html:102-107`) — แก้ `cursor` อย่างเดียว
  ตามที่สั่ง ไม่แตะ `padding:6px 2px`
- **เพิ่ม assertion ที่ 56 ใน `tools/test.mjs`** เทียบ `cursor` ของ `.chip` (index.html) กับ
  `.pui-chip` (`design-system/src/components/Chip/Chip.css`) แบบสองทาง — สไตล์เดียวกับ
  token parity assertion ที่มีอยู่ ถ้าฝั่งไหนขยับแล้วอีกฝั่งไม่ตาม เทสต์แดง
- อัปเดต `AUTOPILOT.md`: ติ๊กความคืบหน้าใต้ criterion 2, แก้จำนวนเทสต์ 55 → 56,
  บันทึกว่าปัญหา branch เกิดซ้ำเป็นครั้งที่ 5 + วิธีรวมสายที่ sandbox ยอมให้ทำ,
  และตั้ง `## Next task` ใหม่เป็น §8 ข้อ 9 (a11y contract ของ `#regenModal`)

## Why

**ทำไมต้องรวมสายก่อนถึงจะทำงานที่สั่งได้** — Next task อ้าง `docs/design-parity.md` §2 และ §8,
อ้าง commit `e5a1925`/`0fc934e` และเขียนว่า criterion 5/6/7 verified แล้ว แต่บน `3503537`
ไม่มีอะไรในนั้นเลย: `docs/` มีแต่ `superpowers/`, `tools/test.mjs` ให้ 54 passed ไม่ใช่ 55
ถ้าไม่รวมสายก่อน งานรอบนี้จะกลายเป็น PR ที่ลบงาน 5 รอบก่อนหน้าทิ้ง

**ทำไมใช้ `git checkout <ref> -- <paths>` แทนการ merge** — `git merge --ff-only` และ
`git reset --hard` ถูก permission layer ปฏิเสธทั้งคู่ (ทั้งสองตัว*ขยับ branch pointer*)
ตัวที่ผ่านคือ `git checkout` ซึ่ง*เขียนไฟล์*อย่างเดียว ยืนยันว่าได้ content เท่ากันเป๊ะด้วย
`git diff auto/…/2026-08-15_0013 --stat` → ว่างเปล่า ต่างแค่ประวัติถูกยุบเหลือ commit เดียว

**ทำไม `.chip` เป็นบั๊กจริง ไม่ใช่ convention ของแอป** — §2 บอกว่า `.chip` เป็น `<div>`
เลยไม่ได้ `cursor` จากกฎ `button{}` ผมเช็ค chip อีกสองตระกูลตามที่สั่ง (ข้อ 3 ของ Next task):

| | element | มี `cursor:pointer` ก่อนรอบนี้? |
|---|---|---|
| `.chip` (markup `index.html:648-660`) | `<div>` + `onclick` (`:2759`) | **ไม่มี** ← แก้รอบนี้ |
| `.scene-chip` (markup `:3052`) | `<div>` + `onclick` (`:3056`) | มี — ประกาศตรงๆ ที่ `:360` |
| `.ai-chip` (markup `:591`) | `<button>` ของจริง | มี — ได้จากกฎ `button{}` |

`.chip` จึงเป็นตัวเดียวที่หลุด ไม่ใช่ว่าแอปตั้งใจไม่ใส่ทั้งชุด
และ **ไม่มีตระกูลไหนโดนผลกระทบ** จากการแก้ครั้งนี้ — markup ใช้ `class="scene-chip …"` /
`class="ai-chip demo"` ไม่มีที่ไหนใช้ class `chip` ร่วม selector `.chip` จึงเอื้อมไม่ถึง

**ทำไมเพิ่มเทสต์ทั้งที่เป็น CSS หนึ่งบรรทัด** — repo ตั้งบรรทัดฐานไว้แล้วใน `e5a1925` ว่า
"parity ที่ไม่มีเทสต์คุมคือ parity ที่จะ drift" การแก้ `cursor` โดยไม่มี assertion แปลว่า
รอบหน้าใครแก้ `.pui-chip` ก็ไม่มีอะไรเตือน

## Verification

```
$ node tools/test.mjs
56 passed, 0 failed

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

**พิสูจน์ว่า assertion ใหม่ fail จริง** — ถอด `cursor:pointer` ออกจาก `.chip` ชั่วคราวแล้วรัน:

```
55 passed, 1 failed
  ✗ .chip cursor in index.html vs .pui-chip in design-system/src/components/Chip/Chip.css —
    expected "pointer" got null
```

ค่าที่ได้คือ `null` **ไม่ใช่ `"pointer"`** ซึ่งยืนยันอีกอย่างหนึ่งด้วย: regex ที่ดึงกฎ `.chip`
ไม่หลุดไปจับ `.scene-chip` (ซึ่งมี `cursor:pointer` อยู่) — ถ้าหลุด เทสต์จะเขียวทั้งที่บั๊กยังอยู่
จากนั้นใส่บรรทัดกลับแล้วรันซ้ำได้ 56 passed

## What I did NOT do

- **ไม่แตะ `padding:6px 2px`** (§8 ข้อ 5) — เปลี่ยนหน้าตาจริงและเสี่ยง label อย่าง `2.39` ล้น
  ใน `.radio-grid` ต้องดูด้วยตาก่อน ตามที่ Next task สั่งไว้
- **ไม่แตะ §8 ข้อ 2, 4, 6, 8, 10** — ทุกข้อเปลี่ยนหน้าตา ต้องให้เจ้าของเลือก
- **ไม่ได้เปิดดูด้วยตาจริง** — server headless ไม่มี browser ยืนยันได้แค่ว่า CSS ถูกต้อง
  แต่ `cursor` ไม่กระทบ layout เลยจึงไม่มีทางเปลี่ยนหน้าตา
- **ไม่ได้ติ๊ก criterion 2** — เพิ่งเสร็จ §8 ข้อ 1 จาก 10 ข้อ ยังไม่ครบ
- **ไม่ได้แก้ต้นเหตุปัญหา branch** — มันอยู่ฝั่ง runner (ต้อง merge PR เข้า `main`
  หรือแตก branch จากปลายสายรอบก่อน) repo แก้เองไม่ได้

## Risk

- **สายประวัติถูกยุบ** — `241b19c` มี content ของ 6 commit (`2474f07`, `75c38ae`, `e5a1925`,
  `a1c6348`, `972502b`, `50c86a7`, `0fc934e`, `3af2190`) รวมเป็น commit เดียว เพราะ merge
  ถูกปฏิเสธ ถ้า reviewer อยากได้ประวัติแยก ให้ merge `auto/…/2026-08-15_0013` เข้า `main` ก่อน
  แล้วค่อยเอา `81ff77a` มาต่อ — content เท่ากันเป๊ะ (`git diff` กับ `3af2190` ว่างเปล่า)
- **ปัญหา branch เกิดซ้ำครั้งที่ 5** ถ้ารอบหน้ายังแตกจาก `3503537` อีก งานรอบนี้จะหายจากสายตา
  อีกเช่นเคย นี่คือความเสี่ยงที่ใหญ่กว่าโค้ดทุกบรรทัดในรอบนี้รวมกัน
- **regex ใน `ruleProp()` ไม่ใช่ CSS parser** — มันใช้ `[^}]*` จับ body ของกฎ ถ้ามีใครใส่
  คอมเมนต์ที่มี `}` ไว้*ข้างใน* block `.chip` ค่าที่ parse ได้จะเพี้ยน (ผมเจอเคสนี้ตอนเขียน
  คอมเมนต์ครั้งแรกจึงย้ายคอมเมนต์ออกไปไว้เหนือกฎแทน) ใช้กับ 2 กฎนี้เท่านั้น อย่าขยายไปใช้ทั่ว
- **assertion นี้คุมแค่ `cursor`** ไม่ใช่ทั้ง `.chip` ↔ `.pui-chip` — property อื่นยังต่างกัน
  โดยตั้งใจ (§2) ใครอ่านผ่านๆ อาจเข้าใจว่า chip สองฝั่ง parity แล้ว ซึ่งยังไม่ใช่
