import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const SITE_URL = 'https://true-beauty-reviewer.vercel.app';

// LINE署名検証
function validateSignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) return true; // 未設定時はパス
  try {
    const hash = crypto
      .createHmac('SHA256', CHANNEL_SECRET.trim())
      .update(body)
      .digest('base64');
    const isValid = hash === signature;
    if (!isValid) {
      console.warn('Signature mismatch. Hash:', hash, 'Signature:', signature);
    }
    return isValid;
  } catch (e) {
    console.error('Signature validation error:', e);
    return true;
  }
}

// LINEに返信
async function replyToLine(replyToken: string, messages: any[]) {
  if (!CHANNEL_ACCESS_TOKEN) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
    return;
  }
  try {
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN.trim()}`,
      },
      body: JSON.stringify({ replyToken, messages }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('LINE reply error:', res.status, JSON.stringify(errData));
    }
  } catch (e) {
    console.error('replyToLine fetch error:', e);
  }
}

// 商品のサイトリンクを生成
function buildResultMessage(productName: string): string {
  const encodedName = encodeURIComponent(productName);
  return `✨「${productName}」のAI美容解析を開始します！

🔗 以下のリンクをタップして結果を確認してください：
${SITE_URL}?q=${encodedName}

✅ ステマ・PRリスク
✅ 実際の仕上がり・評価
✅ お肌への優しさ・刺激
✅ 成分の信頼性
✅ 定期縛り等のリスク

などを無料でAIが徹底解析します！✨

※「ヘルプ」と送ると使い方を表示します`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-line-signature') || '';

    if (!validateSignature(rawBody, signature)) {
      console.warn('LINE signature validation failed');
      return NextResponse.json({ status: 'ok' });
    }

    const body = JSON.parse(rawBody);
    const events = body.events || [];

    if (events.length === 0) {
      return NextResponse.json({ status: 'ok' });
    }

    for (const event of events) {
      if (event.type !== 'message' || event.message?.type !== 'text') {
        if (event.replyToken) {
          await replyToLine(event.replyToken, [{
            type: 'text',
            text: '📝 調べたい美容・コスメ商品名を送ってください！\n例：「リポスフェリック」「ナイトキャップ」「SK-II」',
          }]);
        }
        continue;
      }

      const userText = event.message.text.trim();

      if (userText === 'ヘルプ' || userText === 'help' || userText === '使い方') {
        await replyToLine(event.replyToken, [{
          type: 'text',
          text: `🤖 True Beauty Reviewer Bot\n\n調べたい美容・コスメ商品名を送るだけ！\n\n📌 例：\n・リポスフェリック\n・SK-II フェイシャル\n・〇〇先行美容液\n\nAIが以下を無料判定：\n✅ ステマ・PRリスク\n✅ お肌への優しさ\n✅ 実際の仕上がり満足度\n✅ 成分の科学的根拠\n\n🔗 公式サイトはこちら：\n${SITE_URL}`,
        }]);
        continue;
      }

      // URL付きの結果メッセージを即座に返信
      await replyToLine(event.replyToken, [{
        type: 'text',
        text: buildResultMessage(userText),
      }]);
    }
  } catch (err) {
    console.error('LINE webhook error:', err);
  }

  return NextResponse.json({ status: 'ok' });
}
