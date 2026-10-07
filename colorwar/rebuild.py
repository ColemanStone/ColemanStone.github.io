"""Repack the browser game's editable source: python3 colorwar/rebuild.py."""
from pathlib import Path
import tarfile
import zipfile

base = Path(__file__).resolve().parent
files = sorted(p for p in (base / "source").rglob("*") if p.is_file() and "__pycache__" not in p.parts)
with tarfile.open(base / "src.tar.gz", "w:gz") as tar, zipfile.ZipFile(base / "src.apk", "w", zipfile.ZIP_DEFLATED) as apk:
    for path in files:
        name = path.relative_to(base / "source").as_posix()
        tar.add(path, arcname=name)
        apk.write(path, arcname=name)
print("Updated src.tar.gz and src.apk")
