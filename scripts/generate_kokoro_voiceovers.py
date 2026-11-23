#!/usr/bin/env python3
"""
Generate all Bounce, Zoom & Float voiceovers locally using Kokoro-82M (kokoro-onnx),
an open-source, free neural TTS model with zero API keys or rate limits.

Usage:
  /tmp/kokoro-venv/bin/python scripts/generate_kokoro_voiceovers.py

Options:
  --voice af_heart   Kokoro voice (default: af_heart; also great: af_bella, af_sky, am_michael)
  --speed 0.86       Speaking speed (default: 0.86 — gentle storybook pace for 5-year-olds)
  --force            Overwrite existing .m4a files (default: only generate missing clips)
  --limit N          Only generate up to N clips (useful for testing)
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
from pathlib import Path

import numpy as np
import onnxruntime as ort
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_AUDIO_DIR = ROOT / "public" / "audio"
ZONES_DIR = PUBLIC_AUDIO_DIR / "zones"
WONDERS_DIR = PUBLIC_AUDIO_DIR / "wonders"
MANIFEST_PATH = PUBLIC_AUDIO_DIR / "manifest.json"

DEFAULT_MODEL_PATH = Path("/tmp/kokoro-models/kokoro-v1.0.onnx")
DEFAULT_VOICES_PATH = Path("/tmp/kokoro-models/voices-v1.0.bin")
DEFAULT_VOICE = "af_heart"
DEFAULT_SPEED = 0.86


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


KEEP_UPPER = {"ON", "OFF", "UP", "TV"}
CAPS_WORD_RE = re.compile(r"\b[A-Z]{2,}\b")


def clean_text(text: str) -> str:
    text = (
        text.replace("—", ", ")
        .replace("–", ", ")
        .replace("’", "'")
        .replace("“", '"')
        .replace("”", '"')
        .replace("3-2-1", "three, two, one")
        .replace("V-shapes", "V shapes")
    )
    return CAPS_WORD_RE.sub(
        lambda m: m.group(0) if m.group(0) in KEEP_UPPER else m.group(0).lower(),
        text,
    )


def build_zone_segments(zone: dict) -> list[str]:
    return [
        clean_text(f"Welcome to {zone['name']}!"),
        clean_text(zone["intro"]),
    ]


def build_wonder_segments(wonder: dict) -> list[str]:
    ap = wonder["animalPro"]
    segs = [
        clean_text(f"{wonder['name']}! {wonder['tagline']}"),
        clean_text(f"What happens? {wonder['causeEffect']}"),
        clean_text(f"Animal Physics Pro: {ap['animal']}! {ap['story']}"),
        clean_text(f"Try this at home! {wonder['tryAtHome']}"),
    ]
    for idx, fact in enumerate(wonder["facts"], start=1):
        segs.append(clean_text(f"Physics fact number {idx}. {fact}"))
    return segs


def samples_to_m4a(samples: np.ndarray, sample_rate: int, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wav_path = Path(tmp.name)

    try:
        sf.write(str(wav_path), samples, sample_rate, subtype="PCM_16")
        if Path("/usr/bin/afconvert").exists():
            subprocess.run(
                [
                    "/usr/bin/afconvert",
                    "-f",
                    "m4af",
                    "-d",
                    "aac",
                    "-b",
                    "48000",
                    str(wav_path),
                    str(out_path),
                ],
                check=True,
                capture_output=True,
            )
        elif shutil.which("ffmpeg"):
            subprocess.run(
                [
                    "ffmpeg",
                    "-y",
                    "-i",
                    str(wav_path),
                    "-c:a",
                    "aac",
                    "-b:a",
                    "48k",
                    str(out_path),
                ],
                check=True,
                capture_output=True,
            )
        else:
            raise RuntimeError("Neither /usr/bin/afconvert nor ffmpeg found")
    finally:
        wav_path.unlink(missing_ok=True)


def synthesize_segments(
    kokoro: Kokoro, segments: list[str], voice: str, speed: float, pause_sec: float = 0.40
) -> tuple[np.ndarray, int]:
    chunks: list[np.ndarray] = []
    sr = 24000
    for idx, seg in enumerate(segments):
        audio, sr = kokoro.create(seg, voice=voice, speed=speed, lang="en-us")
        chunks.append(audio.astype(np.float32))
        if idx < len(segments) - 1:
            chunks.append(np.zeros(int(sr * pause_sec), dtype=np.float32))

    full = np.concatenate(chunks) if chunks else np.zeros(1, dtype=np.float32)
    peak = float(np.max(np.abs(full)))
    if peak > 0:
        full = full * (0.9 / peak)
    return full, sr


def write_manifest(zones: list[dict], voice: str) -> None:
    zones_map = {}
    wonders_map = {}
    for z in zones:
        zf = ZONES_DIR / f"{z['id']}.m4a"
        if zf.exists() and zf.stat().st_size > 0:
            zones_map[z["id"]] = f"audio/zones/{z['id']}.m4a"
        for w in z["wonders"]:
            wf = WONDERS_DIR / f"{w['id']}.m4a"
            if wf.exists() and wf.stat().st_size > 0:
                wonders_map[w["id"]] = f"audio/wonders/{w['id']}.m4a"

    PUBLIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "model": "kokoro-v1.0",
        "voice": voice,
        "zones": zones_map,
        "wonders": wonders_map,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        f"Updated {MANIFEST_PATH.relative_to(ROOT)}: "
        f"{len(zones_map)} zones, {len(wonders_map)} physics wonders."
    )


_WORKER_KOKORO: Kokoro | None = None


def _init_worker(model_path: str, voices_path: str, threads: int) -> None:
    global _WORKER_KOKORO
    os.environ["OMP_NUM_THREADS"] = str(threads)
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = threads
    opts.inter_op_num_threads = 1
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(model_path, sess_options=opts, providers=["CPUExecutionProvider"])
    _WORKER_KOKORO = Kokoro.from_session(sess, voices_path)


def _run_worker_task(
    task: tuple[str, str, list[str], str, str, float],
) -> tuple[str, str, float, float, float]:
    kind, item_id, segs, out_str, voice, speed = task
    assert _WORKER_KOKORO is not None
    t0 = time.time()
    out_path = Path(out_str)
    samples, sr = synthesize_segments(_WORKER_KOKORO, segs, voice, speed)
    samples_to_m4a(samples, sr, out_path)
    dur = len(samples) / sr
    kb = out_path.stat().st_size / 1024
    return kind, item_id, dur, kb, time.time() - t0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate Bounce, Zoom & Float voiceovers with Kokoro-82M"
    )
    parser.add_argument("--model", type=Path, default=DEFAULT_MODEL_PATH)
    parser.add_argument("--voices", type=Path, default=DEFAULT_VOICES_PATH)
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--speed", type=float, default=DEFAULT_SPEED)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--threads", type=int, default=2)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    zones = load_zones_from_ts()
    tasks: list[tuple[str, str, list[str], str, str, float]] = []

    for zone in zones:
        z_out = ZONES_DIR / f"{zone['id']}.m4a"
        if args.force or not z_out.exists() or z_out.stat().st_size == 0:
            tasks.append(("zone", zone["id"], build_zone_segments(zone), str(z_out), args.voice, args.speed))
        for wonder in zone["wonders"]:
            w_out = WONDERS_DIR / f"{wonder['id']}.m4a"
            if args.force or not w_out.exists() or w_out.stat().st_size == 0:
                tasks.append(
                    ("wonder", wonder["id"], build_wonder_segments(wonder), str(w_out), args.voice, args.speed)
                )

    if args.limit > 0:
        tasks = tasks[: args.limit]

    print(
        f"Loaded {len(zones)} physics zones & {sum(len(z['wonders']) for z in zones)} wonders. "
        f"Generating {len(tasks)} clips with Kokoro-82M (voice={args.voice}, speed={args.speed}, workers={args.workers})...",
        flush=True,
    )

    if not tasks:
        write_manifest(zones, args.voice)
        print("All clips already exist!")
        return

    t0 = time.time()
    completed = 0

    if args.workers <= 1:
        _init_worker(str(args.model), str(args.voices), args.threads)
        for task in tasks:
            kind, item_id, dur, kb, elapsed = _run_worker_task(task)
            completed += 1
            print(
                f"  [{completed}/{len(tasks)}] ✓ {kind}/{item_id}.m4a "
                f"({dur:.1f}s, {kb:.1f} KB in {elapsed:.1f}s)",
                flush=True,
            )
            if completed % 10 == 0:
                write_manifest(zones, args.voice)
    else:
        with concurrent.futures.ProcessPoolExecutor(
            max_workers=args.workers,
            initializer=_init_worker,
            initargs=(str(args.model), str(args.voices), args.threads),
        ) as pool:
            for kind, item_id, dur, kb, elapsed in pool.map(_run_worker_task, tasks):
                completed += 1
                print(
                    f"  [{completed}/{len(tasks)}] ✓ {kind}/{item_id}.m4a "
                    f"({dur:.1f}s, {kb:.1f} KB in {elapsed:.1f}s)",
                    flush=True,
                )
                if completed % 10 == 0:
                    write_manifest(zones, args.voice)

    write_manifest(zones, args.voice)
    print(f"\nDone! Generated {len(tasks)} clips in {time.time() - t0:.1f}s.")


if __name__ == "__main__":
    main()
