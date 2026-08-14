# Round 2026-08-15_0013 — รวม branch ให้เป็นสายเดียว

## What I did

- **รวมงานของ 4 รอบก่อนหน้าที่กระจายอยู่บน 4 branch พี่น้อง มาไว้บน branch นี้** (`0fc934e`)
  branch นี้เริ่มที่ `3503537` ซึ่ง**ไม่มีงานของรอบก่อนเลยแม้แต่รอบเดียว** — ไม่ใช่แค่
  `docs/design-parity.md` หายอย่างที่ Next task เขียนไว้ แต่หายทั้งหมด กู้กลับมา 4 ไฟล์:
  - `index.html` ← `2474f07` (คอมเมนต์ว่า `:root` คือ mirror ของ `tokens.css` + `renderSkeleton`
    เปลี่ยน `#111` เป็น `var(--surface)`)
  - `tools/test.mjs` + `README.md` ← `e5a1925` (token parity assertion + หัวข้อ `## Design tokens`)
  - `docs/design-parity.md` ← `a1c6348` (รายงานเทียบ 490 บรรทัด)
- **เลือก token parity assertion ไว้เวอร์ชันเดียว** — เอา `e5a1925` ไม่เอา `75c38ae`
- อัปเดต `AUTOPILOT.md`: หัวข้อปัญหาเชิงโครงสร้างเขียนใหม่ให้ตรงสถานะจริง (รวมสายแล้ว
  แต่ต้นเหตุยังอยู่) + `## Next task` ชี้ไปที่ §8 ข้อ 1 (`.chip{cursor:pointer}`)

## Why

**Next task ตั้งสมมติฐานผิด และเป็นหลักฐานของบั๊กตัวเดียวกันที่มันสั่งให้แก้.**
มันสั่งว่า "เทียบ token parity assertion สองเวอร์ชันแล้วเหลือไว้เวอร์ชันเดียว" ซึ่งแปลว่า
คิดว่าทั้งสองเวอร์ชันอยู่บน branch นี้ — ความจริงคือ**ไม่มีสักเวอร์ชันเดียว** `tools/test.mjs`
บน `3503537` ไม่มี assertion เรื่อง token เลย และ `docs/` มีแต่ `superpowers/`
งานจริงจึงเป็นงานเดียวกับที่สั่ง ("รวม branch ให้เป็นสายเดียว") แค่ใหญ่กว่าที่ระบุไว้
ผมทำให้ครบสายแทนที่จะทำแค่ cherry-pick เดียวแล้วทิ้งอีกสามรอบไว้ข้างหลัง

**ทำไมเลือก `e5a1925` ทิ้ง `75c38ae`** — ทั้งสองเพิ่ม assertion 1 ข้อเท่ากัน (54 → 55) และ
ตรวจ invariant เดียวกัน แต่วิธีต่างกัน:

| | `75c38ae` | `e5a1925` (เลือกอันนี้) |
|---|---|---|
| วิธีเทียบ | ตัดข้อความ `:root{…}` ออกมาแล้วเทียบ**ทีละบรรทัดตามตำแหน่ง** | parse เป็น `Map` ของ `name → value` แล้วเทียบ**สองทาง** |
| สลับลำดับบรรทัด | **fail ทั้งที่ token ตรงกันหมด** | ผ่าน |
| ขึ้นบรรทัด/ย่อหน้าใหม่ | fail | ผ่าน (normalize `\s+` ก่อนเทียบ) |
| token เกินใน `index.html` | จับได้ (ทางอ้อม ผ่านความยาว) | จับได้ตรงๆ พร้อมชื่อ token |
| ข้อความตอน fail | บอกเลขบรรทัดที่ต่าง | บอกชื่อ token + ค่าสองฝั่ง |

`75c38ae` ให้ **false failure** ได้ ซึ่งอันตรายกว่าไม่มี assertion เพราะรอบถัดไปจะเสียเวลา
ไล่หา "drift" ที่ไม่มีจริง เก็บทั้งสองอันไว้ = คุ้ม invariant เดียวกันซ้ำ โดยอันที่อ่อนกว่า
คอยส่งเสียงหลอก

