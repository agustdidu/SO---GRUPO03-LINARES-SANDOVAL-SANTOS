import { STATES, RR_QUANTUM, ALGOS } from '../engine/simulator';
import { GanttChart } from './GanttChart';

// State badge component
function StateBadge({ state }) {
  const MAP = {
    [STATES.NEW]:     { label:'Nuevo',      bg:'#f1f5f9', color:'#64748b' },
    [STATES.READY]:   { label:'Listo',      bg:'#fef3c7', color:'#92400e' },
    [STATES.RUNNING]: { label:'Ejecutando', bg:'#dcfce7', color:'#166534' },
    [STATES.BLOCKED]: { label:'Bloqueado',  bg:'#fee2e2', color:'#991b1b' },
    [STATES.DONE]:    { label:'Terminado',  bg:'#f0fdf4', color:'#15803d' },
  };
  const m = MAP[state] || MAP[STATES.NEW];
  return (
    <span className="state-badge" style={{background:m.bg,color:m.color}}>{m.label}</span>
  );
}

// Quantum bar for Round Robin
function QuantumBar({ quantumLeft, algo }) {
  if(algo !== ALGOS.RR) return null;
  const pct = Math.round((quantumLeft / RR_QUANTUM) * 100);
  return (
    <div className="quantum-wrap">
      <div className="quantum-label">Quantum restante: {quantumLeft}/{RR_QUANTUM} ticks</div>
      <div className="quantum-track">
        <div className="quantum-fill" style={{width:`${pct}%`,
          background: pct>50?'#22c55e':pct>25?'#f59e0b':'#ef4444'}}/>
      </div>
    </div>
  );
}

