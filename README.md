# School Portal Full V10 Ready

بوابة مدرسية كاملة React + Vite + Supabase + Tailwind.

## المزايا
- تسجيل دخول أدوار: إدارة، معلم، طالب، ولي أمر.
- إنشاء مستخدمين من لوحة الإدارة عبر Supabase Edge Function.
- منع تغيير كلمة المرور إلا بموافقة الأدمن.
- الصفوف، المواد، الفصول الدراسية، ربط المواد بالصفوف.
- الطلاب، ربط ولي الأمر، الدرجات، الحضور، الواجبات.
- إظهار/إخفاء العلامات كليًا أو جزئيًا حسب الصف/المادة/الطالب.
- محاسبة: رسوم، دفعات، سند قبض، ذمم، CSV.
- واجبات أونلاين.
- امتحانات أونلاين: MCQ، صح/خطأ، إجابة قصيرة، تصحيح تلقائي ومراجعة.

## التشغيل
1. انسخ `.env.example` إلى `.env`.
2. ضع:
```
VITE_SUPABASE_URL=https://dlsxlvzubiwcsojnwzcj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_or_anon_key
```
3. في Supabase SQL Editor شغل:
```
supabase/FULL_SCHEMA.sql
```
4. أنشئ حساب Admin من Supabase Authentication ثم شغل:
```
supabase/CREATE_ADMIN_PROFILE.sql
```
وعدّل الإيميل داخل الملف إذا لزم.
5. شغل:
```
RUN_LOCAL.bat
```

## Edge Functions
لإنشاء المستخدمين وموافقة تغيير كلمة المرور:
```
npm install supabase --save-dev
DEPLOY_FUNCTIONS.bat
npx supabase secrets set SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## روابط مهمة
- /login
- /admin
- /teacher
- /student
- /parent
