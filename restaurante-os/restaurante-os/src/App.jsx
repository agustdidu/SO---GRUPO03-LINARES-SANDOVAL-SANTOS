import { useState } from 'react';
import { useSimulator } from './hooks/useSimulator';
import { TopBar, BottomBar } from './components/TopBar';
import { ProcessList, RamPanel, DiskPanel } from './components/SidebarLeft';
import { KitchenView } from './components/KitchenView';
import { SchedulerPanel, StatsPanel, EventLog } from './components/SidebarRight';
import { ALGOS } from './engine/simulator';
import './App.css';

const SPEED_MS = { 1:1800, 2:1200, 3:750, 4:400, 5:180 };

const ALGO_INFO = {
  [ALGOS.RR]:      'Cada proceso recibe un quantum de 4 ticks. Si no termina, regresa al final de la cola.',
  [ALGOS.FIFO]:    'El primer pedido en llegar es el primero en atenderse.',
  [ALGOS.SJF]:     'Se atiende primero el pedido más rápido de preparar.',
  [ALGOS.PRIORITY]:'Los pedidos más urgentes se atienden antes sin importar el orden de llegada.',
};

export default function App() {
  const [speed, setSpeed] = useState(2);
  const { state, play, pause, restart, setCores, setAlgo, addOrder, toggleThreads } = useSimulator(SPEED_MS[speed]);

  return (
    <div className="shell">
      <TopBar
        state={state}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
        onAddOrder={addOrder}
        speed={speed}
        onSetSpeed={setSpeed}
      />
      <div className="layout">
        <aside className="sidebar sidebar-l">
          <ProcessList processes={state.processes}/>
          <RamPanel    ram={state.ram}/>
          <DiskPanel   disk={state.disk}/>
        </aside>
        <main className="center">
          <KitchenView state={state} toggleThreads={toggleThreads}/>
        </main>
        <aside className="sidebar sidebar-r">
          <SchedulerPanel
            algo={state.algo} cores={state.cores}
            onSetAlgo={setAlgo} onSetCores={setCores}
          />
          <StatsPanel stats={state.stats} processes={state.processes}/>
          <EventLog   events={state.events}/>
        </aside>
      </div>
      <BottomBar algo={state.algo} algoInfo={ALGO_INFO[state.algo]}/>
    </div>
  );
}
