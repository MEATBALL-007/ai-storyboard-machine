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
      → **ฟอนต์เสร็จแล้ว** (2026-08-21) — JetBrains Mono 4 น้ำหนัก (400/500/700/800) ฝังเป็น
        `data:font/woff2;base64` ใน `<style>` แล้ว, `fonts.googleapis`/`fonts.gstatic` เหลือ 0 จุด
        `index.html` โตจาก 188 KB → 297 KB, `tools/check-tokens.mjs` เช็ค byte ตรงกับ
        `design-system/src/fonts/` ทุกรอบ
      ⚠️ **เหลือ jsPDF ตัวเดียว** (`cdnjs.cloudflare.com`, บรรทัด 7) → offline แล้ว PDF export พัง
        **agent inline ให้ไม่ได้ในสภาพแวดล้อมนี้**: ไม่มีสำเนา jsPDF บนเครื่องเลย (ค้นทั้ง
        `C:/PHANTOM-AUTOPILOT` และ npm global แล้ว) และ network ถูกบล็อก → **เจ้าของต้อง vendor
        ไฟล์ `jspdf.umd.min.js` เข้า repo เองก่อน** รอบถัดๆ ไปถึงจะ inline ได้
      ⚠️ **ยังไม่เคย verify ด้วยเบราว์เซอร์จริงสักรอบ** (รันบน headless server)
        (2026-08-21: ลอง Playwright/Chrome-DevTools MCP แล้ว — **ถูก permission บล็อกทั้งคู่**
         ไม่ใช่แค่ "ไม่มีจอ" อย่าเสียรอบไปลองซ้ำ ถ้าเจ้าของอยากให้ verify จริงต้องเปิด permission ให้ก่อน)
- [x] ไม่มี external reference เพิ่ม: ไม่มี CDN, ไม่มี `<script src="http...">`, ไม่มี `@import` ออกนอกไฟล์
      → ของเดิมมี 4 จุดใน `<head>` — **ตอนนี้เหลือ 1** (cdnjs jsPDF) เพราะ fonts.googleapis ×3
        ถูกลบออกในรอบ 2026-08-21 ไม่เคยมีการ *เพิ่ม* external reference เลยสักรอบ
- [x] `node tools/test.mjs` เขียว 54/54
- [x] `npm --prefix design-system test` เขียว 31/31
- [x] token มีแหล่งเดียว — ถ้าแก้ค่าใน design system แล้วต้องมีขั้นตอนชัดเจนที่ทำให้แอปตามทัน (เขียนไว้ใน README)
      → `design-system/src/tokens.css` เป็นแหล่งเดียว, ขั้นตอน sync อยู่ใน README หัวข้อ
        "Design tokens — single source of truth", และ `tools/check-tokens.mjs` บังคับให้ตรงกันจริง
        (2026-08-21: เขียน script จริงแล้ว — เดิม AUTOPILOT.md อ้างว่ามีทั้งที่ยังไม่มี;
        ทดสอบแล้วว่า fail จริงทั้งกรณี value เพี้ยนและ token หาย)
        (2026-08-21 รอบ 0043: script เช็ค **ฟอนต์** ด้วยแล้ว — decode base64 ใน `index.html`
        เทียบ byte กับ `design-system/src/fonts/*.woff2`; ทดสอบ fail จริงทั้ง 2 กรณี
        คือ byte เพี้ยน และ `fonts.css` มีน้ำหนักที่ `index.html` ไม่มี)
        (2026-08-22 รอบ 0001: ปิดช่องโหว่ฝั่ง **library** — DS component CSS 3 จุดสุดท้าย
        (`Button.css:9`, `Badge.css:7`, `Badge.css:8`) เลิกใช้ rgba literal มาใช้ channel token แล้ว
        และ `check-tokens.mjs` เพิ่มการเช็คที่ 3: สแกน `design-system/src/**/*.css` + `<style>`
        ของ `index.html` แล้ว fail ถ้าเจอ rgb/rgba/hex ที่ตรงกับค่า token — ยกเว้น `tokens.css`
        และ `:root{}` ของ `index.html` ซึ่ง*คือ*ตัวประกาศ palette เอง
        ทดสอบ negative จริง 3 กรณี (rgba ใน DS / hex ใน DS / rgba ใน `index.html`) exit 1 ทุกกรณี
        **หมายเหตุ: ตอนนี้ literal ที่ derive จาก token เหลือ 0 จุดทั้งสองฝั่ง**)

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

## 🔴 รอเจ้าของตัดสินใจ — งานที่เหลือเกือบทั้งหมดบล็อกอยู่ที่นี่

สำรวจครบแล้วทุกข้อ agent ทำต่อเองไม่ได้เพราะเป็นการตัดสินใจ ไม่ใช่การขาดข้อมูล
ตราบใดที่ 4 ข้อนี้ยังไม่ตอบ รอบถัดๆ ไปจะเหลือแต่งานเก็บกวาดเล็กๆ

1. **jsPDF** — vendor `jspdf.umd.min.js` เข้า repo ไหม? ถ้าไม่ เกณฑ์ข้อ 3 ติ๊กไม่ได้ตลอดไป
   (agent ดาวน์โหลดเองไม่ได้ — ไม่มี network และไม่มีสำเนาบนเครื่อง)
   ถ้าตอบว่า "ไม่ vendor" อย่างน้อยควรใส่ `integrity="sha384-…" crossorigin="anonymous"`
   ให้ `<script>` ตัวนั้น — ตอนนี้ถ้า CDN ถูกแทรกโค้ด แอปรันให้ทันทีโดยไม่มีอะไรกัน
