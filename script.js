(function () {
  // ================= SETTINGS =================
  var TG_LINK = "https://t.me/+QkEWi70rQrAzYTk1";
  var AUTO_REDIRECT = true;   // false = sirf button se Telegram khulega
  var TIMER_SECONDS = 8;
  var RETURN_DELAY_MS = 300;  // dobara aane wale ko kitni jaldi bhejna hai
  // ============================================

  var KEY_VISITED = "rtt_visited", KEY_EVT = "rtt_sub";
  var loadTime = Date.now();
  document.getElementById("yr").textContent = new Date().getFullYear();

  function setFlag(k){
    try{localStorage.setItem(k,"1")}catch(e){}
    document.cookie = k+"=1; max-age="+(60*60*24*180)+"; path=/; SameSite=Lax";
  }
  function hasFlag(k){
    try{ if(localStorage.getItem(k)) return true }catch(e){}
    return document.cookie.indexOf(k+"=1") !== -1;
  }
  function goTelegram(){ setFlag(KEY_VISITED); window.location.href = TG_LINK; }

  // TEST MODE: URL ke end me ?test lagao -> purane flags mit jayenge, har baar page normal khulega
  if (/[?&]test\b/.test(location.search)) {
    [KEY_VISITED, KEY_EVT].forEach(function(k){
      try{localStorage.removeItem(k)}catch(e){}
      document.cookie = k+"=; max-age=0; path=/; SameSite=Lax";
    });
  }

  // Human interaction check: touch / scroll / mouse / keyboard
  var interacted = false;
  function markHuman(e){ if (e && e.isTrusted === false) return; interacted = true; }
  ["pointerdown","touchstart","mousemove","keydown","wheel"].forEach(function(ev){
    window.addEventListener(ev, markHuman, {passive:true, capture:true});
  });
  window.addEventListener("scroll", markHuman, {passive:true});

  // Subscribe: sirf asli click, sirf ek baar, bot filter
  function fireEventOnce(e){
    if (hasFlag(KEY_EVT)) return;
    if (navigator.webdriver) return;
    if (Date.now() - loadTime < 800) return;
    if (e && e.isTrusted === false) return;
    if (!interacted) return;
    if (typeof fbq === "function") fbq("track","Subscribe",{},{eventID:"rtt_sub_"+loadTime});
    setFlag(KEY_EVT);
  }

  var cta = document.querySelector(".js-cta");
  var timerLine = document.querySelector(".js-timer-line");
  var timerEl = document.querySelector(".js-timer");
  var ring = document.querySelector(".js-ring");
  var C = 119.4, countdown;

  cta.href = TG_LINK;
  cta.addEventListener("click", function(e){
    e.preventDefault();
    if (countdown) clearInterval(countdown);
    fireEventOnce(e);
    setTimeout(goTelegram, 300);
  });

  // Returning visitor: timer skip, turant Telegram, event nahi
  if (hasFlag(KEY_VISITED)) {
    timerLine.innerHTML = "<div>ಚಾನೆಲ್ ತೆರೆಯುತ್ತಿದೆ…<span class='en'>Opening channel…</span></div>";
    setTimeout(goTelegram, RETURN_DELAY_MS);
    return;
  }

  if (!AUTO_REDIRECT) { timerLine.style.display = "none"; return; }
  var left = TIMER_SECONDS;
  function paint(){
    timerEl.textContent = left;
    ring.style.strokeDashoffset = (C * (1 - left / TIMER_SECONDS)).toFixed(1);
  }
  paint();
  countdown = setInterval(function(){
    left--; paint();
    if (left <= 0){ clearInterval(countdown); goTelegram(); }
  }, 1000);
})();
