(function () {
  const questions = window.CARE_CHECK_QUESTIONS || [];
  const STORAGE_KEY = 'care-check-static-v3';
  const SCALE_MAX_RAW = 20;
  const TOTAL_MAX_RAW = 120;

  const scaleLabels = {
    child_complexity: '子ども対応の複雑さ',
    life_pressure: '生活の圧迫感',
    parent_exhaustion: '親自身の消耗',
    outlook_difficulty: '見通しと手応えの持ちにくさ',
    support_scarcity: '支援・協力の乏しさ',
    recovery_scarcity: '回復資源の乏しさ',
  };

  const scaleDescriptions = {
    child_complexity:
      '子どもへの対応そのものに負担がかかっているようです。しつけの問題として抱え込むより、場面の整え方や生活の回し方を見直す方が役立つことがあります。',
    life_pressure:
      '毎日の生活を回すこと自体が重荷になっている可能性があります。個々の対応より、負担の量と予定の組み方を調整することが重要かもしれません。',
    parent_exhaustion:
      '親自身の心身の余裕がかなり削られている可能性があります。気合いで乗り切るより、休息・分担・相談を優先した方がよい状態かもしれません。',
    outlook_difficulty:
      '何をどうすればよいか分からない感じや、やっても報われにくい感覚が、しんどさを大きくしている可能性があります。次の一歩だけを具体化することが有効です。',
    support_scarcity:
      '困りごとそのものより、相談相手や協力体制の薄さが負担を強めている可能性があります。まずは「誰につながるか」を整えることが大切です。',
    recovery_scarcity:
      'しんどさを回復させる時間や感覚が不足している可能性があります。休む力や立て直すきっかけを確保することが、今はとても重要かもしれません。',
  };

  const bands = [
    { min: 0, max: 24, title: '現時点の負担感は比較的低め' },
    { min: 25, max: 49, title: '負担感がたまり始めている可能性' },
    { min: 50, max: 74, title: '負担感が高め' },
    { min: 75, max: 100, title: 'かなり強い負担感がある可能性' },
  ];

  const scaleBands = [
    { min: 0, max: 24, title: 'いまのところ大きな偏りは目立ちにくい' },
    { min: 25, max: 49, title: 'やや負担が出ているかもしれない' },
    { min: 50, max: 74, title: 'この領域がしんどさを押し上げている可能性' },
    { min: 75, max: 100, title: 'この領域がかなり大きな負担源になっている可能性' },
  ];

  const tips = [
    '今日〜明日の中で、最もしんどい時間帯を1つだけ特定する',
    '「助けてほしい内容」を1文で書き出して、共有先を1人決める',
    '次の1週間で負担を減らせる予定調整を、1つだけ実行する',
  ];

  const likert = [
    { value: 0, label: 'まったくあてはまらない' },
    { value: 1, label: 'あまりあてはまらない' },
    { value: 2, label: 'どちらともいえない' },
    { value: 3, label: 'ややあてはまる' },
    { value: 4, label: 'とてもあてはまる' },
  ];

  const likertMap = Object.fromEntries(likert.map((item) => [item.value, item.label]));

  const defaultMeta = {
    childAgeBand: '',
    childCount: '',
    hardTimeSlots: [],
    freeText: '',
  };

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        started: false,
        step: 0,
        answers: {},
        meta: { ...defaultMeta },
      };
    } catch {
      return {
        started: false,
        step: 0,
        answers: {},
        meta: { ...defaultMeta },
      };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 保存失敗時はメモリ上の状態で継続
    }
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function normalize(raw, max) {
    return Math.round((raw / max) * 100);
  }

  function getBand(scoreValue, options) {
    return options.find((item) => scoreValue >= item.min && scoreValue <= item.max) || options[0];
  }

  function score(answers) {
    const raw = {
      child_complexity: 0,
      life_pressure: 0,
      parent_exhaustion: 0,
      outlook_difficulty: 0,
      support_scarcity: 0,
      recovery_scarcity: 0,
    };

    questions.forEach((q) => {
      const value = answers[q.id];
      const safeValue = typeof value === 'number' ? value : 0;
      raw[q.scale] += safeValue;
    });

    const scales = Object.fromEntries(
      Object.entries(raw).map(([scaleKey, rawScore]) => [
        scaleKey,
        {
          raw: rawScore,
          normalized: normalize(rawScore, SCALE_MAX_RAW),
          band: getBand(normalize(rawScore, SCALE_MAX_RAW), scaleBands).title,
        },
      ])
    );

    const totalRaw = Object.values(raw).reduce((a, b) => a + b, 0);
    const totalNormalized = normalize(totalRaw, TOTAL_MAX_RAW);
    const band = getBand(totalNormalized, bands);
    const topScales = Object.keys(scales)
      .sort((a, b) => scales[b].normalized - scales[a].normalized)
      .slice(0, 2);

    return {
      totalRaw,
      totalNormalized,
      summaryTitle: band.title,
      summaryMessage:
        'いまの子育ての中で、複数の負担が重なっている可能性があります。これは努力不足という意味ではなく、抱える量や状況の複雑さが大きいのかもしれません。しんどさの中身を分けて見ると、次の一歩が見えやすくなります。',
      scales,
      topScales,
    };
  }

  function buildQuestionAnswerList(answers) {
    return questions
      .map((q, index) => {
        const rawValue = answers[q.id];
        const answerLabel =
          typeof rawValue === 'number' && rawValue in likertMap
            ? `${rawValue}（${likertMap[rawValue]}）`
            : '未回答';

        return `${index + 1}. [${scaleLabels[q.scale]}] ${q.text}\n   回答: ${answerLabel}`;
      })
      .join('\n');
  }

  function buildMetaSummary(meta) {
    const ageLabelMap = {
      age_0_2: '0〜2歳',
      age_3_5: '3〜5歳',
      age_elementary: '小学生',
      age_junior_plus: '中学生以上',
    };

    const countLabelMap = {
      one: '1人',
      two: '2人',
      three_plus: '3人以上',
    };

    const slotLabelMap = {
      morning: '朝',
      evening: '夕方',
      night: '夜',
      bedtime: '寝かしつけ',
      outing: '外出時',
      homework: '宿題や準備',
      other: 'その他',
    };

    return [
      `- 子どもの年齢帯: ${ageLabelMap[meta.childAgeBand] || '未選択'}`,
      `- 子どもの人数: ${countLabelMap[meta.childCount] || '未選択'}`,
      `- 特にしんどかった時間帯: ${meta.hardTimeSlots.length ? meta.hardTimeSlots.map((slot) => slotLabelMap[slot] || slot).join(' / ') : '未選択'}`,
      `- 自由記述: ${meta.freeText ? meta.freeText : '（記入なし）'}`,
    ].join('\n');
  }

  function buildAiText(result, answers, meta) {
    const questionAnswerList = buildQuestionAnswerList(answers);
    const metaSummary = buildMetaSummary(meta);

    return [
      '以下は「いまの子育て負担セルフチェック」（ここ1か月）の結果です。',
      'これは医療的診断ではなく、子育て負担の整理のためのセルフチェックです。',
      '',
      '【総合結果】',
      `総合点: ${result.totalNormalized}/100（生点 ${result.totalRaw}/120）`,
      `総合判定: ${result.summaryTitle}`,
      `総合メッセージ: ${result.summaryMessage}`,
      '',
      '【領域別結果（6軸）】',
      ...Object.keys(result.scales).map(
        (scale) => `- ${scaleLabels[scale]}: ${result.scales[scale].normalized}/100（${result.scales[scale].band}）`
      ),
      '',
      '【上位2軸】',
      ...result.topScales.map((scale) => `- ${scaleLabels[scale]}: ${scaleDescriptions[scale]}`),
      '',
      '【補助項目】',
      metaSummary,
      '',
      '【全設問と回答】',
      questionAnswerList,
      '',
      '【依頼】',
      'あなたは、保護者支援・家族支援の観点を持つ慎重で実務的な相談補助AIとして振る舞ってください。',
      'この結果を診断として扱わず、保護者を責めない表現で、現実的な次の一歩を提案してください。',
      '出力は次の見出し順にしてください。',
      '① 全体の見立て',
      '② 上位2軸から見える負担の特徴',
      '③ まず整えたいこと',
      '④ 家族や支援者に伝えるとよい内容',
      '⑤ 相談先に持っていける説明文',
      '⑥ 今日からできる小さな一歩',
    ].join('\n');
  }

  function el(id) {
    return document.getElementById(id);
  }

  function renderApp() {
    const root = el('assessment-root');
    if (!root) return;

    let state = loadState();
    if (!state.meta) {
      state.meta = { ...defaultMeta };
    }

    function updateState(next) {
      state = next;
      saveState(state);
      render();
    }

    function renderIntro() {
      root.innerHTML = `
        <section class="card">
          <p class="eyebrow">匿名・端末内完結</p>
          <h1>4〜6分でできる子育て負担セルフチェック</h1>
          <p>対象は、0歳〜小学生程度の子どもを育てる保護者の方全般です。診断の有無にかかわらず利用できます。</p>
          <ul class="simple-list">
            <li>回答期間は「ここ1か月」の状態です</li>
            <li>30問（6軸×各5問）・5件法で回答します</li>
            <li>診断ではなく、今の負担感を整理するためのツールです</li>
          </ul>
        </section>

        <section class="card">
          <h2>任意の補助項目（採点には使いません）</h2>
          <p class="muted">結果の補助表示や相談文づくりに使います。未入力でもそのまま開始できます。</p>

          <label for="childAgeBand">子どもの年齢帯</label>
          <select id="childAgeBand" class="select-field">
            <option value="">選択しない</option>
            <option value="age_0_2" ${state.meta.childAgeBand === 'age_0_2' ? 'selected' : ''}>0〜2歳</option>
            <option value="age_3_5" ${state.meta.childAgeBand === 'age_3_5' ? 'selected' : ''}>3〜5歳</option>
            <option value="age_elementary" ${state.meta.childAgeBand === 'age_elementary' ? 'selected' : ''}>小学生</option>
            <option value="age_junior_plus" ${state.meta.childAgeBand === 'age_junior_plus' ? 'selected' : ''}>中学生以上</option>
          </select>

          <label for="childCount">子どもの人数</label>
          <select id="childCount" class="select-field">
            <option value="">選択しない</option>
            <option value="one" ${state.meta.childCount === 'one' ? 'selected' : ''}>1人</option>
            <option value="two" ${state.meta.childCount === 'two' ? 'selected' : ''}>2人</option>
            <option value="three_plus" ${state.meta.childCount === 'three_plus' ? 'selected' : ''}>3人以上</option>
          </select>

          <p>ここ1か月で特にしんどかった時間帯（複数選択可）</p>
          <div class="chips" id="timeSlotChips"></div>

          <label for="freeText">いま一番しんどいと感じていること（任意）</label>
          <textarea id="freeText" class="copy-area" rows="5" placeholder="自由に入力してください">${state.meta.freeText || ''}</textarea>
        </section>

        <div class="button-row">
          <button type="button" class="button button-primary" id="startCheckButton">はじめる</button>
          <button type="button" class="button button-secondary" id="resumeButton" ${
            Object.keys(state.answers).length ? '' : 'hidden'
          }>途中から再開</button>
          <button type="button" class="button button-secondary" id="resetButton" ${
            Object.keys(state.answers).length ? '' : 'hidden'
          }>保存を消して最初から</button>
        </div>
      `;

      const timeSlotOptions = [
        ['morning', '朝'],
        ['evening', '夕方'],
        ['night', '夜'],
        ['bedtime', '寝かしつけ'],
        ['outing', '外出時'],
        ['homework', '宿題や準備'],
        ['other', 'その他'],
      ];

      const chips = el('timeSlotChips');
      timeSlotOptions.forEach(([value, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        const selected = state.meta.hardTimeSlots.includes(value);
        button.className = `chip ${selected ? 'selected' : ''}`;
        button.textContent = label;
        button.onclick = () => {
          const nextSlots = selected
            ? state.meta.hardTimeSlots.filter((item) => item !== value)
            : [...state.meta.hardTimeSlots, value];
          updateState({
            ...state,
            meta: {
              ...state.meta,
              hardTimeSlots: nextSlots,
            },
          });
        };
        chips.appendChild(button);
      });

      el('childAgeBand').onchange = (event) => {
        updateState({
          ...state,
          meta: {
            ...state.meta,
            childAgeBand: event.target.value,
          },
        });
      };

      el('childCount').onchange = (event) => {
        updateState({
          ...state,
          meta: {
            ...state.meta,
            childCount: event.target.value,
          },
        });
      };

      el('freeText').onchange = (event) => {
        updateState({
          ...state,
          meta: {
            ...state.meta,
            freeText: event.target.value,
          },
        });
      };

      el('startCheckButton').onclick = () =>
        updateState({ ...state, started: true, step: 0, answers: {} });

      const resumeButton = el('resumeButton');
      if (resumeButton) {
        resumeButton.onclick = () => updateState({ ...state, started: true });
      }

      const resetButton = el('resetButton');
      if (resetButton) {
        resetButton.onclick = () => {
          clearState();
          state = { started: false, step: 0, answers: {}, meta: { ...defaultMeta } };
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
          <p class="eyebrow">設問 ${q.order}（ここ1か月）</p>
          <h2>${q.text}</h2>
          <div class="likert-grid" id="likertGrid"></div>
        </section>

        <div class="button-row">
          <button type="button" class="button button-secondary" id="backBtn" ${
            state.step === 0 ? 'disabled' : ''
          }>戻る</button>
          <button type="button" class="button button-primary" id="nextBtn" ${
            currentValue === undefined ? 'disabled' : ''
          }>
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
          const nextStep = state.step === questions.length - 1 ? questions.length : state.step + 1;
          updateState({
            ...state,
            step: nextStep,
            answers: {
              ...state.answers,
              [q.id]: option.value,
            },
          });
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
      const aiText = buildAiText(result, state.answers, state.meta);
      const ageLabelMap = {
        age_0_2: '0〜2歳',
        age_3_5: '3〜5歳',
        age_elementary: '小学生',
        age_junior_plus: '中学生以上',
      };
      const countLabelMap = {
        one: '1人',
        two: '2人',
        three_plus: '3人以上',
      };
      const slotLabelMap = {
        morning: '朝',
        evening: '夕方',
        night: '夜',
        bedtime: '寝かしつけ',
        outing: '外出時',
        homework: '宿題や準備',
        other: 'その他',
      };
      const timeSlotText = state.meta.hardTimeSlots.length
        ? `特に「${state.meta.hardTimeSlots
            .map((slot) => slotLabelMap[slot] || slot)
            .join(' / ')}」に負担が集中している可能性があります。`
        : '';

      const barsHtml = Object.keys(result.scales)
        .map(
          (scale) => `
        <div class="result-block">
          <div class="result-meta">
            <span>${scaleLabels[scale]}</span>
            <span>${result.scales[scale].normalized}/100</span>
          </div>
          <div class="result-track" aria-hidden="true">
            <div class="result-fill" style="width:${result.scales[scale].normalized}%"></div>
          </div>
          <p class="small muted">${result.scales[scale].band}</p>
        </div>
      `
        )
        .join('');

      const topHtml = result.topScales
        .map(
          (scale) => `
        <div class="soft-panel">
          <strong>${scaleLabels[scale]}</strong>
          <p>${scaleDescriptions[scale]}</p>
        </div>
      `
        )
        .join('');

      root.innerHTML = `
        <section class="card">
          <h1>${result.summaryTitle}</h1>
        </section>

        <section class="card">
          <p class="eyebrow">総合表示点</p>
          <div class="score-line"><strong>${result.totalNormalized}</strong><span>/ 100（生点 ${result.totalRaw}/120）</span></div>
          <p>${result.summaryMessage}</p>
        </section>

        <section class="card">
          <h2>領域別結果（6軸）</h2>
          ${barsHtml}
        </section>

        <section class="card">
          <h2>上位2軸の解説</h2>
          ${topHtml}
        </section>

        <section class="card">
          <h2>補助項目のふりかえり</h2>
          <ul class="simple-list">
            <li>子どもの年齢帯: ${ageLabelMap[state.meta.childAgeBand] || '未選択'}</li>
            <li>子どもの人数: ${countLabelMap[state.meta.childCount] || '未選択'}</li>
            <li>しんどい時間帯: ${state.meta.hardTimeSlots.length ? state.meta.hardTimeSlots.map((slot) => slotLabelMap[slot] || slot).join(' / ') : '未選択'}</li>
            <li>自由記述: ${state.meta.freeText ? state.meta.freeText : '（記入なし）'}</li>
          </ul>
          ${timeSlotText ? `<p class="muted">${timeSlotText}</p>` : ''}
        </section>

        <section class="card">
          <h2>まず試せる一歩</h2>
          <ul class="simple-list">
            ${tips.map((tip) => `<li>${tip}</li>`).join('')}
          </ul>
        </section>

        <section class="card">
          <h2>相談先リンク</h2>
          <p class="muted">
            結果をコピーして、そのまま AI に貼り付けて相談できます。
            診断目的ではなく、状況整理や相談文づくりの補助として使う想定です。
          </p>
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
        } catch {
          el('copyArea').focus();
          el('copyArea').select();
          alert('自動コピーに失敗しました。表示中の文章を手動でコピーしてください。');
        }
      };

      el('printButton').onclick = () => window.print();
      el('restartButton').onclick = () => {
        clearState();
        state = { started: false, step: 0, answers: {}, meta: { ...defaultMeta } };
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
