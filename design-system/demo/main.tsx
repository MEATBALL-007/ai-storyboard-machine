import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button, Chip, Input, Textarea, Select, Toggle, Modal, Toast,
  Menu, SegmentedToggle, Swatch, Badge, EmptyState,
} from '../src';
import '../src/styles.css';

function Gallery() {
  const [chip, setChip] = useState('8');
  const [cols, setCols] = useState('3');
  const [toggle, setToggle] = useState(true);
  const [modal, setModal] = useState(false);

  return (
    <div className="gallery">
      <section>
        <h4>Buttons</h4>
        <Button variant="primary">Generate</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="icon">▶ Play</Button>
        <Button variant="tab" active>Shot List</Button>
        <Button variant="tab">Color Bible</Button>
      </section>

      <section>
        <h4>Chips</h4>
        {['4', '6', '8', '12'].map((v) => (
          <Chip key={v} selected={chip === v} onClick={() => setChip(v)}>{v}</Chip>
        ))}
      </section>

      <section>
        <h4>Fields</h4>
        <Input label="Scene Title" defaultValue="คนละเวลา ห้องเดียว" />
        <Select label="Style" options={[{ value: 'realistic', label: 'Realistic' }, { value: 'rough', label: 'Rough Sketch' }]} />
        <Textarea label="Action" defaultValue="She reaches for the cup." />
      </section>

      <section>
        <h4>Toggle / Segmented</h4>
        <Toggle checked={toggle} onChange={setToggle} label="Render AI frame art" />
        <SegmentedToggle
          options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]}
          value={cols}
          onChange={setCols}
        />
      </section>

      <section>
        <h4>Badges</h4>
        <Badge variant="accent">F03</Badge>
        <Badge variant="solid">SPLIT SCREEN</Badge>
        <Badge variant="warn">180° line</Badge>
        <Badge variant="note">note</Badge>
        <Badge variant="ok">clean</Badge>
        <Badge variant="neutral">4.5s</Badge>
        <Badge variant="accent-solid">EDITED</Badge>
      </section>

      <section>
        <h4>Swatches</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 60px)', gap: 6 }}>
          <Swatch color="#f0e4d0" label="HIGH" />
          <Swatch color="#c8a870" label="MID" />
          <Swatch color="#2a2436" label="SHAD" />
          <Swatch color="#FA4616" label="ACC" />
        </div>
      </section>

      <section>
        <h4>Menu</h4>
        <Menu
          header="PANEL F03"
          items={[
            { label: '✎ Edit details', onClick: () => {} },
            { label: '⧉ Duplicate', onClick: () => {} },
            { label: '✕ Delete', onClick: () => {}, danger: true },
          ]}
        />
      </section>

      <section>
        <h4>Modal / Toast</h4>
        <Button variant="ghost" onClick={() => setModal(true)}>Open modal</Button>
        <Modal
          open={modal}
          title="↻ Regenerate Panel"
          subtitle="Add a direction note."
          onClose={() => setModal(false)}
          actions={<>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModal(false)}>Regenerate</Button>
          </>}
        >
          <Textarea label="Note" placeholder="Push in tighter…" />
        </Modal>
        <Toast open message="Panel F03 updated" />
      </section>

      <section style={{ display: 'block' }}>
        <h4>Empty state</h4>
        <EmptyState icon="✦" title="No storyboard yet" description="Write a scene and press Generate." />
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);
