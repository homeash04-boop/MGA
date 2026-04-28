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

    const { data: callerData, error: callerError } = await callerClient.auth.getUser()
    if (callerError || !callerData?.user) return json({ error: "Unauthorized" }, 401)

    const { data: callerProfile } = await adminClient.from("profiles").select("role").eq("id", callerData.user.id).maybeSingle()
    if (callerProfile?.role !== "admin") return json({ error: "Only admin can create users" }, 403)

    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")
    const full_name = String(body.full_name || "").trim()
    const role = String(body.role || "student").trim()
    const phone = String(body.phone || "").trim()

    if (!email || !password || !full_name) return json({ error: "الاسم والبريد وكلمة المرور مطلوبة" }, 400)
    if (password.length < 6) return json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, 400)
    if (!["admin","teacher","student","parent"].includes(role)) return json({ error: "الدور غير صحيح" }, 400)

    const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role, phone },
    })
    if (createUserError) return json({ error: createUserError.message }, 400)

    const userId = createdUser.user?.id
    if (!userId) return json({ error: "لم يتم إنشاء المستخدم" }, 500)

    const { error: profileError } = await adminClient.from("profiles").upsert({ id: userId, full_name, role, phone })
    if (profileError) return json({ error: profileError.message }, 400)

    return json({ ok: true, user_id: userId, email, role, full_name })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500)
  }
})
