// Usage: node design/films/capability_wall.cjs [key] (frames go to ./capvid/<key>; encode with ffmpeg into public/media/home/caps)
// Renders a capability film: a tilted 3D wall of real screens, the camera gliding
// across it by exactly one pattern width, so the clip loops without a seam.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const S = '/home/user/Psquarewebsite-test/design/wall/screens/';
const R = '/home/user/Psquarewebsite-test/design/showreel/';
const C = '/home/user/Psquarewebsite-test/design/films/caps-src/';
const sets = {
  suryacon: { bg: '#dde7e8', cols: [[C+'erp-inventory.webp', C+'erp-map.webp'], [S+'v5_mac_suryacon_dashboard.jpg', C+'erp-orders.webp'], [C+'erp-rented.webp', C+'erp-inventory.webp', C+'erp-map.webp'], [C+'erp-orders.webp', S+'v5_mac_suryacon_dashboard.jpg']] },
  'sline-services': { bg: '#e4e0ee', cols: [[S+'v4_phone_01_SLine_Technician_Jobs.jpg'], [S+'01_SLine_Service_Dashboard_Live_Map.jpg', S+'04_SLine_Client_SOS_Emergency.jpg'], [S+'v4_phone_02_SLine_Technician_Navigation.jpg'], [S+'01_SLine_Client_Home_Live_Service.jpg', S+'01_SLine_Service_Dashboard_Live_Map.jpg']] },
  sline: { bg: '#dfe4ee', cols: [[S+'01_SLine_Sales_Home_Sales.jpg'], [S+'01_SLine_Sales_Dashboard.jpg', S+'05_SLine_Sales_Elevator_Catalogue.jpg'], [S+'02_SLine_Sales_Team.jpg'], [S+'05_SLine_Sales_Elevator_Catalogue.jpg', S+'01_SLine_Sales_Dashboard.jpg']] },
  arcgrow: { bg: '#e4e4e8', cols: [[S+'02_ArcGrow_Board.jpg'], [S+'07_ArcGrow_Portfolio.jpg', S+'05_ArcGrow_Arc_Chats.jpg'], [S+'04_ArcGrow_Calendar.jpg'], [S+'05_ArcGrow_Arc_Chats.jpg', S+'07_ArcGrow_Portfolio.jpg']] },
  tathasthu: { bg: '#ece5db', cols: [[C+'ai-take1.webp', C+'ai-prompt.webp', C+'ai-take3.webp'], [S+'v5_mac_tathasthu_home.png', R+'tathasthu-ai-rooms.jpg'], [C+'ai-take3.webp', C+'ai-take1.webp', C+'ai-prompt.webp'], [R+'tathasthu-ai-rooms.jpg', S+'v5_mac_tathasthu_home.png']] },
};
const SIZE = 1200, FPS = 25, SECS = 12, COLW = 440, GAP = 36;
const which = process.argv[2];
(async () => {
  const b = await chromium.launch();
  for (const [key, set] of Object.entries(sets)) {
    if (which && which !== key) continue;
    const blockW = set.cols.length * (COLW + GAP);
    const colHtml = (imgs, ci) => {
      const cards = [];
      for (let r = 0; r < 4; r++) for (const src of imgs) cards.push(src);
      const z = [0, 70, 20, 50][ci % 4];
      return `<div class="col" style="margin-top:${[-120, -420, -40, -300][ci % 4]}px;transform:translateZ(${z}px)">${cards.map(s => `<div class="card"><img src="file://${s}"></div>`).join('')}</div>`;
    };
    const block = set.cols.map(colHtml).join('');
    const html = `<!doctype html><html><head><style>
      html,body{margin:0;width:${SIZE}px;height:${SIZE}px;overflow:hidden;background:${set.bg}}
      .cam{position:absolute;inset:0;perspective:1700px;perspective-origin:50% 40%}
      .wall{position:absolute;left:50%;top:50%;width:${blockW * 4}px;transform-style:preserve-3d;display:flex;gap:${GAP}px}
      .col{width:${COLW}px;flex:none;display:flex;flex-direction:column;gap:${GAP}px;transform-style:preserve-3d}
      .card{border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.06),0 28px 60px -18px rgba(30,30,50,.35)}
      .card img{display:block;width:100%;height:auto}
      .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(20,20,30,.28))}
    </style></head><body><div class="cam"><div class="wall" id="w">${block}${block}${block}${block}</div></div><div class="vig"></div>
    <script>
      const w=document.getElementById('w');
      window.setT=t=>{const x=-${blockW}*1.5 - ${blockW}*t; const y=-1300 - 260*t;
        w.style.transform='translate3d('+x+'px,'+y+'px,0) rotateX(32deg) rotateZ(-14deg)';};
      setT(0);
    </script></body></html>`;
    const dir = `capvid/${key}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/scene.html`, html);
    const p = await b.newPage({ viewport: { width: SIZE, height: SIZE } });
    await p.goto(`file://${process.cwd()}/${dir}/scene.html`);
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(800);
    const N = FPS * SECS;
    for (let i = 0; i < N; i++) {
      await p.evaluate(t => setT(t), i / N);
      await p.screenshot({ path: `${dir}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 });
    }
    await p.close();
    console.log(key, 'frames done');
  }
  await b.close();
})();
