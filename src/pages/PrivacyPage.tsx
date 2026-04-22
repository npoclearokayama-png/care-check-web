export default function PrivacyPage() {
  return (
    <section className="stack">
      <div className="card">
        <h1>プライバシー・注意事項</h1>
        <ul className="simple-list">
          <li>個人情報の入力欄はありません。</li>
          <li>回答データはブラウザ内で処理され、この端末の localStorage に保存されます。</li>
          <li>外部API・外部DB・サーバー送信はありません。</li>
          <li>この結果は診断や確定的判断を示すものではありません。</li>
        </ul>
      </div>
    </section>
  );
}
