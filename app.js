// app.js - 恒微足道 mobile APP
// SPA with hash-based routing, loads from data.json

const { stores, technicians, serviceGroups } = window.__APP_DATA__;

const LINXIA_STORES = ['临夏中天健店', '临夏义乌店'];
const NANGUAN_STORES = ['南关总店', '安宁刘家堡店'];
const XINQU_STORES = ['新区店'];
const LINTAO_STORES = ['临洮店'];

function getServicesByStoreName(name) {
  if (LINXIA_STORES.some(s => name.includes(s.split('临夏')[1] ? name.includes(s) : false))) {
    if (name.includes('临夏中天健') || name.includes('临夏义乌')) return serviceGroups.LINXIA;
  }
  if (name.includes('南关总店') || name.includes('安宁刘家堡')) return serviceGroups.NANGUAN;
  if (name.includes('新区')) return serviceGroups.XINQU;
  if (name.includes('临洮')) return serviceGroups.LINTAO;
  return serviceGroups.COMMON;
}

// Route registry
const routes = {};
let currentPage = '';
let historyStack = [];

function route(path, handler) { routes[path] = handler; }

function navigate(path, addToHistory = true) {
  if (addToHistory && currentPage) historyStack.push(currentPage);
  currentPage = path;
  window.location.hash = path;
  render();
}

function goBack() {
  if (historyStack.length > 0) {
    currentPage = historyStack.pop();
    window.location.hash = currentPage;
    render();
  } else {
    navigate('home');
  }
}

function render() {
  const hash = window.location.hash.slice(1) || 'home';
  const [path, query] = hash.split('?');
  const params = {};
  if (query) query.split('&').forEach(kv => { const [k,v]=kv.split('='); params[k]=v; });
  const handler = routes[path] || routes['home'];
  const container = document.getElementById('app');
  handler(container, params);
  window.scrollTo(0, 0);
}

// ─── STORES ────────────────────────────────────────────
function getStoreNameFromId(id) {
  const s = stores.find(s => s.id == id);
  return s ? s.name : '未知门店';
}

// ─── PAGES ─────────────────────────────────────────────

