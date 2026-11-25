import sys; sys.path.insert(0,__import__('os').path.dirname(__file__))
from film import *
P='/home/user/Psquarewebsite-test/design/wall/proto/'
out=sys.argv[1]; only=[float(x) for x in sys.argv[2:]]  # optional preview times (s)
m1,m3=load(1),load(3)
BG=bg()
T1,T=6.2,12.0
sos=Video(P+'p4_client_sos.mp4'); nav=Video(P+'p1_technician_navigation.mp4')
rear=device(m1,still(P+'p4_client_sos.mp4',7.2),0.8)
def frame(i):
    t=i/FPS; c=BG.copy()
    if t<T1:
        d=device(m1,sos.next()); place(c,d,1290,70,0.64)
        u=ease(t/T1); c=cam(c,1+0.07*u,1290,560)
    else:
        nf=nav.next(); place(c,rear,1660,110,0.30,blur=3,dim=0.72)
        place(c,device(m3,nf),1110,10,0.58)
        u=(t-T1)/(T-T1); c=cam(c,1+0.05*u,1100,500,dx=-30*u)
    g=np.random.normal(0,0.012,(H,W,1)).astype(np.float32)
    return (np.clip(c+g,0,1)*255).astype(np.uint8)
N=int(T*FPS)
if only:
    want={int(round(s*FPS)) for s in only}
    for i in range(N):
        if i<T1*FPS: f=None
        f=frame(i) if i in want else (sos.next() if i/FPS<T1 else nav.next(), None)[1]
        if f is not None: Image.fromarray(f).save(f'{out}_{i/FPS:05.2f}.png')
        if i>=max(want): break
else:
    enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-crf','15','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
    for i in range(N): enc.stdin.write(frame(i).tobytes())
    enc.stdin.close(); enc.wait()
