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
      → **สีเสร็จแล้ว** (2026-08-20): ค่าสีทุกตัวใน `<style>` ที่ตรงกับ token แล้วชี้ไป token หมด
        เหลือแต่ near-miss (ดู "Open decision" ข้างล่าง) กับสีที่ไม่มี token คู่กัน
      → **ระยะ/มุมโค้ง/ตัวอักษร ยังไม่เริ่ม** — `tokens.css` ยังไม่มี token กลุ่มนั้นเลย
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
      ⚠️ ยังไม่ได้ verify รอบไหนเลย และ jsPDF/Google Fonts โหลดจาก CDN อยู่ (ของเดิม ไม่ใช่ของใหม่)
        → offline จริงๆ PDF export จะพัง ต้องตัดสินใจว่าจะ inline หรือยอมรับ
- [ ] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
      → ณ 2026-08-20 ยังไม่มีการเพิ่ม; ของเดิมมี 4 จุด (fonts.googleapis ×3, cdnjs jsPDF ×1)
- [x] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว 31/31
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      → `design-system/src/tokens.css` เป็นแหล่งเดียว, ขั้นตอน sync อยู่ใน README หัวข้อ
      "Design tokens — single source of truth", และ `tools/check-tokens.mjs` บังคับให้ตรงกันจริง

## Verify

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

## Out of scope

- **ห้ามแปลง `index.html` เป็น React และห้ามเพิ่ม build step / bundler / npm dependency ให้แอป**
- **ห้ามแยก `index.html` ออกเป็นหลายไฟล์** — การเป็นไฟล์เดียวคือตัวโปรเจค ไม่ใช่ข้อจำกัดชั่วคราว
- **ห้ามแตะ marker `// ==PURE-LOGIC-START==` / `==PURE-LOGIC-END==` / `==TESTS-START==` / `==TESTS-END==`**
  — `tools/test.mjs` ดึงโค้ดออกมาด้วย marker เหล่านี้ ถ้า marker หายหรือย้าย test runner จะ throw ทันที
- **ห้ามแทน `rgba()`/hex ที่อยู่ในโค้ด JS วาด canvas ด้วย `var()`** — `ctx.fillStyle` ไม่รู้จัก
  CSS custom property จะกลายเป็นสีดำเงียบๆ (ตอนนี้เหลือ literal ในโค้ด canvas 9 จุด ตั้งใจไว้แบบนั้น)
- ห้ามลบหรือปิดเทสต์เพื่อให้ผ่าน
- ห้ามแตะ `storyboard-simulator.html` ในรอบนี้

## Next task — do ONLY this

**เพิ่ม token กลุ่ม spacing / radius / type เข้า `tokens.css` แล้วยุบค่าที่ซ้ำในแอป**

`tokens.css` ตอนนี้มีแต่สี (+ `--mono`) ไม่มี token ของระยะเลยสักตัว ทั้งที่ `<style>` ของแอป
ใช้ค่าซ้ำๆ อยู่มาก (`border-radius:2px/3px/4px/5px`, `padding` ชุดเดิมๆ, `font-size:8px…12px`)

1. อ่าน `design-system/src/styles.css` ก่อน — ถ้า Phantom UI มี scale ของตัวเองอยู่แล้วให้ใช้ตามนั้น
   **อย่าคิด scale ใหม่ขึ้นมาเอง** ถ้ามันมีอยู่แล้ว
2. นับค่าที่ใช้จริงใน `<style>` ของ `index.html` แล้วตั้ง token เฉพาะค่าที่**ซ้ำตั้งแต่ 3 จุดขึ้นไป**
   — ค่าที่โผล่ครั้งเดียวปล่อยไว้ อย่าบังคับให้เข้า scale เพราะนั่นคือการเปลี่ยนดีไซน์
3. เพิ่มใน `design-system/src/tokens.css` → ก๊อกบล็อก `:root` ทับใน `index.html` ตามขั้นตอนใน README
4. แทนค่าที่ hard-code ด้วย token **เฉพาะจุดที่ค่าตรงเป๊ะ** — หน้าตาต้องเท่าเดิมทุกพิกเซล
5. รัน Verify ให้ครบ 3 คำสั่ง

## Open decision — ต้องให้เจ้าของตัดสิน (อย่าเดาเอง)

ใน `<style>` ยังมีสีที่ "เกือบ" ตรง token แต่ไม่ตรงเป๊ะ ถ้าจะยุบต้อง**ขยับสีจริง**:

| ค่าในแอป | ใช้ที่ไหน | token ที่ใกล้ที่สุด | ต่างกัน |
|---|---|---|---|
| `#0a0a0a` ×4 | menu header, animatic bar/track | `--panel` `#0C0C0C` | สว่างต่างกัน ~2/255 |
| `#161616` ×2 | เส้นคั่น shotlist / continuity | `--line` `#1c1c1c` | เข้มกว่า token |
| `#151515` ×1 | เส้นคั่น menu item | `--line` `#1c1c1c` | เข้มกว่า token |
| `#222` / `#333` | scrollbar thumb + hover | `--dim` `#2E2E2E` | คนละ step |
| `#7ac87a` ×4, `#ffb4a0`, `#bbb` | สถานะ ok / error / caption | — | ยังไม่มี token คู่กันเลย |

สองทางเลือก: (ก) ขยับสีในแอปให้เท่า token — จะเห็นความต่างนิดหน่อย, (ข) เพิ่ม token ใหม่
(`--line-strong`, `--ok`, `--warn-soft`, …) ให้ค่าที่ใช้อยู่ — ไม่เปลี่ยนหน้าตาแต่ token เยอะขึ้น
**agent ห้ามเลือกเอง** เพราะทั้งคู่เปลี่ยนภาษาการออกแบบ

## รอบถัดๆ ไป

- จับหน้าตาทีละ element ให้ตรง component (Button → `.btn-*`, Chip → `.ai-chip`, Badge → `.sev`,
  Modal → `#tourOverlay`/dialog, EmptyState → empty state ของ panel grid)
- ตัดสินใจเรื่อง CDN (jsPDF + Google Fonts) กับข้อ acceptance "เปิดด้วย `file://` แล้วใช้งานได้ครบ"

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
