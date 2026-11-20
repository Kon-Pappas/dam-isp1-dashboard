"""Downloads. Remote = HEnEx + ADMIE API; Local = a folder of files (tests, offline)."""
import datetime as dt
import time
from collections import namedtuple
from pathlib import Path

from . import config as C

FileRef = namedtuple("FileRef", "path published")


def pick_admie_file(items, day, prefix=None):
    """From the ADMIE API list choose the latest published file that covers exactly `day`."""
    ds = day.strftime("%d.%m.%Y")
    cand = [i for i in items if i.get("file_fromdate") == ds and i.get("file_todate") == ds]
    if prefix:
        cand = [i for i in cand if str(i.get("file_description", "")).startswith(prefix)]
    if not cand:
        return None
    cand.sort(key=lambda i: dt.datetime.strptime(i["file_published"], "%d.%m.%Y %H:%M"))
    return cand[-1]


class Remote:
    def __init__(self, use_cache=False):
        import requests
        self.s = requests.Session()
        self.s.headers["User-Agent"] = C.USER_AGENT
        self.use_cache = use_cache

    def _get(self, url, params=None):
        last = None
        for k in range(C.HTTP_RETRIES):
            try:
                r = self.s.get(url, params=params, timeout=C.HTTP_TIMEOUT)
                if r.status_code in (403, 404):
                    return None
                if r.status_code >= 500:
                    raise RuntimeError(f"HTTP {r.status_code}")
                r.raise_for_status()
                return r
            except Exception as e:      # network problems are retried
                last = e
                time.sleep(2 ** k)
        raise RuntimeError(f"download failed: {url}: {last}")

    def _download(self, url, name, params=None):
        C.CACHE_DIR.mkdir(parents=True, exist_ok=True)
        p = C.CACHE_DIR / name
        if self.use_cache and p.exists():
            return p
        r = self._get(url, params)
        if r is None or not r.content.startswith(b"PK"):   # xlsx is a zip; an HTML page means "not there"
            return None
        p.write_bytes(r.content)
        return p

    def dam(self, day):
        name = f"{day:%Y%m%d}_EL-DAM_Results_EN_v01.xlsx"
        p = self._download(C.ENEX_URL.format(ymd=f"{day:%Y%m%d}"), name)
        return FileRef(p, None) if p else None

    def _admie(self, day, category, prefix=None):
        r = self._get(C.ADMIE_API, {"dateStart": day.isoformat(), "dateEnd": day.isoformat(), "FileCategory": category})
        if r is None:
            return None
        item = pick_admie_file(r.json(), day, prefix)
        if not item:
            return None
        url = item["file_path"]
        p = self._download(url, url.rsplit("/", 1)[-1])
        return FileRef(p, item["file_published"]) if p else None

    def isp1(self, day):
        return self._admie(day, C.CAT_ISP1, "ISP1")

    def crete(self, day):
        return self._admie(day, C.CAT_CRETE)


class Local:
    def __init__(self, folder):
        self.f = Path(folder)

    def _one(self, name):
        p = self.f / name
        return FileRef(p, None) if p.exists() else None

    def dam(self, day):
        return self._one(f"{day:%Y%m%d}_EL-DAM_Results_EN_v01.xlsx")

    def isp1(self, day):
        return self._one(f"{day:%Y%m%d}_ISP1ISPResults_01.xlsx")

    def crete(self, day):
        return self._one(f"{day:%Y%m%d}_DailyDispatchOfCreteElectricalSystem_01.xlsx")