function ThreadBar({ threads, burst, remaining }) {
  const elapsed = burst - remaining;
  return (
    <div className="threads-wrap">
      <div className="threads-label">Hilos (subtareas del proceso):</div>
      <div className="threads-list">
        {threads.map((t,i)=>{
          const started = elapsed >= t.startTick;
          const done    = elapsed >= t.endTick;
          const active  = started && !done;
          const pct = done?100:active
            ?Math.round(((elapsed-t.startTick)/(t.endTick-t.startTick))*100):0;
          return (
            <div key={i} className={`thread-row ${done?'t-done':active?'t-active':'t-wait'}`}>
              <span className="t-emoji">{t.emoji}</span>
              <span className="t-name">{t.name}</span>
              <div className="t-bar-wrap"><div className="t-bar-fill" style={{width:`${pct}%`}}/></div>
              <span className="t-status">{done?'✓':active?`${pct}%`:'espera'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChefStation({ coreIdx, pid, processes, toggleThreads, algo }) {
  const p = pid ? processes.find(x=>x.pid===pid) : null;
  const img = p ? '/chef_parado.png' : '/chef_espalda.png';
  const pct = p ? Math.round(((p.burst-p.remaining)/p.burst)*100) : 0;

  return (
    <div className={`station ${p?'station-busy':'station-idle'}`}>
      <div className="station-header">CPU-{coreIdx+1}</div>
      <img src={img} alt={p?'Chef cocinando':'Chef libre'} className="chef-img"/>
      {p ? (
        <div className="station-info">
          <div className="station-top-row">
            <div className="station-dish">{p.emoji} {p.label} <span className="station-pid" style={{color:p.color}}>#{p.pid}</span></div>
            <StateBadge state={p.state}/>
          </div>
          <div className="station-bar-wrap">
            <div className="station-bar-fill" style={{width:`${pct}%`,background:p.color}}/>
          </div>
          <div className="station-ticks">Progreso: {pct}% · {p.remaining} ticks restantes</div>
          <QuantumBar quantumLeft={p.quantumLeft ?? RR_QUANTUM} algo={algo}/>
          <button className="thread-toggle" onClick={()=>toggleThreads(p.pid)}>
            {p.showThreads?'▲ ocultar hilos':'▼ ver hilos del proceso'}
          </button>
          {p.showThreads && <ThreadBar threads={p.threads} burst={p.burst} remaining={p.remaining}/>}
        </div>
      ) : (
        <div className="station-idle-msg">Núcleo libre — esperando proceso</div>
      )}
    </div>
  );
}

// ① CPU Zone
function CpuZone({ cpuSlots, cores, processes, toggleThreads, algo }) {
  return (
    <div className="zone zone-cpu">
      <div className="zone-header">
        <div className="zone-num">①</div>
        <div>
          <span className="zone-title">CPU — estaciones de cocina</span>
          <span className="zone-so">Núcleos del procesador · procesos en estado Ejecutando</span>
        </div>
      </div>
      <div className="stations-row">
        {Array.from({length:cores}).map((_,i)=>(
          <ChefStation key={i} coreIdx={i} pid={cpuSlots[i]} processes={processes}
            toggleThreads={toggleThreads} algo={algo}/>
        ))}
      </div>
    </div>
  );
}

// ② RAM Zone
function RamZone({ ram }) {
  return (
    <div className="zone zone-ram">
      <div className="zone-header">
        <div className="zone-num">②</div>
        <div>
          <span className="zone-title">RAM — mesada de trabajo</span>
          <span className="zone-so">Procesos cargados en memoria principal</span>
        </div>
      </div>
      <div className="ram-plates">
        {ram.slots.slice(0,5).map(sl=>(
          <div key={sl.pid} className="ram-plate">
            <div className="plate-circle" style={{borderColor:sl.color}}>
              <span className="plate-emoji">{sl.emoji}</span>
            </div>
            <div className="plate-label">#{sl.pid}</div>
            <div className="plate-mb">{sl.mb} MB</div>
          </div>
        ))}
        {ram.slots.length===0 && <p className="zone-empty">Sin procesos en memoria</p>}
      </div>
    </div>
  );
}

// ③ Ready Queue Zone
function QueueZone({ readyQueue, processes, toggleThreads }) {
  const waiting = readyQueue.map(pid=>processes.find(p=>p.pid===pid)).filter(Boolean);
  return (
    <div className="zone zone-queue">
      <div className="zone-header">
        <div className="zone-num">③</div>
        <div>
          <span className="zone-title">Cola de Listos — Ready Queue</span>
          <span className="zone-so">Procesos en estado Listo · en RAM, esperando un núcleo libre · el scheduler decide el orden</span>
        </div>
      </div>
      <div className="tickets-col">
        {waiting.length===0
          ? <p className="zone-empty">Cola vacía — todos los procesos activos están en CPU</p>
          : waiting.map((p,i)=>(
              <div key={p.pid} className="ticket" style={{borderColor:p.color}}>
                <span className="ticket-pos">#{i+1}</span>
                <span className="ticket-emoji">{p.emoji}</span>
                <div className="ticket-info">
                  <div className="ticket-name-row">
                    <span className="ticket-name">{p.label}</span>
                    <StateBadge state={p.state}/>
                  </div>
                  <span className="ticket-detail" style={{color:p.color}}>Proceso #{p.pid}</span>
                  {p.waitTime>0 && <span className="ticket-wait">En cola {p.waitTime} ticks</span>}
                </div>
                <img src="/cliente.png" alt="cliente" className="ticket-client"/>
                <button className="thread-toggle small" onClick={()=>toggleThreads(p.pid)}>
                  {p.showThreads?'▲':'▼ hilos'}
                </button>
                {p.showThreads&&(
                  <div style={{width:'100%',marginTop:5}}>
                    <ThreadBar threads={p.threads} burst={p.burst} remaining={p.remaining}/>
                  </div>
                )}
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ④ Output Zone
function OutputZone({ processes }) {
  const done = processes.filter(p=>p.state===STATES.DONE).slice(-5).reverse();
  return (
    <div className="zone zone-output">
      <div className="zone-header">
        <div className="zone-num">④</div>
        <div>
          <span className="zone-title">Salida — pedidos entregados</span>
          <span className="zone-so">Procesos en estado Terminado · liberan CPU y RAM</span>
        </div>
      </div>
      <div className="output-inner">
        <img src="/mesero.png" alt="mesero" className="waiter-img"/>
        <div className="done-list">
          {done.length===0
            ? <p className="zone-empty">Sin pedidos completados aún</p>
            : done.map(p=>(
                <div key={p.pid} className="done-row">
                  <span className="done-emoji">{p.emoji}</span>
                  <span className="done-name">{p.label} <span style={{color:p.color}}>#{p.pid}</span></span>
                  <StateBadge state={STATES.DONE}/>
                  <span className="done-ticks">{p.finishedAt-p.arrivedAt} ticks</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

// ⑤ Gantt Zone
function GanttZone({ gantt, cores, tick }) {
  return (
    <div className="zone zone-gantt">
      <div className="zone-header">
        <div className="zone-num">⑤</div>
        <div>
          <span className="zone-title">Línea de tiempo — diagrama de Gantt</span>
          <span className="zone-so">Qué proceso ocupó cada núcleo en cada tick · muestra el efecto del algoritmo de planificación</span>
        </div>
      </div>
      <GanttChart gantt={gantt} cores={cores} tick={tick}/>
    </div>
  );
}

export function KitchenView({ state, toggleThreads }) {
  const { cpuSlots, cores, processes, readyQueue, ram, gantt, tick, algo } = state;
  return (
    <div className="kitchen">
      <div className="kitchen-top">
        <CpuZone cpuSlots={cpuSlots} cores={cores} processes={processes}
          toggleThreads={toggleThreads} algo={algo}/>
        <RamZone ram={ram}/>
      </div>
      <div className="kitchen-mid">
        <QueueZone readyQueue={readyQueue} processes={processes} toggleThreads={toggleThreads}/>
        <OutputZone processes={processes}/>
      </div>
      <GanttZone gantt={gantt} cores={cores} tick={tick}/>
    </div>
  );
}
