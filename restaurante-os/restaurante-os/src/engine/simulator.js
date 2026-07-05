// RestauranteOS — Motor v6
// Sin auto-spawn, sin meta automática — el usuario controla los pedidos
export const STATES = {
  NEW:'nuevo', READY:'listo', RUNNING:'ejecutando', BLOCKED:'bloqueado', DONE:'terminado'
};
export const ALGOS = { RR:'Round Robin', FIFO:'FIFO', SJF:'SJF', PRIORITY:'Prioridad' };

export const MENU = [
  { type:'pizza',       label:'Pizza',       emoji:'🍕', color:'#E8593C',
    burst:8, memory:192, priority:2,
    threads:[{name:'Masa',emoji:'🫓'},{name:'Salsa',emoji:'🍅'},{name:'Queso',emoji:'🧀'},{name:'Hornear',emoji:'🔥'}] },
  { type:'hamburguesa', label:'Hamburguesa', emoji:'🍔', color:'#D97706',
    burst:5, memory:128, priority:1,
    threads:[{name:'Carne',emoji:'🥩'},{name:'Pan',emoji:'🍞'},{name:'Ensamblar',emoji:'🤌'}] },
  { type:'ramen',       label:'Ramen',       emoji:'🍜', color:'#7C3AED',
    burst:6, memory:160, priority:3,
    threads:[{name:'Caldo',emoji:'🫕'},{name:'Fideos',emoji:'🍝'},{name:'Toppings',emoji:'🥚'}] },
];

const RAM_TOTAL = 1024;
export const RR_QUANTUM = 4;

export function createState() {
  return {
    tick:0, running:false, algo:ALGOS.RR, cores:2,
    nextPid:1,
    processes:[], readyQueue:[], cpuSlots:[null,null,null],
    ram:{ total:RAM_TOTAL, slots:[] },
    disk:{ total:10, used:2.1, files:[
      {name:'Recetas del menú',gb:1.2},
      {name:'Registro de pedidos',gb:0.7},
      {name:'Logs del sistema',gb:0.2},
    ]},
    completed:[], events:[],
    stats:{switches:0,done:0,totalWait:0,cpuUtil:0},
    rrLeft:{},
    gantt:[],
  };
}

function log(s,msg,type='info'){
  return {...s,events:[{tick:s.tick,msg,type},...s.events].slice(0,60)};
}
function ramUsed(s){ return s.ram.slots.reduce((a,sl)=>a+sl.mb,0); }
function getProc(s,pid){ return s.processes.find(p=>p.pid===pid)??null; }
function updateProc(s,pid,ch){
  return {...s,processes:s.processes.map(p=>p.pid===pid?{...p,...ch}:p)};
}
function freeRam(s,pid){
  return {...s,ram:{...s.ram,slots:s.ram.slots.filter(sl=>sl.pid!==pid)}};
}

export function spawnOne(s, dishType=null){
  const dish = dishType
    ? MENU.find(m=>m.type===dishType) || MENU[Math.floor(Math.random()*MENU.length)]
    : MENU[Math.floor(Math.random()*MENU.length)];

  const pid   = s.nextPid;
  let ns      = {...s, nextPid: s.nextPid + 1};

  const threadCount = dish.threads.length;
  const ticksEach   = Math.floor(dish.burst / threadCount);
  const threads = dish.threads.map((t,i)=>({
    ...t, index:i,
    startTick: i * ticksEach,
    endTick:   i === threadCount-1 ? dish.burst : (i+1)*ticksEach,
    done: false,
  }));

  const p = {
    pid, ...dish, remaining:dish.burst, waitTime:0,
    arrivedAt:ns.tick, startedAt:null, finishedAt:null, coreIdx:null,
    state:STATES.NEW, threads, showThreads:false, quantumLeft:RR_QUANTUM,
  };

  ns = {...ns, processes:[...ns.processes, p]};
  ns = log(ns, `${dish.emoji} Pedido #${pid} "${dish.label}" llegó — Nuevo`, 'arrival');

  if(ramUsed(ns) + dish.memory <= RAM_TOTAL){
    ns = {...ns, ram:{...ns.ram, slots:[...ns.ram.slots,
      {pid, name:dish.label, emoji:dish.emoji, mb:dish.memory, color:dish.color}]}};
    ns = updateProc(ns, pid, {state:STATES.READY});
    ns = {...ns, readyQueue:[...ns.readyQueue, pid]};
    ns = log(ns, `#${pid} cargado en RAM (${dish.memory} MB) → Listo`, 'memory');
  }
  return ns;
}

