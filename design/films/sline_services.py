# SLine Services work film: 12 s loop.
# Shot A (0-6.4 s): close 3/4 iPhone, the SOS prototype (press, countdown, "technician on the way").
# Shot B (5.9-12 s): tilted iPhone with the technician's navigation, the client's phone softer behind.
# A hands over to B (and B back to A at the loop) by pushing through into the dark scene and rising out of it.
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from film import *
P = os.path.join(os.path.dirname(__file__), '..', 'wall', 'proto') + '/'
out = sys.argv[1]; only = [float(x) for x in sys.argv[2:]]
m1, m3 = load(1), load(3)
BG = bg()
T, X0, X1 = 12.0, 5.9, 6.5          # loop length; A->B blend window
LOOP = 0.5                           # B->A blend at the end of the loop
sos = Video(P + 'p4_client_sos.mp4'); nav = Video(P + 'p1_technician_navigation.mp4')
rear = device(m1, still(P + 'p4_client_sos.mp4', 7.2), 0.8)
def eout(t): t = min(max(t, 0), 1); return 1 - (1 - t) ** 3
def ein(t): t = min(max(t, 0), 1); return t * t * t
def shotA(t, scr):
    c = BG.copy(); place(c, device(m1, scr), 1290, 70, 0.64)
    z = 1 + 0.07 * ease(min(t / X1, 1))
    z += 0.10 * ein((t - X0) / (X1 - X0)) if t > X0 else 0      # push through into the cut
    return cam(c, z, 1290, 560)
def shotB(tb, scr):
    c = BG.copy()
    up_r = 90 * (1 - eout((tb - 0.15) / 1.3)) - 12 * tb          # rear: later, slower (parallax)
    up_f = 70 * (1 - eout(tb / 1.1)) - 24 * tb                   # front: glides in, keeps drifting
    place(c, rear, 1660 + 6 * tb, 110 + up_r, 0.30, blur=3, dim=0.72)
    place(c, device(m3, scr), 1110, 10 + up_f, 0.58)
    z = 1.12 - 0.12 * eout(tb / 1.0) + 0.04 * (tb / (T - X0))    # settle out of the push, then drift in
    return cam(c, z, 1100, 520)
DARK = BG * 0.35                                                   # the scene with the glow dimmed: the "between" moment
def through(c, k): return c * (1 - k) + DARK * k                    # sink a frame toward the dark scene
def frame(i):
    t = i / FPS
    if t < X0 + 0.32:                                              # A, sinking into the dark as it pushes through
        c = through(shotA(t, sos.next()), ease((t - X0) / 0.32) if t > X0 else 0)
        if t >= X0: nav.next()
    else:                                                          # B, rising out of the dark as it settles
        tb = t - X0; c = through(shotB(tb, nav.next()), 1 - ease((tb - 0.32) / 0.38) if tb < 0.7 else 0)
        if t < X1: sos.next()
    if t < 0.35: c = through(c, 1 - ease(t / 0.35))                # loop point: rise out of the dark...
    if t > T - 0.35: c = through(c, ease((t - (T - 0.35)) / 0.35)) # ...and sink back into it
    g = np.random.normal(0, 0.012, (H, W, 1)).astype(np.float32)
    return (np.clip(c + g, 0, 1) * 255).astype(np.uint8)
N = int(T * FPS)
if only:
    want = {int(round(s * FPS)) for s in only}
    for i in range(max(want) + 1):
        f = frame(i)
        if i in want: Image.fromarray(f).save(f'{out}_{i / FPS:05.2f}.png')
else:
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for i in range(N): enc.stdin.write(frame(i).tobytes())
    enc.stdin.close(); enc.wait()
