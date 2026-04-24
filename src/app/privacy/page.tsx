import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | True Beauty Reviewer",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 1.5rem", color: "#4a3f3f", lineHeight: "2" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "300", letterSpacing: "0.1em", marginBottom: "1rem" }}>Privacy Policy</h1>
      <p style={{ color: "#8c7e7e", marginBottom: "3rem" }}>最終更新日：2026年4月24日</p>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>1. 収集する情報</h2>
        <p>当サービス「True Beauty Reviewer」（以下「本サービス」）は、以下の情報を収集することがあります。</p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>ユーザーが入力した商品名（AI解析および検索目的のみに使用）</li>
          <li>Google Analytics 等によるアクセスログ（IPアドレス、ブラウザ情報等）</li>
          <li>LINE等SNS連携をご利用の場合：各プラットフォームの識別子</li>
        </ul>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>2. 情報の利用目的</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>美容商品の口コミ解析結果の提供</li>
          <li>サービスの改善・ユーザーエクスペリエンスの向上</li>
          <li>広告の配信および効果測定</li>
        </ul>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>3. 第三者への提供</h2>
        <p>収集した情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。</p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#3d3030", marginBottom: "1.5rem" }}>4. お問い合わせ</h2>
        <p>本ポリシーに関するお問い合わせは、SNS公式アカウントまでご連絡ください。</p>
      </section>
      
      <div style={{ marginTop: "4rem" }}>
        <a href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>← トップ画面へ戻る</a>
      </div>
    </main>
  );
}
