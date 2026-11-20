import numpy as np, subprocess, math
def oklch(L,C,h):
    a=C*math.cos(math.radians(h)); b=C*math.sin(math.radians(h))
    l_=L+0.3963377774*a+0.2158037573*b; m_=L-0.1055613458*a-0.0638541728*b; s_=L-0.0894841775*a-1.2914855480*b
    l,m,s=l_**3,m_**3,s_**3
    r=4.0767416621*l-3.3077115913*m+0.2309699292*s; g=-1.2684380046*l+2.6097574011*m-0.3413193965*s; bb=-0.0041960863*l-0.7034186147*m+1.7076147010*s
    return np.clip(np.array([r,g,bb]),0,1)  # linear
def srgb2lin(c): c=np.array(c)/255; return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
W,H=1180,2556; FPS=30; T=8.0; N=int(FPS*T)
stops_base=[(0.00,oklch(0.88,0.06,318)),(0.20,oklch(0.70,0.15,312)),(0.42,oklch(0.50,0.20,318)),(0.66,srgb2lin([0x33,0x01,0x52])),(0.86,srgb2lin([0x16,0x0a,0x22])),(1.00,srgb2lin([0x0f,0x0e,0x13]))]
y=np.linspace(0,1,H)
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-crf','16','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart','breathing_screen.mp4'],stdin=subprocess.PIPE)
for i in range(N):
    t=i/N; ph=0.5-0.5*math.cos(2*math.pi*t)   # 0 ->1 ->0, smooth, loops exactly
    shift=-0.05*ph; gain=1.0+0.22*ph
    pos=[min(1,max(0,s[0]+shift*(1-s[0]))) if 0<s[0]<1 else s[0] for s in stops_base]
    cols=np.array([s[1] for s in stops_base])
    lin=np.stack([np.interp(y,pos,cols[:,k]) for k in range(3)],1)
    # brighten the upper glow band only
    band=np.exp(-((y-0.35)/0.22)**2)[:,None]
    lin=lin*(1+(gain-1)*band)
    srgb=np.where(lin<=0.0031308,lin*12.92,1.055*np.power(np.clip(lin,0,None),1/2.4)-0.055)
    col=(np.clip(srgb,0,1)*255+0.5).astype(np.uint8)
    # subtle dither against banding
    noise=(np.random.rand(H,W,1)-0.5)*1.2
    frame=np.clip(col[:,None,:].astype(np.float32)+noise,0,255).astype(np.uint8)
    frame=np.broadcast_to(frame,(H,W,3))
    p.stdin.write(np.ascontiguousarray(frame).tobytes())
p.stdin.close(); p.wait()
