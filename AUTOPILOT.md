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
        (2026-08-22 รอบ 0036: **ปิดช่อง `style="…"` attribute แล้ว** — เพิ่ม scan target ตัวที่ 3
        เข้า `scanTargets` (ไม่แตะ logic ของเช็คไหนเลย) → ทั้ง 4 เช็คได้ coverage พร้อมกันหมด
        สร้าง text ด้วยการ blank ทุกอย่างเป็น space แล้ว splice *เฉพาะเนื้อใน* attribute กลับที่ offset เดิม
        → เลขบรรทัดตรงกับไฟล์จริง (`lineOffset:0`) เหมือนเช็คอื่น
        **blank `<script>` ก่อนหา attribute — จำเป็นจริง ไม่ใช่ความสะอาด**: JS สร้าง markup จาก
        template string และมี `#111` (=`--surface`) กับ `#FA4616` (=`--secondary`) อยู่ในนั้น
        ถ้าสแกนทั้งไฟล์ เช็คสีจะ fail ใส่โค้ด JS ที่ไม่ได้ผิดอะไร
        นับ scan target 14 → 15, ข้อความรายงานเปลี่ยน "stylesheet(s)" → "CSS source(s)"
        ทดสอบ negative จริง 5 กรณี: `border-radius:3px` ใน attr→exit 1 พร้อม `--r-md` ที่ `index.html:635`,
        `#FFC72C` + `rgba(250,70,22,.4)` ใน attr→exit 1 ทั้งคู่, `font-weight:300` ใน attr→exit 1,
        ทั้ง 3 อย่างใน `<script>`→**pass** (พิสูจน์ว่า JS ถูกตัดจริง),
        `border-radius:3px` ที่บรรทัด 810 + `#FFC72C` ใน `title=` และใน text ของ body→exit 1 เฉพาะ radius
        (พิสูจน์ว่าอ่านแค่เนื้อใน `style=` และ offset ตรงแม้ห่างจากจุดอื่น))

        (2026-08-22 รอบ 0048: `check-tokens.mjs` เพิ่มการเช็คที่ 6 — **`font-family` ต้องอ่าน `var(--mono)`**
        วนบน `scanTargets` เดิม (15 target ไม่เพิ่ม) blank `@font-face{…}` ทิ้งก่อน แล้ว fail ถ้าฝั่งค่า
        ไม่ใช่ `var(--mono)` เป๊ะๆ — **ไม่รับแม้แต่ `var(--mono), monospace`** เพราะ fallback list
        ต้องอยู่ใน token ที่เดียว `(?<![-\w])` กัน custom property ชื่อ `--font-family`
        อ่านเฉพาะ longhand — `font:` shorthand จะรอดสายตา (วันนี้ไม่มีในสไตล์ชีต มีจุดเดียวใน `<script>`)
        **ไม่ต้องแก้ CSS สักบรรทัด** — 17 จุดในขอบเขตใช้ token ครบอยู่แล้ว เป็น regression guard ล้วน
        ทดสอบจริง 5 กรณี: literal ใน `<style>`→exit 1 ที่ `index.html:522`,
        `font-family:monospace` ใน `Badge.css`→exit 1 ที่ `Badge.css:3`,
        literal ใน `style=` attribute→exit 1 ที่ `index.html:635`,
        `--font-family:'Nope'` บรรทัดเดียวกับกรณีที่ 2→**ไม่ถูกจับ** (lookbehind ทำงาน),
        literal ใน template string ของ `<script>`→**pass** (พิสูจน์ว่า `scanTargets` ไม่เห็น JS))

      ✅ **ตอนนี้ token ทั้ง 22 ตัวมี checker ครบแล้ว** (สี 11 + channel 3 + radius 7 + `--mono` 1)
        → **งาน tooling ฝั่ง token จบแล้ว** รอบถัดไปไม่ควรเพิ่มเช็คที่ 7 เพราะไม่เหลืออะไรให้บังคับ

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