**ทำไมใช้ `git checkout <sha> -- <path>` ไม่ใช่ `cherry-pick`** — commit ของรอบก่อนพ่วง
`AUTOPILOT.md`/`SUMMARY.md` ของรอบนั้นมาด้วย ซึ่งตกยุคแล้วและจะชนกันเอง จึงกู้เฉพาะไฟล์เนื้อหา
แล้วพิสูจน์ว่าตรงกับ commit ต้นทางแบบ byte-identical (ดู Verification)

## Verification

```
$ node tools/test.mjs
55 passed, 0 failed

$ npm --prefix design-system test
Test Files  12 passed (12)
     Tests  31 passed (31)
```

พิสูจน์ว่าไฟล์ที่กู้มาตรงกับ commit ต้นทางจริง (`git diff --cached --quiet <sha> -- <path>`):

```
index.html identical to 2474f07: YES
README identical to e5a1925: YES
test.mjs identical to e5a1925: YES
design-parity identical to a1c6348: YES
```

ตรวจว่าไม่ได้เพิ่ม external reference (criterion 4) — `index.html` มี 4 รายการ
(preconnect ×2, Google Fonts, jsPDF CDN) **เท่าเดิมกับก่อนรอบนี้** รอบนี้ไม่ได้เพิ่มสักอัน

### พิสูจน์ว่า assertion ที่เลือกไว้ทำงานจริง (ไม่ได้เชื่อ commit message เดิม)

รัน mutation 4 แบบกับ assertion ของ `e5a1925` แล้ว revert ทุกครั้ง:

| mutation | ผลที่ต้องการ | ผลจริง |
|---|---|---|
| แก้ค่า `--bg:#0D0D0D` → `#0D0D0E` ใน `tokens.css` | fail | ✅ `--bg is #0D0D0D in index.html but #0D0D0E in tokens.css` |
| เพิ่ม `--brandnew` เฉพาะใน `tokens.css` | fail | ✅ `index.html :root is missing --brandnew:#fff` |
| เพิ่ม `--extra` เฉพาะใน `index.html` | fail | ✅ `index.html :root declares --extra which tokens.css does not` |
| **กลับลำดับ declaration ทั้ง 12 ตัว + จัดบรรทัดใหม่** (ค่าตรงกันหมด) | **pass** | ✅ `55 passed, 0 failed` |

แล้วเอา assertion ของ `75c38ae` มารันกับ mutation ตัวสุดท้ายตัวเดียวกัน — **fail ผิด**:

```
✗ token drift at :root line 2
      tokens.css : "  --mono:'JetBrains Mono', ui-monospace, ..."
      index.html : "  --bg:#0D0D0D; --surface:#111111; --surface2:#141414;"
```

ทั้งที่ token ทุกตัวยังตรงกันเป๊ะ — นี่คือเหตุผลที่ทิ้ง `75c38ae` วัดจากการรันจริง ไม่ใช่อ่านโค้ดเดา

## What I did NOT do

- **ไม่ได้แตะ criterion 2 เลย** (`.chip{cursor:pointer}` ฯลฯ) — hard rule ข้อ 1 บอกให้ทำงานเดียว
  และงานเดียวของรอบนี้คือรวมสาย ผมตั้งไว้เป็น Next task แล้ว
- **ไม่ได้ติ๊ก criterion 1** ถึงแม้ `:root` จะ mirror `tokens.css` และมี assertion คุมแล้ว —
  เพราะ criterion เขียนว่า "แทนค่าสี/**ระยะ**ที่ hard-code" และ §7.3 ของ `design-parity.md`
  ระบุว่า design system **ยังไม่มี** spacing/radius/type-scale token เลย ติ๊กตอนนี้คือโกหก
- **ไม่ได้ติ๊ก criterion 3** (เปิดด้วย `file://`) — เครื่องนี้ headless เปิด browser จริงไม่ได้
  รอบนี้ไม่ได้แก้อะไรที่กระทบเรื่องนี้ แต่ก็ไม่ได้ยืนยันด้วยตา จึงไม่ติ๊ก
