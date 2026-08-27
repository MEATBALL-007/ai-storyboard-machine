# SUMMARY — รอบ `2026-08-28_0004`

## What I did

- **Restore tip ของรอบก่อน** — HEAD เริ่มรอบที่ `3503537` (runner bug ตามเดิม)
  → `git checkout ddc9421 -- .` (`ddc9421` = tip ของ `_0049`; ยืนยันก่อน restore แล้วว่า
  local และ `origin/` ชี้ sha เดียวกัน) commit แยกเป็น `f6ff823`
  `git diff --stat ddc9421 -- .` **ว่างเปล่า** = tree เท่ากับ tip ทุก byte
- **ตรวจ 5 ช่องทางที่คำตอบเจ้าของจะมาได้ — ไม่มีคำตอบสักข้อ (no-op ที่ 9 ติดกัน)**
- **จบรอบตามที่ Next task สั่ง** — ไม่หยิบงานสำรอง ไม่แตะลิสต์ห้าม
- อัปเดต `## Next task`: เลื่อนสถานะเป็นรอบ `_0004` / no-op ที่ 9 และเพิ่มคำเตือนใหม่จากรอบนี้
  (ดู Risk ข้อ 1 — รอบนี้ผมพลาดลำดับ restore เอง)

## Why

Next task ของรอบก่อนเขียนไว้ตรงๆ ว่า ถ้ายังไม่มีคำตอบให้เขียน SUMMARY แล้วจบรอบ ห้ามประดิษฐ์งานแทน
และ hard rule ข้อ 5 ของ contract บอกตรงกัน เกณฑ์ที่เหลือทุกข้อขยับพิกเซลที่คนเห็น หรือเป็นสิทธิ์
ตัดสินใจของเจ้าของ และไม่มี checker ตัวไหนจับได้ถ้าแอบทำ — จึงเป็นเหตุผลตรงๆ ที่ต้อง**รอ**

## Verification

**ช่องทางที่ 1 — `README.md` `## Open decisions`:**
`grep -c "^### [1-7]\." README.md` → **7** · `grep -c "If you answer:" README.md` → **7**
(ครบ 7 ข้อ 7 ช่องตอบ ยังไม่ถูกใช้สักอัน) เสริมด้วยหลักฐานที่แข็งกว่า:
`git diff --stat ddc9421 -- .` ว่างเปล่า = `README.md` เป็นไฟล์เดิมทุก byte

**ช่องทางที่ 2 — jsPDF vendored:** `git ls-files | grep -i jspdf` → ไม่มี output

**ช่องทางที่ 3 — `main` ขยับไหม:** `ef3220e` (2026-06-27) **เท่าเดิม**

**ช่องทางที่ 4 — ไฟล์ที่เจ้าของวางไว้เฉยๆ:** `git status --untracked-files=all --short` → ว่างเปล่า

**ช่องทางที่ 5 — ref ที่ไม่ใช่ `auto/deep_dive…`:**
`design-system` `3503537` (2026-08-13) · `hardening-pass` `592e7c3` (2026-07-20) ·
`main` `ef3220e` (2026-06-27) + `origin/`/`mac/` ของทั้งสาม → **ใหม่สุด 2026-08-13**
เก่ากว่างานทุกรอบ ไม่มีคำตอบซ่อนบน branch ข้างเคียง

**Verify command (รันครบ 3 ขั้นตามไฟล์ที่ restore มา เขียวหมด):**

