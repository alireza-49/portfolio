/**
 * Workshop posts that ship with the codebase instead of the console.
 *
 * `npm run seed:course` publishes them (idempotent, keyed by slug). Bodies are
 * stored as sanitized HTML, so the reader, the TOC and the interactive islands
 * all behave exactly like a post written in the console. Every file they link is
 * copied to `public/course/session-1/`.
 */
export type CoursePost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Banner in `public/images/blog`, rendered by the card and the hero. */
  coverUrl: string;
  author: string;
  tags: string[];
  publishedAt: string;
  contentHtml: string;
};

export const COURSE_POSTS: CoursePost[] = [
  {
    slug: "python-workshop-session-2",
    title: "کارگاه پایتون، جلسهٔ ۲: تابع، محیط مجازی و اولین کتابخانه",
    excerpt: "یادداشت جلسهٔ دوم کارگاه پایتون: مرور فشردهٔ جلسهٔ اول، دو نکتهٔ جاافتاده (!= و print)، و بعد توابع از def تا return و دامنه؛ همراه با ویدیوی جلسه.",
    author: "استودیو کدولوژی",
    tags: ["پایتون", "کارگاه", "آموزش برنامه‌نویسی"],
    coverUrl: "/images/blog/cover-python-session-2.svg",
    publishedAt: "2026-11-13T11:00:00+03:30",
    contentHtml: `<p>جلسهٔ دوم کارگاه پایتون یک مسیر مشخص داشت: تابع، بعد محیط مجازی، بعد <code>import</code> و آخر pandas. این صفحه یادداشت همان جلسه است و به همان ترتیبی نوشته شده که سر کلاس پیش رفتیم.</p>
<div data-embed="aparat" data-src="https://www.aparat.com/embed/cdre276"></div>
<p><a href="https://www.aparat.com/v/cdre276" title="تماشای ویدیوی جلسه در آپارات" target="_blank" rel="noopener noreferrer">تماشای ویدیو در آپارات</a> — اگر پخش‌کنندهٔ بالا باز نشد.</p>
<h2>قواعد کلاس</h2>
<ol>
<li><strong>هر کس جا ماند، دست بالا.</strong> امروز تندتر می‌رویم؛ سکوتِ شما برای من گران‌تر از سؤال‌تان است.</li>
<li><strong>تایپ کنید، کپی نکنید.</strong> مخصوصاً امروز که کدها کوتاه‌اند.</li>
<li><strong>خطا را از خط آخر بخوانید.</strong> جواب داخل خودش است.</li>
</ol>
<pre data-language="text"><code>تابع  →  محیط مجازی  →  import  →  pandas</code></pre>
<blockquote><p>«این ترتیب اتفاقی نیست. تا تابع را نفهمید، نمی‌فهمی کتابخانه چه چیزی به تو می‌دهد. تا محیط مجازی نداشته باشی، نصب کتابخانه یا کار نمی‌کند یا جایی نصب می‌شود که پیدایش نمی‌کنی. و تا <code>import</code> را نفهمی، <code>pandas</code> فقط یک کلمهٔ قشنگ است.»</p></blockquote>
<h3>سه چیزی که آخر امروز باید بتوانید</h3>
<ol>
<li>یک تابع بنویسید که <strong>مقدار برگرداند</strong> (نه فقط چاپ کند).</li>
<li>برای پروژهٔ خودتان یک <strong>محیط مجازی</strong> بسازید و <code>pandas</code> را داخلش نصب کنید.</li>
<li>یک جدول کوچک را در <code>pandas</code> بسازید و <strong>میانگین یک ستون</strong> را بگیرید.</li>
</ol>
<hr>
<h2>بخش ۱ — مرور جلسهٔ ۱</h2>
<blockquote><p>«هر چه جلسهٔ قبل نوشتیم، امروز در ده خط از نو می‌نویسیم. اگر یادتان رفته، بهترین خبر است: قرار است همین‌جا یاد بیاید.»</p></blockquote>
<h3>۱.۱ متغیر، لیست، دیکشنری، شرط، حلقه — در یک نفس</h3>
<pre data-language="python"><code># ---------- متغیر و نوع ----------
city = "Tehran"
pm25 = 48.3
n_days = 30
is_valid = True

print(city, pm25, n_days, is_valid)
print(type(pm25))

# ---------- لیست: یک ستون از جدول ----------
cities = ["Tehran", "Isfahan", "Tabriz"]
daily = [64, 88, 45, 102, 51, 77, 39]

print(cities[0], cities[-1], len(cities))
print(sum(daily) / len(daily))

# ---------- دیکشنری: یک ردیف از جدول ----------
station = {"city": "Tehran", "pm25": 48.3}
print(station["city"])
print(station.get("so2", "not measured"))

# ---------- شرط ----------
if pm25 &gt; 75:
    print("above the limit")
elif pm25 &gt; 35:
    print("between 35 and 75")
else:
    print("low")

# ---------- حلقه ----------
for v in daily:
    if v &gt; 75:
        print("high day:", v)</code></pre>
<blockquote><p>«<code>cities[0]</code> اولین عضو است، چون شمارش از صفر شروع می‌شود. <code>cities[-1]</code> آخرین عضو است. <code>len</code> تعداد را می‌دهد. <code>sum(daily) / len(daily)</code> میانگین است، بدون هیچ کتابخانه‌ای.»</p><p>«دیکشنری با <strong>اسم</strong> به داده می‌رسد، لیست با <strong>ترتیب</strong>. همین دو، دو نمای یک جدول‌اند: لیست = ستون، دیکشنری = ردیف. امروز می‌بینید که pandas همین دو را در یک شیء جمع می‌کند.»</p></blockquote>
<h3>۱.۲ هرم</h3>
<p>روی تخته، چهار خط بنویسید و بپرسید هر خط چه می‌کند:</p>
<pre data-language="python"><code>n = 5

for i in range(1, n + 1):
    spaces = n - i
    stars = 2 * i - 1
    print(" " * spaces + "*" * stars)</code></pre>
<blockquote><p>«چرا <code>2*i - 1</code>؟ چون ستاره‌ها ۱، ۳، ۵، ۷، ۹ هستند. هر عدد فرد، دو برابر جایش منهای یک. و چرا <code>range(1, n + 1)</code>؟ چون <code>n</code> خودش داخل بازه نیست. این «یکی کم» را جلسهٔ قبل دیدید.»</p></blockquote>
<p>اگر کسی سطح ۵ را انجام داده بود، همین را داخل تابع نشان دهید — و این کلیف‌هنگر بخش بعد:</p>
<pre data-language="python"><code>def pyramid(n, char="*"):
    for i in range(1, n + 1):
        print(" " * (n - i) + char * (2 * i - 1))

pyramid(3)
pyramid(5, "#")
pyramid(0)</code></pre>
<blockquote><p>«همین سه خط، وقتی داخل تابع می‌رود، می‌شود یک <strong>ابزار</strong>: یک بار می‌نویسید، هر جا و با هر اندازه صدا می‌زنید. کار امروز دقیقاً همین است: از «کدی که کار می‌کند» به «کدی که می‌شود دوباره استفاده کرد».»</p></blockquote>
<h3>چک‌پوینت — پیش‌بینی، بدون اجرا</h3>
<table><thead><tr><th>عبارت</th><th>خروجی</th><th>چرا</th></tr></thead><tbody><tr><td><code>daily[0]</code></td><td><code>64</code></td><td>شمارش از صفر</td></tr><tr><td><code>len(daily)</code></td><td><code>7</code></td><td>هفت عضو</td></tr><tr><td><code>sorted(daily)[0]</code></td><td><code>39</code></td><td>کوچک‌ترین</td></tr><tr><td><code>daily[7]</code></td><td><code>IndexError</code></td><td>ایندکس ۷ وجود ندارد (۰ تا ۶)</td></tr><tr><td><code>station["so2"]</code></td><td><code>KeyError</code></td><td>کلید تعریف نشده</td></tr><tr><td><code>pm25 &gt; 35</code></td><td><code>True</code></td><td>مقایسه، بولی می‌دهد</td></tr></tbody></table>
<hr>
<h2>بخش ۲ — دو چیزی که جلسهٔ قبل جا افتاد</h2>
<h3>۲.۱ <code>!=</code> — «برابر نیست»</h3>
<p>اول یک یادآوری:</p>
<pre data-language="python"><code>pm25 = 48.3

print(pm25 == 48.3)     # True  — «برابر است؟»
print(pm25 != 48.3)     # False — «برابر نیست؟»</code></pre>
<blockquote><p>«<code>=</code> یعنی «بگذار». <code>==</code> یعنی «برابر است؟». و <code>!=</code> یعنی «برابر نیست؟». علامت تعجب، همان «نه» است: هر جا <code>!</code> دیدید، یک «نه» در جمله هست.»</p></blockquote>
<p>بعد در شرط استفاده کنید:</p>
<pre data-language="python"><code>city = "Tehran"

if city != "Isfahan":
    print("this is not Isfahan")

if city == "Tehran":
    print("this is Tehran")</code></pre>
<blockquote><p>«در فارسی می‌گوییم «اگر شهر اصفهان نبود». در پایتون می‌شود <code>!=</code>.»</p></blockquote>
<p>حالا <code>not</code> را اضافه کنید — دو راه برای گفتن یک چیز:</p>
<pre data-language="python"><code>print(pm25 != 48.3)        # False
print(not (pm25 == 48.3))  # False — همان بالا، با «نه»ی بیرونی
print(not (pm25 &gt; 75))     # True  — معادل pm25 &lt;= 75</code></pre>
<blockquote><p>«<code>not</code> کل نتیجهٔ یک شرط را برمی‌گرداند. <code>pm25 != 48.3</code> و <code>not (pm25 == 48.3)</code> یکی‌اند. کدام را بنویسید؟ آن که خواناتر است. کد برای انسان نوشته می‌شود، اتفاقاً برای کامپیوتر هم اجرا می‌شود.»</p></blockquote>
<p>و دو عملگر عضویت که خیلی به کار می‌آیند:</p>
<pre data-language="python"><code>print("Tehran" in ["Tehran", "Isfahan"])    # True
print("so2" not in {"pm25": 48.3})          # True</code></pre>
<blockquote><p>«<code>in</code> می‌پرسد «آیا داخل این مجموعه هست؟». <code>not in</code> می‌پرسد «آیا نیست؟». جلسهٔ قبل <code>in</code> را دیدید ولی رویش نایستادیم. با <code>!=</code> یک خانواده‌اند: همه‌شان یک سؤال بله/خیر می‌پرسند و جوابشان <code>True</code> یا <code>False</code> است.»</p></blockquote>
<p>یک نکتهٔ اضافه که همین‌جا جا دارد — زنجیرهٔ مقایسه:</p>
<pre data-language="python"><code>print(15 &lt;= pm25 &lt; 35)     # False</code></pre>
<blockquote><p>«در پایتون می‌شود دو مقایسه را پشت هم نوشت و معنی‌اش همان «بین ۱۵ و ۳۵» است. در بیشتر زبان‌ها این خطا است؛ در پایتون کار می‌کند. جلسهٔ قبل در تمرین‌ها بود، امروز بالاخره معنی‌اش را می‌دانید.»</p></blockquote>
<h3>۲.۲ <code>print</code> و خط جدید</h3>
<blockquote><p>«دیروز در هرم، از <code>end=""</code> استفاده کردیم و من فقط گفتم «یعنی خط جدید نزن». حالا می‌خواهم بدانید چرا. <code>print</code> دو تنظیم پنهان دارد که تا حالا ندیده‌اید.»</p></blockquote>
<pre data-language="python"><code>print("a", "b")
print("a", "b", sep="-")
print("a", "b", sep="")</code></pre>
<blockquote><p>«بین چیزهایی که به <code>print</code> می‌دهید، پیش‌فرض یک فاصله گذاشته می‌شود. <code>sep</code> همان فاصله است؛ عوضش کنید، جداکننده عوض می‌شود.»</p></blockquote>
<p>بعد سراغ خط جدید بروید:</p>
<pre data-language="python"><code>print("first line")
print("second line")
print("third line", end="")
print(" — ادامه‌ی همان خط")</code></pre>
<blockquote><p>«<code>print</code> بعد از چاپ، پیش‌فرض یک <code>\\n</code> می‌گذارد؛ <code>\\n</code> یعنی «برو خط بعد». <code>end</code> همان چیزی است که <strong>بعد از</strong> چاپ می‌آید. <code>end=""</code> یعنی «هیچ چیز نگذار»، پس چاپ بعدی روی همان خط می‌نشیند. این همان ترفندی است که در سطح ۲ هرم، پنج ستاره را در یک خط چسباند.»</p></blockquote>
<p>حالا <code>\\n</code> را مستقیم نشان دهید:</p>
<pre data-language="python"><code>print("line1\\nline2")          # دو خط
print("name\\tvalue")           # tab بین دو کلمه
print()                        # یک خط خالی</code></pre>
<blockquote><p>«<code>\\n</code> و <code>\\t</code> داخل متن معنی خاص دارند: <code>\\n</code> خط جدید، <code>\\t</code> فاصلهٔ tab. اگر بخواهید خودِ <code>\\n</code> را چاپ کنید (که معمولاً نمی‌خواهید)، باید دوبار بنویسید. این را فعلاً لازم ندارید.»</p></blockquote>
<p>و ترکیب هر دو تنظیم:</p>
<pre data-language="python"><code>for i in range(5):
    print(i, end=" ")
print()          # آخرش یک خط جدید، وگرنه خروجی بعدی می‌چسبد</code></pre>
<blockquote><p>«این الگو را زیاد می‌بینید: چیزی را با <code>end=" "</code> پشت هم چاپ می‌کنند، بعد یک <code>print()</code> خالی می‌زنند تا خط تمام شود. <code>print()</code> خالی یعنی «یک خط جدید».»</p></blockquote>
<h3>چک‌پوینت — پیش‌بینی</h3>
<table><thead><tr><th>دستور</th><th>خروجی</th></tr></thead><tbody><tr><td><code>print("a", "b")</code></td><td><code>a b</code></td></tr><tr><td><code>print("a", "b", sep="-")</code></td><td><code>a-b</code></td></tr><tr><td><code>print("x", end="")</code> بعد <code>print("y")</code></td><td><code>xy</code> در یک خط</td></tr><tr><td><code>print("a\\nb")</code></td><td>دو خط: <code>a</code> و <code>b</code></td></tr><tr><td><code>print(5 != 5)</code></td><td><code>False</code></td></tr><tr><td><code>print(not (5 &gt; 3))</code></td><td><code>False</code></td></tr></tbody></table>
<hr>
<h2>بخش ۳ — توابع</h2>
<h3>۳.۱ دردی که تابع درمانش می‌کند</h3>
<pre data-language="python"><code>pm25_a = 48.3
pm25_b = 83.7

if pm25_a &lt; 15:
    cat_a = "Good"
elif pm25_a &lt; 35:
    cat_a = "Moderate"
elif pm25_a &lt; 75:
    cat_a = "Unhealthy for sensitive groups"
else:
    cat_a = "Unhealthy"

if pm25_b &lt; 15:
    cat_b = "Good"
elif pm25_b &lt; 35:
    cat_b = "Moderate"
elif pm25_b &lt; 75:
    cat_b = "Unhealthy for sensitive groups"
else:
    cat_b = "Unhealthy"

print(cat_a, "|", cat_b)</code></pre>
<blockquote><p>«دو شهر، دوازده خط. اگر بیست ایستگاه داشتیم؟ دویست و چهل خط. و اگر فردا آستانه‌ها عوض می‌شد، باید بیست جا را دستی عوض می‌کردیم — و حتماً یکی را جا می‌گذاشتیم.»</p><p>«همین‌جاست که تابع معنی پیدا می‌کند: <strong>یک بار بنویس، هر جا استفاده کن</strong>. یک جا آستانه‌ها را نگه می‌داری، بیست جا فقط صدایش می‌زنی.»</p></blockquote>
<h3>۳.۲ کالبد تابع</h3>
<pre data-language="python"><code>def aqi_category(pm25):
    if pm25 &lt; 15:
        return "Good"
    elif pm25 &lt; 35:
        return "Moderate"
    elif pm25 &lt; 75:
        return "Unhealthy for sensitive groups"
    return "Unhealthy"

print(aqi_category(12))
print(aqi_category(48))
print(aqi_category(90))</code></pre>
<table><thead><tr><th>جزء</th><th>در کد</th><th>معنی</th></tr></thead><tbody><tr><td><code>def</code></td><td><code>def</code></td><td>«دارم یک تابع تعریف می‌کنم»</td></tr><tr><td>اسم</td><td><code>aqi_category</code></td><td>خودتان انتخاب می‌کنید؛ فعل یا اسمِ کار</td></tr><tr><td>پرانتز</td><td><code>(pm25)</code></td><td>ورودی‌ها این‌جا</td></tr><tr><td>پارامتر</td><td><code>pm25</code></td><td>اسم ورودی، <strong>داخل</strong> تعریف</td></tr><tr><td>دونقطه</td><td><code>:</code></td><td>«بدنه از این‌جا شروع می‌شود»</td></tr><tr><td>تو رفتگی</td><td>۴ فاصله</td><td>بدنهٔ تابع</td></tr><tr><td><code>return</code></td><td><code>return "Good"</code></td><td>«این را تحویل بده و تمام»</td></tr></tbody></table>
<blockquote><p>«دو لحظه دارد و این را خوب بفهمید: لحظهٔ <strong>ساختن</strong> (<code>def</code>) و لحظهٔ <strong>استفاده</strong> (صدا زدن). تا صدا نزنید، هیچ اتفاقی نمی‌افتد. تابع مثل دستور پختن است که در کشو گذاشته‌اید؛ تا بازش نکنید، غذایی پخته نمی‌شود.»</p><p>«و توجه: اسم تابع را با پرانتز صدا می‌زنیم: <code>aqi_category(48)</code>. اگر پرانتز را جا بگذارید و بنویسید <code>print(aqi_category)</code>، پایتون خودِ تابع را چاپ می‌کند، نه نتیجه‌اش — یک چیزی شبیه <code>&lt;function aqi_category at 0x...&gt;</code>. این را امروز از چند نفر می‌بینم.»</p></blockquote>
<h3>۳.۳ پارامتر و آرگومان — همان چیز، دو اسم</h3>
<pre data-language="python"><code>def greet(city):
    print("Studying air quality in", city)

greet("Tehran")
greet("Ahvaz")</code></pre>
<h3>۳.۴ <code>return</code> در برابر <code>print</code> — مهم‌ترین پنج دقیقهٔ امروز</h3>
<p>این را آهسته بگویید و روی تخته بنویسید:</p>
<pre data-language="python"><code>def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

a = double_print(5)     # چاپ می‌کند
b = double_return(5)    # چاپ نمی‌کند، برمی‌گرداند

print("a =", a)         # None
print("b =", b)         # 10</code></pre>
<blockquote><p>«<code>double_print</code> جواب را بلند می‌گوید و می‌رود. <code>double_return</code> جواب را <strong>تحویل می‌دهد</strong>. <code>None</code> در پایتون یعنی «هیچ چیز». اگر تابعی <code>return</code> نداشته باشد، پایتون در آخر خودش <code>None</code> برمی‌گرداند. پس هر جا <code>None</code> دیدید، تقریباً همیشه یعنی <code>return</code> جا افتاده.»</p></blockquote>
<pre data-language="python"><code>def mean_print(values):
    print(sum(values) / len(values))

def mean_return(values):
    return sum(values) / len(values)

daily = [64, 88, 45, 102, 51, 77, 39]

m1 = mean_print(daily)      # 66.57... چاپ می‌شود
print(m1 * 2)               # TypeError: NoneType

m2 = mean_return(daily)
print(m2 * 2)               # 133.14...</code></pre>
<blockquote><p>«تابعی که فقط <code>print</code> دارد، برای محاسبه بی‌فایده است. نمی‌شود نتیجه‌اش را جمع کرد، مقایسه کرد، یا به تابع دیگری داد. <code>print</code> برای <strong>انسان</strong> است؛ <code>return</code> برای <strong>برنامه</strong>.»</p><p>«قاعدهٔ سرانگشتی: اگر می‌خواهید فقط ببینید چه خبر است، <code>print</code>. اگر می‌خواهید با نتیجه کار کنید، <code>return</code>. و اگر شک داشتید، <code>return</code> — چون همیشه می‌شود بعداً <code>print</code>ش کرد.»</p></blockquote>
<h3>۳.۵ مقدار پیش‌فرض و آرگومان نام‌دار</h3>
<pre data-language="python"><code>def report(city, pm25, unit="ug/m3"):
    return f"{city}: {pm25:.1f} {unit}"

print(report("Tehran", 48.3))
print(report("Tehran", 48.3, "mg/m3"))
print(report(pm25=48.3, city="Tehran"))</code></pre>
<blockquote><p>«<code>unit</code> پیش‌فرض دارد. اگر ندهید، <code>ug/m3</code> می‌شود؛ اگر بدهید، همان را می‌گیرد. خط سوم، <strong>آرگومان نام‌دار</strong> است: اسم پارامتر را می‌نویسید و ترتیب دیگر مهم نیست. این شکل را در کتابخانه‌ها زیاد می‌بینید، چون بعضی توابع ده پارامتر دارند و کسی ترتیبشان را حفظ نمی‌کند.»</p><p>«یک هشدار: پارامترهای پیش‌فرض باید <strong>آخر</strong> باشند. <code>def f(a=1, b)</code> خطا می‌دهد، چون پایتون نمی‌داند <code>b</code> را از کجا بخواند.»</p></blockquote>
<h3>۳.۶ چند مقدار برگرداندن، و مستندکردن</h3>
<pre data-language="python"><code>def min_max(values):
    """کمینه و بیشینه را با هم برمی‌گرداند."""
    return min(values), max(values)

low, high = min_max(daily)
print(low, high)</code></pre>
<blockquote><p>«<code>return</code> می‌تواند چند مقدار برگرداند؛ در واقع یک تاپل برمی‌گرداند و شما هم‌زمان بازش می‌کنید. <code>min_max</code> در یک رفت‌وبرگشت، دو جواب می‌دهد — به‌جای اینکه دو تابع جدا بنویسیم.»</p></blockquote>
<h3>۳.۷ دامنه (scope) — در سه خط</h3>
<pre data-language="python"><code>x = 100

def change_local():
    x = 5
    return x

print("inside:", change_local())   # 5
print("outside:", x)               # 100</code></pre>
<blockquote><p>«متغیری که داخل تابع تعریف شود، بیرون دیده نمی‌شود. داخل تابع، آدم تازه‌ای است که فقط کار خودش را می‌داند. تابع می‌تواند از بیرون <strong>بخواند</strong>، ولی اگر خودش با <code>=</code> چیزی بسازد، آن چیز مال خودش است.»</p><p>«یک <code>global</code> هم وجود دارد که با آن می‌شود بیرون را عوض کرد؛ امروز یاد نمی‌گیریم، چون تقریباً همیشه نشانهٔ طراحی بد است. اگر جایی دیدید، بدانید چه خبر است.»</p></blockquote>
<h3>۳.۸ تابع که تابع صدا می‌زند — کد واقعی</h3>
<pre data-language="python"><code>def mean(values):
    if len(values) == 0:
        return None
    return sum(values) / len(values)

def is_above_limit(value, limit=75):
    return value &gt; limit

def describe(values, limit=75):
    m = mean(values)
    high = 0
    for v in values:
        if is_above_limit(v, limit):
            high += 1
    return f"mean={m:.1f}, days above {limit}: {high}"

print(describe(daily))
print(describe(daily, 50))</code></pre>
<blockquote><p>«<code>high += 1</code> یعنی <code>high = high + 1</code>. شکل کوتاه‌شده است؛ امروز اول می‌بینید. بقیه‌اش همان الگوی جمع‌کننده‌ی جلسهٔ قبل است.»</p><p>«و نکتهٔ <code>len(values) == 0</code>: اگر لیست خالی بیاید، <code>sum/len</code> تقسیم بر صفر می‌شود و برنامه می‌خوابد. یک خط محافظ گذاشتیم. این همان «حالت مرزی» است که در هرم با <code>n = 0</code> دیدید — و همان چیزی است که در نقد کدِ دیگران، و بعداً کدِ ایجنت، می‌پرسیم.»</p></blockquote>
<h3>۳.۹ خطاهای رایج توابع</h3>
<table><thead><tr><th>نشانه</th><th>علت</th><th>درستش</th></tr></thead><tbody><tr><td><code>NameError: name 'greet' is not defined</code></td><td>تابع را <strong>بعد</strong> از صدا زدن تعریف کرده‌اید، یا اسم غلط است</td><td><code>def</code> باید بالاتر از صدا زدن باشد</td></tr><tr><td><code>SyntaxError</code> روی خط <code>def</code></td><td>دونقطه جا افتاده</td><td><code>def greet(city):</code></td></tr><tr><td><code>IndentationError</code></td><td>بدنه تو نرفته</td><td>خط‌های زیر <code>def</code> را چهار فاصله جلو ببرید</td></tr><tr><td><code>TypeError: greet() missing 1 required positional argument</code></td><td>بدون ورودی صدا زده‌اید</td><td><code>greet("Tehran")</code></td></tr><tr><td>خروجی <code>None</code></td><td><code>return</code> ندارد یا مسیر <code>return</code> را رد کرده</td><td>همه‌ی شاخه‌ها <code>return</code> داشته باشند</td></tr><tr><td>چیزی چاپ نمی‌شود</td><td><code>return</code> دارد ولی شما فقط <code>print</code> انتظار داشتید</td><td><code>print(tabee(...))</code></td></tr><tr><td><code>&lt;function f at 0x...&gt;</code> چاپ می‌شود</td><td>پرانتز صدا زدن جا افتاده</td><td><code>f(3)</code> نه <code>f</code></td></tr></tbody></table>
<h3>۳.۱۰ تمرین کلاسی — سه دقیقه</h3>
<blockquote><p>«تابعی بنویسید به اسم <code>is_good(pm25)</code> که اگر مقدار زیر ۱۵ بود <code>True</code> و وگرنه <code>False</code> برگرداند. بعد در یک حلقه، تعداد روزهای «خوب» را در <code>daily</code> بشمارید. سه دقیقه؛ بعد یکی نشان می‌دهد.»</p></blockquote>
<p>جواب مرجع:</p>
<pre data-language="python"><code>def is_good(pm25):
    return pm25 &lt; 15

count = 0
for v in daily:
    if is_good(v):
        count += 1
print("good days:", count)</code></pre>
<p>دو خطای رایج را همان‌جا بگیرید: <code>return pm25 &lt; 15</code> را به <code>if</code> تبدیل نکنید (لازم نیست، خودِ مقایسه بولی است)، و <code>if is_good(v) == True:</code> ننویسید (اضافی است؛ <code>if is_good(v):</code> کافی است).</p>
<h3>چک‌پوینت</h3>
<p>بپرسید: «<code>aqi_category(90)</code> چه می‌دهد؟» باید <code>Unhealthy</code> باشد.</p>
<p>اگر کسی <code>Unhealthy for sensitive groups</code> گرفت، ترتیب <code>elif</code>هایش غلط است — همان درس جلسهٔ قبل. همین‌جا یک بار دیگر نشان دهید: شرط <code>pm25 &lt; 75</code> را بالای همه بگذارید و ببینید مقدار ۹۰ هم در آن گیر می‌کند.</p>`,
  },
  {
    slug: "python-workshop-session-1",
    title: "کارگاه پایتون، جلسهٔ ۱: از print تا هرم",
    excerpt: "یادداشت کامل جلسهٔ اول کارگاه پایتون: از print و متغیر تا حلقه و تابع، همراه با ویدیوی جلسه، همهٔ فایل‌های کلاس و توضیح قدم‌به‌قدم آزمایشگاه هرم.",
    author: "استودیو کدولوژی",
    tags: ["پایتون", "کارگاه", "آموزش برنامه‌نویسی"],
    coverUrl: "/images/blog/cover-python-session.svg",
    publishedAt: "2026-11-07T11:00:00+03:30",
    contentHtml: "<p>جلسهٔ اول کارگاه پایتون با یک سؤال شروع شد: «یک برنامه، اصلاً چیست؟» ۲۴۰ دقیقه بعد، آخرین چیزی که روی تخته ماند یک هرم از ستاره بود. بین این دو، پایتون را نصب کردیم، اولین <code>print</code> را زدیم، متغیر ساختیم، لیست و دیکشنری دیدیم، با <code>if</code> تصمیم گرفتیم، با <code>for</code> تکرار کردیم، تابع نوشتیم و خواندن خطا را با هم تمرین کردیم.</p>\n<p>اگر آنجا بودید، این‌ها همان یادداشت‌های سر کلاس است. اگر نبودید هم چیزی از دست نداده‌اید: ویدیو را ببینید یا از همین‌جا شروع کنید، هیچ پیش‌نیازی ندارد. فایل‌های جلسه را هم پایین همین صفحه برای خواندن و دانلود گذاشته‌ام.</p>\n<div data-embed=\"aparat\" data-src=\"https://www.aparat.com/video/video/embed/videohash/woh65a0/vt/frame\"></div>\n<p><a href=\"https://www.aparat.com/v/woh65a0\" title=\"تماشای ویدیوی جلسه در آپارات\" target=\"_blank\" rel=\"noopener noreferrer\">تماشای ویدیو در آپارات</a> — اگر پخش‌کننده بالا باز نشد.</p>\n<h2>برنامهٔ جلسه</h2>\n<p>برنامهٔ جلسه را از قبل چیده بودم تا با دو استراحت همه‌چیز جا شود. جدول زیر همان برنامه است و بخش‌های متنی صفحه هم به همان ترتیب پیش می‌روند.</p>\n<table><thead><tr><th>دقیقه</th><th>بخش</th><th>ماده‌ی آموزشی</th></tr></thead><tbody><tr><td>۰–۱۰</td><td>۱. کامپیوتر چطور کار می‌کند؛ کدنویسی چیست</td><td>همین پرونده</td></tr><tr><td>۱۰–۳۸</td><td>۲. نصب و اولین اجرا</td><td>راهنمای نصب (روی پرده)، <code>demos/00_hello.py</code></td></tr><tr><td>۳۸–۶۶</td><td>۳. print، input، متغیر، نوع مقدار</td><td><code>demos/01</code>، <code>demos/02</code></td></tr><tr><td>۶۶–۷۸</td><td>۴. لیست — «ستون جدول»</td><td><code>demos/03_lists.py</code></td></tr><tr><td>۷۸–۹۰</td><td>۵. دیکشنری — «ردیف جدول»</td><td><code>demos/04_dicts.py</code></td></tr><tr><td>۹۰–۱۰۰</td><td><strong>استراحت</strong></td><td></td></tr><tr><td>۱۰۰–۱۲۰</td><td>۶. شرط‌ها</td><td><code>demos/05_conditions.py</code></td></tr><tr><td>۱۲۰–۱۴۵</td><td>۷. حلقه‌ی for</td><td><code>demos/06_loops.py</code></td></tr><tr><td>۱۴۵–۱۶۵</td><td>۸. تابع و import</td><td><code>demos/07_functions_and_imports.py</code></td></tr><tr><td>۱۶۵–۱۷۵</td><td>۹. خواندن خطاها</td><td><code>demos/08_tracebacks.py</code></td></tr><tr><td>۱۷۵–۲۰۰</td><td>۱۰. آزمایشگاه هرم</td><td><code>lab/pyramids/</code></td></tr><tr><td>۲۰۰–۲۱۰</td><td><strong>استراحت</strong></td><td></td></tr><tr><td>۲۱۰–۲۲۵</td><td>۱۱. تیزر Kilo Code</td><td><code>kilocode/teaser.md</code></td></tr><tr><td>۲۲۵–۲۴۰</td><td>۱۲. جمع‌بندی، تکلیف، بازخورد</td><td>همین پرونده</td></tr></tbody></table>\n<p>مسیرهایی که در ستون آخر می‌بینید، نام فایل‌های همان کلاس است؛ همهٔ فایل‌ها با همین نام‌ها در بخش «فایل‌ها و برگه‌های کلاس» پایین برای خواندن و دانلود گذاشته شده‌اند.</p>\n<h2>بخش ۱ — کامپیوتر چطور کار می‌کند و کدنویسی چیست</h2>\n<p>ده دقیقهٔ اول فقط دربارهٔ همین حرف زدیم: برنامه اصلاً چیست، و چرا خطا چیزی نیست که از آن بترسیم.</p>\n<h4>۱.۱ چرا این‌جا هستیم</h4>\n<blockquote><p>«تا امروز هر بار با کامپیوتر کار کرده‌اید، از نرم‌افزاری استفاده کرده‌اید که یک نفر دیگر نوشته است. از امروز شما آن یک نفر هستید. برنامه‌نویسی هم چیز غریبی نیست؛ شبیه همان کاری است که سال‌ها در آزمایشگاه می‌کنید: نوشتن دستور کار، دقیق و بدون ابهام.»</p></blockquote>\n<h2>بخش ۲ — نصب و اولین اجرا</h2>\n<p>هدف این بخش ساده بود: تا آخر آن، هر کس باید یک <code>hello.py</code> روی لپ‌تاپ خودش اجرا می‌کرد. حدود نیم ساعت طول کشید.</p>\n<h4>۲.۱ مسیر نصب</h4>\n<p>راهنمای نصب را روی پرده باز کردم و قدم‌به‌قدم جلو رفتیم. سه نکته را همان اول گفتم:</p>\n<blockquote><p>۱. «صفحه‌ی اول نصب، یک تیک دارد: <strong>Add python.exe to PATH</strong>. اگر این تیک را نزدید، <code>python</code> در ترمینال شناخته نمی‌شود و باید نصب را تعمیر کنید. این تنها تله‌ی واقعی این نصب است.»</p><p>۲. «از Anaconda و Microsoft Store استفاده نمی‌کنیم. نسخه‌ی رسمی python.org ساده‌تر است و در جلسهٔ ۲ که محیط مجازی می‌سازیم، همان را لازم داریم.»</p><p>۳. «نصب پیش‌فرض python.org به‌صورت per-user انجام می‌شود و به دسترسی admin نیاز ندارد. فقط تیک «Install launcher for all users» را نزنید.»</p></blockquote>\n<h4>۲.۲ تأیید نصب</h4>\n<p>بعد همه با هم در <code>cmd</code> همین را زدیم:</p>\n<pre data-language=\"python\"><code>python --version</code></pre>\n<blockquote><p>«اگر <code>Python 3.12.x</code> آمد، تمام است. اگر خطای <code>not recognized</code> گرفتید، تیک PATH جا افتاده و نصب باید تعمیر شود.»</p></blockquote>\n<p>و بعد از آن:</p>\n<pre data-language=\"python\"><code>python -c \"print('setup is working')\"</code></pre>\n<h4>۲.۳ VS Code و اولین فایل</h4>\n<ol><li>یک پوشهٔ <code>python-workshop</code> ساختیم و در VS Code بازش کردیم (<code>File → Open Folder</code>).</li><li>فایل <code>hello.py</code> را با این محتوا ساختیم:<pre data-language=\"python\"><code>print(\"Hello, Python!\")\nprint(\"2 + 3 =\", 2 + 3)</code></pre></li><li><code>Ctrl+S</code> و بعد دکمه‌ی ▶ (یا <code>Ctrl+F5</code>)؛ اولین خروجی هر کس روی صفحهٔ خودش آمد.</li></ol>\n<blockquote><p>«اگر دکمه‌ی ▶ خاکستری باشد یا خطا بدهد، <code>Ctrl+Shift+P</code> و بعد <code>Python: Select Interpreter</code> و Python 3.12؛ همین را همان‌جا برای چند نفر انجام دادیم و درست شد.»</p></blockquote>\n<h2>بخش ۳ — print، input، متغیر، نوع مقدار</h2>\n<h4>۳.۱ چاپ و متن</h4>\n<pre data-language=\"python\"><code>print(\"Hello, Python!\")\nprint(\"PM2.5 guideline:\", 15, \"ug/m3\")\nprint(\"2 + 3 =\", 2 + 3)\nprint(\"2 + 3\")     # این یکی متن است، نه محاسبه</code></pre>\n<blockquote><p>«چیزی که داخل <code>\" \"</code> است، متن است؛ هر چیزی بیرونش، کد. <code>print</code> چند چیز را با هم چاپ می‌کند و بینشان فاصله می‌گذارد.»</p></blockquote>\n<h4>۳.۲ متغیر و نوع</h4>\n<pre data-language=\"python\"><code>city       = \"Tehran\"\npm25       = 48.3\nn_stations = 12\nis_valid   = True\n\nprint(city, pm25, n_stations, is_valid)\nprint(type(city), type(pm25), type(n_stations), type(is_valid))</code></pre>\n<blockquote><p>«متغیر یک <strong>برچسب</strong> است روی یک مقدار. <code>pm25 = 48.3</code> یعنی «هر جا <code>pm25</code> دیدی، ۴۸.۳ را بگذار». اسم را خودتان انتخاب می‌کنید؛ اسم خوب، نیمی از خوانایی کد است.»</p></blockquote>\n<p>چهار نوع امروز: <code>str</code>، <code>int</code>، <code>float</code>، <code>bool</code>. <code>type()</code> ابزار بازرسی است و از اینجا به بعد زیاد سراغش می‌رویم.</p>\n<p>هشدار عملی:</p>\n<blockquote><p>«اعداد را با صفحه‌کلید فارسی تایپ نکنید. <code>۴۸.۳</code> برای پایتون عدد نیست؛ <code>SyntaxError</code> می‌گیرید. همیشه انگلیسی.»</p></blockquote>\n<h4>۳.۳ حساب و تبدیل</h4>\n<pre data-language=\"python\"><code>a = 10\nb = 4\nprint(a + b, a - b, a * b)\nprint(a / b)     # 2.5  تقسیم همیشه اعشاری است\nprint(a // b)    # 2    تقسیم صحیح\nprint(a % b)     # 2    باقیمانده\nprint(a ** b)    # توان\n\npm25_mg = pm25 / 1000\nprint(\"pm25 in mg/m3:\", pm25_mg)\n\nprint(int(\"42\") + 1)\nprint(str(75) + \" ug/m3\")\nprint(int(3.99))     # 3 — برش، نه گرد کردن</code></pre>\n<h4>۳.۴ ورودی و f-string</h4>\n<pre data-language=\"python\"><code>city = input(\"City: \")\npm25_text = input(\"PM2.5 (ug/m3): \")\nprint(type(pm25_text))          # str !\n\npm25 = float(pm25_text)\nprint(f\"{city}: PM2.5 = {pm25:.1f} ug/m3\")</code></pre>\n<blockquote><p>«<code>input()</code> همیشه <strong>متن</strong> برمی‌گرداند، حتی اگر کاربر عدد بزند. تا تبدیل نکنید، نمی‌توانید جمع بزنید. این شایع‌ترین خطای هفته‌ی اول است.»</p></blockquote>\n<p>خطای کلاسیک را همان‌جا زنده نشان دادم: <code>int(\"48.3\")</code> → <code>ValueError</code>. در فایل <code>02</code> هم به‌صورت کامنت هست.</p>\n<h4>لحظه‌های پیش‌بینی</h4>\n<p>قبل از اجرا پرسیدم و چند جواب از کلاس گرفتم:</p>\n<table><thead><tr><th>عبارت</th><th>جواب</th><th>چرا مهم است</th></tr></thead><tbody><tr><td><code>0.1 + 0.2</code></td><td><code>0.30000000000000004</code></td><td>کامپیوتر اعشار را دقیق نگه نمی‌دارد</td></tr><tr><td><code>10 / 4</code></td><td><code>2.5</code></td><td><code>/</code> همیشه اعشاری</td></tr><tr><td><code>\"3\" + \"4\"</code></td><td><code>\"34\"</code></td><td>متن + متن = چسباندن</td></tr><tr><td><code>int(\"48.3\")</code></td><td><code>ValueError</code></td><td><code>int</code> اعشار نمی‌پذیرد</td></tr></tbody></table>\n<h4>چک‌پوینت</h4>\n<blockquote><p>«برنامه‌ای که اسم شهر و PM2.5 را بگیرد و یک جمله‌ی کامل چاپ کند. سه دقیقه وقت داشتند و بعد دو نفر نتیجه را نشان دادند.»</p></blockquote>\n<h2>بخش ۴ — لیست: «ستون جدول»</h2>\n<pre data-language=\"python\"><code>cities = [\"Tehran\", \"Isfahan\", \"Tabriz\", \"Ahvaz\", \"Shiraz\"]\n\nprint(cities[0])      # Tehran — شمارش از صفر\nprint(cities[-1])     # Shiraz — از آخر\nprint(len(cities))    # 5\nprint(cities[0:3])    # سه تای اول\ncities.append(\"Qom\")</code></pre>\n<pre data-language=\"python\"><code>daily_pm25 = [64, 88, 45, 102, 51, 77, 39]\nprint(sum(daily_pm25) / len(daily_pm25))\nprint(max(daily_pm25), min(daily_pm25), sorted(daily_pm25))</code></pre>\n<blockquote><p>«یک ستون از جدول، یک لیست است. در جلسه‌ی ۲، همین ستون‌ها می‌شوند ستون‌های یک <code>DataFrame</code> در pandas. اگر این را امروز بفهمید، جلسه‌ی ۲ برایتان مرور است، نه شروع.»</p></blockquote>\n<p>بعد پرسیدم <code>cities[5]</code> چه می‌دهد و چرا؛ جواب <code>IndexError</code> بود، چون این لیست پنج عضو دارد (۰ تا ۴).</p>\n<p>چک‌پوینت کوچک: میانگین <code>[12, 18, 25, 30]</code> را بدون حلقه و فقط با <code>sum</code> و <code>len</code> حساب کردند.</p>\n<h2>بخش ۵ — دیکشنری: «ردیف جدول»</h2>\n<pre data-language=\"python\"><code>station = {\"city\": \"Tehran\", \"pm25\": 48.3, \"n_days\": 30}\n\nprint(station[\"city\"])\nstation[\"pm25\"] = 52.0          # به‌روزرسانی\nstation[\"pm10\"] = 91.4          # کلید جدید\nprint(station.keys(), station.values())\nprint(station.get(\"so2\", \"not measured\"))</code></pre>\n<pre data-language=\"python\"><code>stations = {\n    \"Tehran\":  {\"pm25\": 48.3, \"pm10\": 91.4},\n    \"Ahvaz\":   {\"pm25\": 83.7, \"pm10\": 140.2},\n}\nprint(stations[\"Ahvaz\"][\"pm10\"])</code></pre>\n<blockquote><p>«یک ردیف جدول، یک دیکشنری است: هر ستون یک کلید. لیست به ترتیب اهمیت می‌دهد، دیکشنری به <strong>اسم</strong>. فردا در pandas، هر ردیف داده همین شکل است.»</p></blockquote>\n<p>قبل از اجرا هم دو سؤال پرسیدم: <code>len(stations)</code> چند است، و <code>stations[\"Ahvaz\"][\"pm25\"]</code> چه می‌دهد.</p>\n<p>چک‌پوینت: هر کس شیراز را با <code>pm25 = 39.1</code> به <code>stations</code> اضافه کرد.</p>\n<h2>استراحت — ۱۰ دقیقه</h2>\n<h2>بخش ۶ — شرط‌ها: if / elif / else</h2>\n<p>بیست دقیقه برای شرط‌ها وقت گذاشتیم. چیزی که آخر این بخش باید جا افتاده باشد این است که چرا ترتیب شرط‌ها مهم است.</p>\n<h4>۶.۱ مقایسه و بولی</h4>\n<pre data-language=\"python\"><code>pm25 = 48.3\nprint(pm25 &gt; 35)      # True\nprint(pm25 &lt;= 75)\nprint(pm25 == 48.3)   # دو مساوی برای مقایسه</code></pre>\n<blockquote><p>«مقایسه همیشه <code>True</code> یا <code>False</code> می‌دهد. این نوع، <code>bool</code> است — همان که در بخش ۳ دیدیم.»</p></blockquote>\n<h4>۶.۲ if / else</h4>\n<pre data-language=\"python\"><code>if pm25 &gt; 75:\n    print(\"Above the national 24h limit\")\nelse:\n    print(\"Below the limit\")</code></pre>\n<blockquote><p>«دو چیز این‌جا مقدس است: <strong>دونقطه</strong> و <strong>تو رفتگی</strong>. تو رفتگی در پایتون تزئین نیست؛ جزو دستور است. اگر چهار فاصله را کم کنید، پایتون نمی‌فهمد چه چیزی داخل شرط است.»</p></blockquote>\n<h4>۶.۳ زنجیره‌ی elif</h4>\n<pre data-language=\"python\"><code>if pm25 &lt; 15:\n    category = \"Good (WHO guideline)\"\nelif pm25 &lt; 35:\n    category = \"Moderate\"\nelif pm25 &lt; 75:\n    category = \"Unhealthy for sensitive groups\"\nelse:\n    category = \"Unhealthy\"\n\nprint(\"category:\", category)</code></pre>\n<blockquote><p>«فقط <strong>اولین</strong> شرطی که درست باشد اجرا می‌شود و بقیه رد می‌شوند. برای همین ترتیب مهم است: اگر اول <code>pm25 &lt; 75</code> را بنویسید، مقدار ۱۰ هم در آن گیر می‌کند و دسته‌ی «خوب» هرگز دیده نمی‌شود. این را امتحان می‌کنیم.»</p></blockquote>\n<p>همان‌جا ترتیب را عوض کردیم و خروجی را برای <code>pm25 = 12</code> دیدیم.</p>\n<blockquote><p>«آستانه‌های این‌جا ساده‌شده و برای تمرین‌اند. در جلسه‌ی ۲ با استاندارد واقعی و داده‌ی واقعی کار می‌کنیم.»</p></blockquote>\n<h4>۶.۴ and / or / not / in</h4>\n<pre data-language=\"python\"><code>is_high = pm25 &gt; 35\nhas_data = True\nprint(is_high and has_data)\nprint(is_high or has_data)\nprint(not is_high)\nprint(\"Tehran\" in [\"Tehran\", \"Isfahan\"])</code></pre>\n<h4>۶.۵ دو خطای رایج</h4>\n<pre data-language=\"python\"><code># if pm25 = 50:        -&gt; SyntaxError\n# if pm25 &gt; 50\n#     print(\"high\")    -&gt; SyntaxError</code></pre>\n<blockquote><p>«<code>=</code> یعنی «بگذار» و <code>==</code> یعنی «برابر است؟». دونقطه را هم یادتان باشد؛ این دو، نیمی از خطاهای امروز بود.»</p></blockquote>\n<h4>چک‌پوینت</h4>\n<blockquote><p>«مقدار <code>pm25</code> را به ۱۲، بعد ۳۰، بعد ۹۰ تغییر دادیم و هر بار <strong>قبل از اجرا</strong> حدس زدیم کدام دسته چاپ می‌شود.»</p></blockquote>\n<h2>بخش ۷ — حلقه‌ی for</h2>\n<h4>۷.۱ پیمایش لیست</h4>\n<pre data-language=\"python\"><code>cities = [\"Tehran\", \"Isfahan\", \"Tabriz\"]\n\nfor city in cities:\n    print(\"city:\", city)</code></pre>\n<blockquote><p>«حلقه یعنی: این کار را برای هر عضو تکرار کن، بدون خستگی و بدون جا انداختن. <code>city</code> هر بار مقدار عضو بعدی را می‌گیرد. اسمش را هر چه بگذارید مهم نیست، ولی <code>city</code> می‌گوید چه چیزی است.»</p></blockquote>\n<h4>۷.۲ range</h4>\n<pre data-language=\"python\"><code>for i in range(5):        # 0 1 2 3 4\n    print(i)\n\nfor i in range(1, 6):     # 1 2 3 4 5\n    print(i)\n\nfor i in range(0, 10, 2): # 0 2 4 6 8\n    print(i)</code></pre>\n<blockquote><p>«<code>range(5)</code> از صفر شروع می‌کند و پنج عدد می‌دهد؛ عدد ۵ خودش داخل نیست. این «یکی کم» کلاسیک است و بعداً در هرم به کارمان می‌آید.»</p></blockquote>\n<h4>۷.۳ الگوی جمع‌کننده</h4>\n<pre data-language=\"python\"><code>daily = [64, 88, 45, 102, 51, 77, 39]\n\ntotal = 0\nfor v in daily:\n    total = total + v\nprint(\"mean =\", total / len(daily))</code></pre>\n<blockquote><p>«این الگو را یادتان باشد: <strong>قبل از حلقه صفر، داخل حلقه جمع، بعد از حلقه استفاده</strong>. با همین سه خط، میانگین، تعداد روزهای بالای حد، و بیشینه را می‌شود حساب کرد.»</p></blockquote>\n<pre data-language=\"python\"><code>count = 0\nfor v in daily:\n    if v &gt; 75:\n        count = count + 1\n\nlargest = daily[0]\nfor v in daily:\n    if v &gt; largest:\n        largest = v</code></pre>\n<h4>۷.۴ دیکشنری در حلقه</h4>\n<pre data-language=\"python\"><code>pm25_by_city = {\"Tehran\": 48.3, \"Isfahan\": 61.2, \"Ahvaz\": 83.7}\nfor name, value in pm25_by_city.items():\n    print(name, \"-&gt;\", value)</code></pre>\n<h4>۷.۵ break و continue</h4>\n<pre data-language=\"python\"><code>for v in daily:\n    if v &gt; 100:\n        print(\"first above 100:\", v)\n        break\n\nfor v in daily:\n    if v &lt; 50:\n        continue\n    print(\"above 50:\", v)</code></pre>\n<blockquote><p>«<code>break</code> از حلقه بیرون می‌آید؛ <code>continue</code> این دور را رد می‌کند. کم استفاده کنید — بیشتر وقت‌ها <code>if</code> کافی است.»</p></blockquote>\n<h4>۷.۶ حلقه‌ی تودرتو</h4>\n<pre data-language=\"python\"><code>for row in range(3):\n    for col in range(3):\n        print(\"*\", end=\"\")\n    print()</code></pre>\n<blockquote><p>«دو حلقه، دو شمارش مستقل: یکی ردیف، یکی ستون. <code>end=\"\"</code> می‌گوید بعد از چاپ، خط جدید نزن. <code>print()</code> خالی، خط را تمام می‌کند. این هشت خط، دقیقاً همان چیزی بود که در آزمایشگاه هرم لازم داشتیم.»</p></blockquote>\n<h2>بخش ۸ — تابع و import</h2>\n<h4>۸.۱ چرا تابع</h4>\n<pre data-language=\"python\"><code>def aqi_category(pm25):\n    if pm25 &lt; 15:\n        return \"Good\"\n    elif pm25 &lt; 35:\n        return \"Moderate\"\n    elif pm25 &lt; 75:\n        return \"Unhealthy for sensitive groups\"\n    return \"Unhealthy\"</code></pre>\n<blockquote><p>«تا الان هر بار می‌خواستید دسته‌بندی کنید، باید همان شش خط را کپی می‌کردید. تابع یعنی <strong>یک بار بنویس، هر جا استفاده کن</strong>. اسمش را می‌گذاریم، ورودی می‌دهیم، خروجی می‌گیریم.»</p></blockquote>\n<h4>۸.۲ پارامتر و آرگومان</h4>\n<pre data-language=\"python\"><code>def greet(city):\n    print(\"Studying air quality in\", city)\n\ngreet(\"Tehran\")\ngreet(\"Ahvaz\")</code></pre>\n<blockquote><p>«<code>city</code> اسم پارامتر است، داخل تعریف. <code>\"Tehran\"</code> آرگومان است، هنگام صدا زدن. همان چیز، دو اسم در دو لحظه.»</p></blockquote>\n<h4>۸.۳ return در برابر print — مهم‌ترین نکته‌ی امروز</h4>\n<pre data-language=\"python\"><code>def double_print(x):\n    print(x * 2)\n\ndef double_return(x):\n    return x * 2\n\nr1 = double_print(5)   # چاپ می‌کند\nr2 = double_return(5)  # برمی‌گرداند\n\nprint(r1)   # None\nprint(r2)   # 10</code></pre>\n<blockquote><p>«تابعی که فقط <code>print</code> دارد، با دنیای بیرون حرف نمی‌زند؛ مثل کسی که جواب را بلند می‌گوید و می‌رود. <code>return</code> جواب را <strong>تحویل می‌دهد</strong>. اگر می‌خواهید نتیجه را در جای دیگری استفاده کنید، <code>return</code> لازم است. اگر <code>None</code> دیدید، تقریباً همیشه یعنی <code>return</code> جا افتاده.»</p></blockquote>\n<h4>۸.۴ مقدار پیش‌فرض، دامنه، مستند</h4>\n<pre data-language=\"python\"><code>def report(city, unit=\"ug/m3\"):\n    \"\"\"یک خط گزارش برمی‌گرداند.\"\"\"\n    return f\"{city}: 48.3 {unit}\"\n\nprint(report(\"Tehran\"))\nprint(report(\"Tehran\", \"mg/m3\"))</code></pre>\n<blockquote><p>«<code>unit</code> پیش‌فرض دارد؛ اگر ندهید، <code>ug/m3</code> می‌شود. دامنه (scope) ساده است: متغیری که داخل تابع تعریف شود، بیرون دیده نمی‌شود.»</p></blockquote>\n<h4>۸.۵ import و venv</h4>\n<pre data-language=\"python\"><code>import math\nprint(math.sqrt(16), math.pi)\n\nfrom random import randint\nprint(randint(1, 6))\n\nimport statistics\ndaily = [64, 88, 45, 102, 51, 77, 39]\nprint(statistics.mean(daily), statistics.median(daily))</code></pre>\n<blockquote><p>«لازم نیست همه چیز را خودتان بنویسید. <code>import</code> یعنی «کد کسی دیگر را بیاور». <code>math.sqrt</code> یعنی «تابع <code>sqrt</code> از ماژول <code>math</code>». و در جلسات بعد، <code>import pandas</code> بزرگ‌ترین «کسی دیگر» خواهد بود.»</p></blockquote>\n<h4>۸.۶ ترکیب</h4>\n<pre data-language=\"python\"><code>stations = {\"Tehran\": 48.3, \"Isfahan\": 61.2, \"Ahvaz\": 83.7}\nfor city, value in stations.items():\n    print(city, \"-&gt;\", aqi_category(value))</code></pre>\n<blockquote><p>«حلقه + تابع + دیکشنری. سه چیزی که امروز یاد گرفتید، در سه خط. این شکل، همان شکلی است که ایجنت‌ها هم تولید می‌کنند — و فردا باید بتوانید قضاوتش کنید.»</p></blockquote>\n<h4>چک‌پوینت</h4>\n<p>آخر بخش پرسیدم <code>aqi_category(90)</code> چه می‌دهد؛ جواب درست <code>Unhealthy</code> است. هر کس «Unhealthy for sensitive groups» گرفت، ترتیب <code>elif</code>هایش غلط بود — همان درس بخش ۶.۳.</p>\n<h2>بخش ۹ — خواندن خطاها</h2>\n<h4>۹.۱ کالبدشکافی</h4>\n<p>روی پرده این را نوشتم:</p>\n<pre data-language=\"text\"><code>Traceback (most recent call last):\n  File \"broken.py\", line 3, in &lt;module&gt;\n    print(cities[5])\n         ~~~~~~^\nIndexError: list index out of range</code></pre>\n<blockquote><p>«از <strong>پایین</strong> شروع می‌کنیم. خط آخر دو چیز دارد: نوع خطا (<code>IndexError</code>) و توضیح (<code>list index out of range</code>). بالاتر، محل خطا: فایل، شماره‌ی خط، و علامت <code>^</code> که دقیقاً کجای خط را نشان می‌دهد.</p><p>این ترتیب عمدی است: مهم‌ترین اطلاعات آخر است.»</p></blockquote>\n<h4>۹.۲ چهار خطا، زنده</h4>\n<p>یک فایل <code>broken.py</code> گذاشتم کنار و عمداً یکی‌یکی شکستیمش.</p>\n<table><thead><tr><th>کاری که می‌کنید</th><th>خطا</th><th>جمله‌ای که همان‌جا گفتم</th></tr></thead><tbody><tr><td><code>if pm25 = 50:</code></td><td><code>SyntaxError</code></td><td>«جمله‌بندی غلط. <code>=</code> را با <code>==</code> عوض کن.»</td></tr><tr><td>بدنه‌ی <code>for</code> را بی‌تو رفتگی بنویسید</td><td><code>IndentationError</code></td><td>«پایتون از تو رفتگی می‌فهمد چه چیزی داخل حلقه است.»</td></tr><tr><td><code>print(pm_25)</code></td><td><code>NameError</code></td><td>«اسم ناشناس: نه اسم را غلط نوشتی، نه تعریفش نکردی.»</td></tr><tr><td><code>int(input(...))</code> با ورودی <code>48.3</code></td><td><code>ValueError</code></td><td>«مقدار قابل تبدیل نیست. <code>int</code> اعشار نمی‌پذیرد.»</td></tr></tbody></table>\n<h4>۹.۳ واژه‌نامه‌ی پیام‌های انگلیسی</h4>\n<blockquote><p>«پیام‌ها انگلیسی‌اند، ولی فقط چند کلمه‌ی تکراری دارند: <code>not defined</code> یعنی تعریف نشده؛ <code>invalid syntax</code> یعنی جمله‌بندی غلط؛ <code>expected</code> یعنی این‌جا چیزی کم است؛ <code>unsupported</code> یعنی این نوع را نمی‌پذیرم؛ <code>out of range</code> یعنی بیرون از محدوده. بقیه‌اش را می‌شود حدس زد.»</p></blockquote>\n<h2>بخش ۱۰ — آزمایشگاه هرم</h2>\n<h4>۱۰.۱ صورت مسئله</h4>\n<p>فایل <code>lab/pyramids/pyramid_starter.py</code> را باز کردیم و <code>README.md</code> را با هم خواندیم.</p>\n<blockquote><p>«پنج سطح داریم، هر سطح یک ویرایش کوچک روی سطح قبلی. سطح ۱ و ۲ حل شده‌اند. سطح ۳ و ۴ و ۵ با شماست. قاعده: <strong>از صفر ننویسید؛ کد کارکننده را تغییر دهید.</strong> این مهارت اصلی برنامه‌نویسی است — همان کاری که فردا از ایجنت هم می‌خواهید بکند.»</p></blockquote>\n<p>قاعده‌ها را هم گفتم: دو نفره کار کنید، قبل از اجرا پیش‌بینی کنید، و خطا را بلند بخوانید.</p>\n<h2>آزمایشگاه هرم، ساده و قدم‌به‌قدم</h2>\n<p>آخرین کار جلسه یک تمرین کوتاه بود: با حلقه یک هرم از ستاره بکشیم. خیلی‌ها همان‌جا فهمیدند حلقه واقعاً چه کار می‌کند، چون خروجی هر خط را با چشم می‌بینند. اگر آن ده دقیقه برایتان سریع گذشت، اینجا آرام‌ترش می‌کنیم.</p>\n<p>هدف این است که برای <code>n</code> خط، شکلی مثل این چاپ شود:</p>\n<pre data-language=\"text\"><code>    *\n   ***\n  *****\n *******\n*********</code></pre>\n<p>به هر خط نگاه کنید؛ سه چیز با هم عوض می‌شود:</p>\n<ul>\n<li>شمارهٔ خط: از ۱ شروع می‌کنیم، پس خط‌ها ۱ تا ۵ هستند.</li>\n<li>تعداد فاصله‌های اول خط: ۴، ۳، ۲، ۱، ۰ — هر خط یکی کمتر از قبلی.</li>\n<li>تعداد ستاره‌ها: ۱، ۳، ۵، ۷، ۹ — هر خط دو تا بیشتر از قبلی.</li>\n</ul>\n<table><thead><tr><th>خط (i)</th><th>فاصله (n - i)</th><th>ستاره (2 * i - 1)</th></tr></thead><tbody><tr><td>۱</td><td>۴</td><td>۱</td></tr><tr><td>۲</td><td>۳</td><td>۳</td></tr><tr><td>۳</td><td>۲</td><td>۵</td></tr><tr><td>۴</td><td>۱</td><td>۷</td></tr><tr><td>۵</td><td>۰</td><td>۹</td></tr></tbody></table>\n<p>پس کار هر خط فقط این است: کمی فاصله، بعد چند ستاره، بعد برو خط بعد. در پایتون هر دوی این‌ها یک ضرب ساده‌اند: پنجره را که با <code>for</code> می‌شماریم، برای هر خط دو عدد حساب می‌کنیم و متن را در آن عدد ضرب می‌کنیم.</p>\n<pre data-language=\"python\"><code>def pyramid(n, star=\"*\"):\n    for i in range(1, n + 1):\n        spaces = n - i\n        stars = 2 * i - 1\n        print(\" \" * spaces + star * stars)\n\npyramid(5)\npyramid(5, \"#\")</code></pre>\n<p>سه چیز در این کد تازه است و هر سه هم ساده‌اند:</p>\n<ul>\n<li><code>\" \" * 4</code> یعنی «چهار فاصله پشت سر هم»: پایتون متن را در یک عدد ضرب می‌کند و متن تکرار می‌شود. <code>star * stars</code> هم همین کار را با ستاره می‌کند.</li>\n<li><code>range(1, n + 1)</code> از ۱ تا خودِ <code>n</code> می‌شمارد؛ عدد آخر حساب نمی‌شود، برای همین <code>n + 1</code> نوشتیم.</li>\n<li>هر دو تکه در یک <code>print</code> و با <code>+</code> به هم چسبیده‌اند؛ اگر با کاما جدا بنویسید، پایتون یک فاصلهٔ اضافه بینشان می‌گذارد و هرم کج می‌شود.</li>\n</ul>\n<p>چرا <code>2 * i - 1</code> و نه <code>i * 2</code>؟ چون خط اول باید ۱ ستاره داشته باشد، نه ۲. خط اول با <code>i = 1</code> عدد ۱ می‌دهد، خط دوم ۳، خط سوم ۵؛ دقیقاً همان ۱، ۳، ۵، ۷، ۹.</p>\n<h3>چه وقت تمرین تمام است؟</h3>\n<ul>\n<li><code>pyramid(5)</code> پنج خط هرم درست چاپ می‌کند.</li>\n<li><code>pyramid(5, \"#\")</code> همان هرم را با <code>#</code> می‌سازد.</li>\n<li><code>pyramid(0)</code> هیچ چیز چاپ نمی‌کند و خطا هم نمی‌دهد (چون حلقه اصلاً اجرا نمی‌شود).</li>\n<li>می‌توانید با جملهٔ خودتان توضیح بدهید چرا تعداد ستاره‌ها <code>2 * i - 1</code> است.</li>\n</ul>\n<h3>سه خطای رایج</h3>\n<ol>\n<li>نوشتن <code>i * 2</code> به‌جای <code>2 * i - 1</code>: خط اول دو ستاره می‌شود و هرم کج درمی‌آید.</li>\n<li>فراموش کردن فاصله‌ها: هرم به دیوار سمت چپ می‌چسبد و شکل مثلث می‌شود.</li>\n<li>چاپ کردن فاصله‌ها و ستاره‌ها در دو <code>print</code> جدا: هر کدام در یک خط می‌افتد و هرم دو برابر ارتفاع پیدا می‌کند.</li>\n</ol>\n<div data-callout=\"tip\" data-callout-title=\"فایل شروع آماده است\"><p data-callout-title>فایل شروع آماده است</p><div data-callout-body><p>برگهٔ آزمایشگاه پنج سطح دارد: در سطح ۱ با دست پنج خط ستاره می‌نویسید، در سطح ۲ همان پنج خط را با یک <code>print</code> می‌زنید، سطح ۳ مثلث راست‌گوشه است، سطح ۴ همین هرم و سطح ۵ همین هرم را داخل تابع می‌برید. فایل <code>pyramid_starter.py</code> (پایین) سطح ۱ تا ۳ را حل کرده و جای فرمول‌های سطح ۴ را با <code>TODO</code> علامت زده است؛ اگر گیر کردید، از همان‌جا ادامه بدهید.</p></div></div>\n<p>اگر خواستید بیشتر بروید: هرم وارونه (از پهن به باریک)، لوزی (هرم + هرم وارونه) و جدول ضرب <code>n × n</code> با دو حلقهٔ تو در تو، هر سه با همین ابزارها ساخته می‌شوند.</p>\n<h2>فایل‌ها و برگه‌های کلاس</h2>\n<p>هر چیزی که در جلسه استفاده کردیم اینجاست. روی «پیش‌نمایش» بزنید تا متن فایل را همین‌جا بخوانید، یا دانلودش کنید.</p>\n<h3>یادداشت و جزوه</h3>\n<p><strong>یادداشت کامل جلسه</strong> — همان متنی که در این صفحه خواندید، در یک فایل مارک‌داون برای مرور و جست‌وجو.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/session-one.md\" download=\"session-one.md\" rel=\"noopener noreferrer\">session-one.md</a></figure>\n<p><strong>جزوهٔ یک‌صفحه‌ای</strong> — نصب، ساختارهای امروز، خواندن traceback، فرمول هرم و واژه‌نامه؛ برای چسباندن کنار مانیتور.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/handout.md\" download=\"handout.md\" rel=\"noopener noreferrer\">handout.md</a></figure>\n<p><strong>برگهٔ آزمایشگاه هرم</strong> — پنج سطح تمرین، جدول راهنمای سطح ۴ و معیار «تمام شد».</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/pyramids-lab.md\" download=\"pyramids-lab.md\" rel=\"noopener noreferrer\">pyramids-lab.md</a></figure>\n<h3>کدهای کلاس</h3>\n<p>هر فایل یک بخش از جلسه است و با <code># ====</code> به چند تکه تقسیم شده. جمله‌های آخر هر فایل، تمرین‌هایی است که سر کلاس دادیم.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/00_hello.py\" download=\"00_hello.py\" rel=\"noopener noreferrer\">00_hello.py</a></figure>\n<p>شروع: اولین فایل، اولین <code>print</code>، اولین خطا.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/01_variables_and_types.py\" download=\"01_variables_and_types.py\" rel=\"noopener noreferrer\">01_variables_and_types.py</a></figure>\n<p>متغیر، نام‌گذاری و چهار نوع مقدار امروز: <code>str</code>، <code>int</code>، <code>float</code>، <code>bool</code>.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/02_input_and_fstrings.py\" download=\"02_input_and_fstrings.py\" rel=\"noopener noreferrer\">02_input_and_fstrings.py</a></figure>\n<p><code>input</code> و <code>f-string</code>: گرفتن ورودی و چسباندن مقدار داخل متن.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/03_lists.py\" download=\"03_lists.py\" rel=\"noopener noreferrer\">03_lists.py</a></figure>\n<p>لیست: افزودن، حذف، ایندکس، برش و چند متد پرکاربرد.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/04_dicts.py\" download=\"04_dicts.py\" rel=\"noopener noreferrer\">04_dicts.py</a></figure>\n<p>دیکشنری: کلید و مقدار، دسترسی امن با <code>get</code>، پیمایش.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/05_conditions.py\" download=\"05_conditions.py\" rel=\"noopener noreferrer\">05_conditions.py</a></figure>\n<p>شرط‌ها: مقایسه‌ها، <code>if/else</code>، زنجیرهٔ <code>elif</code> و دو خطای رایج.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/06_loops.py\" download=\"06_loops.py\" rel=\"noopener noreferrer\">06_loops.py</a></figure>\n<p>حلقه: پیمایش لیست، <code>range</code>، جمع‌کننده، شمارنده، <code>break</code> و حلقهٔ تو در تو.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/07_functions_and_imports.py\" download=\"07_functions_and_imports.py\" rel=\"noopener noreferrer\">07_functions_and_imports.py</a></figure>\n<p>تابع و <code>import</code>: تعریف، پارامتر، <code>return</code> و ماژول‌های استاندارد.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/08_tracebacks.py\" download=\"08_tracebacks.py\" rel=\"noopener noreferrer\">08_tracebacks.py</a></figure>\n<p>خواندن خطا: هفت خطای پرتکرار، با کدی که هر کدام را عمداً می‌سازد.</p>\n<figure data-file=\"file\" data-kind=\"file\"><a href=\"/course/session-1/pyramid_starter.py\" download=\"pyramid_starter.py\" rel=\"noopener noreferrer\">pyramid_starter.py</a></figure>\n<p>شروع آزمایشگاه: سطح ۱ تا ۳ حل شده، جای فرمول‌های سطح ۴ با <code>TODO</code> خالی است.</p>\n<h2>پایان جلسه و قدم بعدی</h2>\n<p>کلاس با یک تیزر کوتاه از Kilo Code و بعد جمع‌بندی تمام شد: از «کامپیوتر چطور کار می‌کند» تا هرمی که خودمان ساختیم. مهم‌ترین چیزی که در این جلسه تمرین کردیم، خودِ پایتون نبود؛ عادت «حدس بزن، اجرا کن، بخوان، اصلاح کن» بود.</p>\n<p>اگر <code>if</code> و <code>for</code> برایتان هنوز لق است، نوشتهٔ بعدی همین‌جا برای شماست: <a href=\"/blog/python-if-and-for-beginners\" rel=\"noopener noreferrer\">if و for در پایتون، برای کسی که تازه شروع کرده</a>. آنجا بدون عجله و با مثال‌های کوتاه، تصمیم‌گرفتن و تکرار را از صفر مرور کرده‌ایم.</p>",
  },
  {
    slug: "python-if-and-for-beginners",
    title: "if و for در پایتون، برای کسی که تازه شروع کرده",
    excerpt: "اگر فقط متغیر و print بلد هستید، همین‌جا با مثال‌های ساده یاد می‌گیرید چطور با if تصمیم بگیرید و با for کارهای تکراری را به کامپیوتر بسپارید.",
    author: "استودیو کدولوژی",
    tags: ["پایتون", "آموزش برنامه‌نویسی", "مبتدی"],
    coverUrl: "/images/blog/cover-python-if-for.svg",
    publishedAt: "2026-11-07T10:00:00+03:30",
    contentHtml: "<p>این نوشته برای کسی است که تازه پایتون را باز کرده: متغیر می‌سازد، <code>print</code> می‌زند و همین. اگر تا اینجا آمده‌اید، دو ابزار بعدی را می‌توانید همین‌جا یاد بگیرید: <code>if</code> که به برنامه اجازهٔ تصمیم‌گرفتن می‌دهد و <code>for</code> که کارهای تکراری را به کامپیوتر می‌سپارد.</p>\n<p>هیچ پیش‌نیازی جز همین دو چیز نیست و هر مثال را می‌توانید خط به خط در ترمینال یا فایل امتحان کنید. عادت خوبی که از همین اول بسازید: قبل از اجرا، حدس بزنید چه چیزی چاپ می‌شود؛ بعد اجرا کنید.</p>\n<h2>تصمیم گرفتن با if</h2>\n<p>تابه‌حال برنامه‌های ما یک مسیر داشتند: از بالا به پایین. اما خیلی وقت‌ها برنامه باید بسته به موقعیت تصمیم بگیرد: نمره کافی بود یا نه، کاربر بزرگسال بود یا نه، عدد منفی بود یا مثبت. برای همین <code>if</code> هست.</p>\n<pre data-language=\"python\"><code>score = 14\n\nif score &gt;= 10:\n    print(\"قبول\")</code></pre>\n<p>این کد را بخوانید: «اگر <code>score</code> بزرگ‌تر یا مساوی ۱۰ بود، این خط را چاپ کن.» دو چیز در ظاهرش مهم است:</p>\n<ul>\n<li>آخر خط <code>if</code> یک <strong>دونقطه</strong> (<code>:</code>) می‌آید. بدون آن، پایتون <code>SyntaxError</code> می‌دهد.</li>\n<li>خط بعدی <strong>تو رفته</strong> است؛ یعنی با چند فاصله (معمولاً ۴) جلوتر نوشته شده. پایتون از همین تو رفتگی می‌فهمد کدام خط «داخل» شرط است و کدام خط بیرون آن.</li>\n</ul>\n<p>اگر شرط درست نباشد چه؟ هیچ اتفاقی نمی‌افتد و برنامه به خط بعد می‌رود. برنامه متوقف نمی‌شود. برای همین وقتی شرط برقرار نیست معمولاً می‌خواهیم کار دیگری بکنیم؛ آن کار مال <code>else</code> است.</p>\n<pre data-language=\"python\"><code>score = 7\n\nif score &gt;= 10:\n    print(\"قبول\")\nelse:\n    print(\"نیاز به تلاش بیشتر\")</code></pre>\n<p><code>else</code> هیچ شرطی نمی‌گیرد؛ فقط «وگرنه». هم‌تراز <code>if</code> نوشته می‌شود، دونقطه دارد و بدنهٔ خودش را با تو رفتگی نگه می‌دارد.</p>\n<h3>عملگرهای مقایسه</h3>\n<p>داخل شرط، همیشه یک مقایسه داریم که نتیجه‌اش یا <code>True</code> است یا <code>False</code>. شش عملگر کافی است:</p>\n<table><thead><tr><th>عملگر</th><th>یعنی</th><th>مثال</th><th>نتیجه</th></tr></thead><tbody><tr><td><code>==</code></td><td>مساوی است</td><td><code>3 == 3</code></td><td><code>True</code></td></tr><tr><td><code>!=</code></td><td>مساوی نیست</td><td><code>3 != 4</code></td><td><code>True</code></td></tr><tr><td><code>&gt;</code></td><td>بزرگ‌تر از</td><td><code>5 &gt; 9</code></td><td><code>False</code></td></tr><tr><td><code>&lt;</code></td><td>کوچک‌تر از</td><td><code>5 &lt; 9</code></td><td><code>True</code></td></tr><tr><td><code>&gt;=</code></td><td>بزرگ‌تر یا مساوی</td><td><code>10 &gt;= 10</code></td><td><code>True</code></td></tr><tr><td><code>&lt;=</code></td><td>کوچک‌تر یا مساوی</td><td><code>10 &lt;= 9</code></td><td><code>False</code></td></tr></tbody></table>\n<div data-callout=\"warning\" data-callout-title=\"= با == فرق دارد\"><p data-callout-title>= با == فرق دارد</p><div data-callout-body><p>یک <code>=</code> مقدار می‌دهد (<code>score = 14</code>) و دو <code>==</code> مقایسه می‌کند (<code>score == 14</code>). اگر داخل <code>if</code> اشتباهی <code>=</code> بنویسید، پایتون با <code>SyntaxError</code> جلوی شما را می‌گیرد — که خوب است، ولی بهتر است از اول درست تایپ کنید.</p></div></div>\n<h3>چند شرط پشت سر هم: elif</h3>\n<p>وقتی بیشتر از دو حالت داریم، <code>if/else</code> کافی نیست. <code>elif</code> یعنی «وگرنه اگر»:</p>\n<pre data-language=\"python\"><code>score = 17\n\nif score &gt;= 18:\n    print(\"عالی\")\nelif score &gt;= 14:\n    print(\"خوب\")\nelif score &gt;= 10:\n    print(\"قبول\")\nelse:\n    print(\"نیاز به تلاش بیشتر\")</code></pre>\n<p><strong>ترتیب مهم است.</strong> پایتون از بالا می‌خواند و اولین شرطی که درست باشد را اجرا می‌کند، بعد از کل زنجیره بیرون می‌رود و بقیه را حتی نگاه نمی‌کند. برای نمرهٔ ۱۷، شرط دوم (۱۴ به بالا) درست است، پس «خوب» چاپ می‌شود و بقیه نادیده می‌ماند.</p>\n<p>حالا همین زنجیره را با ترتیب اشتباه تصور کنید: اگر <code>score &gt;= 10</code> را اول می‌نوشتیم، حتی نمرهٔ ۱۹ هم «قبول» می‌شد. پس شرط‌های سخت‌تر و محدودتر را بالاتر بنویسید.</p>\n<h3>ترکیب شرط‌ها: and، or، not</h3>\n<p>گاهی یک تصمیم به دو چیز بستگی دارد. <code>and</code> می‌گوید هر دو باید درست باشند، <code>or</code> می‌گوید یکی کافی است و <code>not</code> نتیجه را برعکس می‌کند:</p>\n<pre data-language=\"python\"><code>age = 20\nhas_card = True\n\nif age &gt;= 18 and has_card:\n    print(\"می‌توانی وارد شوی\")\n\nif age &lt; 12 or age &gt; 65:\n    print(\"تخفیف داری\")\n\nif not has_card:\n    print(\"اول کارت بگیر\")</code></pre>\n<p>نکتهٔ کوچک: <code>True</code> و <code>False</code> در پایتون با حرف بزرگ شروع می‌شوند. <code>true</code> با حرف کوچک یک نام ناشناخته است و <code>NameError</code> می‌دهد.</p>\n<h3>ورودی همیشه متن است</h3>\n<p>یک تله که تقریباً همهٔ تازه‌کارها در آن می‌افتند: <code>input()</code> همیشه <strong>متن</strong> برمی‌گرداند، حتی وقتی کاربر عدد تایپ کرده باشد. پس این کد خطا می‌دهد:</p>\n<pre data-language=\"python\"><code>age = input(\"سنت؟ \")   # \"20\" است، نه 20\nif age &gt;= 18:          # TypeError\n    print(\"بزرگسال\")</code></pre>\n<p>راه‌حل، تبدیل صریح است:</p>\n<pre data-language=\"python\"><code>age = int(input(\"سنت؟ \"))\n\nif age &gt;= 18:\n    print(\"بزرگسال\")</code></pre>\n<p>و اگر کاربر چیزی تایپ کند که عدد نیست، <code>int()</code> هم خطا می‌دهد؛ فعلاً همین کافی است که بدانید تبدیل لازم است.</p>\n<h3>خطاهای رایج</h3>\n<ol>\n<li>فراموش کردن دونقطهٔ آخر <code>if</code>، <code>elif</code> یا <code>else</code>.</li>\n<li>تو رفتگی نامنظم: خط‌های یک بلوک باید دقیقاً یک اندازه جلو باشند. اگر یک خط ۴ فاصله و خط بعد ۲ فاصله داشته باشد، <code>IndentationError</code> می‌گیرید.</li>\n<li>نوشتن <code>=</code> به‌جای <code>==</code> داخل شرط.</li>\n<li>مقایسهٔ مستقیم <code>input()</code> با عدد، بدون <code>int()</code>.</li>\n<li>تایپ اعداد با صفحه‌کلید فارسی: <code>۱۸</code> برای پایتون عدد نیست و <code>SyntaxError</code> می‌دهد.</li>\n</ol>\n<h3>تمرین</h3>\n<ol>\n<li>برنامه‌ای بنویسید که سن را بگیرد و بگوید «بزرگسال» یا «کودک» (مرز: ۱۸).</li>\n<li>برنامه‌ای بنویسید که سه نمره بگیرد و معدلشان را چاپ کند، بعد بگوید قبول است یا نه (مرز: ۱۰).</li>\n<li>با <code>and</code> شرطی بنویسید که فقط وقتی هم سن بالای ۱۸ است و هم کارت دارند، اجازهٔ ورود بدهد.</li>\n</ol>\n<h2>تکرار با for</h2>\n<p>فرض کنید می‌خواهید پنج بار یک جمله چاپ کنید. راه اول این است:</p>\n<pre data-language=\"python\"><code>print(\"سلام\")\nprint(\"سلام\")\nprint(\"سلام\")\nprint(\"سلام\")\nprint(\"سلام\")</code></pre>\n<p>کار می‌کند، ولی اگر ۵۰۰ بار لازم بود؟ اینجاست که حلقه وارد می‌شود. با <code>for</code> همان کار این‌طور نوشته می‌شود:</p>\n<pre data-language=\"python\"><code>for i in range(5):\n    print(\"سلام\")</code></pre>\n<p>ساختارش سه تکه دارد: کلمهٔ <code>for</code>، یک نام موقت (<code>i</code>) که هر دور مقدار می‌گیرد، و <code>in range(5)</code> که می‌گوید «این کار را برای این مقادیر تکرار کن». مثل <code>if</code>، دونقطه و تو رفتگی هم لازم است.</p>\n<h3>range دقیقاً چه می‌کند؟</h3>\n<p><code>range(5)</code> پنج عدد می‌دهد: <code>0</code>، <code>1</code>، <code>2</code>، <code>3</code>، <code>4</code>. یعنی از صفر شروع می‌کند و عدد آخر (<code>5</code>) را حساب نمی‌کند. دو شکل دیگرش هم پرکاربرد است:</p>\n<table><thead><tr><th>نوشتار</th><th>عددها</th><th>توضیح</th></tr></thead><tbody><tr><td><code>range(5)</code></td><td>0, 1, 2, 3, 4</td><td>از صفر تا قبل از ۵</td></tr><tr><td><code>range(1, 6)</code></td><td>1, 2, 3, 4, 5</td><td>از ۱ تا قبل از ۶</td></tr><tr><td><code>range(2, 11, 2)</code></td><td>2, 4, 6, 8, 10</td><td>با گام ۲، از ۲ تا قبل از ۱۱</td></tr><tr><td><code>range(5, 0, -1)</code></td><td>5, 4, 3, 2, 1</td><td>شمارش معکوس</td></tr></tbody></table>\n<p>وقتی <code>i</code> را چاپ کنید، همه چیز روشن می‌شود:</p>\n<pre data-language=\"python\"><code>for i in range(1, 6):\n    print(i)</code></pre>\n<p>خروجی: <code>1</code>، <code>2</code>، <code>3</code>، <code>4</code>، <code>5</code> — هر کدام در یک خط. حالا می‌توانید <code>i</code> را جای دیگری هم استفاده کنید:</p>\n<pre data-language=\"python\"><code>for i in range(1, 6):\n    print(i, \"*\" * i)</code></pre>\n<p>این همان ایده‌ای است که در آزمایشگاه هرم استفاده کردیم: حلقه می‌شمارد و متن را در آن عدد ضرب می‌کنیم تا شکل ساخته شود.</p>\n<h3>روی یک لیست بچرخید</h3>\n<p>حلقه فقط برای عدد نیست؛ می‌تواند اعضای یک لیست را یکی‌یکی بردارد:</p>\n<pre data-language=\"python\"><code>cities = [\"Tehran\", \"Ahvaz\", \"Tabriz\"]\n\nfor city in cities:\n    print(\"شهر:\", city)</code></pre>\n<p>این‌جا <code>city</code> هر دور یکی از اعضای لیست می‌شود؛ لازم نیست چیزی بشماریم. همین شکل را با دیکشنری هم داریم:</p>\n<pre data-language=\"python\"><code>pm25 = {\"Tehran\": 48, \"Ahvaz\": 72}\n\nfor city, value in pm25.items():\n    print(city, value)</code></pre>\n<h3>الگوی جمع‌زدن</h3>\n<p>پرکاربردترین الگوی حلقه: یک متغیر جمع بیرون حلقه می‌سازیم و هر دور چیزی به آن اضافه می‌کنیم.</p>\n<pre data-language=\"python\"><code>numbers = [4, 7, 1, 9]\ntotal = 0\n\nfor n in numbers:\n    total = total + n\n\nprint(total)</code></pre>\n<p>چرا <code>total = 0</code> بیرون حلقه است؟ اگر داخل حلقه بنویسید، هر دور از صفر شروع می‌شود و آخرش فقط عدد آخر را دارید — یکی از رایج‌ترین اشتباه‌ها.</p>\n<p>شمارش هم همین شکل را دارد، فقط با <code>+ 1</code>: یک <code>count = 0</code> بیرون و <code>count = count + 1</code> داخل، برای شمردن این‌که چند عضو شرطی را دارند.</p>\n<h3>حلقه داخل حلقه</h3>\n<p>حلقه‌ها می‌توانند تو در تو باشند. جدول ضرب کوچک، بهترین مثال است:</p>\n<pre data-language=\"python\"><code>for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j, end=\" \")\n    print()</code></pre>\n<p>حلقهٔ بیرونی سه دور می‌زند؛ در هر دور، حلقهٔ داخلی کامل اجرا می‌شود. <code>end=\" \"</code> می‌گوید بعد از هر چاپ به خط جدید نرو و فقط یک فاصله بگذار، و <code>print()</code> خالی در آخر، خط را می‌شکند. نتیجه یک جدول ۳×۳ می‌شود.</p>\n<h3>break و continue</h3>\n<p>دو دستور کوچک که کنترل حلقه را در دست شما می‌گذارند: <code>break</code> حلقه را کامل قطع می‌کند و <code>continue</code> فقط این دور را رد می‌کند و می‌رود دور بعد.</p>\n<pre data-language=\"python\"><code>for n in numbers:\n    if n == 9:\n        break      # به محض دیدن ۹، حلقه تمام\n    print(n)</code></pre>\n<p>لازم نیست از همین اول از این دو استفاده کنید؛ فقط بدانید وجود دارند.</p>\n<h3>خطاهای رایج</h3>\n<ol>\n<li>فراموش کردن دونقطه یا تو رفتگی — دقیقاً مثل <code>if</code>.</li>\n<li>چاپ کردن نتیجه بیرون حلقه، وقتی انتظار داشتید هر دور چاپ شود (یا برعکس).</li>\n<li>ساختن متغیر جمع داخل حلقه به‌جای بیرون آن.</li>\n<li>انتظار این‌که <code>range(1, 5)</code> تا ۵ بشمارد؛ عدد آخر حساب نمی‌شود.</li>\n<li>جا انداختن <code>int()</code> وقتی با <code>input()</code> عدد می‌گیرید.</li>\n</ol>\n<h3>تمرین</h3>\n<ol>\n<li>اعداد ۱ تا ۱۰ را با <code>for</code> چاپ کنید.</li>\n<li>جمع اعداد ۱ تا ۱۰۰ را حساب کنید و چاپ کنید.</li>\n<li>لیستی از اسم شهرها بسازید و فقط شهرهایی را چاپ کنید که بیش از ۵ حرف دارند (<code>len()</code>).</li>\n<li>جدول ضرب ۵×۵ را با دو حلقه چاپ کنید.</li>\n<li>همان هرم آزمایشگاه را با <code>for</code> بسازید: در هر خط <code>n - i</code> فاصله و <code>2 * i - 1</code> ستاره.</li>\n</ol>\n<h2>جمع‌بندی</h2>\n<table><thead><tr><th>ابزار</th><th>برای چه</th><th>کلیدش</th></tr></thead><tbody><tr><td><code>if</code></td><td>انتخاب بین راه‌ها</td><td>دونقطه + تو رفتگی + شرط مقایسه‌ای</td></tr><tr><td><code>elif</code> / <code>else</code></td><td>حالت‌های دیگر</td><td>ترتیب شرط‌ها از خاص به عام</td></tr><tr><td><code>and</code> / <code>or</code> / <code>not</code></td><td>ترکیب شرط‌ها</td><td>هر دو / یکی / برعکس</td></tr><tr><td><code>for</code></td><td>تکرار</td><td><code>range</code> یا یک لیست</td></tr><tr><td>حلقهٔ تو در تو</td><td>جدول و شکل</td><td>حلقهٔ داخلی در هر دور کامل اجرا می‌شود</td></tr></tbody></table>\n<p>اگر این‌ها جا افتاد، قدم بعدی تابع است: بسته‌بندی کاری که چند بار انجامش می‌دهید، تا با یک خط صدایش بزنید. در یادداشت جلسهٔ کارگاه، هم <code>if</code> و <code>for</code> با مثال بیشتری آمده و هم آزمایشگاه هرم قدم‌به‌قدم توضیح داده شده: <a href=\"/blog/python-workshop-session-1\" rel=\"noopener noreferrer\">کارگاه پایتون، جلسهٔ ۱: از print تا هرم</a>.</p>",
  },
];
