# SUMMARY — round `auto/deep_dive_AI_Storyboard_Machine/2026-08-29_0019`

**ผลของรอบนี้: no-op ที่ตั้งใจ — ตรวจครบ 5 ช่องทางแล้วไม่มีคำตอบจากเจ้าของสักข้อ จบรอบตามที่ Next task สั่ง**
(ไม่มีไฟล์ในโปรเจคถูกแก้เลยนอกจาก `AUTOPILOT.md` + `SUMMARY.md` — **no-op ที่ 15 ติดกัน**)

## What I did

- **Restore ก่อนอ่านไฟล์ในโปรเจคแม้แต่ไฟล์เดียว** — `git log --oneline -5` ยืนยัน HEAD = `3503537`
  (runner bug เดิม: ตัด branch จาก base เก่าทุกรอบ) → restore tip ของรอบก่อน `47adb64`
  (`…/2026-08-29_0009`) ด้วย `git checkout 47adb64 -- .` แล้ว commit แยกเป็น `b1a6273`
  เพื่อให้ diff ของงานจริงในรอบนี้อ่านง่าย
- **ตรวจครบทั้ง 5 ช่องทางที่คำตอบของเจ้าของจะมาได้ — ไม่พบคำตอบสักข้อ** (รายละเอียดใต้ Verification)
- **รัน Verify ครบ 3 ขั้น เขียวทั้งหมด** และรัน `docs/btn-parity-proof.mjs` ครบทั้ง 5 key
  → ตัวเลขตรงกับตารางใน `AUTOPILOT.md` ทุกค่า = ยืนยันซ้ำว่า restore ได้ tree ที่ถูกต้องครบถ้วน
- **อัปเดต `## Next task` ใน `AUTOPILOT.md`** เป็นสถานะรอบนี้ พร้อมบันทึกใหม่ 2 ข้อ
  (การยุบ precondition-check ให้เหลือ 1 call ก่อน restore, และการรวม grep รอง + Verify ใน call เดียว)
- **ไม่หยิบงานสำรองมาทำ** — Next task สั่งไว้ชัดว่างานสำรองหมดแล้วจริงและห้ามประดิษฐ์งานแทน

## Why

- **ทำไมต้อง restore ก่อนอ่านอะไร:** runner ตัดทุก `auto/*` branch จาก `3503537` ไม่ใช่จาก tip
  ของรอบก่อน แต่ข้อความ `AUTOPILOT.md` ใน prompt ถูก generate จากรอบก่อน → tree ที่ยืนอยู่จริง
  **ไม่ตรงกับสัญญาที่ได้รับมา** ความผิดพลาดที่แพงที่สุดคือ*อ่านไฟล์ก่อน restore* เพราะ tree เก่า
  ไม่ได้ดูพัง มัน**ดูเหมือนงานเสร็จแล้ว** (`:root` ของแอปตรงกับ `tokens.css` 11 ตัวพอดีบน base เก่า)
  รอบนี้จึงเปิดด้วย `git log` เป็นคำสั่งแรกสุด และไม่อ่านไฟล์ในโปรเจคเลยจนกว่า restore จะ commit เสร็จ
- **ทำไม `git diff --stat 47adb64` ว่างเปล่าถึงเป็นหลักฐานหลักของช่องทางที่ 1 ไม่ใช่ `grep`:**
  `grep -c "^### [1-7]\."` และ `grep -c "If you answer:"` นับแค่ว่า*หัวข้อกับช่องตอบยังอยู่ครบ*
  ถ้าเจ้าของพิมพ์คำตอบต่อท้ายบรรทัดเดิม เลขก็ยังเป็น 7/7 เท่าเดิม → เป็นหลักฐาน**รอง**
  ตัวปิดช่องทางจริงคือ tree เท่ากับ tip ทุก byte (README จึงเป็นไฟล์เดิมเป๊ะ) **บวก precondition**
  ว่า `47adb64` ยังเป็นปลาย branch ของรอบก่อนทั้ง `refs/heads` และ `origin/` ซึ่ง `for-each-ref`
  รอบนี้พิมพ์ตรงกันทั้งคู่ — ถ้า sha ขยับแปลว่าเจ้าของ commit ทับ และ restore จาก sha ค้างจะกลบคำตอบทิ้ง
