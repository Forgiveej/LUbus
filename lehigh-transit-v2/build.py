#!/usr/bin/env python3
"""Build a static deployment using a host-provided MapTiler browser key."""

import json
import os
from pathlib import Path
import shutil


FILES = (
    "index.html", "style1.css", "script1.js", "transit-data.js",
    "schedule-data.js", "campus-places.js", "search-scope.js",
    "journey-engine.js", "live-buses.js", "navigation.js",
)


def main():
    key = os.environ.get("MAPTILER_API_KEY", "").strip()
    if not key or key.startswith("YOUR_"):
        raise SystemExit("Set MAPTILER_API_KEY to a valid, production-domain-restricted browser key in your hosting settings.")
    source = Path(__file__).resolve().parent
    destination = source / "dist"
    for name in FILES:
        if not (source / name).is_file():
            raise SystemExit("Missing source file: " + name)
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir()
    for name in FILES:
        shutil.copy2(source / name, destination / name)
    configuration = "window.MAPTILER_CONFIG = " + json.dumps({"apiKey": key}) + ";\n"
    (destination / "maptiler-config.local.js").write_text(configuration, encoding="utf-8")
    (destination / ".nojekyll").touch()
    print("Built dist/ with 10 application files and browser configuration. API key value is hidden from build logs.")


if __name__ == "__main__":
    main()
