import { ALGOS, STATES, RR_QUANTUM } from '../engine/simulator';

function AlgoDiagram({ algo }) {
  return (
    <svg width="100%" viewBox="0 0 320 128" style={{display:'block',margin:'6px 0'}}>
      <defs>
        {[['a1','#A08060'],['a2','#16a34a'],['a3','#D97706'],['a4','#dc2626']].map(([id,c])=>(
          <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
        ))}
      </defs>
      {/* Nodes */}
      {[
        {label:'Nuevo',     x:28,  y:64,  c:'#94a3b8', r:22},
        {label:'Listo',     x:110, y:24,  c:'#D97706', r:22},
        {label:'Ejecutando',x:210, y:24,  c:'#16a34a', r:28},
        {label:'Terminado', x:292, y:64,  c:'#6b7280', r:22},
        {label:'Bloqueado', x:210, y:104, c:'#dc2626', r:20},
      ].map(n=>(
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.c+'22'} stroke={n.c} strokeWidth={n.label==='Ejecutando'?2:1.5}/>
          <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
            style={{fontSize:n.label==='Ejecutando'?7.5:8,fontWeight:600,fill:n.c,fontFamily:'Inter,system-ui,sans-serif'}}>
            {n.label}
          </text>
        </g>
      ))}
      {/* Arrows */}
      <line x1={50} y1={56} x2={92} y2={38} stroke="#A08060" strokeWidth={1} markerEnd="url(#a1)"/>
      <line x1={132} y1={24} x2={182} y2={24} stroke="#16a34a" strokeWidth={1.5} markerEnd="url(#a2)"/>
      <text x={157} y={16} textAnchor="middle" style={{fontSize:7,fill:'#16a34a',fontFamily:'Inter,system-ui,sans-serif'}}>scheduler</text>
      <line x1={238} y1={38} x2={276} y2={52} stroke="#A08060" strokeWidth={1} markerEnd="url(#a1)"/>
      <line x1={210} y1={52} x2={210} y2={84} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#a4)"/>
      <path d="M190 104 Q130 118 112 44" stroke="#dc2626" strokeWidth={1} fill="none" strokeDasharray="3 2" markerEnd="url(#a4)"/>
      {algo===ALGOS.RR && (
        <>
          <path d="M198 46 Q155 78 122 44" stroke="#D97706" strokeWidth={1.5} fill="none" strokeDasharray="4 2" markerEnd="url(#a3)"/>
          <text x={158} y={76} textAnchor="middle" style={{fontSize:7,fill:'#D97706',fontWeight:600,fontFamily:'Inter,system-ui,sans-serif'}}>quantum agotado</text>
        </>
      )}
    </svg>
  );
}

const ALGO_INFO = {
  [ALGOS.RR]:       { desc:`Cada proceso recibe un turno fijo de ${RR_QUANTUM} ticks (quantum). Si no termina al agotar su quantum, regresa al final de la cola. Garantiza equidad.`, cocina:`El chef atiende cada pedido ${RR_QUANTUM} minutos exactos. Si no termina, pasa al siguiente pedido y vuelve después.` },
  [ALGOS.FIFO]:     { desc:'El primer proceso en llegar es el primero en ejecutarse. Simple pero puede causar esperas largas si llegan procesos grandes primero (efecto convoy).', cocina:'El primer pedido en llegar es el primero en cocinarse, sin excepciones.' },
  [ALGOS.SJF]:      { desc:'Se ejecuta el proceso con menor tiempo de burst restante. Minimiza el tiempo de espera promedio pero puede postergar procesos largos indefinidamente.', cocina:'El chef prepara primero el plato más rápido. Una hamburguesa (5 ticks) va antes que una pizza (8 ticks).' },
  [ALGOS.PRIORITY]: { desc:'Los procesos con mayor prioridad se ejecutan antes. Procesos de baja prioridad pueden esperar indefinidamente (starvation).', cocina:'Pedidos urgentes se atienden antes sin importar cuándo llegaron al restaurante.' },
};

export function SchedulerPanel({ algo, cores, onSetAlgo, onSetCores }) {
  const info = ALGO_INFO[algo];
  return (
    <section className="panel">
      <h2 className="panel-title">Planificador de procesos</h2>
      <p className="panel-sub">Define el orden en que los pedidos acceden al chef (CPU)</p>

      <label className="field-label">Algoritmo</label>
      <select className="field-select" value={algo} onChange={e=>onSetAlgo(e.target.value)}>
        {Object.values(ALGOS).map(a=><option key={a} value={a}>{a}</option>)}
      </select>

      <AlgoDiagram algo={algo}/>

      <div className="algo-pills">
        <div className="algo-pill so-pill">
          <span className="pill-tag">SO</span>
          <span className="pill-text">{info.desc}</span>
        </div>
        <div className="algo-pill rest-pill">
          <span className="pill-tag">Cocina</span>
          <span className="pill-text">{info.cocina}</span>
        </div>
      </div>

      {algo===ALGOS.RR && (
        <div className="quantum-info-box">
          Quantum = <strong>{RR_QUANTUM} ticks</strong> por turno. La barra amarilla en cada estación muestra cuánto queda del turno actual.
        </div>
      )}

      <label className="field-label" style={{marginTop:10}}>Número de chefs (núcleos CPU)</label>
      <div className="cores-row">
        {[1,2,3].map(n=>(
          <button key={n} className={`core-btn${cores===n?' active':''}`} onClick={()=>onSetCores(n)}>
            {n} chef{n>1?'s':''}
          </button>
        ))}
      </div>
    </section>
  );
}

export function StatsPanel({ stats, processes }) {
  const running = processes.filter(p=>p.state===STATES.RUNNING).length;
  const ready   = processes.filter(p=>p.state===STATES.READY).length;
  const avg = stats.done>0 ? Math.round(stats.totalWait/stats.done) : 0;
  return (
    <section className="panel">
      <h2 className="panel-title">Métricas del sistema</h2>
      <div className="stats-grid">
        <div className="stat-box"><span className="sval green">{running}</span><span className="slbl">ejecutando</span></div>
        <div className="stat-box"><span className="sval amber">{ready}</span><span className="slbl">en cola</span></div>
        <div className="stat-box"><span className="sval teal">{stats.done}</span><span className="slbl">completados</span></div>
        <div className="stat-box"><span className="sval brown">{stats.switches}</span><span className="slbl">ctx. switches</span></div>
        <div className="stat-box"><span className="sval">{avg||'—'}</span><span className="slbl">espera prom.</span></div>
        <div className="stat-box"><span className="sval red">{stats.cpuUtil}%</span><span className="slbl">uso CPU</span></div>
      </div>
      <div className="bar-track" style={{marginTop:8}}>
        <div className="bar-fill" style={{width:`${stats.cpuUtil}%`,background:'#16a34a',transition:'width .5s'}}/>
      </div>
    </section>
  );
}

export function EventLog({ events }) {
  const TC = {arrival:'#7C3AED',exec:'#16a34a',done:'#0891b2',ctx:'#D97706',memory:'#9333ea',warning:'#dc2626',info:'#6b7280'};
  return (
    <section className="panel panel-log">
      <h2 className="panel-title">Registro de eventos</h2>
      <div className="log-list">
        {events.length===0
          ? <p className="empty-msg">Añade pedidos e inicia la simulación</p>
          : events.slice(0,16).map((e,i)=>(
              <div key={i} className="log-row">
                <span className="log-tick">[{e.tick}]</span>
                <span className="log-msg" style={{color:TC[e.type]||'#6b7280'}}>{e.msg}</span>
              </div>
            ))
        }
      </div>
    </section>
  );
}
