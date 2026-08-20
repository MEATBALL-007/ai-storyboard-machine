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
      → **สี: เสร็จแล้ว** (2026-08-21) — hex ที่ match token map หมดแล้ว, และ `rgba()` ที่ derive จากสี token
        20 จุดใน `<style>` เปลี่ยนเป็น `rgba(var(--accent-rgb),α)` แล้ว (accent 15 / secondary 3 / bg 2)
        hex literal ที่เหลือใน `<style>` (`#000`, `#222`, `#333`, `#fff`, `#161616`, `#151515`, `#0a0a0a`,
        `#bbb`, `#ffb4a0`, `#7ac87a`) **ไม่ตรงกับ token ตัวไหนเลย** — ไม่มีอะไรให้ map เพิ่ม
        `rgba()` ที่เหลือใน `<style>` เป็น `rgba(0,0,0,α)` / `rgba(255,255,255,α)` / เขียว — ไม่มี token คู่กัน
      → **radius: เสร็จแล้ว** (2026-08-21) — `--r-xs/sm/md/lg/xl/2xl/full` อยู่ใน `tokens.css` แล้ว
        `border-radius` literal ใน `index.html` **หมดเกลี้ยง 61 จุด** (60 ใน `<style>` + 1 inline `style=`
        บนปุ่ม export ใน body) และ component CSS ของ design system อีก 9 จุดก็ชี้มาที่ token เดียวกัน
        จำนวนต่อค่าเท่าเดิมเป๊ะทั้งก่อนและหลัง (md 32 / sm 11 / lg 5 / xl 4 / full 4 / 2xl 3 / xs 2)
        ⚠️ สเกลนี้ไล่ทีละ 1px (1,2,3,4,5,6) ซึ่งละเอียดเกินกว่าที่ radius scale ควรเป็น —
        บันทึกไว้ตามของเดิมเพราะการยุบเหลือ 3 ขั้นคือการ**เปลี่ยนดีไซน์** เจ้าของต้องเลือกเอง
      → **ยังเหลือ: spacing / typography** — `tokens.css` มี 22 token (สี 11 + channel 3 + radius 7 + `--mono`)
- [ ] element พื้นฐานในแอป (ปุ่ม, chip, badge, modal, empty state) หน้าตาตรงกับ component ที่มีชื่อเดียวกันใน design system
      → **สำรวจครบทั้ง 5 ตัวแล้ว (2026-08-21) — เหลือ delta จริงแค่ 1 จุดเดียว**
        | app | DS | ผล |
        |---|---|---|
        | `.btn-primary` / `.btn-ghost` / `.icon-btn` / `.tab-btn` | `Button.css` | ✅ ตรงทุกค่า |
        | `.chip` (บรรทัด ~100) | `Chip.css` | ⚠️ เหลือ `padding` — **บล็อกอยู่ รอเจ้าของตัดสิน** |
        | `.pc-badge` (บรรทัด ~189) | `.pui-badge` + `--accent` | ✅ ตรงทุกค่า |
        | `.modal-bg` / `.modal` (บรรทัด ~304) | `Modal.css` | ✅ ตรงทุกค่า |
        | `.empty-state` (บรรทัด ~224) | `EmptyState.css` | ✅ ตรงทุกค่า |
        badge / modal / empty-state ต่างจาก DS แค่ `font-family:var(--mono)` (+ `color:var(--text)` ใน modal)
        ซึ่ง **`body` set ให้อยู่แล้วและไม่มีอะไรมา override** → render เหมือนกันเป๊ะ ไม่ต้องแก้
        ต่างแค่**ชื่อ class** (`.pc-badge` vs `.pui-badge--accent`) ซึ่งไม่ใช่เรื่องหน้าตา
        `.chip` รับ `cursor:pointer` + `font-family:var(--mono)` ไปแล้ว เหลือ `padding` อย่างเดียว
        ⚠️ **`padding:6px 10px` ของ DS ใส่ไม่ได้ — sidebar แคบเกิน** (คำนวณละเอียดใน README
        หัวข้อ "Element parity with Phantom UI"): track กว้าง ~41.75px แต่ `16:9` ต้องการ 46px
        และ `1fr` = `minmax(auto,1fr)` หดต่ำกว่า min-content ไม่ได้ → grid จะดันจนเกิด scrollbar แนวนอน
        **padding-x สูงสุดที่ปลอดภัยคือ 7px** ทางเลือกคือ ขยาย `#left` / ลด font-size / ใช้ 2 คอลัมน์ /
        ลดค่าใน DS — ทุกทาง**ขยับพิกเซล** จึงเป็นการตัดสินใจของเจ้าของ ไม่ใช่ของ agent
