# SUMMARY — round `2026-09-15_0004`

**ผลรอบนี้: no-op ตามที่ `## Next task` สั่งไว้ — ยังไม่มีคำตอบจากเจ้าของสักข้อ ทั้ง 8 ข้อ**
ไม่มีการแตะ `index.html`, `design-system/**`, `tools/**`, `docs/**` แม้แต่บรรทัดเดียว

## What I did

- **restore tip ของรอบก่อน (`120af65`, branch `…/2026-09-14_0032`) ลงบน stale base `3503537`**
  — HEAD ตอนเปิดรอบคือ `3503537` ตามบั๊ก runner เดิม (`git ls-files | wc -l` = **73**
  = ไม่มี `tools/check-tokens.mjs` / `docs/btn-parity-proof.mjs` = ตัวบ่งชี้ว่า tree เก่า)
  แยกเป็น commit ของตัวเอง (`a48aa85`) เพื่อให้ diff จริงของรอบนี้อ่านได้
- **ตรวจครบ 5 ช่องทาง — ไม่มีคำตอบจากเจ้าของเลย** (รายละเอียดใน Verification)
- **รัน Verify ครบ 3 ขั้น + harness ครบ 5 key** — ตรงตารางทุกค่า
- **รัน A/B ของสูตรจัดอันดับ tip แบบ live** → เฉลยคำทำนายของรอบ `_0032` ว่า **"ก้อย"**
  และรอบนี้ **สองสูตรไม่ตรงกันที่แถว 1 จริง** (สูตรผิดได้ `a332ab6` = `_0022` ซึ่งเก่ากว่า 1 รอบ)
  แล้วเขียนคำทำนายรอบถัดไปลง `AUTOPILOT.md`
- **แก้ `AUTOPILOT.md` เฉพาะบล็อก `## Next task`** — ชี้ tip ที่รอบหน้าต้อง restore ไปที่
  `2026-09-15_0004` + **เพิ่ม** (prepend) บล็อกเฉลยของ `_0032` และคำทำนายรอบถัดไป
  (ตามธรรมเนียมของรอบ `_0035`/`_0041`: รอบ no-op **ไม่**ต่อบล็อก `> **สถานะล่าสุด …` ท้ายไฟล์อีก
  — แต่บล็อกเฉลย/คำทำนายยัง prepend ตามเดิม **ไม่ลบของเก่า**)

## Why

- **ทำไมไม่ทำงานอื่น:** เกณฑ์ที่เหลือทุกข้อ**บล็อกอยู่ที่เจ้าของ** — delta ที่เหลือ 3 จุด
  (chip padding / segmented padding / input size) คือ decision 2 / 5 / 6, `:disabled:hover`
  ที่รั่วคือ decision 7, browser verify คือ decision 4, jsPDF ต้องให้เจ้าของ vendor เข้า repo ก่อน
  งาน tooling ฝั่ง token จบแล้ว (22/22 token, เช็ค 6 ตัว) และ parity table ปิดที่ 11/11 component
  → **ไม่มีงาน fallback เหลือแล้วจริง** การประดิษฐ์งานแทนคือการขยับพิกเซลโดยไม่มีใครอนุญาต
- **ทำไม `ds-disabled-hover` ใช้ `120af65` เป็นฝั่ง before:** ต้องเป็น tip ที่รอบนี้ restore เอง
  ไม่ใช่ sha ที่ลอกจากบล็อกเก่า (คำสั่งใน `AUTOPILOT.md` เขียนไว้ว่า `<tip รอบก่อน>`)
- **ทำไมเลือก tip ด้วย `--sort=-committerdate` แล้วตรวจซ้ำด้วย refname แบบ date-major:**
  รอบนี้ข้ามวัน และ **หมายเลขรอบเดินถอยหลัง** (`_0032` ของเมื่อวาน → `_0004` ของวันนี้)
  → การตรวจซ้ำด้วย refname ต้องอ่านว่า "หมายเลขรอบสูงสุด**ในวันที่ใหม่ที่สุดที่มีอยู่**"
  ไม่ใช่ "หมายเลขรอบสูงสุดโดยรวม" ไม่งั้นจะเลือกผิดทันที (วันที่ใหม่สุดที่มี tip คือ `2026-09-14`
  และหมายเลขสูงสุดของวันนั้นคือ `_0032` → ตรงกับที่ `--sort=-committerdate` ให้)

