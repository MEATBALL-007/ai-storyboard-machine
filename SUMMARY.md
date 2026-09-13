# SUMMARY — round `2026-09-14_0022`

**ผลรอบนี้: no-op ตามที่ `## Next task` สั่งไว้ — ยังไม่มีคำตอบจากเจ้าของสักข้อ ทั้ง 8 ข้อ**
ไม่มีการแตะ `index.html`, `design-system/**`, `tools/**`, `docs/**` แม้แต่บรรทัดเดียว

## What I did

- **restore tip ของรอบก่อน (`80a22d3`, branch `…/2026-09-14_0012`) ลงบน stale base `3503537`**
  — HEAD ตอนเปิดรอบคือ `3503537` ตามบั๊ก runner เดิม (`ls tools` เห็นแต่ `test.mjs`
  ไม่มี `tools/check-tokens.mjs` = ตัวบ่งชี้ว่า tree เก่า) แยกเป็น commit ของตัวเอง (`99b1f85`)
  เพื่อให้ diff จริงของรอบนี้อ่านได้
- **ตรวจครบ 5 ช่องทาง — ไม่มีคำตอบจากเจ้าของเลย** (รายละเอียดใน Verification)
- **รัน Verify ครบ 3 ขั้น + harness ครบ 5 key** — ตรงตารางทุกค่า
- **รัน A/B ของสูตรจัดอันดับ tip แบบ live** → เฉลยคำทำนายของรอบ `_0012` ว่า **"ก้อย"**
  (สองสูตรไม่ตรงกันที่แถว 1 จริง) แล้วเขียนคำทำนายรอบถัดไปลง `AUTOPILOT.md`
- **แก้ `AUTOPILOT.md` เฉพาะบล็อก `## Next task`** — ชี้ tip ที่รอบหน้าต้อง restore ไปที่
  `2026-09-14_0022` + เพิ่มบล็อกเฉลย/คำทำนาย (ตามธรรมเนียมของรอบ `_0035`/`_0041`:
  รอบ no-op **ไม่**ต่อบล็อก `> **สถานะล่าสุด …` ท้ายไฟล์อีก เพื่อหยุดการโตของไฟล์)

## Why

- **ทำไมไม่ทำงานอื่น:** เกณฑ์ที่เหลือทุกข้อ**บล็อกอยู่ที่เจ้าของ** — delta ที่เหลือ 3 จุด
  (chip padding / segmented padding / input size) คือ decision 2 / 5 / 6, `:disabled:hover`
  ที่รั่วคือ decision 7, browser verify คือ decision 4, jsPDF ต้องให้เจ้าของ vendor เข้า repo ก่อน
  งาน tooling ฝั่ง token จบแล้ว (22/22 token, เช็ค 6 ตัว) และ parity table ปิดที่ 11/11 component
  → **ไม่มีงาน fallback เหลือแล้วจริง** การประดิษฐ์งานแทนคือการขยับพิกเซลโดยไม่มีใครอนุญาต
- **ทำไม `ds-disabled-hover` ใช้ `80a22d3` เป็นฝั่ง before:** ต้องเป็น tip ที่รอบนี้ restore เอง
  ไม่ใช่ sha ที่ลอกจากบล็อกเก่า (คำสั่งใน `AUTOPILOT.md` เขียนไว้ว่า `<tip รอบก่อน>`)
- **ทำไมพิสูจน์ restore ด้วย tree-sha ไม่ใช่ `git diff`:** `git diff` ถูก permission บล็อกในสภาพแวดล้อมนี้
  และ tree-sha identity แข็งกว่า — มันพิสูจน์**ทุก path พร้อมกัน** ส่วน diff ว่างพิสูจน์แค่แถวที่พิมพ์ออกมา

## Verification

**restore ถูกต้องครบถ้วน (2 หลักฐานอิสระ):**
1. `git rev-parse HEAD^{tree}` = `git rev-parse 80a22d3^{tree}` =
   `198c1d0b18b7a29702395ea83f5cfcbc70d1f73c` → **tree เท่ากันทุก byte ทุก path**