```
$ node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
54 passed, 0 failed
tokens in sync: 22/22 from design-system/src/tokens.css present and identical in index.html
fonts in sync: 4/4 from design-system/src/fonts.css embedded byte-identical in index.html
no derived-colour literals: 15 CSS source(s) scanned, none re-hardcode a tokenised colour
font weights available: 15 CSS source(s) scanned, every font-weight is one of 400, 500, 700, 800
no radius literals: 15 CSS source(s) scanned, every border-radius reads a --r-* token
typeface from one source: 15 CSS source(s) scanned, every font-family reads var(--mono)
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

## What I did NOT do

- **ไม่แตะ `Button.css` / `Menu.css` / `index.html` / `Chip.css` / `SegmentedToggle.css` / `Field.css`**
  — decision 2 / 5 / 6 / 7 ยังไม่มีคำตอบ ทุกข้อขยับพิกเซล
- **ไม่รันเบราว์เซอร์** — Playwright / Chrome-DevTools MCP ถูก permission บล็อก
- **ไม่รัน `docs/btn-parity-proof.mjs`** — ไม่มี CSS เปลี่ยนสักบรรทัด ไม่มีอะไรให้เทียบ
- **ไม่ revert commit `b2ed91d`** ที่ผมสร้างผิดพลาดตอนต้นรอบ (ดู Risk ข้อ 1) — เนื้อหาของมัน
  ถูกทับหมดแล้วโดย restore commit `f6ff823` ทั้ง `AUTOPILOT.md` และ `SUMMARY.md`
  การ revert จะเพิ่ม commit เปล่าอีกอันโดยไม่เปลี่ยน tree

## Risk

- 🔴 **รอบนี้ผมทำผิดลำดับเอง — restore ทีหลัง แทนที่จะ restore ก่อน** ผมเริ่มด้วยการอ่าน
  `index.html` กับ `tokens.css` จาก tree ของ `3503537` แล้วสรุปว่า "งาน token เสร็จไปแล้ว
  ไม่มีอะไรให้ทำ" พร้อม commit เอกสาร `b2ed91d` ที่ลิสต์ค่า hard-code ไว้เป็นตาราง 5 กลุ่ม
  **ข้อสรุปนั้นผิดทั้งหมดเพราะเป็นการอ่าน tree เก่า** ของจริงที่ `ddc9421` มี token 22 ตัว
  (ไม่ใช่ 11), มี radius token, ฝังฟอนต์ไว้ในไฟล์แล้ว, และมี `tools/check-tokens.mjs` 427 บรรทัด
  ที่บังคับทุกอย่างอยู่ — แถม "Next task" ที่ผมเสนอใน `b2ed91d` (เขียน `tools/check-tokens.mjs`
  + เพิ่มหัวข้อสอนแก้ token ใน README) ก็**ทำเสร็จไปแล้วตั้งแต่รอบก่อนๆ**
  ที่จับได้เพราะไปอ่าน memory note แล้วเห็นว่ามันบรรยายสภาพ repo คนละอันกับที่เห็นตรงหน้า
  **reviewer อย่าอ่าน `b2ed91d` เป็นข้อเท็จจริง — มันคือ artifact ของ tree ผิด**
  บทเรียน: `git log --oneline -1` ต้องเป็น**คำสั่งแรกจริงๆ** ห้ามอ่านไฟล์ก่อนแม้แต่ไฟล์เดียว
  เพราะไฟล์ที่อ่านได้ *ดูปกติดี* ทุกอย่าง — มันไม่ได้หายไปแบบเห็นชัด มันแค่เก่ากว่าความจริงหลายรอบ
- 🔴 **โปรเจคบล็อกสนิทที่ owner decision 7 ข้อ มา 9 รอบติด** ทุกรอบตั้งแต่ `_0007` เป็น no-op
  งานจริงหยุดตั้งแต่ `2026-08-24_0023` **ทางเดียวที่ปลดล็อกคือเจ้าของตอบใน `README.md`
  `## Open decisions`** (มีช่อง "**If you answer:**" เตรียมไว้ครบ 7 ข้อ) หรือ vendor
  `jspdf.umd.min.js` เข้า repo
- ⚠️ **runner bug ยังอยู่** — branch นี้ถูกตัดจาก `3503537` อีก และยังไม่มีอะไร merge เข้า `main`
  เลย (`main` ยัง 2 commits ไม่มี design-system) ตอนนี้มี `auto/*` branch ซ้อนกัน 30+ อัน
  ที่ diff ทับกันเอง **reviewer ควรดูเรื่องนี้ก่อนดู diff ของรอบไหนก็ตาม**
- ⚠️ diff ของรอบนี้ = `b2ed91d` (ผิด ถูกทับหมดแล้ว) + `f6ff823` (restore งานรอบก่อน) +
  commit เอกสารนี้ **ไม่มีการเปลี่ยน CSS/JS สักบรรทัด** — ยืนยันได้จาก `git diff --stat ddc9421 HEAD`
  ที่ควรมีแค่ `SUMMARY.md` กับ `AUTOPILOT.md`
