# جزوهٔ یک‌صفحه‌ای — کارگاه پایتون، جلسهٔ ۱

> این برگه برای چسباندن کنار مانیتور است. اگر فقط یک چیز از جلسه یادتان بماند، همین باشد: **حدس بزن، اجرا کن، بخوان، اصلاح کن.**

## ۱. نصب و تأیید

| کار | دستور |
|---|---|
| تأیید نسخه | `python --version` |
| آزمون سریع | `python -c "print('setup is working')"` |
| اجرای فایل | `python hello.py` |

دو تلهٔ نصب:

1. تیک **Add python.exe to PATH** را بزنید؛ اگر نزدید، `python` در ترمینال شناخته نمی‌شود.
2. **Anaconda** و **Microsoft Store** نصب نکنید؛ نسخهٔ python.org ساده‌تر است.

در VS Code اگر دکمهٔ ▶ خاکستری بود: `Ctrl+Shift+P` → `Python: Select Interpreter` → Python 3.12.

## ۲. چهار نوع امروز

| نوع | نمونه | کاربرد |
|---|---|---|
| `str` | `"Tehran"` | متن |
| `int` | `48` | عدد صحیح |
| `float` | `48.3` | عدد اعشاری |
| `bool` | `True` | درست/غلط |

`type(x)` نوع را نشان می‌دهد. عدد را با صفحه‌کلید فارسی تایپ نکنید؛ پایتون آن را عدد نمی‌شناسد.

## ۳. عملگرها

```python
10 / 4    # 2.5   تقسیم همیشه اعشاری است
10 // 4   # 2     تقسیم صحیح
10 % 4    # 2     باقی‌مانده
10 ** 4   # 10000 توان
int("42") + 1        # 43
int(3.99)            # 3   برش، نه گرد کردن
```

`0.1 + 0.2` می‌شود `0.30000000000000004`؛ کامپیوتر اعشار را دقیق نگه نمی‌دارد.

## ۴. input و f-string

```python
city = input("City: ")          # همیشه str
pm25 = float(input("PM2.5: "))  # تا تبدیل نکنید، جمع نمی‌شود
print(f"{city}: PM2.5 = {pm25:.1f} ug/m3")
```

## ۵. لیست = ستون جدول

```python
cities = ["Tehran", "Isfahan", "Tabriz"]
cities[0]      # Tehran (شمارش از صفر)
cities[-1]     # Tabriz (از آخر)
cities[0:2]    # برش
cities.append("Qom")
sum(daily) / len(daily)   # میانگین
```

## ۶. دیکشنری = ردیف جدول

```python
station = {"city": "Tehran", "pm25": 48.3}
station["pm25"] = 52.0            # به‌روزرسانی
station.get("so2", "not measured")  # دسترسی امن
for name, value in station.items(): ...
```

## ۷. شرط

```python
if pm25 < 15:
    category = "Good"
elif pm25 < 35:
    category = "Moderate"
else:
    category = "Unhealthy"
```

- دونقطه `:` و **تو رفتگی** جزو دستور است، نه تزئین.
- فقط اولین شرط درست اجرا می‌شود؛ **ترتیب** مهم است.
- `=` یعنی «بگذار»، `==` یعنی «برابر است؟».

## ۸. حلقه

```python
for city in cities: ...
for i in range(5): ...        # 0 1 2 3 4
for i in range(1, 6): ...     # 1 2 3 4 5
```

الگوی جمع‌کننده: **قبل از حلقه صفر، داخل حلقه جمع، بعد از حلقه استفاده.**

```python
total = 0
for v in daily:
    total = total + v
print(total / len(daily))
```

## ۹. تابع و import

```python
def aqi_category(pm25):
    """دستهٔ کیفیت هوا."""
    if pm25 < 15:
        return "Good"
    return "Unhealthy"

import math, statistics
```

`return` جواب را تحویل می‌دهد؛ `print` فقط بلند می‌گوید. اگر `None` دیدید، `return` جا افتاده است.

## ۱۰. خواندن traceback

از **پایین** شروع کنید:

```
Traceback (most recent call last):
  File "broken.py", line 3, in <module>
    print(cities[5])
IndexError: list index out of range
```

| خطا | یعنی |
|---|---|
| `SyntaxError` | جمله‌بندی غلط (`=` به‌جای `==`، دونقطهٔ جاافتاده) |
| `IndentationError` | تو رفتگی غلط |
| `NameError` | اسم ناشناس / تعریف‌نشده |
| `ValueError` | مقدار قابل تبدیل نیست (`int("48.3")`) |
| `IndexError` | بیرون از محدودهٔ لیست |
| `KeyError` | کلید در دیکشنری نیست |
| `TypeError` | این نوع را نمی‌پذیرم (`"a" + 1`) |

## ۱۱. فرمول هرم

برای `n` خط:

| خط `i` | فاصله | ستاره |
|---|---|---|
| ۱ | `n - 1` | `1` |
| ۲ | `n - 2` | `3` |
| ۳ | `n - 3` | `5` |
| i | `n - i` | `2 * i - 1` |

```python
def pyramid(n, star="*"):
    for i in range(1, n + 1):
        print(" " * (n - i) + star * (2 * i - 1))
```

## ۱۲. تکلیف

1. همهٔ فایل‌های کلاس را یک بار اجرا کنید و هر خطا را بلند بخوانید.
2. سطح ۴ و ۵ برگهٔ آزمایشگاه هرم را کامل کنید.
3. تابعی بنویسید که لیستی از اعداد بگیرد و میانگین را `return` کند (نه `print`).