**ย้ายรายการ "รอเจ้าของตัดสินใจ" 4 ข้อ ออกจาก `AUTOPILOT.md` ไปไว้ใน `README.md`
เป็นหัวข้อ `## Open decisions` แล้วให้หัวข้อ 🔴 ด้านบนเหลือแค่ลิงก์ชี้ไปที่นั่น**

เหตุผล: เกณฑ์ที่ยังไม่ติ๊ก 3 ข้อ **บล็อกที่เจ้าของทั้งหมด ไม่ใช่ที่ agent** และงาน tooling
ฝั่ง token จบครบแล้ว (เช็ค 1–6 คุม token ทั้ง 22 ตัว) รอบถัดๆ ไปจึงไม่มีอะไรเดินต่อได้จริง
จนกว่าจะมีคำตอบ — แต่ตอนนี้คำถามอยู่ใน `AUTOPILOT.md` ซึ่งเป็น**เอกสารสัญญาของ runner**
ที่เขียนทับทุกรอบและเจ้าของไม่ได้เปิดอ่านตามปกติ ส่วน `README.md` คือหน้าแรกของ repo
จึงไม่ใช่การทำสำเนาซ้ำ แต่คือการย้ายคำถามไปวางตรงที่คนตอบมองเห็น

เนื้อหาที่ต้องย้าย (**สำรวจครบแล้วทุกข้อ ห้ามไล่สำรวจซ้ำ** ดึงจากหัวข้อ 🔴 ด้านบน + README เดิม):
1. **jsPDF** — vendor เข้า repo ไหม? ถ้าไม่ อย่างน้อยใส่ `integrity=`/`crossorigin=` (เกณฑ์ข้อ 3)
2. **chip `padding`** — `6px 10px` ของ DS ใส่ไม่ได้เพราะ track แคบไป 4.25px (เกณฑ์ข้อ 2)
3. **spacing + font-size scale** — อนุมัติ 4px grid ไหม? การ snap = ขยับพิกเซลทั้งแอป (เกณฑ์ข้อ 1)
4. **browser verification** — เปิด permission ให้ Playwright / Chrome-DevTools MCP ไหม? (เกณฑ์ข้อ 3)

แต่ละข้อต้องเขียนให้ **ตัดสินใจได้จบในตัว**: อะไรถูกบล็อกอยู่, ทางเลือกมีอะไรบ้าง,
แต่ละทางแลกอะไร, และถ้าตอบแล้ว agent เดินต่อได้ยังไง — เจ้าของไม่ควรต้องไปขุด SUMMARY เก่า

⚠️ **เป็นงานเอกสารล้วน ห้ามแตะ `index.html`, CSS หรือ `tools/` แม้แต่บรรทัดเดียว**
⚠️ อย่าเพิ่ม**เช็คที่ 7** — token ครบทั้ง 22 ตัวแล้ว ไม่เหลืออะไรให้บังคับ
⚠️ **อย่า*ตอบ*คำถามทั้ง 4 ข้อเอง** — ทุกข้อขยับพิกเซลหรือเพิ่มไฟล์เข้า repo = สิทธิ์ของเจ้าของ

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
> (`font-family` ใช้ `var(--mono)` ครบแล้วทุกจุด — `index.html` 5 จุด + DS component CSS 12 จุด
> นับใหม่ในรอบ 0036; ตัวเลข "4 จุด" ที่เคยเขียนไว้นับพลาด — ไม่มีค่าให้แก้ เหลือแค่ยังไม่มี checker)

---

## Portfolio (สำหรับ registry.csv)

- **title:** AI Storyboard Machine
- **lens:** creative;systems
- **pitch:** เว็บแอปไฟล์เดียวที่แปลงบทหนังเป็น storyboard พร้อมภาพร่างบน canvas และ export PDF
- **problem:** ทำ storyboard ก่อนถ่ายจริงใช้เวลานาน และเครื่องมือส่วนใหญ่ต้องสมัครสมาชิก/ต่อเน็ต
- **outcome:** ไฟล์เดียว 187 KB เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
