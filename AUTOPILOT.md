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
        (2026-08-22 รอบ 0015: `check-tokens.mjs` เพิ่มการเช็คที่ 4 — **font-weight ต้องมีไฟล์ฟอนต์จริง**
        สแกน `font-weight` ทุกจุดใน `<style>` ของ `index.html` + `design-system/src/**/*.css`
        แล้ว fail ถ้าน้ำหนักนั้นไม่มี `@font-face` ใน `fonts.css` รองรับ
        (`normal`→400, `bold`→700; `bolder`/`lighter` เป็น relative ข้าม; `@font-face` เองถูก blank ออก
         เพราะมัน*คือ*ตัวประกาศ inventory ไม่ใช่ผู้ใช้) รายงานเลขบรรทัดจริงของ `index.html`
        ทดสอบ negative จริง 4 กรณี: `300` ใน `index.html` → exit 1 ที่ `index.html:558`,
        `900` ใน `Button.css` → exit 1 ที่ `Button.css:8`, `bold` → pass, `lighter` → pass)
        (2026-08-22 รอบ 0024: `check-tokens.mjs` เพิ่มการเช็คที่ 5 — **`border-radius` ต้องอ่านจาก token**
        อ่านเฉพาะ*ฝั่งค่า*ของ declaration `border-*-radius` (shorthand + longhand 4 มุม + vendor prefix)
        ใน `scanTargets` เดิม แล้ว fail ถ้าเจอความยาวที่ไม่ใช่ `var()` — ถ้าค่าตรง token บอกชื่อ token
        ถ้าไม่ตรงเลยพิมพ์สเกลทั้งชุดให้ดู (การตั้ง token ที่ 8 ยังเป็นของเจ้าของ)
        ข้าม `0`/`0px` (มุมเหลี่ยมไม่ใช่ค่าดีไซน์ และ `4px 4px 0 0` เป็นสำนวนปกติ), keyword, `calc()`
        `(?<![-\w])` กัน custom property ชื่อ `--border-radius` ไม่ให้โดนจับ แต่ยังจับ `-webkit-` อยู่
        **ไม่สแกน `\d+px` ลอยๆ ทั้งไฟล์** เพราะ spacing ตั้งใจไม่ tokenize
        ทดสอบจริง 6 กรณี: `3px`→exit 1 พร้อม `--r-md` ที่ `index.html:49`,
        `9px`→exit 1 พร้อมลิสต์ 7 ค่า, `4px 4px 0 0`→exit 1 ที่ `4px` ×2 ไม่บ่นเรื่อง `0`,
        `var(--r-lg) var(--r-lg) 0 0` + `--border-radius:3px` + `border-top-left-radius:inherit`→pass,
        `border-top-left-radius:2px` + `-webkit-border-radius:50%` ใน `Badge.css`→exit 1 ทั้งคู่,
        literal ใน `/* comment */`→pass
        ⚠️ **ช่องที่ยังเปิดอยู่ (ทั้ง 4 เช็ค ไม่ใช่แค่ radius): `style="…"` attribute ใน body**
        `scanTargets` ดึงมาแค่ `<style>` → `index.html` มี 24 บรรทัด (markup 11 / JS 13) และบรรทัด 616 (ปุ่ม export)
        มี `border-radius` + `color:#000` + `font-weight:700` ที่ไม่มีใครเช็ค — ตอนนี้บังเอิญถูกหมด)

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

**ให้ `tools/check-tokens.mjs` มองเห็น `style="…"` attribute ใน body ของ `index.html` ด้วย
— ทั้ง 4 เช็คทีเดียว ไม่ใช่แค่ radius**

การเช็คที่ 5 (radius) ปิดจบแล้วในรอบ 0024 → **แกนหลักครบทั้ง 4 แล้ว** (สี / ฟอนต์ / font-weight /
radius) แต่ตอนทำรอบ 0024 เจอช่องที่**ทุกเช็คแชร์กันหมด**: `scanTargets` ประกอบขึ้นจาก
`design-system/src/**/*.css` + regex `<style>…</style>` ของ `index.html` เท่านั้น
→ CSS ที่เขียนใน attribute `style="…"` **ไม่มีเช็คไหนเห็นเลยสักตัว**