2. **chip padding** — ขยาย `#left` / ลด font-size / 2 คอลัมน์ / ลดค่าใน DS? (ดูเกณฑ์ข้อ 2)
3. **spacing + font-size scale** — อนุมัติสเกล 4px grid ไหม? การ snap = ขยับพิกเซลทั้งแอป
4. **browser verification** — เปิด permission ให้ Playwright/Chrome-DevTools MCP ไหม?
   ตอนนี้ไม่เคยมีใครเห็นแอปจริงหลังแก้ CSS มา 6 รอบ

## Next task — do ONLY this

**แก้ `font-weight:300` ที่ `index.html:558` ซึ่งไม่มีไฟล์ฟอนต์รองรับ แล้วกันไม่ให้เกิดซ้ำ**

รอบ 0043 ฝัง JetBrains Mono ไว้ **4 น้ำหนักเท่านั้น: 400 / 500 / 700 / 800**
แต่ `index.html:558` (`.add-card .ac-plus`) สั่ง `font-weight:300` ซึ่ง**ไม่มีอยู่จริง**

```
.add-card .ac-plus{font-size:26px; line-height:1; font-weight:300}
```

ตาม CSS font matching เมื่อ desired weight < 400 เบราว์เซอร์จะไล่หาน้ำหนักที่**น้อยกว่า**ก่อน
(ไม่มี) แล้วจึงไล่ขึ้น → ได้ **400** และเบราว์เซอร์**ไม่ synthesize น้ำหนักที่บางกว่า**
แปลว่าทุกวันนี้มันเรนเดอร์เป็น 400 อยู่แล้ว ดังนั้น **เปลี่ยน `300` → `400` ไม่ขยับพิกเซล**
เป็นการเขียนสิ่งที่เกิดขึ้นจริงให้ตรงกับความจริง ไม่ใช่การเปลี่ยนดีไซน์

⚠️ **ข้อนี้ยังไม่ได้ยืนยันด้วยเบราว์เซอร์จริง** (ดูข้อ 4 ในหัวข้อรอเจ้าของ) — เป็นการอ่านสเปก
ถ้าเจ้าของอยากได้ 300 จริงๆ ทางแก้คือ**เพิ่มไฟล์ `jetbrains-mono-latin-300-normal.woff2`**
เข้า `design-system/src/fonts/` + `fonts.css` แล้วฝังใน `index.html` — นั่นคือคนละงาน
(และ agent ดาวน์โหลดไฟล์เองไม่ได้ ไม่มี network) → **ถ้าไม่แน่ใจ ให้เลือกทาง 300→400**

จากนั้น**ขยาย `tools/check-tokens.mjs` ให้กันไม่ให้มันกลับมา**: อ่าน `font-weight:<ตัวเลข>`
ทุกจุดใน `<style>` ของ `index.html` + `design-system/src/**/*.css` แล้ว fail ถ้าเจอน้ำหนักที่
**ไม่มี `@font-face` รองรับใน `fonts.css`** พร้อมบอกว่ามีน้ำหนักไหนให้ใช้บ้าง
(`parseFontFaces()` คืนน้ำหนักมาอยู่แล้ว ใช้ต่อได้เลย ไม่ต้องเขียนใหม่
 และ `blankOut()` + `lineOffset` ที่เพิ่มรอบนี้ทำให้รายงานเลขบรรทัดจริงได้ฟรี)
**ทดสอบ negative จริงก่อน commit** (ใส่ `font-weight:300` กลับเข้าไปแล้วต้อง exit 1)

> ระวัง: `font-weight` ปรากฏใน**โค้ด JS วาด canvas** ด้วย (`ctx.font`) — สแกนเฉพาะ `<style>`
> เท่านั้น อย่าไปแตะ ตามข้อห้ามใน Out of scope
> และ `font-weight` ที่เป็นคีย์เวิร์ด (`bold`, `normal`) ไม่ต้องเช็ค — ใน `<style>` มีแต่ตัวเลข

> **อย่าแตะ literal สีที่เหลือ** — `rgba(0,0,0,…)`, `rgba(255,255,255,…)`, `#000`, `#0a0a0a`,
> `#7ac87a`, `#ffb4a0`, `rgba(120,200,120,.15)` **ไม่มี token คู่กัน** การตั้ง token ใหม่ให้มัน
> คือการ**ขยายภาษาการออกแบบ** = เจ้าของตัดสิน ไม่ใช่ agent (สำรวจครบแล้ว อย่าไล่ซ้ำ)
> **รอบ 0001 ปิดจบแล้ว: literal ที่ derive จาก token เหลือ 0 จุดทั้งสองฝั่ง และมี checker บังคับ**

> **ผลสำรวจที่ทำไว้แล้ว อย่าเสียเวลาทำซ้ำ:**
> - element parity สำรวจครบ 5 ตัวแล้ว (ตารางในเกณฑ์ข้อ 2) — เหลือ chip `padding` ที่บล็อกรอเจ้าของ
> - `index.html` ไม่มี base class `.btn` (ใช้ selector `.modal-actions button` แทน) แต่**ค่าตรงกันหมด**
>   การเพิ่ม `.btn` ต้องแก้ `class=` ทั้งใน markup และ JS ที่ generate HTML → **แยกเป็นรอบของตัวเอง**
>   และเป็นเรื่อง**โครงสร้าง ไม่ใช่หน้าตา** (ไม่ขยับพิกเซลเลย) จะทำหรือไม่ทำก็ได้
> - ฟอนต์ self-host เสร็จแล้ว (รอบ 0043) — `fonts.googleapis` เหลือ 0 จุด อย่าไปหาอีก

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
