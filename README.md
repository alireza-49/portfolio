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
- برنامه‌ریزی پروژه‌ها و تقویم: `/admin/plan`
- کنسول: `/admin/login` (بدون متغیرهای محیطی، در حالت توسعه با `admin` / `codology-dev` باز می‌شود)

## اسکریپت‌ها

```bash
npm run dev       # سرور توسعه
npm run build     # بیلد تولید (بدون نیاز به پایگاه داده)
npm start         # اجرای بیلد
npm run lint      # ESLint
npm test          # تست‌های واحد/رگرسیون (Vitest)
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

> تصاویر و فایل‌های مقاله را می‌توان با لینک درج کرد یا (در صورت تنظیم `ARVAN_S3_*`) مستقیماً روی
> باکت S3 آروان آپلود کرد. فایل باینری در Postgres ذخیره نمی‌شود.

## ویرایشگر مقاله

`/admin/posts/new` و `/admin/posts/[id]` یک ویرایشگر سه‌حالته دارند:

- **ویرایش (Visual)** — Tiptap با جدول قابل تغییر اندازه، ادغام سلول، رنگ سلول، جهت متن،
  خانواده/اندازه/ارتفاع خط، رنگ و هایلایت، لینک، پانویس، کالاوت، فرمول KaTeX، Mermaid، کد
  CodeMirror و بلوک‌های تعاملی.
- **Markdown** — ویرایش متن Markdown با پیش‌نمایش؛ محتوای ذخیره‌شده همیشه HTML است.
- **HTML** — ویرایش مستقیم HTML با پیش‌نمایش؛ HTML هنگام ذخیره پاک‌سازی می‌شود.

امکانات کنار ویرایشگر: تاریخچهٔ نسخه‌ها (۲۰ نسخه) و بازگردانی، لینک پیش‌نمایش رفع‌شده (۷ روز)،
خروجی Markdown، بررسی پیش از انتشار (alt تصویر، لینک خالی، پرش سطح عنوان و…)، حالت تمرکز،
جست‌وجو/جایگزینی و میان‌بر `Ctrl+S`.

### ذخیره‌سازی رسانه (اختیاری)

```bash
ARVAN_S3_ENDPOINT=https://s3.ir-thr-at1.arvanstorage.ir
ARVAN_S3_REGION=ir-thr-at1
ARVAN_S3_BUCKET=...
ARVAN_S3_ACCESS_KEY_ID=...
ARVAN_S3_SECRET_ACCESS_KEY=...
ARVAN_S3_PUBLIC_BASE_URL=https://<دامنهٔ-عمومی-باکت>
ARVAN_S3_FORCE_PATH_STYLE=true
```

- باکت باید **Public Read** باشد یا دامنهٔ آن در `MEDIA_PREVIEW_HOSTS` (`host1,host2`) باشد.
- CORS باکت باید `PUT` از دامنهٔ سایت و هدر `Content-Type` را اجازه بدهد؛ وگرنه آپلود مستقیم
  شکست می‌خورد و فقط درج با لینک کار می‌کند.
- بدون این متغیرها تب «آپلود» نمایش داده نمی‌شود؛ لینک و کتابخانهٔ لینک‌ها همیشه کار می‌کنند.
- پیش‌نمایش/دانلود فایل‌های ثبت‌شده از `/api/media/asset/[id]` عبور می‌کند (میزبان مجاز، سقف
  اندازه، `nosniff`).

### دفترچهٔ پایتون

بلوک «دفترچهٔ پایتون» با Pyodide در مرورگر اجرا می‌شود؛ هیچ کرنل سمت سروری وجود ندارد.
نسخهٔ CDN با `NEXT_PUBLIC_PYODIDE_INDEX_URL` قابل تغییر است (پیش‌فرض `v0.29.5`). اجرای طولانی
پس از ۹۰ ثانیه متوقف می‌شود؛ بسته‌ها با `micropip` نصب می‌شوند و برای بار اول ~۱۰ مگابایت دانلود
لازم است.

### تست

```bash
npm test
npx tsc --noEmit && npx eslint src && npm run build
```

## تقویم گوگل (اختیاری)

برنامه‌ریز کنسول (`/admin/plan`) و پنل «زمان‌بندی» ویرایشگر پروژه بدون گوگل هم کار می‌کنند:
کارها در پایگاه داده ذخیره می‌شوند و فقط وقتی حساب گوگل وصل باشد رویداد زمان‌دار می‌سازند.

1. در [Google Cloud Console](https://console.cloud.google.com/) یک پروژه بسازید و
   **Google Calendar API** را فعال کنید.
2. در *OAuth consent screen* نوع **External** را بگذارید، ایمیل خودتان را owner/test user کنید،
   دامنهٔ `https://www.googleapis.com/auth/calendar.events` را اضافه کنید و وضعیت را
   **In production** بگذارید. در حالت *Testing* توکن تازه‌سازی بعد از ۷ روز منقضی می‌شود.
3. یک *OAuth client* از نوع **Web application** بسازید و این نشانی‌های بازگشت را ثبت کنید:
   - `http://localhost:3000/api/google/callback`
   - `https://<دامنهٔ-شما>/api/google/callback`
4. کلیدها را در `.env.local` بگذارید و سرور را دوباره بالا بیاورید:

```bash
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=https://<دامنهٔ-شما>/api/google/callback
```

5. از `/admin/plan` دکمهٔ «اتصال به گوگل» را بزنید و اجازهٔ دسترسی بدهید.

- تقویم مقصد پیش‌فرض `primary` است؛ شناسهٔ یک تقویم دیگر (مثلاً تقویم اختصاصی «کدولوژی») را
  می‌توانید در همان کارت وارد کنید.
- زمان‌ها با منطقهٔ زمانی تهران ثبت می‌شوند و هر کار یک رویداد زمان‌دار است.
- همگام‌سازی دوطرفه است: کارها به گوگل فرستاده می‌شوند و رویدادهای تقویم شما در تقویم ماه و
  تایم‌لاین خوانده می‌شوند. اگر بازه یا عنوان رویداد یک کار را در گوگل تغییر دهید، در
  «به‌روزرسانی تقویم» بعدی روی خود کار اعمال می‌شود.
- برای دریافت خودکار تغییرات، یک زمان‌بند (Vercel Cron یا هر جای دیگر) روی
  `GET /api/google/sync` با هدر `Authorization: Bearer $CRON_SECRET` بگذارید.

