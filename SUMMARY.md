# SUMMARY — รอบ `2026-08-28_0049`

## What I did

- **Restore tip ของรอบก่อนเป็นงานแรก** — `git log --oneline -1` ขึ้น `3503537` (runner bug ตามเดิม)
  → `git checkout 21d91a1 -- .` (`21d91a1` = tip ของ `_0039`) commit แยกเป็น commit แรกของรอบ
  (`e6c0128`) — `git diff --stat 21d91a1` **ว่างเปล่า** = tree เท่ากับ tip ทุก byte
- **ตรวจ 5 ช่องทางที่คำตอบเจ้าของจะมาได้ — ไม่มีคำตอบสักข้อ (no-op ที่ 13 ติดกัน)**
- **จบรอบตามที่ `## Next task` สั่ง** — ไม่หยิบงานสำรอง ไม่แตะลิสต์ห้าม
  **ไม่แตะ CSS / JS / `tools/` / `docs/` สักบรรทัด** (ไฟล์ที่รอบนี้เขียนมีแค่ `SUMMARY.md` + `AUTOPILOT.md`)
- **รันครบทั้ง 5 key ของ harness** — ได้ตัวเลขตรงกับตารางใน `## Next task` **ทุกค่า**
  รวมถึง `grep -c "✗ #toast:"` = 0 และชื่อ undecidable rule ที่ตรงกันเป๊ะ
- อัปเดต `## Next task`: เลื่อนสถานะเป็นรอบ `_0049` / no-op ที่ 13 + **แก้ข้อเท็จจริงเรื่อง
  `hardening-pass` ที่ SUMMARY รอบก่อนๆ เขียนผิด** + บันทึกว่า `git reflog` เป็นทางที่สั้นที่สุด
  ในการหา tip ของรอบก่อน

## Why

`## Next task` ที่อ่านจาก**ไฟล์ที่ restore แล้ว** (ไม่ใช่จาก prompt ของ runner ซึ่งเป็นฉบับ
`3503537` และมี `## Next task` **ว่างเปล่า**) สั่งตรงๆ ว่า ถ้ายังไม่มีคำตอบให้เขียน SUMMARY
แล้วจบรอบ ห้ามประดิษฐ์งานแทน — hard rule ข้อ 5 ของ contract บอกตรงกัน

เกณฑ์ที่เหลือทุกข้อขยับพิกเซลที่คนเห็น (chip padding / segmented padding / input size /
`:hover` ของปุ่ม disabled) หรือเป็นสิทธิ์ตัดสินใจของเจ้าของ (vendor jsPDF / เปิด permission
ให้เบราว์เซอร์) และ**ไม่มี checker ตัวไหนจับได้ถ้าแอบทำ** — ไม่มีอะไรดู `:hover` และ jsdom
ไม่ทำ hit testing → Verify จะยังเขียวครบทั้งที่หน้าตาเปลี่ยน นี่คือเหตุผลตรงๆ ที่ต้อง**รอ**
ไม่ใช่ "ลองดูก่อน"

**ทำไม `git checkout <tip> -- .` ปลอดภัยในรอบนี้:** คำสั่งนี้**ลบไฟล์ไม่เป็น** ถ้า tip ลบไฟล์
ที่ base มี ไฟล์นั้นจะตกค้างเงียบๆ → รอบนี้ยืนยันสองชั้น: `git merge-base --is-ancestor
3503537 21d91a1` เป็นจริง (base เป็นบรรพบุรุษตรง = ไม่มีไฟล์ฝั่ง base ที่ tip ไม่รู้จัก)
และ `git diff --stat 21d91a1` **ว่างเปล่า** หลัง commit

**ทำไมรันแฮร์เนสทั้งที่ไม่ได้แก้ CSS:** ในรอบ restore ตัวเลขพวกนี้คือ**ลายนิ้วมือของ tree**
`git diff --stat` ว่างเปล่าพิสูจน์แค่ว่า *byte* ตรง ส่วน harness คำนวณ declaration set
ที่ชนะ cascade ของแต่ละ element **ใหม่จริงๆ** จาก `index.html` + `design-system/src/*.css`
ที่ยืนอยู่ตอนนี้ → ถ้า restore หยิบผิด tip หรือได้มาไม่ครบ ตัวเลขจะเพี้ยนทันที

## Verification

