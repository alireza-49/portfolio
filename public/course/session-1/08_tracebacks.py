"""جلسهٔ ۱ — خواندن خطا: هفت خطای پرتکرار، با کدی که هر کدام را عمداً می‌سازد.

اجرا:
    python 08_tracebacks.py 3      # فقط خطای شمارهٔ ۳

هر تابع دقیقاً یک خطا می‌سازد. خطا را از پایین بخوانید:
آخرین خط = نوع خطا + توضیح؛ بالاتر = فایل، شمارهٔ خط و علامت ^.
"""

import sys


def syntax_error():
    # = یعنی «بگذار»، == یعنی «برابر است؟»
    # کد خراب عمداً داخل متن است: خطای جمله‌بندی هنگام exec رخ می‌دهد،
    # نه هنگام خواندن همین فایل (وگرنه هیچ‌کدام از نمونه‌ها اجرا نمی‌شد).
    source = "pm25 = 50\nif pm25 = 50:\n    print('high')\n"
    exec(source)             # SyntaxError


def indentation_error():
    source = "for i in range(3):\nprint(i)\n"
    exec(source)             # IndentationError


def name_error():
    print(pm_25)             # NameError: name 'pm_25' is not defined


def value_error():
    print(int("48.3"))       # ValueError: invalid literal for int() ...


def index_error():
    cities = ["Tehran", "Isfahan"]
    print(cities[5])         # IndexError: list index out of range


def key_error():
    station = {"city": "Tehran"}
    print(station["pm25"])   # KeyError: 'pm25'


def type_error():
    print("PM2.5: " + 48.3)  # TypeError: can only concatenate str ...


CASES = {
    1: syntax_error,
    2: indentation_error,
    3: name_error,
    4: value_error,
    5: index_error,
    6: key_error,
    7: type_error,
}


def main():
    if len(sys.argv) < 2:
        print("شمارهٔ خطا را بدهید: 1..7")
        print("  1 SyntaxError · 2 IndentationError · 3 NameError")
        print("  4 ValueError · 5 IndexError · 6 KeyError · 7 TypeError")
        return
    try:
        case = int(sys.argv[1])
    except ValueError:
        print("شماره باید عدد باشد.")
        return
    run = CASES.get(case)
    if not run:
        print("شمارهٔ نامعتبر؛ بین ۱ تا ۷ انتخاب کنید.")
        return
    run()


if __name__ == "__main__":
    main()


# ==== واژه‌نامهٔ پیام‌ها ==============================================
# not defined        → تعریف نشده
# invalid syntax     → جمله‌بندی غلط
# expected           → این‌جا چیزی کم است
# unsupported        → این نوع را نمی‌پذیرم
# out of range       → بیرون از محدوده
# indentation        → تو رفتگی
