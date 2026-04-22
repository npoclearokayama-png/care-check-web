import { resources } from '../data/resources';

export default function HelpPage() {
  return (
    <section className="stack">
      <div className="card">
        <h1>相談先・支援導線</h1>
        <p>
          初版では、特定施設ではなく、結果整理用のAI導線を案内しています。
          必要に応じて、自治体窓口、医療機関、発達相談、福祉相談などの実相談先へつないでください。
        </p>
        <div className="resource-list">
          {resources.map((resource) => (
            <a
              key={resource.title}
              className="resource-card"
              href={resource.url}
              target={resource.external ? '_blank' : undefined}
              rel={resource.external ? 'noreferrer' : undefined}
            >
              <strong>{resource.title}</strong>
              <span>{resource.description}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
