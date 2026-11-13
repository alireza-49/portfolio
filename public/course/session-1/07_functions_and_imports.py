"""جلسهٔ ۱ — تابع و import: تعریف، پارامتر، return و ماژول‌های استاندارد."""

# ==== ۱. چرا تابع ====================================================
def aqi_category(pm25):
    """دستهٔ کیفیت هوا برای یک مقدار PM2.5."""
    if pm25 < 15:
        return "Good"
    elif pm25 < 35:
        return "Moderate"
    elif pm25 < 75:
        return "Unhealthy for sensitive groups"
    return "Unhealthy"

# یک بار بنویس، هر جا استفاده کن.
print(aqi_category(12))     # Good
print(aqi_category(48.3))   # Unhealthy for sensitive groups
print(aqi_category(90))     # Unhealthy

# ==== ۲. پارامتر و آرگومان ===========================================
def greet(city):
    print("Studying air quality in", city)

greet("Tehran")
greet("Ahvaz")
# city اسم پارامتر است (داخل تعریف)؛ "Tehran" آرگومان است (هنگام صدا زدن).

# ==== ۳. return در برابر print ======================================
def double_print(x):
    print(x * 2)

def double_return(x):
    return x * 2

r1 = double_print(5)    # چاپ می‌کند: 10
r2 = double_return(5)   # برمی‌گرداند

print(r1)               # None  ← در این تابع return جا افتاده
print(r2)               # 10

# اگر None دیدید، تقریباً همیشه یعنی return جا افتاده است.

# ==== ۴. مقدار پیش‌فرض، دامنه، مستند ================================
def report(city, unit="ug/m3"):
    """یک خط گزارش برمی‌گرداند."""
    return f"{city}: 48.3 {unit}"

print(report("Tehran"))
print(report("Tehran", "mg/m3"))

def scope_demo():
    inside = "only here"
    return inside

print(scope_demo())
# print(inside)   →  NameError: name 'inside' is not defined
# متغیری که داخل تابع تعریف شود، بیرون دیده نمی‌شود.

# ==== ۵. import ======================================================
import math
print(math.sqrt(16), math.pi)

from random import randint
print(randint(1, 6))

import statistics
daily = [64, 88, 45, 102, 51, 77, 39]
print(statistics.mean(daily), statistics.median(daily))

# import یعنی «کد کسی دیگر را بیاور».

# ==== ۶. ترکیب: حلقه + تابع + دیکشنری ==============================
stations = {"Tehran": 48.3, "Isfahan": 61.2, "Ahvaz": 83.7}
for city, value in stations.items():
    print(city, "->", aqi_category(value))

# ==== تمرین ==========================================================
# ۱) تابعی بنویسید که لیستی از اعداد بگیرد و میانگین را return کند.
# ۲) تابعی بنویسید که درصد روزهای بالای حد را چاپ کند (نه return).
# ۳) aqi_category(90) چه می‌دهد؟ چرا؟
