# AUTOPILOT

## Goal

โปรเจคนี้มีสองส่วนที่ยัง**ไม่เชื่อมกัน**: `index.html` คือแอปจริง (vanilla, ไฟล์เดียว 4,034 บรรทัด,
54 tests ผ่าน) ส่วน `design-system/` คือ component library ที่สร้างขึ้นเมื่อ 20 ก.ค. (React + TS,
11 components, 31 tests ผ่าน) — ปัจจุบัน `index.html` **ไม่อ้างถึง design system เลยแม้แต่จุดเดียว**
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
      → **สำรวจครบ 11 จาก 11 component แล้ว (2026-08-21 → 2026-08-23 รอบ 0103)
        เหลือ delta จริง 3 จุด (chip padding / segmented padding / input size) ทั้งหมดรอเจ้าของ
        decision 2 / 5 / 6 ตามลำดับ — ไม่มี component ไหนเหลือให้สำรวจอีกแล้ว**
        | app | DS | ผล |
        |---|---|---|
        | `.btn` + `.btn--primary/--ghost/--icon/--tab` | `Button.css` | ✅ ตรงทุกค่า **และโครงสร้างตรงแล้ว** (2026-08-23) |
        | `.chip` (บรรทัด ~100) | `Chip.css` | ⚠️ เหลือ `padding` — **บล็อกอยู่ รอเจ้าของตัดสิน** |
        | `.pc-badge` (บรรทัด ~189) | `.pui-badge` + `--accent` | ✅ ตรงทุกค่า |
        | `.modal-bg` / `.modal` (บรรทัด ~304) | `Modal.css` | ✅ ตรงทุกค่า |
        | `.empty-state` (บรรทัด ~224) | `EmptyState.css` | ✅ ตรงทุกค่า |
        | `.menu-pop` / `.menu-pop button` / `.mh` (บรรทัด ~404) | `Menu.css` | ✅ ตรงทุกค่า (2026-08-23 รอบ 0047) |
        | `.seg` + `.dn-toggle`/`.col-toggle`/`.ovl-toggle` (บรรทัด ~182) | `SegmentedToggle.css` | ⚠️ base ตรง แต่ 2 กลุ่ม override `padding` — **บล็อกอยู่ รอเจ้าของ (decision 5)** |
        | `#toast` / `.on` / `.err` / `.toast-act` (บรรทัด ~349) | `Toast.css` | ✅ ตรงทุกค่า (2026-08-23 รอบ 0103) |
        | `.sw` / `.sw .lab` (บรรทัด ~158) | `Swatch.css` | ✅ ตรงทุกค่า — declaration ชุดเดียว ไม่มีอะไรให้ยุบ |
        | `.toggle-row` / `.toggle-row input` (บรรทัด ~473) | `Toggle.css` | ✅ ตรงทุกค่า (+ `margin-top:6px` ที่ DS ปล่อยให้ consumer จัด) |
        | `.fld` / `.fld label` / `input.ti`,`select.ti` (บรรทัด ~106) | `Field.css` | ⚠️ `.ti` ตรงเป๊ะ แต่แอปมี input **4 ขนาด** — **บล็อกอยู่ รอเจ้าของ (decision 6)** |
        (2026-08-23 รอบ 0103: **สำรวจ 4 ตัวสุดท้ายจบ — ปิดตารางที่ 11/11**
         Toast/Swatch/Toggle ตรงทุกค่าอยู่แล้ว ต่างแค่ `font-family:var(--mono)` ที่ `body` set ให้
         → **ไม่มีอะไรให้ยุบ** ทั้งสามตัวมี declaration ชุดเดียวอยู่แล้วเหมือน `.menu-pop`
         สิ่งเดียวที่ยุบได้จริงคือ `.pui-toast__action` ซึ่งแอปเขียนเป็น **inline `style=` ใน
         template string ของ JS** → ย้ายมาเป็น `.toast-act` ใน `<style>` แล้ว
         **สำคัญ: จุดนั้นเป็น token reference จุดเดียวในทั้ง repo ที่ไม่มี checker เห็น**
         เพราะ `check-tokens.mjs` blank `<script>` ทิ้งก่อนสแกน `style=` attribute
         ไม่รับ `margin-left:8px` ของ DS เพราะแอปใช้ `" · "` คั่นแทน → รับมาแล้วขยับพิกเซล
         พิสูจน์ด้วย `docs/btn-parity-proof.mjs toast`: 1 element × 5 state ต่างกัน 0 จุด
         harness เพิ่ม `beforeInline`/`afterInline` + phase ใหม่ที่ fail ถ้า inline style ไม่หายจริง
         negative test 3 กรณี: สีเพี้ยน → FAIL 5 decl, ลบ class ออก → markup FAIL,
         ทิ้ง inline ไว้ทั้งที่ใส่ class แล้ว → markup FAIL
         ⚠️ **2 กรณีหลัง cascade diff รายงาน 0 จุด** — phase markup เป็นด่านเดียวที่จับได้
         รัน `buttons` + `segmented` ซ้ำหลังแก้ harness → PASS ทั้งคู่
         `Field.css` มี `.pui-field__hint` ที่ **แอปไม่มีของคู่** (`.kbd-hint`/`.pd-edit-hint`/
         `.apikey-note` คนละขนาดคนละที่) → บันทึกว่าไม่มี ไม่สร้าง element ใหม่ในแอป
         🐛 **เจอบั๊กจริงจากการเทียบ: ปุ่ม Undo ใน toast กดไม่ได้** — `#toast` ตั้ง
         `pointer-events:none` ซึ่ง**เป็น property ที่ inherit** ลงไปถึง span ข้างใน และ
         `.toast-act` ไม่ได้ตั้ง `pointer-events:auto` กลับ → `onclick` ใน `toastUndo()` ไม่เคยยิง
         (ยัง undo ได้ด้วย `Cmd/Ctrl+Z` ซึ่งเป็นคนละ path) **ไม่ได้แก้ในรอบนี้** เพราะเป็น
         behaviour change และรอบนี้อ้างว่า "ไม่ขยับอะไรเลย" → ทำเป็น Next task)
        ✅ **แก้แล้ว รอบ 2026-08-24_0003** — `.toast-act` เติม `pointer-events:auto` **จุดเดียว**
         `#toast` ยังตั้ง `pointer-events:none` ไว้เหมือนเดิม (ถอดออก = toast บังคลิกทั้ง 80vw นาน 5 วิ)
         พิสูจน์ด้วย key ใหม่ `docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html`
         → `#toast` **ไม่ต่างเลยสักจุดทั้ง 5 state** (นี่คือหลักฐานว่าไม่ได้ถอด `none` ออก)
         และ `#toastUndo` ต่าง **property เดียว** (`pointer-events` `(unset)`→`auto`) × 5 state = 5
         harness ขึ้น `FAIL — 5 declaration(s) differ` **ซึ่งเป็นผลที่ถูกต้องของรอบนี้**
         (รอบนี้*ตั้งใจ*เปลี่ยนพฤติกรรม — key `toast-hit` มีไว้ให้เห็นว่าเปลี่ยนอะไรบ้าง ไม่ได้มีไว้ให้ PASS)
         negative test 2 กรณี: ถอด `pointer-events:none` ออกจาก `#toast` → 5→10 (แถว `#toast` ทำงานจริง),
         เปลี่ยนสี `.toast-act` เป็น `--secondary` → 5→10
         ⚠️ **phase markup coverage รอบนี้ว่างเปล่า** (`0 old class tokens gone, 0 new class attributes`)
         เพราะไม่มี class ไหนขยับเลย → รอบนี้มันไม่ได้พิสูจน์อะไร อย่านับเป็นหลักฐาน
         ⚠️ **harness ไม่ได้ model inheritance** — `none` ของ `#toast` ไม่เคยโผล่ในตารางของลูก
         ซึ่งการ inherit *คือ*กลไกของบั๊กนี้ทั้งหมด → ส่วนนั้นพิสูจน์จาก source + spec เท่านั้น
         ⚠️ **ยังไม่ได้กดจริงในเบราว์เซอร์** (decision 4 ยังไม่ได้รับอนุญาต))
        badge / modal / empty-state ต่างจาก DS แค่ `font-family:var(--mono)` (+ `color:var(--text)` ใน modal)
        ซึ่ง **`body` set ให้อยู่แล้วและไม่มีอะไรมา override** → render เหมือนกันเป๊ะ ไม่ต้องแก้
        ต่างแค่**ชื่อ class** (`.pc-badge` vs `.pui-badge--accent`) ซึ่งไม่ใช่เรื่องหน้าตา
        `.chip` รับ `cursor:pointer` + `font-family:var(--mono)` ไปแล้ว เหลือ `padding` อย่างเดียว
        (2026-08-23 รอบ 0027: **ปุ่มยุบมาอยู่บน base `.btn` + modifier `.btn--*` แล้ว** เหมือน
         `.pui-btn` + `--primary/--ghost/--icon/--tab` — `.modal-actions button` descendant selector
         หายไป, `padding`/`font-size` ย้ายมาอยู่บน modifier เหมือนฝั่ง DS, และ `.tour-skip`/`.tour-back`/
         `.tour-next` ที่เคยประกาศสไตล์ ghost/primary ซ้ำอีกชุด กลายเป็น `.btn--ghost`/`.btn--primary`
         ⚠️ **base ของแอปบางกว่า `.pui-btn` โดยตั้งใจ** — DS ตั้ง `display:inline-flex; gap:6px;
         letter-spacing:.4px; transition:.12s; border:1px solid transparent` ด้วย แต่แอปมี
         `button{}` element reset ที่ DS ไม่มี (`border:none`, display เป็น `inline-block`)
         → ลอกมาทั้งชุด = ปุ่มใน modal โตขึ้น 2px ทุกด้านและเปลี่ยน layout mode = **ขยับพิกเซล**
         การรับ 5 บรรทัดนั้นเป็น**การตัดสินใจด้านดีไซน์ของเจ้าของ** ไม่ใช่ refactor
         พิสูจน์ว่าไม่ขยับพิกเซลด้วย `docs/btn-parity-proof.mjs` — สร้าง declaration set ที่ชนะ
         cascade ของปุ่มแต่ละตัวจาก before/after แล้ว diff: 17 ปุ่ม × 5 state = 85 คู่ ต่างกัน 0 จุด
         **ไม่ได้อยู่ใน Verify** และไม่มีอะไรบังคับให้มันตามโค้ดทัน — เป็นหลักฐานของรอบนั้นเท่านั้น)
        ⚠️ **`padding:6px 10px` ของ DS ใส่ไม่ได้ — sidebar แคบเกิน** (คำนวณละเอียดใน README
        หัวข้อ "Open decisions" ข้อ 2): track กว้าง ~41.75px แต่ `16:9` ต้องการ 46px
        และ `1fr` = `minmax(auto,1fr)` หดต่ำกว่า min-content ไม่ได้ → grid จะดันจนเกิด scrollbar แนวนอน
        **padding-x สูงสุดที่ปลอดภัยคือ 7px** ทางเลือกคือ ขยาย `#left` / ลด font-size / ใช้ 2 คอลัมน์ /
        ลดค่าใน DS — ทุกทาง**ขยับพิกเซล** จึงเป็นการตัดสินใจของเจ้าของ ไม่ใช่ของ agent
        (2026-08-23 รอบ 0047: **segmented toggle 3 กลุ่มยุบมาอยู่บน base `.seg` แล้ว** เหมือน
         `.pui-segmented` / `__btn` / `.is-active` — rule ของ wrapper และของ `.on` เคยซ้ำกัน
         **เป๊ะทั้ง 3 ชุด** เหลือ `padding` (+ `font-size` ของ ovl) เป็น delta ประจำกลุ่ม
         `.dn-toggle` ตรงกับ DS อยู่แล้วเป๊ะ (`4px 10px` / `9.5px`) อีก 2 กลุ่มไม่ตรง
         **ไม่แก้ให้ตรงเอง** เพราะเป็นความไม่สม่ำเสมอของแอปเอง → เขียนเป็น decision 5 ใน README
         ⚠️ DS ใช้ `display:inline-flex` แอปใช้ `display:flex` — ทั้ง 3 ตัวเป็นลูกตรงของ
         `#gridHeader` ที่เป็น `display:flex` → เป็น flex item → display ถูก blockify
         `inline-flex` กับ `flex` ได้ used value เท่ากัน **ไม่ต้องแก้** (แก้แล้ว proof จะขึ้น diff)
         พิสูจน์ด้วย `docs/btn-parity-proof.mjs segmented`: 9 element × 5 state = 45 คู่ ต่างกัน 0 จุด
         negative test 2 กรณี: ขยับ padding 1px → FAIL 10 จุด, ถอด class `seg` ออก 1 ตัว →
         markup coverage FAIL ⚠️ **แต่ cascade diff รายงาน 0 จุดในกรณีหลัง** เพราะตาราง `ELEMENTS`
         *ประกาศ* class ไม่ได้อ่านจาก markup — phase markup coverage คือด่านเดียวที่จับเรื่องนี้ได้
         และรอบนี้มันจับได้จริงเพราะ `.seg` ต้องปรากฏครบ 3 จุด)
        `.menu-pop` ตรงกับ `Menu.css` ทุกค่า **ไม่มีอะไรให้ยุบ** — มี declaration ชุดเดียวอยู่แล้ว
        (ที่ต่างคือ `.menu-pop` มี `display:none; position:absolute; right:0; top:30px; z-index:60`
         เพิ่มมา ซึ่ง DS ปล่อยให้ผู้ใช้จัดวางเอง และ DS ประกาศ `background:none; border:none;
         cursor:pointer; font-family:var(--mono)` ตรงๆ ส่วนแอปได้จาก `button{}` reset บรรทัด 51
         → computed เท่ากัน) ⚠️ **ช่องว่างอยู่ฝั่ง DS ไม่ใช่ฝั่งแอป**: แอปมี
         `.menu-pop button:disabled:hover{background:none; color:var(--text)}` และ
         `.menu-pop button.danger:hover{...}` แต่ `Menu.css` ไม่มี → ปุ่ม disabled ใน DS ยังเปลี่ยนสี
         ตอน hover การเติมให้ DS = แก้หน้าตาของ library ที่ consumer อื่นใช้อยู่ → เจ้าของตัดสิน
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

