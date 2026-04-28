import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders })
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405)

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY")
    if (!supabaseUrl || !serviceRoleKey) return json({ error: "Missing SERVICE_ROLE_KEY" }, 500)

    const authHeader = req.headers.get("Authorization")
    if (!authHeader) return json({ error: "Missing Authorization header" }, 401)

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const callerClient = createClient(supabaseUrl, serviceRoleKey, { global: { headers: { Authorization: authHeader } } })

    const { data: callerData } = await callerClient.auth.getUser()
    const callerId = callerData?.user?.id
    if (!callerId) return json({ error: "Unauthorized" }, 401)

    const { data: callerProfile } = await adminClient.from("profiles").select("role").eq("id", callerId).maybeSingle()
    if (callerProfile?.role !== "admin") return json({ error: "Only admin can approve password reset requests" }, 403)

    const body = await req.json()
    const requestId = Number(body.request_id)
    const decision = String(body.decision || "")
    const redirectTo = String(body.redirect_to || `${req.headers.get("origin")}/update-password`)

    const { data: request } = await adminClient.from("password_reset_requests").select("*").eq("id", requestId).maybeSingle()
    if (!request) return json({ error: "Request not found" }, 404)

    if (decision === "rejected") {
      await adminClient.from("password_reset_requests").update({ status: "rejected", admin_id: callerId, reviewed_at: new Date().toISOString() }).eq("id", requestId)
      return json({ ok: true, status: "rejected" })
    }

    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "recovery",
      email: String(request.email).trim().toLowerCase(),
      options: { redirectTo },
    })
    if (linkError) return json({ error: linkError.message }, 400)

    const actionLink = linkData?.properties?.action_link || ""

    await adminClient.from("password_reset_requests").update({
      status: "approved",
      admin_id: callerId,
      action_link: actionLink,
      reviewed_at: new Date().toISOString(),
    }).eq("id", requestId)

    return json({ ok: true, status: "approved", action_link: actionLink })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500)
  }
})