- [ ] เปิด `index.html` ด้วย `file://` (ดับเบิลคลิก) แล้วยังใช้งานได้ครบ — ไม่ต้อง build ไม่ต้อง serve
      ⚠️ **ยังไม่เคย verify ด้วยเบราว์เซอร์จริงสักรอบ** (รันบน headless server) และ jsPDF/Google Fonts
        โหลดจาก CDN อยู่ (ของเดิม ไม่ใช่ของใหม่) → offline จริงๆ PDF export จะพัง ต้องตัดสินใจว่าจะ inline หรือยอมรับ
        (2026-08-21: ลอง Playwright/Chrome-DevTools MCP แล้ว — **ถูก permission บล็อกทั้งคู่**
         ไม่ใช่แค่ "ไม่มีจอ" อย่าเสียรอบไปลองซ้ำ ถ้าเจ้าของอยากให้ verify จริงต้องเปิด permission ให้ก่อน)
- [x] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
      → ของเดิมมี 4 จุดใน `<head>` (fonts.googleapis ×3, cdnjs jsPDF ×1) และยังไม่มีการเพิ่ม
- [x] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว 31/31
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      → `design-system/src/tokens.css` เป็นแหล่งเดียว, ขั้นตอน sync อยู่ใน README หัวข้อ
        "Design tokens — single source of truth", และ `tools/check-tokens.mjs` บังคับให้ตรงกันจริง
        (2026-08-21: เขียน script จริงแล้ว — เดิม AUTOPILOT.md อ้างว่ามีทั้งที่ยังไม่มี;
        ทดสอบแล้วว่า fail จริงทั้งกรณี value เพี้ยนและ token หาย)

## Verify

```
node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test
```

## ⚠️ อ่านก่อนเริ่มทุกรอบ — branch ถูกตัดจาก base เก่า

runner ตัด branch `auto/…` **ทุกอันจาก commit เดียวกันคือ `3503537`** ไม่ได้ตัดต่อจากรอบก่อน
และ `main` ยังอยู่ที่ `ef3220e` (2 commits, ไม่มีทั้ง design-system และงาน token เลย)
แปลว่า **งานของรอบก่อนจะไม่อยู่ใน branch ของคุณ** ทั้งที่ AUTOPILOT.md ที่คุณได้รับถูก
generate มาจาก branch ของรอบก่อน — ไฟล์อย่าง `tools/check-tokens.mjs` จะหายไปเฉยๆ
ทำให้ Verify command ของตัวเองรันไม่ได้

**สิ่งที่ต้องทำเป็นอย่างแรกของทุกรอบ:** `git log --oneline -5` แล้วเทียบกับ AUTOPILOT.md
ถ้า base ไม่ตรงกับที่ contract อ้าง ให้ดึงงานรอบก่อนมาก่อน (รอบนี้ใช้
`git checkout <sha> -- <paths>` เพราะ `git cherry-pick` ถูก permission บล็อก)
แล้ว commit แยกไว้ต่างหาก **ก่อน**เริ่มงานจริง

> เจ้าของควรแก้ที่ runner: ให้ตัด branch ต่อจากรอบก่อน หรือ merge PR เข้า `main` ให้ทัน
> ตอนนี้มี 27 branch ที่ค้างอยู่และซ้อนทับกันเอง

## Out of scope

- **ห้ามแปลง `index.html` เป็น React และห้ามเพิ่ม build step / bundler / npm dependency ให้แอป**
- **ห้ามแยก `index.html` ออกเป็นหลายไฟล์** — การเป็นไฟล์เดียวคือตัวโปรเจค ไม่ใช่ข้อจำกัดชั่วคราว
- **ห้ามแตะ marker `// ==PURE-LOGIC-START==` / `==PURE-LOGIC-END==` / `==TESTS-START==` / `==TESTS-END==`**
  — `tools/test.mjs` ดึงโค้ดออกมาด้วย marker เหล่านี้ ถ้า marker หายหรือย้าย test runner จะ throw ทันที
- ห้ามลบหรือปิดเทสต์เพื่อให้ผ่าน
- ห้ามแตะ `storyboard-simulator.html` ในรอบนี้
- **ห้ามแทน `rgba()`/hex ที่อยู่ในโค้ด JS วาด canvas ด้วย `var()`** — `ctx.fillStyle` ไม่รู้จัก
  CSS custom property จะกลายเป็นสีดำเงียบๆ (literal ในโค้ด canvas บรรทัด ~1346–1741, ~3092–3195 ตั้งใจไว้แบบนั้น)

## Next task — do ONLY this

**ย้าย JetBrains Mono มา self-host ใน `index.html`** (เอา `fonts.googleapis` 3 บรรทัดออก)