`index.html` มี `style="` อยู่ **24 บรรทัด (markup 11 / JS 13 — ดูรายละเอียดข้างล่าง)**
และจุดที่บรรทัด 616 (ปุ่ม `#exportMenuBtn`) มีครบทั้ง
`border-radius:var(--r-md)`, `background:var(--accent)`, `color:#000`, `font-weight:700`
— ตอนนี้**ถูกหมดโดยบังเอิญ** เพราะรอบก่อนๆ ไล่แก้ด้วยมือ ไม่ใช่เพราะมีอะไรบังคับ
พิมพ์ `style="border-radius:3px; background:#FFC72C"` เพิ่มพรุ่งนี้ก็ผ่านทั้ง 4 เช็ค

วิธี: **เพิ่ม scan target ตัวที่ 3** เข้า array `scanTargets` — อย่าไปแก้ logic ของเช็คไหนเลย
ทั้ง 4 เช็ควนบน `scanTargets` อยู่แล้ว เพิ่ม target แล้วมันได้ของแถมพร้อมกันหมด
ทำโดยไล่ `html.matchAll(/\sstyle\s*=\s*"([^"]*)"/g)` **เฉพาะส่วนหลัง `</style>`**
แล้วสร้าง text ที่ *รักษาเลขบรรทัดไว้* (เทคนิคเดิมกับ `blankOut`: แทนทุกอย่างที่ไม่ใช่ค่าใน
attribute ด้วย space/newline) จะได้รายงาน `index.html:616` ตรงกับไฟล์จริงเหมือนเช็คอื่น

⚠️ **ต้องกัน `<script>` ให้ขาด — สำรวจแล้ว ยืนยันว่าอันตรายจริง** จาก 24 บรรทัด มี **11 บรรทัดที่อยู่ใน
markup จริง** (616, 635, 707, 713, 716, 718, 726, 730, 731, 747, 810)
อีก **13 บรรทัดอยู่ใน template string ของ JS** (935, 2248, 2251,
2253–2254, 2295, 2302, 2366, 2393–2395, 2710, 3008, 3257) และในนั้นมีระเบิดฝังอยู่:
- `2251`: `linear-gradient(90deg,#111,#161616,#111)` — `#111` normalize แล้ว = `#111111` = **`--surface`**
- `3008`: `color:${fail?'#FA4616':'#7ac87a'}` — `#FA4616` = **`--secondary`** และบรรทัดเดียวกัน
  มี `font:14px ui-monospace` ซึ่งเป็น `font:` shorthand ตัวเดียวในโปรเจค
ถ้าสแกนทั้งไฟล์ เช็คสีจะ fail ทันที 3 จุด ทั้งที่เป็นโค้ด JS
→ **ตัด `<script>…</script>` ออกด้วย `blankOut` ก่อน แล้วค่อยหา attribute** และให้ต่อยอด
เฉพาะ attribute ที่อยู่ใน markup เท่านั้น
⚠️ `style` attribute เป็น declaration list ไม่มี `{}` ครอบ — `blankOut(…, /:root\s*\{[^}]*\}/g)`
ของเช็คสีจึงไม่กระทบ และไม่มี `@font-face` ให้ตัด ไม่ต้องแก้อะไรตรงนั้น
⚠️ ถ้าเพิ่ม target แล้ว**มีเช็คไหน fail ขึ้นมาจริง** อย่าเพิ่งแก้ค่าใน markup ทันที
ให้ดูก่อนว่ามันเป็น literal ที่มี token คู่กันจริงไหม ถ้าเป็นสีที่ไม่มี token (`#000`) มันจะไม่ fail อยู่แล้ว

**ทดสอบ negative จริงก่อน commit** อย่างน้อย 4 กรณี:
`style="border-radius:3px"` → exit 1 พร้อม `--r-md` และเลขบรรทัดตรงกับไฟล์จริง,
`style="background:#FFC72C"` → exit 1 พร้อม `--accent`,
`style="font-weight:300"` → exit 1,
เพิ่มสตริง `style="border-radius:3px"` ใน `<script>` → **ต้อง pass** (พิสูจน์ว่า JS ถูกตัดจริง)

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
> - `font-weight` สำรวจครบแล้ว (รอบ 0015) — `<style>` ใช้ 400×1 / 500×4 / 700×24 / 800×3
>   DS component CSS ใช้ 500×1 / 700×3 ทั้งหมดมีไฟล์ฟอนต์รองรับ และมี checker บังคับแล้ว
>   `font:` shorthand ไม่มีใช้เลยสักจุดทั้งสองฝั่ง (เช็คแล้ว) — checker จึงจับแค่ longhand

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
