import { createOrRetrieveACustomer } from "@/libs/supabaseAdmin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import x from "uniqid";
import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helper";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Cound not get user");
    const customer = await createOrRetrieveACustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    if (!customer) throw new Error("Cound not get customer");

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