function pickNext(s){
  const ready = s.readyQueue.map(pid=>getProc(s,pid)).filter(Boolean);
  if(!ready.length) return null;
  switch(s.algo){
    case ALGOS.FIFO:     return ready.sort((a,b)=>a.arrivedAt-b.arrivedAt)[0];
    case ALGOS.SJF:      return ready.sort((a,b)=>a.remaining-b.remaining)[0];
    case ALGOS.PRIORITY: return ready.sort((a,b)=>b.priority-a.priority)[0];
    default:             return ready[0];
  }
}

export function tick(s){
  if(!s.running) return s;
  let ns = {...s, tick:s.tick+1};
  const slots = [...ns.cpuSlots];
  let {switches,done,totalWait} = ns.stats;
  let gantt = [...ns.gantt];

  // Advance running processes
  for(let i=0;i<ns.cores;i++){
    const pid=slots[i]; if(!pid) continue;
    const p=getProc(ns,pid);
    if(!p||p.state===STATES.DONE){slots[i]=null;continue;}

    gantt.push({pid:p.pid,label:p.label,emoji:p.emoji,color:p.color,coreIdx:i,tick:ns.tick});
    if(gantt.length>200) gantt=gantt.slice(-200);

    const newRem  = p.remaining-1;
    const qLeft   = (ns.rrLeft[pid]??RR_QUANTUM)-1;
    const elapsed = p.burst-newRem;
    const threads = p.threads.map(t=>({...t,done:elapsed>=t.endTick}));

    if(newRem<=0){
      const wait=ns.tick-p.arrivedAt;
      ns=updateProc(ns,pid,{state:STATES.DONE,remaining:0,finishedAt:ns.tick,
        coreIdx:null,threads,quantumLeft:0});
      ns=freeRam(ns,pid);
      ns=log(ns,`${p.emoji} #${pid} "${p.label}" entregado ✓ — Terminado (${wait} ticks)`,'done');
      ns={...ns,completed:[...ns.completed,pid]};
      slots[i]=null; switches++; done++; totalWait+=wait;
    } else if(ns.algo===ALGOS.RR && qLeft<=0){
      ns=updateProc(ns,pid,{state:STATES.READY,remaining:newRem,
        coreIdx:null,threads,quantumLeft:RR_QUANTUM});
      ns={...ns,readyQueue:[...ns.readyQueue.filter(x=>x!==pid),pid]};
      ns=log(ns,`#${pid} quantum agotado → Listo (regresa a cola)`,'ctx');
      slots[i]=null; switches++;
      ns={...ns,rrLeft:{...ns.rrLeft,[pid]:RR_QUANTUM}};
    } else {
      ns=updateProc(ns,pid,{remaining:newRem,threads,quantumLeft:qLeft});
      if(ns.algo===ALGOS.RR) ns={...ns,rrLeft:{...ns.rrLeft,[pid]:qLeft}};
    }
  }
  ns={...ns,cpuSlots:slots,gantt};

  // Assign free slots from ready queue
  for(let i=0;i<ns.cores;i++){
    if(slots[i]!==null) continue;
    const next=pickNext(ns);
    if(!next) continue;
    ns=updateProc(ns,next.pid,{
      state:STATES.RUNNING,
      startedAt:next.startedAt??ns.tick,
      coreIdx:i, quantumLeft:RR_QUANTUM,
    });
    ns={...ns,
      readyQueue:ns.readyQueue.filter(x=>x!==next.pid),
      rrLeft:{...ns.rrLeft,[next.pid]:RR_QUANTUM},
    };
    slots[i]=next.pid; switches++;
    ns=log(ns,`${next.emoji} #${next.pid} "${next.label}" → CPU-${i+1} — Ejecutando`,'exec');
  }
  ns={...ns,cpuSlots:slots};

  // Increment wait time for ready processes
  ns={...ns,processes:ns.processes.map(p=>
    p.state===STATES.READY?{...p,waitTime:(p.waitTime||0)+1}:p
  )};

  const busy=slots.slice(0,ns.cores).filter(Boolean).length;
  ns={...ns,stats:{switches,done,totalWait,cpuUtil:Math.round((busy/ns.cores)*100)}};

  return ns;
}

export function toggleThreads(s,pid){
  return {...s,processes:s.processes.map(p=>p.pid===pid?{...p,showThreads:!p.showThreads}:p)};
}
export function changeCores(s,n){
  const slots=[...s.cpuSlots];
  for(let i=n;i<3;i++){
    if(slots[i]){
      s=updateProc(s,slots[i],{state:STATES.READY,coreIdx:null});
      s={...s,readyQueue:[...s.readyQueue,slots[i]]};
      slots[i]=null;
    }
  }
  return log({...s,cores:n,cpuSlots:slots},`Núcleos → ${n}`,'ctx');
}
export function changeAlgo(s,algo){
  return log({...s,algo,readyQueue:[...s.readyQueue]},`Algoritmo → ${algo}`,'ctx');
}
export function reset(){ return createState(); }
