# SLine Services work film, "UI cinema": 12 s loop, no device frames, only the real screens.
#  0.0-4.2  the live-map dashboard on a tilted plane, the camera gliding toward the SOS alert
#  4.2-7.8  cut on motion: the client's SOS screen, close on the button as it is pressed and counts down
#  7.8-12   cut on motion: the technician's navigation, gliding down the route; cut back to the start
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from ui_film import *
D = os.path.join(os.path.dirname(__file__), '..', 'wall') + '/'
out = sys.argv[1]; only = [float(x) for x in sys.argv[2:]]
BG = stage()
_x = np.linspace(0, 1, W, dtype=np.float32)
SCRIM = (0.5 + 0.5 * np.clip((_x - 0.05) / 0.42, 0, 1) ** 1.4)[None, :, None]   # darker left third for the fold's text
def fin(f): return (f.astype(np.float32) * SCRIM).astype(np.uint8)
dash = Image.open(D + 'screens/01_SLine_Service_Dashboard_Live_Map.jpg').convert('RGB')
sos = Video(D + 'proto/p4_client_sos.mp4', 0.9); nav = Video(D + 'proto/p1_technician_navigation.mp4')
T, A, B = 12.0, 4.2, 7.8
def frame(i):
    t = i / FPS; sc = Scene(BG)
    if t < A:
        u = t / A
        sc.plate(dash, 2050, (lerp(470, 330, u), lerp(60, 25, u), lerp(380, 280, u)), rx=17, ry=13, rz=-3, radius=36)
        return fin(sc.render(focus_z=lerp(340, 260, u), aperture=0.022))
    if t < B:
        u = (t - A) / (B - A); f = sos.next(); h = 2300 * f.height / f.width
        sc.plate(f, 2300, (lerp(430, 370, u), -(0.585 - 0.5) * h + lerp(40, 10, u), lerp(160, 60, u)), rx=9, ry=-9, rz=2, radius=150, shadow=0)
        return fin(sc.render(focus_z=lerp(160, 60, u), aperture=0.03))
    u = (t - B) / (T - B); f = nav.next(); h = 1050 * f.height / f.width
    sc.plate(f, 1050, (lerp(420, 380, u), lerp(0.30, 0.20, u) * h, lerp(260, 200, u)), rx=15, ry=-12, rz=3, radius=90)
    return fin(sc.render(focus_z=lerp(420, 360, u), aperture=0.018))   # the instruction card and route, deeper up the tilted plane
N = int(T * FPS)
if only:
    want = {int(round(x * FPS)) for x in only}
    for i in range(max(want) + 1):
        fr = frame(i) if (i in want or A <= i / FPS) else None
        if i in want: Image.fromarray(fr).save(f'{out}_{i / FPS:05.2f}.png')
else:
    encode(out, frame, N)
