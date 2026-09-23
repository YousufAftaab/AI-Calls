import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const { text, lang = 'en' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const pythonPath = 'C:\\Users\\moham\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'audio', 'generate_tts.py');
    
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const tempTextFile = path.join(os.tmpdir(), `tts_in_${id}.txt`);
    const tempMp3File = path.join(os.tmpdir(), `tts_out_${id}.mp3`);

    // Write text to temp file to avoid CLI encoding issues
    fs.writeFileSync(tempTextFile, text, 'utf-8');

    return new Promise<NextResponse>((resolve) => {
      execFile(pythonPath, [scriptPath, tempTextFile, tempMp3File, lang], { timeout: 15000 }, (error) => {
        // Clean up input file
        try { if (fs.existsSync(tempTextFile)) fs.unlinkSync(tempTextFile); } catch {}

        if (error || !fs.existsSync(tempMp3File)) {
          console.error('Edge-TTS generation failed:', error?.message);
          // Return 500 so the client knows TTS failed and can use browser fallback
          return resolve(NextResponse.json({ error: 'TTS generation failed' }, { status: 500 }));
        }

        try {
          const audioBuffer = fs.readFileSync(tempMp3File);
          fs.unlinkSync(tempMp3File);

          if (audioBuffer.length < 100) {
            // Too small to be real audio
            return resolve(NextResponse.json({ error: 'TTS produced empty audio' }, { status: 500 }));
          }

          resolve(
            new NextResponse(audioBuffer, {
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
                'Cache-Control': 'public, max-age=3600',
              },
            })
          );
        } catch (e) {
          resolve(NextResponse.json({ error: String(e) }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
