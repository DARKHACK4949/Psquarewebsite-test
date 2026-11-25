# Work film renderer: real iPhone 18 Max mockup layers, prototype videos on screen,
# a dark brand-colour scene, slow camera, grain. Writes rawvideo to ffmpeg.
import numpy as np, subprocess, json, math, sys
from PIL import Image, ImageFilter
M='/home/user/Psquarewebsite-test/design/mockups/iphone18/'
META=json.load(open(M+'layers.json'))
W,H,FPS=1920,1080,30
def load(i):
    m=META[f'm{i}']; CW,CH=m['canvas']
    def place(name,xy,mode='RGBA'):
        c=Image.new(mode,(CW,CH),0); c.paste(Image.open(M+name).convert(mode),tuple(xy)); return np.array(c).astype(np.float32)/255
    body=place(f'm{i}_body.png',m['body']); sm=place(f'm{i}_screenmask.png',m['screenmask'],'L'); hl=place(f'm{i}_highlights.png',m['highlights'])
    ys,xs=np.where(body[...,3]>0.01); x0,y0,x1,y1=xs.min(),ys.min(),xs.max()+1,ys.max()+1
    q=m['quad']; SQ=[(q[0]-x0,q[1]-y0),(q[2]-x0,q[3]-y0),(q[4]-x0,q[5]-y0),(q[6]-x0,q[7]-y0)]
    return dict(body=body[y0:y1,x0:x1],sm=sm[y0:y1,x0:x1,None],hl=hl[y0:y1,x0:x1],SQ=SQ,w=x1-x0,h=y1-y0)
def coeffs(dst,wh):
    w,h=wh; A=[];B=[]
    for (X,Y),(x,y) in zip(dst,[(0,0),(w,0),(w,h),(0,h)]):
        A+=[[X,Y,1,0,0,0,-x*X,-x*Y],[0,0,0,X,Y,1,-y*X,-y*Y]]; B+=[x,y]
    return tuple(np.linalg.solve(np.array(A,float),np.array(B,float)))
def device(D,screen,bright=0.88):
    fr=Image.fromarray(screen)
    sc=np.array(fr.transform((D['w'],D['h']),Image.PERSPECTIVE,coeffs(D['SQ'],fr.size),Image.BICUBIC)).astype(np.float32)/255*bright
    sm=D['sm']; rgb=D['body'][...,:3]*(1-sm)+sc*sm; a=np.maximum(D['body'][...,3:4],sm)
    h=D['hl'][...,:3]*D['hl'][...,3:4]; rgb=1-(1-rgb)*(1-h*0.9)
    return np.concatenate([rgb*a,a],2)   # premultiplied
def place(canvas,dev,cx,top,scale,blur=0,dim=1.0):
    h,w=dev.shape[:2]; nw,nh=max(1,int(w*scale)),max(1,int(h*scale))
    im=Image.fromarray((np.clip(dev,0,1)*255).astype(np.uint8),'RGBA').resize((nw,nh),Image.LANCZOS)
    if blur: im=im.filter(ImageFilter.GaussianBlur(blur))
    d=np.array(im).astype(np.float32)/255
    x=int(round(cx-nw/2)); y=int(round(top))
    sx0,sy0=max(0,-x),max(0,-y); dx0,dy0=max(0,x),max(0,y)
    ww=min(nw-sx0,W-dx0); hh=min(nh-sy0,H-dy0)
    if ww<=0 or hh<=0: return
    s=d[sy0:sy0+hh,sx0:sx0+ww]; reg=canvas[dy0:dy0+hh,dx0:dx0+ww]
    canvas[dy0:dy0+hh,dx0:dx0+ww]=reg*(1-s[...,3:4])+s[...,:3]*dim
def bg(glow=(0.70,0.36),c1=(0x3a,0x23,0x80),c2=(0x22,0x12,0x4c)):
    yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
    base=np.array([7,6,12],np.float32)/255
    g1=np.exp(-(((xx-glow[0]*W)/(0.42*W))**2+((yy-glow[1]*H)/(0.55*H))**2))[...,None]
    g2=np.exp(-(((xx-0.95*W)/(0.35*W))**2+((yy-1.0*H)/(0.4*H))**2))[...,None]
    img=base+g1*(np.array(c1,np.float32)/255-base)*0.85+g2*(np.array(c2,np.float32)/255)*0.6
    vig=1-0.35*(((xx-W/2)/(W/2))**2+((yy-H/2)/(H/2))**2)[...,None]*0.5
    return np.clip(img*vig,0,1)
class Video:
    def __init__(s,path,start=0):
        s.w,s.h=map(int,subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',path]).decode().split(','))
        s.p=subprocess.Popen(['ffmpeg','-v','error','-ss',str(start),'-i',path,'-vf','fps=30','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE); s.last=None
    def next(s):
        b=s.p.stdout.read(s.w*s.h*3)
        if len(b)==s.w*s.h*3: s.last=np.frombuffer(b,np.uint8).reshape(s.h,s.w,3)
        return s.last
def still(path,t):
    return np.array(Image.open(subprocess.Popen(['ffmpeg','-v','error','-ss',str(t),'-i',path,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],stdout=subprocess.PIPE).stdout).convert('RGB'))
def ease(t): return t*t*(3-2*t)
def cam(canvas,zoom,fx,fy,dx=0):
    if zoom==1 and dx==0: return canvas
    im=Image.fromarray((np.clip(canvas,0,1)*255).astype(np.uint8))
    a=1/zoom; im=im.transform((W,H),Image.AFFINE,(a,0,fx-a*fx-dx*a,0,a,fy-a*fy),Image.BICUBIC)
    return np.array(im).astype(np.float32)/255
