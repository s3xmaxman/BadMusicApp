import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { Database } from "@/types_db";
import { Price, Product } from "@/types";

import { stripe } from "./stripe";
import { toDateTime } from "./helpers";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Stripeからのプロダクトデータを更新または挿入する非同期関数を作ります
const upsertProductRecord = async (product: Stripe.Product) => {
  // 入力するデータを定義します
  const productData: Product = {
    id: product.id, //商品ID
    active: product.active, //商品が有効か無効か
    name: product.name, // 商品名
    description: product.description ?? undefined, // 商品の説明文。もし存在しない場合はundefinedを使用します
    image: product.images?.[0] ?? null, // 商品の画像。存在しない場合はnullを使用します
    metadata: product.metadata, // 商品のメタデータ
  };

  // 'products'テーブルにproductDataを投入または更新します
  const { error } = await supabaseAdmin.from("products").upsert([productData]);

  // もしエラーがあった場合にはそれを投げます
  if (error) {
    throw error;
  }

  // プロダクトが挿入または更新されたことをコンソールに表示します
  console.log(`Product inserted/updated: ${product.id}`);
};

// Stripeからの価格データを更新または挿入する非同期関数を作ります
const upsertPriceRecord = async (price: Stripe.Price) => {
  // 入力するデータを定義します
  const priceData: Price = {
    id: price.id, //価格ID
    // 価格の商品ID。商品の型がstringでなければ空文字列を返します。
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active, //価格が有効か無効か
    currency: price.currency, //通貨
    // 価格の説明。存在しない場合はundefinedを使用します
    description: price.nickname ?? undefined,
    type: price.type, // 価格の型
    // 単位あたりの価格。存在しない場合はundefinedを使用します
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval, //定期課金の間隔
    interval_count: price.recurring?.interval_count, // 間隔の回数
    trial_period_days: price.recurring?.trial_period_days, //試用期間（日数）
    metadata: price.metadata, // 価格のメタデータ
  };

  // 'prices'テーブルにpriceDataを投入または更新します
  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);

  // もしエラーがあった場合, それを投げます
  if (error) throw error;

  // 価格が挿入または更新されたことをコンソールに表示します
  console.log(`Price inserted/updated: ${price.id}`);
};

// 非同期関数で顧客を作成または検索します。
const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  // Supabaseの管理者用クライアントを使って'customers'テーブルから
  // 'stripe_customer_id'を検索します。IDはユーザーのUUIDと一致する必要があります。
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  // もしエラーが発生したかStripeの顧客IDが存在しなければ、
  // Stripeに新規顧客を作成します。
  if (error || !data?.stripe_customer_id) {
    // 新規顧客データの構造を定義します。
    // metadataにSupabaseのUUIDを保存します。
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };

    // もしメールアドレスが提供されていれば、顧客データに追加します。
    if (email) customerData.email = email;

    // Stripe APIをコールし、顧客を作成します。
    const customer = await stripe.customers.create(customerData);

    // 新規に作成した顧客のIDをSupabaseの'customers'テーブルに挿入します。
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);

    // もしSupabaseでエラーが発生した場合、エラーを投げます。
    if (supabaseError) throw supabaseError;

    // 新規顧客が作成され挿入されたことをコンソールにログ出力します。
    console.log(`New customer created and inserted for ${uuid}.`);

    // 新しく作成した顧客のIDを戻り値として返します。
    return customer.id;
  }

  // もし既に顧客が存在していたら、そのStripeの顧客IDを返します。
  return data.stripe_customer_id;
};

// 指定されたユーザーID(uuid)とStripeの支払い方法オブジェクトを受け取り、
// 請求情報を顧客情報にコピーする非同期関数です。
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  // Stripe.PaymentMethodから顧客IDを抽出して、文字列型として扱います。
  const customer = payment_method.customer as string;

  // Stripe.PaymentMethodから名前、電話番号、住所を請求先の詳細として抽出します。
  const { name, phone, address } = payment_method.billing_details;

  // 名前、電話番号、住所の何れかが欠けている場合は、
  // 処理を中断して早期リターンします。
  if (!name || !phone || !address) return;

  // Stripe APIを使用して顧客情報を更新します。
  // ここでは更新するフィールドに名前、電話番号、住所を指定しています。
  // @ts-ignore
  await stripe.customers.update(customer, { name, phone, address });

  // Supabaseを使用してデータベース内のusersテーブルを更新します。
  // 'users'テーブルから指定されたUUIDのレコードを検索し、
  // 請求先住所と支払い方法を更新します。
  const { error } = await supabaseAdmin
    .from("users") // 'users'テーブルを指定
    .update({
      // 請求先住所フィールドには、取得した住所情報を展開して設定
      billing_address: { ...address },
      // 支払い方法フィールドには、取得した支払い方法の詳細をタイプによって展開して設定
      payment_method: { ...payment_method[payment_method.type] },
    })
    // 更新するユーザーのレコードをUUIDで絞り込みます。
    .eq("id", uuid);

  // エラーが捕捉された場合はそのエラーをthrowして例外を発生させ、
  // 関数の呼び出し元でキャッチできるようにします。
  if (error) throw error;
};

// 与えられたStripeのsubscriptionIdとcustomerIdに基づいて、
// 購読状態の変更を管理する非同期関数です。
// createActionがtrueの場合は、請求先詳細のコピー処理も実行します。
const manageSubscriptionStatusChange = async (
  subscriptionId: string, // StripeのサブスクリプションID
  customerId: string, // Stripeの顧客ID
  createAction = false // 請求先詳細をコピーするかどうかのフラグ
) => {
  // Supabaseから顧客の情報を取得します。
  // stripe_customer_idがcustomerIdに一致するレコードを検索します。
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id") // idフィールドのみ選択
    .eq("stripe_customer_id", customerId) // customerIdと一致するレコードを検索
    .single(); // 単一の結果を期待

  // 顧客の情報が取得できなかった場合、エラーをスローします。
  if (noCustomerError) throw noCustomerError;

  // 取得した顧客情報からUUIDを抽出
  const { id: uuid } = customerData!;

  // Stripe APIを使用してサブスクリプション情報を取得
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"], // 支払い方法も同時に取得
  });

  // 取得したサブスクリプションの情報をもとに、データベースのrecordsを更新または挿入(upsert)します。
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id, //サブスクリプションID
      user_id: uuid, // 顧客のUUID
      metadata: subscription.metadata, //メタデータ
      // @ts-ignore
      status: subscription.status, // サブスクリプションの状態
      price_id: subscription.items.data[0].price.id, //価格ID
      // @ts-ignore
      quantity: subscription.quantity, // 数量
      cancel_at_period_end: subscription.cancel_at_period_end, // サブスクリプション終了時にキャンセルするかどうか
      // next two lines convert Stripe timestamps to ISO Date string
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      // Period start and end times, converted to ISO Date string
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(), //作成された時間
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString() //試用期間の開始
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString() //試用期間の終了
        : null,
    };

  // Supabaseの'subscriptions'テーブルに対してupsert処理を行い、レコードを更新または挿入します。
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);

  // エラーが発生した場合はスローします。
  if (error) throw error;

  // コンソールに更新または挿入したことをログ出力します。
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // createActionがtrue、かつ、default_payment_methodとuuidが存在する場合に
  // 請求先の詳細をコピーする
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