## Verification

**restore ถูกต้องครบถ้วน (2 หลักฐานอิสระ):**
1. `git rev-parse HEAD^{tree}` = `git rev-parse 120af65^{tree}` =
   `91445a76bcf6331d38b78f47ef41053495a2a7f3` → **tree เท่ากันทุก byte ทุก path**
   (หลักฐานนี้แรงกว่า `git diff --stat` เพราะครอบทุก path พร้อมกัน ไม่ใช่เฉพาะแถวที่พิมพ์ออกมา
   และปิดประเด็น "path-checkout ลบไฟล์ที่ tip ลบไปแล้วไม่ได้" ไปในตัว)
2. harness ทั้ง 5 key ให้ตัวเลขเท่าตารางเป๊ะ — harness คำนวณ cascade จากไฟล์ที่ยืนอยู่จริง
   ดังนั้น restore ผิด/ไม่ครบจะโผล่เป็นตัวเลขเพี้ยนทันที

`git status --short` หลัง `git checkout 120af65 -- .` ขึ้น 16 path (M 13 / A 3: `SUMMARY.md`,
`docs/btn-parity-proof.mjs`, `tools/check-tokens.mjs`) → ตรงกับที่ stale base ขาดไป

**Verify command เขียวครบ 3 ขั้น** (รันเองตามสัญญา ไม่ได้แก้คำสั่ง ไม่ได้ปิดเทสต์):
- `node tools/test.mjs` → `54 passed, 0 failed`
- `node tools/check-tokens.mjs` → เขียวครบ 6 เช็ค: tokens 22/22, fonts 4/4,
  no derived-colour literals / font weights (400,500,700,800) / no radius literals /
  typeface from one source — ที่ **15 CSS sources**
- `npm --prefix design-system test` → `12 passed (12)` / `31 passed (31)`

**harness ครบ 5 key — ตรงตารางทุกค่า:**

| key | before → after | ผล |
|---|---|---|
| `buttons` | `2488f2d:index.html` → `index.html` | 85 pairs / 17 elements, markup 7 gone / 5 new → **PASS** |
| `segmented` | `021b966:index.html` → `index.html` | 45 / 9, markup 0 / 3 → **PASS** |
| `toast` | `de07ea8:index.html` → `10e8f39:index.html` | 5 / 1, markup 0 / 1 → **PASS**, ไม่มี undecidable |
| `ds-disabled-hover` | `120af65:…/styles.css` → `…/styles.css` | 15 / 3 → **PASS** + 1 undecidable, markup `N/A — the source is a stylesheet` |
| `toast-hit` | `3d3d5cc:index.html` → `index.html` | 10 / 2, 0 markup problem, 0 unmatched → **FAIL — 5 declaration(s) differ** |

- `toast-hit` ขึ้น FAIL **เป็นผลที่ถูกต้อง** — รอบ `2026-08-24_0003` ตั้งใจเปลี่ยนพฤติกรรม
  (เติม `pointer-events:auto` ให้ `.toast-act`) key นี้มีไว้ให้*เห็นว่าเปลี่ยนอะไร* ไม่ได้มีไว้ให้ PASS
  รอบนี้รันแบบ bare command แล้วอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน
  (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) **ไม่มี `#toast` สักแถว**
  = ยืนยันว่าไม่มีใครถอด `pointer-events:none` ออกจาก `#toast`
  (ไม่ได้ใช้ `grep -c "✗ #toast:"` — pattern นั้นมีจุดบอดที่แถว `✗ #toast (base)` ซึ่งไม่มี `:`)
- undecidable ของ `ds-disabled-hover` คือ `.pui-menu__item:last-child`
  (`unreadable because: structural pseudo :last-child`, subject matches `.pui-menu__item` +
  `.pui-menu__item--danger`) — เท่าเดิมทุกรอบ

