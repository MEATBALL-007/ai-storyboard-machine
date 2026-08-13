# SUMMARY — round `auto/deep_dive_AI_Storyboard_Machine/2026-08-14_0023`

## What I did

- เขียน `docs/design-parity.md` — รายงานเทียบ CSS ทีละ property ระหว่าง `index.html` กับ
  `design-system/src/components/{Button,Chip,Badge,Modal,EmptyState}` ครบทั้ง 5 element
  (Button แตกเป็น 4 variant + base = 5 ตาราง) พร้อมตารางสรุปจำนวนความต่างและ 10 คำถาม
  ที่เจ้าของต้องตัดสินใจ เรียงตามความคุ้มค่า
- นับค่าที่ยังไม่มี token ด้วยการ scan ไฟล์จริง ไม่ใช่ประมาณ: accent-alpha **23 จุด**
  (CSS 15 · canvas 8), `#FFC72C` ดิบ 4 จุด, เขียว 5 จุด + อีก 3 เฉดที่ไม่ตรงกัน,
  `font-size` 17 ค่าไม่ซ้ำ / 104 จุด, `border-radius` 6 ค่า / 56 จุด, `padding` 49 combination
- เสนอทางเลือกข้อละ 2–3 ทางพร้อมข้อดีข้อเสีย รวมทางเลือก A′ (`--accent-rgb:255,199,44`)
  ที่ไม่เปลี่ยนหน้าตาแม้แต่พิกเซลเดียว ซึ่งโจทย์ไม่ได้ระบุไว้แต่เป็นตัวเลือกที่ตรงกลาง
- อัปเดต `AUTOPILOT.md`: ติ๊ก criterion 5 และ 6 (verified), ใส่หมายเหตุสถานะจริงของ criterion 1
  และ 7, เขียน Next task ใหม่ให้เป็น criterion 7
- **ไม่แตะ `index.html` และ `tokens.css`** ตามที่โจทย์กำหนด — diff ของรอบนี้มีแค่
  `docs/design-parity.md` (ใหม่), `AUTOPILOT.md`, `SUMMARY.md`

## Why

- **โจทย์ของรอบนี้ระบุสถานะที่ไม่ตรงกับ repo** โจทย์บอกว่า criterion 7 เสร็จแล้ว —
  มี "assertion ที่ 55" ใน `tools/test.mjs` ที่บังคับให้ `:root` เหมือน `tokens.css`
  และมีหัวข้อ "Design tokens" ใน README **ทั้งสองอย่างไม่มีอยู่จริง**: `tools/test.mjs`
  มี 54 บรรทัดพอดีและไม่มีโค้ดเทียบ token เลย (ดู `git log tools/test.mjs` — commit ล่าสุดคือ
  `46fdf77` ที่ไม่เกี่ยว), `grep "Design tokens" README.md` ไม่เจออะไร
  งานนั้นน่าจะอยู่ในรอบ 2026-08-13 ที่ SUMMARY ไม่ได้ถูก commit — โค้ดก็หายไปด้วย
  ผมไม่หยุดรอบเพราะ **task ที่สั่งยังถูกต้องและยังทำไม่ได้ทำ** (hard rule 5 ใช้กับ task ไม่ใช่กับ preamble)
  แต่บันทึกความไม่ตรงนี้ไว้ใน `AUTOPILOT.md` ให้รอบถัดไปเห็น
- **ตัวเลข `~29 จุด` ในโจทย์ก็ไม่ตรง** ค่าจริงคือ 23 (หรือ 27 ถ้ารวม `#FFC72C` ดิบ) รายงานใช้ตัวเลขที่นับได้จริง
- **สิ่งที่พบแล้วสำคัญกว่าที่คาด:** accent ทั้ง 10 จุดที่อยู่นอก CSS block เป็น canvas 2D
  (`ctx.fillStyle` / `ctx.strokeStyle`) ทั้งหมด ซึ่ง**ไม่มี CSS cascade** — `var(--accent)` ใช้ไม่ได้เลย
  แปลว่าไม่ว่าเลือกทางไหนก็ยังไม่ได้ "แหล่งเดียว" จริงจนกว่าจะจัดการฝั่ง canvas แยกต่างหาก
  ข้อนี้เขียนเป็นกรอบเตือนไว้ใน §7.1 เพราะมันเปลี่ยนขอบเขตของ criterion 1
- **ผลลัพธ์ที่ดีเกินคาด:** Modal ตรงกัน 100% ทุก property และ EmptyState ก็ตรง 100%
  Button–tab ก็ตรง 100% แปลว่า criterion 2 เล็กกว่าที่แผนสมมติไว้มาก งานจริงกระจุกอยู่ที่
  Button (ปุ่ม primary 3 ขนาดที่ design system ไม่รองรับ) และ Badge (4 variant ที่ไม่มีคู่)
- **เจอบั๊กจริงสองตัวที่แก้ได้โดยไม่ต้องตัดสินใจอะไร:** (ก) `.chip` เป็น `<div>` จึงไม่ได้
  `cursor:pointer` จากกฎ `button{}` — chip ทุกตัวในแอปไม่ขึ้นมือชี้ (ข) `.pui-btn--icon`
  ฝั่ง design system ไม่มี `:disabled:hover` reset ที่แอปมี → ปุ่ม disabled ยังเปลี่ยนสีตอน hover
  ทั้งสองอย่างอยู่ในรายงาน ไม่ได้แก้ในรอบนี้

