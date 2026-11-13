"""جلسهٔ ۱ — دیکشنری: «ردیف جدول»."""

# ==== ۱. کلید و مقدار ================================================
station = {"city": "Tehran", "pm25": 48.3, "n_days": 30}

print(station["city"])      # Tehran
station["pm25"] = 52.0      # به‌روزرسانی
station["pm10"] = 91.4      # کلید جدید
print(station)

print(station.keys())
print(station.values())
print(station.items())

# ==== ۲. دسترسی امن ==================================================
print(station.get("so2", "not measured"))   # کلید نیست → مقدار پیش‌فرض
# station["so2"]  →  KeyError: 'so2'

print("so2" in station)     # False
print("pm25" in station)    # True

# ==== ۳. دیکشنری تودرتو =============================================
stations = {
    "Tehran": {"pm25": 48.3, "pm10": 91.4},
    "Ahvaz": {"pm25": 83.7, "pm10": 140.2},
}
print(stations["Ahvaz"]["pm10"])    # 140.2
print(len(stations))               # 2

# ==== ۴. پیمایش ======================================================
for name, values in stations.items():
    print(name, "->", values["pm25"])

# ==== پیش‌بینی =======================================================
# len(stations) چند است؟  stations["Ahvaz"]["pm25"] چه می‌دهد؟
# stations.get("Shiraz") چه برمی‌گرداند؟ (None)

# ==== تمرین ==========================================================
# ۱) شهر شیراز را با pm25 = 39.1 به stations اضافه کنید.
# ۲) همهٔ شهرهایی را چاپ کنید که pm25 آن‌ها بالای ۵۰ است.
