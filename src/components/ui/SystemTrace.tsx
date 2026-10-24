import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import './SystemTrace.css';


type AreaId = 'comercial' | 'atendimento' | 'operacao' | 'financeiro' | 'produto' | 'pessoas';

type Artifact =
  | { kind: 'chat'; messages: { from: 'lead' | 'agente'; text: string }[] }
  | { kind: 'fields'; fields: [string, string][] };

interface Step {
  time: string;
  title: string;
  action: string;
  metric: string;
  reads: AreaId[];
  writes: AreaId[];
  artifact: Artifact;
}

const areas: { id: AreaId; name: string; notes: string[] }[] = [
  { id: 'comercial', name: 'Comercial', notes: ['ofertas.md', 'objecoes.md'] },
  { id: 'atendimento', name: 'Atendimento', notes: ['tom-de-voz.md', 'faq.md'] },
  { id: 'operacao', name: 'Operação', notes: ['agenda.md', 'processos.md'] },
  { id: 'financeiro', name: 'Financeiro', notes: ['tabela.md', 'condicoes.md'] },
  { id: 'produto', name: 'Produto', notes: ['servicos.md', 'diferenciais.md'] },
  { id: 'pessoas', name: 'Pessoas', notes: ['equipe.md', 'escalas.md'] },
];

const steps: Step[] = [
  {
    time: '09:14:02',
    title: 'Descoberta',
    action: 'Marina encontra a clínica no Google e chama no WhatsApp.',
    metric: 'origem: Google',
    reads: [],
    writes: ['comercial'],
    artifact: { kind: 'fields', fields: [['Canal', 'WhatsApp'], ['Origem', 'Google · busca local'], ['Horário', 'fora do expediente']] },
  },
  {
    time: '09:14:10',
    title: 'Atendimento',
    action: 'O agente responde no tom da marca, com preço e horário reais.',
    metric: '8 s',
    reads: ['atendimento', 'produto', 'operacao'],
    writes: [],
    artifact: {
      kind: 'chat',
      messages: [
        { from: 'lead', text: 'Oi! Vocês fazem clareamento? Quanto fica?' },
        { from: 'agente', text: 'Oi, Marina! Fazemos sim, a partir de R$ 890. Tenho quinta às 15h livre. Quer que eu reserve?' },
      ],
    },
  },
  {
    time: '09:14:41',
    title: 'Qualificação',
    action: 'Necessidade, urgência e orçamento saem da própria conversa.',
    metric: 'score 86',
    reads: ['comercial', 'financeiro'],
    writes: [],
    artifact: { kind: 'fields', fields: [['Interesse', 'Clareamento'], ['Urgência', 'esta semana'], ['Orçamento', 'compatível']] },
  },
  {
    time: '09:14:42',
    title: 'CRM',
    action: 'Contato e histórico registrados sem ninguém digitar nada.',
    metric: 'sincronizado',
    reads: [],
    writes: ['comercial'],
    artifact: { kind: 'fields', fields: [['Contato', 'Marina S.'], ['Etapa', 'Proposta enviada'], ['Responsável', 'Recepção']] },
  },
  {
    time: 'D+1 10:00',
    title: 'Follow-up',
    action: 'Ela não respondeu. O sistema retoma no horário certo.',
    metric: 'retomado',
    reads: ['comercial', 'atendimento'],
    writes: [],
    artifact: {
      kind: 'chat',
      messages: [{ from: 'agente', text: 'Bom dia, Marina! Segurei a quinta às 15h até o meio-dia. Confirmo pra você?' }],
    },
  },
  {
    time: 'D+1 10:07',
    title: 'Resultado',
    action: 'Consulta na agenda, equipe avisada e venda registrada.',
    metric: 'agendado',
    reads: [],
    writes: ['operacao', 'financeiro', 'pessoas'],
    artifact: { kind: 'fields', fields: [['Agenda', 'Qui · 15h00'], ['Valor', 'R$ 890'], ['Tempo da equipe', '0 min']] },
  },
];

const STEP_MS = 2200;
const last = steps.length - 1;

