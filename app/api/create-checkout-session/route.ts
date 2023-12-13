import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getURL } from '@/libs/helpers';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';

export async function POST(
    request: Request
  ) {
    // リクエストから価格、数量（デフォルトは1）、メタデータ（デフォルトは空オブジェクト）を取得します。
    const { price, quantity = 1, metadata = {} } = await request.json();
  
    try {
      // Supabaseクライアントを初期化します。
      const supabase = createRouteHandlerClient({ 
        cookies
      });      
  
      // 認証済みのユーザー情報を取得します。
      const {
        data: { user }
      } = await supabase.auth.getUser();
  
      // ストライプの顧客IDを取得または作成します。
      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
  
      // ストライプのチェックアウトセッションを作成します。
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // 支払い方法の種類を指定します。
        billing_address_collection: 'required', // 請求先住所の入力を必須とします。
        customer, // 顧客情報を渡します。
        line_items: [ // 購入商品のリストを指定します。
          {
            price: price.id, // 商品の価格ID
            quantity // 数量
          }
        ],
        mode: 'subscription', // セッションのモードを定期購読とします。
        allow_promotion_codes: true, // プロモーションコードの使用を許可します。
        subscription_data: { // 定期購読に関するデータを設定します。
          trial_period_days: 7, // 無料トライアル期間を7日間とします。
          metadata // メタデータを渡します。
        },
        success_url: `${getURL()}/account`, // 支払い完了時のリダイレクト先URL
        cancel_url: `${getURL()}/` // キャンセル時のリダイレクト先URL
      });
  
      // セッションIDをJSON形式で返却します。
      return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
      console.log(err); // エラーをコンソールに出力します。
      return new NextResponse('Internal Error', { status: 500 }); // サーバ内部エラーを返却します。
    }
  }
  