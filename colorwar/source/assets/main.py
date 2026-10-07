# /// script
# dependencies = ["pygame-ce"]
# ///
import asyncio
import pygame
from ColorWarGame import AISim

async def main():
    await AISim(web_mode=True).run()

asyncio.run(main())
