import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import {
  Database,
  ListChecks,
  MessageCircle,
  Repeat2,
  Search,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import './RadialOrbitalTimeline.css';

interface TimelineItem {
  id: number;
  title: string;
  content: string;
  icon: ElementType;
  relatedIds: number[];
}

const timelineData: TimelineItem[] = [
  { id: 1, title: 'Descoberta', content: 'O cliente encontra sua empresa.', icon: Search, relatedIds: [2] },
  { id: 2, title: 'Atendimento', content: 'Recebe uma resposta clara e rápida.', icon: MessageCircle, relatedIds: [1, 3] },
  { id: 3, title: 'Qualificação', content: 'A necessidade e o interesse são entendidos.', icon: ListChecks, relatedIds: [2, 4] },
  { id: 4, title: 'CRM', content: 'O histórico segue registrado e organizado.', icon: Database, relatedIds: [3, 5] },
  { id: 5, title: 'Follow-up', content: 'Cada oportunidade continua sendo acompanhada.', icon: Repeat2, relatedIds: [4, 6] },
  { id: 6, title: 'Resultado', content: 'A conversa avança para uma decisão de compra.', icon: TrendingUp, relatedIds: [5] },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function RadialOrbitalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(-90);
  const [radius, setRadius] = useState(300);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener?.('change', updateMotion);
    return () => media.removeEventListener?.('change', updateMotion);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateRadius = () => {
      const width = container.clientWidth;
      setRadius(clamp((width - 230) / 2, 130, 370));
    };

    const observer = new ResizeObserver(updateRadius);
    observer.observe(container);
    updateRadius();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeId !== null || reducedMotion) return;
    const timer = window.setInterval(() => setRotation((current) => (current + 0.12) % 360), 50);
    return () => window.clearInterval(timer);
  }, [activeId, reducedMotion]);

  const verticalScale = radius < 170 ? 1.42 : 0.68;

  const nodes = useMemo(
    () =>
      timelineData.map((item, index) => {
        const angle = (index / timelineData.length) * 360 + rotation;
        const radians = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radians);
        const y = radius * verticalScale * Math.sin(radians);
        return {
          ...item,
          x,
          y,
          lineAngle: (Math.atan2(y, x) * 180) / Math.PI,
          lineLength: Math.hypot(x, y),
          depth: (Math.sin(radians) + 1) / 2,
        };
      }),
    [radius, rotation, verticalScale],
  );

  const activeItem = timelineData.find((item) => item.id === activeId) ?? null;

  return (
    <div ref={containerRef} className="orbital-timeline" onClick={() => setActiveId(null)}>
      <div
        className="orbital-ring orbital-ring-outer"
        style={{ width: radius * 2, height: radius * verticalScale * 2 }}
        aria-hidden="true"
      />
      <div
        className="orbital-ring orbital-ring-inner"
        style={{ width: radius * 1.25, height: radius * verticalScale * 1.25 }}
        aria-hidden="true"
      />

      {nodes.map((node) => {
        const connected = activeItem?.relatedIds.includes(node.id) ?? false;
        return (
          <div
            key={`line-${node.id}`}
            className={`orbital-connector ${activeId === node.id || connected ? 'is-active' : ''}`}
            style={{ width: node.lineLength, transform: `rotate(${node.lineAngle}deg)` }}
            aria-hidden="true"
          />
        );
      })}

      <button
        type="button"
        className={`orbital-core ${activeItem ? 'has-active-item' : ''}`}
        onClick={(event) => {
          event.stopPropagation();
          setActiveId(null);
        }}
        aria-label={activeItem ? 'Fechar detalhe e retomar animação' : 'Fluxo conectado'}
      >
        {activeItem ? (
          <span className="orbital-core-content">
            <span className="orbital-core-kicker">Etapa {String(activeItem.id).padStart(2, '0')}</span>
            <strong>{activeItem.title}</strong>
            <span>{activeItem.content}</span>
            <span className="orbital-progress" aria-hidden="true">
              {timelineData.map((item) => <i key={item.id} className={item.id <= activeItem.id ? 'is-complete' : ''} />)}
            </span>
            <small>Clique no centro para retomar</small>
          </span>
        ) : (
          <span className="orbital-core-content orbital-core-idle">
            <span className="orbital-core-icon"><Workflow size={25} strokeWidth={1.6} /></span>
            <span className="orbital-core-kicker">Ecossistema integrado</span>
            <strong>Fluxo conectado</strong>
            <span>Seis etapas trabalhando como um único sistema.</span>
            <small>Selecione uma etapa</small>
          </span>
        )}
      </button>

      {nodes.map((node) => {
        const Icon = node.icon;
        const selected = activeId === node.id;
        const connected = activeItem?.relatedIds.includes(node.id) ?? false;

        return (
          <button
            type="button"
            key={node.id}
            className={`orbital-node ${selected ? 'is-selected' : ''} ${connected ? 'is-connected' : ''}`}
            style={{
              transform: `translate(-50%, -50%) translate(${node.x}px, ${node.y}px) scale(${0.96 + node.depth * 0.05})`,
              opacity: selected ? 1 : 0.78 + node.depth * 0.22,
              zIndex: selected ? 30 : Math.round(10 + node.depth * 10),
            }}
            onClick={(event) => {
              event.stopPropagation();
              setActiveId((current) => (current === node.id ? null : node.id));
            }}
            aria-pressed={selected}
            aria-label={`${node.title}: ${node.content}`}
          >
            <span className="orbital-node-icon"><Icon size={22} strokeWidth={1.8} /></span>
            <span className="orbital-node-copy">
              <strong>{node.title}</strong>
              <small>{node.content}</small>
            </span>
            <span className="orbital-node-number">{String(node.id).padStart(2, '0')}</span>
          </button>
        );
      })}
    </div>
  );
}
