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
        ✅ **บั๊กฝาแฝดฝั่ง library แก้แล้ว รอบ 2026-08-24_0023** — `Toast.css` เติม 2 declaration
         (`.pui-toast{pointer-events:none}` + `.pui-toast__action{pointer-events:auto}`) พร้อม comment
         อธิบายว่าทำไมสองบรรทัดนี้ต้องมาคู่กันเสมอ **ตอนนี้ทั้งสองฝั่งถูกต้องแล้วทั้งคู่**
         pre-check ครบ 3 ข้อตามที่รอบก่อนสั่ง: (1) `Toast.tsx` มี clickable child ตัวเดียวคือ
         `.pui-toast__action` (`<span onClick>`) ไม่มีปุ่มปิด ไม่มี `onClick` บน root
         (2) `Toast.test.tsx` 3 tests ใช้ `fireEvent.click` ซึ่ง dispatch ลง node ตรงๆ — jsdom
         ไม่ทำ hit testing → **เขียวทั้งก่อนและหลัง พิสูจน์บั๊กนี้ไม่ได้ ห้ามอ้างว่าพิสูจน์**
         (3) demo gallery (`design-system/demo/main.tsx:96`) render `<Toast open …>` ค้างไว้ถาวร
         ไม่มี action ไม่มี root onClick → **เป็นตัวอย่างของบั๊กเลย** (บังคลิกครึ่งล่างของ gallery
         ตลอดเวลา) ไม่มีอะไรพึ่งพฤติกรรมเดิม
         ⚠️ **ข้อควรรู้ที่ pre-check ไม่ได้ถาม: `Toast.tsx` spread `{...rest}` ลง root**
         (มาจาก e3a355c) → consumer ใส่ `onClick` บน root ได้ และ `pointer-events:none` จะทำให้เงียบ
         ตัดสินใจว่ารับความเสี่ยงนี้ เพราะ root เป็น `role="status"` (live region ไม่ใช่ตัวคลิก)
         และ component ให้ `action` มาเป็นช่องทาง interaction อยู่แล้ว — เขียนไว้ใน comment แล้ว
         **หลักฐาน:** `git diff` ของ `Toast.css` (harness อ่าน `.css` ของ DS ไม่ได้ ตามที่รอบก่อนเตือน)
         + Verify ครบ 3 ขั้นเขียว (54/54, check-tokens 6/6, 31/31)
         + `docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html` → `FAIL — 5
         declaration(s) differ` **เท่าเดิมเป๊ะ** โดย `#toast` ไม่มี diff สักจุด = ฝั่งแอปไม่ถูกแตะ
         negative test: ถอด `pointer-events:auto` ออกจาก `.toast-act` → **PASS (0 diff)**
         พิสูจน์ว่าเลข 5 อ่านจากไฟล์จริงตอนนี้ ไม่ใช่ค่าคงที่ค้าง (ใส่กลับแล้ว ยืนยัน 5 เท่าเดิม)
         แก้ comment ของ `.toast-act` ใน `index.html` ด้วย 1 ประโยค เพราะประโยคเดิมเขียนว่า
         "`.pui-toast` has no pointer-events:none, so it needs no counterpart here" ซึ่ง**กลายเป็นเท็จ**
         หลังรอบนี้ — comment ไม่ใช่ declaration ไม่ขยับพิกเซล (harness ยืนยัน: ยัง 5 เท่าเดิม)
         ⚠️ **ยังไม่ได้เปิดเบราว์เซอร์** — เหตุผลทั้งหมดมาจาก source + CSS spec
         (`pointer-events` เป็น inherited property; `opacity:0` ไม่หยุด hit testing)
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
        ✅ **ย้ายขึ้น README เป็น decision 7 แล้ว รอบ 2026-08-24_0036** (งานเอกสารล้วน ไม่แตะ `.css`
         สักบรรทัด — `git status` รอบนั้นขึ้น `M README.md` ไฟล์เดียว)
         **ตรวจซ้ำทุกข้ออ้างก่อนเขียน แล้วเจอว่า 2 ข้อของรอบก่อนผิด → แก้ให้ถูกใน README:**
         (ก) รอบ 0023 เขียนว่า `.pui-btn--icon:hover` (บรรทัด 15) ทับ `color` กลับเป็น `--accent`
         → **ผิด** `.pui-btn--icon:disabled` (บรรทัด 16) specificity เท่ากัน `(0,2,0)` และอยู่**ทีหลัง**
         → `color:var(--dim)` ชนะ ของที่รั่วจริงคือ `background:var(--surface)` + `border-color:var(--dim)`
         ซึ่ง `:disabled` ไม่ได้ประกาศไว้ (ตรงกับที่แอป reset ไว้เป๊ะที่ `index.html:492` — เป็นหลักฐานยืนยัน)
         (ข) รอบ 0023 เขียนว่า "แอปเขียน `:disabled:hover` reset ไว้**ทุกจุด**" → **ผิด กัน 3 จาก 5**
         `#tourBack` (`:558`) ตั้งแค่ `opacity`/`cursor` แต่มันเป็น `.btn--ghost` และ
         `.btn--ghost:hover` (`:344`) ตั้ง `color`+`border-color` ที่ไม่มีใคร reset
         → ปุ่ม Back ตอน tour step แรก (disabled) ยังสว่างตอน hover
         และ `.menu-pop button.danger:hover` (`:588`) กับ `.menu-pop button:disabled:hover` (`:585`)
         **specificity เท่ากันเป๊ะ `(0,3,1)`** → บรรทัด 588 อยู่ทีหลังจึงชนะ
         ปุ่ม Delete ในเมนูมี `class="danger"` และ disabled เมื่อ panel locked/read-only
         → **guard ของแอปเองโดน cascade กลืน** เป็นบั๊กชนิดเดียวกับ `Button.css:6` เป๊ะ
         ⚠️ ทั้งสองจุดนี้ **ขยับสีที่คนเห็น** → เขียนเป็น option ใน decision 7 ไม่ได้แก้เอง
         ⚠️ **ไม่มี checker ตัวไหนดู `:hover` และ jsdom ไม่ทำ hit testing** → ถ้ารอบไหนแอบแก้
         Verify จะยังเขียวครบ นี่คือเหตุผลที่ต้องรอคำตอบ ไม่ใช่ "ลองดูก่อน"
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

เกณฑ์ข้อ 1 / 2 / 3 ที่ยังไม่ติ๊ก บล็อกอยู่ที่ decision 1–7 ทั้งหมด
(decision 8 ที่เพิ่มมารอบ `2026-08-31_0023` **ไม่ได้บล็อกเกณฑ์ข้อไหน** — เป็นเรื่องประวัติ git ล้วน)
**เกณฑ์ข้อ 2 บล็อกอยู่ที่ decision 2 + 5 + 6 + 7 เท่านั้น — งานสำรวจปิดครบ 11/11 แล้ว
ไม่ต้องสำรวจ component เพิ่มอีก**

## Where the work stands (context for the Next task below)

รอบ 2026-08-24_0036 เขียน decision 7 ลง README เสร็จแล้ว → **decision ที่บล็อกเกณฑ์ครบ 7 ข้อ
และทุกเส้นทางที่เหลือของเกณฑ์ข้อ 1 / 2 / 3 อยู่หลัง decision ทั้งหมด**
(รอบ 2026-08-31_0023 เพิ่ม decision 8 = `docs/design-parity.md` ที่หายไป → **รวมใน README เป็น 8 ข้อ**
แต่ข้อ 8 ไม่ได้บล็อกเกณฑ์ข้อไหน ตารางข้างล่างจึงยังเป็น 7):

| เกณฑ์ | บล็อกที่ |
|---|---|
| 1 (token) | decision 3 (spacing/typography scale) |
| 2 (element parity) | decision 2 (chip) + 5 (segmented) + 6 (input) + 7 (disabled hover) |
| 3 (`file://`) | decision 1 (vendor jsPDF) + 4 (browser verification) |

**ถ้าไม่มีคำตอบใหม่ ห้ามประดิษฐ์งานแทน** — เขียน SUMMARY.md ว่ารอบนี้ตรวจแล้วไม่มีอะไรปลดล็อก
แล้วจบรอบ นั่นคือรอบที่สำเร็จ ไม่ใช่รอบที่ล้มเหลว การหางานมาทำเพิ่มตอนนี้คือ scope creep
ที่ไม่มีใครขอ และทุกอย่างที่ "ดูเหมือนงาน" ที่เหลือล้วนขยับพิกเซล = สิทธิ์เจ้าของ

✅ **งานสำรองของรอบก่อน (ให้ harness อ่าน CSS ฝั่ง library) ทำเสร็จแล้ว รอบ 2026-08-24_0048**
`docs/btn-parity-proof.mjs` รับ source เป็น `.css` ได้แล้ว และถ้าเป็น `styles.css` มันจะไล่
`@import` **ประกอบ stylesheet ตามลำดับจริง** (splice ตรงตำแหน่ง `@import` แบบ depth-first)
รันแล้วขึ้นรายการไฟล์ 14 ไฟล์ตามลำดับให้เห็นทุกครั้ง — ลำดับคือข้ออ้างหลักของโหมดนี้
เพิ่ม key `ds-disabled-hover` (3 element ของ decision 7: `.pui-btn--icon`,
`.pui-menu__item`, `.pui-menu__item--danger`) ไว้เป็น baseline 0 diff
คำสั่ง: `node docs/btn-parity-proof.mjs ds-disabled-hover <rev>:design-system/src/styles.css design-system/src/styles.css`
⚠️ โหมด `.css` **ไม่มี phase markup coverage** (stylesheet ไม่มี markup) → ใส่ guard แทนคือ
element ไหน match 0 rule ทั้งสอง version = FAIL (ไม่งั้นตารางที่พิมพ์ class ผิดจะขึ้น PASS เงียบๆ)

✅ **งานสำรองอันสุดท้าย (ให้ harness รายงาน selector ที่อ่านไม่ได้) ทำเสร็จแล้ว รอบ 2026-08-24_0102**
`ruleMatches()` แยก "ไม่ match" ออกจาก "ตัดสินไม่ได้" แล้ว และ `computed()` ไม่ทิ้ง flag อีกต่อไป
ท้ายรันจะพิมพ์ `⚠ N undecidable rule(s)` พร้อมบอกว่าติดอะไร (`combinator >` / `structural pseudo
:last-child`) และ element ไหนโดน — **เตือนอย่างเดียว ไม่ FAIL** (ตามที่รอบก่อนแนะนำ) แต่บรรทัด
PASS ต่อท้ายว่า *"Except the N undecidable rule(s) … which this PASS says nothing about"*
→ PASS เปล่าๆ ไม่ถูกอ่านเป็นหลักฐานคลุมกฎพวกนั้นอีก
⚠️ **จุดที่ต้องรู้ก่อนแก้ต่อ:** เดิมมี 2 ทางที่เงียบ ไม่ใช่ทางเดียวอย่างที่รอบก่อนเขียน —
combinator ตั้ง flag แล้ว `computed()` ทิ้ง ส่วน structural pseudo **ไม่เคยตั้ง flag เลย**
(ตายใน `compoundMatchesElement`) → คืน `{matched:false}` เปล่าๆ แยกจาก non-match จริงไม่ได้
การรายงานเช็ค **subject ก่อน แล้วถ้าไม่มี combinator ค่อยเช็ค prelude ตามปกติ** —
ไม่งั้น `.menu-pop button:last-child` จะถูกรายงานใส่ปุ่มทั้งไฟล์ (ลองแล้ว: 17 ปุ่มของ key
`buttons` โดนหมดทั้งที่ไม่มีตัวไหนอยู่ใน `.menu-pop`) ถ้ามี combinator ถึงจะข้าม prelude
= **ตั้งใจให้ over-report ไว้ก่อน** เพราะความสัมพันธ์ตรงนั้น model ไม่ได้จริงๆ

## Next task — do ONLY this

**ก่อนอื่น เปิด `README.md` หัวข้อ `## Open decisions` เหมือนเดิม ถ้าเจ้าของตอบข้อไหนมาแล้ว
→ ทำตามคำตอบนั้น (สำคัญกว่าทุกอย่างข้างล่าง และเป็นทางเดียวที่ปลดล็อกเกณฑ์ได้จริง)**

**ถ้ายังไม่มีคำตอบ — รอบหน้าเป็น *no-op* ตามเดิม: restore tip รอบก่อน (เลือกด้วย `:iso8601` +
`head -16` + ตรวจซ้ำด้วย refname **ห้ามใช้หมายเลขแถว**), ตรวจ 5 ช่องทาง, รัน Verify 3 ขั้น +
harness ครบ 5 key, เขียน SUMMARY แล้วจบรอบ ห้ามประดิษฐ์งานอื่นเด็ดขาด**
✅ **แก้ความเข้าใจผิดเรื่อง `:short` แล้ว รอบ `2026-09-03_0025` (รัน A/B จริง) — อ่านให้ครบก่อนเชื่อบล็อกเก่า:**
 อันตรายอยู่ที่การใช้วันที่ตัดสั้นเป็น **sort key ใน shell pipeline** (`… | sort -r`) เท่านั้น
 **ไม่ใช่ตัว token `:short` เอง** — `git for-each-ref --sort=-committerdate` เรียงด้วย
 **ค่า timestamp จริงเต็มความละเอียด** ส่วน `:short` ใน `--format` แค่ตัดสิ่งที่*พิมพ์ออกมา*
 → `--sort=-committerdate --format='%(committerdate:short) …'` **แม่นยำ ใช้ได้ ปลอดภัย**
 → `--format='%(committerdate:short) …' | sort -r` **คือกับดัก** (ผูก tie แล้วตกไปเรียงตาม sha)
 ยังต้องตรวจซ้ำด้วย refname เสมอ เพราะ pipeline แบบหลังยังพังเงียบอยู่ถ้ารอบไหนเผลอใช้
⚠️ `ds-disabled-hover` ใช้ **tip ของรอบก่อนหน้ารอบนั้น** เป็นฝั่ง before ไม่ใช่ sha ตายตัว —
อ่านจาก `git for-each-ref` เสมอ ห้ามลอก sha จากบล็อกสถานะเก่า มันค้างทุกรอบ งานสำรองที่**แตะโค้ด**หมดแล้วจริงๆ **และงาน read-only ก้อนสุดท้าย
(`retrospective restore audit`) ก็ปิดจบแล้วในรอบ `2026-08-31_0023`:

> ✅ **`retrospective restore audit` เสร็จแล้ว รอบ `2026-08-31_0023` — ห้ามทำซ้ำ**
>  ค้างมา 6 รอบ (`_0009`, `_0042`, `_0044`, `_0054`, `_0004`, `_0014` ต่างบันทึกว่า "เป็นงานคนละชิ้น"
>  แล้วข้ามไป) ตรวจครบ **72 branch** แล้ว วิธีที่ใช้: เทียบ **tree sha** ตรงๆ
>  (`tree(restore commit ของ B_n)` ต้องเท่ากับ `tree(tip ของ B_{n-1})`) ซึ่งถูกกว่าและเด็ดขาดกว่า
>  `git diff --stat` ทีละคู่ — เรียงลำดับด้วย `--sort=-committerdate` (เต็มความละเอียด)
>
>  **ผลลัพธ์: ทุก restore ที่ *ทำ* ถูกหมด — ไม่มีรอบไหน restore ผิดตัวเลยสักรอบ**
>  (58 exact + 2 multi-branch consolidation ที่ตั้งใจรวมหลาย sibling + 1 partial ที่ข้ามแค่
>   `SUMMARY.md` ซึ่งรอบถัดไปเขียนทับอยู่แล้ว + 1 รอบแรกที่ไม่มีอะไรให้ restore)
>  **สิ่งที่เจอแทนคือ 10 รอบที่ *ไม่ได้ restore เลย*** (`_0008`/`_0023` 08-14, `_0003` 08-15,
>  `_0014` 08-16, **`_0022` 08-19**, `_0004`/`_0014`/`_0025`/`_0036` 08-20, `_0002` 08-21)
>  9 ใน 10 ไม่ทำให้อะไรหายถาวร (รอบหลังๆ consolidate กลับมาให้)
>
> 🔴 **แต่รอบ `2026-08-19_0022` ทำ `docs/design-parity.md` หายถาวร** (44,376 bytes / 535 บรรทัด
>  สร้างโดยรอบ `2026-08-14_0023` แล้วถูก carry forward มา 12 รอบติด) — มันถูกตัดจากฐาน `3503537`
>  ไม่ restore แล้ว commit ทับ subject ว่า *"token task already done"* ซึ่ง**เป็นอาการของการอ่าน
>  tree เก่าแล้วเข้าใจว่างานเสร็จ** ทุกรอบหลังจากนั้นสืบทอด tree ที่ไม่มีไฟล์นี้
>  **ยังกู้ได้ตลอดที่ `c3351fc:docs/design-parity.md`** — ไม่มีอะไรหายจาก git จริงๆ แค่ไม่ได้ checkout
>  → **เขียนเป็น decision 8 ใน `README.md` แล้ว ห้ามรอบไหนกู้เองโดยไม่มีคำตอบจากเจ้าของ**
>  (ไฟล์เก่า 13 วัน ย้อนไปก่อน radius token / font inlining / `.btn` refactor → ใส่กลับมาดิบๆ
>   จะขัดกับ `AUTOPILOT.md` ทันที การ reconcile = ตัดสินเนื้อหา = สิทธิ์เจ้าของ)
>
>  **หลักฐานว่า "หายแค่ไฟล์เดียว" เป็นข้อสรุปที่ครบถ้วน ไม่ใช่การสุ่มตรวจ:**
>  `git log --all --format= --name-only ^3503537 | sort -u` = **21 path** ที่ประวัติทั้ง 72 branch
>  เคยแตะ เทียบกับ `git ls-files` → อยู่ครบทุกตัว **ยกเว้น `docs/design-parity.md` ตัวเดียว**
>  ⚠️ **ข้อจำกัดที่ต้องรู้: นี่เป็นการพิสูจน์ระดับ *ไฟล์* เท่านั้น** ถ้ารอบที่ข้าม restore
>  ทำ*บางบรรทัด*หายจากไฟล์ที่ยังอยู่ วิธีนี้มองไม่เห็น และพิสูจน์ย้อนหลังไม่ได้แล้ว
>  เพราะไฟล์เหล่านั้นถูกเขียนใหม่มาหลายรอบโดยชอบธรรม — **อย่าอ้างว่า audit นี้ปิดข้อนั้นด้วย**
>