route('home', (el, params) => {
  const hotServices = serviceGroups.COMMON.slice(0, 4);
  const notices = [
    { tag: '新客', text: '首次到店享受专属优惠套餐，扫码即享' },
    { tag: '周二', text: '每周二主项目五折，特价项目除外' },
    { tag: '充值', text: '充值金额永久有效，会员专属折扣' },
  ];
  el.innerHTML = `
    <div class="page-home">
      <div class="banner">
        <img src="LOGO.png" class="banner-logo" onerror="this.style.display='none'">
        <div class="banner-slogan">专业足疗 · 经络调理 · 健康养生</div>
        <div class="banner-hours">🕐 营业：12:00 - 次日 05:00</div>
      </div>
      <div class="quick-grid">
        <div class="quick-item" onclick="navigate('booking')">
          <div class="quick-icon">📅</div><div class="quick-label">立即预约</div>
        </div>
        <div class="quick-item" onclick="navigate('stores')">
          <div class="quick-icon">📍</div><div class="quick-label">门店查询</div>
        </div>
        <div class="quick-item" onclick="navigate('services')">
          <div class="quick-icon">💆</div><div class="quick-label">服务项目</div>
        </div>
        <div class="quick-item" onclick="navigate('member')">
          <div class="quick-icon">👑</div><div class="quick-label">会员中心</div>
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">热门服务</span></div>
        <div class="service-list">
          ${hotServices.map(s => `
          <div class="service-card" onclick="navigate('service-detail', false);window.__svc=${JSON.stringify(s).replace(/"/g,'&quot;')}">
            <div class="svc-img" style="background:${['#3d2010','#1a2e1a','#1a1a3d','#2d1a1a'][hotServices.indexOf(s)]}">
              <span class="svc-emoji">${s.emoji}</span>
              ${s.tag ? `<span class="svc-tag">${s.tag}</span>` : ''}
            </div>
            <div class="svc-info">
              <div class="svc-name">${s.name}</div>
              <div class="svc-meta">${s.duration}分钟 · ${s.desc}</div>
              <div class="svc-price">¥${s.price}</div>
            </div>
          </div>`).join('')}
        </div>
        <button class="btn-outline mt8" onclick="navigate('services')">查看全部服务 ›</button>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">门店分布</span><span class="section-more" onclick="navigate('stores')">全部16家 ›</span></div>
        <div class="store-preview-list">
          ${stores.slice(0,3).map(s => `
          <div class="store-row" onclick="navigate('store-detail', false);window.__storeId=${s.id}">
            <div class="store-row-left">
              <div class="store-row-name">${s.name}${s.type==='总店'?'<span class="badge-gold">总店</span>':''}</div>
              <div class="store-row-addr">📍 ${s.address}</div>
              <div class="store-row-hours">🕐 ${s.hours}</div>
            </div>
            <div class="store-row-act">
              <button class="btn-gold-sm" onclick="event.stopPropagation();navigate('booking')">预约</button>
            </div>
          </div>`).join('')}
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">最新活动</span></div>
        <div class="notice-list">
          ${notices.map(n => `
          <div class="notice-row">
            <span class="badge-red">${n.tag}</span>
            <span class="notice-text">${n.text}</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">免费享用</span></div>
        <div class="free-grid">
          ${['茶水','水果','小吃','Wi-Fi'].map((f,i) => `
          <div class="free-item"><span class="free-icon">${['🍵','🍎','🍪','📶'][i]}</span><span>${f}</span></div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
});

route('services', (el, params) => {
  const defaultSvc = serviceGroups.COMMON;
  const svcList = defaultSvc;
  el.innerHTML = `
    <div class="page-services">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">全部服务</div>
        <div style="width:40px"></div>
      </div>
      <div class="svc-full-list">
        ${svcList.map((s,i) => `
        <div class="svc-full-item" onclick="window.__svc=s;window.__svcGroup='COMMON';navigate('service-detail', false)">
          <div class="svc-full-left">
            <span class="svc-emoji-lg">${s.emoji}</span>
          </div>
          <div class="svc-full-info">
            <div class="svc-full-name">${s.name}</div>
            <div class="svc-full-desc">${s.desc}</div>
            <div class="svc-full-meta">⏱ ${s.duration}分钟</div>
            ${s.tag ? `<span class="badge-gold-sm">${s.tag}</span>` : ''}
          </div>
          <div class="svc-full-price">¥${s.price}</div>
        </div>`).join('')}
      </div>
    </div>
  `;
});

route('service-detail', (el, params) => {
  const s = window.__svc;
  const svcGroup = window.__svcGroup || 'COMMON';
  if (!s) { navigate('home'); return; }
  el.innerHTML = `
    <div class="page-svc-detail">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">${s.name}</div>
        <div style="width:40px"></div>
      </div>
      <div class="svc-detail-hero">
        <span class="svc-emoji-xl">${s.emoji}</span>
        <div class="svc-detail-name">${s.name}</div>
        <div class="svc-detail-price">¥${s.price}</div>
        <div class="svc-detail-meta">⏱ 时长约 ${s.duration} 分钟</div>
        ${s.tag ? `<span class="badge-gold">${s.tag}</span>` : ''}
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">服务介绍</span></div>
        <div class="svc-detail-desc">${s.desc}</div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">服务流程</span></div>
        <div class="steps-list">
          ${(s.steps||[]).map((step,i) => `
          <div class="step-item"><span class="step-num">${i+1}</span><span>${step}</span></div>
          `).join('')}
        </div>
      </div>
      <div class="svc-detail-footer">
        <button class="btn-gold-full" onclick="window.__bookingSvc=window.__svc;navigate('booking')">立即预约此服务</button>
      </div>
    </div>
  `;
});

route('stores', (el, params) => {
  el.innerHTML = `
    <div class="page-stores">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">门店查询</div>
        <div style="width:40px"></div>
      </div>
      <div class="search-bar">
        <input class="search-input" id="storeSearch" placeholder="搜索门店名称或地址…" oninput="filterStores(this.value)">
      </div>
      <div id="storesList">
        ${renderStoreList(stores)}
      </div>
    </div>
  `;
});

function renderStoreList(list) {
  return list.map(s => `
  <div class="store-card" onclick="window.__storeId=${s.id};navigate('store-detail',false)">
    <div class="store-card-top">
      <div class="store-card-name">${s.name}${s.type==='总店'?' <span class="badge-gold">总店</span>':''}</div>
      <div class="store-card-hours">🕐 ${s.hours}</div>
    </div>
    <div class="store-card-addr">📍 ${s.address}</div>
    <div class="store-card-bot">
      <div class="store-card-phone" onclick="event.stopPropagation();window.location.href='tel:${s.phone}'">📞 ${s.phone}</div>
      <button class="btn-gold-sm" onclick="event.stopPropagation();window.__storeId=${s.id};navigate('booking')">立即预约</button>
    </div>
  </div>`).join('');
}

window.filterStores = function(q) {
  const q_lower = q.toLowerCase();
  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(q_lower) ||
    s.address.toLowerCase().includes(q_lower) ||
    s.city.toLowerCase().includes(q_lower)
  );
  document.getElementById('storesList').innerHTML = renderStoreList(filtered);
};

route('store-detail', (el, params) => {
  const storeId = parseInt(window.__storeId || params.storeId);
  window.__storeId = storeId;
  const s = stores.find(x => x.id === storeId);
  if (!s) { navigate('stores'); return; }
  const techsHere = technicians.filter(t => t.storeId === storeId);
  const svcHere = getServicesByStoreName(s.name);
  el.innerHTML = `
    <div class="page-store-detail">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">${s.name}</div>
        <div style="width:40px"></div>
      </div>
      <div class="store-detail-hero">
        <div class="store-hero-name">${s.name}${s.type==='总店'?' <span class="badge-gold">总店</span>':''}</div>
        <div class="store-hero-type">${s.type}</div>
        <div class="store-hero-info">
          <div>📍 ${s.address}</div>
          <div>🕐 ${s.hours}</div>
          <div>📞 <a href="tel:${s.phone}" style="color:#c9a84c">${s.phone}</a></div>
        </div>
        <button class="btn-gold-full mt12" onclick="window.__storeId=${s.id};navigate('booking')">立即预约到本门店</button>
      </div>
      ${techsHere.length > 0 ? `
      <div class="section">
        <div class="section-hd"><span class="section-title">本店技师</span><span class="section-more" onclick="window.__storeId=${s.id};navigate('technicians',false)">全部 ›</span></div>
        <div class="tech-mini-list">
          ${techsHere.slice(0,4).map(t => `
          <div class="tech-mini" onclick="window.__techId=${t.id};navigate('tech-detail',false)">
            <div class="tech-mini-avatar">${t.avatar}</div>
            <div class="tech-mini-name">${t.name}</div>
            <div class="tech-mini-level">${t.level}</div>
          </div>`).join('')}
        </div>
      </div>` : ''}
      <div class="section">
        <div class="section-hd"><span class="section-title">本店服务</span></div>
        <div class="svc-list-sm">
          ${svcHere.slice(0,4).map(sv => `
          <div class="svc-sm-item" onclick="window.__svc=JSON.parse('${JSON.stringify(sv).replace(/'/g,"\\'")}');navigate('service-detail',false)">
            <span class="svc-emoji">${sv.emoji}</span>
            <span class="svc-sm-name">${sv.name}</span>
            <span class="svc-sm-price">¥${sv.price}</span>
          </div>`).join('')}
        </div>
        <button class="btn-outline mt8" onclick="window.__storeId=${s.id};navigate('booking')">查看更多 ›</button>
      </div>
    </div>
  `;
});

route('technicians', (el, params) => {
  const storeId = parseInt(window.__storeId || params.storeId);
  const store = stores.find(s => s.id === storeId);
  const techsHere = technicians.filter(t => t.storeId === storeId);
  el.innerHTML = `
    <div class="page-techs">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">${store ? store.name + '技师' : '技师团队'}</div>
        <div style="width:40px"></div>
      </div>
      ${techsHere.length === 0 ? '<div class="empty-tip">暂无比数据</div>' : `
      <div class="tech-full-list">
        ${techsHere.map(t => `
        <div class="tech-full-item" onclick="window.__techId=${t.id};navigate('tech-detail',false)">
          <div class="tech-full-left">
            <div class="tech-avatar-lg">${t.avatar}</div>
            ${t.available ? '<div class="avail-dot"></div>' : '<div class="unavail-dot"></div>'}
          </div>
          <div class="tech-full-info">
            <div class="tech-full-name">${t.name} <span class="tech-code">工号 ${t.code}</span></div>
            <div class="tech-full-level">${t.level}</div>
            <div class="tech-full-spec">擅长：${t.specialty}</div>
            <div class="tech-full-meta">⭐${t.rating} | ${t.orders}单 | 从业${t.experience}年</div>
            ${t.tags && t.tags.length ? '<div class="tech-tags">' + t.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('') + '</div>' : ''}
          </div>
          <div class="tech-full-right">
            ${t.available ? `<button class="btn-gold-sm" onclick="event.stopPropagation();window.__techId=${t.id};navigate('booking')">预约</button>` : '<span class="offline-tip">休息中</span>'}
          </div>
        </div>`).join('')}
      </div>`}
    </div>
  `;
});

route('tech-detail', (el, params) => {
  const techId = parseInt(window.__techId || params.techId);
  window.__techId = techId;
  const t = technicians.find(x => x.id === techId);
  if (!t) { navigate('home'); return; }
  el.innerHTML = `
    <div class="page-tech-detail">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">技师详情</div>
        <div style="width:40px"></div>
      </div>
      <div class="tech-detail-hero">
        <div class="tech-detail-avatar">${t.avatar}</div>
        <div class="tech-detail-name">${t.name}</div>
        <div class="tech-detail-code">工号 ${t.code}</div>
        <div class="tech-detail-level">${t.level}</div>
        <div class="tech-detail-badges">
          ${(t.tags||[]).map(tag => `<span class="tech-tag-lg">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">基本信息</span></div>
        <div class="info-grid">
          <div class="info-item"><div class="info-label">所属门店</div><div class="info-val">${t.storeName}</div></div>
          <div class="info-item"><div class="info-label">从业年限</div><div class="info-val">${t.experience}年</div></div>
          <div class="info-item"><div class="info-label">年龄</div><div class="info-val">${t.age}岁</div></div>
          <div class="info-item"><div class="info-label">接单数</div><div class="info-val">${t.orders}单</div></div>
          <div class="info-item"><div class="info-label">评分</div><div class="info-val">⭐ ${t.rating}</div></div>
          <div class="info-item"><div class="info-label">状态</div><div class="info-val">${t.available ? '<span style="color:#4caf50">在线</span>' : '<span style="color:#999">休息中</span>'}</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">擅长领域</span></div>
        <div class="svc-list-sm">
          ${(t.services||[]).map(sv => `<div class="svc-sm-item"><span>💆</span><span>${sv}</span></div>`).join('')}
        </div>
        <div class="tech-intro">${t.intro}</div>
      </div>
      ${(t.certificates||[]).length > 0 ? `
      <div class="section">
        <div class="section-hd"><span class="section-title">资质证书</span></div>
        <div class="cert-list">
          ${t.certificates.map(c => `<span class="cert-badge">${c}</span>`).join('')}
        </div>
      </div>` : ''}
      <div class="page-bottom-btn">
        ${t.available ? `<button class="btn-gold-full" onclick="navigate('booking')">立即预约 ${t.name}</button>` : '<div class="offline-notice">该技师暂时休息，请选择其他技师</div>'}
      </div>
    </div>
  `;
});

route('booking', (el, params) => {
  const storeId = parseInt(window.__storeId || params.storeId);
  const techId = parseInt(window.__techId || params.techId);
  const preselectedSvc = window.__bookingSvc;
  
  const defaultStoreId = storeId || stores[0].id;
  const store = stores.find(s => s.id === defaultStoreId) || stores[0];
  const svcList = getServicesByStoreName(store.name);
  const preselected = preselectedSvc || (svcList[0] ? svcList[0] : null);
  
  // Generate dates (today + 7 days)
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const day = d.getDay();
    const weekNames = ['周日','周一','周二','周三','周四','周五','周六'];
    dates.push({
      date: d.toISOString().split('T')[0],
      day: d.getDate(),
      week: weekNames[day],
      today: i === 0
    });
  }
  
  // Time slots 12:00 - 04:30 every 30min
  const timeSlots = [];
  for (let h = 12; h <= 27; h++) {
    const realH = h % 24;
    timeSlots.push(`${String(realH).padStart(2,'0')}:00`);
    timeSlots.push(`${String(realH).padStart(2,'0')}:30`);
  }
  timeSlots.pop(); // remove last :30 (would be 28:30)
  
  window.__bookingState = {
    storeId: defaultStoreId,
    storeName: store.name,
    svc: preselected,
    date: dates[0].date,
    time: '20:00',
    techId: techId || null,
    contactName: '',
    contactPhone: ''
  };
  
  const selectedTech = techId ? technicians.find(t => t.id === techId) : null;
  
  el.innerHTML = `
    <div class="page-booking">
      <div class="page-hd">
        <button class="back-btn" onclick="goBack()">‹</button>
        <div class="page-title">预约服务</div>
        <div style="width:40px"></div>
      </div>
      <div class="booking-form">
        <div class="form-section">
          <div class="form-label">选择门店</div>
          <select class="form-select" id="bk-store" onchange="onBkStoreChange(this.value)">
            ${stores.map(s => `<option value="${s.id}" ${s.id===defaultStoreId?'selected':''}>${s.name}</option>`).join('')}
          </select>
        </div>
        ${selectedTech ? `
        <div class="form-section">
          <div class="form-label">指定技师</div>
          <div class="bk-tech-badge">
            <span>${selectedTech.avatar}</span>
            <span>${selectedTech.name}</span>
            <span class="bk-tech-badge-tag">已选</span>
          </div>
        </div>` : ''}
        <div class="form-section">
          <div class="form-label">选择服务</div>
          <div class="svc-select-list" id="svcList">
            ${svcList.map(sv => `
            <div class="svc-select-item ${preselected && sv.id===preselected.id?'selected':''}" onclick="selectSvc(${sv.id})">
              <span class="svc-emoji">${sv.emoji}</span>
              <div class="svc-select-info">
                <div class="svc-select-name">${sv.name}</div>
                <div class="svc-select-meta">${sv.duration}分钟</div>
              </div>
              <div class="svc-select-right">
                <div class="svc-select-price">¥${sv.price}</div>
                ${sv.tag ? `<div class="svc-select-tag">${sv.tag}</div>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>
        <div class="form-section">
          <div class="form-label">选择日期</div>
          <div class="date-scroll">
            ${dates.map((d,i) => `
            <div class="date-chip ${d.today?'today':''} ${window.__bookingState.date===d.date?'selected':''}" onclick="selectDate('${d.date}',this)" data-date="${d.date}">
              <div class="date-chip-week">${d.week}</div>
              <div class="date-chip-day">${d.day}</div>
            </div>`).join('')}
          </div>
        </div>
        <div class="form-section">
          <div class="form-label">到店时间</div>
          <select class="form-select" id="bk-time" onchange="onBkTimeChange(this.value)">
            ${timeSlots.map(t => `<option value="${t}" ${t==='20:00'?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="form-section">
          <div class="form-label">预约人信息</div>
          <input class="form-input" id="bk-name" placeholder="请输入姓名" maxlength="20" oninput="window.__bookingState.contactName=this.value">
          <input class="form-input" id="bk-phone" placeholder="请输入手机号" type="tel" maxlength="11" style="margin-top:8px" oninput="window.__bookingState.contactPhone=this.value">
        </div>
        <div class="form-section">
          <div class="form-label">备注（可选）</div>
          <textarea class="form-textarea" id="bk-remark" placeholder="如有特殊需求请备注…" oninput="window.__bookingState.remark=this.value"></textarea>
        </div>
        <div class="booking-summary" id="bookingSummary">
          <div class="summary-title">📋 预约信息</div>
          <div class="summary-row"><span>门店</span><span id="sum-store">${store.name}</span></div>
          ${selectedTech ? `<div class="summary-row"><span>技师</span><span>${selectedTech.name}</span></div>` : ''}
          <div class="summary-row"><span>服务</span><span id="sum-svc">${preselected ? preselected.name + ' ¥' + preselected.price : '未选择'}</span></div>
          <div class="summary-row"><span>日期</span><span id="sum-date">${dates[0].week} ${dates[0].day}日</span></div>
          <div class="summary-row"><span>时间</span><span id="sum-time">${window.__bookingState.time}</span></div>
        </div>
        <button class="btn-gold-full" onclick="doBooking()">确认预约</button>
        <div class="booking-note">* 预约成功后，我们会短信通知您确认</div>
      </div>
    </div>
  `;
  
  window.onBkStoreChange = function(storeId) {
    const s = stores.find(x => x.id == storeId);
    window.__bookingState.storeId = s.id;
    window.__bookingState.storeName = s.name;
    document.getElementById('sum-store').textContent = s.name;
    const svcList = getServicesByStoreName(s.name);
    window.__bookingState.svc = svcList[0] || null;
    renderSvcList(svcList, svcList[0]);
  };
  
  window.onBkTimeChange = function(time) {
    window.__bookingState.time = time;
    document.getElementById('sum-time').textContent = time;
  };
  
  window.selectDate = function(date, el) {
    window.__bookingState.date = date;
    document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    const d = dates.find(x => x.date === date);
    if (d) document.getElementById('sum-date').textContent = d.week + ' ' + d.day + '日';
  };
  
  window.selectSvc = function(svcId) {
    const storeId = window.__bookingState.storeId;
    const s = stores.find(x => x.id == storeId);
    const svcList = getServicesByStoreName(s.name);
    const svc = svcList.find(x => x.id === svcId);
    window.__bookingState.svc = svc;
    document.getElementById('sum-svc').textContent = svc ? svc.name + ' ¥' + svc.price : '未选择';
    renderSvcList(svcList, svc);
  };
  
  window.renderSvcList = function(svcList, selected) {
    const el = document.getElementById('svcList');
    el.innerHTML = svcList.map(sv => `
    <div class="svc-select-item ${selected && sv.id===selected.id?'selected':''}" onclick="selectSvc(${sv.id})">
      <span class="svc-emoji">${sv.emoji}</span>
      <div class="svc-select-info">
        <div class="svc-select-name">${sv.name}</div>
        <div class="svc-select-meta">${sv.duration}分钟</div>
      </div>
      <div class="svc-select-right">
        <div class="svc-select-price">¥${sv.price}</div>
        ${sv.tag ? `<div class="svc-select-tag">${sv.tag}</div>` : ''}
      </div>
    </div>`).join('');
  };
  
  window.doBooking = function() {
    const st = window.__bookingState;
    const name = document.getElementById('bk-name').value.trim();
    const phone = document.getElementById('bk-phone').value.trim();
    if (!name) { alert('请输入姓名'); return; }
    if (!/^1\d{10}$/.test(phone)) { alert('请输入正确的手机号'); return; }
    if (!st.svc) { alert('请选择服务'); return; }
    const store = stores.find(s => s.id == st.storeId);
    const tech = st.techId ? technicians.find(t => t.id == st.techId) : null;
    const date = dates.find(d => d.date === st.date);
    const summary = `
【恒微足道】预约确认
━━━━━━━━━━━━━━━━
门店：${store ? store.name : '?'}
${tech ? '技师：' + tech.name + '（工号' + tech.code + '）\n' : ''}服务：${st.svc ? st.svc.name : '?'}（¥${st.svc ? st.svc.price : '?'}）
日期：${date ? date.week + ' ' + date.day + '日' : '?'}
时间：${st.time} 到店
预约人：${name}
电话：${phone}
━━━━━━━━━━━━━━━━
我们将尽快确认您的预约，请保持电话畅通！
预约电话：${store ? store.phone : '?'}
`;
    window.__lastBooking = summary;
    window.__bookingState.contactName = name;
    window.__bookingState.contactPhone = phone;
    navigate('booking-result', false);
  };
});

route('booking-result', (el, params) => {
  const summary = window.__lastBooking || '预约成功！';
  const st = window.__bookingState || {};
  const store = stores.find(s => s.id == st.storeId);
  const tech = st.techId ? technicians.find(t => t.id == st.techId) : null;
  const date = st.date;
  el.innerHTML = `
    <div class="page-result">
      <div class="result-hero">
        <div class="result-icon">✅</div>
        <div class="result-title">预约已提交</div>
        <div class="result-sub">我们将在30分钟内电话确认</div>
      </div>
      <div class="result-card">
        ${store ? `<div class="result-row"><span>门店</span><span>${store.name}</span></div>` : ''}
        ${tech ? `<div class="result-row"><span>技师</span><span>${tech.name}</span></div>` : ''}
        ${st.svc ? `<div class="result-row"><span>服务</span><span>${st.svc.name}（¥${st.svc.price}）</span></div>` : ''}
        ${date ? `<div class="result-row"><span>日期</span><span>${date}</span></div>` : ''}
        <div class="result-row"><span>时间</span><span>${st.time || '?'} 到店</span></div>
        <div class="result-row"><span>预约人</span><span>${st.contactName || '?'}</span></div>
        <div class="result-row"><span>电话</span><span>${st.contactPhone || '?'}</span></div>
      </div>
      <div class="result-tip">
        <div class="result-tip-title">📌 温馨提示</div>
        <div>• 请按预约时间到店，迟到超过30分钟可能需重新排队</div>
        <div>• 到店前可拨打门店电话确认排队情况</div>
        ${store ? `<div>• 门店电话：<a href="tel:${store.phone}" style="color:#c9a84c">${store.phone}</a></div>` : ''}
      </div>
      <button class="btn-gold-full mt16" onclick="navigate('home')">返回首页</button>
    </div>
  `;
});

route('member', (el, params) => {
  const rechargeOptions = [
    { id:1, amount:1199, gift:300,  tier:'银卡',  desc:'入门首选' },
    { id:2, amount:2399, gift:600,  tier:'金卡',  desc:'超值回馈' },
    { id:3, amount:3599, gift:1000, tier:'铂金',  desc:'人气之选', hot:true },
    { id:4, amount:5999, gift:1700, tier:'钻石',  desc:'尊贵体验' },
    { id:5, amount:7999, gift:2500, tier:'黑金',  desc:'奢华享受' },
    { id:6, amount:9999, gift:3200, tier:'至臻',  desc:'极致礼遇' },
    { id:7, amount:12899,gift:5000,  tier:'御尊',  desc:'巅峰特权' },
  ];
  const records = [
    { name:'经典足疗60分钟', store:'南关总店', date:'04-10', amount:88, type:'out' },
    { name:'充值', store:'', date:'04-08', amount:500, type:'in' },
    { name:'全身推拿90分钟', store:'雁滩店', date:'04-05', amount:138, type:'out' },
  ];
  el.innerHTML = `
    <div class="page-member">
      <div class="member-header">
        <div class="member-card">
          <div class="member-card-top">
            <div class="member-avatar">👤</div>
            <div class="member-info">
              <div class="member-nickname">恒微会员</div>
              <div class="member-level">普通会员</div>
            </div>
          </div>
          <div class="member-card-mid">
            <div class="member-stat">
              <div class="member-stat-val">¥0.00</div>
              <div class="member-stat-label">账户余额</div>
            </div>
            <div class="member-stat-div"></div>
            <div class="member-stat">
              <div class="member-stat-val">0</div>
              <div class="member-stat-label">剩余次数</div>
            </div>
            <div class="member-stat-div"></div>
            <div class="member-stat">
              <div class="member-stat-val">0</div>
              <div class="member-stat-label">积分</div>
            </div>
          </div>
          <div class="member-card-no">卡号：恒微 000001</div>
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">💰 充值套餐</span></div>
        <div class="recharge-grid">
          ${rechargeOptions.map(r => `
          <div class="recharge-item ${r.hot?'hot':''}" onclick="this.classList.toggle('selected')">
            <div class="recharge-tier">${r.tier}</div>
            <div class="recharge-amount">¥${r.amount.toLocaleString()}</div>
            <div class="recharge-gift">送 ¥${r.gift.toLocaleString()}</div>
            <div class="recharge-desc">${r.desc}</div>
            ${r.hot ? '<div class="recharge-hot-badge">🔥 人气</div>' : ''}
          </div>`).join('')}
        </div>
        <button class="btn-gold-full mt12" onclick="showToast('充值功能即将上线，请到店充值')">立即充值</button>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">📜 消费记录</span></div>
        <div class="record-list">
          ${records.map(r => `
          <div class="record-item">
            <div class="record-left">
              <div class="record-name">${r.name}${r.store ? '<span class="record-store">@'+r.store+'</span>' : ''}</div>
              <div class="record-date">${r.date}</div>
            </div>
            <div class="record-amount ${r.type}">${r.type==='out'?'-':'+'}¥${r.amount}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="section">
        <div class="section-hd"><span class="section-title">👑 会员权益</span></div>
        <div class="benefit-list">
          ${[
            ['专属折扣','会员享受服务折扣价'],
            ['充值赠送','多充多送，永久有效'],
            ['预约优先','会员优先预约时段'],
            ['积分兑换','消费得积分换好礼'],
            ['免费茶点','会员免费享用茶水小食'],
          ].map(([t,d]) => `<div class="benefit-item"><div class="benefit-title">${t}</div><div class="benefit-desc">${d}</div></div>`).join('')}
        </div>
      </div>
    </div>
  `;
});

window.showToast = function(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

// ─── BOOT ──────────────────────────────────────────────
window.navigate = navigate;
window.goBack = goBack;

function updateNavForHash() {
  var items = document.querySelectorAll('.nav-item');
  for (var i = 0; i < items.length; i++) items[i].classList.remove('active');
  var path = (window.location.hash.slice(1) || 'home').split('?')[0];
  var map = {
    'home':'nav-home','services':'nav-services','booking':'nav-booking',
    'stores':'nav-stores','member':'nav-member'
  };
  var el = document.getElementById(map[path]);
  if (el) el.classList.add('active');
}

function bootApp(data) {
  window.__APP_DATA__ = data;
  document.getElementById('navBar').style.display = 'flex';
  window.location.hash = window.location.hash || 'home';
  updateNavForHash();
  render();
  window.addEventListener('hashchange', function() { updateNavForHash(); render(); });
}

// Boot: if inline data already loaded (from inline-data.js), use it
if (window.__APP_DATA__) {
  bootApp(window.__APP_DATA__);
} else {
  // Try fetch first (server environment)
  fetch('data.json')
    .then(function(r) { return r.json(); })
    .then(bootApp)
    .catch(function(err) {
      // Show error with server instructions
      console.error('Load error:', err);
      document.getElementById('app').innerHTML =
        '<div style="color:#c9a84c;text-align:center;padding:40px 20px">' +
        '<div style="font-size:40px;margin-bottom:16px">💆</div>' +
        '<div style="font-size:16px;font-weight:600;margin-bottom:8px">恒微足道</div>' +
        '<div style="font-size:14px;color:#e05050;margin-bottom:16px">⚠️ 数据加载失败</div>' +
        '<div style="font-size:13px;color:#8a7560;line-height:2;text-align:left;display:inline-block">' +
        '请通过本地服务器打开：<br>' +
        '<span style="color:#c9a84c">python -m http.server 8765</span><br>' +
        '然后访问：<span style="color:#c9a84c">http://localhost:8765</span>' +
        '</div></div>';
    });
}
