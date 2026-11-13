"""جلسهٔ ۱ — لیست: «ستون جدول»."""

# ==== ۱. ساخت و ایندکس ==============================================
cities = ["Tehran", "Isfahan", "Tabriz", "Ahvaz", "Shiraz"]
print(cities[0])      # Tehran  ← شمارش از صفر
print(cities[-1])     # Shiraz  ← از آخر
print(len(cities))    # 5
print(cities[0:3])    # سه تای اول

# بیرون از محدوده:
# print(cities[5])  →  IndexError: list index out of range

# ==== ۲. تغییر لیست ==================================================
cities.append("Qom")
cities[1] = "Esfahan"
cities.remove("Tabriz")
print(cities)

# ==== ۳. آمار ساده ===================================================
daily_pm25 = [64, 88, 45, 102, 51, 77, 39]
print(sum(daily_pm25) / len(daily_pm25))   # میانگین
print(max(daily_pm25), min(daily_pm25))
print(sorted(daily_pm25))
print(sorted(daily_pm25, reverse=True))

# ==== ۴. متدهای پرکاربرد ============================================
print(len(daily_pm25))
print(daily_pm25.count(51))
print(daily_pm25.index(102))
print(",".join(cities))            # متن از لیست
print("Tehran, Qom".split(", "))   # لیست از متن

# ==== پیش‌بینی =======================================================
# قبل از اجرا جواب بدهید:
print(cities[0])        # ؟
print(cities[-1])       # ؟
print(len(cities))      # ؟

# ==== تمرین ==========================================================
# ۱) میانگین [12, 18, 25, 30] را بدون حلقه حساب کنید.
# ۲) شهر شیراز را با cities.append اضافه کنید و لیست را چاپ کنید.
# ۳) لیست را نزولی مرتب کنید و بگویید بزرگ‌ترین مقدار کدام است.
