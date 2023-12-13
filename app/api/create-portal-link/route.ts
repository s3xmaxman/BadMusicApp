import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { getURL } from '@/libs/helpers';
import { createOrRetrieveCustomer } from '@/libs/supabaseAdmin';


export async function POST() {
    try {
        // Supabaseクライアントを作成し、認証済みユーザーを取得します。
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();
        
        // ユーザーが存在しない場合、エラーを投げます。
        if (!user) throw Error('Could not get user');

        // 顧客情報を取得または作成します。
        const customer = await createOrRetrieveCustomer({
            uuid: user.id || '',  // ユーザーIDを指定
            email: user.email || ''  // ユーザーのメールアドレスを指定
        });

        // 顧客情報が取得できない場合、エラーを投げます。
        if (!customer) throw Error('Could not get customer');

        // Stripeの請求ポータルセッションを作成し、URLを取得します。
        const { url } = await stripe.billingPortal.sessions.create({
            customer, // 顧客IDを指定
            return_url: `${getURL()}/account`  // ポータルからの戻りURLを指定
        });

        // ポータルセッションのURLをJSON形式で返却します。
        return NextResponse.json({ url });

    } catch (error: any) {
        console.log(error);  // エラーをロギングします。
        // 内部エラーとして、500ステータスコードと共にレスポンスを返します。
        return new NextResponse('Internal Error', { status: 500 });
    }
}