**ตรวจครบ 5 ช่องทาง — ไม่มีคำตอบจากเจ้าของเลยสักข้อ:**
1. **tree ของ tip รอบก่อน** — tree ของ `120af65` เท่ากับ tree ของรอบนี้ทุก byte และ
   `git log -1 120af65` author = `PHANTOM AUTOPILOT <autopilot@phantom.local>`
   subject = `chore: round 2026-09-14_0032 no-op -- five channels checked, no owner answer`
   = commit ของ runner ไม่ใช่ของเจ้าของ
2. **ตัวนับใน README (รันหลัง restore)** — `grep -c "| Option | Cost |" README.md` = **8** และ
   `grep -c "If you answer:" README.md` = **8** → **ตรงกัน** = ยังไม่มีใครตอบข้อไหน
3. **jsPDF vendored หรือยัง** — `git ls-files | grep -i jspdf` **ว่างเปล่า** → ยังไม่มี
4. **ไฟล์ที่เจ้าของหย่อนไว้** — `git status --untracked-files=all --short` **ว่างเปล่า**
5. **branch/remote อื่น** — `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
   `mac`/`mac/design-system` = `e3a355c` (2026-07-20), `mac/hardening-pass`/`origin/hardening-pass`
   = `592e7c3` (2026-07-20), `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27)
   — **ไม่ขยับเลยสักอัน**

**A/B ของสูตรจัดอันดับ tip (รันจริงรอบนี้ ตัด branch ตัวเองออก เพราะรันหลัง restore commit):**

```
สูตรผิด (%(committerdate:short) + | sort -r)     สูตรถูก (--sort=-committerdate)
2026-09-14 a332ab6 _0022  ← tip ที่ผิด           2026-09-14 120af65 _0032  ← ถูก
2026-09-14 989c1e8 _0002                         2026-09-14 a332ab6 _0022
2026-09-14 80a22d3 _0012                         2026-09-14 80a22d3 _0012
2026-09-14 120af65 _0032  ← tip จริง ตกไปแถว 4/4 2026-09-14 989c1e8 _0002
2026-09-13 e693761 _0006                         2026-09-13 a70036f _0037
2026-09-13 a70036f _0037                         2026-09-13 459dd24 _0027
```

- **สองสูตรไม่ตรงกันที่แถว 1** → ไฟจริง ไม่ใช่การเตือน ความเสียหายจริงรอบนี้ = **0 เพราะใช้สูตรถูก**
- ถ้าเผลอใช้สูตรผิด: restore `a332ab6` แล้วงานของ `_0032` ถูกทิ้งเงียบๆ (1 รอบ — `AUTOPILOT.md`
  + `SUMMARY.md` **ไม่ใช่โค้ด** เพราะ `_0032` เป็น no-op) และ **ไม่มีอะไรจับได้**: tree ของ `_0032`
  เท่ากับของ `_0022` ในส่วนโค้ด → residual diff ว่าง, harness 5 key ตรงหมด, Verify เขียวครบ 3 ขั้น
- `120af65` ตกไป **แถว 4 จาก 4** ในกลุ่มวันเดียวกัน = ตำแหน่งแย่ที่สุดที่เป็นไปได้ของกลุ่ม
- กลุ่ม `2026-09-13` ของสูตรผิดยังเรียง sha-descending ล้วน (`e693761` ขึ้นหัวกลุ่ม, tip จริง
  `a70036f` ตกแถว 2) = บั๊กยังอยู่ครบ ไม่ได้หายไปไหน
- สถิติสะสมของสูตรผิด: **ก้อย 17 จาก 29**

**ขนาด `AUTOPILOT.md` ก่อนแก้รอบนี้: 3,303 บรรทัด / 455,246 bytes** (`wc -l` / `wc -c`)
— นี่คือเหตุผลที่ `## Next task` ใน prompt มาถึงแบบว่างเปล่า

## What I did NOT do