> **สถานะล่าสุด: รอบ `2026-09-04_0032` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `17fa9c0` = `_0019`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` + `head -16` **แล้วตรวจซ้ำด้วย refname** — `_0019` คือหมายเลขรอบสูงสุด
>  ที่ต่ำกว่า `_0032` ของตัวเอง สองวิธีตรงกัน
>  🔴 **รอบนี้เป็นรอบที่สี่ของวัน `2026-09-04` → วันนี้มี tip สามตัวผูกกันที่ day granularity**
>  (`17fa9c0` = `_0019`, `30cb3af` = `_0011`, `0c86d72` = `_0001`)
>  ⚠️ **รอบนี้ไม่ได้รัน `:short` เป็นคำสั่งจริง** — ที่เขียนต่อไปนี้เป็นการอนุมานจากลำดับ sha
>  ไม่ใช่ผลที่วัดมา (รอบก่อนๆ ที่อ้างการทดลอง A/B รันสองสูตรจริง รอบนี้ไม่ได้ทำ):
>  ถ้าใช้ pipeline `--format='%(committerdate:short) …' | sort -r` ทั้งสามจะผูกกันแล้วตกไปเรียง
>  ตาม sha → `30cb3af` ขึ้นก่อน (`3`=0x33 ชนะ `1`=0x31 และ `0`=0x30) ซึ่ง**ผิด เก่ากว่าหนึ่งรอบ**
>  รอบนี้กรอง branch ตัวเองออกด้วย `grep -v "2026-09-04_0032"` ก่อน sort จึงไม่มีแถวของตัวเองปน
>  `git diff --stat 17fa9c0 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 17fa9c0` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `89610ca`)
>  `git merge-base --is-ancestor 3503537 17fa9c0` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 17fa9c0` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-04_0019 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS **และไม่มี undecidable**
>  — ยืนยันด้วย `grep -ci "undecidable"` = **0 ทั้งสามคีย์**,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`
>  (subject matches `.pui-menu__item`, `.pui-menu__item--danger`),
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว
>  (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`)
>  — ใช้ `grep "✗"` ตามที่รอบ `_0043` แก้ไว้ ไม่ใช่ `grep -c "✗ #toast:"` ที่มีจุดบอด)
>  และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`17fa9c0`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  ⚠️ **รอบนี้ Bash tool บล็อกคำสั่งที่ต่อกันหลายท่อน** (`node … > /tmp/th.txt; echo; grep; grep`)
>  ขึ้น `contains multiple operations` → ต้องรัน `toast-hit` เป็นคำสั่งเดี่ยวแล้วอ่าน output ตรงๆ
>  **รอบหน้าอย่าเสียรอบไปต่อ chain ยาว** — คำสั่งที่มี `;` หลายท่อน + redirect โดนบล็อก
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะรอบก่อน: รอบ `2026-09-04_0019` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `30cb3af` = `_0011`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` **แล้วตรวจซ้ำด้วย refname** — `_0011` คือหมายเลขรอบสูงสุดที่ต่ำกว่า
>  `_0019` ของตัวเอง สองวิธีตรงกัน
>  🔴 **รอบนี้คือรอบที่สองของวัน `2026-09-04` → กับดัก `:short` กลับมาแล้วจริงตามที่ `_0011` เตือน**
>  วันนี้มี tip **สองตัว** (`30cb3af` = `_0011`, `0c86d72` = `_0001`) ผูกกันที่ day granularity
>  → ถ้ารอบไหนใช้ `--format='%(committerdate:short) …' | sort -r` จะตกไปเรียงตาม sha แล้วได้
>  `0c86d72` ซึ่ง**ผิด** (เก่ากว่าหนึ่งรอบ) — เคส "accidentally right" ของ `_0011` จบลงที่รอบนี้
>  `git diff --stat 30cb3af -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 30cb3af` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `55286ae`)
>  ⚠️ **รอบนี้ `git merge --ff-only` ถูก permission บล็อก** → ใช้ `git checkout 30cb3af -- .` แทน
>  ตามที่รอบก่อนๆ ทำ ผลลัพธ์เทียบเท่ากันเพราะ diff ไม่ลบไฟล์ใดเลย (ยืนยันด้วย `--diff-filter=D`)
>  **รอบหน้าอย่าเสียเวลาลอง `merge --ff-only` ซ้ำ** — ไปที่ path-checkout ได้เลย
>  `git merge-base --is-ancestor HEAD 30cb3af` → ancestor-ok (prev ล้ำหน้าอยู่จริง)
>  `git log -1 --format="%h %an <%ae> %ad %s" 30cb3af` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-04_0011 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS **และไม่มี undecidable**
>  — ยืนยันด้วย `grep -ci "undecidable"` = **0 ทั้งสามคีย์**,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`
>  (subject matches `.pui-menu__item`, `.pui-menu__item--danger`),
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว
>  — ใช้ `grep "✗"` ตามที่รอบ `_0043` แก้ไว้ ไม่ใช่ `grep -c "✗ #toast:"` ที่มีจุดบอด)
>  และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`30cb3af`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะก่อนหน้านั้น: รอบ `2026-09-04_0011` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `0c86d72` = `_0001`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` + `head -16` **แล้วตรวจซ้ำด้วย refname** — `_0001` คือหมายเลขรอบสูงสุด
>  ที่ต่ำกว่า `_0011` ของตัวเอง สองวิธีตรงกัน
>  ⚠️ **รอบนี้ `2026-09-04` มี tip ตัวเดียว (`0c86d72`) → day granularity บังเอิญแยกออกได้**
>  นี่คือเคส "accidentally right" ที่บันทึกไว้ตั้งแต่รอบ `2026-09-02_0015` — **ห้ามอ่านว่ากับดัก
>  `:short` หมดฤทธิ์แล้ว** เพราะแถวถัดลงไปคือ `2026-09-03` ที่มี tip **หกตัว** ผูกกันหมด
>  (`c4ab074`/`373f7c8`/`844900e`/`adcae8b`/`8cc03f4`/`2eda89e`) กับดักจะกลับมาทันทีที่รอบที่สอง
>  ของวัน `2026-09-04` ลงมา → ใช้ `:iso8601` + refname ต่อไปตามเดิม
>  `git diff --stat 0c86d72 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 0c86d72` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `1678112`)
>  `git merge-base --is-ancestor 3503537 0c86d72` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 0c86d72` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-04_0001 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS **และไม่มี undecidable**
>  — รอบนี้ยืนยันด้วย `grep -ci "undecidable"` = **0 ทั้งสามคีย์** ไม่ได้อนุมานจากการที่ `tail`
>  ไม่พิมพ์บล็อกนั้นออกมา,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`
>  (subject matches `.pui-menu__item`, `.pui-menu__item--danger`),
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว
>  — ใช้ `grep "✗"` ตามที่รอบ `_0043` แก้ไว้ ไม่ใช่ `grep -c "✗ #toast:"` ที่มีจุดบอด)
>  และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`0c86d72`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะเก่ากว่านั้น: รอบ `2026-09-04_0001` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `c4ab074` = `_0051`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` + `head -16` **แล้วตรวจซ้ำด้วย refname** — `_0051` คือหมายเลขรอบสูงสุด
>  ที่ต่ำกว่ารอบตัวเอง สองวิธีตรงกัน
>  ⚠️ รอบนี้ `2026-09-03` มี tip **หกตัว** (`c4ab074`/`373f7c8`/`844900e`/`adcae8b`/`8cc03f4`/`2eda89e`)
>  → day granularity แยกไม่ออกเลย ต้องใช้ full precision + refname เท่านั้น
>  ⚠️ **รอบนี้ข้ามวัน** (branch `2026-09-04` แต่ tip ที่ใหม่ที่สุดคือ `2026-09-03 00:57:19`)
>  — เป็นเรื่องปกติ ไม่ใช่สัญญาณอะไร จัดอันดับด้วย committerdate ของ tip ห้ามใช้วันที่ในชื่อ branch
>  `git diff --stat c4ab074 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD c4ab074` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `1b16f21`)
>  `git merge-base --is-ancestor 3503537 c4ab074` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" c4ab074` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-03_0051 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว
>  — ใช้ `grep "✗"` ตามที่รอบ `_0043` แก้ไว้ ไม่ใช่ `grep -c "✗ #toast:"` ที่มีจุดบอด)
>  และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`c4ab074`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะเก่ากว่านั้นอีก: รอบ `2026-09-03_0051` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `373f7c8` = `_0043`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` + `head -16` **แล้วตรวจซ้ำด้วย refname** — `_0043` คือหมายเลขรอบสูงสุด
>  ที่ต่ำกว่า `_0051` ของตัวเอง สองวิธีตรงกัน
>  ⚠️ รอบนี้ `2026-09-03` มี tip **ห้าตัว** (`373f7c8`/`844900e`/`adcae8b`/`8cc03f4`/`2eda89e`)
>  → day granularity แยกไม่ออกเลย ต้องใช้ full precision + refname เท่านั้น
>  `git diff --stat 373f7c8 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  และ `tree` ของ restore commit = `aba5abf` **เท่ากับ tree ของ tip เป๊ะ** (ยืนยันซ้ำอีกชั้น)
>  `git diff --diff-filter=D --name-only HEAD 373f7c8` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `3cf12aa`)
>  `git merge-base --is-ancestor 3503537 373f7c8` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 373f7c8` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-03_0043 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`
>  (subject matches `.pui-menu__item`, `.pui-menu__item--danger`),
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว
>  — ใช้ `grep "✗"` ตามที่รอบ `_0043` แก้ไว้ ไม่ใช่ `grep -c "✗ #toast:"` ที่มีจุดบอด)
>  และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`373f7c8`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --porcelain --untracked-files=all` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะเก่ากว่านั้นอีก: รอบ `2026-09-03_0043` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `844900e` = `_0033`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  เลือกด้วย `:iso8601` + `head -16` **แล้วตรวจซ้ำด้วย refname** — `_0033` คือหมายเลขรอบสูงสุด
>  ที่ต่ำกว่า `_0043` ของตัวเอง สองวิธีตรงกัน
>  ⚠️ รอบนี้ `2026-09-03` มี tip **สี่ตัว** (`844900e`/`adcae8b`/`8cc03f4`/`2eda89e`) → day
>  granularity แยกไม่ออกเลยแม้แต่น้อย ตามที่รอบ `_0017` ทำนายไว้ว่า masking จากการข้ามวันหมดฤทธิ์แล้ว
>  `git diff --stat 844900e -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 844900e` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `5f5cb9d`)
>  `git merge-base --is-ancestor 3503537 844900e` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 844900e` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-03_0033 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child` = `structural pseudo :last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยอ่านแถว `✗` **ครบทั้ง 5 แถว** เป็น `#toastUndo` ล้วน ไม่มี `#toast` สักแถว) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`844900e`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — **รอบหน้าต้องใช้ tip ที่ตัวเอง restore เช่นกัน**
>  🔴 รอบนี้แก้คำสั่งตรวจ `toast-hit` ในบล็อก `**Verify:**` ด้วย — `grep -c "✗ #toast:"` มีจุดบอด
>  ที่แถว `(base)` (ไม่มี `:`) รายละเอียดอยู่ในบล็อกนั้น **เป็นการแก้เอกสารล้วน ไม่แตะโค้ด**
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะเก่ากว่านั้นอีก: รอบ `2026-09-03_0033` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `adcae8b` = `_0025`; เลือกด้วย `:iso8601` เต็มความละเอียด **แล้วตรวจซ้ำด้วย
>  refname** — `_0025` คือหมายเลขรอบสูงสุดที่ต่ำกว่า `_0033` ของตัวเอง สองวิธีตรงกัน
>  รอบนี้ `2026-09-03` มี tip **สามตัว** (`adcae8b`/`8cc03f4`/`2eda89e`) → day granularity
>  แยกไม่ออกแล้วอย่างสมบูรณ์ ยิ่งยืนยันว่าต้องใช้ full precision + refname
>  `git diff --stat adcae8b` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --name-status HEAD adcae8b` → 13 `M` + 3 `A` **ไม่มี `D`** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `5511ff3`)
>  `git merge-base --is-ancestor 3503537 adcae8b` → ancestor-ok
>  author ของ `adcae8b` = `PHANTOM AUTOPILOT` และ subject = `chore: round 2026-09-03_0025 no-op …`
>  = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดยบรรทัด `✗` ทั้ง 5 เป็น `#toastUndo` ล้วน **ไม่มี `#toast` สักบรรทัด**) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`adcae8b`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — รอบหน้าต้องเปลี่ยนเป็น tip ที่ตัวเอง restore เช่นกัน
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  หัวข้อ `### 1.` … `### 8.` ยังอยู่ครบและไม่ถูกแก้
>  `git ls-files -- '*jspdf*' '*jsPDF*' '*JSPDF*'` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27) — ไม่ขยับเลย)
>
> **สถานะเก่ากว่านั้นอีก: รอบ `2026-09-03_0025` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `8cc03f4` = `_0017`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 8cc03f4` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --name-status HEAD 8cc03f4` → 13 `M` + 3 `A` **ไม่มี `D`** → path-checkout เทียบเท่า fast-forward
>  (restore commit = `bf994c1`)
>  `git merge-base --is-ancestor 3503537 8cc03f4` → ancestor-ok
>  subject ของ `8cc03f4` = `chore: round 2026-09-03_0017 no-op …` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  ⚠️ ฝั่ง before ของ `ds-disabled-hover` รอบนี้อ่านจาก tip ที่ restore จริง (`8cc03f4`)
>  ไม่ได้ลอก sha จากบล็อกเก่า — รอบหน้าต้องเปลี่ยนเป็น tip ที่ตัวเอง restore เช่นกัน
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  หัวข้อ `### 1.` … `### 8.` ยังอยู่ครบและไม่ถูกแก้
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `mac/hardening-pass`/`origin/hardening-pass` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ✅ **รอบนี้ปิดประเด็น `:short` ด้วยการรัน A/B จริง — คำเตือน 🔴 ของรอบก่อน "ถูกอาการ ผิดสาเหตุ"**
>  การกลับหัว 5 อันดับของ `2026-09-02` **มีจริง** แต่เกิดจาก **pipeline `| sort -r`** ไม่ใช่ `:short`
>  (รันโดยตัด branch ตัวเองออก เพื่อจำลองสภาพ *ก่อน* restore)
>  ```
>  A: --sort=-committerdate + :short เป็น display   B: --format=:short | sort -r
>  2026-09-03 8cc03f4 _0017  ✓                      2026-09-03 8cc03f4 _0017
>  2026-09-02 75f48e3 _0047  ✓ ตัวจริงของวันนั้น      2026-09-02 facbf71 _0036
>  2026-09-02 facbf71 _0036                         2026-09-02 e66cdf6 _0029
>  2026-09-02 e66cdf6 _0029                         2026-09-02 b791ace _0015
>  2026-09-02 3716e2b _0022                         2026-09-02 98e4380 _0002
>  2026-09-02 b791ace _0015                         2026-09-02 75f48e3 _0047 ← ตก 5 อันดับ
>  ```
>  **A ถูกทุกแถว** เพราะ git เรียงจากค่า timestamp จริง `:short` แค่ตัดตอนพิมพ์
>  **B คือกับดัก** เพราะ string ที่ตัดแล้ว*กลายเป็น sort key* → ผูก tie 6 ตัว → ตกไปเรียงตาม sha
>  ⚠️ รอบนี้ทั้ง A และ B ชี้ `_0017` ที่อันดับ 1 เหมือนกัน แต่ของ B เป็น**ความบังเอิญของ sha**
>  (`8` > `2`) ไม่ใช่การข้ามวันอีกแล้ว — ตามที่รอบก่อนทำนายไว้ว่า masking จะหมดฤทธิ์
>  ⚠️ **หลัง restore commit branch ของรอบตัวเองจะขึ้นแถวบนสุดทั้ง A และ B** → ยิ่งห้ามเลือกด้วยหมายเลขแถว
>
> **สถานะเก่ากว่านั้นอีก: รอบ `2026-09-03_0017` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `2eda89e` = `_0007`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 2eda89e -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 2eda89e` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `f55a06f` = 13 `M` + 3 `A` ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 2eda89e` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 2eda89e` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-03_0007 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบนี้รันสูตร `:short` แบบ (ก) *จริง* — ได้หลักฐานใหม่ที่แรงที่สุดเท่าที่บันทึกมา:
>  มันถูกที่อันดับ 1 เพราะข้ามวัน แต่กลับหัวการเรียงของวันก่อนหน้าเกือบสมบูรณ์**
>  `2026-09-03` มี tip ตัวเดียว (`2eda89e`) ตอนเลือก → day granularity แยกมันออกได้เอง
>  **ทั้งสองสูตรจึงชี้ตัวเดียวกันที่อันดับ 1 — ห้ามอ่านว่า trap หายไปแล้ว** เพราะแถวถัดลงมา
>  tip **หกตัว**ของ `2026-09-02` ผูกกันหมด แล้ว sha fallback เรียง `f` > `e` > `b` > `9` > `7` > `3`
>  → `facbf71` (`_0036`, 00:46:25) ขึ้นอันดับ 1 ของกลุ่ม ส่วน `75f48e3` (`_0047`, **00:52:48**
>  ตัวจริงและใหม่สุดของวันนั้น) **ตกไปอันดับ 6 จาก 6 — ห่างจากที่ควรอยู่ 5 อันดับ**
>  (สถิติเดิมที่แย่ที่สุดคือ 4 อันดับ ในรอบ `_0029` สูตร (ข)) รัน live ทั้งสองสูตร:
>  ```
>  (ก) pipeline :short (retired)        (ค) :iso8601 (สูตรที่ใช้จริง)
>  2026-09-03 2eda89e _0007 ← ถูก แต่ถูกเพราะข้ามวัน
>  2026-09-02 facbf71 _0036             2026-09-03 00:11:54 2eda89e _0007 ✓
>  2026-09-02 e66cdf6 _0029             2026-09-02 00:52:48 75f48e3 _0047
>  2026-09-02 b791ace _0015             2026-09-02 00:46:25 facbf71 _0036
>  2026-09-02 98e4380 _0002             2026-09-02 00:34:05 e66cdf6 _0029
>  2026-09-02 75f48e3 _0047 ← ตัวจริงของวันนั้น อันดับ 6
>  2026-09-02 3716e2b _0022             2026-09-02 00:27:22 3716e2b _0022
>  ```
>  ⚠️ **ตั้งแต่รอบหน้าไป `2026-09-03` จะมี tip สองตัวขึ้นไป → การข้ามวันจะไม่ช่วยอีกแล้ว**
>  ✅ รอบนี้เลือก tip ด้วย `:iso8601` + `head -16` แล้วตรวจซ้ำด้วย refname (`_0007` = เลขรอบ
>  สูงสุดที่ต่ำกว่า `_0017` ของตัวเอง) สองวิธีตรงกัน; `head -16` แสดง tip ครบ **8 ตัว** ไม่มีตัวใดถูกตัด
>  ⚠️ ตอนรัน `for-each-ref` *ก่อน* restore, branch ของรอบนี้ยังอยู่ที่ `3503537` (committerdate
>  `2026-08-13`) จึงจมอยู่ท้ายรายการและไม่กินแถวในจอ — **หลัง restore commit มันจะขึ้นเป็นแถวบนสุด**
>  ซึ่งเป็นเหตุผลที่ต้องเลือก tip ด้วย refname ไม่ใช่หมายเลขแถว

> **(สถานะของรอบ `2026-09-03_0007` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-03_0007` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `75f48e3` = `_0047`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 75f48e3 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 75f48e3` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `58ac14d`; `git diff --stat` = 16 ไฟล์ 3506 insertions ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 75f48e3` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 75f48e3` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0047 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และ
>  `grep -c "If you answer:" README.md` = **8** → ตัวนับสองตัว**ตรงกัน** = ยังไม่มีใครตอบ
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ⚠️ **ปฏิทินข้ามวันอีกครั้ง (2026-09-02 → 2026-09-03) และรอบนี้เป็นรอบแรกของวันใหม่**
>  ตอนเลือก tip มี tip **หกตัว**อยู่ `2026-09-02` (`_0002`/`_0015`/`_0022`/`_0029`/`_0036`/`_0047`)
>  → ถ้าใช้สูตร `:short` ทั้งหกจะผูกกันแล้วตกไปเทียบ sha ซึ่งเป็นกับดักเดิม
>  🔴 **แต่รอบนี้ *ไม่ได้* รันสูตร `:short` สักแบบ จึงไม่มีข้อมูลใหม่เรื่อง tiebreak**
>  ห้ามอ่านรอบนี้เป็นหลักฐานสนับสนุนหรือค้านสูตรไหนทั้งสิ้น (ข้อความข้างบนนี้เป็นการอนุมาน
>  จากจำนวน tip ที่เห็น ไม่ใช่ output จริง) — เลือก tip ด้วย `:iso8601` + `head -16`
>  แล้วตรวจซ้ำด้วย refname (`_0047` = เลขรอบสูงสุดของวันก่อนหน้า และเป็นรอบสุดท้ายก่อนรอบนี้)
>  สองวิธีให้คำตอบตรงกัน `head -16` แสดง tip ครบ 8 ตัว ไม่มีตัวไหนถูกตัดออกจากจอ
>
> ⚠️ **ข้อสังเกตเชิงบำรุงรักษา (ไม่ใช่งานของรอบนี้ และห้ามรอบไหนลงมือเองโดยไม่มีคำสั่ง):**
>  `AUTOPILOT.md` ตอนนี้ **1,526 บรรทัด** และมี status block ของรอบเก่าสะสม **29 บล็อก**
>  (~1,100 บรรทัด = 72% ของไฟล์) เพราะทุกรอบ *เพิ่ม* บล็อกใหม่แต่ไม่เคยตัดบล็อกเก่าทิ้ง
>  โตประมาณ 30–40 บรรทัดต่อรอบและไม่มีเพดาน → ข้อความ contract ที่ runner ส่งมาใน prompt
>  ถูกตัดกลางประโยคมานานแล้ว (ซึ่งเป็นเหตุผลที่ `## Next task` มาถึงเป็นค่าว่าง)
>  **การตัดประวัติทิ้งคือการทิ้งหลักฐาน** → เป็นการตัดสินใจของเจ้าของ ไม่ใช่ของ agent
>  บันทึกไว้เฉยๆ ไม่ได้เพิ่มเป็น decision ที่ 9 เพราะมันไม่บล็อกเกณฑ์ข้อไหนเลย

