# Design parity report — `index.html` ↔ Phantom UI design system

วันที่: 2026-08-14 · ผู้จัดทำ: autopilot round `2026-08-14_0023`

**รายงานนี้ไม่เปลี่ยนหน้าตาอะไรเลย** — เป็นอินพุตสำหรับเจ้าของโปรเจคใช้ตัดสินใจก่อนลงมือทำ
acceptance criterion ข้อ 2 (*"element พื้นฐานในแอปหน้าตาตรงกับ component ที่มีชื่อเดียวกันใน
design system"*) ทุกแถวที่ขึ้นว่า **ต่าง** คือจุดที่ต้องเลือกว่า *ขยับแอปเข้าหา design system*
หรือ *ขยับ design system เข้าหาแอป* — ไม่มีคำตอบที่ถูกโดยอัตโนมัติ

## วิธีเก็บข้อมูล

- ฝั่งแอป: `<style>` ใน `index.html` บรรทัด 12–570 (ทั้งบล็อก) + markup ที่เกี่ยวข้อง
- ฝั่ง design system: `design-system/src/components/{Button,Chip,Badge,Modal,EmptyState}/*.css`
  และ `*.tsx` (เพื่อดูชื่อ state class และ semantics ของ element)
- ค่าที่ "inherit" ถูกระบุไว้ในตาราง ไม่นับเป็น "ต่าง" ถ้าค่าที่ได้จริงเท่ากัน
- นับจำนวนจุดด้วยการ scan ไฟล์ ไม่ใช่ประมาณด้วยตา — ตัวเลขในหัวข้อ §7 คือค่าที่นับได้จริง
  (`node -e` scan, 2026-08-14) ซึ่ง**ไม่ตรงกับตัวเลขที่ AUTOPILOT.md ประมาณไว้** ดูหมายเหตุใน §7.1

### สรุปสั้นที่สุด

| element | ตัวแทนในแอป | สถานะ |
|---|---|---|
| Button — tab | `.tab-btn` | **ตรงทุก property** ต่างแค่ชื่อ state class |
| Button — ghost / icon | `.btn-ghost` · `.icon-btn` | ต่าง 1 property (`letter-spacing`) |
| Button — primary | `.btn-primary` | ต่าง 1 property (`letter-spacing`) |
| Button — primary | `#exportPdfBtn` · `#genBtn` · `.pd-save` | **ต่างมาก** — เป็นขนาดที่ design system ไม่มี |
| Chip | `.chip` | ต่าง 2 (`padding`, `cursor`) |
| Chip | `.scene-chip` · `.ai-chip` | ต่างมาก — เป็น variant ที่ design system ไม่มี |
| Badge | `.pc-badge` | ตรง (มี `backdrop-filter` เพิ่ม) |
| Badge | `.pc-special` · `.sev.*` | ต่าง 1–2 (`padding`, `letter-spacing`) |
| Badge | `.pc-dur` · `.pd-edit-badge` · `.pc-lock` · `.pc-imgbadge` | ไม่มี variant คู่กันใน design system |
| Modal | `.modal-bg` / `.modal` | **ตรงทุก property** ต่างแค่ชื่อ state class + a11y |
| EmptyState | `.empty-state` | **ตรงทุก property** |

---

## 1. Button

design system มี 4 variant (`primary` / `ghost` / `icon` / `tab`) ทั้งหมด compose บน base `.pui-btn`
ฝั่งแอปไม่มี base class — แต่ละปุ่มเขียนค่าเต็มของตัวเอง จึงต้องเทียบทีละคู่

### 1.1 Base (`.pui-btn` ↔ กฎ `button{}` ทั่วไปของแอป)

| property | แอป (`button{}` บรรทัด 32) | design system (`.pui-btn`) | ต่าง? |
|---|---|---|---|
| `font-family` | `var(--mono)` | `var(--mono)` | — |
| `cursor` | `pointer` | `pointer` | — |
| `border` | `none` | `1px solid transparent` | **ต่าง** |
| `background` | `none` | (ไม่กำหนดใน base) | — |
| `color` | `inherit` | (ไม่กำหนดใน base) | — |
| `display` | (default `inline-block`) | `inline-flex` | **ต่าง** |
| `align-items` | — | `center` | **ต่าง** |
| `gap` | — | `6px` | **ต่าง** |
| `border-radius` | — | `3px` | **ต่าง** |
| `letter-spacing` | — | `.4px` | **ต่าง** |
| `transition` | — | `.12s` | **ต่าง** |
| `font-size` | (inherit `12px` จาก body) | `10.5px` | **ต่าง** |
| `:disabled` | (ไม่มีกฎรวม) | `opacity:.5; cursor:not-allowed; box-shadow:none` | **ต่าง** |

> `border:none` vs `1px solid transparent` เป็นเรื่องใหญ่กว่าที่เห็น: ปุ่ม primary ของ design system
> จองพื้นที่ border ไว้ 1px ทุกด้าน ปุ่มของแอปไม่จอง ถ้าสลับมาใช้ base เดียวกัน ปุ่ม primary
> ทุกตัวจะโตขึ้น 2px ทั้งกว้างและสูง

### 1.2 primary

| property | `.btn-primary` (+`.modal-actions button`) | `.pui-btn--primary` | ต่าง? |
|---|---|---|---|
| `background` | `var(--accent)` | `var(--accent)` | — |
| `color` | `#000` | `#000` | — |
| `font-weight` | `700` | `700` | — |
| `padding` | `7px 16px` | `7px 16px` | — |
| `font-size` | `11px` | `11px` | — |
| `border-radius` | `3px` | `3px` | — |
| `letter-spacing` | (normal) | `.4px` | **ต่าง** |
| `border` | `none` | `1px solid transparent` | **ต่าง** |
| `:hover box-shadow` | `0 0 14px rgba(255,199,44,.4)` | `0 0 14px rgba(255,199,44,.4)` | — |

**หมายเหตุ:** `.btn-primary` ได้ `padding`/`border-radius`/`font-size` มาจาก `.modal-actions button`
ไม่ใช่จากตัวมันเอง — แปลว่าถ้าเอา `.btn-primary` ไปใช้นอก `.modal-actions` จะได้หน้าตาคนละแบบ
design system ไม่มีปัญหานี้เพราะค่าอยู่ที่ variant

ปุ่ม primary อีก 3 ตัวที่**ไม่ตรง** `.pui-btn--primary`:

| property | `#exportPdfBtn` | `#genBtn` | `.pd-save` | `.pui-btn--primary` |
|---|---|---|---|---|
| `padding` | `5px 12px` | `11px` | `8px` | `7px 16px` |
| `font-size` | `10.5px` | `12px` | `11px` | `11px` |
| `font-weight` | `700` | `800` | `700` | `700` |
| `border-radius` | `3px` | `4px` | `3px` | `3px` |
| `letter-spacing` | `.4px` | `.5px` | — | `.4px` |
| `width` | auto | `100%` | `100%` | auto |
| `:hover shadow` | `0 0 14px …,.45` | `0 0 18px …,.5` | (ไม่มี) | `0 0 14px …,.4` |

`#genBtn` คือ CTA หลักของแอป (ปุ่ม GENERATE) ตั้งใจให้ใหญ่กว่าปุ่มอื่น — **design system
ยังไม่มีแนวคิดเรื่องขนาดปุ่ม (size) เลย** มีแต่ variant เชิงบทบาท นี่คือช่องว่างของ design system
ไม่ใช่ความผิดของแอป

### 1.3 ghost

| property | `.btn-ghost` (+`.modal-actions button`) | `.pui-btn--ghost` | ต่าง? |
|---|---|---|---|
| `background` | (none จาก `button{}`) | `none` | — |
| `color` | `var(--muted)` | `var(--muted)` | — |
| `border` | `1px solid var(--line)` | `1px solid var(--line)` | — |
| `padding` | `7px 16px` | `7px 16px` | — |
| `font-size` | `11px` | `11px` | — |
| `border-radius` | `3px` | `3px` | — |
| `letter-spacing` | (normal) | `.4px` | **ต่าง** |
| `:hover color` | `var(--text)` | `var(--text)` | — |
| `:hover border-color` | `var(--dim)` | `var(--dim)` | — |

`.tour-skip` / `.tour-back` เป็น ghost อีกคู่ที่หน้าตาต่าง (`padding:6px 13px`, `font-size:10.5px`
จาก `.tour-btns button`) และ `.tour-back:disabled{opacity:.3}` ต่างจาก `.pui-btn:disabled{opacity:.5}`

### 1.4 icon

| property | `.icon-btn` | `.pui-btn--icon` | ต่าง? |
|---|---|---|---|
| `padding` | `5px 10px` | `5px 10px` | — |
| `font-size` | `10.5px` | `10.5px` (จาก base) | — |
| `border-radius` | `3px` | `3px` (จาก base) | — |
| `color` | `var(--muted)` | `var(--muted)` | — |
| `border` | `1px solid var(--line)` | `1px solid var(--line)` | — |
| `letter-spacing` | (normal) | `.4px` (จาก base) | **ต่าง** |
| `transition` | (ไม่มี) | `.12s` (จาก base) | **ต่าง** |
| `:hover` | `color:var(--accent); border-color:var(--dim); background:var(--surface)` | เหมือนกัน | — |
| `:disabled` | `opacity:.32; cursor:not-allowed; color:var(--dim)` | `opacity:.32; color:var(--dim)` (+`cursor` จาก base) | — |
| `:disabled:hover` | reset `background:none; border-color:var(--line); color:var(--dim)` | (ไม่มี) | **ต่าง** — แอปดีกว่า |

> `.icon-btn:disabled:hover` ที่แอปมีแต่ design system ไม่มี เป็นบั๊กจริงของ design system:
> `.pui-btn--icon:hover` จะยังเปลี่ยนสีตอน disabled ควรพอร์ตกฎนี้ **จากแอปไป design system**

### 1.5 tab — ตรงทุก property

| property | `.tab-btn` | `.pui-btn--tab` | ต่าง? |
|---|---|---|---|
| `padding` | `5px 11px` | `5px 11px` | — |
| `font-size` | `10.5px` | `10.5px` (base) | — |
| `border-radius` | `3px` | `3px` (base) | — |
| `color` | `var(--muted)` | `var(--muted)` | — |
| `border` | `1px solid transparent` | `1px solid transparent` (base) | — |
| `letter-spacing` | `.4px` | `.4px` (base) | — |
| `transition` | `.12s` | `.12s` (base) | — |
| `:hover` | `color:var(--text); background:var(--surface)` | เหมือนกัน | — |
| active | `.active{color:var(--accent); border-color:var(--dim); background:var(--surface)}` | `.is-active{…}` ค่าเดียวกัน | ชื่อ class ต่าง |

`.dn-toggle button` / `.col-toggle button` / `.ovl-toggle button` เป็น tab อีกตระกูลที่หน้าตาคนละแบบ
(`padding:4px 10px|4px 9px|4px 7px`, `font-size:9.5px|9.5px|9px`, active = `background:var(--surface2)`)
— ตรงกับ `SegmentedToggle` ใน design system มากกว่า `Button--tab` (นอกขอบเขตรายงานนี้)

---

## 2. Chip

| property | `.chip` | `.pui-chip` | ต่าง? |
|---|---|---|---|
| `background` | `var(--surface)` | `var(--surface)` | — |
| `border` | `1px solid var(--line)` | `1px solid var(--line)` | — |
| `border-radius` | `3px` | `3px` | — |
| `padding` | `6px 2px` | `6px 10px` | **ต่าง** |
| `text-align` | `center` | `center` | — |
| `font-size` | `10px` | `10px` | — |
| `color` | `var(--muted)` | `var(--muted)` | — |
| `transition` | `.1s` | `.1s` | — |
| `user-select` | `none` | `none` | — |
| `cursor` | (ไม่กำหนด → `auto`) | `pointer` | **ต่าง** |
| `font-family` | (inherit `var(--mono)` จาก body) | `var(--mono)` | — |
| `:hover` | `border-color:var(--dim); color:var(--text)` | เหมือนกัน | — |
| selected | `.sel{background:var(--accent); color:#000; border-color:var(--accent); font-weight:700}` | `.is-selected{…}` ค่าเดียวกัน | ชื่อ class ต่าง |

**สองข้อที่ต่างมีเหตุผลคนละแบบ:**

- `padding:6px 2px` — chip ในแอปอยู่ใน `.radio-grid` (`grid-template-columns:repeat(4,1fr)`)
  ความกว้างมาจาก grid ไม่ใช่จาก padding ถ้าเปลี่ยนเป็น `6px 10px` ตาม design system
  chip ที่ label ยาว (เช่น `16:9`, `2.39:1`) จะล้นหรือ wrap **ต้องทดสอบด้วยตาก่อนเปลี่ยน**
- `cursor` — `.chip` ในแอปเป็น `<div>` (บรรทัด 642–651) ไม่ใช่ `<button>` จึงไม่ได้
  `cursor:pointer` จากกฎ `button{}` **นี่คือบั๊ก UX จริงในแอป** และเป็นแถวเดียวในรายงานนี้
  ที่แก้ได้โดยไม่ต้องตัดสินใจอะไร (design system ถูก, แอปผิด)

### 2.1 chip อีกสองตระกูลที่ design system ไม่มี

| property | `.scene-chip` | `.ai-chip` | `.pui-chip` |
|---|---|---|---|
| `display` | `flex` (+`gap:6px`) | `flex` (+`gap:6px`) | (block) |
| `padding` | `4px 10px` | `5px 10px` | `6px 10px` |
| `font-size` | `10px` | `9.5px` | `10px` |
| `background` | `var(--surface)` | (ไม่มี) | `var(--surface)` |
| `font-weight` | (normal) | `700` | (normal) |
| `letter-spacing` | — | `.5px` | — |
| `transition` | (ไม่มี) | `.12s` | `.1s` |
| selected | `.active` = accent fill | `.demo`/`.live` = สีตาม state | `.is-selected` = accent fill |

`.ai-chip` ไม่ใช่ chip แบบเลือกได้ — เป็น **status indicator** ที่บังเอิญใช้ทรงเดียวกัน
ถ้าจะรวมเข้า design system ควรเป็น component ใหม่ (`StatusChip`) ไม่ใช่ variant ของ `Chip`

---

## 3. Badge

| property | `.pc-badge` | `.pui-badge` + `--accent` | ต่าง? |
|---|---|---|---|
| `display` | (absolute → block) | `inline-block` | ต่างโดยบริบท |
| `font-size` | `8.5px` | `8.5px` | — |
| `font-weight` | `700` | `700` | — |
| `padding` | `2px 5px` | `2px 5px` | — |
| `border-radius` | `2px` | `2px` | — |
| `letter-spacing` | `.5px` | `.5px` | — |
| `background` | `rgba(0,0,0,.6)` | `rgba(0,0,0,.6)` | — |
| `color` | `var(--accent)` | `var(--accent)` | — |
| `backdrop-filter` | `blur(2px)` | (ไม่มี) | **ต่าง** — แอปมีเพิ่ม |
| ตำแหน่ง | `position:absolute; top:5px; left:5px` | (ไม่มี — ผู้ใช้จัดเอง) | ต่างโดยบริบท |

### 3.1 variant ที่มีคู่กัน

| variant | แอป | design system | ต่าง? |
|---|---|---|---|
| `solid` | `.pc-special`: `background:var(--secondary); color:#000; font-size:7.5px; font-weight:700; padding:1px 5px; letter-spacing:.4px; text-transform:uppercase` | `.pui-badge--solid`: ค่าเดียวกัน แต่ `padding:2px 5px`, `letter-spacing:.5px` | **ต่าง 2** |
| `warn` | `.sev.warn`: `background:rgba(250,70,22,.18); color:var(--secondary)` | `.pui-badge--warn`: เหมือนกัน | — |
| `note` | `.sev.note`: `background:rgba(255,199,44,.16); color:var(--accent)` | `.pui-badge--note`: เหมือนกัน | — |
| `ok` | `.sev.ok`: `background:rgba(120,200,120,.15); color:#7ac87a` | `.pui-badge--ok`: เหมือนกัน | — |

แต่ **base ของ `.sev` ต่างจาก `.pui-badge`**:

| property | `.cont-item .sev` | `.pui-badge` | ต่าง? |
|---|---|---|---|
| `display` | (inline — เป็น `<span>`) | `inline-block` | **ต่าง** |
| `font-size` | `8.5px` | `8.5px` | — |
| `font-weight` | `700` | `700` | — |
| `padding` | `1px 5px` | `2px 5px` | **ต่าง** |
| `border-radius` | `2px` | `2px` | — |
| `letter-spacing` | `.5px` | `.5px` | — |
| `margin-right` | `6px` | (ไม่มี) | ต่างโดยบริบท |

> `display:inline` + `padding` แนวตั้ง = padding บนล่างจะไม่ดัน layout จริง ตรงนี้
> `inline-block` ของ design system ถูกกว่า

### 3.2 badge ที่ design system ไม่มีคู่

| ชื่อ | ค่า | ควรเป็น variant อะไร |
|---|---|---|
| `.pc-dur` | `background:rgba(0,0,0,.6); color:var(--text); font-size:8.5px; padding:2px 5px; radius:2px` (ไม่มี weight/letter-spacing) | `--neutral` — เหมือน `--accent` แต่สีตัวอักษรเป็น `var(--text)` |
| `.pd-edit-badge` | `background:rgba(255,199,44,.85); color:#000; font-size:8px; padding:2px 6px; weight:700; ls:.5px` | `--accent-solid` |
| `.pc-lock` | `background:rgba(255,199,44,.9); color:#000; font-size:8px; padding:1px 6px; ls:.5px` | `--accent-solid` (ต่างจากตัวบนที่ alpha และ padding เท่านั้น) |
| `.pc-imgbadge` | `background:rgba(80,180,90,.85); color:#000; font-size:7px; padding:1px 5px; weight:700; ls:.3px` | `--ok-solid` |

`.pd-edit-badge` กับ `.pc-lock` เป็น badge ทรงเดียวกันที่ต่างกันแค่ `.85` vs `.9` และ `2px` vs `1px`
— แทบแน่ใจว่าไม่ได้ตั้งใจ เป็น drift

---

## 4. Modal — ตรงทุก property

| property | `.modal-bg` | `.pui-modal-bg` | ต่าง? |
|---|---|---|---|
| `display` | `none` | `none` | — |
| `position` / `inset` | `fixed` / `0` | `fixed` / `0` | — |
| `background` | `rgba(0,0,0,.7)` | `rgba(0,0,0,.7)` | — |
| `z-index` | `100` | `100` | — |
| `align-items` / `justify-content` | `center` / `center` | `center` / `center` | — |
| `backdrop-filter` | `blur(3px)` | `blur(3px)` | — |
| open state | `.on{display:flex}` | `.is-open{display:flex}` | ชื่อ class ต่าง |

| property | `.modal` | `.pui-modal` | ต่าง? |
|---|---|---|---|
| `background` | `var(--surface)` | `var(--surface)` | — |
| `border` | `1px solid var(--dim)` | `1px solid var(--dim)` | — |
| `border-radius` | `6px` | `6px` | — |
| `width` / `max-width` | `420px` / `90vw` | `420px` / `90vw` | — |
| `padding` | `20px` | `20px` | — |
| `box-shadow` | `0 20px 60px rgba(0,0,0,.6)` | `0 20px 60px rgba(0,0,0,.6)` | — |
| `font-family` | (inherit `var(--mono)`) | `var(--mono)` | — |
| `color` | (inherit `var(--text)`) | `var(--text)` | — |

| ส่วนย่อย | แอป | design system | ต่าง? |
|---|---|---|---|
| title | `.modal h3`: `13px / var(--accent) / mb 6px / ls .5px` | `.pui-modal__title`: เหมือนกัน | — |
| subtitle | `.modal p.m-sub`: `10px / var(--muted) / mb 14px / lh 1.5` | `.pui-modal__sub`: เหมือนกัน | — |
| actions | `.modal-actions`: `flex / gap 8px / mt 14px / justify flex-end` | `.pui-modal__actions`: เหมือนกัน | — |

**CSS ตรงกัน 100%** ที่ต่างคือส่วนที่ไม่ใช่ CSS:

| เรื่อง | แอป | design system |
|---|---|---|
| `role="dialog"` / `aria-modal` | มีที่ `#shortcutsModal` (บรรทัด 828) เท่านั้น — `#regenModal` (บรรทัด 815) **ไม่มี** | ทุก modal ได้อัตโนมัติ |
| `aria-labelledby` | ใช้ `aria-label` แทน | `aria-labelledby` ชี้ไป title จริง |
| ปิดด้วย Escape | ต้องผูกเองใน JS | `useEffect` ผูกให้ |
| คลิก backdrop ปิด | ต้องผูกเองใน JS | `onBackdrop` ให้มาแล้ว |
| ตัวเลือกขนาด | `.modal-wide{width:540px}` | (ไม่มี) |

> ข้อเสนอ: modal เป็นจุดที่ **ไม่ต้องแก้ CSS เลย** งานที่คุ้มที่สุดคือยก a11y contract
> ของ design system (`role`/`aria-labelledby`/Escape) มาใส่ `#regenModal` และเพิ่ม
> `--wide` เป็น size variant ใน design system

---

## 5. EmptyState — ตรงทุก property

| property | `.empty-state` | `.pui-empty` | ต่าง? |
|---|---|---|---|
| `text-align` | `center` | `center` | — |
| `padding` | `80px 20px` | `80px 20px` | — |
| `color` | `var(--dim)` | `var(--dim)` | — |
| `font-family` | (inherit `var(--mono)`) | `var(--mono)` | — |

| ส่วนย่อย | แอป | design system | ต่าง? |
|---|---|---|---|
| icon | `.big`: `font-size:40px; margin-bottom:14px; opacity:.5` | `.pui-empty__icon`: เหมือนกัน | — |
| title | `h2`: `15px / var(--muted) / mb 8px / weight 500` | `.pui-empty__title`: เหมือนกัน | — |
| desc | `p`: `11px / var(--dim) / lh 1.6 / max-width 340px / margin 0 auto` | `.pui-empty__desc`: เหมือนกัน | — |

markup ก็ตรงกัน (`div.big` → `h2` → `p` เทียบกับ `__icon` → `__title` → `__desc`)
ที่บรรทัด 2230 แอป override สี icon ด้วย inline `style="color:var(--secondary)"` สำหรับ empty state
แบบ error — design system ไม่มี variant นี้ แต่ inline override ก็ทำได้ ไม่ถือว่าขัดกัน

**empty state ขนาดเล็กอีกสองตัวที่ไม่ตรง** (คนละ scale โดยตั้งใจ — อยู่ใน sidebar แคบ 212px):

| ชื่อ | ค่า |
|---|---|
| `.cb-empty` | `font-size:10px; color:var(--dim); font-style:italic; padding:8px 0` |
| `.cont-clean` | `padding:20px 12px; text-align:center; color:#7ac87a; font-size:11px` |

design system ยังไม่มีแนวคิด "empty state ขนาดเล็ก" — ถ้าจะรวม ต้องเพิ่ม size variant

---

## 6. สรุปจำนวนความต่าง

| element | ตรง | ต่าง | ไม่มีคู่ใน design system |
|---|---|---|---|
| Button base | 3 | 10 | — |
| Button primary | 7 | 2 | 3 ปุ่ม (`#exportPdfBtn`, `#genBtn`, `.pd-save`) |
| Button ghost | 8 | 1 | 2 ปุ่ม (`.tour-skip`, `.tour-back`) |
| Button icon | 8 | 2 | — (แอปมี `:disabled:hover` ที่ design system ควรรับไป) |
| Button tab | 9 | 0 | 3 ตระกูล toggle |
| Chip | 10 | 2 | 2 ตระกูล (`.scene-chip`, `.ai-chip`) |
| Badge | 12 | 3 | 4 variant |
| Modal | 20 | 0 | `--wide` size |
| EmptyState | 10 | 0 | size เล็ก |

---

## 7. ค่าที่ยังไม่มี token

### 7.1 `rgba(255,199,44,α)` — accent ที่มีความโปร่งใส

**นับได้จริง 23 จุด** ใน `index.html` (CSS 15 · JS 8) บวก `#FFC72C` แบบดิบอีก 4 จุด

> AUTOPILOT.md ประมาณไว้ว่า "~29 จุด" — ตัวเลขจริงคือ **23** (หรือ 27 ถ้ารวม `#FFC72C` ดิบ)
> ควรแก้ตัวเลขใน AUTOPILOT.md

α ที่ใช้จริง (18 ค่าไม่ซ้ำ — และเขียนสองสไตล์ `.4` กับ `0.4` ปนกัน):

| α | จำนวน | ใช้ที่ไหน (บรรทัด) |
|---|---|---|
| `0` | 2 | CSS: `#genBtn` shadow เริ่มต้น (107) · `@keyframes editPulse` (483) |
| `.05` | 1 | CSS: `.add-card:hover` background (533) |
| `.07` | 1 | CSS: `table.shotlist tr.sel td` background (268) |
| `.16` | 1 | CSS: `.sev.note` background (418) |
| `.32` | 1 | CSS: `.ai-chip.demo` border-color (466) |
| `.35` / `0.35` | 2 | CSS: `.tour-spot` shadow (507) · canvas: `strokeStyle` (3091) |
| `.4` | 2 | CSS: `#logo .mark` shadow (46) · `.btn-primary:hover` shadow (317) |
| `.45` | 1 | CSS: `#exportPdfBtn:hover` shadow (65) |
| `.5` / `0.5` | 4 | CSS: `#genBtn:hover` shadow (109) · `.panel-card.locked` border (542) · canvas: 1719, 3184 |
| `.6` / `0.6` | 3 | CSS: `@keyframes editPulse` (483) · canvas: 1619, 1620 |
| `.85` / `0.85` | 2 | CSS: `.pd-edit-badge` (435) · canvas: 3193 |
| `.9` / `0.9` | 2 | CSS: `.pc-lock` (546) · canvas: 3187 |
| `0.95` | 1 | canvas: `fillStyle` (3110) |

**ทางเลือก A — เพิ่ม token accent-alpha ชุดหนึ่ง** (เช่น `--accent-a05`, `--accent-a16`, `--accent-a40`, …)

- ✅ แก้สี accent ที่เดียวแล้วเงาและ background ทุกจุดตามทันทุกจุด — ตอนนี้ถ้าเปลี่ยน `--accent`
  เงา 15 จุดจะยังเป็นสีเหลืองเดิม กลายเป็นสองสีในหน้าเดียว **นี่คือปัญหาจริงที่รอเกิด**
- ✅ บังคับให้ α ที่ปนกัน 18 ค่ายุบเหลือ scale ที่ตั้งใจ
- ❌ token 8–10 ตัวสำหรับสีเดียว — `tokens.css` ตอนนี้มี 11 ตัว จะโตเกือบเท่าตัว
- ❌ ต้องเลือกว่าจะยุบ `.4`/`.45`/`.5` เป็นค่าเดียวหรือเก็บทั้งสาม (= เปลี่ยนหน้าตา)

**ทางเลือก A′ (แนะนำให้พิจารณา) — token เดียว `--accent-rgb:255,199,44`** แล้วเขียน
`rgba(var(--accent-rgb),.4)`

- ✅ token ตัวเดียว แก้สีที่เดียวได้ครบทั้ง 15 จุด CSS โดยไม่ต้องตัดสินใจเรื่อง α scale เลย
- ✅ ไม่เปลี่ยนหน้าตาแม้แต่พิกเซลเดียว — เป็น mechanical refactor ล้วน
- ❌ ต้องคง `--accent:#FFC72C` ไว้คู่กัน = มีสองแหล่งของสีเดียวกัน ต้องมีเทสต์บังคับให้ตรง
- ❌ ครอบคลุมได้แค่ 15 จุด CSS — อีก 10 จุดที่เหลือเป็น canvas ทั้งหมด (ดูกรอบด้านล่าง)

**ทางเลือก B — ปล่อย hard-code ไว้**

- ✅ ไม่ต้องทำอะไร ไม่มีความเสี่ยง
- ❌ `--accent` ที่มีอยู่กลายเป็น token ที่โกหก: แก้แล้วเปลี่ยนแค่ครึ่งเดียวของที่เห็น

> **ข้อจำกัดที่ต้องรู้ก่อนตัดสินใจ — จุดที่เหลือทั้งหมดอยู่บน `<canvas>`:**
> accent ทั้ง 10 จุดนอก CSS block เป็น `ctx.strokeStyle` / `ctx.fillStyle` ล้วน —
> 8 จุดเป็น `rgba(255,199,44,α)` (บรรทัด 1619, 1620, 1719, 3091, 3110, 3184, 3187, 3193)
> และอีก 2 จุดเป็น `'#FFC72C'` ดิบ (บรรทัด 3468, 3478)
> canvas 2D **ไม่มี CSS cascade** — `var(--accent)` ใช้ไม่ได้เลย ต้องอ่านค่าผ่าน
> `getComputedStyle(document.documentElement).getPropertyValue('--accent')` ซึ่งเป็นการแก้คนละชนิด
> กับการสลับ CSS และมีความเสี่ยงเรื่อง performance ถ้าเรียกในลูปวาด (จุดพวกนี้อยู่ในฟังก์ชันวาด
> panel ที่ถูกเรียกซ้ำทุกครั้งที่ re-render) **แนะนำให้แยกเป็นงานคนละรอบ และแคชค่าไว้ครั้งเดียว**
> ผลที่ตามมา: ไม่ว่าจะเลือก A หรือ A′ ก็ยัง**ไม่ได้แหล่งเดียวจริง** จนกว่าจะจัดการฝั่ง canvas

### 7.2 สีเขียว `#7ac87a` (success / OK)

**นับได้จริง 5 จุด** ของ `#7ac87a` (CSS 4 · JS 1) และมี **สีเขียวอีก 3 เฉด**ที่ไม่ใช่ตัวเดียวกัน:

| ค่า | จุด | ใช้ที่ไหน |
|---|---|---|
| `#7ac87a` | 4 | `.sev.ok` color, `.cont-clean`, `.ai-chip.live` color, `.ai-chip.live .dot` |
| `#7ac87a` | 1 | JS บรรทัด 2985 (สีผลเทสต์ในหน้า) |
| `rgba(120,200,120,.15)` | 1 | `.sev.ok` background — RGB **ไม่ตรง** `#7ac87a` (= `122,200,122`) |
| `rgba(122,200,122,.4)` / `(.65)` | 2 | `.ai-chip.live` border, dot shadow |
| `rgba(80,180,90,.85)` | 1 | `.pc-imgbadge` background — เขียวคนละเฉดไปเลย |

design system ก็มีปัญหาเดียวกัน: `Badge.css` เขียน `rgba(120,200,120,.15)` คู่กับ `color:#7ac87a`
— **ความไม่ตรงกันนี้ถูกคัดลอกไปแล้วทั้งสองฝั่ง**

**ทางเลือก A — เพิ่ม `--ok:#7ac87a` (+ `--ok-rgb` ถ้าเลือก A′ ข้างบน) ใน `tokens.css`**

- ✅ palette ของโปรเจคมี 3 บทบาท: accent (เหลือง) / secondary (ส้ม) / **ok (เขียว)** — สองตัวแรก
  มี token ตัวที่สามไม่มี ทั้งที่ใช้จริง 8 จุด นี่คือช่องว่างที่ชัดเจนที่สุดในรายงานนี้
- ✅ บังคับให้เขียว 3 เฉดยุบเหลือหนึ่ง
- ❌ ยุบ `120,200,120` → `122,200,122` และ `80,180,90` → `122,200,122` **คือการเปลี่ยนหน้าตา**
  (`.pc-imgbadge` จะเปลี่ยนสีที่มองเห็นได้จริง) ต้องเป็นการตัดสินใจของเจ้าของ
- ❌ ต้องแก้ `Badge.css` ฝั่ง design system ด้วย ไม่งั้นทั้งสองฝั่งยังเพี้ยนคนละแบบ

**ทางเลือก B — ปล่อย hard-code ไว้**

- ✅ ไม่เสี่ยงเปลี่ยนหน้าตาโดยไม่ได้ตั้งใจ
- ❌ เขียว 3 เฉดจะขยายพันธุ์ต่อไปทุกครั้งที่เพิ่มฟีเจอร์ที่ต้องบอก "สำเร็จ"

### 7.3 Spacing / radius / font-size scale

**`font-size`** — 17 ค่าไม่ซ้ำใน CSS block (นับ 104 จุด):

`8px×6` `8.5px×11` `9px×12` `9.5px×11` `10px×22` `10.5px×9` `11px×15` `12px×7` `13px×3`
`14px×1` `15px×1` `16px×1` `18px×1` `26px×1` `40px×1` `7px×2` `7.5px×1`

17 ค่าสำหรับ type scale เดียวถือว่าเยอะมาก — และ 6 ค่าใช้ครั้งเดียว (`14/15/16/18/26/40px`)

**`border-radius`** — 6 ค่า (56 จุด): `1px×2` `2px×11` `3px×31` `4px×5` `5px×4` `6px×3`
→ `3px` คือ default ที่แท้จริง, `2px` สำหรับ badge, `5–6px` สำหรับ surface ใหญ่ ค่อนข้างเป็นระบบอยู่แล้ว

**`padding`** — 49 combination ไม่ซ้ำ (85 จุด) ไม่มี scale ที่มองเห็นได้
**`gap`** — 9 ค่า (28 จุด): `3px 4px 5px 6px 7px 8px 12px 14px 24px` → `6px` เด่นสุด (9 จุด)

**ทางเลือก A — เพิ่ม `--fs-*` / `--sp-*` / `--r-*` scale ใน `tokens.css`**

- ✅ ค่าที่ใช้ครั้งเดียว 6 ค่าจะถูกบังคับให้เลือก step ที่ใกล้ที่สุด = scale สะอาดขึ้นจริง
- ✅ ทำให้ design system ตอบได้ว่า "ปุ่มควร padding เท่าไหร่" ตอนนี้ตอบไม่ได้
- ❌ **แพงและเสี่ยงที่สุดในรายงานนี้** — ต้องแตะ ~245 declaration และแทบทุกการปัดค่า
  (`9.5px` → `10px`? `4px 9px` → `4px 8px`?) คือการเปลี่ยนหน้าตาที่ต้องตรวจด้วยตาทีละจุด
- ❌ ไม่มีเทสต์ที่จับ regression ทางสายตาได้ — `tools/test.mjs` ทดสอบแค่ pure logic

**ทางเลือก B — ปล่อย hard-code ไว้ ทำเฉพาะสี**

- ✅ ได้ประโยชน์หลัก (token สีมีแหล่งเดียว) โดยแทบไม่เสี่ยง
- ✅ ตรงกับ `tokens.css` วันนี้ที่จงใจมีแต่สี + font — spacing ไม่เคยเป็น token ตั้งแต่แรก
- ❌ criterion ข้อ 1 พูดถึง "ค่าสี/**ระยะ**" — ถ้าเลือก B ต้องแก้ criterion ให้ตรงความจริง

**ทางเลือก B′ (สายกลาง) — ทำเฉพาะ `--r-sm:2px` / `--r-md:3px` / `--r-lg:6px`**

- ✅ `border-radius` เป็น scale เดียวที่**เป็นระบบอยู่แล้ว** ยุบ `4px`(5 จุด) และ `5px`(4 จุด)
  เข้า `3px`/`6px` เปลี่ยนหน้าตาน้อยมากและตรวจได้ครบใน 9 จุด
- ❌ ได้ประโยชน์น้อยกว่า A มาก

---

## 8. สิ่งที่เจ้าของต้องตัดสินใจ (เรียงตามความคุ้มค่า)

| # | คำถาม | ทางเลือก | ผลต่อหน้าตา |
|---|---|---|---|
| 1 | `.chip` ควรมี `cursor:pointer` ไหม | ควร — design system ถูก | ไม่เปลี่ยน (แค่ cursor) |
| 2 | เพิ่ม `--ok` (§7.2) ไหม และยุบเขียว 3 เฉดเหลือกี่เฉด | A / B | **เปลี่ยน** ถ้ายุบ |
| 3 | accent-alpha ใช้ A (token ชุด) / A′ (`--accent-rgb`) / B | A′ ไม่เปลี่ยนหน้าตาเลย | A เปลี่ยน · A′ ไม่เปลี่ยน |
| 4 | `letter-spacing:.4px` บนปุ่ม — เอาเข้าแอปหรือถอดจาก design system | เข้าแอป / ถอด DS | **เปลี่ยน** (เล็กน้อย) |
| 5 | `.chip` padding `6px 2px` → `6px 10px` | ต้องดูด้วยตาก่อน — เสี่ยง label ล้น | **เปลี่ยน** |
| 6 | ปุ่ม primary 3 ขนาด — เพิ่ม size variant ให้ design system หรือบังคับให้แอปใช้ขนาดเดียว | เพิ่ม size / บังคับ | บังคับ = **เปลี่ยนมาก** |
| 7 | badge 4 variant ที่ไม่มีคู่ — เพิ่มเข้า design system ไหม | เพิ่ม / ปล่อย | ไม่เปลี่ยน ถ้าเพิ่ม |
| 8 | spacing/font-size scale (§7.3) — A / B / B′ | B′ คือสายกลาง | A **เปลี่ยนมาก** |
| 9 | ยก a11y contract ของ Modal เข้า `#regenModal` | ควร | ไม่เปลี่ยน |
| 10 | ชื่อ state class — แอป `.sel`/`.on`/`.active` vs DS `.is-selected`/`.is-open`/`.is-active` | รวมหรือไม่รวม | ไม่เปลี่ยน (ต้องแก้ JS ด้วย) |

**ข้อ 1, 3(A′), 7, 9 เปลี่ยนได้โดยไม่กระทบหน้าตาเลย** — ถ้าอยากเดินหน้าโดยไม่ต้องรอการตัดสินใจ
เชิงดีไซน์ สี่ข้อนี้คือชุดที่ทำได้ทันที

## 9. สิ่งที่รายงานนี้ไม่ครอบคลุม

- component อีก 7 ตัวใน design system (`Field`, `Menu`, `SegmentedToggle`, `Swatch`, `Toast`,
  `Toggle`) — criterion ข้อ 2 ระบุแค่ 5 element
- `storyboard-simulator.html` (out of scope)
- การเทียบด้วยภาพจริง — รายงานนี้เทียบจาก CSS source ไม่ได้ render เปรียบเทียบ
  ค่าที่ "ตรงทุก property" ยังอาจต่างกันได้จาก specificity หรือ inline style ที่ JS ใส่ตอน runtime