- **ไม่ตอบ decision ข้อไหนเอง** ทั้ง 8 ข้อ — ทุกข้อขยับพิกเซลที่คนเห็น เป็นสิทธิ์เจ้าของ
- **ไม่ประดิษฐ์งานแทน** — `## Next task` สั่งห้ามไว้ตรงๆ และงาน fallback หมดจริง
  (token tooling จบที่ 22/22 + 6 เช็ค, parity table ปิดที่ 11/11)
- **ไม่ตัด `AUTOPILOT.md` ให้สั้นลง** ทั้งที่มันคือสาเหตุที่ `## Next task` มาถึงแบบว่างเปล่า
  — การตัดประวัติเป็นสิทธิ์เจ้าของ ไม่ใช่ของ agent
- **ไม่เปิดเบราว์เซอร์** — decision 4 ยังไม่ได้รับอนุญาต และรอบก่อนๆ ยืนยันว่า
  Playwright/Chrome-DevTools MCP **ถูก permission บล็อกทั้งคู่** (ไม่ใช่แค่ "ไม่มีจอ")
- **ไม่ inline jsPDF** — ไม่มีสำเนาบนเครื่องและ network ถูกบล็อก (ช่องทางที่ 3 ยืนยันอีกรอบ)
- **ไม่ push / ไม่เปิด PR** — runner เป็นคนทำ

## Risk

- 🔴 **บั๊ก runner ยังไม่ถูกแก้ และตอนนี้ข้ามเดือนมาแล้ว — `main` ยังเป็น `ef3220e` (2026-06-27)**
  ทุกรอบต้องเสียเวลาไป restore tip เองก่อน ไม่มีรอบไหนแก้ได้ ต้องมีคนตอบ
- 🔴 **รอบนี้สูตรผิดจะเลือก tip ผิดจริง (วัดแล้ว ไม่ใช่การอนุมาน)** — ดูตาราง A/B ข้างบน
  ผู้ตรวจควรอ่านว่า "รอบก่อนๆ ที่สองสูตรตรงกัน" ไม่เคยเป็นหลักฐานว่าบั๊กหาย
- 🔴 **กับดักใหม่ที่ *live* รอบนี้เพราะข้ามวัน: หมายเลขรอบเดินถอยหลัง** (`_0032` → `_0004`)
  → selector ที่จัดอันดับด้วย refname อย่างเดียว (ไม่ date-major) จะเลือก `_0032` ของเมื่อวาน
  **ตลอดไป** นี่เป็นกลไกที่ 3 ที่ทำให้ restore ผิดแบบเงียบๆ — `--sort=-committerdate` กันได้ทั้งสามแบบ
- ⚠️ **`toast-hit` ขึ้น FAIL โดยตั้งใจ** — ถ้า runner ตีความ "harness FAIL = รอบเสีย" จะกัก PR ผิด
  หลักฐานว่ามันถูกต้องคือแถว `✗` ทั้ง 5 เป็น `#toastUndo` ล้วน และ `#toast` ไม่มี diff สักจุด
  (harness ไม่ได้อยู่ใน Verify command อยู่แล้ว — Verify เขียวครบ 3 ขั้น)
- ⚠️ **harness ไม่ได้ model CSS inheritance และไม่มี checker ตัวไหนดู `:hover`**
  → ถ้ารอบไหนแอบแก้ `:hover`/`pointer-events` Verify จะยังเขียวครบ นี่เป็นช่องว่างที่ค้างอยู่
  (เขียนไว้ใน `AUTOPILOT.md` แล้ว ไม่ใช่ของใหม่จากรอบนี้)
- ⚠️ **ยังไม่เคย verify `index.html` ด้วยเบราว์เซอร์จริงสักรอบ** — บั๊ก `pointer-events` ที่แก้ไป
  รอบ `2026-08-24_0003` พิสูจน์จาก source + CSS spec เท่านั้น ยังไม่มีใครกดปุ่ม Undo จริง
- ✅ ความเสี่ยงจาก **เนื้อโค้ด** รอบนี้ = **0** — tree หลัง restore เท่ากับ `120af65` ทุก byte
  ก่อนแก้เอกสาร รอบนี้แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`
