(function () {
  const questions = window.CARE_CHECK_QUESTIONS || [];
  const STORAGE_KEY = 'care-check-static-v2';

  const scaleLabels = {
    child_load: '子ども対応の負荷',
    parent_fatigue: '親自身の消耗',
    isolation_support: '孤立・支援不足',
    future_uncertainty: '見通しの持ちにくさ',
  };

  const scaleDescriptions = {
    child_load:
      '子どもへの対応そのものに強い負荷がかかっている可能性があります。対応の工夫だけでなく、生活全体の組み立てや支援の入り方を見直すことが有効な場合があります。',
    parent_fatigue:
      '親自身の心身の消耗が大きくなっている可能性があります。休息だけでなく、負担の量そのものを減らす視点が必要かもしれません。',
    isolation_support:
      '孤立感や支援不足が負担を押し上げている可能性があります。困りごとの内容以上に、誰とつながるかを整えることが重要になりそうです。',
    future_uncertainty:
      '見通しの持ちにくさや不安の強さが、日々の負担を大きくしている可能性があります。先の全部ではなく、まず次の一歩だけを具体化するのが有効です。',
  };

  const bands = [
    {
      min: 0, max: 24, title: '今の負担感は比較的低めです',
      message: 'いまは何とか回せている部分もありそうです。ただし、育児の負担は波があるため、しんどさが強まる前に休み方や頼り先を確認しておくと役立ちます。'
    },
    {
      min: 25, max: 49, title: '負担感がたまり始めているかもしれません',
      message: '大きく崩れてはいなくても、気づかないうちに余裕が削られている可能性があります。しんどい時間帯やきっかけを整理すると、対処しやすくなります。'
    },
    {
      min: 50, max: 74, title: '負担感が高めの状態かもしれません',
      message: 'いまは複数の負担が重なっている可能性があります。あなたの努力が足りないのではなく、抱える量が多いのかもしれません。一人で抱えず、支援や相談先を視野に入れてください。'
    },
    {
      min: 75, max: 100, title: 'かなり強い負担感がある可能性があります',
      message: 'いまはかなりしんどい状態に近いかもしれません。頑張り方の問題として抱え込まず、生活を保つために誰かとつながることを優先してください。'
    }
  ];

  const tips = [
    '週の中で一番しんどい時間帯を1つ書き出す',
    '話せる相手を1人だけ決める',
    '支援先に「困りごと」ではなく「生活が回らない点」を伝える'
  ];

  const likert = [
    { value: 0, label: 'まったくあてはまらない' },
    { value: 1, label: 'あまりあてはまらない' },
    { value: 2, label: 'どちらともいえない' },
    { value: 3, label: 'ややあてはまる' },
    { value: 4, label: 'とてもあてはまる' }
  ];

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { started: false, step: 0, answers: {} };
    } catch {
      return { started: false, step: 0, answers: {} };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function normalize(raw, max) {
    return Math.round((raw / max) * 100);
  }

  function score(answers) {
    const raw = {
      child_load: 0,
      parent_fatigue: 0,
      isolation_support: 0,
      future_uncertainty: 0,
    };

    questions.forEach((q) => {
      const value = answers[q.id];
      const scored = q.reverse ? 4 - value : value;
      raw[q.scale] += scored;
    });

    const scales = {
      child_load: { raw: raw.child_load, normalized: normalize(raw.child_load, 24) },
      parent_fatigue: { raw: raw.parent_fatigue, normalized: normalize(raw.parent_fatigue, 24) },
      isolation_support: { raw: raw.isolation_support, normalized: normalize(raw.isolation_support, 24) },
      future_uncertainty: { raw: raw.future_uncertainty, normalized: normalize(raw.future_uncertainty, 24) },
    };

    const totalRaw = Object.values(raw).reduce((a, b) => a + b, 0);
    const totalNormalized = normalize(totalRaw, 96);
    const band = bands.find((item) => totalNormalized >= item.min && totalNormalized <= item.max) || bands[0];
    const topScales = Object.keys(scales).sort((a, b) => scales[b].normalized - scales[a].normalized).slice(0, 2);

    return {
      totalRaw,
      totalNormalized,
      summaryTitle: band.title,
      summaryMessage: band.message,
      scales,
      topScales
    };
  }

  function buildAiText(result) {
    return [
      '以下は「いまの育児負担セルフチェック」の結果です。診断ではなくセルフチェック結果として扱ってください。',
      '',
      '総合点: ' + result.totalNormalized + '/100',
      '総合所見: ' + result.summaryTitle,
      '総合メッセージ: ' + result.summaryMessage,
      '',
      '領域別結果:',
      '- ' + scaleLabels.child_load + ': ' + result.scales.child_load.normalized + '/100',
      '- ' + scaleLabels.parent_fatigue + ': ' + result.scales.parent_fatigue.normalized + '/100',
      '- ' + scaleLabels.isolation_support + ': ' + result.scales.isolation_support.normalized + '/100',
      '- ' + scaleLabels.future_uncertainty + ': ' + result.scales.future_uncertainty.normalized + '/100',
      '',
      '高い領域:',
      ...result.topScales.map((scale) => '- ' + scaleLabels[scale] + ': ' + scaleDescriptions[scale]),
      '',
      'この結果を踏まえて、次の3点を日本語で整理してください。',
      '1. 今の生活で優先して整えた方がよい点',
      '2. 家族・支援者・相談先に伝えるとよい内容',
      '3. 今日からできる小さな一歩'
    ].join('\n');
  }

  function el(id) {
    return document.getElementById(id);
  }

  function renderApp() {
    const root = el('assessment-root');
    if (!root) return;

    let state = loadState();

    function updateState(next) {
      state = next;
      saveState(state);
      render();
    }

    function renderIntro() {
      root.innerHTML = `
        <section class="card">
          <p class="eyebrow">匿名・端末内完結</p>
          <h1>3分でできる育児負担セルフチェック</h1>
          <p>今のしんどさを整理するための簡単なチェックです。診断ではなく、日々の負担感を見つめるためのものです。</p>
          <ul class="simple-list">
            <li>個人情報の入力は不要です</li>
            <li>回答はこの端末内で処理されます</li>
            <li>医療的な診断を行うものではありません</li>
          </ul>
          <div class="button-row">
            <button type="button" class="button button-primary" id="startCheckButton">はじめる</button>
            <button type="button" class="button button-secondary" id="resumeButton" ${Object.keys(state.answers).length ? '' : 'hidden'}>途中から再開</button>
            <button type="button" class="button button-secondary" id="resetButton" ${Object.keys(state.answers).length ? '' : 'hidden'}>保存を消して最初から</button>
          </div>
        </section>
      `;

      el('startCheckButton').onclick = () => updateState({ started: true, step: 0, answers: {} });

      const resumeButton = el('resumeButton');
      if (resumeButton) {
        resumeButton.onclick = () => updateState({ ...state, started: true });
      }

      const resetButton = el('resetButton');
      if (resetButton) {
        resetButton.onclick = () => {
          clearState();
          state = { started: false, step: 0, answers: {} };
          render();
        };
      }
    }

    function renderQuestion() {
      const q = questions[state.step];
      const progress = Math.round(((state.step + 1) / questions.length) * 100);
      const currentValue = state.answers[q.id];

      root.innerHTML = `
        <section class="card">
          <div class="progress-meta">
            <span>${state.step + 1} / ${questions.length}</span>
            <span>${progress}%</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>
        </section>

        <section class="card">
          <p class="eyebrow">設問 ${q.order}</p>
          <h2>${q.text}</h2>
          <div class="likert-grid" id="likertGrid"></div>
        </section>

        <div class="button-row">
          <button type="button" class="button button-secondary" id="backBtn" ${state.step === 0 ? 'disabled' : ''}>戻る</button>
          <button type="button" class="button button-primary" id="nextBtn" ${currentValue === undefined ? 'disabled' : ''}>
            ${state.step === questions.length - 1 ? '結果を見る' : '次へ'}
          </button>
        </div>
      `;

      const grid = el('likertGrid');
      likert.forEach((option) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'likert-button' + (currentValue === option.value ? ' selected' : '');
        button.innerHTML = `<span class="likert-value">${option.value}</span><span>${option.label}</span>`;
        button.onclick = () => {
          const nextState = {
            ...state,
            answers: {
              ...state.answers,
              [q.id]: option.value
            }
          };
          updateState(nextState);
          setTimeout(() => {
            if (state.step === questions.length - 1) {
              updateState({ ...state, step: questions.length });
            } else {
              updateState({ ...state, step: state.step + 1 });
            }
          }, 180);
        };
        grid.appendChild(button);
      });

      el('backBtn').onclick = () => {
        if (state.step > 0) updateState({ ...state, step: state.step - 1 });
      };

      el('nextBtn').onclick = () => {
        if (currentValue === undefined) return;
        if (state.step === questions.length - 1) {
          updateState({ ...state, step: questions.length });
        } else {
          updateState({ ...state, step: state.step + 1 });
        }
      };
    }

    function renderResult() {
      const result = score(state.answers);
      const aiText = buildAiText(result);

      const barsHtml = Object.keys(result.scales).map((scale) => `
        <div class="result-block">
          <div class="result-meta">
            <span>${scaleLabels[scale]}</span>
            <span>${result.scales[scale].normalized}/100</span>
          </div>
          <div class="result-track" aria-hidden="true">
            <div class="result-fill" style="width:${result.scales[scale].normalized}%"></div>
          </div>
        </div>
      `).join('');

      const topHtml = result.topScales.map((scale) => `
        <div class="soft-panel">
          <strong>${scaleLabels[scale]}</strong>
          <p>${scaleDescriptions[scale]}</p>
        </div>
      `).join('');

      root.innerHTML = `
        <section class="card">
          <h1>${result.summaryTitle}</h1>
        </section>

        <section class="card">
          <p class="eyebrow">総合表示点</p>
          <div class="score-line"><strong>${result.totalNormalized}</strong><span>/ 100</span></div>
        </section>

        <section class="card">
          <h2>総合メッセージ</h2>
          <p>${result.summaryMessage}</p>
        </section>

        <section class="card">
          <h2>領域別結果</h2>
          ${barsHtml}
        </section>

        <section class="card">
          <h2>高い領域2つの解説</h2>
          ${topHtml}
        </section>

        <section class="card">
          <h2>まず試せる一歩</h2>
          <ul class="simple-list">
            ${tips.map((tip) => `<li>${tip}</li>`).join('')}
          </ul>
        </section>

        <section class="card">
          <h2>相談先リンク</h2>
          <p class="muted">結果をコピーして、そのまま AI に貼り付けて相談できます。診断目的ではなく、状況整理や相談文づくりの補助として使う想定です。</p>
          <div class="button-row">
            <button type="button" class="button button-primary" id="copyResultButton">結果をAI相談用にコピー</button>
            <a class="button button-secondary" href="https://openai.com/chatgpt/" target="_blank" rel="noreferrer">ChatGPT を開く</a>
            <a class="button button-secondary" href="https://gemini.google.com/" target="_blank" rel="noreferrer">Gemini を開く</a>
          </div>
          <textarea class="copy-area" id="copyArea" readonly>${aiText}</textarea>
        </section>

        <div class="button-row">
          <button type="button" class="button button-secondary" id="printButton">結果を印刷</button>
          <button type="button" class="button button-secondary" id="restartButton">もう一度やる</button>
        </div>
      `;

      el('copyResultButton').onclick = async () => {
        try {
          await navigator.clipboard.writeText(aiText);
          alert('AI相談用の文章をコピーしました。');
        } catch (error) {
          el('copyArea').focus();
          el('copyArea').select();
          alert('自動コピーに失敗しました。表示中の文章を手動でコピーしてください。');
        }
      };

      el('printButton').onclick = () => window.print();
      el('restartButton').onclick = () => {
        clearState();
        state = { started: false, step: 0, answers: {} };
        render();
      };
    }

    function render() {
      const answered = Object.keys(state.answers).length;
      if (!state.started && !answered) {
        renderIntro();
        return;
      }
      if (!state.started && answered) {
        renderIntro();
        return;
      }
      if (state.step >= questions.length) {
        renderResult();
        return;
      }
      renderQuestion();
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
})();