2. harness ทั้ง 5 key ให้ตัวเลขเท่าตารางเป๊ะ — harness คำนวณ cascade จากไฟล์ที่ยืนอยู่จริง
   ดังนั้น restore ผิด/ไม่ครบจะโผล่เป็นตัวเลขเพี้ยนทันที

**precondition ก่อนแตะ tree:** `git merge-base --is-ancestor 3503537 80a22d3` → `ancestor-ok`,
author ของ `80a22d3` = `PHANTOM AUTOPILOT <autopilot@phantom.local>` (subject
`chore: round 2026-09-14_0012 no-op -- five channels checked, no owner answer`)
→ commit ของ runner **ไม่ใช่ของเจ้าของ**

**Verify 3 ขั้น — เขียวครบ:**
```
node tools/test.mjs            → 54 passed, 0 failed
node tools/check-tokens.mjs    → 6/6 เช็คผ่าน (tokens 22/22, fonts 4/4,
                                  no derived-colour literals / font weights /
                                  no radius literals / typeface — 15 CSS sources)
npm --prefix design-system test → 12 files, 31 passed
```

**harness 5 key — ตรงตารางทุกค่า:**
```
buttons           2488f2d:index.html index.html                → 85 pairs / 17 elements, markup 7 gone / 5 new, PASS
segmented         021b966:index.html index.html                → 45 / 9,  markup 0 / 3, PASS
toast             de07ea8:index.html 10e8f39:index.html        → 5 / 1,   markup 0 / 1, PASS, ไม่มี undecidable
toast-hit         3d3d5cc:index.html index.html                → FAIL — 5 declaration(s) differ,
                                                                 10 pairs / 2 elements, 0 markup problem, 0 unmatched
ds-disabled-hover 80a22d3:design-system/src/styles.css …        → 15 / 3, PASS + 1 undecidable rule
```
`toast-hit` เป็น **FAIL โดยออกแบบ** (รอบ `2026-08-24_0003` ตั้งใจเปลี่ยนพฤติกรรม) —
อ่านแถว `✗` ครบทั้ง 5 แถวตามที่รอบ `_0043` สั่ง: **ทั้งห้าเป็น `#toastUndo` ล้วน**
(`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`) **ไม่มี `#toast` สักแถว**
= ฝั่งแอปไม่ถูกแตะ (ไม่ได้ใช้ `grep -c "✗ #toast:"` ซึ่งมีจุดบอด)

**5 ช่องทางตรวจคำตอบเจ้าของ — ไม่มีคำตอบสักข้อ:**
1. tree เท่ากับ tip ทุก byte → `README.md` ไม่ถูกแก้บน branch เก่า (ปิดช่องทางนี้ไปในตัว)
2. `grep -c "| Option | Cost |" README.md` = **8** และ `grep -c "If you answer:" README.md` = **8**
   → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
3. `git ls-files | grep -ci jspdf` = **0** → เจ้าของยังไม่ vendor jsPDF เข้า repo
4. `git status --untracked-files=all --short` → **ว่าง** (ไม่มีไฟล์คำตอบวางทิ้งไว้)
5. ref ที่ไม่ใช่ `auto/*` **ไม่ขยับเลย**: `design-system`/`origin/design-system` = `3503537`
   (2026-08-13, ใหม่สุดในกลุ่ม), `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
   `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
   `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27)

**A/B สูตรจัดอันดับ tip (รันจริง ตัด branch ตัวเองออก):**
```
สูตรผิด (:short + | sort -r)          สูตรถูก (--sort=-committerdate)
2026-09-14 989c1e8 _0002  ← ผิด       2026-09-14 00:19:35 80a22d3 _0012  ← ถูก
2026-09-14 80a22d3 _0012              2026-09-14 00:09:24 989c1e8 _0002
2026-09-13 e693761 _0006              2026-09-13 00:43:34 a70036f _0037
2026-09-13 a70036f _0037              2026-09-13 00:34:09 459dd24 _0027
```
→ **สองสูตรไม่ตรงกันที่แถว 1** เฉลยคำทำนายของ `_0012` ว่า **"ก้อย"** (ทำนายไว้ ~59.6%)
ความเสียหายจริง = **0 เพราะรอบนี้ใช้สูตรถูก** สถิติสะสมของสูตรผิด: **ก้อย 16 จาก 27**
📏 `AUTOPILOT.md` ก่อนแก้รอบนี้: **3,243 บรรทัด / 445,595 bytes**

## What I did NOT do

- **ไม่ตอบคำถามใน `## Open decisions` เอง** — ทั้ง 8 ข้อขยับพิกเซลหรือเป็นสิทธิ์เจ้าของล้วน
- **ไม่แตะ `index.html` / `Button.css` / `Menu.css` / `tools/` / `docs/`** — decision 7 (และ 2/5/6)
  ยังไม่มีคำตอบ และถ้าแอบแก้ Verify จะยัง**เขียวครบ** (jsdom ไม่ทำ hit testing, ไม่มี checker ตัวไหนดู
  `:hover`) → ไม่มีอะไรจับได้ว่าสีเปลี่ยน นั่นคือเหตุผลที่ต้องรอ ไม่ใช่ "ลองดูก่อน"
