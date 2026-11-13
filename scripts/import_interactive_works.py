"""Publish the two standalone HTML exports as same-origin, cacheable portfolio works."""
import argparse
import base64
import hashlib
import json
import re
import shutil
from pathlib import Path

WORKS = Path(__file__).resolve().parents[1] / "site/public/assets/works"
PART_SIZE = 6 * 1024 * 1024


def import_board(source):
    folder = WORKS / "dotline"
    folder.mkdir(parents=True, exist_ok=True)
    markup = source.read_text(encoding="utf-8")
    fonts = folder / "fonts"
    fonts.mkdir(exist_ok=True)

    def font_url(match):
        binary = base64.b64decode(match[1], validate=True)
        name = hashlib.sha256(binary).hexdigest()[:24] + ".woff2"
        (fonts / name).write_bytes(binary)
        return "./fonts/" + name

    markup = re.sub(r"data:font/woff2;base64,([A-Za-z0-9+/=]+)", font_url, markup)
    speech = folder / "speech"
    speech.mkdir(exist_ok=True)
    manifest = []

    def split_asset(match):
        name, mime, encoded = match.groups()
        packed = base64.b64decode(encoded, validate=True)
        digest = hashlib.sha256(packed).hexdigest()[:24]
        parts = []
        for offset in range(0, len(packed), PART_SIZE):
            part = f"{digest}-{offset // PART_SIZE}.bin"
            (speech / part).write_bytes(packed[offset:offset + PART_SIZE])
            parts.append(part)
        manifest.append(dict(name=name, mime=mime, parts=parts))
        return ""

    markup = re.sub(r'<script type="application/octet-stream" data-dotline-asr="([^"]+)" data-mime="([^"]+)">([A-Za-z0-9+/=]+)</script>', split_asset, markup)
    if not manifest:
        raise ValueError("Missing embedded speech assets")
    (speech / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    notices = re.search(r'<script type="text/plain" id="dotline-asr-licenses">(.*?)</script>', markup, re.S)
    if not notices:
        raise ValueError("Missing speech licenses")
    (speech / "LICENSES.txt").write_text(notices[1])
    markup = markup.replace(notices[0], "<!-- Speech engine notices: ./speech/LICENSES.txt -->")
    # Keep the exported drawing and recognition code. Only swap its file-origin asset resolver.
    engine = re.search(r'<script>(\(\(\)=>\{.*?)</script>', markup, re.S)
    if not engine:
        raise ValueError("Unrecognized drawing engine")
    start = re.search(r'async function (\w+)\((\w+),(\w+)\)\{let \w+=document\.querySelectorAll\("script\[data-dotline-asr\]"\);', engine[1])
    if not start:
        raise ValueError("Unrecognized speech asset resolver")
    end = engine[1].index("}async function ", start.end()) + 1
    func, urls, signal = start.groups()
    adapter = f"async function {func}({urls},{signal}){{return window.loadDotlineSpeechAssets({urls},{signal})}}"
    code = engine[1][:start.start()] + adapter + engine[1][end:]
    (folder / "editor.js").write_text(code)
    markup = markup.replace(engine[0], '<script src="./speech-assets.js"></script><script src="./editor.js"></script>')
    (folder / "index.html").write_text(markup)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("whiteboard", type=Path)
    parser.add_argument("game", type=Path)
    args = parser.parse_args()
    import_board(args.whiteboard)
    game = WORKS / "paper-skirmish"
    game.mkdir(exist_ok=True)
    shutil.copyfile(args.game, game / "index.html")
