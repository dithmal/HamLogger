const sampleContacts = [
  { callSign: 'K1ABC', band: '20m', mode: 'SSB', rst: '59', time: '14:32 UTC' },
  { callSign: 'JA2XYZ', band: '15m', mode: 'CW', rst: '579', time: '15:08 UTC' },
  { callSign: 'DL7HAM', band: '40m', mode: 'FT8', rst: '-10', time: '16:41 UTC' }
];

export function App() {
  return (
    <main className="shell">
      <section className="header">
        <div>
          <p className="eyebrow">HamLogger</p>
          <h1>Station log</h1>
        </div>
        <button type="button">New QSO</button>
      </section>

      <section className="log-panel" aria-label="Recent contacts">
        <div className="log-row log-heading">
          <span>Call sign</span>
          <span>Band</span>
          <span>Mode</span>
          <span>RST</span>
          <span>Time</span>
        </div>
        {sampleContacts.map((contact) => (
          <div className="log-row" key={`${contact.callSign}-${contact.time}`}>
            <strong>{contact.callSign}</strong>
            <span>{contact.band}</span>
            <span>{contact.mode}</span>
            <span>{contact.rst}</span>
            <span>{contact.time}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
