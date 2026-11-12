/* ---------- jocul: Drumul trăsăturilor (original) ---------- */
/* Personajul merge singur din punct în punct; la fiecare felinar apare o informație din articol. */
var TRAITS = [
  {w: "Onest", ok: true,  why: "Trăsătură de personalitate. Articolul nu o contestă."},
  {w: "Inteligent", ok: false, why: "E o abilitate, nu personalitate. Psihologia o scoate din personalitate (p. 151)."},
  {w: "Imaginativ", ok: true,  why: "Trăsătură de personalitate. Articolul nu o contestă."},
  {w: "Occidental", ok: false, why: "Ține de valori și cultură, nu de caracter (p. 152)."},
  {w: "Îndrăzneț", ok: true,  why: "Trăsătură de personalitate. Articolul nu o contestă."},
  {w: "De clasă superioară", ok: false, why: "Descrie clientul tipic, nu brandul (p. 152)."},
  {w: "Vesel", ok: true,  why: "Trăsătură de personalitate. Articolul nu o contestă."},
  {w: "De oraș mic", ok: false, why: "A scăzut fiabilitatea scalei într-un studiu britanic (p. 152)."}
];
var game = null;
function Game(el, onDone, opt){
  opt = opt || {};
  var cv = $(".gm", el), cx = cv.getContext("2d"), W = 1920, H = 1080;
  var progEl = $(".gscore", el);
  var rnd = (function(seed){ return function(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; })(7);
  var pathY = function(x){ return 650 + Math.sin(x / 260) * 70 + Math.sin(x / 97) * 12; };
  var lanterns = TRAITS.map(function(t, i){
    var x = 330 + i * 168, side = i % 2 ? 1 : -1;
    return {t: t, x: x, y: pathY(x) + side * 118, side: side, seen: false, glow: 0};
  });
  var portal = {x: 1765, y: pathY(1765), open: 0, lit: [0, 0, 0, 0, 0]};
  var P = {x: 150, dir: 1, walk: 0, v: 0};
  var ti = -1, t = 0, last = 0, raf = 0, alive = true, finished = false, fade = 0;
  var grass = [];
  for(var i = 0; i < 800; i++){
    var gx = rnd() * W, gy = 330 + rnd() * 700;
    if(Math.abs(gy - pathY(gx)) < 46) continue;
    grass.push({x: gx, y: gy, h: 8 + rnd() * 16, ph: rnd() * 6.28, c: 24 + Math.floor(rnd() * 12)});
  }
  grass.sort(function(a, b){ return a.y - b.y; });
  var bushes = [];
  for(var j = 0; j < 26; j++){ var bx = rnd() * W, by = rnd() < .5 ? 360 + rnd() * 60 : 900 + rnd() * 30; bushes.push({x: bx, y: by, r: 28 + rnd() * 46}); }
  var flies = [];
  for(var k = 0; k < 46; k++) flies.push({x: rnd() * W, y: 330 + rnd() * 720, ph: rnd() * 6.28, sp: .3 + rnd() * .6, o: rnd() < .25});
  var stones = [];
  for(var q = 40; q < 1720; q += 34) stones.push({x: q + rnd() * 10, y: pathY(q) + (rnd() - .5) * 30, r: 5 + rnd() * 6});

  function targetX(){ return ti < 0 ? 150 : ti < 8 ? lanterns[ti].x : portal.x; }
  function seenCount(){ return lanterns.filter(function(l){ return l.seen; }).length; }
  function prog(){ progEl.innerHTML = "<b>" + seenCount() + " / 8</b>trăsături"; }
  prog();

  function wrap(text, maxW){
    var ws = text.split(" "), lines = [], line = "";
    ws.forEach(function(w){ var tst = line ? line + " " + w : w; if(cx.measureText(tst).width > maxW && line){ lines.push(line); line = w; } else line = tst; });
    lines.push(line); return lines;
  }
  function rr(x, y, w, h, r){ cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
  function arrived(){ return Math.abs(P.x - targetX()) < 2; }

  function update(dt){
    t += dt;
    var tx = targetX(), d = tx - P.x, sp = 560;
    if(Math.abs(d) > 1){
      var step = Math.sign(d) * Math.min(Math.abs(d), sp * dt * Math.min(1, Math.abs(d) / 60 + .35));
      P.x += step; P.v = Math.abs(step) / dt; P.dir = d > 0 ? 1 : -1; P.walk += Math.abs(step) * .045;
    } else { P.x = tx; P.v = 0; }
    if(ti >= 0 && ti < 8 && arrived() && !lanterns[ti].seen){ lanterns[ti].seen = true; prog(); }
    lanterns.forEach(function(l){ l.glow += ((l.seen ? (l.t.ok ? 1 : .3) : 0) - l.glow) * Math.min(1, dt * 3); });
    var n = seenCount();
    for(var i = 0; i < 5; i++){ var target = n >= Math.ceil((i + 1) * 8 / 5) ? 1 : 0; portal.lit[i] += (target - portal.lit[i]) * Math.min(1, dt * 3); }
    portal.open += ((n === 8 ? 1 : 0) - portal.open) * Math.min(1, dt * 2);
    if(ti === 8 && arrived() && !finished) finished = true;
    if(finished){ fade = Math.min(1, fade + dt * 1.8); if(fade >= 1 && alive){ alive = false; if(onDone) onDone(); } }
  }

  function draw(){
    var py = pathY(P.x);
    cx.fillStyle = "#0B0B0B"; cx.fillRect(0, 0, W, H);
    var g0 = cx.createRadialGradient(P.x, py, 10, P.x, py, 520);
    g0.addColorStop(0, "rgba(255,106,31,0.05)"); g0.addColorStop(1, "rgba(255,106,31,0)");
    cx.fillStyle = g0; cx.fillRect(0, 0, W, H);
    bushes.forEach(function(b){ cx.fillStyle = "#0f0f0e"; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 6.283); cx.fill(); });
    cx.lineCap = "round"; cx.lineJoin = "round";
    cx.strokeStyle = "#151413"; cx.lineWidth = 92; cx.beginPath();
    for(var x = 0; x <= 1780; x += 20){ var y = pathY(x); x ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke();
    stones.forEach(function(s){ cx.fillStyle = "#1d1c1a"; cx.beginPath(); cx.ellipse(s.x, s.y, s.r * 1.4, s.r, 0, 0, 6.283); cx.fill(); });
    cx.lineWidth = 1.6;
    grass.forEach(function(b){
      var sw = Math.sin(t * 1.3 + b.ph + b.x * .004) * 5;
      var near = Math.hypot(b.x - P.x, b.y - py) < 50 ? (b.x < P.x ? -6 : 6) : 0;
      var c = b.c; cx.strokeStyle = "rgb(" + c + "," + (c - 1) + "," + (c - 3) + ")";
      cx.beginPath(); cx.moveTo(b.x, b.y); cx.quadraticCurveTo(b.x + sw * .4, b.y - b.h * .6, b.x + sw + near, b.y - b.h); cx.stroke();
    });
    /* poarta: cercul cu 5 segmente */
    for(var i = 0; i < 5; i++){
      var a0 = (-90 + i * 72 + 4) * Math.PI / 180, a1 = (-90 + (i + 1) * 72 - 4) * Math.PI / 180, m = (a0 + a1) / 2, off = portal.open * 14;
      cx.strokeStyle = portal.lit[i] > .5 ? "rgba(255,106,31," + (.4 + .6 * portal.lit[i]) + ")" : "#2c2b29";
      cx.lineWidth = 22; cx.lineCap = "butt";
      cx.beginPath(); cx.arc(portal.x + Math.cos(m) * off, portal.y - 40 + Math.sin(m) * off, 78, a0, a1); cx.stroke();
    }
    if(portal.open > .05){
      var pg = cx.createRadialGradient(portal.x, portal.y - 40, 5, portal.x, portal.y - 40, 160);
      pg.addColorStop(0, "rgba(255,106,31," + .35 * portal.open + ")"); pg.addColorStop(1, "rgba(255,106,31,0)");
      cx.fillStyle = pg; cx.fillRect(portal.x - 170, portal.y - 210, 340, 340);
    }
    var items = lanterns.map(function(l){ return {y: l.y, f: function(){ lantern(l); }}; });
    if(!opt.still) items.push({y: py, f: hero});
    items.sort(function(a, b){ return a.y - b.y; }).forEach(function(it){ it.f(); });
    flies.forEach(function(f){
      var fx = f.x + Math.sin(t * f.sp + f.ph) * 30, fy = f.y + Math.cos(t * f.sp * .8 + f.ph) * 20, a = .25 + .35 * (Math.sin(t * 2 + f.ph) * .5 + .5);
      cx.fillStyle = f.o ? "rgba(255,106,31," + a + ")" : "rgba(242,239,234," + a * .7 + ")";
      cx.beginPath(); cx.arc(fx, fy, f.o ? 2.4 : 1.8, 0, 6.283); cx.fill();
    });
    if(ti >= 0 && ti < 8 && lanterns[ti].seen && arrived()) card(lanterns[ti]);
    if(fade > 0){ cx.fillStyle = "rgba(11,11,11," + fade + ")"; cx.fillRect(0, 0, W, H); }
  }
  function lantern(l){
    var x = l.x, y = l.y;
    cx.fillStyle = "rgba(0,0,0,.5)"; cx.beginPath(); cx.ellipse(x, y + 4, 30, 9, 0, 0, 6.283); cx.fill();
    if(l.glow > .02){
      var g = cx.createRadialGradient(x, y - 70, 4, x, y - 70, 150);
      g.addColorStop(0, "rgba(255,106,31," + .45 * l.glow + ")"); g.addColorStop(1, "rgba(255,106,31,0)");
      cx.fillStyle = g; cx.fillRect(x - 160, y - 230, 320, 320);
    }
    cx.fillStyle = "#2f2d2a"; cx.fillRect(x - 7, y - 50, 14, 50);
    cx.fillStyle = "#3a3836"; rr(x - 22, y - 92, 44, 44, 6); cx.fill();
    cx.fillStyle = !l.seen ? "#161514" : l.t.ok ? "#FF6A1F" : "#5a3a2a"; cx.fillRect(x - 12, y - 82, 24, 24);
    cx.fillStyle = "#3a3836"; cx.beginPath(); cx.moveTo(x - 30, y - 92); cx.lineTo(x, y - 112); cx.lineTo(x + 30, y - 92); cx.closePath(); cx.fill();
    cx.font = "600 21px Inter"; cx.textAlign = "center";
    var tw = cx.measureText(l.t.w).width + 24, sy = y + 22;
    cx.fillStyle = "#1a1917"; rr(x - tw / 2, sy, tw, 34, 4); cx.fill();
    cx.fillStyle = l.seen && !l.t.ok ? "rgba(242,239,234,.45)" : "#F2EFEA"; cx.fillText(l.t.w, x, sy + 24);
    if(l.seen && !l.t.ok){ cx.strokeStyle = "#FF6A1F"; cx.lineWidth = 3; var w2 = cx.measureText(l.t.w).width; cx.beginPath(); cx.moveTo(x - w2 / 2 - 4, sy + 17); cx.lineTo(x + w2 / 2 + 4, sy + 17); cx.stroke(); }
  }
  function hero(){
    var y = pathY(P.x) + 10;
    cx.save(); cx.translate(P.x, y); cx.scale(1.35, 1.35); cx.translate(-P.x, -y);
    heroDraw(P.x, y); cx.restore();
  }
  function heroDraw(x, y){
    var moving = P.v > 20, bob = moving ? Math.abs(Math.sin(P.walk * 3)) * 5 : Math.sin(t * 2) * 1.2;
    cx.fillStyle = "rgba(0,0,0,.55)"; cx.beginPath(); cx.ellipse(x, y + 2, 20, 7, 0, 0, 6.283); cx.fill();
    var leg = moving ? Math.sin(P.walk * 3) * 5 : 0;
    cx.strokeStyle = "#cfcac2"; cx.lineWidth = 5; cx.lineCap = "round";
    cx.beginPath(); cx.moveTo(x - 6, y - 14); cx.lineTo(x - 6 + leg, y - 1); cx.moveTo(x + 6, y - 14); cx.lineTo(x + 6 - leg, y - 1); cx.stroke();
    var by = y - 16 - bob;
    cx.fillStyle = "#F2EFEA"; rr(x - 15, by - 30, 30, 32, 11); cx.fill();
    cx.fillStyle = "#FF6A1F"; cx.fillRect(x - 15, by - 31, 30, 7);
    var fl = Math.sin(t * 6 + P.walk * 2) * 4;
    cx.beginPath(); cx.moveTo(x - P.dir * 12, by - 30); cx.quadraticCurveTo(x - P.dir * 26, by - 26 + fl, x - P.dir * 34, by - 18 + fl); cx.lineTo(x - P.dir * 30, by - 14 + fl); cx.quadraticCurveTo(x - P.dir * 22, by - 22, x - P.dir * 10, by - 24); cx.closePath(); cx.fill();
    cx.fillStyle = "#F2EFEA"; cx.beginPath(); cx.arc(x, by - 46, 15, 0, 6.283); cx.fill();
    cx.fillStyle = "#0B0B0B"; cx.beginPath(); cx.arc(x + P.dir * 6, by - 48, 2.2, 0, 6.283); cx.arc(x + P.dir * 12, by - 48, 2.2, 0, 6.283); cx.fill();
  }
  function card(l){
    var w = 460, left = l.x + 70;
    if(left + w > W - 120) left = l.x - 70 - w;
    var bx = left + w / 2;
    cx.font = "400 22px Inter"; var lines = wrap(l.t.why, w - 60), hh = 96 + lines.length * 30;
    var top = l.side < 0 ? l.y - 170 : l.y - 90;
    cx.fillStyle = "rgba(18,18,18,.96)"; rr(bx - w / 2, top, w, hh, 10); cx.fill();
    cx.strokeStyle = l.t.ok ? "#FF6A1F" : "rgba(242,239,234,.25)"; cx.lineWidth = 2; cx.stroke();
    cx.textAlign = "left"; cx.font = "600 15px Inter"; cx.fillStyle = "#FF6A1F";
    cx.fillText(l.t.ok ? "PERSONALITATE" : "CONTESTAT", bx - w / 2 + 30, top + 38);
    cx.font = "850 34px Archivo"; cx.fillStyle = "#F2EFEA"; cx.fillText(l.t.w, bx - w / 2 + 30, top + 76);
    cx.font = "400 22px Inter"; cx.fillStyle = "rgba(242,239,234,.78)";
    lines.forEach(function(ln, i){ cx.fillText(ln, bx - w / 2 + 30, top + 110 + i * 30); });
  }
  function frame(now){
    var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    update(dt); draw();
    if(alive) raf = requestAnimationFrame(frame);
  }
  if(opt.still){
    lanterns.forEach(function(l){ l.seen = true; l.glow = l.t.ok ? 1 : .3; });
    portal.lit = [1, 1, 1, 1, 1]; portal.open = 1; prog(); draw();
    return {advance: function(){ return false; }, back: function(){ return false; }, stop: function(){}};
  }
  raf = requestAnimationFrame(frame);
  return {
    advance: function(){
      if(finished) return false;
      if(!arrived()){ P.x = targetX(); return true; }
      if(ti < 8){ ti++; return true; }
      return false;
    },
    back: function(){
      if(finished) return true;
      if(ti <= -1) return false;
      ti--; return true;
    },
    stop: function(){ alive = false; cancelAnimationFrame(raf); }
  };
}