- **ทำไมต้องรัน harness ทั้ง 5 key ทั้งที่รอบนี้ไม่แตะ CSS เลย:** `git diff --stat` ว่างเปล่าพิสูจน์
  แค่ว่า byte ตรงกับ sha หนึ่ง แต่ harness **คำนวณ declaration set ที่ชนะ cascade ใหม่จากไฟล์ที่
  ยืนอยู่จริง** → เป็นลายนิ้วมือเชิงความหมายของ tree ถ้า restore ผิด tip หรือได้มาไม่ครบ ตัวเลขจะเพี้ยนทันที

## Verification

**Verify command ครบ 3 ขั้น — เขียวทั้งหมด:**
```
node tools/test.mjs        → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 CSS sources)
                              · font weights 400/500/700/800 · no radius literals · font-family = var(--mono)
npm --prefix design-system test → 12 test files, 31 passed
```

**`docs/btn-parity-proof.mjs` ทั้ง 5 key — ตรงกับตารางใน `AUTOPILOT.md` ทุกค่า:**
```
buttons    2488f2d:index.html 9fab5c9:index.html  → PASS, 85 pairs / 17 elements
segmented  021b966:index.html index.html          → PASS, 45 pairs /  9 elements
toast      bb10dd9:index.html 10e8f39:index.html  → PASS,  5 pairs /  1 element
ds-disabled-hover HEAD:design-system/src/styles.css design-system/src/styles.css
                                                  → PASS, 15 pairs / 3 elements, 1 undecidable
toast-hit  3d3d5cc:index.html index.html          → FAIL — 5 declaration(s) differ, 0 markup problems
                                                    grep -c "✗ #toast:" = 0
```
(`toast-hit` FAIL คือผลที่**ถูกต้อง** — key นี้มีไว้แสดงว่ารอบ `2026-08-24_0003` เปลี่ยนอะไรบ้าง
 ไม่ได้มีไว้ให้ PASS; เลข 5 ที่ไม่ขยับ + `✗ #toast:` = 0 คือหลักฐานว่าไม่มีใครไปแตะฝั่งแอป)

**5 ช่องทางที่คำตอบของเจ้าของจะมาได้ — ทุกค่าจาก output ของรอบนี้เอง ไม่ได้ลอกจาก SUMMARY รอบก่อน:**

| # | ช่องทาง | คำสั่ง | ผลรอบนี้ |
|---|---|---|---|
| 1 | `README.md → ## Open decisions` | `git diff --stat 47adb64 -- .` | **ว่างเปล่า** = README เดิมทุก byte (รอง: `^### [1-7]\.` = 7, `If you answer:` = 7) |
| 2 | `jspdf.umd.min.js` ใน repo | `git ls-files \| grep -i jspdf` | **ไม่มี match** |
| 3 | `main` ขยับหรือยัง | `git for-each-ref …` | **`ef3220e`** เท่าเดิม |
| 4 | ไฟล์ที่หย่อนทิ้งไว้แบบ untracked | `git status --untracked-files=all --short` | **ว่างเปล่า** |
| 5 | ref ที่ไม่ใช่ `auto/deep_dive…` | `git for-each-ref … \| grep -v "auto/deep_dive"` | ใหม่สุด **2026-08-13** (`design-system`/`origin/design-system` = `3503537`); `main`/`mac/main`/`origin/main` = `ef3220e` (2026-06-27); `hardening-pass` มีเฉพาะ `origin/`+`mac/` = `592e7c3` (2026-07-20); `mac`/`mac/design-system` = `e3a355c` (2026-07-20) — **ทุกอันเก่ากว่างานทุกรอบ** |

**Precondition ของ restore (ตรวจก่อนแตะ tree):**
- `git merge-base --is-ancestor 3503537 47adb64` → exit 0 (`ancestor-ok`) = base เป็นบรรพบุรุษตรง
  → `git checkout 47adb64 -- .` จะไม่ทิ้งไฟล์ที่ tip ลบไป
- `git diff --stat HEAD 47adb64` ก่อน restore → 16 ไฟล์, 2445 insertions / 162 deletions,
  **ไม่มีบรรทัด `deleted`** → path-checkout เทียบเท่า fast-forward ในกรณีนี้
- หลัง restore: `git diff --stat 47adb64 -- .` → **ว่างเปล่า** = tree ตรงกับ tip ทุก byte

