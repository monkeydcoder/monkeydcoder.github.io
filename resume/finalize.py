"""Checks resume/cv.pdf, sets its metadata and writes public/Satyam_Sharma_Resume.pdf.

Needs PyMuPDF (pip install pymupdf). Run after `node resume/render.js`.
"""
import pathlib
import sys

import pymupdf

here = pathlib.Path(__file__).resolve().parent
src = here / 'cv.pdf'
dst = here.parent / 'public' / 'Satyam_Sharma_Resume.pdf'

doc = pymupdf.open(src)
fonts = {f[3].split('+')[-1] for page in doc for f in page.get_fonts()}
problems = []
if doc.page_count != 2:
    problems.append(f'expected 2 pages, got {doc.page_count}')
if not fonts or not all(f.startswith('Carlito') for f in fonts):
    problems.append(f'unexpected fonts {sorted(fonts)} (did Carlito load?)')
if problems:
    sys.exit('; '.join(problems))

meta = doc.metadata
meta.update({
    'title': 'Satyam Sharma CV',
    'author': 'Satyam Sharma',
    'subject': 'CV: reinforcement learning and machine learning, Institute of Science Tokyo',
    'keywords': 'reinforcement learning, machine learning, PPO, MiniGrid, sparse rewards, LLM, Institute of Science Tokyo, MEXT',
    'creator': 'Satyam Sharma',
})
doc.set_metadata(meta)
doc.save(dst, garbage=3, deflate=True)
print('wrote', dst)
