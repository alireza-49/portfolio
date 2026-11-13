"""جلسهٔ ۱ — شرط‌ها: مقایسه، if/else، زنجیرهٔ elif و دو خطای رایج."""

# ==== ۱. مقایسه همیشه True یا False می‌دهد ==========================
pm25 = 48.3
print(pm25 > 35)        # True
print(pm25 <= 75)       # True
print(pm25 == 48.3)     # True  ← دو مساوی برای مقایسه

# ==== ۲. if / else ===================================================
if pm25 > 75:
    print("Above the national 24h limit")
else:
    print("Below the limit")

# دو چیز مقدس است: دونقطه و تو رفتگی (۴ فاصله).

# ==== ۳. زنجیرهٔ elif ================================================
if pm25 < 15:
    category = "Good (WHO guideline)"
elif pm25 < 35:
    category = "Moderate"
elif pm25 < 75:
    category = "Unhealthy for sensitive groups"
else:
    category = "Unhealthy"

print("category:", category)

# فقط اولین شرط درست اجرا می‌شود؛ ترتیب مهم است.
# اگر pm25 < 75 را اول بنویسید، مقدار ۱۲ هم در آن گیر می‌کند.

# ==== ۴. and / or / not / in =========================================
is_high = pm25 > 35
has_data = True

print(is_high and has_data)     # True
print(is_high or has_data)      # True
print(not is_high)              # False
print("Tehran" in ["Tehran", "Isfahan"])   # True

# ==== ۵. دو خطای رایج ================================================
# if pm25 = 50:            →  SyntaxError  (= یعنی «بگذار»، == یعنی «برابر است؟»)
# if pm25 > 50             →  SyntaxError  (دونقطه جا افتاده)
#     print("high")

# ==== چک‌پوینت =======================================================
# مقدار pm25 را به ۱۲، بعد ۳۰، بعد ۹۰ تغییر دهید و قبل از اجرا بگویید
# کدام دسته چاپ می‌شود.
for value in (12, 30, 90):
    if value < 15:
        print(value, "-> Good")
    elif value < 35:
        print(value, "-> Moderate")
    elif value < 75:
        print(value, "-> Sensitive groups")
    else:
        print(value, "-> Unhealthy")
