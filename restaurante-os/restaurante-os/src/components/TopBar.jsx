import { MENU } from '../engine/simulator';

export function TopBar({ state, onPlay, onPause, onRestart, onAddOrder, speed, onSetSpeed }) {
  const { tick, running, stats, processes } = state;
  const mins = String(Math.floor(tick/60)).padStart(2,'0');
  const secs = String(tick%60).padStart(2,'0');
  const active  = processes.filter(p => p.state !== 'terminado').length;
  const enCola  = processes.filter(p => p.state === 'listo').length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-name">RestauranteOS</div>
        <div className="brand-sub">Simulador de Sistema Operativo</div>
      </div>

      <div className="topbar-center">
        <div className="stat-pill">
          <span className="sp-label">Tiempo</span>
          <span className="sp-val">{mins}:{secs}</span>
        </div>
        <div className="stat-pill">
          <span className="sp-label">Procesos activos</span>
          <span className="sp-val amber">{active}</span>
        </div>
        <div className="stat-pill">
          <span className="sp-label">En cola</span>
          <span className="sp-val teal">{enCola}</span>
        </div>
        <div className="stat-pill">
          <span className="sp-label">Uso de CPU</span>
          <span className="sp-val green">{stats.cpuUtil}%</span>
        </div>
        <div className="stat-pill">
          <span className="sp-label">Completados</span>
          <span className="sp-val">{stats.done}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="add-order-group">
          <span className="add-label">Añadir pedido</span>
          {MENU.map(m => (
            <button key={m.type} className="add-btn"
              onClick={() => onAddOrder(m.type)}
              title={`Añadir ${m.label}`}>
              {m.emoji}
            </button>
          ))}
        </div>
        <div className="speed-wrap">
          <span className="speed-lbl">Velocidad</span>
          <input type="range" min="1" max="5" step="1" value={speed}
            onChange={e => onSetSpeed(+e.target.value)} className="speed-slider"/>
        </div>
        {running
          ? <button className="ctrl-btn btn-pause" onClick={onPause}>Pausar</button>
          : <button className="ctrl-btn btn-play"  onClick={onPlay}>Iniciar</button>
        }
        <button className="ctrl-btn btn-reset" onClick={onRestart}>Reiniciar</button>
      </div>
    </header>
  );
}

export function BottomBar({ algo, algoInfo }) {
  return (
    <footer className="bottombar">
      <div className="bb-concept">
        <span className="bb-tag">Algoritmo activo</span>
        <strong className="bb-algo">{algo}</strong>
        <span className="bb-desc">{algoInfo}</span>
      </div>
      <div className="bb-hint">
        Estados: <strong>Nuevo</strong> → <strong>Listo</strong> → <strong>Ejecutando</strong> → <strong>Terminado</strong>
        · Chef de espaldas = núcleo libre · Ticket en cola = proceso esperando CPU
      </div>
    </footer>
  );
}
