import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  // StripeからのWebhookリクエストの本体をテキストとして取得します。
  const body = await request.text();
  // リクエストヘッダーからStripeの署名を取得します。
  // この署名は安全性を検証するために使用されます。
  const sig = headers().get("Stripe-Signature");

  // 環境変数からStripeのWebhookシークレットを取得します。
  // 本番用またはテスト用の秘密鍵が設定されていることを確認します。
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    // 署名またはWebhookシークレットが見つからない場合は処理を続行できません。
    if (!sig || !webhookSecret) return;
    // Stripeのライブラリを使ってWebhookイベントを構成し、安全性を確認します。
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    // 署名が不正あるいは期待しないエラーが発生したら、
    // エラーメッセージを出力して、HTTPステータス400でレスポンスを返します。
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 処理するイベントの種類を判別します。
  if (relevantEvents.has(event.type)) {
    try {
      // イベントの種類に応じて適切な処理を実行します。
      switch (event.type) {
        // 製品が作成または更新されたときの処理
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        // 価格設定が作成または更新されたときの処理
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        // 定期購読に関する変更事項があったときの処理
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        // 支払いが完了したときの処理
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          // 支払いが定期購読のものであれば、定期購読の状態変更を管理します。
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        // ここには書かれていないイベントタイプの場合エラーを投げます。
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      // 何かしらの問題が起きた場合には、それが何であったかをログに出力し、
      // HTTPステータス400でエラーメッセージを含めたレスポンスを返します。
      console.log(error);
      return new NextResponse(
        'Webhook error: "Webhook handler failed. View logs."',
        { status: 400 }
      );
    }
  }

  // 全ての処理が正常に完了したことを示すために、
  // HTTPステータス200で、イベントの受信を確認したことをJSON形式でレスポンスします。
  return NextResponse.json({ received: true }, { status: 200 });
}