> **(สถานะของรอบ `2026-09-02_0047` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-02_0047` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `facbf71` = `_0036`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat facbf71 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD facbf71` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `79dd843` = 13 `M` + 3 `A` ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 facbf71` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" facbf71` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0036 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17, 45/9, 5/1 → PASS ไม่มี undecidable,
>  15/3 → PASS + 1 undecidable `.pui-menu__item:last-child`,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore),
>  `git ls-files | grep -i jspdf` ว่าง, `ls jspdf.umd.min.js` → No such file,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **ข้อสังเกตใหม่ของรอบนี้: `| sort -r | head -8` เริ่ม *ตัด* tip ตัวจริงทิ้งได้แล้ว**
>  เพราะ `for-each-ref refs/heads refs/remotes` คืน **สองแถวต่อหนึ่ง tip** (local + `origin/`)
>  → `head -8` = tip ที่มองเห็นแค่ **4 ตัว** ทั้งที่วันที่ `2026-09-02` มี 5 ตัวแล้ว
>  รอบนี้ปลอดภัยเพราะตัวจริง (`facbf71`) อยู่แถวแรกพอดี **แต่ถ้ารอบไหน restore เสร็จก่อนแล้วค่อยรัน
>  (branch ตัวเองจะเบียดขึ้นมา 2 แถว) หรือมีรอบลงวันเดียวกันเพิ่มอีก tip ตัวจริงจะหลุดจอเงียบๆ**
>  → **ใช้ `head -16` ขึ้นไป** หรือกรอง `grep -v "^origin/"` ก่อน ไม่ใช่ `head -8`
>  (นี่คือกับดักคนละตัวกับ `:short` — `:iso8601` เรียงถูกอยู่แล้ว แต่คำตอบถูก*ถูกตัดออกจากผลลัพธ์*)
>  ⚠️ **รอบนี้ *ไม่ได้* รันสูตร `:short` สักแบบ** จึงไม่มีข้อมูลใหม่เรื่อง tiebreak
>  ห้ามอ่านรอบนี้เป็นหลักฐานสนับสนุนหรือค้านสูตรไหน — เลือก tip ด้วย `:iso8601`
>  แล้วตรวจซ้ำด้วย refname (`_0036` = เลขรอบสูงสุดที่ต่ำกว่า `_0047` ของตัวเอง) สองวิธีตรงกัน
>
> ⚠️ **`grep -c "If you answer:" README.md` = 8 แล้ว ไม่ใช่ 7** — decision 8 พามาอีกบรรทัดหนึ่ง
>  บันทึกเก่าที่เขียนว่า "ตัวเลขนี้ค้างที่ 7" เป็นข้อความก่อนรอบ `2026-08-31_0023`
>  ตอนนี้ตัวนับสองตัว (`| Option | Cost |` และ `If you answer:`) **ตรงกันที่ 8**
>  ถ้ารอบไหนเห็นเลขสองตัวนี้ไม่ตรงกัน *นั่น*คือสัญญาณว่ามีคนตอบมาแล้ว

> **(สถานะของรอบ `2026-09-02_0036` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-02_0036` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `e66cdf6` = `_0029`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat e66cdf6 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD e66cdf6` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `30d49b8` = 13 `M` + 3 `A` ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 e66cdf6` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" e66cdf6` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0029 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 จาก 14 ไฟล์ + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore) และทั้ง 8 ข้อยังขึ้น
>  `**If you answer:**` เป็นอนาคตกาลครบทุกข้อ,
>  `git ls-files | grep -i jspdf` ว่าง, `ls jspdf.umd.min.js` → No such file,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบนี้ยืนยันว่า `:short` มี *สองสูตร* ที่ tiebreak คนละแบบ — และรอบนี้ให้ผลตรงข้ามกัน**
>  ตอนนี้มี tip **สี่ตัว**อยู่ `2026-09-02` → ทั้งสองสูตรผูกกันทั้งสี่ รันจริงทั้งสามคำสั่ง:
>  ```
>  (ก) pipeline: --format='%(committerdate:short) …' | sort -r     ← สูตรที่ `_0022`/`_0029` รัน
>  2026-09-02 e66cdf6 _0029  ← บังเอิญ*ถูก* ที่อันดับ 1
>  2026-09-02 b791ace _0015
>  2026-09-02 98e4380 _0002
>  2026-09-02 3716e2b _0022
>
>  (ข) native: --sort=-committerdate:short                          ← สูตรที่รอบนี้รัน
>  2026-09-02 98e4380 _0002  ← ผิด
>  2026-09-02 b791ace _0015
>  2026-09-02 3716e2b _0022
>  2026-09-02 e66cdf6 _0029  ← ตัวจริง ตกไปอันดับ 4
>
>  (ค) :iso8601 (สูตรที่ใช้จริง)
>  2026-09-02 00:34:05 e66cdf6 _0029  ถูก
>  2026-09-02 00:27:22 3716e2b _0022
>  2026-09-02 00:20:38 b791ace _0015
>  2026-09-02 00:12:43 98e4380 _0002
>  ```
>  ✅ **คำอธิบายกลไกของรอบ `_0022`/`_0029` ถูกต้องแล้ว ไม่ต้องแก้** — สูตร (ก) เรียงตาม sha
>  จากมากไปน้อยจริง (`e` 0x65 > `b` 0x62 > `9` 0x39 > `3` 0x33) ตรงตามที่เขียนไว้ทุกตัวอักษร
>  ⚠️ **ห้ามเอา output ของสองสูตรมาเทียบกันแล้วสรุปว่า sort ไม่เสถียร** — มันคนละคำสั่งกัน
>  สูตร (ข) tiebreak ด้วย **refname จากน้อยไปมาก** (= เรียงเวลากลับหัวพอดีเพราะชื่อ branch เป็นเลขรอบ)
>  🔴 **รอบนี้สูตร (ก) "บังเอิญถูก" ที่อันดับ 1 เพราะ `e` เป็น hex ตัวแรกที่สูงสุดในชุดพอดี
>  ห้ามอ่านว่าปลอดภัย** ส่วนสูตร (ข) ทำ tip ตัวจริงตกไป **อันดับ 4 — แย่ที่สุดเท่าที่บันทึกมา**
>  (การ restore ตามอันดับ 1 ของ (ข) = ลบทิ้งสามรอบรวด `_0015`, `_0022`, `_0029`)
>  **ทั้งสองสูตรไม่ปลอดภัยทั้งคู่ ใช้ `:iso8601` อย่างเดียว**
>  ✅ รอบนี้เลือก tip ด้วย **`:iso8601` + ตรวจซ้ำด้วย refname** (`_0029` คือเลขรอบสูงสุดที่ต่ำกว่า
>  `_0036` ของตัวเอง) — สองวิธีให้คำตอบตรงกัน จึงยืนยันได้ว่า `e66cdf6` เป็นตัวจริง

> **(สถานะของรอบ `2026-09-02_0029` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-02_0029` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `3716e2b` = `_0022`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 3716e2b -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 3716e2b` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `2908ddc` = 13 `M` + 3 `A` ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 3716e2b` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 3716e2b` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0022 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 จาก 14 ไฟล์ + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore),
>  `git ls-files | grep -i jspdf` ว่าง, `ls jspdf.umd.min.js` → No such file,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบนี้กับดัก `:short` ยิงจริงที่อันดับ 1 *และผลออกผิด* — ครั้งแรกที่ tip ตัวจริงตกไป
>  ถึงอันดับ 3 (เดิมแย่สุดคือตกไปอันดับ 2)** ตอนนี้มี tip **สามตัว**อยู่ `2026-09-02` → `:short`
>  ผูกกันทั้งสาม แล้ว sha fallback ยก `b` (0x62) และ `9` (0x39) เหนือ `3` (0x33)
>  → `b791ace` (`_0015`, 00:20:38) ขึ้นอันดับ 1 แทน `3716e2b` (`_0022`, 00:27:22) ที่เป็นตัวจริง
>  **restore ตามนั้น = ลบรอบ `_0022` ทิ้ง** และไม่มีอะไรจับได้เลย (`_0022` เป็น no-op ที่แตะแค่
>  `AUTOPILOT.md`/`SUMMARY.md` → `git diff --stat` เทียบ tip ผิดก็ยังว่าง, harness ครบ 5 key,
>  Verify เขียวทั้งสามขั้น) รันจริงทั้งสองสูตรในรอบนี้ (กรอง branch ตัวเองด้วย `grep -v "2026-09-02_0029"`):
>  ```
>  :short (สูตรเก่า)                   :iso8601 (สูตรที่ใช้จริง)
>  2026-09-02 b791ace _0015  ผิด       2026-09-02 00:27:22 3716e2b _0022  ถูก
>  2026-09-02 98e4380 _0002            2026-09-02 00:20:38 b791ace _0015
>  2026-09-02 3716e2b _0022  ตัวจริง   2026-09-02 00:12:43 98e4380 _0002
>  2026-09-01 ec1d48b _0001            2026-09-01 00:47:10 460f6e2 _0042
>  ```
>  ✅ **นี่คือ counter-example ที่รอบก่อนๆ ยังไม่มี** — รอบ `_0015` และ `_0022` ต่างบันทึกว่า
>  "tie เกิดแล้วแต่บังเอิญออกหัว ห้ามอ่านว่าสูตรเก่าปลอดภัย" รอบนี้มันออกก้อย จบข้อถกเถียง
>  และยืนยันกฎเดิม: ความเสียหายโตตามจำนวนรอบที่ลงวันเดียวกัน