**tip ที่ restore มาสะอาดไหม:** `git diff --stat cf6df00 47adb64` → ขึ้นแค่ `AUTOPILOT.md` (12 บรรทัด)
+ `SUMMARY.md` (193 บรรทัด) = รอบ `_0009` ไม่ได้แตะโค้ดเลยจริงตามที่มันอ้าง ไม่มี artifact ตกค้าง

## What I did NOT do

- **ไม่ตอบคำถามใน `## Open decisions` สักข้อ** — ทั้ง 7 ข้อขยับพิกเซลหรือเพิ่มไฟล์เข้า repo
  = สิทธิ์ของเจ้าของล้วน (chip padding / segmented padding / input sizes / disabled-hover /
  jsPDF vendoring / spacing scale / browser verification)
- **ไม่หยิบงานในลิสต์ห้ามมาทำ** — ไม่ implement `:last-child`/combinator matching ให้ harness,
  ไม่เอา harness เข้า Verify command, ไม่แก้ `Button.css`/`Menu.css`/`index.html` ตาม decision 7
- **ไม่เพิ่มเช็คที่ 7 ใน `tools/check-tokens.mjs`** — token ครบทั้ง 22 ตัวมี checker หมดแล้ว
- **ไม่ลองเปิดเบราว์เซอร์ซ้ำ** — Playwright / Chrome-DevTools MCP ถูก *permission* บล็อก
  ไม่ใช่แค่ไม่มีจอ (decision 4) การลองซ้ำคือการเผารอบทิ้ง
- **ไม่แตะ `storyboard-simulator.html`** และไม่แตะ marker ของ `tools/test.mjs`

## Risk

- 🔴 **ความเสี่ยงหลักของรอบนี้ไม่ใช่โค้ด แต่คือ "งานหยุดนิ่ง"** — 15 รอบติดกันที่ผลลัพธ์เดียวกัน
  ทุกเกณฑ์ที่เหลือถูกบล็อกด้วยคำตอบ 7 ข้อที่ยังไม่มา และ **ไม่มีทางที่ agent จะปลดเองได้อย่างถูกต้อง**
  ถ้าเจ้าของอยากให้เดินต่อ ต้องตอบใน `README.md → ## Open decisions` (หรือหย่อน `jspdf.umd.min.js`
  ลง repo สำหรับข้อ 1 / เปิด permission เบราว์เซอร์สำหรับข้อ 4) — ไม่ใช่รอให้รอบถัดไปคิดออกเอง
- ⚠️ **runner ยังตัด branch จาก `3503537` ทุกรอบ** — รอบนี้เป็นรอบที่ 32 ในลิสต์ที่ต้อง restore เอง
  ทุกรอบเสีย 1 commit กับ 5 Bash call ไปกับการซ่อมสิ่งเดียวกัน และมี failure mode ที่เงียบมาก
  (อ่านไฟล์ก่อน restore → สรุปจาก tree เก่าที่ *ดูเหมือนงานเสร็จแล้ว*) นี่คือ **bug ของ runner
  ไม่ใช่ของ repo** — `main` ยังอยู่ที่ `ef3220e` แปลว่าไม่มีอะไรถูก merge เลยตลอด 30+ รอบ
  branch จึงกองซ้อนกันขนานกันไปเรื่อยๆ
- ⚠️ **`toast-hit` ขึ้น `FAIL` โดยตั้งใจ** — ถ้าคนอ่านผลรันแบบผ่านๆ จะเข้าใจผิดว่ารอบนี้ทำพัง
  เกณฑ์ที่ถูกคือ "5 เท่าเดิม + `✗ #toast:` = 0" ซึ่งรอบนี้ได้ครบทั้งสองค่า
- ⚠️ **ยังไม่เคยมีรอบไหน verify ด้วยเบราว์เซอร์จริง** — ข้อสรุปเรื่อง `pointer-events` inheritance
  ทั้งหมดมาจาก source + CSS spec และ jsdom ไม่ทำ hit testing → เทสต์ 31 ตัวพิสูจน์เรื่องนี้ไม่ได้
- ⚠️ **`git checkout <tip> -- .` ไม่ลบไฟล์เป็น** — ถ้ารอบไหนในอนาคต tip *ลบ* ไฟล์ วิธีนี้จะทิ้งไฟล์
  ตกค้างเงียบๆ รอบนี้กันด้วย `merge-base --is-ancestor` + `git diff --stat 47adb64 -- .` ว่างเปล่า
  แต่รอบถัดไปต้องตรวจซ้ำเอง ห้ามถือว่าจริงโดยอัตโนมัติ
