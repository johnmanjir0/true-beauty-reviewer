import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: '商品名が入力されていません。' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API Key');
      return NextResponse.json({ error: 'サーバーのGemini APIキー設定が不足しています。' }, { status: 500 });
    }

    // 1. Yahooウェブ検索にて口コミを収集
    const searchQuery = `${productName} 口コミ OR 評判 OR 成分 OR 肌荒れ OR ステマ OR 効果`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" };

    let searchContext = "";
    try {
      const searchResponse = await fetch(searchUrl, { headers });
      if (searchResponse.ok) {
        const html = await searchResponse.text();
        const $ = cheerio.load(html);
        const snippets: string[] = [];
        $('.sw-Card').each((i, el) => {
          const title = $(el).find('h3').text() || $(el).find('.sw-Card__title').text();
          const summary = $(el).find('.sw-Card__summary').text() || $(el).find('.sw-Card__desc').text();
          if (title && summary) {
            snippets.push(`【記事${i+1}】\n${title}\n${summary}`);
          }
        });
        searchContext = snippets.slice(0, 10).join('\n\n');
      }
    } catch (e) {
      console.warn('Search failed:', e);
    }

    const prompt = `
あなたは優秀な「美容商品の口コミ・ステマ判定AI」です。
ユーザーが調べたい美容商品名: 「${productName}」
以下のウェブ検索結果を元に、客観的かつ多角的に分析し、JSON形式で返してください。

【検索結果データ】
${searchContext}

【分析の視点】
- ステマ（広告）とリアルなユーザーの声を峻別してください。
- 成分の信頼性や、特定の肌質（乾燥肌、敏感肌など）への影響も考慮してください。
- 薬機法上の懸念事項（過大な表現）があれば指摘してください。

【出力形式】
{
  "productName": "${productName}",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": {
    "stemaRisk": { "value": 0-100, "explanation": "宣伝色の強さや広告口コミの多さの解説" },
    "effectiveness": { "value": 0-100, "explanation": "仕上がりや実際の美容効果に対する満足度の解説" },
    "costPerformance": { "value": 0-100, "explanation": "価格に対する効果や容量の納得感の解説" },
    "skinFriendliness": { "value": 0-100, "explanation": "刺激の少なさ、肌荒れリスク、成分の優しさの解説" },
    "usability": { "value": 0-100, "explanation": "使い心地、香り、パッケージの利便性の解説" }
  },
  "verdict": "ズバリ判定の一言（30文字以内）",
  "description": "詳しい詳細分析と、どのような肌質・タイプの人に合うかのアドバイス",
  "prosSummary": ["メリット1", "メリット2", "メリット3", "メリット4", "メリット5"],
  "consSummary": ["デメリット1", "デメリット2", "デメリット3", "デメリット4", "デメリット5"],
  "warningPoints": ["購入前の具体的注意点（肌荒れ、解約トラブル、偽物注意など）1", "注意点2"],
  "subscriptionRisk": { "hasSubscription": boolean, "detail": "定期購入コースの有無や解約条件の注意点" },
  "yakukiho": { "hasViolation": boolean, "riskLevel": "高"| "中"| "低", "violationWords": ["過大表現ワード"], "advice": "広告表現に対する注意喚起" },
  "ingredients": [{ "name": "主要成分名", "evidence": "high"|"medium"|"low", "note": "成分の効果や期待できる役割" }],
  "imageUrl": "",
  "adRatio": 0-100
}
`;

    const apiKey = GEMINI_API_KEY.trim();
    const MODELS = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-flash'];

    let responseData = null;
    let lastErrorDetails = "";

    for (const model of MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const resJson = await geminiRes.json();
        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          responseData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
          break;
        } else {
          lastErrorDetails = resJson.error?.message || JSON.stringify(resJson);
        }
      } catch (e: any) {
        lastErrorDetails = e.message;
      }
    }

    if (!responseData) {
      return NextResponse.json({ error: 'AI解析に失敗しました。', details: lastErrorDetails }, { status: 503 });
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Final Analysis error:', error);
    return NextResponse.json({ error: 'システム内部エラーが発生しました。', details: error.message }, { status: 500 });
  }
}
