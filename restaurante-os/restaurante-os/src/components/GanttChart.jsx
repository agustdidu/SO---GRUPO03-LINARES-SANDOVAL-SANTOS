import { MENU } from '../engine/simulator';

const CORE_COLORS = ['#7C3A1E','#A0522D'];
const CORE_LABELS = ['CPU-1','CPU-2','CPU-3'];

export function GanttChart({ gantt, cores, tick: currentTick }) {
  if(!gantt||gantt.length===0) return (
    <div className="gantt-empty">La línea de tiempo aparecerá cuando empiece la simulación</div>
  );

  // Show last 40 ticks
  const windowSize = 40;
  const minTick = Math.max(1, currentTick - windowSize + 1);
  const maxTick = currentTick;
  const ticks = Array.from({length: maxTick - minTick + 1}, (_,i) => minTick + i);

  // Build matrix: core → tick → proc info
  const matrix = {};
  for(let c=0;c<cores;c++) matrix[c]={};
  gantt.forEach(g=>{
    if(g.tick>=minTick && g.tick<=maxTick){
      if(!matrix[g.coreIdx]) matrix[g.coreIdx]={};
      matrix[g.coreIdx][g.tick] = g;
    }
  });

  const cellW = Math.max(12, Math.floor(560 / windowSize));

  return (
    <div className="gantt-wrap">
      <div className="gantt-inner" style={{overflowX:'auto'}}>
        <div style={{minWidth: cores*(80) + ticks.length*cellW + 20}}>
          {/* Header: tick numbers */}
          <div className="gantt-row">
            <div className="gantt-row-label"/>
            {ticks.map(t=>(
              <div key={t} className="gantt-tick-label" style={{width:cellW}}>
                {t%5===0?t:''}
              </div>
            ))}
          </div>
          {/* One row per core */}
          {Array.from({length:cores}).map((_,cIdx)=>(
            <div key={cIdx} className="gantt-row">
              <div className="gantt-row-label">CPU-{cIdx+1}</div>
              {ticks.map(t=>{
                const g = matrix[cIdx]?.[t];
                return (
                  <div key={t} className="gantt-cell" style={{
                    width:cellW, minWidth:cellW,
                    background: g ? g.color+'dd' : '#f5ebe0',
                    borderRight: g ? '1px solid rgba(255,255,255,.3)' : '1px solid #e8d5c0',
                    title: g ? `#${g.pid} ${g.label} (tick ${t})` : 'libre',
                  }}>
                    {g && cellW>=16 && <span className="gantt-cell-emoji">{g.emoji}</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="gantt-legend">
            {MENU.map(m=>(
              <div key={m.type} className="gantt-legend-item">
                <div className="gantt-legend-color" style={{background:m.color+'dd'}}/>
                <span>{m.emoji} {m.label}</span>
              </div>
            ))}
            <div className="gantt-legend-item">
              <div className="gantt-legend-color" style={{background:'#f5ebe0',border:'1px solid #e8d5c0'}}/>
              <span>Libre</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
