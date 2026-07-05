import { STATES } from '../engine/simulator';

const STATE_META = {
  [STATES.NEW]:     { label:'Nuevo',     color:'#94a3b8' },
  [STATES.READY]:   { label:'En cola',   color:'#D97706' },
  [STATES.RUNNING]: { label:'Cocinando', color:'#16a34a' },
  [STATES.BLOCKED]: { label:'Bloqueado', color:'#dc2626' },
  [STATES.DONE]:    { label:'Entregado', color:'#6b7280' },
};

export function ProcessList({ processes }) {
  const active = processes.filter(p=>p.state!==STATES.DONE).slice(0,8);
  return (
    <section className="panel">
      <h2 className="panel-title">Pedidos en curso</h2>
      <p className="panel-sub">Cada pedido es un proceso del SO</p>
      <div className="proc-list">
        {active.length===0
          ? <p className="empty-msg">Sin pedidos activos</p>
          : active.map(p=>{
              const meta = STATE_META[p.state]||STATE_META[STATES.NEW];
              const pct  = Math.round(((p.burst-p.remaining)/p.burst)*100);
              return (
                <div key={p.pid} className="proc-row">
                  <span className="proc-emoji">{p.emoji}</span>
                  <div className="proc-body">
                    <div className="proc-header">
                      <span className="proc-name">{p.label}</span>
                      <span className="proc-pid" style={{color:p.color}}>#{p.pid}</span>
                    </div>
                    <div className="proc-state" style={{color:meta.color}}>
                      {meta.label}
                      {p.state===STATES.RUNNING&&p.coreIdx!==null&&` · CPU-${p.coreIdx+1}`}
                      {p.state===STATES.READY&&p.waitTime>0&&` · ${p.waitTime}t`}
                    </div>
                    {p.state!==STATES.NEW&&p.state!==STATES.DONE&&(
                      <div className="proc-bar-wrap">
                        <div className="proc-bar-fill" style={{width:`${pct}%`,background:p.color}}/>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        }
      </div>
    </section>
  );
}

export function RamPanel({ ram }) {
  const used = ram.slots.reduce((a,sl)=>a+sl.mb,0);
  const pct  = Math.round((used/ram.total)*100);
  return (
    <section className="panel">
      <h2 className="panel-title">Memoria RAM</h2>
      <p className="panel-sub">Espacio temporal para procesos activos</p>
      <div className="ram-meta">{used} MB de {ram.total} MB usados</div>
      <div className="bar-track">
        <div className="bar-fill" style={{width:`${pct}%`,background:pct>80?'#dc2626':pct>60?'#D97706':'#16a34a'}}/>
      </div>
      <div className="slot-list">
        {ram.slots.map(sl=>(
          <div key={sl.pid} className="slot-row">
            <span className="slot-emoji">{sl.emoji}</span>
            <span className="slot-name">{sl.name} #{sl.pid}</span>
            <span className="slot-mb">{sl.mb} MB</span>
          </div>
        ))}
        {used<ram.total&&(
          <div className="slot-row slot-free">
            <span className="slot-name">Espacio libre</span>
            <span className="slot-mb">{ram.total-used} MB</span>
          </div>
        )}
      </div>
    </section>
  );
}

export function DiskPanel({ disk }) {
  const pct = Math.round((disk.used/disk.total)*100);
  return (
    <section className="panel">
      <h2 className="panel-title">Disco — despensa</h2>
      <p className="panel-sub">Almacenamiento permanente del sistema</p>
      <div className="ram-meta">{disk.used.toFixed(1)} GB de {disk.total} GB</div>
      <div className="bar-track">
        <div className="bar-fill" style={{width:`${pct}%`,background:'#16a34a'}}/>
      </div>
      <div className="slot-list">
        {disk.files.map((f,i)=>(
          <div key={i} className="slot-row">
            <span className="slot-name">{f.name}</span>
            <span className="slot-mb">{f.gb} GB</span>
          </div>
        ))}
      </div>
      <div className="shelf">
        {['🍅','🥬','🥩','🧀','🍞','🧅','🫒','🥚'].map((e,i)=><span key={i} className="shelf-item">{e}</span>)}
      </div>
    </section>
  );
}
