# "UI cinema": real product screens as flat planes in 3D, filmed by a perspective camera
# with depth-of-field falloff. A flat interface on a tilted plane is physically exact, so the
# motion reads as real camera work. Shared by the work films.
import numpy as np, math, subprocess
from PIL import Image, ImageFilter, ImageDraw
W, H, FPS = 1920, 1080, 30
F = 1.6 * W                                   # focal length in px (a ~50 mm look)
def rounded(img, r):
    im = img.convert('RGBA'); m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    im.putalpha(m); return im
def coeffs(dst, wh):
    w, h = wh; A = []; B = []
    for (X, Y), (x, y) in zip(dst, [(0, 0), (w, 0), (w, h), (0, h)]):
        A += [[X, Y, 1, 0, 0, 0, -x * X, -x * Y], [0, 0, 0, X, Y, 1, -y * X, -y * Y]]; B += [x, y]
    return tuple(np.linalg.solve(np.array(A, float), np.array(B, float)))
def project(wh, width, center, rx=0, ry=0, rz=0):
    """Corners of a plane `width` px wide (source aspect kept), centred at `center`=(x,y,z) with
    rotations in degrees (rx tilts top away, ry turns right edge away), projected to the screen.
    Returns screen corners and their depths."""
    w, h = wh; s = width / w; hw, hh = w * s / 2, h * s / 2
    ax, ay, az = map(math.radians, (rx, ry, rz)); out = []; zs = []
    for x, y in [(-hw, -hh), (hw, -hh), (hw, hh), (-hw, hh)]:
        x, y = x * math.cos(az) - y * math.sin(az), x * math.sin(az) + y * math.cos(az)
        y, z = y * math.cos(ax), -y * math.sin(ax)                 # rx > 0: the top leans away
        x, z = x * math.cos(ay) - z * math.sin(ay), x * math.sin(ay) + z * math.cos(ay)   # ry > 0: right edge away
        X, Y, Z = x + center[0], y + center[1], z + center[2]
        out.append((W / 2 + F * X / (F + Z), H / 2 + F * Y / (F + Z))); zs.append(Z)
    return out, zs
class Scene:
    def __init__(s, bg):
        s.bg = bg; s.layers = []
    def plate(s, img, width, center, rx=0, ry=0, rz=0, radius=28, shadow=0.45, bright=1.0):
        s.layers.append((img, width, center, rx, ry, rz, radius, shadow, bright))
    def render(s, focus_z=0.0, aperture=0.0, grain=0.012):
        c = s.bg.copy(); depth = np.full((H, W), np.inf, np.float32)
        for img, width, center, rx, ry, rz, radius, shadow, bright in s.layers:
            im = rounded(img, radius) if radius else img.convert('RGBA')
            pts, zs = project(im.size, width, center, rx, ry, rz)
            co = coeffs(pts, im.size)
            if shadow:
                sp = [(x, y + 0.035 * H) for x, y in pts]
                a = Image.new('L', (W, H), 0); ImageDraw.Draw(a).polygon(sp, fill=int(255 * shadow))
                a = np.array(a.filter(ImageFilter.GaussianBlur(48))).astype(np.float32)[..., None] / 255
                c = c * (1 - a * 0.85)
            lay = np.array(im.transform((W, H), Image.PERSPECTIVE, co, Image.BICUBIC)).astype(np.float32) / 255
            al = lay[..., 3:4]; c = c * (1 - al) + lay[..., :3] * bright * al
            # depth of every covered pixel: invert the homography to plane uv, then interpolate corner depths
            yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
            a_, b_, c_, d_, e_, f_, g_, h_ = co
            den = g_ * xx + h_ * yy + 1; u = (a_ * xx + b_ * yy + c_) / den / im.width; v = (d_ * xx + e_ * yy + f_) / den / im.height
            z = (zs[0] * (1 - u) + zs[1] * u) * (1 - v) + (zs[3] * (1 - u) + zs[2] * u) * v
            m = al[..., 0] > 0.5; depth[m] = z[m]
        if aperture > 0:
            r = np.where(np.isfinite(depth), np.abs(depth - focus_z) * aperture, 0)
            r = np.array(Image.fromarray(np.clip(r * 20, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(25))).astype(np.float32) / 20
            u8 = Image.fromarray((np.clip(c, 0, 1) * 255).astype(np.uint8))
            b1 = np.array(u8.filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255
            b2 = np.array(u8.filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
            k1 = np.clip(r / 3, 0, 1)[..., None]; k2 = np.clip((r - 3) / 6, 0, 1)[..., None]
            c = c * (1 - k1) + b1 * k1; c = c * (1 - k2) + b2 * k2
        if grain: c = c + np.random.normal(0, grain, (H, W, 1)).astype(np.float32)
        return (np.clip(c, 0, 1) * 255).astype(np.uint8)
def stage(top=(0x2a, 0x17, 0x5c), glow=(0x5a, 0x3b, 0xb4), base=(7, 6, 12), at=(0.66, 0.42)):
    """Near-black with one soft pool of the project colour, darker on the left for the fold's text."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); b = np.array(base, np.float32) / 255
    g = np.exp(-(((xx - at[0] * W) / (0.5 * W)) ** 2 + ((yy - at[1] * H) / (0.62 * H)) ** 2))[..., None]
    t = np.exp(-(((yy + 0.1 * H) / (0.5 * H)) ** 2))[..., None] * np.clip(xx / W, 0, 1)[..., None]
    img = b + g * (np.array(glow, np.float32) / 255 - b) * 0.55 + t * (np.array(top, np.float32) / 255) * 0.35
    vig = 1 - 0.28 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)[..., None]
    return np.clip(img * vig, 0, 1)
class Video:
    def __init__(s, path, start=0):
        s.w, s.h = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path]).decode().split(','))
        s.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path, '-vf', 'fps=30', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE); s.last = None
    def next(s):
        b = s.p.stdout.read(s.w * s.h * 3)
        if len(b) == s.w * s.h * 3: s.last = Image.frombytes('RGB', (s.w, s.h), b)
        return s.last
def ease(t): t = min(max(t, 0), 1); return t * t * (3 - 2 * t)
def lerp(a, b, t): return a + (b - a) * t
def encode(out, frames, n):
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    for i in range(n): enc.stdin.write(frames(i).tobytes())
    enc.stdin.close(); enc.wait()