**precondition ของ shortcut ช่องทางที่ 1 (ตรวจแล้ว):**
`auto/…/2026-08-28_0039` และ `origin/auto/…/2026-08-28_0039` ชี้ `21d91a1` **ทั้งคู่**
→ ไม่ใช่ sha ค้าง ไม่มีคำตอบที่เจ้าของ commit ทับ branch เก่าแล้วโดน restore กลบ

**ช่องทางที่ 1 — `README.md` `## Open decisions`:**
`grep -c "^### [1-7]\." README.md` → **7** · `grep -c "If you answer:" README.md` → **7**
⚠️ **เลข 7/7 เป็นหลักฐานรอง ไม่ใช่ตัวปิดช่อง** — มันนับแค่ว่า*หัวข้อกับช่องตอบยังอยู่ครบ*
ถ้าเจ้าของพิมพ์คำตอบ**ต่อท้าย** "If you answer:" เลขก็ยัง 7 เท่าเดิม
หลักฐานที่ปิดช่องนี้จริงคือ **`git diff --stat 21d91a1` ว่างเปล่า** → `README.md` เป็นไฟล์เดิมทุก byte

**ช่องทางที่ 2 — jsPDF vendored:** `git ls-files | grep -i jspdf` → ไม่มี output

**ช่องทางที่ 3 — `main` ขยับไหม:** `ef3220e` (2026-06-27) **เท่าเดิม** (ทั้ง `main`, `origin/main`, `mac/main`)

**ช่องทางที่ 4 — ไฟล์ที่เจ้าของวางไว้เฉยๆ:** `git status --untracked-files=all --short` → ว่างเปล่า

**ช่องทางที่ 5 — ref ที่ไม่ใช่ `auto/deep_dive…`** (`git for-each-ref … refs/heads refs/remotes
| grep -v "auto/deep_dive"`) — ใหม่สุดคือ **2026-08-13** เก่ากว่างานทุกรอบ ไม่มีคำตอบซ่อนบน branch ข้างเคียง
```
design-system         3503537  2026-08-13   origin/design-system  3503537  2026-08-13
mac                   e3a355c  2026-07-20   origin                ef3220e  2026-06-27
mac/design-system     e3a355c  2026-07-20   origin/hardening-pass 592e7c3  2026-07-20
mac/hardening-pass    592e7c3  2026-07-20   origin/main           ef3220e  2026-06-27
mac/main              ef3220e  2026-06-27   main                  ef3220e  2026-06-27
```
🔴 **แก้ข้อเท็จจริงที่ SUMMARY รอบก่อนๆ เขียนผิด:** รอบ 0039 (และรอบก่อนหน้า) เขียนว่า
`hardening-pass` เป็นหนึ่งใน "local branch" ที่ตรวจ — **ไม่จริง** `git for-each-ref refs/heads
| grep -v "auto/deep_dive"` คืนแค่ **`design-system` กับ `main`** เท่านั้น `hardening-pass`
มีอยู่เฉพาะเป็น remote ref (`origin/` และ `mac/`) **ข้อสรุปของช่องทางที่ 5 ไม่เปลี่ยน**
(ยังไงก็ครอบคลุมเพราะสแกน `refs/remotes` ด้วย) แต่คำบรรยายเดิมไม่ตรงกับ output จริง

**tip ที่ restore มาสะอาด:** `git diff --stat 9a4c685 21d91a1` → `AUTOPILOT.md` (27 บรรทัด)
+ `SUMMARY.md` (103 บรรทัด) **เท่านั้น** → ไม่มีเศษโค้ดของรอบ no-op ตกค้างใน tree

**Verify command (รันครบ 3 ขั้นจากไฟล์ที่ restore มา เขียวหมด):**
```
node tools/test.mjs         → 54 passed, 0 failed
node tools/check-tokens.mjs → tokens 22/22 · fonts 4/4 · no derived-colour literals (15 sources)
                              font weights 400/500/700/800 · no radius literals · font-family 1 source
npm --prefix design-system test → 12 files, 31 passed (31)
```

