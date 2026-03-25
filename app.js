// ================================================================
// OPERION SYSTEMS LTD — app.js (FULLY INTEGRATED BUILD)
// Includes: API, Stripe, Demo Page, Logo/Favicon Injection
// ================================================================

// ── CONFIG ───────────────────────────────────────────────────────
const OPERION = {
  BASE_URL: 'https://YOUR-N8N-INSTANCE.com',
  SECRET:   'YOUR-NETLIFY-WEBHOOK-SECRET',

  PATHS: {
    ONBOARD: '/webhook/operion/onboard',
    DASHBOARD: '/webhook/operion/dashboard',
    DEMO_REQUEST: '/webhook/operion/demo-request',
  },

  STRIPE: {
    PUBLISHABLE_KEY: 'pk_live_YOUR_STRIPE_PUBLISHABLE_KEY',
    PRICES: {
      TIER_1: 'price_TIER1_ID',
      TIER_2: 'price_TIER2_ID',
      TIER_3: 'price_TIER3_ID',
      TIER_4: 'price_TIER4_ID',
    },
    SUCCESS_URL: '/get-started?paid=true',
    CANCEL_URL: '/pricing',
  }
};

// ── HELPERS ──────────────────────────────────────────────────────
const $ = (s, p=document)=>p.querySelector(s);
const $$ = (s, p=document)=>[...p.querySelectorAll(s)];

async function apiCall(path, options={}) {
  try {
    const res = await fetch(OPERION.BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    return { ok: res.ok, data: await res.json() };
  } catch {
    return { ok:false };
  }
}

function setLoading(btn, state, text='Processing...'){
  if(!btn) return;
  btn.disabled = state;
  btn.textContent = state ? text : btn.dataset.original || btn.textContent;
}

// ── LOGO + FAVICON AUTO-INJECT ───────────────────────────────────
function initBranding(){
  // Logo swap
  const logos = $$('[data-logo]');
  logos.forEach(el=>{
    el.src = '/logo.svg';
  });

  // Favicon inject (if not present)
  if (!document.querySelector("link[rel='icon']")) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
  }
}

// ── STRIPE ───────────────────────────────────────────────────────
function initStripe(){
  if (typeof Stripe === 'undefined') return;

  const stripe = Stripe(OPERION.STRIPE.PUBLISHABLE_KEY);

  $$('[data-checkout-tier]').forEach(btn=>{
    btn.dataset.original = btn.textContent;

    btn.onclick = async ()=>{
      const tier = btn.dataset.checkoutTier;
      const priceId = OPERION.STRIPE.PRICES[`TIER_${tier}`];

      if (!priceId || priceId.includes('TIER')) {
        alert('Stripe not configured');
        return;
      }

      setLoading(btn,true,'Redirecting...');

      await stripe.redirectToCheckout({
        lineItems:[{price:priceId,quantity:1}],
        mode:'subscription',
        successUrl: location.origin + OPERION.STRIPE.SUCCESS_URL,
        cancelUrl: location.origin + OPERION.STRIPE.CANCEL_URL
      });
    };
  });
}

// ── DEMO PAGE (FULL IMPLEMENTATION) ───────────────────────────────
function initDemo(){
  const form = $('#demo-form');
  const chatBox = $('#demo-chat');
  const input = $('#demo-input');
  const sendBtn = $('#demo-send');

  if (!form && !sendBtn) return;

  function addMsg(text, type='bot'){
    if (!chatBox) return;
    const div = document.createElement('div');
    div.className = `demo-msg ${type}`;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function handleSend(){
    const msg = input.value.trim();
    if (!msg) return;

    addMsg(msg,'user');
    input.value = '';

    // Fake AI response (until backend connected)
    addMsg('Thinking...','bot');

    setTimeout(()=>{
      chatBox.lastChild.textContent =
        'This is a demo AI response. Connect your backend to make this live.';
    },800);
  }

  if (sendBtn){
    sendBtn.onclick = handleSend;
  }

  if (input){
    input.addEventListener('keypress',e=>{
      if(e.key==='Enter') handleSend();
    });
  }

  if (form){
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();

      const btn = $('#demo-submit');
      setLoading(btn,true,'Sending...');

      const data = Object.fromEntries(new FormData(form));

      const res = await apiCall(OPERION.PATHS.DEMO_REQUEST,{
        method:'POST',
        body: JSON.stringify(data)
      });

      setLoading(btn,false);

      alert(res.ok ? 'Demo request sent' : 'Error sending request');
      if(res.ok) form.reset();
    });
  }
}

// ── ONBOARDING ───────────────────────────────────────────────────
function initOnboarding(){
  const form = $('#onboarding-form');
  if (!form) return;

  form.addEventListener('submit', async e=>{
    e.preventDefault();

    const btn = $('#onboard-submit');
    setLoading(btn,true,'Submitting...');

    const payload = Object.fromEntries(new FormData(form));
    payload.operion_secret = OPERION.SECRET;

    const res = await apiCall(OPERION.PATHS.ONBOARD,{
      method:'POST',
      body: JSON.stringify(payload)
    });

    setLoading(btn,false);

    if(res.ok && res.data?.status==='onboarded'){
      location.href = '/onboard-success.html';
    } else {
      alert('Onboarding failed');
    }
  });
}

// ── DASHBOARD (BASIC LOAD) ───────────────────────────────────────
async function initDashboard(){
  const container = $('#dashboard-content');
  if (!container) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('business_id');
  const key = params.get('api_key');

  if (!id || !key) return;

  const res = await apiCall(
    OPERION.PATHS.DASHBOARD +
    `?business_id=${id}&api_key=${key}`
  );

  if (!res.ok) {
    container.innerHTML = 'Failed to load dashboard';
    return;
  }

  container.innerHTML = `
    <h2>${res.data.business_name}</h2>
    <p>Tier: ${res.data.tier_name}</p>
  `;
}

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  initBranding();     // ✅ logo + favicon
  initStripe();       // ✅ payments
  initDemo();         // ✅ demo.html live
  initOnboarding();   // ✅ onboarding
  initDashboard();    // ✅ dashboard
});