ตอนนี้ **ตัวอักษรมี 2 แหล่ง**: DS self-host `.woff2` อยู่ใน `design-system/src/fonts/`
แต่ `index.html` ดึงจาก Google Fonts CDN (บรรทัด 7–9) — นี่คือการละเมิดเป้าหมาย
"แก้ที่เดียวแล้วเปลี่ยนทั้งระบบ" ที่ยังเหลืออยู่จุดสุดท้าย และเป็นสาเหตุที่**เกณฑ์ข้อ 3
(เปิดด้วย `file://` แล้วใช้งานได้ครบ) ยังติ๊กไม่ได้** — offline แล้วแอปจะ fallback
ไปฟอนต์ระบบ ซึ่ง**เปลี่ยนความกว้างตัวอักษรจริง** (ดูเรื่อง chip padding ข้างบน — งบความกว้าง
ตึงระดับ 0.25px การเปลี่ยนฟอนต์คือการเปลี่ยน layout)

วิธีทำ:
1. อ่านไฟล์ 4 ตัวใน `design-system/src/fonts/` (400/500/700/800, รวม 86,144 bytes)
   แปลงเป็น base64 แล้วฝังเป็น `@font-face` + `src:url(data:font/woff2;base64,…) format('woff2')`
   ใน `<style>` ของ `index.html` — ดู `design-system/src/fonts.css` เป็นแม่แบบ ใช้ `font-display:swap`
   และ `unicode-range` ให้ตรงกับของเดิม
2. ลบบรรทัด 7–9 (`preconnect` ×2 + `fonts.googleapis` ×1) ออกจาก `<head>`
3. **อย่าแตะบรรทัด 10 (jsPDF CDN)** — การ inline jsPDF เป็นคนละเรื่องและใหญ่กว่ามาก
   ให้แยกเป็นรอบของตัวเอง เกณฑ์ข้อ 3 จะยังติ๊กไม่ได้จนกว่าจะจัดการอันนั้น ให้บันทึกไว้เฉยๆ
4. verify ครบ 3 คำสั่ง + `grep -c "fonts.googleapis" index.html` ต้องได้ 0

> **ผลกระทบด้านขนาดที่ต้องยอมรับ:** `index.html` จะโตจาก **188 KB → ~303 KB**
> (base64 พองขึ้น ~33%) ถ้าคิดว่าแพงเกินไป ทางเลือกคือฝังเฉพาะ **400 + 700**
> (เหลือ ~245 KB) แล้วปล่อยให้ 500/800 synthesize เอา — **ให้บันทึกทางเลือกไว้ใน SUMMARY
> อย่าตัดสินใจเงียบๆ** ถ้าเลือกฝังไม่ครบ ต้องเช็คว่าที่ไหนใช้ `font-weight:500/800` บ้าง

> **ผลสำรวจที่ทำไว้แล้ว อย่าเสียเวลาทำซ้ำ:**
> - element parity สำรวจครบ 5 ตัวแล้ว (ตารางในเกณฑ์ข้อ 2) — เหลือ chip `padding` ที่บล็อกรอเจ้าของ
> - `index.html` ไม่มี base class `.btn` (ใช้ selector `.modal-actions button` แทน) แต่**ค่าตรงกันหมด**
>   การเพิ่ม `.btn` ต้องแก้ `class=` ทั้งใน markup และ JS ที่ generate HTML → **แยกเป็นรอบของตัวเอง**
>   และเป็นเรื่อง**โครงสร้าง ไม่ใช่หน้าตา** (ไม่ขยับพิกเซลเลย) จะทำหรือไม่ทำก็ได้
> - DS component CSS ยังมี rgba literal 3 จุดที่ควรใช้ channel token
>   (`Button.css:9`, `Badge.css:7`, `Badge.css:8`) — งานเล็ก เก็บพ่วงรอบไหนก็ได้

> **spacing / font-size: อย่าเพิ่งทำ tokenization** — สำรวจแล้วพบว่าเป็น *continuum* ไม่ใช่ scale
> `padding` ใช้เกือบทุกค่าตั้งแต่ 1–12px (+16/20/24/80), `gap` ใช้ 3,4,5,6,7,8,12,14,24
> `font-size` ไล่ทีละ 0.5px จาก 7 ถึง 13 (11 ค่า) แล้วกระโดดไป 14/15/16/18/26/40
> map 1:1 จะได้ token ~16 ตัวที่ไม่ได้ให้ประโยชน์อะไรนอกจากตั้งชื่อ ส่วนการ snap เข้า 4px grid
> **ขยับพิกเซล** = การตัดสินใจด้านดีไซน์ → ต้องให้เจ้าของอนุมัติสเกลก่อน ค่อยลงมือ
> (`font-family` ตอนนี้ใช้ `var(--mono)` ครบทั้ง 4 จุดแล้ว ไม่มีอะไรเหลือ)

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