## 🔴 รอเจ้าของตัดสินใจ

**ย้ายไปอยู่ที่ [`README.md` → `## Open decisions`](README.md#open-decisions) แล้ว** (รอบ 2026-08-23_0004)

ทั้ง 6 ข้อ (jsPDF / chip padding / spacing + font-size scale / browser verification /
segmented padding — ข้อ 5 เพิ่มรอบ 2026-08-23_0047 / input size — ข้อ 6 เพิ่มรอบ 2026-08-23_0103)
เขียนไว้ที่นั่นพร้อมทางเลือกและสิ่งที่แลกของแต่ละทาง — **อย่าเขียนกลับมาที่ไฟล์นี้**
เพราะ runner เขียนทับทุกรอบ
คำถามที่วางไว้ในไฟล์ที่เจ้าของไม่ได้เปิดอ่านคือคำถามที่ไม่มีวันได้คำตอบ

เกณฑ์ข้อ 1 / 2 / 3 ที่ยังไม่ติ๊ก บล็อกอยู่ที่ 6 ข้อนั้นทั้งหมด
**เกณฑ์ข้อ 2 บล็อกอยู่ที่ decision 2 + 5 + 6 เท่านั้น — งานสำรวจปิดครบ 11/11 แล้ว
ไม่ต้องสำรวจ component เพิ่มอีก**

## Next task — do ONLY this

**ก่อนอื่น เปิด `README.md` หัวข้อ `## Open decisions` ดูว่าเจ้าของตอบข้อไหนมาแล้วหรือยัง
ถ้าตอบมาแล้วแม้ข้อเดียว → ทำตามคำตอบนั้นแทนงานข้างล่าง (สำคัญกว่า และปลดล็อกเกณฑ์ได้จริง)**

ถ้ายังไม่มีคำตอบ ให้ทำงานนี้: **แก้บั๊กฝาแฝดฝั่ง library — `.pui-toast` กินคลิกทั้งจอ 5 วินาที**

รอบ 0003 (2026-08-24) แก้ฝั่งแอปไปแล้ว: `.toast-act` เติม `pointer-events:auto` เพราะ
`#toast` ตั้ง `pointer-events:none` แล้ว property นี้ inherit ลงไปทับลูก **ฝั่ง DS เป็นบั๊ก
กลับด้านกันเป๊ะ**: `design-system/src/components/Toast/Toast.css` บรรทัด 1–6 (`.pui-toast`)
**ไม่ได้ตั้ง `pointer-events` เลย** → toast เป็น `position:fixed` กว้างได้ถึง `max-width:80vw`
วางอยู่ที่ `z-index:200` → ตลอด 5 วินาทีที่มันโชว์ มัน**บังคลิกทุกอย่างที่อยู่ใต้มัน**
นี่ไม่ใช่เรื่องดีไซน์และไม่ขยับพิกเซลสักจุด — เป็น defect ล้วนๆ แบบเดียวกับที่เพิ่งแก้ฝั่งแอป

แก้ 2 declaration ใน `Toast.css` เท่านั้น:
- `.pui-toast` → เติม `pointer-events:none`
- `.pui-toast__action` → เติม `pointer-events:auto` (ไม่งั้นจะซ้ำรอยบั๊กเดิมของแอปทันที)
เขียน comment กำกับว่าทำไมสองบรรทัดนี้ต้องมาคู่กันเสมอ (ลอกเหตุผลจาก `.toast-act` ใน `index.html`)

**ก่อนแก้ ต้องเช็ค 3 อย่างนี้ก่อน — ถ้าข้อไหนขัด ให้หยุดแล้วเขียนลง SUMMARY.md แทน:**
1. `design-system/src/components/Toast/Toast.tsx` — มี element ลูกอื่นที่คลิกได้อีกไหม
   (ปุ่มปิด? `onClick` บน root?) ถ้ามี **ทุกตัวต้องได้ `pointer-events:auto`** ไม่ใช่แค่ `__action`
2. `Toast.test.tsx` (3 tests) — ถ้ามันยิง click ผ่าน testing-library จะ **ยังผ่านอยู่ดี**
   เพราะ jsdom ไม่ทำ hit testing จริง → **เทสต์ชุดนี้พิสูจน์บั๊กนี้ไม่ได้ ห้ามอ้างว่ามันพิสูจน์**
3. demo gallery (`design-system/src/**` ที่ import Toast) — ดูว่ามีอะไรพึ่งพฤติกรรมเดิมไหม

**หลักฐานที่ต้องแนบ:** `docs/btn-parity-proof.mjs` อ่านแค่ `<style>` ของ `index.html`
**ใช้กับไฟล์ `.css` ของ DS ไม่ได้เลย** อย่าเสียเวลาดัดแปลงมัน — ให้แนบ `git diff` ของ
`Toast.css` ตรงๆ (2 บรรทัด) แล้วรัน Verify ครบ 3 ขั้น
และ **รัน `node docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html` ซ้ำ**
เพื่อยืนยันว่าฝั่งแอปยังเหมือนเดิม (ต้องได้ `FAIL — 5 declaration(s) differ` เท่าเดิมเป๊ะ
โดย `#toast` ไม่มี diff สักจุด — ถ้าตัวเลขไม่ใช่ 5 แปลว่ามีคนไปแตะฝั่งแอป)

⚠️ **นี่เป็นการเปลี่ยน behaviour ของ library ที่ consumer อื่นใช้อยู่** — ต่างจากช่องว่าง
`.menu-pop button:disabled:hover` ที่รอบ 0047 เขียนไว้ว่าเป็นสิทธิ์เจ้าของ เพราะอันนั้น
**เปลี่ยนสีที่คนเห็น** ส่วนอันนี้เป็น hit-testing ล้วน ไม่มีพิกเซลไหนขยับ
ถ้ารอบหน้าอ่านแล้วยังไม่เห็นด้วย → **อย่าแก้ ให้เขียนเป็น decision 7 ใน README แทน** แล้วจบรอบ

⚠️ **ความเสี่ยงที่ต้องรับมือ ไม่ใช่มองข้าม:** **ไม่มีเบราว์เซอร์ให้ verify**
(decision 4 ยังไม่ได้รับอนุญาต) — ย่อหน้าข้างล่างนี้ใช้กับงานที่**แก้ `<style>` ของ `index.html`**
(งาน Next task รอบหน้าแก้ `.css` ของ DS ซึ่ง harness อ่านไม่ได้ ดูวิธีแนบหลักฐานในหัวข้องานเอง)
→ ใช้วิธีเดิม: เพิ่ม refactor ใหม่เข้าไปใน `REFACTORS`
ของ `docs/btn-parity-proof.mjs` (ระบุ class ก่อน/หลัง + ancestor chain; ใส่ `type` ถ้า subject
ไม่ใช่ `button`; ใช้ `beforeAncestors`/`afterAncestors` ถ้า ancestor เปลี่ยนคนละแบบกับ subject)
แล้วรัน `node docs/btn-parity-proof.mjs <key> <sha>:index.html index.html`
ต้องได้ **PASS ทั้ง markup coverage และ cascade diff** ถ้า diff ไม่เท่า = แก้ผิด ให้ย้อนกลับ ไม่ใช่ปรับ CSS ตาม
ทดสอบ negative อย่างน้อย 1 กรณีทุกครั้ง (เช่น ขยับ padding 1px) เพื่อพิสูจน์ว่า harness ยังจับได้จริง
⚠️ **cascade diff เชื่อว่า element มี class ตามตาราง — มันไม่ได้อ่านจาก markup**
ถ้าลืมใส่ class ในไฟล์จริง cascade diff จะยังขึ้น PASS *เฉพาะ phase markup coverage เท่านั้น*
ที่จับได้ → ทุก element ที่ class เปลี่ยน **ต้องมีรายการใน `wanted`** (มีอัตโนมัติถ้า before≠after)
ถ้าพิสูจน์แบบนี้ไม่ได้ **ให้ยกเลิกงานนี้แล้วบันทึกเหตุผลใน SUMMARY.md** — UI พังเงียบๆ
โดยไม่มีใครเห็น แย่กว่าการไม่ยุบ class

⚠️ **ห้ามแตะ `tools/` และอย่าเพิ่มเช็คที่ 7** — token ครบทั้ง 22 ตัวแล้ว ไม่เหลืออะไรให้บังคับ
⚠️ **อย่า*ตอบ*คำถามใน `## Open decisions` เอง** — ทุกข้อขยับพิกเซลหรือเพิ่มไฟล์เข้า repo
   = สิทธิ์ของเจ้าของ
⚠️ **ห้ามลบหัวข้อ `## Open decisions`** และห้ามย้ายกลับเข้า `AUTOPILOT.md`
⚠️ **README audit เสร็จแล้ว (รอบ 08-23_0014) อย่าทำซ้ำ** — ตัวเลขทุกตัวใน README ถูกวัดใหม่หมด
   และเขียนคำสั่งที่ใช้วัดกำกับไว้แล้ว ถ้าจะอ้างตัวเลขใหม่ ให้วัดก่อนเสมอ **และระบุหน่วยเป็น bytes**

> **อย่าแตะ literal สีที่เหลือ** — `rgba(0,0,0,…)`, `rgba(255,255,255,…)`, `#000`, `#0a0a0a`,
> `#7ac87a`, `#ffb4a0`, `rgba(120,200,120,.15)` **ไม่มี token คู่กัน** การตั้ง token ใหม่ให้มัน
> คือการ**ขยายภาษาการออกแบบ** = เจ้าของตัดสิน ไม่ใช่ agent (สำรวจครบแล้ว อย่าไล่ซ้ำ)
> **รอบ 0001 ปิดจบแล้ว: literal ที่ derive จาก token เหลือ 0 จุดทั้งสองฝั่ง และมี checker บังคับ**

> **ผลสำรวจที่ทำไว้แล้ว อย่าเสียเวลาทำซ้ำ:**
> - element parity สำรวจครบ 5 ตัวแล้ว (ตารางในเกณฑ์ข้อ 2) — เหลือ chip `padding` ที่บล็อกรอเจ้าของ
> - ~~`index.html` ไม่มี base class `.btn`~~ **ทำเสร็จแล้วรอบ 0027** — มี `.btn` + `.btn--*` แล้ว
>   และมี `docs/btn-parity-proof.mjs` เป็นเครื่องมือพิสูจน์ว่า refactor ไม่ขยับพิกเซล
>   (เครื่องมือนี้ **ไม่อยู่ใน Verify** ตั้งใจแบบนั้น — มันไม่ได้ทดสอบ requirement อะไร
>    มันเทียบ before/after ของการแก้ครั้งหนึ่งๆ รอบหลังใช้ต่อได้โดยเติมตาราง `ELEMENTS`)
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
- **outcome:** ไฟล์เดียว 304 KB (303,787 bytes — รวมฟอนต์ JetBrains Mono 4 น้ำหนักที่ฝัง base64 ไว้ในไฟล์)
  เปิดจาก browser ได้ทันที ไม่ต้อง build/ไม่ต้อง API key, 54 automated tests
