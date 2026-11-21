const ITEMS = [
  ['draw', '✎', 'Gambar'],
  ['project', '▦', 'Project'],
  ['template', '▤', 'Template'],
  ['profile', '☺', 'Profil'],
];

export default function BottomNav({ tab, onTab }) {
  return (
    <nav aria-label="Navigasi utama">
      {ITEMS.map(([k, icon, label]) => (
        <button key={k} className={k === tab ? 'on' : ''} onClick={() => onTab(k)} aria-current={k === tab ? 'page' : undefined}>
          <b>{icon}</b>
          {label}
        </button>
      ))}
    </nav>
  );
}