- **ไม่ได้เอา `75c38ae`, `5bbdaa5`, `972502b`, `50c86a7` มา** — อันแรกถูก supersede
  (เหตุผลข้างบน) สามอันหลังเป็น commit บันทึกผลรอบ (`AUTOPILOT.md`/`SUMMARY.md`) ซึ่งเนื้อหา
  ถูกยุบเข้ามาในสองไฟล์นี้แล้ว
- **ไม่ได้ push / ไม่ได้เปิด PR / ไม่ได้ merge เข้า main** — hard rule ข้อ 3

## Risk

### 🔴 เรื่องที่ runner ต้องทำ ไม่งั้นรอบหน้าพังซ้ำทันที

`main` ยังอยู่ที่ `ef3220e "Add README"` — **ยังไม่มี branch ไหนถูก merge เข้า main เลยสักอัน**
และรอบที่ผ่านมาทุกรอบแตก branch จาก `3503537` (ฐานเดิม) ไม่ใช่จากปลาย branch ของรอบก่อน
ผลคือทุกรอบเริ่มต้นโดยมองไม่เห็นงานของรอบก่อน — เกิดมาแล้ว **4 รอบติด**:

```
* 50c86a7  auto/…/2026-08-15_0003
* e5a1925
| * 972502b  auto/…/2026-08-14_0023
| * a1c6348
|/
| * 75c38ae  auto/…/2026-08-14_0008
|/
| * 5bbdaa5  auto/…/2026-08-13_1633
| * 2474f07
|/
* 3503537  ← ทุก branch แตกจากจุดนี้ รวมทั้ง branch ของรอบนี้
```

**รอบนี้แก้ได้แค่ปลายเหตุ** (ดึงงานเก่ามารวมไว้ที่เดียว) **ต้นเหตุอยู่ฝั่ง runner แก้ที่ repo ไม่ได้**
สิ่งที่ต้องทำอย่างใดอย่างหนึ่ง:

1. **merge PR ของรอบนี้เข้า `main`** แล้วให้รอบถัดไปแตก branch จาก `main` (ทางที่ถูก) — หรือ
2. อย่างน้อยให้รอบถัดไป**แตก branch จากปลาย branch ของรอบนี้** (`auto/…/2026-08-15_0013`)

ถ้าไม่ทำ รอบหน้าจะกลับไปเริ่มที่ `3503537` อีก **และงานทั้งหมดในรอบนี้จะหายจากสายตาทันที**
กลายเป็นรอบที่ 5 ที่เผาไปกับการทำของเดิมซ้ำ

### เรื่องที่ reviewer ควรดูใกล้ๆ

- **`0fc934e` เป็น commit ก้อนใหญ่ที่แตะ 4 ไฟล์** ดูเหมือนงานใหม่แต่จริงๆ เป็นงานเก่าที่กู้กลับมา
  ถ้าอยากตรวจว่าไม่มีอะไรแอบแฝง ให้รันคำสั่งใน Verification — ถ้าออก `YES` ทั้ง 4 บรรทัด
  แปลว่าไม่มีบรรทัดไหนถูกเขียนขึ้นใหม่ในรอบนี้เลย
- **`2474f07` เปลี่ยน `#111` → `var(--surface)` ใน inline style ของ `renderSkeleton`**
  เป็นการแก้ที่กระทบ runtime จริง (ไม่ใช่คอมเมนต์) — `--surface:#111111` และ `#111 === #111111`
  จึงไม่ควรเปลี่ยนหน้าตา แต่**ผมไม่ได้ verify ด้วยตาในรอบนี้** เป็นการยกเหตุผลมาจาก commit เดิม
  ถ้าจะตรวจ ให้ดู skeleton shimmer ตอนกด Generate
- ~~assertion ที่ 55 ไม่ได้ทดสอบ mutation~~ — **ทดสอบแล้วในรอบนี้ ดู Verification ด้านบน**
  ทั้ง fail 3 กรณี และ pass กรณี reorder ยืนยันด้วยการรันจริง ไม่ได้เชื่อ commit message เดิม
