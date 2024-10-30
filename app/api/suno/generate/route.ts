import { NextResponse, NextRequest } from "next/server";
import { createSunoApi, DEFAULT_MODEL } from "@/libs/SunoApi";
import { corsHeaders } from "@/libs/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { prompt, make_instrumental, model, wait_audio } = body;
      const sunoApi = await createSunoApi();

      const audioInfo = await (
        await sunoApi
      ).generate(
        prompt,
        Boolean(make_instrumental),
        model || DEFAULT_MODEL,
        Boolean(wait_audio)
      );

      return new NextResponse(JSON.stringify(audioInfo), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error: any) {
      console.error(
        "Error generating custom audio:",
        JSON.stringify(error.response.data)
      );
      if (error.response.status === 402) {
        return new NextResponse(
          JSON.stringify({ error: error.response.data.detail }),
          {
            status: 402,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
      return new NextResponse(
        JSON.stringify({
          error:
            "Internal server error: " +
            JSON.stringify(error.response.data.detail),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  } else {
    return new NextResponse("Method Not Allowed", {
      headers: {
        Allow: "POST",
        ...corsHeaders,
      },
      status: 405,
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}
