type Props = {
  tips: string[];
};

export default function ActionTips({ tips }: Props) {
  return (
    <section className="card">
      <h2>まず試せる一歩</h2>
      <ul className="simple-list">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
