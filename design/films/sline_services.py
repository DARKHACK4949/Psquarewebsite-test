# SLine Services work film: 12 s loop, one phone, screens always on.
#  0.0-0.45  the phone finishes turning toward us on the SOS screen ("Press")  (the loop's other half)
#  0.45-1.8  wide: close 3/4 iPhone
#  1.8-3.6   cut-in on the action: macro of the SOS button as the countdown starts (shallow focus)
#  3.6-6.4   cut back out: countdown ends, "Technician on the way" drops in
#  6.4-7.3   the phone turns around; as it comes back, its screen is the technician's route
#  7.3-11.3  the route plays while the camera eases back
#  11.55-12  the phone turns again and comes back on "Press" at t=0: the loop
import sys, os, math; sys.path.insert(0, os.path.dirname(__file__))
from film import *
P = os.path.join(os.path.dirname(__file__), '..', 'wall', 'proto') + '/'
out = sys.argv[1]; only = [float(x) for x in sys.argv[2:]]
m1 = load(1)
BG = bg()
T, C1, C2, R1 = 12.0, 1.8, 3.6, 6.4                # cuts, and the mid-film turn
TURN = 0.9; HALF = TURN / 2; R2 = T - HALF          # the loop turn: last half here, first half at t=0
sos = Video(P + 'p4_client_sos.mp4'); nav = Video(P + 'p1_technician_navigation.mp4')
press = still(P + 'p4_client_sos.mp4', 0.0)
def clamp(t): return min(max(t, 0), 1)
def quadpt(D, u, v):
    (ax, ay), (bx, by), (cx_, cy_), (dx, dy) = D['SQ']
    tx, ty = ax + (bx - ax) * u, ay + (by - ay) * u; bx2, by2 = dx + (cx_ - dx) * u, dy + (cy_ - dy) * u
    return tx + (bx2 - tx) * v, ty + (by2 - ty) * v
def hblur(d, r):
    """Horizontal motion blur of a premultiplied RGBA layer, radius r px."""
    r = int(r)
    if r < 1: return d
    p = np.pad(d, ((0, 0), (r + 1, r), (0, 0)))
    c = np.cumsum(p, axis=1)
    return (c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)
def yaw(dev, deg, speed=0.0):
    """Turn the device layer about its vertical centre line (perspective), shading it as it turns away;
    speed (deg/frame) smears it sideways like a real fast turn."""
    if abs(deg) < 0.05: return dev
    h, w = dev.shape[:2]; th = math.radians(deg); F = 3.2 * h; cx = w / 2
    dst = []
    for x, y in [(0, 0), (w, 0), (w, h), (0, h)]:
        X = (x - cx) * math.cos(th); Z = (x - cx) * math.sin(th); s = F / (F + Z)
        dst.append((cx + X * s, h / 2 + (y - h / 2) * s))
    im = Image.fromarray((np.clip(dev, 0, 1) * 255).astype(np.uint8), 'RGBA')
    d = np.array(im.transform((w, h), Image.PERSPECTIVE, coeffs(dst, (w, h)), Image.BICUBIC)).astype(np.float32) / 255
    shade = 1 - 0.55 * abs(math.sin(th))
    d[..., :3] *= shade
    return hblur(d, 1.1 * speed * abs(math.cos(th)) + 0.6 * speed)
CX, TOP, SC = 1290, 70, 0.64
def zoom(t):                                   # pushes in to the turn, eases back out over the route: loops
    if t < R1: return 1 + 0.06 * ease(clamp(t / R1))
    return 1.06 - 0.06 * ease(clamp((t - R1) / (T - R1)))
def wide(t, scr, deg=0.0, speed=0.0):
    c = BG.copy(); place(c, yaw(device(m1, scr), deg, speed), CX, TOP, SC)
    return cam(c, zoom(t), CX, 560)
BX, BY = quadpt(m1, 0.5, 0.585)
def macro(t, scr):
    s = SC * (2.7 + 0.12 * (t - C1) / (C2 - C1))
    c = BG.copy(); place(c, device(m1, scr), W / 2 + 140 + (m1['w'] / 2 - BX) * s, H / 2 - BY * s + 30, s)
    blur = np.array(Image.fromarray((c * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    k = np.clip((np.hypot(xx - (W / 2 + 140), (yy - (H / 2 + 30)) * 1.6) - 260) / 420, 0, 1)[..., None]
    return c * (1 - k) + blur * k
def turn(t0, t):                                # 0 -> 90 (away), then -90 -> 0 (the other face comes round)
    u = ease(clamp((t - t0) / TURN)); a = 180 * u
    return (a, False) if a < 90 else (a - 180, True)
last_sos = [press]; last_nav = [None]
def frame(i):
    t = i / FPS
    if t < R1 + HALF and t >= HALF: last_sos[0] = sos.next()
    if t >= R1 + HALF - 0.05: last_nav[0] = nav.next()
    if t < HALF:                                   # the loop turn's second half, on "Press"
        A = lambda x: 180 * ease(0.5 + 0.5 * x / HALF) - 180
        c = wide(t, press, A(t), abs(A(t + 1 / FPS) - A(t)))
    elif t < C1: c = wide(t, last_sos[0])
    elif t < C2: c = macro(t, last_sos[0])
    elif t < R1: c = wide(t, last_sos[0])
    elif t < R1 + TURN:
        a, swapped = turn(R1, t); sp = 180 * abs(ease(clamp((t + 1 / FPS - R1) / TURN)) - ease(clamp((t - R1) / TURN)))
        c = wide(t, last_nav[0] if swapped and last_nav[0] is not None else last_sos[0], a, sp)
    elif t < R2: c = wide(t, last_nav[0])
    else:                                           # the loop turn's first half, on the route
        A = lambda x: 180 * ease(0.5 * (x - R2) / HALF)
        c = wide(t, last_nav[0], A(t), abs(A(t + 1 / FPS) - A(t)))
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
