"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Sparkles, DollarSign, ShoppingCart, Droplets, Wind, Star, Info } from "lucide-react";

interface ScoreDetail {
  value: number;
  explanation: string;
}

interface AnalysisResult {
  productName: string;
  scores: {
    stemaRisk: ScoreDetail;
    effectiveness: ScoreDetail;
    costPerformance: ScoreDetail;
    skinFriendliness: ScoreDetail;
    usability: ScoreDetail;
  };
  riskLevel: "安全" | "要注意" | "危険";
  verdict: string;
  description: string;
  prosSummary: string[];
  consSummary: string[];
  warningPoints?: string[];
  subscriptionRisk?: { hasSubscription: boolean; detail: string; };
  yakukiho?: { hasViolation: boolean; violationWords: string[]; riskLevel: string; advice: string; };
  ingredients?: { name: string; evidence: string; note: string; }[];
  imageUrl?: string;
  adRatio?: number;
}

export default function Home() {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rakutenItems, setRakutenItems] = useState<any[]>([]);

  useEffect(() => {
    if (result) {
      document.title = `「${result.productName}」の解析結果｜True Beauty Reviewer`;
    } else {
      document.title = "🔍 美容品ステマ判定｜True Beauty Reviewer（AI本音解析）";
    }
  }, [result]);

  useEffect(() => {
    if (initialQuery) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setTimeout(() => handleSearch(fakeEvent), 300);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setRakutenItems([]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      
      const rakutenRes = await fetch(`/api/rakuten?keyword=${encodeURIComponent(query)}`);
      const rakutenData = await rakutenRes.json();
      if (rakutenData.Items) {
         setRakutenItems(rakutenData.Items);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level: string) => {
    if (level === "安全") return "safe";
    if (level === "危険") return "danger";
    return "warning";
  };

  const RiskIcon = ({ level }: { level: string }) => {
    if (level === "安全") return <ShieldCheck size={32} strokeWidth={1.5} />;
    if (level === "危険") return <ShieldAlert size={32} strokeWidth={1.5} />;
    return <AlertTriangle size={32} strokeWidth={1.5} />;
  };

  const ScoreCard = ({ label, detail, type, icon: Icon }: { label: string, detail: ScoreDetail, type: 'positive' | 'negative', icon: any }) => (
    <div className={`score-card-rich score-${type}`}>
      <div className="score-top">
        <div className="score-label">
          <Icon size={20} strokeWidth={1.5} />
          <span>{label}</span>
        </div>
        <div className="score-num">
          {detail.value}<span className="score-total">/100</span>
        </div>
      </div>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${detail.value}%` }}></div>
      </div>
      <p className="score-desc">{detail.explanation}</p>
    </div>
  );

  return (
    <main className="container">
      <div className="glass-panel">
        <h1 className="title">True Beauty Reviewer</h1>
        <p className="subtitle">AIによる美容品の本音・ステマ解析</p>

        <div style={{ background: "rgba(200,138,138,0.05)", border: "1px solid rgba(200,138,138,0.15)", borderRadius: "24px", padding: "2rem", marginBottom: "3rem", lineHeight: "1.8", color: "#6e5d5d", fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "1rem" }}>
            「SNSでバズってるけど、私の肌に合う？」「PR広告ばかりで本当の評判がわからない…」<br />
            そんな悩みを解決するために、<strong>AIがWEB上の膨大なリアル口コミを精査し、その“真実”を可視化</strong>します。
          </p>
          <p>
            「ステマの疑い」「実際の仕上がり」「肌への刺激・成分」「コスパ」など、広告からは読み取れない情報を多角的に分析。憧れの美容品を手にする前に、一度AIの眼でチェックしてみてください。
          </p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search className="search-icon" size={22} strokeWidth={1.5} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="商品名を入力（例：リポスフェリック）"
              className="search-input"
            />
          </div>
          <button type="submit" disabled={loading} className="search-button">
            {loading ? "分析中..." : "真実を解析"}
          </button>
        </form>

        {/* カテゴリー別：人気検索ワード */}
        <div style={{ marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#8c7e7e", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Star size={18} color="var(--primary)" fill="var(--primary)" /> カテゴリー別トレンド
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {[
              { label: "🧴 スキンケア・先行美容液", items: ["リポスフェリック", "SK-II フェイシャル", "導入美容液 潤い", "ビタミンC導入体", "敏感肌用 化粧水"] },
              { label: "💄 ベース・ポイントメイク", items: ["崩れないファンデ", "リキッドファンデ", "ティントリップ", "アイブロウ落ちない", "美容液マスカラ"] },
              { label: "💇‍♀️ ヘア・ボディケア", items: ["ナイトキャップ", "ヘアオイル 美容液", "育毛・スカルプ", "除毛クリーム", "ホワイトニング歯磨き"] },
              { label: "🥗 美容内服・サプリ", items: ["コラーゲンペプチド", "飲む日焼け止め", "プラセンタ", "鉄分サプリ", "美容ドリンク"] },
            ].map((cat) => (
              <div key={cat.label}>
                <h4 style={{ fontSize: "0.85rem", color: "#4a3f3f", marginBottom: "0.8rem", fontWeight: "600" }}>{cat.label}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {cat.items.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setQuery(p);
                        const ev = { preventDefault: () => {} } as React.FormEvent;
                        handleSearch(ev);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "100px",
                        border: "1px solid #eee",
                        background: "#fff",
                        fontSize: "0.8rem",
                        color: "#8c7e7e",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#8c7e7e"; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message" style={{ color: "var(--danger)", padding: "1rem", textAlign: "center", background: "var(--danger-bg)", borderRadius: "16px", marginBottom: "2rem" }}>{error}</div>}

        {result && (
          <div className="result-container animate-fade-in">
            {/* 総合リスクバナー */}
            <div className={`risk-banner-rich ${getRiskClass(result.riskLevel)}`}>
              <div className="risk-left">
                <RiskIcon level={result.riskLevel} />
                <div className="risk-text-box">
                  <span className="risk-mini-label">ステマリスク判定</span>
                  <div className="risk-main-title">{result.riskLevel}</div>
                </div>
              </div>
              <div className="risk-right">
                <div className="risk-percent">{result.scores.stemaRisk.value}%</div>
                <div className="risk-percent-label">RISK SCORE</div>
              </div>
            </div>

            {/* AIの結論カード */}
            <div className="verdict-card-rich">
              <div className="verdict-header">
                <Sparkles size={22} className="sparkle-icon" strokeWidth={1.5} />
                <h2>AIのズバリ判定</h2>
              </div>
              <div className="verdict-main">「{result.verdict}」</div>
              <p className="verdict-sub">{result.description}</p>
            </div>

            {/* 数値スコアグリッド */}
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Info size={18} strokeWidth={1.5} /> 詳細解析スコア
            </h3>
            
            <div className="score-grid-rich">
              <ScoreCard label="ステマ・PR色" detail={result.scores.stemaRisk} type="negative" icon={ShieldAlert} />
              <ScoreCard label="仕上がり・効果満足度" detail={result.scores.effectiveness} type="positive" icon={Sparkles} />
              <ScoreCard label="コスパ・納得感" detail={result.scores.costPerformance} type="positive" icon={DollarSign} />
              <ScoreCard label="肌への優しさ・低刺激" detail={result.scores.skinFriendliness} type="positive" icon={Droplets} />
              <ScoreCard label="使い心地・香り" detail={result.scores.usability} type="positive" icon={Wind} />
            </div>

            {/* メリット・デメリット */}
            <div className="details-grid-rich">
              <div className="details-column">
                <h3 className="pros-title"><ThumbsUp size={20} strokeWidth={1.5} /> リアルな高評価</h3>
                <ul className="details-list">
                  {result.prosSummary.map((item, i) => <li key={i}><span className="plus">+</span>{item}</li>)}
                </ul>
              </div>
              <div className="details-column">
                <h3 className="cons-title"><ThumbsDown size={20} strokeWidth={1.5} /> リアルな懸念点</h3>
                <ul className="details-list">
                  {result.consSummary.map((item, i) => <li key={i}><span className="minus">-</span>{item}</li>)}
                </ul>
              </div>
            </div>

            {/* 注意点セクション */}
            {result.warningPoints && result.warningPoints.length > 0 && (
              <div className="warning-card-rich">
                <h3><AlertTriangle size={20} strokeWidth={1.5} /> 購入前に知っておくべき注意点</h3>
                <ul className="warning-list-rich">
                  {result.warningPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            {/* 薬機法・成分セクション */}
            <div className="info-grid-rich">
              {result.yakukiho && (
                <div className="info-box yakukiho-box">
                  <h4><ShieldAlert size={18} strokeWidth={1.5} /> 広告表現の信憑性</h4>
                  <div className="violation-tags">
                    {result.yakukiho.violationWords.map((w, idx) => <span key={idx} className="tag">{w}</span>)}
                    {result.yakukiho.violationWords.length === 0 && <span style={{ color: "var(--safe)", fontSize: "0.8rem" }}>慎重な表現がされています</span>}
                  </div>
                  <p>{result.yakukiho.advice}</p>
                </div>
              )}
              {result.subscriptionRisk && (
                <div className="info-box">
                  <h4><ShoppingCart size={18} strokeWidth={1.5} /> 定期購入のリスク</h4>
                  <p>{result.subscriptionRisk.detail}</p>
                </div>
              )}
            </div>

            {/* 成分チェック */}
            {result.ingredients && result.ingredients.length > 0 && (
              <div className="ingredients-card-rich">
                <h3><Droplets size={18} strokeWidth={1.5} /> 注目の成分解析</h3>
                {result.ingredients.map((ing, i) => (
                  <div key={i} className="ingredient-item">
                    <span className={`evidence-badge e-${ing.evidence}`}>
                      {ing.evidence === "high" ? "根拠：強" : ing.evidence === "medium" ? "根拠：中" : "根拠：弱"}
                    </span>
                    <div className="ing-info">
                      <strong>{ing.name}</strong>
                      <p>{ing.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SNSシェア */}
            <div className="share-section-rich">
              <p>この結果をシェアして友達の美容もサポートする</p>
              <div className="share-btns">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【AI解析】「${result.productName}」の本音判定が出ました✨\n\n🛡️ ステマリスク: ${result.scores.stemaRisk.value}%\n💎 結論：${result.verdict}\n\n詳細はこちら👇\n#TrueBeautyReviewer #美容垢さんと繋がりたい\n`)}&url=${encodeURIComponent(`https://true-beauty-reviewer.vercel.app/?q=${result.productName}`)}`} target="_blank" className="btn-x">𝕏 でポスト</a>
                <a href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://true-beauty-reviewer.vercel.app/?q=${result.productName}`)}`} target="_blank" className="btn-line">LINEで送る</a>
              </div>
            </div>

            {/* マネタイズ */}
            <div className="monetization-rich" style={{ borderTop: "1px dashed var(--border)", paddingTop: "4rem", marginTop: "4rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "2rem", textAlign: "center" }}>📦 解析した商品のショッピング情報</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                <a href={`https://hb.afl.rakuten.co.jp/ichiba/52f1f988.9bcb825b.52f1f989.d0a8b332/?pc=${encodeURIComponent(`https://search.rakuten.co.jp/search/mall/${result.productName}/`)}&link_type=text`} target="_blank" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", borderRadius: "24px", background: "#bf0000", color: "#fff", textDecoration: "none", fontWeight: "600", transition: "0.2s" }}>
                  <ShoppingCart size={20} /> 楽天市場で最安値をチェック
                </a>
                <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(result.productName)}&tag=s19801111-22`} target="_blank" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem", borderRadius: "24px", background: "#ff9900", color: "#fff", textDecoration: "none", fontWeight: "600", transition: "0.2s" }}>
                  <ShoppingCart size={20} /> Amazonでレビューを確認
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 豆知識コラム */}
      <div style={{ marginTop: "5rem" }}>
        <h3 style={{ fontSize: "1.6rem", fontWeight: "300", color: "#3d3030", textAlign: "center", marginBottom: "4rem", letterSpacing: "0.1em" }}>
          Beauty Column
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "32px", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "600", marginBottom: "1rem" }}>1. 「有名人愛用」の魔法を解く</h4>
            <p style={{ fontSize: "0.9rem", color: "#7d6565", lineHeight: "2" }}>
              SNSで見かける「モデルさんの愛用品」。実は高額な契約によるプロモーションであることも少なくありません。当AIは、そんな虚像を剥ぎ取り、実際に一般ユーザーが自腹で買ってどう感じたかを冷静に分析します。
            </p>
          </div>
          <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "32px", border: "1px solid var(--border)" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "600", marginBottom: "1rem" }}>2. 自分の肌質を知る重要性</h4>
            <p style={{ fontSize: "0.9rem", color: "#7d6565", lineHeight: "2" }}>
              どんなに評価が高い美容液も、あなたの肌質（乾燥・脂性・混合など）に合わなければ意味がありません。解析結果では、どのような層の人々が満足しているのかを重点的に抽出しています。
            </p>
          </div>
        </div>
      </div>

      <footer className="footer-rich">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        <p className="menseki">【免責事項】当サイトの分析はAIによる自動集計であり、特定の個人の感想に基づくものです。仕上がりや効果を保証するものではありません。購入判断は自己責任でお願いいたします。</p>
        <p className="copyright">© 2026 True Beauty Reviewer</p>
      </footer>
    </main>
  );
}
