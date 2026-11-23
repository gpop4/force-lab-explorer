#!/usr/bin/env python3
"""
Download and optimize real educational photos for all 42 Physics Wonders in
Bounce, Zoom & Float from Wikipedia/Wikimedia Commons into
public/images/wonders/<wonderId>.jpg.

Bundling verified photos directly into public/images/ guarantees:
- Instant loading with zero broken images or hotlink/CORS issues
- Full offline / GitHub Pages reliability
"""

from __future__ import annotations

import concurrent.futures
import json
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "public" / "images" / "wonders"
MANIFEST_PATH = ROOT / "public" / "images" / "manifest.json"
USER_AGENT = "BounceZoomFloatExplorer/1.0 (https://github.com/gpop4/force-lab-explorer; educational kids physics app)"


def load_zones_from_ts() -> list[dict]:
    esbuild_bin = ROOT / "node_modules" / ".bin" / "esbuild"
    with tempfile.NamedTemporaryFile(suffix=".mjs", delete=False) as tmp:
        bundle_path = Path(tmp.name)
    try:
        subprocess.run(
            [
                str(esbuild_bin),
                str(ROOT / "src" / "data" / "zones.ts"),
                "--bundle",
                "--format=esm",
                f"--outfile={bundle_path}",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        res = subprocess.run(
            [
                "node",
                "-e",
                f"import('{bundle_path.as_uri()}').then(m => console.log(JSON.stringify(m.PHYSICS_ZONES)))",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return json.loads(res.stdout)
    finally:
        bundle_path.unlink(missing_ok=True)


def http_get(url: str, timeout: int = 20) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_summary_image_url(wiki_title: str) -> str | None:
    unquoted = urllib.parse.unquote(wiki_title)
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": unquoted,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": "900",
            "redirects": "1",
        }
    )
    api_url = f"https://en.wikipedia.org/w/api.php?{params}"
    data = json.loads(http_get(api_url).decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        thumb = page.get("thumbnail", {}).get("source")
        if thumb:
            return thumb

    rest_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki_title}"
    summary = json.loads(http_get(rest_url).decode("utf-8"))
    return summary.get("thumbnail", {}).get("source") or summary.get("originalimage", {}).get("source")


def fetch_one(wonder: dict) -> tuple[str, bool, str]:
    wonder_id = wonder["id"]
    out_path = IMAGES_DIR / f"{wonder_id}.jpg"
    if out_path.exists() and out_path.stat().st_size > 2000:
        return wonder_id, True, "cached"

    candidates = [wonder["wikiTitle"]] + list(wonder.get("wikiFallbacks", []))
    last_err = "No image found"

    for title in candidates:
        for attempt in range(1, 3):
            try:
                img_url = fetch_summary_image_url(title)
                if not img_url:
                    last_err = f"No image found for {title}"
                    break

                raw = http_get(img_url, timeout=25)
                with tempfile.NamedTemporaryFile(suffix=".img", delete=False) as tmp:
                    tmp_path = Path(tmp.name)
                    tmp_path.write_bytes(raw)

                try:
                    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
                    subprocess.run(
                        [
                            "/usr/bin/sips",
                            "-s",
                            "format",
                            "jpeg",
                            "-s",
                            "formatOptions",
                            "80",
                            "-Z",
                            "760",
                            str(tmp_path),
                            "--out",
                            str(out_path),
                        ],
                        check=True,
                        capture_output=True,
                    )
                finally:
                    tmp_path.unlink(missing_ok=True)

                if out_path.exists() and out_path.stat().st_size > 1500:
                    return wonder_id, True, f"{out_path.stat().st_size / 1024:.1f} KB ({title})"
            except Exception as exc:
                last_err = f"{title}: {exc}"
                time.sleep(1.5 * attempt)

    return wonder_id, False, last_err


def main() -> None:
    zones = load_zones_from_ts()
    wonders: list[dict] = []
    seen = set()
    for z in zones:
        for w in z["wonders"]:
            if w["id"] not in seen:
                seen.add(w["id"])
                wonders.append(w)

    print(f"Fetching photos for {len(wonders)} physics wonders...", flush=True)
    ok_map: dict[str, str] = {}
    failures: list[tuple[str, str]] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(fetch_one, w) for w in wonders]
        for idx, fut in enumerate(concurrent.futures.as_completed(futures), start=1):
            wid, ok, info = fut.result()
            if ok:
                ok_map[wid] = f"images/wonders/{wid}.jpg"
                print(f"  [{idx}/{len(wonders)}] ✓ {wid}.jpg ({info})", flush=True)
            else:
                failures.append((wid, info))
                print(f"  [{idx}/{len(wonders)}] ✗ {wid}: {info}", file=sys.stderr, flush=True)

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(ok_map, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"\nDone: {len(ok_map)}/{len(wonders)} photos saved to {IMAGES_DIR.relative_to(ROOT)}")
    if failures:
        print("Failures:", failures, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
