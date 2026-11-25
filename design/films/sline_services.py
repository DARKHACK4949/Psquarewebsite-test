# SLine Services work film: 12 s loop, two Fantasy-style transitions.
#  0.0-1.8  wide: close 3/4 iPhone, the SOS screen ("Press"); its screen wakes at the loop start
#  1.8-3.6  cut-in on the action: macro of the SOS button as the countdown starts (shallow focus)
#  3.6-6.0  cut back out: countdown ends, "Technician on the way" drops in
#  6.0-6.6  the screen sleeps while the phone drifts, the scene dips dark
#  6.6-12   two phones rise with dark screens, the screens wake into the technician's route;
#           they sleep again at the end, so the loop wakes the first phone
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from film import *
P = os.path.join(os.path.dirname(__file__), '..', 'wall', 'proto') + '/'
out = sys.argv[1]; only = [float(x) for x in sys.argv[2:]]
m1, m3 = load(1), load(3)
BG = bg(); DARK = BG * 0.35
T, C1, C2, S0, XB = 12.0, 1.8, 3.6, 6.0, 6.6
sos = Video(P + 'p4_client_sos.mp4'); nav = Video(P + 'p1_technician_navigation.mp4')
rearScr = still(P + 'p4_client_sos.mp4', 7.2)
def clamp(t): return min(max(t, 0), 1)
def eout(t): t = clamp(t); return 1 - (1 - t) ** 3
def through(c, k): return c * (1 - k) + DARK * k
def quadpt(D, u, v):                       # a point on the screen (0..1) -> device px
    (ax, ay), (bx, by), (cx_, cy_), (dx, dy) = D['SQ']
    tx, ty = ax + (bx - ax) * u, ay + (by - ay) * u; bx2, by2 = dx + (cx_ - dx) * u, dy + (cy_ - dy) * u
    return tx + (bx2 - tx) * v, ty + (by2 - ty) * v
CX, TOP, SC = 1290, 70, 0.64               # the wide framing of shot A
def shotA(t, scr, wake):
    c = BG.copy(); place(c, device(m1, scr, 0.88 * wake), CX, TOP, SC)
    return cam(c, 1 + 0.06 * ease(clamp(t / S0)), CX, 560)
BX, BY = quadpt(m1, 0.5, 0.585)            # the SOS button on the device
def macro(t, scr):                         # cut-in: the phone re-placed at 2.7x around the button, focus falloff
    s = SC * (2.7 + 0.12 * (t - C1) / (C2 - C1))
    c = BG.copy(); place(c, device(m1, scr), W / 2 + 140 + (m1['w'] / 2 - BX) * s, H / 2 - BY * s + 30, s)
    blur = np.array(Image.fromarray((c * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    k = np.clip((np.hypot((xx - (W / 2 + 140)) / 1.0, (yy - (H / 2 + 30)) * 1.6) - 260) / 420, 0, 1)[..., None]
    return c * (1 - k) + blur * k
def shotB(tb, scr, wake):
    c = BG.copy()
    up_r = 90 * (1 - eout((tb - 0.15) / 1.3)) - 12 * tb
    up_f = 70 * (1 - eout(tb / 1.1)) - 24 * tb
    place(c, device(m1, rearScr, 0.8 * wake(tb - 0.25)), 1660 + 6 * tb, 110 + up_r, 0.30, blur=3, dim=0.72)
    place(c, device(m3, scr, 0.88 * wake(tb)), 1110, 10 + up_f, 0.58)
    return cam(c, 1.12 - 0.12 * eout(tb / 1.0) + 0.04 * (tb / (T - XB)), 1100, 520)
def frame(i):
    t = i / FPS
    if t < XB: s = sos.next()
    if t >= XB - 0.05: n = nav.next()
    if t < C1:   c = shotA(t, s, ease(clamp(t / 0.6)))                      # screen wakes at the loop start
    elif t < C2: c = macro(t, s)
    elif t < XB:
        c = shotA(t, s, 1 - ease(clamp((t - S0) / 0.35)))                   # screen sleeps
        if t > S0 + 0.2: c = through(c, ease(clamp((t - S0 - 0.2) / 0.4)))
    else:
        tb = t - XB
        wakeIn = lambda x: ease(clamp((x - 0.55) / 0.7))                    # screens wake once the phones have risen
        sleep = 1 - ease(clamp((t - (T - 0.7)) / 0.45))                     # and sleep before the loop
        c = shotB(tb, n, lambda x: wakeIn(x) * sleep)
        if tb < 0.45: c = through(c, 1 - ease(tb / 0.45))
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
