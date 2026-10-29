"""Original instrumental cue, composed locally; no samples or voice recording."""
import argparse
import wave
from pathlib import Path
import numpy as np

p = argparse.ArgumentParser()
p.add_argument('--out', required=True)
p.add_argument('--duration', type=float, default=45.3333333333)
p.add_argument('--seed', type=int, default=20261028)
p.add_argument('--boundaries', default='6,12,21.333333,29.333333,38')
args = p.parse_args()
sr, duration, bpm = 48000, args.duration, 90 if args.seed==20261028 else 86+(args.seed%5)*2
beat = 60 / bpm
rng = np.random.default_rng(args.seed)
mix = np.zeros((int(sr * duration), 2), dtype=np.float64)

def add(start, signal, gain=1, pan=0):
    offset = int(start * sr)
    if offset < 0:
        signal, offset = signal[-offset:], 0
    n = min(len(signal), len(mix) - offset)
    if n <= 0:
        return
    mix[offset:offset+n, 0] += signal[:n] * gain * np.sqrt((1-pan)/2)
    mix[offset:offset+n, 1] += signal[:n] * gain * np.sqrt((1+pan)/2)

def hz(note):
    return 440 * 2 ** ((note-69)/12)

def key(note, length=2.8):
    t = np.arange(int(sr*length))/sr
    f = hz(note)
    body = np.sin(2*np.pi*f*t + .32*np.sin(2*np.pi*f*2*t)*np.exp(-3*t))
    body += .24*np.sin(2*np.pi*f*2*t)*np.exp(-1.8*t)
    body += .07*np.sin(2*np.pi*f*3*t)*np.exp(-4*t)
    return body * (1-np.exp(-t*160)) * np.exp(-t*1.65) * np.minimum(1,(length-t)*12)

# Four original voicings: Am9 / Fmaj9 / Cmaj9 / G6sus2.
chords = [[57,60,64,67,71],[53,57,60,64,67],[48,55,59,62,64],[55,57,62,64,69]]
shift=0 if args.seed==20261028 else [-2,0,2][args.seed%3]
chords=[[n+shift for n in chord] for chord in chords]
bars=16 if args.seed==20261028 and duration<46 else int(np.ceil((duration-2)/(4*beat)))
for bar in range(bars):
    start = bar*4*beat
    chord = chords[(bar//2)%4]
    for j, note in enumerate(chord):
        sig = key(note, 3.4)
        add(start+j*.022, sig, .15, (j-2)*.24)
        add(start+.24+j*.022, sig, .035, -(j-2)*.24)
    # Round, sustained pad with slow motion; attack avoids synthetic organ clicks.
    t = np.arange(int(sr*3.15))/sr
    envelope = np.minimum(1,t/.55) * np.minimum(1,(3.15-t)/.75)
    for j, note in enumerate(chord[1:4]):
        signal = (np.sin(2*np.pi*hz(note)*t) + .22*np.sin(2*np.pi*hz(note)*1.002*t))
        add(start, signal*envelope, .025, (j-1)*.7)
    # Bass enters after the opening and leaves room for the final chord.
    if bar >= 2:
        for b in [0, 2.5]:
            t = np.arange(int(sr*.8))/sr
            f = hz(chord[0]-12)
            signal = (np.sin(2*np.pi*f*t)+.13*np.sin(4*np.pi*f*t))*(1-np.exp(-80*t))*np.exp(-4*t)
            add(start+b*beat, signal, .21)
    # Light, syncopated plucked phrase; every other bar is intentionally sparse.
    pattern = [(.5,2),(1.5,4),(2.75,3),(3.5,1)] if bar%2==0 else [(1,3),(3,2)]
    for b, index in pattern:
        if bar >= 1:
            sig = key(chord[index]+12, 1.7)
            add(start+b*beat, sig, .075, -.3 if index%2 else .3)
            add(start+b*beat+.30, sig, .022, .5)
    if 2 <= bar <= bars-2:
        for b in [0,2]:
            t=np.arange(int(sr*.32))/sr
            phase=2*np.pi*(48*t+38*.034*(1-np.exp(-t/.034)))
            add(start+b*beat,np.sin(phase)*np.exp(-t*17)*(1-np.exp(-t*500)),.28)
        for b in [1,3]:
            t=np.arange(int(sr*.13))/sr
            noise=rng.normal(size=len(t))
            brush=np.convolve(noise,np.ones(10)/10,mode='same')
            add(start+b*beat,brush*np.exp(-t*34)*(1-np.exp(-t*800)),.13,.1)
        for eighth in range(8):
            t=np.arange(int(sr*.045))/sr
            noise=rng.normal(size=len(t))
            noise=noise-np.convolve(noise,np.ones(7)/7,mode='same')
            add(start+eighth*beat/2,noise*np.exp(-t*100),.012 if eighth%2 else .018,(-1)**eighth*.5)

# Soft swishes at scene boundaries, plus a wooden click for the pawn move.
boundaries=[float(v) for v in args.boundaries.split(',') if v]
for boundary in boundaries:
    length=.55
    t=np.arange(int(sr*length))/sr
    noise=rng.normal(size=len(t))
    smooth=np.convolve(noise,np.ones(32)/32,mode='same')
    env=np.sin(np.pi*t/length)**2
    add(boundary-.22,smooth*env,.24,-.2)
    add(boundary-.18,smooth*env,.13,.5)
onsets=[16.1,24.1,30.1,32.1,34.1] if args.seed==20261028 else [v+.42 for v in boundaries]+[boundaries[-2]+2.42,boundaries[-2]+4.42]
for onset in onsets:
    t=np.arange(int(sr*.16))/sr
    click=(np.sin(2*np.pi*820*t)+.4*np.sin(2*np.pi*1270*t))*np.exp(-65*t)
    click+=rng.normal(size=len(t))*.15*np.exp(-110*t)
    add(onset,click,.11)

for note in [57+shift,60+shift,64+shift,71+shift]:
    add(duration-2.666667,key(note,2.6666),.13,(note-64-shift)/18)
time=np.arange(len(mix))/sr
mix*=np.minimum(1,time/.6)[:,None]*np.minimum(1,(duration-time)/1.7)[:,None]
peak=np.max(np.abs(mix))
mix*=.78/max(peak,1e-8)
output=Path(args.out)
output.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(output),'wb') as wav:
    wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(sr)
    wav.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
print(f'Original instrumental + effects: {duration:.2f}s, stereo, no voice → {output}')