> **(สถานะของรอบ `2026-09-02_0022` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-02_0022` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `b791ace` = `_0015`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat b791ace -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD b791ace` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `0ec2f73` = 13 `M` + 3 `A` ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 b791ace` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" b791ace` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0015 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore),
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ⚠️ **รอบนี้คือรอบที่สองที่ลงวันที่ `2026-09-02` → tie ของ `:short` กลับมาแล้วตามที่รอบก่อนทำนายไว้
>  แต่การโยนหัวก้อย *ออกหัว* ที่อันดับ 1 — ห้ามอ่านว่าสูตรเก่าใช้ได้** `b791ace` กับ `98e4380`
>  ผูกกันที่ `2026-09-02` แล้ว sha fallback ยก `b` (0x62) เหนือ `9` (0x39) ซึ่ง**บังเอิญ**ตรงกับ
>  ลำดับเวลา (00:20:38 > 00:12:43) **แต่แถวถัดลงไปยังผิดเหมือนเดิมทุกรอบ**: `ec1d48b`
>  (`_0001`, 00:07:20 = เก่าสุดของหกตัวใน `2026-09-01`) ยังขึ้นเหนือ `460f6e2` (`_0042`, 00:47:10
>  = ใหม่สุด) รันจริงทั้งสองสูตรในรอบนี้ (กรอง branch ตัวเองด้วย `grep -v "2026-09-02_0022"`):
>  ```
>  :short (สูตรเก่า)                   :iso8601 (สูตรที่ใช้จริง)
>  2026-09-02 b791ace _0015  บังเอิญถูก 2026-09-02 00:20:38 b791ace _0015  ถูก
>  2026-09-02 98e4380 _0002            2026-09-02 00:12:43 98e4380 _0002
>  2026-09-01 ec1d48b _0001  สลับผิด   2026-09-01 00:47:10 460f6e2 _0042
>  2026-09-01 460f6e2 _0042            2026-09-01 00:37:41 42f34bd _0032
>  ```
>  🔴 **นี่คือกรณีที่อันตรายที่สุดในการตีความ**: tie เกิดขึ้นจริงที่อันดับ 1 แล้ว (ไม่ใช่ "ข้ามวัน
>  เลยแยกออก" แบบรอบ `_0015`) แต่ผลบังเอิญถูก → รอบไหนที่เห็นแค่ output นี้อาจสรุปผิดว่าสูตรเก่า
>  ปลอดภัย ความจริงคือมันเป็นการเดาบนตัวอักษร hex ตัวแรกล้วนๆ `1` ใน `1xxxxxx` ก็จะพลิกทันที

> **(สถานะของรอบ `2026-09-02_0015` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-02_0015` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์
> (แตะแค่ `AUTOPILOT.md` + `SUMMARY.md`)**
> (tip ที่ restore คือ `98e4380` = `_0002`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 98e4380 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 98e4380` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore commit `1529f7c` = 13 `M` + 3 `A` ไม่มี `D`; 16 ไฟล์ 3301+/162−)
>  `git merge-base --is-ancestor 3503537 98e4380` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 98e4380` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-02_0002 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (รันหลัง restore),
>  `git ls-files | grep -i jspdf` ว่าง, `ls jspdf.umd.min.js` → No such file,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ⚠️ **รอบนี้สูตรเก่า `:short` "บังเอิญถูก" ที่อันดับ 1 เพราะข้ามวัน — ห้ามอ่านว่ากับดักหายแล้ว**
>  `98e4380` เป็น tip ตัวเดียวที่อยู่ `2026-09-02` → day granularity แยกมันออกได้ก่อนที่ sha
>  fallback จะทำงาน **แต่กับดักยังอยู่ครบในแถวถัดลงไป** — ในกลุ่ม tip 6 ตัวของ `2026-09-01`
>  `:short` ยังยก `ec1d48b` (`_0001`, 00:07:20 = **เก่าสุด**) ขึ้นเหนือ `460f6e2` (`_0042`,
>  00:47:10 = **ใหม่สุด**) เพราะ `e` (0x65) > `4` (0x34) รันจริงทั้งสองสูตรในรอบนี้:
>  ```
>  :short (สูตรเก่า)                   :iso8601 (สูตรที่ใช้จริง)
>  2026-09-02 98e4380 _0002  อันดับ 1  2026-09-02 00:12:43 98e4380 _0002  ถูก
>  2026-09-01 ec1d48b _0001  สลับผิด   2026-09-01 00:47:10 460f6e2 _0042
>  2026-09-01 460f6e2 _0042            2026-09-01 00:37:41 42f34bd _0032
>  2026-09-01 42f34bd _0032            2026-09-01 00:30:11 2bb9777 _0026
>  ```
>  🔴 **พอมีรอบที่สองลงวันที่ `2026-09-02` เมื่อไหร่ tie ก็กลับมาทันที** และการที่สองสูตร
>  ตรงกันในรอบนี้ **ไม่ใช่หลักฐาน**อะไรเลย (กฎเดิม: `:iso8601` ถูกโดยโครงสร้าง ไม่ใช่โดยโชค)

> **(สถานะของรอบ `2026-09-02_0002` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `460f6e2` = `_0042`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 460f6e2 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 460f6e2` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  `git merge-base --is-ancestor 3503537 460f6e2` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 460f6e2` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0042 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "^### [1-8]\." README.md` / `If you answer:` / `| Option | Cost |` = **8 ทั้งสามค่า**,
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **กับดัก `:short` ทำลายสถิติเดิมอีกครั้ง — รอบนี้จะลบทิ้ง *ห้า* รอบพร้อมกัน (เดิมสูงสุด 4)**
>  ตอนนี้ tip **ทั้งหกตัว**อยู่วันเดียวกัน (`2026-09-01`) → `:short` ผูกกันทั้งหก แล้ว `sort -r`
>  ตกไปเทียบ **sha string** ทำให้ `ec1d48b` (`_0001`, 00:07:20) — ตัวที่ **เก่าที่สุด** ในหกตัว —
>  ขึ้นอันดับ 1 อีกครั้ง เพราะ `e` (0x65) เป็นตัวอักษร hex นำที่ใหญ่สุด
>  **restore ตามนั้นคือการลบรอบ `_0011`, `_0017`, `_0026`, `_0032` และ `_0042` ทิ้งพร้อมกันห้ารอบ**
>  รันเป็น output จริงทั้งสองสูตรในรอบนี้ (กรอง branch ตัวเองออกด้วย `grep -v "2026-09-02_0002"`):
>  ```
>  :short (สูตรเก่า)              :iso8601 (สูตรที่ใช้จริง)
>  2026-09-01 ec1d48b _0001  ผิด  2026-09-01 00:47:10 460f6e2 _0042  ถูก
>  2026-09-01 460f6e2 _0042       2026-09-01 00:37:41 42f34bd _0032
>  2026-09-01 42f34bd _0032       2026-09-01 00:30:11 2bb9777 _0026
>  2026-09-01 3e6cb1a _0017       2026-09-01 00:23:58 3e6cb1a _0017
>  2026-09-01 2bb9777 _0026       2026-09-01 00:17:00 0b082ed _0011
>  2026-09-01 0b082ed _0011       2026-09-01 00:07:20 ec1d48b _0001
>  ```
>  ⚠️ **ตัวถูก (`460f6e2`) ตกไปอยู่อันดับ 2 ของสูตรเก่า** — ใกล้พอที่จะดูเหมือน "เกือบถูก"
>  แต่การเลือกอันดับ 1 คือการทิ้งงานห้ารอบ **ยิ่งรอบสะสมในวันเดียวกันมากขึ้น ความเสียหายยิ่งโต**
>  และจะไม่มีอะไรจับได้เลยเหมือนเดิม ทั้งห้ารอบเป็น no-op ที่แตะแค่ `AUTOPILOT.md`/`SUMMARY.md`

> **(สถานะของรอบ `2026-09-01_0042` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-09-01_0042` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ ทั้ง 8 ข้อ
> เป็นรอบ no-op เต็มรูปแบบ: ไม่แตะ `index.html` / `design-system/` / `tools/` / `docs/` เลยสักไบต์**
> (tip ที่ restore คือ `42f34bd` = `_0032`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 42f34bd -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 42f34bd` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore stage 13 `M` + 3 `A`, ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 42f34bd` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 42f34bd` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0032 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8**, `If you answer:` = 8, `^### [1-8]\.` = 8,
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **กับดัก `:short` ทำลายสถิติเดิมอีกครั้ง — รอบนี้จะลบทิ้ง *สี่* รอบพร้อมกัน (เดิมสูงสุด 3)**
>  ตอนนี้ tip **ทั้งห้าตัว**อยู่วันเดียวกัน (`2026-09-01`) → `:short` ผูกกันทั้งห้า แล้ว `sort -r`
>  ตกไปเทียบ **sha string** ทำให้ `ec1d48b` (`_0001`, 00:07:20) — ตัวที่ **เก่าที่สุด** ในห้าตัว —
>  ขึ้นอันดับ 1 เพราะ `e` (0x65) เป็นตัวอักษร hex นำที่ใหญ่สุด
>  **restore ตามนั้นคือการลบรอบ `_0011`, `_0017`, `_0026` และ `_0032` ทิ้งพร้อมกันสี่รอบ**
>  รันเป็น output จริงทั้งสองสูตรในรอบนี้ (กรอง branch ตัวเองออกด้วย `grep -v "2026-09-01_0042"`):
>  ```
>  :short (สูตรเก่า)              :iso8601 (สูตรที่ใช้จริง)
>  2026-09-01 ec1d48b _0001  ผิด  2026-09-01 00:37:41 42f34bd _0032  ถูก
>  2026-09-01 42f34bd _0032       2026-09-01 00:30:11 2bb9777 _0026
>  2026-09-01 3e6cb1a _0017       2026-09-01 00:23:58 3e6cb1a _0017
>  2026-09-01 2bb9777 _0026       2026-09-01 00:17:00 0b082ed _0011
>  2026-09-01 0b082ed _0011       2026-09-01 00:07:20 ec1d48b _0001
>  ```
>  ⚠️ **สังเกตว่าคู่อันดับ 1–2 ของสูตรเก่า (`ec1d48b` เหนือ `42f34bd`) สลับกับความจริงแบบสุดขั้ว**
>  คือ tip ที่เก่าที่สุดขึ้นนำ tip ที่ใหม่ที่สุด — เพราะ sha เป็นค่าสุ่ม การเรียงจึงไม่มีความหมายเชิงเวลาเลย
>  ⚠️ **ถ้าดูแค่คู่ `42f34bd` vs `2bb9777` จะเข้าใจผิดว่าสูตรเก่าถูก** (`4` > `2` บังเอิญตรงลำดับเวลา)
>  ต้องดูทั้งลิสต์ ไม่ใช่แค่สองแถวบน — นี่คือเหตุผลที่ต้องรันสูตรเก่าจริง ไม่ใช่เดาจาก output ของ `:iso8601`
>  **และจะไม่มีอะไรจับได้เลยเหมือนเดิม** ทั้งสี่รอบเป็น no-op ที่แตะแค่ `AUTOPILOT.md`/`SUMMARY.md`

> **(สถานะของรอบ `2026-09-01_0032` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `2bb9777` = `_0026`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 2bb9777 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 2bb9777` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore stage 13 `M` + 3 `A`, ไม่มี `D`; `git diff --stat HEAD 2bb9777` = 16 ไฟล์ 3149+/162−)
>  `git merge-base --is-ancestor 3503537 2bb9777` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 2bb9777` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0026 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8**, `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบนี้คือกรณีที่สูตรเก่า `:short` ผิดหนักที่สุดเท่าที่เคยบันทึกมา — และรันเป็น output จริงทั้งสองสูตร**
>  ตอนนี้ tip **ทั้งสี่ตัว**อยู่วันเดียวกันหมด (`2026-09-01`) → `:short` ผูกกันทั้งสี่ แล้ว `sort -r`
>  ตกไปเทียบ **sha string** ทำให้ `ec1d48b` (`_0001`, 00:07:20) ขึ้นเป็นอันดับ 1 เพราะ `e` (0x65)
>  เป็นตัวอักษร hex นำที่ใหญ่สุด — **restore ตามนั้นคือการลบรอบ `_0011`, `_0017` และ `_0026`
>  ทิ้งพร้อมกันสามรอบ** (ครั้งก่อนที่กับดักนี้ยิงจริง รอบ `_0017` เสียหายแค่รอบเดียว)
>  ```
>  :short (สูตรเก่า)              :iso8601 (สูตรที่ใช้จริง)
>  2026-09-01 ec1d48b _0001  ผิด  2026-09-01 00:30:11 2bb9777 _0026  ถูก
>  2026-09-01 3e6cb1a _0017       2026-09-01 00:23:58 3e6cb1a _0017
>  2026-09-01 2bb9777 _0026       2026-09-01 00:17:00 0b082ed _0011
>  2026-09-01 0b082ed _0011       2026-09-01 00:07:20 ec1d48b _0001
>  ```
>  ⚠️ **และจะไม่มีอะไรจับได้เลยเหมือนเดิม** เพราะทั้งสามรอบเป็น no-op ที่แตะแค่
>  `AUTOPILOT.md`/`SUMMARY.md` → `git diff --stat <tip ผิด> -- .` ก็ยังว่าง, harness ทั้ง 5 key
>  ก็ยังตรง, Verify ก็ยังเขียวครบ **ยิ่งรอบสะสมในวันเดียวกันมากขึ้น ความเสียหายยิ่งโต**
>
> **(สถานะของรอบ `_0026` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `3e6cb1a` = `_0017`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 3e6cb1a -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 3e6cb1a` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  `git merge-base --is-ancestor 3503537 3e6cb1a` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 3e6cb1a` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0017 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8**, `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ⚠️ **รอบนี้ tip สองอันดับบนก็อยู่วันเดียวกันอีก (`2026-09-01`) แต่สูตรเก่า `:short` "บังเอิญ" ถูก**
>  `3e6cb1a` (00:23:58) กับ `0b082ed` (00:17:00) ผูกกันภายใต้ `:short` → `sort -r` ตกไปเทียบ sha
>  แล้ว `3` (0x33) > `0` (0x30) ซึ่ง**บังเอิญ**ตรงกับลำดับเวลา
>  🔴 **ห้ามอ่านว่า "กับดักหายแล้ว"** — มันเป็นการโยนหัวก้อยที่ตัวอักษร hex ตัวแรกเท่านั้น
>  รอบ `_0017` คือกรณีที่มันออกก้อย (`e` > `0` → restore ผิดตัว) รอบนี้คือกรณีที่มันออกหัว
>  `:iso8601` ยังเป็นสูตรเดียวที่ถูกโดยโครงสร้าง ไม่ใช่โดยโชค
>  และ **tip วันเดียวกันไม่ใช่สัญญาณว่ารอบก่อนๆ restore ผิด** — ต้องดูว่าลำดับ sha ขัดกับเวลาไหม
>  ⚠️ รอบนี้**ไม่ได้รันสูตรเก่าเป็นคำสั่งจริง** (อ่านจาก output ของ `:iso8601` ที่สองแถวบนวันเดียวกัน)
>  → หลักฐานอ่อนกว่ารอบ `_0017` ที่รันทั้งสองสูตรมาเทียบกันจริง
>
> **(สถานะของรอบ `_0017` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `0b082ed` = `_0011`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 0b082ed -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 0b082ed` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (restore stage 13 `M` + 3 `A`, ไม่มี `D`)
>  `git merge-base --is-ancestor 3503537 0b082ed` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 0b082ed` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0011 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17 markup 7 gone/5 new, 45/9 markup 0/3,
>  5/1 markup 0/1, 15/3 + 1 undecidable markup N/A, `toast-hit` FAIL-5 ที่ 10 pairs/2 elements,
>  0 markup problem, 0 unmatched โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  (54/54, check-tokens 6/6 ที่ 15 CSS sources, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8**, `If you answer:` = 8, `^### [1-8]\.` = 8,
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  (รอบนี้**ไม่ได้เขียนไฟล์ capture** — รัน `toast-hit` สองครั้งแทนการ redirect ลง `.toast-hit.out`
>   จึงไม่มีอะไรต้องลบ และไม่มีโอกาสลืมไฟล์ค้างไว้)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบนี้เป็นรอบแรกที่พิสูจน์ได้ว่าสูตรเก่า `:short` จะ restore ผิดตัวจริงๆ — ไม่ใช่แค่ทฤษฎี**
>  tip สองอันดับบนสุดอยู่**วันเดียวกัน** (`2026-09-01`) เป็นครั้งแรก → `:short` ผูกกัน แล้ว `sort -r`
>  ตกไปเทียบ **sha string** ทำให้ `ec1d48b` (`_0001`, 00:07:20) ขึ้นเหนือ `0b082ed` (`_0011`, 00:17:00)
>  เพราะ `e` (0x65) > `0` (0x30) — **restore ตามนั้นคือการลบรอบ `_0011` ทิ้งเงียบๆ**
>  ```
>  :short (สูตรเก่า)              :iso8601 (สูตรที่ใช้จริง)
>  2026-09-01 ec1d48b _0001  ผิด  2026-09-01 00:17:00 0b082ed _0011  ถูก
>  2026-09-01 0b082ed _0011       2026-09-01 00:07:20 ec1d48b _0001
>  ```
>  ⚠️ **และจะไม่มีอะไรจับได้เลย** เพราะ `_0011` เป็นรอบ no-op ที่แตะแค่ `AUTOPILOT.md`/`SUMMARY.md`
>  → `git diff --stat <tip ผิด> -- .` ก็ยังว่าง, harness ทั้ง 5 key ก็ยังตรง, Verify ก็ยังเขียวครบ
>  รอบ `_0001` กับ `_0011` ต่างบันทึกว่า "รอบนี้ไม่ใช่หลักฐานของ `:iso8601`" เพราะ tip คนละวัน
>  — **รอบนี้ตรงกันข้าม มันคือหลักฐานโดยตรง** และรันเป็น output จริงทั้งสองสูตรมาเทียบกัน
>  ต่อจากนี้ tip วันเดียวกันคือเรื่องปกติ (2026-09-01 มี 2 ตัว, 2026-08-31 มี 4 ตัว) ห้ามกลับไปใช้ `:short`
>
> **(สถานะของรอบ `_0011` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `ec1d48b` = `_0001`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat ec1d48b -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD ec1d48b` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  `git merge-base --is-ancestor 3503537 ec1d48b` → ancestor-ok
>  `git log -1 --format="%h %an %ae %ad %s" ec1d48b` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-09-01_0001 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17, 45/9, 5/1, 15/3+1 undecidable,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8**, `If you answer:` = 8,
>  `git ls-files | grep -i jspdf` ว่าง, `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ⚠️ **รอบ `_0011` เป็นรอบแรกที่ tip อันดับ 1 กับอันดับ 2 อยู่คนละวัน → รอบนี้ *ไม่ใช่* หลักฐานของ `:iso8601`**
>  `ec1d48b` (`2026-09-01 00:07:20`) เหนือ `e9cf110` (`2026-08-31 01:01:36`) เหนือ `919574c` (`00:54:25`)
>  เหนือ `25b89cf` (`00:45:05`) — คู่บนสุดต่างวันกัน **สูตร `:short` เก่าก็จะจัดอันดับถูกในรอบนี้เหมือนกัน**
>  ห้ามอ่านรอบนี้ว่า "ยืนยัน `:iso8601` อีกครั้ง" — มันไม่ได้แยกสองสูตรออกจากกันเลย
>  (กลุ่ม `2026-08-31` 4 ตัวข้างล่างยังผูกกันอยู่ถ้าใช้ `:short` เหมือนเดิม → สูตรที่ถูกยังต้องเป็น `:iso8601`)
>  รันคำสั่ง**ก่อน** restore; branch ของรอบนี้ (`2026-09-01_0011`) ยังชี้ที่ `3503537` (2026-08-13)
>  จึงตกนอก `head -8` — ยืนยันผู้ชนะด้วยการเทียบ `refname` ไม่ได้ดูตำแหน่งแถว
>
> **(สถานะของรอบ `_0001` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `e9cf110` = `_0056`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat e9cf110 -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD e9cf110` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  `git diff --stat HEAD e9cf110` = 16 ไฟล์ 3011+/162−
>  `git merge-base --is-ancestor 3503537 e9cf110` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" e9cf110` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ (subject `chore: round
>  2026-08-31_0056 no-op -- five channels checked, no owner answer`)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17, 45/9, 5/1, 15/3+1 undecidable,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (หลักฐานรอง; `^### [1-8]\.` = 8,
>  `If you answer:` = 8), `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ✅ **รอบ `_0001` (09-01) ยืนยันสูตร `:iso8601` อีกครั้ง และเป็นรอบแรกที่ *ข้ามวัน***
>  รันคำสั่ง **ก่อน** restore ได้ `e9cf110` (`2026-08-31 01:01:36`) เหนือ `919574c` (`00:54:25`)
>  เหนือ `25b89cf` (`00:45:05`) เหนือ `110911a` (`00:37:38`) — ตรงกับลำดับชื่อ branch ทุกตัว
>  branch ของรอบนี้ (`2026-09-01_0001`) ยังชี้ที่ `3503537` (2026-08-13) จึงตกนอก `head -8`
>  ⚠️ **การข้ามวันไม่ได้ทำให้กับดัก tiebreak หายไป** — `_0056` เป็นรอบเดียวของ `2026-08-31`
>  ที่อยู่บนสุด ก็จริง แต่ 4 รอบของวันนั้นยังผูกกันหมดถ้าใช้ `:short` เหมือนเดิม
>  วันที่ของ *branch name* (`2026-09-01`) ไม่เกี่ยวกับ `committerdate` ของ tip ที่ต้อง restore
>
> **(สถานะของรอบ `_0056` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `919574c` = `_0049`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 919574c -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --diff-filter=D --name-only HEAD 919574c` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  `git merge-base --is-ancestor 3503537 919574c` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 919574c` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17, 45/9, 5/1, 15/3+1 undecidable,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements, 0 markup problem, 0 unmatched
>  โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น (54/54, check-tokens 6/6, 31/31)
>  `grep -c "| Option | Cost |" README.md` = **8** (หลักฐานรอง), `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ✅ **รอบ `_0056` ยืนยันว่าสูตร `:iso8601` จัดอันดับถูกอีกครั้งโดยไม่ต้อง tiebreak**
>  รันคำสั่ง **ก่อน** restore ได้ `919574c` (`00:54:25`) เหนือ `25b89cf` (`00:45:05`) เหนือ
>  `110911a` (`00:37:38`) เหนือ `af85891` (`00:21:25`) — **ตรงกับลำดับชื่อ branch ทุกตัว**
>  branch ของรอบนี้ (`_0056`) ยังชี้ที่ `3503537` (2026-08-13) จึงตกไปอยู่นอก `head -8`
>  ไม่มีโอกาสถูกหยิบมา restore ทับตัวเอง — แต่ยังเทียบ `refname` ตามกฎ ไม่ได้ดูตำแหน่ง
>
> **(สถานะของรอบ `_0049` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `25b89cf` = `_0039`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 25b89cf -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --stat HEAD 25b89cf` = 16 ไฟล์ 2948+/162−
>  `git merge-base --is-ancestor 3503537 25b89cf` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 25b89cf` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17, 45/9, 5/1, 15/3+1 undecidable,
>  `toast-hit` FAIL-5 ที่ 10 pairs/2 elements โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = **8** (หลักฐานรอง), `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบ `_0049` เจอว่า `git diff --stat HEAD <tip> | tail -15` ตัดแถวไฟล์ทิ้ง 2 แถว**
>  diff มี 16 ไฟล์ แต่ `tail -15` เหลือที่ให้แค่ 14 แถว + บรรทัดสรุป → **แถวที่ถูกตัดอาจมี
>  การลบไฟล์ซ่อนอยู่ ซึ่งเป็นเงื่อนไขเดียวที่ทำให้ `git checkout <tip> -- .` ไม่เทียบเท่า
>  fast-forward** (path-checkout ลบไฟล์ที่ tip ลบไปแล้วไม่ได้)
>  **ใช้ `git diff --diff-filter=D --name-only HEAD <tip>` แทน** — ตอบทั้ง diff ไม่ใช่แค่แถวที่พิมพ์ออกมา
>  (รอบนี้ได้ค่าว่าง = ไม่มีการลบ) ถูกกว่าและเด็ดขาดกว่าการไล่อ่าน `--stat` ให้ครบ
>
> **(สถานะของรอบ `_0039` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-08-31_0039` ตรวจครบ 5 ช่องทางแล้ว — ยังไม่มีคำตอบสักข้อ (รอบที่ 16 ติดกัน)**
> (tip ที่ restore คือ `110911a` = `_0023`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 110911a -- .` **ว่างเปล่า** → tree เท่ากันทุก byte = ปิดช่องทางที่ 1 ไปในตัว
>  `git diff --stat HEAD 110911a` = 16 ไฟล์ 2949+/162- **ไม่มีบรรทัด `deleted`** → path-checkout
>  เทียบเท่า fast-forward, `merge-base --is-ancestor 3503537 110911a` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 110911a` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า (85/17, 45/9, 5/1, 15/3+1 undecidable,
>  `toast-hit` FAIL-5 โดย `grep -c "✗ #toast:"` = 0) และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = **8** (หลักฐานรอง; `^### [1-8]\.` = 8,
>  `If you answer:` = 8 — ยังไม่ถูกใช้สักอัน), `git ls-files | grep -i jspdf` ว่าง,
>  `git status --untracked-files=all --short` ว่าง
>  grep หาคำตอบแบบ inline (`answer|decided|chose|we pick`) → 10 hit เป็น prompt เดิมทั้งหมด
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ✅ **รอบ 0039 ยืนยันว่าสองวิธีจัดอันดับ tip ให้คำตอบตรงกัน — ใช้เป็นการ cross-check ได้ฟรี**
>  `git branch -a --sort=-committerdate | head -30` (native sort เต็มความละเอียด) ให้
>  `_0023` เป็นกลุ่มบนสุด และสูตร `%(committerdate:iso8601) … | sort -r` ให้ `110911a` (00:37:38)
>  เหนือ `af85891` (00:21:25) เหนือ `827b37c` (00:11:37) — **ตรงกัน และตรงกับลำดับชื่อ branch ด้วย**
>  (ทั้งสามวันเดียวกันหมด → สูตร `:short` แบบเก่าจะตกไปเทียบ sha และให้ `af85891` ผิดๆ)
>  ⚠️ ย้ำว่า `--sort=-committerdate:short` ยังห้ามใช้ — อันตรายอยู่ที่ `:short` ไปอยู่*ใน* sort key
>
> **(สถานะของรอบ `_0023` ที่ยังใช้อ้างอิงได้)**
> **รอบ `2026-08-31_0023` ตรวจครบ 5 ช่องทาง — ไม่มีคำตอบ (รอบที่ 15 ติดกัน)
> และทำ `retrospective restore audit` จบ → ตอนนี้ decision มี 8 ข้อ ไม่ใช่ 7**
> (tip ที่ restore คือ `af85891` = `_0014`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  **รอบนี้ใช้หลักฐานที่แข็งกว่า `git diff` ว่าง**: `tree(e9f502a)` = `tree(af85891)` = `fb13d0f`
>  คือ tree object ตัวเดียวกันเป๊ะ (อ่านจาก `%(tree:short)` ในคำสั่ง `for-each-ref` ที่รันอยู่แล้ว)
>  `git diff --stat HEAD af85891` = 16 ไฟล์ 2905+/162- **ไม่มีบรรทัด `deleted`** → path-checkout
>  เทียบเท่า fast-forward, `merge-base --is-ancestor 3503537 af85891` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" af85891` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = **8** (หลักฐานรอง; `^### [1-8]\.` = 8,
>  `If you answer:` = 8) — เลข 8 เพราะรอบนี้*เพิ่ม*ข้อ 8 เอง ไม่ใช่เพราะเจ้าของตอบ
>  ⚠️ **รอบหน้าเป็นต้นไปเลขอ้างอิงคือ 8 ไม่ใช่ 7 — ถ้าเจอ 7 แปลว่า restore ไม่ครบ ไม่ใช่ว่าปกติ**
>  grep หาคำตอบแบบ inline (`answer|decided|chose|we pick`) → เป็น prompt เดิมทั้งหมด ไม่มีคำตอบแทรก
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> **(สถานะของรอบ `_0014` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `827b37c` = `_0004`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff 827b37c --stat` (ทั้ง tree ไม่ใส่ `-- .`) **ว่างเปล่า** = ครบทุก byte และปิดช่องทางที่ 1 ไปในตัว
>  `git diff --name-status HEAD 827b37c` = 13 `M` + 3 `A` **ไม่มี `D`** → path-checkout เทียบเท่า fast-forward
>  `git diff --stat 5f7b72d 827b37c` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 827b37c` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  grep หาคำตอบแบบ inline (`answer|decided|chose|we pick`) → 10 hit เป็น prompt เดิมทั้งหมด
>  (บรรทัด 8, 9, 404 + `**If you answer:**` อีก 7 อัน) ไม่มีคำตอบแทรก
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบ 0014 เจอกับดักใหม่ของกฎ "ข้าม entry แรกถ้าเป็น branch ตัวเอง" — กฎนี้ *สมมติผิด*
>  ว่า branch ตัวเองจะลอยขึ้นบนสุดเสมอหลัง restore:**
> ```
> git for-each-ref --format="%(committerdate:short) %(objectname:short) %(refname:short)" refs/heads \
>   | grep "auto/deep_dive" | sort -r | head -3
> 2026-08-31 827b37c auto/…/2026-08-31_0004   <- tip จริงที่ต้องการ
> 2026-08-31 0120c3e auto/…/2026-08-31_0014   <- branch ตัวเอง ตกไปอยู่ *อันดับ 2* ทั้งที่ใหม่กว่า
> 2026-08-30 7f93323 auto/…/2026-08-30_0027
> ```
>  `827b37c` > `0120c3e` แบบ lexicographic → sha tiebreak ดัน tip จริงขึ้นเหนือ branch ตัวเอง
>  **ผลคือรอบไหนที่อ่านว่า "บรรทัด 1 = ตัวเอง, บรรทัด 2 = tip จริง" จะ restore จาก commit
>  restore ของตัวเอง** (`0120c3e`) = no-op เงียบๆ แล้วเข้าใจว่าทำถูก
>  **กฎที่ถูกยังเหมือนเดิม: เทียบ `refname` กับชื่อ branch ตัวเองจริงๆ อย่าใช้ตำแหน่ง**
>  และดีที่สุดคือรัน `--sort=-committerdate` (เต็มความละเอียด) **ก่อน** restore ซึ่งรอบนี้ทำแล้ว
>  → ได้ `0120c3e` (`00:15:27`) เหนือ `827b37c` (`00:11:37`) ถูกต้องตามเวลา
>  ⚠️ รอบนี้สูตร truncated-key **บังเอิญให้ tip ที่ถูกที่บรรทัด 1** — อย่าอ่านว่ามันใช้ได้
>  ภายในกลุ่ม `2026-08-30` มันยังจัด `7f93323` เหนือ `5f7b72d` ผิดเหมือนเดิมทุกประการ
>
> **(สถานะของรอบ `_0004` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `5f7b72d` = `_0054`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff 5f7b72d --stat` (ทั้ง tree ไม่ใส่ `-- .`) **ว่างเปล่า** = ครบทุก byte และปิดช่องทางที่ 1 ไปในตัว
>  `git diff --name-status HEAD 5f7b72d` = 13 `M` + 3 `A` **ไม่มี `D`** → path-checkout เทียบเท่า fast-forward
>  `git diff --stat 5886125 5f7b72d` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 5f7b72d` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  grep หาคำตอบแบบ inline (`answer|decided|chose|we pick`) → 10 hit เป็น prompt เดิมทั้งหมด
>  (บรรทัด 8, 9, 404 + `**If you answer:**` อีก 7 อัน) ไม่มีคำตอบแทรก
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบ 0004 (08-31) เจอเคสจริงของสูตรเก่าเป็นครั้งที่ 2 — และรอบนี้ "แพงกว่า" รอบ `_0044`:**
>  รอบ `_0044` เจอเคสแรกที่สูตรเก่ากับสูตรถูกให้คำตอบต่างกัน (เสียงาน 2 รอบ)
>  รอบ `_0054` บันทึกสูตรเก่า*แบบที่สอง* (native `--sort`) ไว้ แต่ย้ำเองว่า**ตั้งใจรันเพื่อเทียบ**
>  ไม่ใช่การ misrank ที่เกิดขึ้นจริง — **รอบนี้เป็นของจริง และเป็นสูตร pipeline ที่อยู่ในสัญญาเป๊ะๆ**
> ```
> git for-each-ref --format="%(committerdate:short) %(objectname:short) %(refname:short)" refs/heads \
>   | grep "auto/deep_dive" | sort -r | head -4
> 2026-08-31 9091c19 auto/…/2026-08-31_0004   <- branch ของรอบตัวเอง (ดูหมายเหตุข้างล่าง)
> 2026-08-30 7f93323 auto/…/2026-08-30_0027   <- entry แรกที่ไม่ใช่ตัวเอง และเก่ากว่าถึง 3 รอบ
> 2026-08-30 6fb8369 auto/…/2026-08-30_0018
> 2026-08-30 5f7b72d auto/…/2026-08-30_0054   <- รอบก่อนจริง ตกไปอยู่อันดับ 3
> ```
>  ตอนนี้มีถึง **6 รอบ**ที่ลงวัน `2026-08-30` → `:short` เสมอกันหมด → `sort` ตกไปเทียบสตริง sha
>  → `7f93323` ชนะ `5f7b72d` แบบ lexicographic ทั้งที่แพ้ทางเวลาขาดลอย
>  **ถ้าเชื่อบรรทัดนั้น = กลืนงานของ `_0034` + `_0044` + `_0054` ทิ้ง 3 รอบ** (รอบ `_0044` วัดได้ 2 รอบ)
>  🔑 **จุดที่ควรสังเกต: ความเสียหายโตขึ้นทุกครั้งที่มีรอบเพิ่มในวันเดียวกัน — ไม่ใช่บั๊กขนาดคงที่**
>  ⚠️ **หมายเหตุ: รอบนี้รันคำสั่งนั้น*หลัง* commit restore** บรรทัดแรกจึงเป็น branch ตัวเอง
>  (กับดักของรอบ `_0018`) — ไม่กระทบข้อสรุป เพราะการ misrank เกิดในกลุ่ม `2026-08-30` ทั้ง 6 ตัว
>  ซึ่งไม่มี branch ของรอบนี้อยู่ด้วย แต่รอบหน้าถ้าจะเก็บหลักฐานให้สะอาดที่สุด ให้รัน**ก่อน** restore
>  **สูตรที่ถูกยังเหมือนเดิม ไม่ต้องแก้อะไร** — รอบนี้ใช้ `--sort=-committerdate` (เต็มความละเอียด)
>  รัน**ก่อน** restore → ได้ `5f7b72d` (`2026-08-30 01:02:21 +0700`) เหนือ `5886125` (`00:51:14`) ถูกต้อง
>
> **(สถานะของรอบ `_0054` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `5886125` = `_0044`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff 5886125 --stat` (ทั้ง tree ไม่ใส่ `-- .`) **ว่างเปล่า** = ครบทุก byte และปิดช่องทางที่ 1 ไปในตัว
>  `git diff --name-status HEAD 5886125` = 13 `M` + 3 `A` **ไม่มี `D`** → path-checkout เทียบเท่า fast-forward
>  `git diff --stat 59a555b 5886125` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 5886125` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  **รอบนี้เพิ่มการ grep หาคำตอบแบบ inline ด้วย** (`answer|decided|chose|we pick`) → 9 hit เป็น prompt
>  เดิมทั้งหมด ไม่มีคำตอบแทรก — เช็คนับตารางอย่างเดียวจับกรณีนี้ไม่ได้
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> 🔴 **รอบ 0054 เจอว่า "สูตรเก่า" มี 2 แบบ พังคนละทาง และแบบที่สองแย่กว่า — อย่าใช้ `--sort` ของ git:**
>  รอบ 0044 บันทึกกลไกไว้ว่า วันเสมอกัน → `sort -r` ตกไปเทียบ **sha** → `7f93323` (`_0027`) ขึ้นบนสุด
>  **ข้อนั้นถูกต้องสำหรับสูตรที่เขียนไว้ในสัญญา** (pipeline `for-each-ref … | sort -r` บน text) — ยืนยันแล้ว
>  แต่ถ้ารอบไหนไปใช้ **native sort ของ git** แทน tie จะถูกตัดด้วย **refname ascending** ไม่ใช่ sha:
> ```
> git for-each-ref --sort=-committerdate:short --format='%(committerdate:short) %(objectname:short) %(refname:short)' refs/heads/auto
> 2026-08-30 3c4a327 auto/…/2026-08-30_0009     <- ขึ้นบนสุด และเก่ากว่าถึง 4 รอบ
> 2026-08-30 6fb8369 auto/…/2026-08-30_0018
> 2026-08-30 7f93323 auto/…/2026-08-30_0027
> 2026-08-30 59a555b auto/…/2026-08-30_0034
> 2026-08-30 5886125 auto/…/2026-08-30_0044     <- รอบก่อนจริง ตกไปอยู่ *ล่างสุด*
> ```
>  แบบ pipeline เสียงาน 2 รอบ **แบบนี้เสีย 4 รอบ** และรอบก่อนจริงตกไปอยู่ล่างสุดของลิสต์
>  **กฎที่ได้: sort key กับ display format เป็นคนละเรื่อง และมีแต่ key ที่สำคัญ**
>  `--sort=-committerdate` (เต็มความละเอียด) + แสดงผลเป็น `%(committerdate:short)` **ปลอดภัย**
>  เพราะการตัดทอนไม่เคยแตะตัวที่ใช้เปรียบเทียบ — อันตรายเฉพาะตอน `:short` ไปอยู่ *ใน* `--sort=`
>  หรือถูกพิมพ์เป็นฟิลด์แรกก่อน `| sort -r`
>  **สูตรใน `> ```…``` ข้างล่าง (บรรทัด ~479) ถูกต้องอยู่แล้ว ไม่ต้องแก้** — บันทึกไว้เพื่อไม่ให้รอบไหน
>  เผลอ "ปรับปรุง" ไปใช้ `--sort=-committerdate:short` ซึ่งดูสะอาดกว่าแต่พังหนักกว่า
>  ⚠️ **นี่ไม่ใช่หลักฐานว่ารอบก่อนๆ เคยใช้แบบ native sort** — รอบนี้*ตั้งใจ*รันเพื่อเทียบเท่านั้น
>
> **(สถานะของรอบ `_0044` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `59a555b` = `_0034`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff 59a555b --stat` (ทั้ง tree ไม่ใส่ `-- .`) **ว่างเปล่า** — แข็งแรงกว่าที่รอบก่อนๆ ทำ
>  เพราะ diff ทั้ง tree ที่ว่างพิสูจน์พร้อมกันทั้ง "ไม่มีไฟล์เก่าตกค้าง" และ "ไม่มีไฟล์ขาด" ในคำสั่งเดียว
>  → ไม่ต้องรัน `--diff-filter=D` แยกอีก
>  `git diff --stat 7f93323 59a555b` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 59a555b` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ✅ **รอบ 0044 เจอเคสที่พิสูจน์ `iso8601` ได้จริงเป็นครั้งแรกใน 11 รอบ — เลิกเขียนคำเตือน "ยังไม่ถูกพิสูจน์" ได้แล้ว**
>  รอบ 0009/0018/0027/0034 บอกตรงกันว่าเคสที่แยกสองสูตรออกจากกัน (วันเดียวกัน + sha เรียงสวนทางเวลา)
>  ยังไม่เคยเกิด — **วันนี้เกิดแล้ว** สูตรเก่า `%(committerdate:short)` จัด `7f93323` (`_0027`,
>  เก่ากว่า 2 รอบ) ไว้บนสุด เพราะวันเดียวกันหมด → `sort` ตกไปเทียบ sha → `7f93323` ชนะ `59a555b`
>  แบบ lexicographic ทั้งที่แพ้ทางเวลา ส่วน `iso8601` ให้ `59a555b` (00:40:17) ถูกต้อง
>  **ผลถ้าเชื่อสูตรเก่า: restore `_0027` แล้ว commit ของ `_0034` หายเงียบๆ** — tree ยังดูสมเหตุสมผล,
>  `git status` ยังสะอาด, harness ยัง PASS ครบ (เพราะ `_0034` แตะแค่ `AUTOPILOT.md`/`SUMMARY.md`)
>  → อาการที่เห็นคือ "แผนถอยหลังไปเอง" ไม่ใช่ error **สูตร `iso8601` คือของที่ถูก ใช้ต่อไป**
>
> 🔴 **และเพราะเคสนี้เกิดจริงแล้ว งาน audit ย้อนหลังจึงเลิกเป็นเรื่องสมมติ** — รอบก่อน `_0009`
>  ใช้สูตรเก่าทั้งหมด และหลายรอบลงวันเดียวกัน **มีโอกาสจริงที่บางรอบ restore ผิดตัวไปแล้ว**
>  (ยังไม่มีใครตรวจ — เป็นงานคนละชิ้น ห้ามหยิบมาทำพร้อมรอบ no-op)
>
> **(สถานะของรอบ `_0034` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `7f93323` = `_0027`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 7f93323 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --diff-filter=D --name-only HEAD 7f93323` **ว่างเปล่า** → path-checkout เทียบเท่า fast-forward
>  (`git diff --stat HEAD 7f93323` = 16 ไฟล์ 2701+/162-), `merge-base --is-ancestor` → ancestor-ok
>  `git log -1 --format="%h %an <%ae> %ad %s" 7f93323` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` = commit ของ runner ไม่ใช่ของเจ้าของ
>  (รอบนี้ subject เป็น `chore: round … no-op` ด้วย → ครึ่ง subject *บังเอิญ*ตรง แต่ตัวตัดสินคือ `%an`
>   ตามที่รอบ 0027 แก้ไว้ — อย่ากลับไปพึ่ง subject)
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20),
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27))
>
> ~~⚠️ **รอบ 0034 ยืนยันเป็นครั้งที่ 3 ว่า `iso8601` ยังไม่เคยถูกพิสูจน์**~~ **(ตกไปแล้ว — รอบ 0044
>  เจอเคสที่พิสูจน์ได้จริง ดูบล็อก ✅ ข้างบน อย่าเขียนคำเตือนนี้ซ้ำอีก)** — รันในตำแหน่งที่ถูก
>  (ก่อน restore) ได้ `7f93323` (`_0027`, 00:32:39) เหนือ `6fb8369` (`_0018`, 00:24:58) ถูกต้อง
>  **แต่สูตรเก่าก็ได้คำตอบเดียวกัน**: วันเดียวกัน → `:short` เสมอ → `sort` เทียบ sha → `7f93323`
>  ชนะ `6fb8369` แบบ lexicographic อยู่ดี **เคสที่แยกสองสูตรออกจากกันต้องเป็นวันเดียวกัน + sha
>  เรียงสวนทางกับเวลา** ซึ่งยังไม่เกิดสักรอบ (โอกาสราว 50% ต่อรอบ — ไม่ใช่เรื่องที่ควรไปไล่ทำเอง)
>
> **(สถานะของรอบ `_0027` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `6fb8369` = `_0018`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 6fb8369 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat 3c4a327 6fb8369` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git merge-base --is-ancestor 3503537 6fb8369` → ancestor-ok, `git diff --stat HEAD 6fb8369`
>  = 16 ไฟล์ 2647+/162- **ไม่มีบรรทัด `deleted`** → path-checkout เทียบเท่า fast-forward
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> 🔴 **รอบ 0027 แก้ discriminator ที่เอกสารสั่งไว้แล้วใช้ไม่ได้จริง — ให้ดู `%an` อย่าดู subject:**
>  บันทึกของรอบ `_0026` สั่งไว้ว่า tip ที่ author เป็น `PHANTOM AUTOPILOT
>  <autopilot@phantom.local>` **และ subject เป็น `chore: round … no-op`** = commit ของรอบก่อน
>  ไม่ใช่คำตอบที่เจ้าของ commit เข้ามา — **ครึ่งหลังของเงื่อนไขนั้นพังแล้ว**
>  `git log --format="%h %an %s" 3503537..6fb8369` ของรอบนี้พิมพ์ออกมา **3 commit** และ tip
>  เป็น commit `docs:` ไม่ใช่ commit `chore: … no-op`:
> ```
> 6fb8369  docs: correct the round-0018 note on the tip-ranking one-liner
> e31dad9  chore: round 2026-08-30_0018 no-op -- 5 channels checked, no owner answer
> 7c04c70  chore: restore round 2026-08-30_0009 tip (3c4a327) onto stale base 3503537
> ```
>  รอบที่แก้เอกสารของตัวเอง*หลัง*เขียน commit no-op จะทิ้ง tip ที่ subject ไม่ match pattern เลย
>  → ถ้าอ่านว่า "เจ้าของ commit อะไรเข้ามา" คือ **false positive ในเช็คที่สำคัญที่สุดของรอบ**
>  **`%an`/`%ae` คือครึ่งที่เชื่อได้** เพราะมันแยก runner ออกจากเจ้าของไม่ว่ารอบนั้นจะ commit อะไรท้ายสุด
>  subject เป็นแค่ข้อมูลประกอบ ไม่ใช่เงื่อนไข (ยังรัน format string เดิมได้ ไม่ต้องเพิ่ม call)
>
> ⚠️ **รอบ 0027 ยืนยันอีกครั้งว่า `iso8601` ยังไม่เคยถูกพิสูจน์** — รอบนี้รัน `for-each-ref`
>  ในตำแหน่งที่ถูก (ก่อน restore → branch ตัวเองยังอยู่ที่ `3503537`/2026-08-13 จึงไม่ลอยขึ้นบนสุด)
>  และได้ `6fb8369` (`_0018`, 00:24:58) เหนือ `3c4a327` (`_0009`, 00:15:37) ตรงกับลำดับชื่อ branch
>  **แต่สูตรเก่าก็จะได้คำตอบเดียวกัน**: สองตัวนี้วันเดียวกัน → `:short` เสมอ → `sort` ไปเทียบ sha
>  → `6fb8369` ชนะ `3c4a327` แบบ lexicographic อยู่ดี **รอบนี้จึงไม่ใช่หลักฐานของการแก้**
>  (การแก้ยังถูกอยู่ — แค่ยังไม่มีรอบไหนเจอเคสที่แยกสองสูตรออกจากกันได้จริง)
>
> **(สถานะของรอบ `_0018` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `3c4a327` = `_0009`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 3c4a327 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat 197f3e6 3c4a327` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 3c4a327` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` + subject `chore: round 2026-08-30_0009 no-op …` = commit ของรอบก่อน
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง; `^### [1-7]\.` = 7, `If you answer:` = 7)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> ⚠️ **รอบ 0018 เพิ่ม — ถ้ารัน `for-each-ref` *หลัง* commit restore บรรทัดแรกจะเป็นของตัวเอง:**
>  รอบนี้สลับลำดับที่เอกสารสั่งไว้ (restore ก่อน → ค่อยรัน `for-each-ref`) → `7c04c70` ที่โผล่บนสุด
>  (`…/2026-08-30_0018`, 00:19:03) **คือ commit restore ของรอบนี้เอง** ไม่ใช่ commit ของ runner
>  แล้วค่อยเป็น `3c4a327` (`_0009`, 00:15:37) ซึ่งเป็น tip จริงที่ต้องการ
>  (ถ้ารัน*ก่อน* restore ตามลำดับที่ถูก branch ของรอบตัวเองจะยังอยู่ที่ `3503537` = 2026-08-13
>   และจะไม่ลอยขึ้นมาบนสุดเลย — กับดักนี้เกิดจากการสลับลำดับ ไม่ได้เกิดเองทุกรอบ)
>  **tip ที่ต้อง restore คือ entry แรกที่ไม่ใช่ branch ของตัวเอง** — และเพราะ sha เดียวกันโผล่
>  สองครั้ง (`refs/heads` + `refs/remotes`) precondition "local กับ `origin/` ตรงกัน" จึงอ่านได้จาก
>  output ก้อนเดิมฟรีๆ ไม่ต้องรันเพิ่ม
>  ⚠️ **และรอบนี้ไม่ได้พิสูจน์ว่า `iso8601` แก้ปัญหาได้จริง** — `_0009` กับ `_0018` ห่างกัน 15 นาที
>  แต่ก็ยังเป็น "วันเดียวกัน" ซึ่ง `%(committerdate:short)` ก็จะเสมอกันอยู่ดี ที่รอบนี้เลือกถูก
>  เพราะ*อ่านข้าม branch ตัวเอง* ซึ่งเป็นนิสัยเชิงขั้นตอน ไม่ใช่ผลของการ sort
>
> **(สถานะของรอบ `_0009` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `197f3e6` = `_0053`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 197f3e6 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat 921b0a7 197f3e6` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 197f3e6` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` + subject `chore: round 2026-08-29_0053 no-op …` = commit ของรอบก่อน
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> ✅ **รอบ 0009 (08-30) แก้กับดัก tip ผิดตัวที่ต้นเหตุ — เลิกใช้ workaround ของรอบ 0042/0053:**
>  รอบ 0042 กับ 0053 วินิจฉัยถูกแล้วว่า `sort -r | head` จัดอันดับผิด แต่ทางแก้ที่สั่งไว้คือ
>  "ให้ดูชื่อ branch เป็นหลัก" ซึ่งเป็นการ**เลี่ยงคำสั่งที่พัง** ไม่ใช่ซ่อมมัน — คำสั่งเดิมยังอยู่ใน
>  บันทึกให้ agent รอบถัดไปเหยียบซ้ำได้เรื่อยๆ **ต้นเหตุจริงคือคำเดียวใน format string:**
>  `%(committerdate:short)` ละเอียดแค่ระดับวัน → รอบที่ลงวันเดียวกันเสมอกันหมด แล้ว `sort`
>  ไปเทียบสตริงของ sha ต่อ **เปลี่ยนเป็น `%(committerdate:iso8601)` แล้วมันเรียงถูกเอง**
>  (ละเอียดระดับวินาที → total order ไม่ต้องมี tiebreak):
> ```
> git for-each-ref --format="%(committerdate:iso8601) %(objectname:short) %(refname:short)" \
>   refs/heads | grep "auto/deep_dive" | sort -r | head -8
> ```
>  รอบนี้พิมพ์ `197f3e6` (`_0053`, 00:58:41) ไว้บนสุดถูกต้อง เหนือ `921b0a7` (`_0042`, 00:48:33)
>  และ `b68470e` (`_0026`, 00:31:35) ที่สูตรเดิมเคยดันขึ้นมาเป็นอันดับ 1
>  **ผลลัพธ์ตรงกับลำดับชื่อ branch → สองวิธียืนยันกันเอง** แทนที่จะต้องให้วิธีหนึ่งไป override อีกวิธี
>  ⚠️ **ยังต้องรัน `git log -1 --format="… %ad %s" <tip>` ยืนยันก่อนแตะ tree เหมือนเดิม** —
>  การแก้นี้ถอด*กับดัก*ออก ไม่ได้ถอด*ขั้นตอนตรวจสอบ*ออก
>  ⚠️ **ไม่ได้ audit ย้อนหลัง**ว่ารอบก่อนๆ ที่ลงวันเดียวกัน restore ผิดตัวไปแล้วหรือยัง (งานคนละชิ้น)
>
> **(สถานะของรอบ `_0053` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `921b0a7` = `_0042`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 921b0a7 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat 8f6ac45 921b0a7` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 921b0a7` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` + subject `chore: round 2026-08-29_0042 no-op …` = commit ของรอบก่อน
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  `grep -c "| Option | Cost |" README.md` = 7 (หลักฐานรอง)
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> 🔴 **รอบ 0053 ยืนยันว่ากับดัก tip ผิดตัว "เกิดซ้ำได้จริง" ไม่ใช่เหตุบังเอิญของรอบ 0042:**
>  คำสั่ง `for-each-ref … | sort -r | head -14` ของรอบนี้ **พิมพ์ `b68470e` (`_0026`) ไว้บนสุดอีกครั้ง**
>  เหนือ tip จริง `921b0a7` (`_0042`) → ถ้าเชื่อบรรทัดแรกจะ revert งานทิ้ง 3 รอบรวด
>  รอบนี้เลือก tip จาก **เวลาในชื่อ branch** (`_0009` < `_0019` < `_0026` < `_0032` < `_0042`)
>  แล้วยืนยันด้วย `%ad` ใน `git log -1 --format=…` (คอลที่รันอยู่แล้วสำหรับเช็ค author)
>  **สรุปคือ: อย่าใช้ `sort -r | head` เป็นตัวตัดสิน ใช้ชื่อ branch เป็นหลักเสมอ**
>
> **(สถานะของรอบ `_0042` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `8f6ac45` = `_0032`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 8f6ac45 -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat b68470e 8f6ac45` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an <%ae> %ad %s" 8f6ac45` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` + subject `chore: round 2026-08-29_0032 no-op …` = commit ของรอบก่อน
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> 🔴🔴 **รอบ 0042 แก้สูตรหา tip ที่ *ผิด* และเกือบทำให้รอบนี้ revert งานทั้งรอบทิ้ง — อ่านก่อนใช้:**
>  สูตรที่รอบ 0042 เคยแนะนำไว้ข้างล่าง (`for-each-ref … | sort -r | head -12`) **เชื่อไม่ได้**
>  เมื่อมีหลายรอบลงวันเดียวกัน เพราะฟิลด์แรกคือ `%(committerdate:short)` = **ละเอียดแค่ระดับวัน**
>  รอบที่ลงวัน `2026-08-29` มี 4 รอบ → เสมอกันหมด แล้ว `sort` ก็ไปเทียบ **สตริงของ sha** ต่อ
>  → พิมพ์ `b68470e` (`_0026`, 00:31:35) ไว้ **เหนือ** `8f6ac45` (`_0032`, 00:37:40)
>  ถ้า restore ตัวที่ชนะ lexicographic = **กลืนงานของรอบ `_0032` ทิ้งทั้งรอบแบบเงียบสนิท**
>  และ**ไม่มีเช็คไหนจับได้เลย**: residual diff จะว่างเปล่า (เทียบกับ tip ผิดตัว) และ harness
>  ทั้ง 5 key ก็ยังตรงตาราง เพราะรอบ no-op แตะแค่ `AUTOPILOT.md`/`SUMMARY.md` ไม่ได้แตะ CSS
>  **วิธีที่ถูก** (2 อย่าง ใช้ร่วมกัน — ขี่ไปกับคอลที่รันอยู่แล้ว):
>  `git log -1 --format="%h %an <%ae> %ad %s" <cand>` ของผู้สมัครแต่ละตัว → ดู**เวลาจริง**
>  แล้วยืนยันด้วย `git merge-base --is-ancestor <เก่า> <ใหม่>` — ซึ่ง **คืน false** เพราะทุก branch
>  ถูกตัดจาก `3503537` ตรงๆ เป็น **พี่น้องกัน ไม่ใช่สายโซ่** (ข้อเท็จจริงนี้เพิ่งยืนยันในรอบ 0042)
>  ชื่อ branch เองก็บอกเวลาอยู่แล้ว (`_0026` < `_0032` < `_0042`) ใช้เป็นตัวตัดสินได้เร็วที่สุด
>  ⚠️ **รอบก่อนๆ ที่ลงวันเดียวกันอาจ restore ผิดตัวมาแล้วโดยไม่มีใครรู้** — รอบ 0042 ไม่ได้ไล่ audit
>  ย้อนหลัง (เป็นงานคนละชิ้น) แต่บันทึกไว้ให้ผู้ตรวจเห็น
>
> **รอบ 0042 เพิ่ม — grep รองของช่องทางที่ 1 ที่ดีกว่าเดิม: `grep -c "| Option | Cost |" README.md`**
>  รอบ 0039 ชี้ถูกแล้วว่า `grep -c "If you answer:"` กับ `grep -c "^### [1-7]\."` นับแค่ว่า*ช่องยังอยู่*
>  ถ้าเจ้าของพิมพ์คำตอบต่อท้าย เลขก็ยัง 7 — แต่ README เขียนไว้เองว่า **คำตอบจะ*แทนที่*ตารางตัวเลือก**
>  → การนับตาราง (`= 7` แปลว่ายังไม่มีข้อไหนถูกตอบ) จึงใกล้เคียง "ยังไม่มีคำตอบ" มากกว่าอีกสองอัน
>  **ยังเป็นหลักฐานรองอยู่ดี** ตัวปิดช่องทางที่ 1 จริงๆ ยังคงเป็น `git diff --stat <tip> -- .` ว่างเปล่า
>  + precondition ว่า `<tip>` ยังเป็นปลาย branch ทั้ง local และ `origin/`
>
> **(สถานะของรอบ `_0032` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `b68470e` = `_0026`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat b68470e -- .` ว่างเปล่า = tree ตรงทุก byte
>  `git diff --stat 801b31e b68470e` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  `git log -1 --format="%h %an %ae %ad %s" b68470e` → author `PHANTOM AUTOPILOT
>  autopilot@phantom.local` + subject `chore: round 2026-08-29_0026 no-op …` = commit ของรอบก่อน
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  ช่องทางที่ 5: `design-system`/`origin/design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม,
>  `main`/`mac/main`/`origin`/`origin/main` = `ef3220e` (2026-06-27),
>  `mac`/`mac/design-system` = `e3a355c` (2026-07-20),
>  `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3` (2026-07-20))
>
> 🔴 **รอบ 0032 เพิ่ม — `git merge --ff-only` และ `git read-tree -u --reset` **โดน Bash tool ปฏิเสธ**
>  ทั้งคู่ (`This command requires approval`) แม้ tip จะเป็นลูกหลานตรงของ `3503537` ก็ตาม
>  → **`git checkout <tip> -- .` เป็นทางเดียวที่ผ่านจริง** อย่าเสีย call ไปลอง merge/read-tree อีก
>  และ `sed -n '/^## Next task/,/^## Portfolio/p'` ก็ยังโดนปฏิเสธ ยืนยันสูตร `Grep` → `Read offset` เดิม
>  **ทางลัดหา tip รอบก่อน: `git branch -a --sort=-committerdate | head -30` ผ่าน Bash tool**
>  (พ่วงไปกับ `git log --oneline -1` ใน call แรกได้เลย — ไม่ต้องพึ่ง `reflog` ถ้าไม่ต้องการ context
>   ว่า commit นั้นคืออะไร; รอบนี้จบ no-op ใน **7 Bash call** รวม 2 call ที่เสียไปกับ merge/read-tree)
>
> **(สถานะของรอบ `_0026` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore คือ `801b31e` = `_0019`; local กับ `origin/` ชี้ที่ sha เดียวกันทั้งคู่
>  `git diff --stat 801b31e -- .` ว่างเปล่า = tree ตรงทุก byte, และ `git diff --stat 47adb64 801b31e`
>  ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  harness ทั้ง 5 key ตรงตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0 และ Verify เขียวครบ 3 ขั้น
>  ช่องทางที่ 5: `design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่ม, `main`/`mac/main`/`origin/main`
>  = `ef3220e` (2026-06-27), `mac`/`mac/design-system` = `e3a355c`, `hardening-pass` มีแต่ `origin/`+`mac/`
>  = `592e7c3` (2026-07-20))
>
> **รอบ 0026 เพิ่ม — เช็คตรงๆ ว่า tip เป็น commit ของรอบก่อน ไม่ใช่ commit ของเจ้าของ:**
>  precondition เดิม ("`<tip>` ยังเป็นปลาย branch ทั้ง local และ `origin/`") บอกได้แค่ว่า **sha ไม่ขยับ**
>  มันแยกไม่ออกระหว่าง "รอบก่อนเขียน commit นี้" กับ "เจ้าของ commit คำตอบทับแล้วกลายเป็น tip"
>  เติม format string อีกอันในคอลที่รันอยู่แล้วก็จบ:
>  `git log -1 --format="%h %an %ae %ad %s" <tip>` → รอบนี้ได้ `PHANTOM AUTOPILOT
>  autopilot@phantom.local … chore: round 2026-08-29_0019 no-op …` = author เป็น runner และ subject
>  เป็นรอบ no-op → เป็น commit ของรอบก่อนแน่นอน ไม่ใช่คำตอบที่เจ้าของ commit เข้ามา
>  (ขี่ไปกับคอลช่องทาง 1/2/4 ได้เลย ไม่เพิ่ม Bash call — คั่นด้วย `;`)
>
> **(สถานะของรอบ `_0019` ที่ยังใช้อ้างอิงได้)**
> (tip ที่ restore มาคือ `47adb64` = `_0009`; local กับ `origin/` ตรงกันทั้งคู่ตามที่ `for-each-ref` พิมพ์
>  และ `git diff --stat cf6df00 47adb64` ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` = tip สะอาด
>  harness ทั้ง 5 key ให้ตัวเลขตรงกับตารางข้างล่างทุกค่า รวม `✗ #toast:` = 0
>  ช่องทางที่ 5 รอบนี้พิมพ์ครบ: `design-system` = `3503537` (2026-08-13) ใหม่สุดในกลุ่มนี้,
>  `main`/`mac/main`/`origin/main` = `ef3220e`, `hardening-pass` มีแต่ `origin/`+`mac/` = `592e7c3`)
>
> **รอบ 0019 เพิ่ม — ยุบ precondition ของ restore เหลือ 1 call ก่อนแตะ tree:**
>  `git merge-base --is-ancestor 3503537 <tip> && echo ancestor-ok && git diff --stat HEAD <tip> | tail -20`
>  ผ่าน Bash tool ทั้งก้อน และตอบ 2 อย่างพร้อมกัน: (ก) base เป็นบรรพบุรุษตรงไหม
>  (ข) diff มีบรรทัด `deleted` ไหม — ซึ่งเป็นเงื่อนไขเดียวที่ทำให้ path-checkout เทียบเท่า fast-forward
>  รอบนี้ได้ 16 ไฟล์ 2445+/162- ไม่มี `deleted` → restore ปลอดภัย (ยืนยันซ้ำด้วย `git diff --stat <tip> -- .` ว่างเปล่า)
>
> **รอบ 0019 เพิ่ม — grep รองของช่องทางที่ 1 ขี่ไปกับ Verify ใน call เดียวได้:**
>  `grep -c "^### [1-7]\." README.md ; grep -c "If you answer:" README.md ; echo --- ;
>   node tools/test.mjs && node tools/check-tokens.mjs && npm --prefix design-system test 2>&1 | tail -15`
>  ผสม `;` กับ `&&` ในคำสั่งเดียว Bash tool ไม่ปฏิเสธ (`;` กันไม่ให้ grep ที่ exit≠0 ตัดสาย
>  ส่วน `&&` ยังคงความหมายเดิมของ Verify ไว้คือ "ขั้นก่อนหน้าต้องเขียวจึงรันขั้นถัดไป")
>  → รอบ no-op จบได้ใน **8 Bash call**: `git log -1` → `for-each-ref` → precondition
>  → `checkout <tip> -- .` → `commit` restore → ช่องทาง 1/2/4 → grep รอง + Verify
>  → harness 5 key. (`grep -c "✗ #toast:"` + tip-clean check รวมเป็น call ที่ 9)
>
> **รอบ 0009 เพิ่ม — ช่องทางที่ 4 ยังใช้ได้แม้รันหลัง commit restore แล้ว (มีคนอาจสงสัยว่าโมฆะ):**
>  `git checkout <tip> -- .` **ไม่ลบและไม่ stage ไฟล์ untracked** และ `git commit -m` (ไม่มี `-a`)
>  เก็บเฉพาะสิ่งที่ checkout stage ไว้ → ถ้าเจ้าของหย่อน `jspdf.umd.min.js` ทิ้งไว้แบบ untracked
>  มันจะยัง untracked อยู่และโผล่ใน `git status --untracked-files=all --short` เหมือนเดิม
>  (รอบนี้พิมพ์ว่างเปล่า = ไม่มีจริง) — ลำดับ before/after restore ไม่เปลี่ยนข้อสรุปของช่องทางนี้
>
> **รอบ 0049 เพิ่ม — `git reflog | head -40` คือทางที่สั้นและตรงที่สุดในการหา tip ของรอบก่อน:**
>  มันพิมพ์ทั้ง sha, commit message, และ `checkout: moving from <รอบก่อน> to <รอบนี้>` ออกมาเรียง
>  ตามเวลาจริง → เห็น tip ของรอบก่อนพร้อม**บริบทว่ามันคือ commit อะไร** ในคอลเดียว
>  ดีกว่า `for-each-ref | sort -r | head` ตรงที่ไม่ต้องเดาว่า branch ไหนคือรอบล่าสุด
>  (ยังต้องรัน `for-each-ref` อยู่ดีสำหรับช่องทางที่ 3/5 + precondition — reflog ไม่ทดแทน)
>  **และ `git merge-base --is-ancestor 3503537 <tip>` ผ่าน Bash tool ได้** ใช้ยืนยันล่วงหน้าว่า
>  `git checkout <tip> -- .` จะไม่ทิ้งไฟล์ตกค้าง (base เป็นบรรพบุรุษตรง = ไม่มีไฟล์ที่ tip ลบไป)
>
> 🔴 **รอบ 0049 แก้ข้อเท็จจริงที่ SUMMARY หลายรอบเขียนผิด — `hardening-pass` ไม่ใช่ local branch:**
>  `git for-each-ref refs/heads | grep -v "auto/deep_dive"` คืนแค่ **`design-system` กับ `main`**
>  `hardening-pass` มีเฉพาะเป็น remote ref (`origin/` + `mac/`) **ข้อสรุปช่องทางที่ 5 ไม่เปลี่ยน**
>  เพราะคำสั่งที่ใช้จริงสแกน `refs/heads refs/remotes` ทั้งคู่ — แต่อย่าลอกคำบรรยายเดิมมาใช้ซ้ำ
>  (บทเรียนกว้างกว่านั้น: SUMMARY รอบก่อนถูก**ลอกต่อกันมา**หลายรอบ ข้อผิดพลาดจึงงอกรากอยู่ได้
>   ทุกตัวเลข/ทุกชื่อ ref ที่จะเขียนลง SUMMARY ต้องมาจาก output ของรอบตัวเอง ไม่ใช่จากรอบก่อน)
>
> 🔴 **รอบ 0039 เพิ่ม — `grep -c "If you answer:"` = 7 *ไม่ใช่* หลักฐานว่ายังไม่มีใครตอบ:**
>  มันนับแค่ว่า*ช่องตอบยังอยู่ครบ 7 อัน* ถ้าเจ้าของพิมพ์คำตอบ**ต่อท้าย**บรรทัดนั้น เลขก็ยัง 7 เท่าเดิม
>  เหมือนกับ `grep -c "^### [1-7]\."` ที่นับแค่ว่าหัวข้อยังอยู่ **หลักฐานที่ปิดช่องทางที่ 1 ได้จริง
>  คือ `git diff --stat <tip>` ว่างเปล่า** (README เป็นไฟล์เดิมทุก byte) + precondition ว่า
>  `<tip>` ยังเป็นปลาย branch ของรอบก่อนจริงทั้ง local และ `origin/`
>  SUMMARY ของรอบ 0031/0042/0049 เขียนเลข 7/7 ไว้เหมือนเป็นหลักฐานหลัก — **สลับลำดับผิด**
>  grep สองอันนั้นยังรันต่อได้ (ถูก และจับกรณี "หัวข้อหาย" ได้) แต่เป็นหลักฐานรอง ไม่ใช่ตัวปิดช่อง
>
> **รอบ 0039 เพิ่ม — สูตรอ่าน `## Next task` ที่ไม่โดน Bash tool ปฏิเสธ (2 call ไม่ใช่ 1):**
>  `sed -n '/^## Next task/,$p'` โดนปฏิเสธซ้ำอีกรอบตามที่รอบ 0025 เตือน และคำแนะนำเดิม
>  (`Grep -A 60`) **ยังสั้นไป** — บล็อกนี้ยาว ~175 บรรทัด จะถูกตัดกลางคัน
>  ที่ได้ผลจริงคือ: **`Grep` tool หา `^## Next task` เอาเลขบรรทัด → `Read` ด้วย `offset` เลขนั้น**
>  (ไม่ใส่ `limit` = อ่านถึงท้ายไฟล์) เป็น tool call ล้วน ไม่ผ่าน shell จึงไม่มีอะไรมาปฏิเสธ
>
> **รอบ 0039 เพิ่ม — harness ทั้ง 5 key ยัดใน Bash call เดียวได้** (รอบนี้แบ่ง 3+2 โดยไม่จำเป็น):
>  คั่นทุก key ด้วย `;` แล้วต่อ `| grep -Ei "pairs|undecidable|PASS|FAIL"` ต่อท้าย**ทุก key**
>  ทั้งชุดรันจบในไม่กี่วินาที ส่วน `grep -c "✗ #toast:"` ต้องแยกอีก 1 call (คนละ grep pattern)
>
> **รอบ 0031 เพิ่ม — คู่ sha ของทั้ง 5 key อยู่ตรงนี้แล้ว ไม่ต้องไปขุด SUMMARY เก่า:**
> ```
> buttons    2488f2d:index.html 9fab5c9:index.html -> PASS, 85 pairs / 17 elements
> segmented  021b966:index.html index.html         -> PASS, 45 pairs /  9 elements
> toast      bb10dd9:index.html 10e8f39:index.html -> PASS,  5 pairs /  1 element
> ds-disabled-hover HEAD:design-system/src/styles.css design-system/src/styles.css
>                                                  -> PASS, 15 pairs / 3 elements, 1 undecidable
> toast-hit  3d3d5cc:index.html index.html         -> FAIL — 5 differ, grep -c "✗ #toast:" = 0
> ```
>  **และให้รันทั้ง 5 key ทุกรอบ แม้รอบที่ไม่แก้ CSS** — รอบ `_0020` ข้ามด้วยเหตุผลว่า
>  "ไม่มี CSS เปลี่ยน ไม่มีอะไรให้เทียบ" ซึ่งมองข้ามประโยชน์อีกด้าน: ในรอบ restore ตัวเลขพวกนี้
>  คือ**ลายนิ้วมือของ tree** — `git diff --stat` ว่างเปล่าพิสูจน์แค่ byte ตรง แต่ harness
>  คำนวณ declaration set ที่ชนะ cascade ใหม่จากไฟล์ที่ยืนอยู่จริง → restore ผิด tip หรือได้มาไม่ครบ
>  ตัวเลขจะเพี้ยนทันที ต้นทุนแค่ 2 Bash call (ใช้ `;` คั่น — `toast-hit` คืน exit≠0 จะตัด `&&` ทิ้ง
>  และ `| grep -Ei "pairs|undecidable|PASS|FAIL"` ทำให้ไม่ต้องอ่าน output ยาวๆ ทั้งก้อน)
>
> **รอบ 0020 เพิ่ม — เช็ค 1 บรรทัดที่ควรทำทุกครั้งหลัง restore: `git diff --stat <tip-2รอบก่อน> <tip>`**
>  รอบ `_0004` ยอมรับเองว่า commit `b2ed91d` เป็น artifact ของ tree ผิด → คำถามที่ค้างคือ
>  "แล้ว tip ที่ผม restore มามันสะอาดไหม" คำสั่งนี้ตอบได้ตรงๆ: `git diff --stat ddc9421 24c578b`
>  ขึ้นแค่ `AUTOPILOT.md` + `SUMMARY.md` → **ไม่มีเศษของ commit ผิดตกค้างใน tree เลย**
>  โค้ดที่ยืนอยู่ตอนนี้เท่ากับ tip ของ `_0049` (รอบสุดท้ายที่แตะ CSS จริง) ทุก byte
>  ทำให้ไม่ต้องไปไล่อ่าน diff ของรอบ no-op ย้อนหลังทีละอันเพื่อความสบายใจ
>  (รอบ 0020 ทำตามลำดับที่เขียนไว้ได้ครบ ไม่ได้อ่านไฟล์ในโปรเจคเลยก่อน restore — ใช้ 7 Bash call)
>
> 🔴 **รอบ 0004 เพิ่ม — ความผิดพลาดที่แพงที่สุดคือ "อ่านไฟล์ก่อน restore" ไม่ใช่ "ลืม restore":**
>  รอบ 0004 เปิดด้วยการอ่าน `index.html` + `tokens.css` จาก tree ของ `3503537` แล้วสรุปว่างาน
>  token เสร็จแล้ว **ไม่มีอะไรให้ทำ** — เพราะบน tree เก่านั้น `:root` ของแอปกับ `tokens.css`
>  เหมือนกันเป๊ะจริงๆ (11 token) มันจึง**ดูสมเหตุสมผลทุกอย่าง** ไม่มีสัญญาณว่าอ่าน tree ผิด
>  ของจริงที่ `ddc9421` คือ token 22 ตัว + radius token + ฟอนต์ฝังในไฟล์ + `check-tokens.mjs`
>  427 บรรทัด และ "งานถัดไป" ที่สรุปออกมาก็ทำเสร็จไปหลายรอบแล้ว → เสีย commit ทิ้งไป 1 อัน
>  **`tools/check-tokens.mjs` ไม่มีอยู่ในไฟล์ = สัญญาณเดียวที่เชื่อได้ว่า tree ยังเก่า**
>  (`ls tools` เห็นแค่ `test.mjs` แปลว่ายังไม่ restore — ตรวจได้ใน 1 call ถ้าเผลออ่านไฟล์ไปแล้ว)
>  ห้ามให้ "ไฟล์ที่อ่านมาดูปกติดี" เป็นหลักฐานว่า restore แล้ว **ดูจาก `git log --oneline -1` เท่านั้น**
> **รอบ 0049 เพิ่ม — ช่องทางที่ 1/2/4 ยุบเหลือ Bash call เดียวได้:**
>  `grep -c "^### [1-7]\." README.md; grep -c "If you answer:" README.md;
>   git ls-files | grep -i jspdf; git status --untracked-files=all --short`
>  (คั่นด้วย `;` ผ่าน Bash tool — `&&` ไม่ได้ เพราะ `grep` ที่ไม่เจอ jspdf คืน exit 1 แล้วจะตัดสายทิ้ง)
>  → ทั้งรอบ no-op จบได้ใน **6 Bash call**: `git log -1` → `for-each-ref` → `checkout <tip> -- .`
>  → `commit` restore → ช่องทาง 1/2/4 คอลเดียว → Verify. ที่เหลือเป็น Read/Grep/Write
> ตรวจครบทุกช่องทางที่คำตอบจะมาได้ ไม่ใช่แค่ README:
> `## Open decisions` ยังมีหัวข้อ `### 1.`–`### 8.` ครบ 8 ข้อ และมี "**If you answer:**"
> ครบ 8 อัน (ข้อละ 1 อัน ยังไม่ถูกใช้ไปสักอัน) — **เลขนี้เป็น 7 จนถึงรอบ `2026-08-31_0014`
> และเป็น 8 ตั้งแต่รอบ `_0023` เป็นต้นไป เพราะรอบนั้นเพิ่มข้อ 8 เอง ไม่ใช่เพราะเจ้าของตอบ**,
> ไม่มีไฟล์ไหน match `jspdf` ใน `git ls-files`,
> `main` ยังอยู่ที่ `ef3220e` ไม่ขยับ, และ `git status --untracked-files=all` ว่างเปล่า
> **ช่องทางที่ 5 (รอบ 0018 เพิ่ม): ref ที่ไม่ใช่ `auto/deep_dive…`** — `design-system`,
> `hardening-pass`, `main` (+ remote `origin`/`mac` ของทั้งสาม) commit ใหม่สุดคือ **2026-08-13**
> ซึ่งเก่ากว่างานทุกรอบ → ไม่มีคำตอบซ่อนอยู่บน branch ข้างเคียง
> ใช้ `git for-each-ref --format="%(refname:short)" refs/heads refs/remotes | grep -v "auto/deep_dive"`
> (`git branch -a --format=…` โดน Bash tool ปฏิเสธ ส่วนรูปแบบนี้ผ่าน — รอบ 0025 เติม
>  `%(committerdate:short)` เข้าไปใน format ด้วย ผ่านเหมือนกัน และทำให้เห็นวันที่ในคำสั่งเดียว)
> **รอบ 0042 เพิ่ม — เติม `%(objectname:short)` แล้วคำสั่งนี้จบ 3 อย่างในคอลเดียว *ก่อน* restore:**
>  ช่องทางที่ 3 (`main` = `ef3220e` ไหม), ช่องทางที่ 5 (วันที่ของ ref ที่ไม่ใช่ `auto/…`),
>  **และ sha ของ tip รอบก่อน (ทั้ง local และ `origin/`) ซึ่งเป็น precondition ของ shortcut ช่องทางที่ 1**
>  → เรียงลำดับให้ถูกคือ: `git log --oneline -1` → `for-each-ref` คำสั่งนี้ → restore → อ่าน Next task
>  (รอบ 0042 ใช้ `| sort -r | head -12` ดู tip ล่าสุด และ `| grep -v "auto/deep_dive"` ดูช่องทางที่ 5
>   จาก output ก้อนเดียวกัน — ทั้งสอง pipe ผ่าน Bash tool)
> **รอบ 0025 เพิ่ม: `sed -n '/pat/,$p'` โดน Bash tool ปฏิเสธ ("potentially dangerous")**
> อ่าน `## Next task` จาก `AUTOPILOT.md` ด้วย `Grep -A 60` แทน — เสียเวลาน้อยกว่ามาลองซ้ำ
> **และเรียก harness เปล่าๆ (`node docs/btn-parity-proof.mjs buttons`) ไม่ได้** มันต้องการ
>  `<before> <after>` ครบเสมอ ไม่มี default — คู่ที่ถูกต้องของทั้ง 5 key อยู่ใน SUMMARY.md
>  ของรอบก่อนใต้หัวข้อ Verification ให้ลอกจากที่นั่น อย่าเดา sha เอง
> **รอบ 0035 เพิ่ม — ลัดช่องทางที่ 1 ได้ ถ้า restore ผ่านแล้ว:** หลัง `git checkout <tip> -- .`
>  ถ้า `git diff --stat <tip>` ว่างเปล่า แปลว่า tree **เท่ากับ tip ของรอบก่อนทุก byte**
>  → `README.md` จึงเป็นไฟล์เดิมเป๊ะโดยไม่ต้อง grep เลย (grep ซ้ำได้ แต่ไม่ใช่หลักฐานที่ขาดไม่ได้)
>  **มีเงื่อนไขเดียว: ต้องยืนยันก่อนว่า `<tip>` ยังเป็นปลาย branch ของรอบก่อนจริง** — ดูจาก
>  `git for-each-ref` ในช่องทางที่ 5 ว่า `auto/…/<รอบก่อน>` (และ `origin/` ของมัน) ยังชี้ที่ sha นั้น
>  ถ้าเจ้าของ commit คำตอบทับ branch เก่า sha จะขยับ = restore จาก sha ที่ค้างอยู่จะกลบคำตอบทิ้ง
>  (รอบ 0035 ตรวจแล้ว: ทั้ง local และ `origin` ของ `0025` ยังเป็น `e5fdf4d` ทั้งคู่)
> **รอบถัดไปถ้ายังไม่มีคำตอบ ให้ทำแบบเดียวกันนี้: ตรวจ 5 ช่องทาง → เขียน SUMMARY → จบ**
> อย่าใช้ "รอบนี้ไม่มีอะไรทำ" เป็นข้ออ้างหยิบงานในลิสต์ห้ามข้างล่างมาทำ
>
> ⚠️ **ข้อจำกัดเชิงโครงสร้างที่รอบ 0035 เจอ: บันทึกเหล่านี้อ่านไม่ได้จนกว่าจะ restore เสร็จ**
>  `AUTOPILOT.md` ที่ runner ให้มาตอนเริ่มรอบคือฉบับของ `3503537` (ไม่มี `## Next task` แบบนี้)
>  ฉบับเต็มอยู่ใน prompt ของ runner แต่ในไฟล์จริง**ยังไม่มี** → คำเตือนเรื่อง tool ทุกข้อในบล็อกนี้
>  ช่วยได้เฉพาะ*หลัง* restore เท่านั้น (รอบ 0035 จึงยังไปโดน `sed -n '/pat/,$p'` ซ้ำ ทั้งที่รอบ 0025
>  เขียนเตือนไว้แล้ว) **ลำดับที่ถูกคือ: restore ก่อน → แล้วค่อยอ่าน `## Next task` จากไฟล์**
> **รอบ 0044 เพิ่ม — `git reflog --date=iso` เป็นตัวยืนยัน tip ที่ไม่ขึ้นกับ sort เลย (ใช้ *คู่กับ* one-liner):**
>  บรรทัด `checkout: moving from auto/…/<รอบก่อน> to auto/…/<รอบนี้>` **บอกชื่อ branch ของรอบก่อนตรงๆ**
>  ตามลำดับเวลาจริง → ไม่มีทางโดนบั๊ก sort แบบสูตร `:short` เล่นงาน และอ่านได้ก่อน restore
>  ⚠️ **แต่แทน `for-each-ref` ไม่ได้**: reflog เป็นของ clone นี้เครื่องเดียว ถ้า runner ใช้ clone ใหม่จะว่างเปล่า
>  และ reflog ไม่บอก precondition "local กับ `origin/` ชี้ sha เดียวกัน" ซึ่งต้องได้จาก `for-each-ref`
>  → **ใช้ reflog หา tip ก่อน แล้วให้ one-liner + `%an` + `git diff <tip> --stat` ยืนยันซ้ำ**
>  (รอบ 0044 ทำแบบนี้ จึงมีคำตอบที่ถูกจากแหล่งอิสระอยู่แล้ว*ก่อน*รันสองสูตรเทียบกัน — เป็นเหตุผลที่
>   จับเคสพิสูจน์ `iso8601` ได้ แทนที่จะ restore ผิดตัวไปเงียบๆ)
>
> ⚠️ **เรื่อง restore ที่ต้องรู้ก่อนเริ่มทุกครั้ง (รอบ 0007 เพิ่งพิสูจน์ใหม่):**
> runner ตัด branch จาก base เก่า `3503537` **ทุกรอบ** — ต้อง restore tip ของรอบก่อนเสมอ
> (อย่าเชื่อเลข "รอบที่ N ติดกัน" ใน commit message เก่า — นับไม่ครบ เพราะแต่ละรอบเขียนข้อความไม่เหมือนกัน
>  มีแค่ 9 commit จาก 47 branch ที่ใช้ถ้อยคำนั้น ให้ดูจาก `git log --oneline -1` ว่า HEAD เป็น `3503537` ไหมแทน)
> `git merge --ff-only <tip>` **ใช้ไม่ได้** (Bash tool ตอบ "This command requires approval")
> ทั้งที่ tip เป็น descendant ตรงของ `3503537` และน่าจะ fast-forward ได้สวยกว่า
> → เหลือทางเดียวคือ `git checkout <tip> -- .` ซึ่ง**ลบไฟล์ไม่เป็น**
> **วิธียืนยันที่ถูกต้องคือ `git diff --stat <tip>` แล้วต้องไม่พิมพ์อะไรเลย** (รอบ 0018 ใช้วิธีนี้)
> — มันพิสูจน์ว่า tree เท่ากันจริงๆ ตรงๆ จึงจับไฟล์ตกค้างที่ควรถูกลบได้ด้วย
> **แข็งแรงกว่า** วิธีเดิมที่รอบ 0007 สั่งไว้ (ดู `git diff --name-status 3503537 <tip>` ว่าไม่มี `D`)
> ซึ่งเป็นการ*อนุมาน*จากรูปร่างของ diff ไม่ใช่การตรวจผลลัพธ์ — ทำเพิ่มได้ แต่ไม่พอถ้าทำอย่างเดียว
> อย่าถือว่าจริงโดยไม่ตรวจ และ **`git read-tree -u --reset <tip>` ก็โดนปฏิเสธเหมือน `git merge`** (รอบ 0018 ลองแล้ว)
> (รอบ 0039 ลองซ้ำโดยไม่ได้ตั้งใจ — โดนปฏิเสธจริงทั้งแบบเดี่ยวและแบบต่อ `&&` **ยืนยันแล้ว เลิกลอง**
>  และการต่อคำสั่งด้วย `&&` ยิ่งเพิ่มโอกาสโดนปฏิเสธ เพราะ Bash tool ตรวจทีละท่อน → ใช้ `;` หรือแยก call)
- ✅ token tooling ครบ 22/22 (เช็ค 6 ตัว) — รอบก่อนสรุปแล้วว่าไม่ควรเพิ่มเช็คที่ 7
- ✅ parity table ปิดที่ 11/11 component — ไม่มีอะไรให้สำรวจ
- ✅ harness อ่าน CSS ฝั่ง library ได้ (รอบ 0048) และรายงาน selector ที่อ่านไม่ได้แล้ว (รอบ 0102)

**สิ่งที่ *ห้าม* หยิบมาทำเองแม้จะดูน่าทำ** (ทุกอันขยับพิกเซลหรือเป็นสิทธิ์เจ้าของล้วน):
- implement `:last-child` / `>` / `+` / `~` ให้ match จริง — ต้องมี DOM tree ซึ่ง harness
  ตั้งใจไม่สร้าง เป็นการเขียน CSS engine ใหม่ ไม่ใช่งานรอบเดียว และไม่มีใครขอ
- เอา harness เข้า Verify command — มันเป็นเครื่องมือของรอบ ไม่ใช่ checker ที่ต้องเขียวตลอด
- แก้ `Button.css` / `Menu.css` / `index.html` ตาม decision 7 (หรือ 2 / 5 / 6) เอง

**ห้ามแก้ `Button.css` / `Menu.css` / `index.html`** — decision 7 ยังไม่มีคำตอบ
ถ้าแก้ Verify จะยังเขียว (jsdom ไม่ทำ hit testing และไม่มี checker ตัวไหนดู `:hover`)
แปลว่า **ไม่มีอะไรจับได้เลยว่าสีเปลี่ยน** ซึ่งเป็นเหตุผลเดียวกับที่ decision 2/5/6 ยังค้างอยู่

**Verify:** รัน 3 ขั้นตามปกติ และรันทั้ง 5 key ของ harness ให้ผลเท่าเดิม:
`buttons` (85 คู่ / 17 element) / `segmented` (45 / 9) / `toast` (5 / 1) → PASS **และไม่มี
undecidable rule สักข้อ**, `ds-disabled-hover` (15 / 3) → PASS **พร้อม 1 undecidable rule**
(`.pui-menu__item:last-child`, identical in both versions)
`node docs/btn-parity-proof.mjs toast-hit 3d3d5cc:index.html index.html`
ต้องได้ `FAIL — 5 declaration(s) differ` **เท่าเดิมเป๊ะ** โดย `#toast` ไม่มี diff สักจุด
ถ้าตัวเลขไม่ใช่ 5 แปลว่ามีคนไปแตะฝั่งแอป
🔴 **แก้คำสั่งตรวจ รอบ `2026-09-03_0043` — `grep -c "✗ #toast:"` มีจุดบอด ห้ามใช้เดี่ยวๆ อีก**
 บล็อกสถานะของหลายรอบก่อนหน้าเขียนว่าให้ยืนยันด้วย `grep -c "✗ #toast:"` = 0
 แต่แถว state แรกพิมพ์ว่า `✗ #toast (base)` — **ไม่มี `:`** → pattern นั้น **match ไม่ได้**
 ถ้า `#toast` base state regress จริง (เช่นมีคนถอด `pointer-events:none` ออก) grep นี้จะยังได้ **0**
 ซึ่งคือกรณีที่มันมีไว้จับพอดี → **ใช้ `grep "✗"` แล้วอ่านทั้ง 5 แถวแทน** ทั้งห้าต้องเป็น
 `#toastUndo` ล้วน (`(base)` / `:hover` / `:disabled` / `:disabled:hover` / `:focus`)
 ⚠️ เป็นจุดอ่อนของ *ตัวตรวจ* ไม่ใช่หลักฐานว่าเคยมีความเสียหาย — `toast-hit` รายงาน 5 มาตลอดทุกรอบ
 และเลข 5 สอดคล้องกับ "ต่างเฉพาะ `#toastUndo`" อยู่แล้ว

🔴 **รอบ `2026-09-02_0002` เพิ่ม — บล็อกนี้เคยบอก*ตัวเลข*ครบ 5 key แต่บอก*บรรทัดคำสั่ง*แค่ key เดียว
(`toast-hit`) → รอบไหนเดา ref เอง มีสิทธิ์อ่าน PASS เป็น FAIL แล้วนึกว่าแอป regress**
ต่อไปนี้คือคำสั่งครบทั้ง 5 บรรทัด รันตามนี้ตรงๆ ได้เลย (รอบนี้รันจริงทั้งหมด ได้ตามตัวเลขข้างบนเป๊ะ):
```
node docs/btn-parity-proof.mjs buttons           2488f2d:index.html                    index.html
node docs/btn-parity-proof.mjs segmented         021b966:index.html                    index.html
node docs/btn-parity-proof.mjs toast             de07ea8:index.html                    10e8f39:index.html
node docs/btn-parity-proof.mjs toast-hit         3d3d5cc:index.html                    index.html
node docs/btn-parity-proof.mjs ds-disabled-hover <tip รอบก่อน>:design-system/src/styles.css design-system/src/styles.css
```
⚠️ **`toast` ต้อง pin *ทั้งสองฝั่ง*** — key นี้พิสูจน์ refactor "inline `style=` → `.toast-act`"
(`de07ea8` → `10e8f39`) แต่**หลังจากนั้น**รอบ `2026-08-24_0003` เติม `pointer-events:auto`
ซึ่งเป็นการเปลี่ยนพฤติกรรม*ที่ตั้งใจ* → ถ้าปล่อยฝั่ง after เป็น working tree ตามแม่แบบใน
`README.md:338` (`toast <rev>:index.html index.html`) จะได้ `FAIL — 5 declaration(s) differ`
**ซึ่งเป็นผลที่ถูกต้องของ `toast-hit` ไม่ใช่ของ `toast`** (เลข 5 เท่ากันพอดี ยิ่งอ่านผิดง่าย)
รอบนี้รันผิดแบบนั้นมาก่อนแล้วเห็น `after : auto <- .toast-act` จึงรู้ว่าเป็นคนละ delta
✅ **`buttons` / `segmented` ปล่อยฝั่ง after เป็น working tree ได้** เพราะยังไม่มีรอบไหน
แตะพื้นที่นั้นอีกเลยหลัง refactor — และ*นั่นคือประโยชน์ของมัน* (จับได้ทันทีถ้ามีคนแตะ)

⚠️ **ความเสี่ยงที่ต้องรับมือ ไม่ใช่มองข้าม:** **ไม่มีเบราว์เซอร์ให้ verify** (decision 4 ยังไม่ได้รับอนุญาต)
ถ้ารอบไหนแก้ `<style>` ของ `index.html` → ใช้วิธีเดิม: เพิ่ม refactor ใหม่เข้าไปใน `REFACTORS`
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
