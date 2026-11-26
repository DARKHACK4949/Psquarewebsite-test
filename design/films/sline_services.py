# SLine Services work film: 12 s loop. The first cut's two-shot structure, polished.
#  0.0-1.8  wide: close 3/4 iPhone, the SOS screen ("Press")
#  1.8-3.6  cut-in on the action: macro of the SOS button as the countdown starts (shallow focus)
#  3.6-6.2  cut back out: countdown ends, "Technician on the way" drops in; the camera speeds up its push
#  6.2      cut on motion (fastest point of both moves, a touch of motion blur either side)
#  6.2-12   two phones already gliding: the technician's route in front, the client's phone softer behind,
#           both drifting with parallax; the end cuts on motion back to the start. Screens always on.
import sys, os, math; sys.path.insert(0, os.path.dirname(__file__))
from film import *
P = os.path.join(os.path.dirname(__file__), '..', 'wall', 'proto') + '/'
out = sys.argv[1]; only = [float(x) for x in sys.argv[2:]]
m1, m3 = load(1), load(3)
BG = bg()
T, C1, C2, CB = 12.0, 1.8, 3.6, 6.2
sos = Video(P + 'p4_client_sos.mp4'); nav = Video(P + 'p1_technician_navigation.mp4')
rearScr = still(P + 'p4_client_sos.mp4', 7.2)
def clamp(t): return min(max(t, 0), 1)
def eout(t): t = clamp(t); return 1 - (1 - t) ** 3
def ein(t): t = clamp(t); return t ** 3
def quadpt(D, u, v):
    (ax, ay), (bx, by), (cx_, cy_), (dx, dy) = D['SQ']
    tx, ty = ax + (bx - ax) * u, ay + (by - ay) * u; bx2, by2 = dx + (cx_ - dx) * u, dy + (cy_ - dy) * u
    return tx + (bx2 - tx) * v, ty + (by2 - ty) * v
def vblur(c, r):                              # vertical motion smear across a cut
    r = int(r)
    if r < 1: return c
    p = np.pad(c, ((r + 1, r), (0, 0), (0, 0)), mode='edge'); s = np.cumsum(p, axis=0)
    return (s[2 * r + 1:] - s[:-2 * r - 1]) / (2 * r + 1)
CX, TOP, SC = 1290, 70, 0.64
def shotA(t, scr):
    c = BG.copy(); place(c, device(m1, scr), CX, TOP, SC)
    z = 1 + 0.05 * ease(clamp(t / CB)) + 0.09 * ein((t - (CB - 0.9)) / 0.9)   # accelerates into the cut
    c = cam(c, z, CX, 560)
    return vblur(c, 14 * ein((t - (CB - 0.25)) / 0.25))
BX, BY = quadpt(m1, 0.5, 0.585)
def macro(t, scr):
    s = SC * (2.7 + 0.12 * (t - C1) / (C2 - C1))
    c = BG.copy(); place(c, device(m1, scr), W / 2 + 140 + (m1['w'] / 2 - BX) * s, H / 2 - BY * s + 30, s)
    blur = np.array(Image.fromarray((c * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    k = np.clip((np.hypot(xx - (W / 2 + 140), (yy - (H / 2 + 30)) * 1.6) - 260) / 420, 0, 1)[..., None]
    return c * (1 - k) + blur * k
def shotB(tb, scr):
    c = BG.copy(); L = T - CB
    up_r = 120 * (1 - eout((tb + 0.1) / 1.6)) - 14 * tb          # already moving at the cut: no rest frame
    up_f = 110 * (1 - eout((tb + 0.15) / 1.3)) - 26 * tb
    place(c, device(m1, rearScr, 0.8), 1660 + 7 * tb, 110 + up_r, 0.30, blur=3, dim=0.72)
    place(c, device(m3, scr), 1110, 10 + up_f, 0.58)
    z = 1.05 - 0.05 * eout(tb / 1.4) + 0.05 * ein((tb - (L - 0.9)) / 0.9)   # settles, then pushes into the loop cut
    c = cam(c, z, 1100, 520)
    r = 12 * (1 - eout(tb / 0.25)) + 14 * ein((tb - (L - 0.25)) / 0.25)
    return vblur(c, r)
def frame(i):
    t = i / FPS
    if t < CB: s = sos.next()
    else: n = nav.next()
    if t < C1: c = shotA(t, s)
    elif t < C2: c = macro(t, s)
    elif t < CB: c = shotA(t, s)
    else: c = shotB(t - CB, n)
    if t < 0.25: c = vblur(c, 12 * (1 - eout(t / 0.25)))          # the loop lands on motion too
    g = np.random.normal(0, 0.012, (H, W, 1)).astype(np.float32)
    return (np.clip(c + g, 0, 1) * 255).astype(np.uint8)
N = int(T * FPS)
if only:
    want = {int(round(x * FPS)) for x in only}
    for i in range(max(want) + 1):
        f = frame(i)
        if i in want: Image.fromarray(f).save(f'{out}_{i / FPS:05.2f}.png')
else:
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for i in range(N): enc.stdin.write(frame(i).tobytes())
    enc.stdin.close(); enc.wait()