- **ไม่เพิ่มเช็คที่ 7 ใน `check-tokens.mjs`** — token ครบ 22/22 ไม่เหลืออะไรให้บังคับ
- **ไม่ตัด/ไม่ trim `AUTOPILOT.md`** ทั้งที่มันใหญ่ถึง 445 KB และ*เป็นสาเหตุ*ที่ `## Next task`
  มาถึง prompt แบบว่างเปล่า — การลบประวัติรอบคือการทิ้งหลักฐาน เป็นสิทธิ์เจ้าของ
- **ไม่ลอง Playwright / Chrome-DevTools MCP ซ้ำ** — ถูก permission บล็อกทั้งคู่ (decision 4)
- **ไม่ต่อบล็อก `> **สถานะล่าสุด …` ท้าย `AUTOPILOT.md`** ตามธรรมเนียมรอบ `_0035`/`_0041`
  (ประวัติต่อรอบยังอยู่ใน `git log` ของ `SUMMARY.md`)

## Risk

- 🔴 **runner bug ยังไม่ถูกแก้ ~4.5 สัปดาห์ และ `main` ยังเป็น `ef3220e` (2026-06-27)** — ทุกรอบยังถูก
  cut จาก `3503537` และ **ยังไม่มีอะไรถูก merge เข้า `main` เลย** ตอนนี้มี branch `auto/*` กว่า
  100 อันซ้อนขนานกัน งานทั้งหมดของโปรเจคอยู่บน branch เดียว รอบนี้ตรวจได้จาก `git log --oneline -1`
  ว่าขึ้น `3503537` จริง — **ไม่มีรอบไหนแก้เองได้ ต้องมีคนแก้ runner**
- 🔴 **รอบนี้ไม่ได้พิสูจน์อะไรเกี่ยวกับหน้าตาของแอป** — harness เขียวเพราะ**ไม่มีอะไรเปลี่ยน**
  ไม่ใช่เพราะมีใครตรวจ UI จริง `markup coverage` ของ `toast-hit` รายงาน `0 gone / 0 new`
  ซึ่งแปลว่า phase นั้น**ว่างเปล่า** อย่านับเป็นหลักฐาน
- ⚠️ **ยังไม่เคยเปิด `index.html` ในเบราว์เซอร์จริงสักรอบ** ตลอดโปรเจค (decision 4) — บั๊ก
  `pointer-events` ที่เจอและแก้ไปนั้นพิสูจน์จาก source + CSS spec เท่านั้น
- ⚠️ **jsPDF (บรรทัด 7, `cdnjs.cloudflare.com`) ยังเป็น external reference ที่เหลืออยู่จุดเดียว**
  → เปิดแบบ offline แล้ว PDF export พัง agent inline ให้ไม่ได้ (ไม่มีสำเนาบนเครื่อง + network บล็อก)
- ⚠️ **ความเสี่ยงของรอบหน้า ~59.6%** ที่จะ restore ผิดตัวถ้าใช้สูตรจัดอันดับผิด และความเสียหายโตเป็น
  **2 รอบ** (`_0012` + รอบนี้ — เอกสารล้วน ไม่ใช่โค้ด) รายละเอียดในบล็อก `## Next task`
  **ทางแก้: `--sort=-committerdate` + ตรวจซ้ำด้วย refname แบบ date-major เสมอ ห้ามใช้หมายเลขแถว**