export default function SystemTrace() {
  const rootRef = useRef<HTMLDivElement>(null);
  // `reached` is how far the trace has run; `open` is the step shown in the inspector.
  const [reached, setReached] = useState(-1);
  const [open, setOpen] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReached(last);
      setOpen(last);
      setPlaying(false);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    if (reached >= last) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(
      () => {
        setReached(reached + 1);
        setOpen(reached + 1);
      },
      reached < 0 ? 400 : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [playing, inView, reached]);

  const inspect = (index: number) => {
    setPlaying(false);
    setReached(last);
    setOpen(index);
  };

  const replay = () => {
    setReached(-1);
    setOpen(0);
    setPlaying(true);
  };

  const current = reached >= 0 ? steps[open] : null;
  const finished = reached >= last;

  return (
    <div ref={rootRef} className="trace">
      <div className="trace-panel">
        <header className="trace-head">
          <div>
            <p className="trace-head-title">Trace · lead #2381</p>
            <p className="trace-head-sub">Clínica odontológica · simulação de um atendimento típico</p>
          </div>
          {finished ? (
            <button type="button" className="trace-replay" onClick={replay}>
              <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
              Rodar de novo
            </button>
          ) : (
            <span className="trace-live" aria-hidden="true">
              <i />
              executando
            </span>
          )}
        </header>

        <ol className="trace-steps">
          <span className="trace-rail" aria-hidden="true">
            <span className="trace-rail-fill" style={{ transform: `scaleY(${reached < 0 ? 0 : reached / last})` }} />
          </span>

          {steps.map((step, index) => {
            const done = index <= reached;
            const selected = done && open === index;
            return (
              <li key={step.title} className={`trace-step ${done ? 'is-done' : ''} ${selected ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="trace-step-row"
                  onClick={() => inspect(index)}
                  aria-pressed={selected}
                  aria-controls="trace-inspector"
                >
                  <span className="trace-time">{done ? step.time : '--:--:--'}</span>
                  <span className="trace-dot" aria-hidden="true" />
                  <span className="trace-step-copy">
                    <strong>{step.title}</strong>
                    <span>{step.action}</span>
                  </span>
                  <span className="trace-metric">{step.metric}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Every artifact sits in the same grid cell, so the inspector is always as tall as the
            tallest one and switching steps never moves the page. */}
        <div id="trace-inspector" className="trace-inspector" aria-live="polite">
          <div className={`trace-layer trace-idle ${current ? '' : 'is-active'}`} aria-hidden={current !== null}>
            Selecione uma etapa para ver o que o sistema fez.
          </div>
          {steps.map((step, index) => {
            const active = current !== null && open === index;
            return (
              <div key={step.title} className={`trace-layer ${active ? 'is-active' : ''}`} aria-hidden={!active}>
                <p className="trace-layer-title">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {step.title}
                </p>
                <ArtifactView artifact={step.artifact} />
                <ContextLine step={step} />
              </div>
            );
          })}
        </div>

        <footer className="trace-foot">
          <span><strong>8 s</strong> até a primeira resposta</span>
          <span><strong>0 min</strong> da equipe neste lead</span>
          <span><strong>0</strong> etapas esquecidas</span>
        </footer>
      </div>

      <aside className="brain" aria-label="Segundo cérebro da empresa">
        <div className="brain-head">
          <h3>Segundo cérebro</h3>
          <p>O contexto da empresa organizado por área. Cada etapa consulta e atualiza essa base, em vez de depender de um prompt solto.</p>
        </div>
        <ul className="brain-grid">
          {areas.map((area) => {
            const reading = current?.reads.includes(area.id) ?? false;
            const writing = current?.writes.includes(area.id) ?? false;
            return (
              <li key={area.id} className={`brain-area ${reading ? 'is-reading' : ''} ${writing ? 'is-writing' : ''}`}>
                <div className="brain-area-top">
                  <strong>{area.name}</strong>
                  <span className="brain-signal">{writing ? 'escrevendo' : reading ? 'lendo' : ''}</span>
                </div>
                <ul className="brain-notes">
                  {area.notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="brain-status">
          {current ? <>Etapa atual: <em>{current.title}</em></> : 'Aguardando o primeiro contato'}
        </p>
      </aside>
    </div>
  );
}

function ArtifactView({ artifact }: { artifact: Artifact }) {
  if (artifact.kind === 'chat') {
    return (
      <div className="trace-chat">
        {artifact.messages.map((message) => (
          <p key={message.text} className={`trace-bubble is-${message.from}`}>{message.text}</p>
        ))}
      </div>
    );
  }
  return (
    <dl className="trace-fields">
      {artifact.fields.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ContextLine({ step }: { step: Step }) {
  const name = (id: AreaId) => areas.find((area) => area.id === id)?.name;
  return (
    <p className="trace-context">
      {step.reads.length > 0 && <span>Consultou <em>{step.reads.map(name).join(', ')}</em></span>}
      {step.writes.length > 0 && <span>Atualizou <em>{step.writes.map(name).join(', ')}</em></span>}
    </p>
  );
}