**harness ทั้ง 5 key — ตรงกับตารางใน `## Next task` ทุกค่า:**
```
buttons            85 pairs / 17 elements  → PASS
segmented          45 pairs /  9 elements  → PASS
toast               5 pairs /  1 element   → PASS
ds-disabled-hover  15 pairs /  3 elements  → PASS + ⚠ 1 undecidable rule
toast-hit          10 pairs /  2 elements  → FAIL — 5 differ, 0 markup, 0 unmatched
                                             grep -c "✗ #toast:" = 0
```
`toast-hit` **FAIL คือผลที่ถูกต้อง** — key นี้เทียบกับ `3d3d5cc` (ก่อนแก้บั๊ก Undo กดไม่ได้)
มีไว้ให้เห็นว่ารอบนั้น*ตั้งใจ*เปลี่ยนอะไรบ้าง ไม่ได้มีไว้ให้ PASS
`✗ #toast:` = 0 คือหลักฐานว่า `#toast` ไม่ถูกแตะ (ยังมี `pointer-events:none` ครบ)
diff ทั้ง 5 อยู่ที่ `#toastUndo` ล้วน

## What I did NOT do

- **ไม่แตะเกณฑ์ที่เหลือทั้ง 3 ข้อ** — chip padding (decision 2), segmented padding (decision 5),
  input 4 ขนาด (decision 6), `:hover` ของปุ่ม disabled (decision 7) **ทุกข้อขยับพิกเซล
  และเป็นสิทธิ์ตัดสินใจของเจ้าของ** ไม่ใช่ refactor ที่ agent ตัดสินเองได้
- **ไม่ inline jsPDF** — ไม่มีสำเนาบนเครื่อง network ถูกบล็อก เจ้าของต้อง vendor เข้า repo ก่อน
- **ไม่ลองเปิดเบราว์เซอร์ซ้ำ** — Playwright/Chrome-DevTools MCP ถูก permission บล็อก
  (รอบ 2026-08-21 พิสูจน์แล้ว) การลองซ้ำคือการเสียรอบเปล่า
- **ไม่เพิ่มเช็คที่ 7 ใน `check-tokens.mjs`** — token ทั้ง 22 ตัวมี checker ครบแล้ว
  ไม่เหลืออะไรให้บังคับ การเพิ่มเช็คใหม่คือการประดิษฐ์งาน
- **ไม่แตะ `docs/btn-parity-proof.mjs`** — รันอย่างเดียว ไม่แก้

## Risk

- 🔴 **รอบนี้ไม่ได้ทำให้เกณฑ์ข้อไหนขยับเลย และรอบต่อไปก็จะไม่ขยับเช่นกันจนกว่าเจ้าของจะตอบ**
  งานที่เหลือทั้งหมดถูกบล็อกด้วย decision 1–7 ใน `README.md` `## Open decisions`
  **ระบบนี้กำลังเผารอบทิ้งไปเรื่อยๆ (13 รอบติดกันแล้ว)** — ถ้าเจ้าของอยากให้เดินต่อ
  ต้องตอบใน README หรือเปิด permission ให้เบราว์เซอร์/vendor jsPDF อย่างใดอย่างหนึ่ง
- 🔴 **runner ยังตัด branch จาก `3503537` ทุกรอบ** — ทุกรอบต้องเสีย commit แรกไปกับการ restore
  นี่เป็นบั๊กของ runner config ไม่ใช่ของ repo **ถ้าไม่แก้ที่ runner ความเสี่ยงคือ**: รอบไหนที่ agent
  ลืม restore แล้วเริ่มทำงานบน tree ของ `3503537` เลย จะได้ tree ที่ *ดูสมเหตุสมผลทุกอย่าง*
  (รอบ 0004 โดนมาแล้ว) → PR ที่กลบงาน 20+ รอบทิ้ง
  สัญญาณที่เชื่อได้มีสองอย่าง: `git log --oneline -1` = `3503537` และ `ls tools` เห็นแค่ `test.mjs`
- ⚠️ **`toast-hit` รายงาน FAIL เป็นปกติ** — reviewer ที่เห็น "FAIL" แล้วคิดว่ารอบนี้พัง **เข้าใจผิด**
  key นี้ไม่เคย PASS ตั้งแต่รอบ `2026-08-24_0003` และไม่ควร PASS
  ตัวที่ต้องเขียวคือ Verify command 3 ขั้น ซึ่งเขียวครบ
- ⚠️ **หลักฐานของรอบนี้เกือบทั้งหมดเป็น "ของไม่เปลี่ยน"** — ตรวจว่าไม่มีคำตอบใหม่ ตรวจว่า tree
  เท่าเดิม การพิสูจน์เชิงลบแบบนี้อ่อนกว่าการพิสูจน์เชิงบวกโดยธรรมชาติ จุดที่แข็งที่สุดคือ
  `git diff --stat 21d91a1` ว่างเปล่า + สอง ref ชี้ sha เดียวกัน ที่เหลือเป็นหลักฐานประกอบ
