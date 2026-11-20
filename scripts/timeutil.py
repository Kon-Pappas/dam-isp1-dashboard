"""Time handling.

DAM and ISP1 files use the market day in CET/CEST (Europe/Brussels): interval
number SORT starts at 00:00 CET. Greek clock time is always CET + 1 hour.
On the two daylight-saving days the day has 92 or 100 intervals (23 or 25 h).
The key of an interval is therefore (date, SORT); UTC is derived from it.
"""
import datetime as dt
from zoneinfo import ZoneInfo

BRU = ZoneInfo("Europe/Brussels")
ATH = ZoneInfo("Europe/Athens")
UTC = dt.timezone.utc


def expected_intervals(day: dt.date) -> int:
    start = dt.datetime.combine(day, dt.time(0, 0), tzinfo=BRU).astimezone(UTC)
    end = dt.datetime.combine(day + dt.timedelta(days=1), dt.time(0, 0), tzinfo=BRU).astimezone(UTC)
    return int((end - start).total_seconds() // 900)


def day_slots(day: dt.date, n: int):
    """UTC start of each of the n intervals of the market day."""
    start = dt.datetime.combine(day, dt.time(0, 0), tzinfo=BRU).astimezone(UTC)
    return [start + dt.timedelta(minutes=15 * i) for i in range(n)]


def clock_labels(utcs):
    """Greek clock time (HH:MM) of each interval start."""
    return [u.astimezone(ATH).strftime("%H:%M") for u in utcs]


def cet_wall(utcs):
    """CET/CEST wall-clock of each interval, to compare with the file headers."""
    return [u.astimezone(BRU).replace(tzinfo=None) for u in utcs]


def now_athens() -> dt.datetime:
    return dt.datetime.now(ATH).replace(microsecond=0)