## Verification

รัน Verify command เต็มรูปแบบเอง:

```
$ node tools/test.mjs
54 passed, 0 failed

$ npm --prefix design-system test
 ✓ src/components/SegmentedToggle/SegmentedToggle.test.tsx (3 tests)
 ✓ src/components/Menu/Menu.test.tsx (3 tests)
 ✓ src/components/Modal/Modal.test.tsx (5 tests)
 ✓ src/components/Field/Field.test.tsx (3 tests)
 ✓ src/components/Toggle/Toggle.test.tsx (3 tests)
 ✓ src/components/Toast/Toast.test.tsx (3 tests)
 ✓ src/components/EmptyState/EmptyState.test.tsx (2 tests)
 ✓ src/components/Swatch/Swatch.test.tsx (1 test)
 ✓ src/components/Button/Button.test.tsx (2 tests)
 ✓ src/lib/cn.test.ts (2 tests)
 ✓ src/components/Badge/Badge.test.tsx (2 tests)
 ✓ src/components/Chip/Chip.test.tsx (2 tests)
 Test Files  12 passed (12)
      Tests  31 passed (31)
```

ทั้งสองชุดเขียว — ซึ่งเป็นผลที่คาดไว้เพราะรอบนี้ไม่ได้แตะโค้ดที่รันได้เลย

**ตัวเลขในรายงาน verify ยังไง:** ทุกตัวเลขใน §7 มาจาก `node -e` scan ไฟล์จริง
ไม่ได้นับด้วยตา และ§7.1 ระบุเลขบรรทัดของทุกจุดที่นับ ตรวจย้อนได้

## What I did NOT do

- **ไม่แก้ `index.html` และ `tokens.css`** — โจทย์ห้ามชัดเจน แม้จะเจอบั๊ก `.chip{cursor}`
  ที่แก้ได้ใน 1 บรรทัดและไม่มีความเสี่ยงเลย ก็ปล่อยไว้ให้เป็นรอบถัดไป (hard rule 1)
- **ไม่ทำ criterion 7 ที่พบว่ายังไม่เสร็จ** ทั้งที่ค้นพบระหว่างรอบนี้ว่ามันหายไป —
  เป็นงานคนละอย่างกับ task ที่สั่ง จึงเขียนเป็น Next task แทน
- **ไม่เทียบ component อีก 7 ตัว** (`Field`, `Menu`, `SegmentedToggle`, `Swatch`, `Toast`, `Toggle`)
  — criterion 2 ระบุแค่ 5 element ระบุข้อจำกัดนี้ไว้ใน §9 ของรายงาน
- **ไม่ render เปรียบเทียบด้วยภาพจริง** — รายงานเทียบจาก CSS source เท่านั้น

## Risk

**ต้องอ่านตรงนี้:**

1. **รายงานเทียบจาก CSS source ไม่ได้ render จริง** แถวที่เขียนว่า "ตรงทุก property"
   หมายถึง declaration ตรงกัน ไม่ได้พิสูจน์ว่า computed style ตรงกัน — ยังต่างกันได้จาก
   specificity, cascade order, หรือ inline style ที่ JS ใส่ตอน runtime ก่อนลงมือทำ criterion 2
   ควรตรวจด้วยตาอย่างน้อยหนึ่งรอบ ระบุข้อจำกัดนี้ไว้ใน §9 แล้ว
2. **ตัวเลขในโจทย์ผิดสองที่** (`~29 จุด` → จริง 23, "assertion ที่ 55" → ไม่มีอยู่จริง)
   แปลว่าสถานะที่บันทึกไว้ใน AUTOPILOT.md รอบก่อนๆ **เชื่อไม่ได้ทั้งหมด** reviewer ควรสุ่ม verify
   ข้อที่ผมติ๊กในรอบนี้ด้วย (ผมรันจริงทั้งสองข้อ ผลอยู่ในหัวข้อ Verification)
3. **การนับ `padding` 49 combination อาจ overstate ปัญหา** — regex ที่ใช้จับ `padding:` ทุกแบบ
   รวม shorthand 1/2/3/4 ค่า และไม่ได้แยกว่าค่าไหนอยู่ใน media query ตัวเลขนี้ควรใช้เป็น
   สัญญาณว่า "ไม่มี scale" ไม่ใช่ตัวเลขที่จะเอาไปวางแผนงานตรงๆ
4. **ผมให้ความเห็นเชิงดีไซน์ในรายงาน** (เช่น "แนะนำ A′", "design system ถูก แอปผิด" เรื่อง `.chip{cursor}`,
   "`.pd-edit-badge` กับ `.pc-lock` แทบแน่ใจว่าเป็น drift") ทั้งหมดเป็นความเห็น ไม่ใช่ข้อเท็จจริง
   เจ้าของไม่มีภาระต้องเห็นด้วย — ส่วนที่เป็นข้อเท็จจริงคือตารางเทียบ property และตัวเลขใน §7
5. **assertion ที่เสนอใน Next task ยังไม่มีใครเขียน** ผมออกแบบไว้บนกระดาษว่าต้อง normalize
   whitespace (index.html เยื้อง 4 space, tokens.css เยื้อง 2) แต่ยังไม่ได้พิสูจน์ว่า parse ได้จริง
   รอบถัดไปต้องพิสูจน์ว่า assertion จับ regression ได้จริงด้วยการทำให้มัน fail ก่อน
