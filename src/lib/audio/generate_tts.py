import asyncio
import sys
import os
import re
import edge_tts

async def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_tts.py <text_file_or_text> <output_path> [lang]")
        sys.exit(1)

    input_arg = sys.argv[1]
    out_path = sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else 'en'

    # If input is a file path, read from file
    if os.path.exists(input_arg):
        with open(input_arg, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        text = input_arg

    text = text.strip()
    if not text:
        sys.exit(1)

    # Auto-detect script
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
    has_telugu = bool(re.search(r'[\u0C00-\u0C7F]', text))

    if has_devanagari or lang == 'hi':
        voice = 'hi-IN-SwaraNeural'
    elif has_telugu or lang == 'te':
        voice = 'te-IN-ShrutiNeural'
    else:
        voice = 'en-IN-NeerjaNeural'

    communicate = edge_tts.Communicate(text, voice, rate='+12%')
    await communicate.save(out_path)
    print("SUCCESS")

if __name__ == '__main__':
    asyncio.run(main())
