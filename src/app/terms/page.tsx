import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | True Beauty Reviewer",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", color: "#4a3f3f", lineHeight: "2" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "300", letterSpacing: "0.1em", marginBottom: "1rem" }}>Terms of Service</h1>
      <p style={{ color: "#8c7e7e", marginBottom: "3rem" }}>最終更新日：2026年4月24日</p>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>1. サービスの概要</h2>
        <p>「True Beauty Reviewer」（以下「本サービス」）は、美容商品に関するWEB上の情報をAIが整理・分析し、客観的な視点で情報を提供する無料ツールです。</p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>2. 免責事項</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>本サービスの分析結果はAIによる自動集計であり、正確性や医学的な効果を保証するものではありません。</li>
          <li>化粧品の肌への適合性や効果には個人差があります。最終的な購入判断は自己責任でお願いいたします。</li>
          <li>当サイトはアフィリエイト・プログラムを利用しており、紹介された商品から収益を得る場合があります。</li>
          <li>本サービスの利用により発生したいかなるトラブル・損害も、運営者は一切の責任を負いません。</li>
        </ul>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>3. 禁止事項</h2>
        <p>商用目的でのデータの無断転載、スクレイピング、その他サーバーに過度な負荷をかける行為を禁止します。</p>
      </section>

      <div style={{ marginTop: "4rem" }}>
        <a href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>← トップ画面へ戻る</a>
      </div>
    </main>
  );
}
