"""جلسهٔ ۱ — حلقهٔ for: پیمایش، range، جمع‌کننده، break و حلقهٔ تو در تو."""

# ==== ۱. پیمایش لیست =================================================
cities = ["Tehran", "Isfahan", "Tabriz"]
for city in cities:
    print("city:", city)

# ==== ۲. range =======================================================
for i in range(5):          # 0 1 2 3 4
    print(i)

for i in range(1, 6):       # 1 2 3 4 5
    print(i)

for i in range(0, 10, 2):   # 0 2 4 6 8
    print(i)

# range(5) از صفر شروع می‌کند و پنج عدد می‌دهد؛ خودِ ۵ داخل نیست.

# ==== ۳. الگوی جمع‌کننده / شمارنده / بیشینه ==========================
daily = [64, 88, 45, 102, 51, 77, 39]

total = 0
for v in daily:
    total = total + v
print("mean =", total / len(daily))

count = 0
for v in daily:
    if v > 75:
        count = count + 1
print("days above 75:", count)

largest = daily[0]
for v in daily:
    if v > largest:
        largest = v
print("largest:", largest)

# الگو: قبل از حلقه صفر، داخل حلقه جمع، بعد از حلقه استفاده.

# ==== ۴. دیکشنری در حلقه ============================================
pm25_by_city = {"Tehran": 48.3, "Isfahan": 61.2, "Ahvaz": 83.7}
for name, value in pm25_by_city.items():
    print(name, "->", value)

# ==== ۵. break و continue ============================================
for v in daily:
    if v > 100:
        print("first above 100:", v)
        break

for v in daily:
    if v < 50:
        continue
    print("above 50:", v)

# break از حلقه بیرون می‌آید؛ continue این دور را رد می‌کند.
# بیشتر وقت‌ها if کافی است؛ از break/continue کم استفاده کنید.

# ==== ۶. حلقهٔ تو در تو =============================================
for row in range(3):
    for col in range(3):
        print("*", end="")
    print()

# دو حلقه، دو شمارش مستقل: یکی ردیف، یکی ستون.
# end="" یعنی بعد از چاپ، خط جدید نزن؛ print() خالی خط را تمام می‌کند.

# ==== ۷. فهرست‌سازی (list comprehension) =============================
above = [v for v in daily if v > 60]
print(above)                    # [64, 88, 102, 77]
print([v * 2 for v in daily])   # هر عضو دو برابر

# ==== تمرین ==========================================================
# ۱) تعداد روزهای زیر ۵۰ را با شمارنده حساب کنید.
# ۲) هرم ۵ خطی را با همین دو حلقهٔ تودرتو بسازید (بخش ۱۰ همین را کامل می‌کند).
