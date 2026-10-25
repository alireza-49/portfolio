# استودیو کدولوژی — پورتفولیو ریسوگراف

سایت فارسی (RTL) با تم چاپ ریسوگراف: صفحهٔ اصلی، استودیوی تم `/create`، وبلاگ عمومی و کنسول
مدیریت.

## اجرا

```bash
npm install
cp .env.example .env.local     # DATABASE_URL، ADMIN_USERNAME، ADMIN_PASSWORD، ADMIN_SESSION_SECRET
npm run db:setup              # ساخت جدول‌ها + دادهٔ نمونه (فقط وقتی جدول خالی است)
npm run dev
```

- خانه: `http://localhost:3000/`
- استودیوی تم: `/create`
- وبلاگ: `/blog`
- رهگیری پروژه: `/track`
- کنسول: `/admin/login` (بدون متغیرهای محیطی، در حالت توسعه با `admin` / `codology-dev` باز می‌شود)

## اسکریپت‌ها

```bash
npm run dev       # سرور توسعه
npm run build     # بیلد تولید (بدون نیاز به پایگاه داده)
npm start         # اجرای بیلد
npm run lint      # ESLint
npm run db:setup  # اعمال schema.sql + seed نمونه روی DATABASE_URL
```

## ساختار

- `src/app` — مسیرها: `/`، `/create`، `/blog`، `/track`، `/admin`
- `src/components/create-*` — استودیوی تم و کتابخانهٔ کامپوننت‌های توکنی
- `src/components/admin` — پوستهٔ کنسول، فرم‌ها، ویرایشگر Tiptap، جدول‌ها
- `src/components/blog` و `src/components/track` — سطوح عمومی
- `src/lib` — پایگاه داده (`db.ts`, `schema.sql`)، ریپازیتوری‌ها (`content.ts`)، احراز هویت،
  پاک‌سازی HTML، تقویم جلالی و قالب‌بندی فارسی

قواعد کامل پروژه در `AGENTS.md` آمده است.

## استقرار

1. یک پایگاه دادهٔ Postgres (Neon یا Supabase) بسازید و نشانی **pooled** را بردارید.
2. `DATABASE_URL` را در `.env.local` بگذارید و یک‌بار `npm run db:setup` را اجرا کنید.
3. روی Vercel همین کلیدها را به‌همراه `ADMIN_USERNAME`، `ADMIN_PASSWORD` و
   `ADMIN_SESSION_SECRET` تعریف کنید.
4. پس از دیپلوی، از `/admin/login` وارد شوید.

> تصاویر مقاله‌ها فقط با نشانی (URL) درج می‌شوند؛ فایل روی سرور آپلود نمی‌شود.

