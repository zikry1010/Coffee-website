(() => {
  const STORAGE_KEY = "pocket.v1";
  const COLORS = [
    "#2f6b5a",
    "#c45c4a",
    "#3d6ea8",
    "#e8a45a",
    "#6b4f8a",
    "#4a8f7a",
    "#b86b3c",
    "#2c4a5e",
  ];

  const DEFAULT_JARS = [
    { id: "commitment", name: "Commitment", color: "#c45c4a", balance: 0, planPct: 40 },
    { id: "food", name: "Food", color: "#e8a45a", balance: 0, planPct: 30 },
    { id: "saving", name: "Saving", color: "#2f6b5a", balance: 0, planPct: 20 },
    { id: "fun", name: "Fun", color: "#3d6ea8", balance: 0, planPct: 10 },
  ];

  const defaultState = () => ({
    currency: "₱",
    unallocated: 0,
    jars: DEFAULT_JARS.map((j) => ({ ...j })),
    activity: [],
  });

  let state = load();
  let currentJarId = null;
  let previousView = "home";
  let selectedColor = COLORS[0];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      const jars =
        Array.isArray(parsed.jars) && parsed.jars.length
          ? parsed.jars.map((jar) => {
              const fallback = base.jars.find((d) => d.id === jar.id);
              return {
                ...jar,
                planPct:
                  typeof jar.planPct === "number"
                    ? jar.planPct
                    : fallback
                      ? fallback.planPct
                      : 0,
              };
            })
          : base.jars;
      return {
        ...base,
        ...parsed,
        jars,
        activity: Array.isArray(parsed.activity) ? parsed.activity : [],
      };
    } catch {
      return defaultState();
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function money(n) {
    const value = Number(n) || 0;
    const formatted = value.toLocaleString(undefined, {
      minimumFractionDigits: value % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return `${state.currency}${formatted}`;
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  function hideToast() {
    clearTimeout(toast._t);
    $("#toast").classList.remove("is-on");
  }

  function showView(name) {
    hideToast();
    $$(".view").forEach((v) => v.classList.remove("is-active"));
    const view = $(`#view-${name}`);
    if (!view) return;
    view.style.animation = "none";
    void view.offsetWidth;
    view.style.animation = "";
    view.classList.add("is-active");
  }

  function addActivity(entry) {
    state.activity.unshift({
      id: uid("act"),
      at: Date.now(),
      ...entry,
    });
    state.activity = state.activity.slice(0, 80);
  }

  function jarsTotal() {
    return state.jars.reduce((sum, jar) => sum + (Number(jar.balance) || 0), 0);
  }

  function planSum() {
    return state.jars.reduce((sum, jar) => sum + (Number(jar.planPct) || 0), 0);
  }

  function jarStatus(jar) {
    if (jar.balance <= 0) return "Empty — stop spending";
    if (jar.planPct > 0) return `${jar.planPct}% of each paycheck`;
    return "Tap to spend or edit";
  }

  function renderHome() {
    const inJars = jarsTotal();
    const total = Math.round((inJars + state.unallocated) * 100) / 100;
    $("#unallocated-display").textContent = money(state.unallocated);
    $("#total-overview").textContent = `In jars: ${money(inJars)} · Total: ${money(total)}`;
    $("#btn-allocate").disabled = state.unallocated <= 0;

    const list = $("#jar-list");
    if (!state.jars.length) {
      list.innerHTML = `<li class="empty">No jars yet. Create one to start splitting.</li>`;
    } else {
      list.innerHTML = state.jars
        .map(
          (jar, i) => `
        <li style="animation-delay:${i * 40}ms">
          <button type="button" class="jar-item ${jar.balance <= 0 ? "is-empty" : ""}" data-jar="${jar.id}">
            <span class="jar-dot" style="background:${jar.color}"></span>
            <span class="jar-meta">
              <strong>${escapeHtml(jar.name)}</strong>
              <span>${escapeHtml(jarStatus(jar))}</span>
            </span>
            <span class="jar-amt">${money(jar.balance)}</span>
          </button>
        </li>`
        )
        .join("");
    }

    const activity = $("#activity-list");
    if (!state.activity.length) {
      activity.innerHTML = `<li class="empty">No moves yet. Add income to begin.</li>`;
    } else {
      activity.innerHTML = state.activity
        .slice(0, 8)
        .map((a) => activityRow(a))
        .join("");
    }
  }

  function activityRow(a) {
    const sign = a.amount >= 0 ? "pos" : "neg";
    const amt = a.amount >= 0 ? `+${money(a.amount)}` : `−${money(Math.abs(a.amount))}`;
    const when = new Date(a.at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    return `
      <li class="activity-item">
        <div class="left">
          <strong>${escapeHtml(a.title)}</strong>
          <span>${escapeHtml(a.detail || when)}</span>
        </div>
        <div class="right ${sign}">${amt}</div>
      </li>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderAllocate() {
    $("#alloc-remaining").textContent = money(state.unallocated);
    $("#alloc-remaining").style.color = "";
    const wrap = $("#allocate-fields");
    wrap.innerHTML = state.jars
      .map(
        (jar) => `
      <div class="alloc-row">
        <div class="name">
          <span class="jar-dot" style="background:${jar.color}"></span>
          <span>
            ${escapeHtml(jar.name)}
            <small>${jar.planPct || 0}%</small>
          </span>
        </div>
        <label class="field">
          <span class="is-hidden">Amount</span>
          <input type="number" inputmode="decimal" min="0" step="0.01" data-alloc="${jar.id}" placeholder="0" />
        </label>
      </div>`
      )
      .join("");

    wrap.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", updateAllocRemaining);
    });
  }

  function readAllocations() {
    const map = {};
    $$("#allocate-fields [data-alloc]").forEach((input) => {
      map[input.dataset.alloc] = Math.max(0, Number(input.value) || 0);
    });
    return map;
  }

  function updateAllocRemaining() {
    const total = Object.values(readAllocations()).reduce((s, n) => s + n, 0);
    const left = Math.round((state.unallocated - total) * 100) / 100;
    $("#alloc-remaining").textContent = money(left);
    $("#alloc-remaining").style.color = left < 0 ? "var(--coral)" : "";
  }

  function fillAllocInputs(valuesById) {
    $$("#allocate-fields [data-alloc]").forEach((input) => {
      const val = valuesById[input.dataset.alloc];
      input.value = val > 0 ? String(val) : "";
    });
    updateAllocRemaining();
  }

  function applyPlanPercents() {
    if (!state.jars.length || state.unallocated <= 0) return;
    const totalPct = planSum();
    if (totalPct <= 0) {
      toast("Set jar percentages in Settings first");
      return;
    }
    if (totalPct > 100.001) {
      toast("Plan is over 100% — fix it in Settings");
      return;
    }

    const values = {};
    let used = 0;
    const ordered = state.jars.filter((j) => (j.planPct || 0) > 0);
    ordered.forEach((jar, i) => {
      let amount;
      if (i === ordered.length - 1 && Math.abs(totalPct - 100) < 0.001) {
        amount = Math.round((state.unallocated - used) * 100) / 100;
      } else {
        amount =
          Math.floor(state.unallocated * (jar.planPct / 100) * 100) / 100;
      }
      values[jar.id] = Math.max(0, amount);
      used = Math.round((used + values[jar.id]) * 100) / 100;
    });
    state.jars.forEach((jar) => {
      if (values[jar.id] == null) values[jar.id] = 0;
    });
    fillAllocInputs(values);
    toast("Plan applied — review then confirm");
  }

  function openJar(id) {
    const jar = state.jars.find((j) => j.id === id);
    if (!jar) return;
    currentJarId = id;
    $("#jar-detail-name").textContent = jar.name;
    $("#jar-detail-balance").textContent = money(jar.balance);
    $("#jar-detail-swatch").style.background = jar.color;
    $("#spend-from-label").textContent = `From ${jar.name} · available ${money(jar.balance)}`;
    $("#btn-spend").disabled = jar.balance <= 0;

    const rows = state.activity.filter((a) => a.jarId === id).slice(0, 20);
    $("#jar-activity-list").innerHTML = rows.length
      ? rows.map(activityRow).join("")
      : `<li class="empty">No activity in this jar yet.</li>`;

    showView("jar");
  }

  function updateSpendGuard() {
    const jar = state.jars.find((j) => j.id === currentJarId);
    const guard = $("#spend-guard");
    const btn = $("#btn-record-spend");
    if (!jar || !guard || !btn) return;

    const amount = Number($("#spend-amount").value) || 0;
    const left = Math.round((jar.balance - amount) * 100) / 100;

    guard.classList.remove("is-warn", "is-ok");
    if (amount <= 0) {
      guard.textContent = `Available: ${money(jar.balance)} — you can’t spend more than this`;
      btn.disabled = true;
      return;
    }
    if (amount > jar.balance + 0.001) {
      guard.textContent = `Too much — only ${money(jar.balance)} left in this jar`;
      guard.classList.add("is-warn");
      btn.disabled = true;
      return;
    }
    guard.textContent = `After this spend: ${money(left)} left in ${jar.name}`;
    guard.classList.add("is-ok");
    btn.disabled = false;
  }

  function renderColorPicks(active) {
    selectedColor = active || COLORS[0];
    $("#color-picks").innerHTML = COLORS.map(
      (c) => `
      <button type="button" class="color-pick ${c === selectedColor ? "is-selected" : ""}"
        style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>`
    ).join("");
  }

  function renderPlanFields() {
    const wrap = $("#plan-fields");
    if (!wrap) return;
    wrap.innerHTML = state.jars
      .map(
        (jar) => `
      <label class="plan-row">
        <span>
          <span class="jar-dot" style="background:${jar.color}"></span>
          ${escapeHtml(jar.name)}
        </span>
        <input type="number" inputmode="decimal" min="0" max="100" step="1"
          data-plan="${jar.id}" value="${jar.planPct || 0}" />
        <span class="plan-unit">%</span>
      </label>`
      )
      .join("");
    wrap.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", updatePlanTotal);
    });
    updatePlanTotal();
  }

  function updatePlanTotal() {
    const total = $$("#plan-fields [data-plan]").reduce(
      (sum, input) => sum + (Number(input.value) || 0),
      0
    );
    const el = $("#plan-total");
    el.textContent = `Total: ${total}%`;
    el.classList.toggle("is-warn", total > 100);
    el.classList.toggle("is-ok", total === 100);
  }

  function openJarForm(editId) {
    const jar = editId ? state.jars.find((j) => j.id === editId) : null;
    $("#jar-form-title").textContent = jar ? "Edit jar" : "New jar";
    $("#jar-edit-id").value = jar ? jar.id : "";
    $("#jar-name").value = jar ? jar.name : "";
    renderColorPicks(jar ? jar.color : COLORS[state.jars.length % COLORS.length]);
    $("#btn-delete-jar").classList.toggle("is-hidden", !jar);
    previousView = jar ? "jar" : "home";
    showView("jar-form");
  }

  // Events
  $("#btn-add-income").addEventListener("click", () => {
    $("#form-income").reset();
    showView("income");
  });

  $("#btn-allocate").addEventListener("click", () => {
    renderAllocate();
    showView("allocate");
  });

  $("#btn-settings").addEventListener("click", () => {
    $("#currency-symbol").value = state.currency;
    renderPlanFields();
    showView("settings");
  });

  $("#btn-add-jar").addEventListener("click", () => openJarForm(null));

  $$("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.back;
      if (target === "jar" && currentJarId) {
        openJar(currentJarId);
        return;
      }
      if (target === "home") renderHome();
      showView(target === "jar" ? "home" : target);
    });
  });

  $("#jar-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-jar]");
    if (btn) openJar(btn.dataset.jar);
  });

  $("#btn-spend").addEventListener("click", () => {
    $("#form-spend").reset();
    updateSpendGuard();
    showView("spend");
  });

  $("#spend-amount").addEventListener("input", updateSpendGuard);

  $("#btn-edit-jar").addEventListener("click", () => {
    if (currentJarId) openJarForm(currentJarId);
  });

  $("#color-picks").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-color]");
    if (!btn) return;
    selectedColor = btn.dataset.color;
    $$(".color-pick").forEach((el) => el.classList.toggle("is-selected", el === btn));
  });

  $("#form-income").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = Number($("#income-amount").value);
    if (!(amount > 0)) return;
    const note = $("#income-note").value.trim();
    state.unallocated = Math.round((state.unallocated + amount) * 100) / 100;
    addActivity({
      type: "income",
      title: "Income added",
      detail: note || "Ready to place",
      amount,
    });
    save();
    renderHome();
    showView("home");
    toast("Income added — ready to split");
  });

  $("#form-allocate").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.jars.length) {
      toast("Create a jar first");
      return;
    }
    const map = readAllocations();
    const total = Object.values(map).reduce((s, n) => s + n, 0);
    if (total <= 0) {
      toast("Enter amounts to split");
      return;
    }
    if (total > state.unallocated + 0.001) {
      toast("That is more than you have ready");
      return;
    }

    Object.entries(map).forEach(([id, amount]) => {
      if (amount <= 0) return;
      const jar = state.jars.find((j) => j.id === id);
      if (!jar) return;
      jar.balance = Math.round((jar.balance + amount) * 100) / 100;
      addActivity({
        type: "allocate",
        jarId: id,
        title: `Into ${jar.name}`,
        detail: "Split from ready-to-place",
        amount,
      });
    });

    state.unallocated = Math.round((state.unallocated - total) * 100) / 100;
    save();
    renderHome();
    showView("home");
    toast("Money split into jars");
  });

  $("#btn-apply-plan").addEventListener("click", applyPlanPercents);

  $("#btn-split-evenly").addEventListener("click", () => {
    if (!state.jars.length || state.unallocated <= 0) return;
    const each =
      Math.floor((state.unallocated / state.jars.length) * 100) / 100;
    const values = {};
    let used = 0;
    state.jars.forEach((jar, i) => {
      let val = each;
      if (i === state.jars.length - 1) {
        val = Math.round((state.unallocated - used) * 100) / 100;
      }
      values[jar.id] = val > 0 ? val : 0;
      used = Math.round((used + values[jar.id]) * 100) / 100;
    });
    fillAllocInputs(values);
  });

  $("#form-spend").addEventListener("submit", (e) => {
    e.preventDefault();
    const jar = state.jars.find((j) => j.id === currentJarId);
    if (!jar) return;
    const amount = Number($("#spend-amount").value);
    if (!(amount > 0)) return;
    if (amount > jar.balance + 0.001) {
      updateSpendGuard();
      toast("Not enough in this jar — don’t overspend");
      return;
    }
    const note = $("#spend-note").value.trim();
    jar.balance = Math.round((jar.balance - amount) * 100) / 100;
    addActivity({
      type: "spend",
      jarId: jar.id,
      title: note || `Spent from ${jar.name}`,
      detail: jar.name,
      amount: -amount,
    });
    save();
    openJar(jar.id);
    toast(jar.balance <= 0 ? "Jar empty — spending stopped" : "Spend recorded");
  });

  $("#form-jar").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#jar-name").value.trim();
    if (!name) return;
    const editId = $("#jar-edit-id").value;
    if (editId) {
      const jar = state.jars.find((j) => j.id === editId);
      if (!jar) return;
      jar.name = name;
      jar.color = selectedColor;
      save();
      openJar(editId);
      toast("Jar updated");
    } else {
      const jar = {
        id: uid("jar"),
        name,
        color: selectedColor,
        balance: 0,
        planPct: 0,
      };
      state.jars.push(jar);
      save();
      renderHome();
      showView("home");
      toast("Jar created");
    }
  });

  $("#btn-delete-jar").addEventListener("click", () => {
    const editId = $("#jar-edit-id").value;
    const jar = state.jars.find((j) => j.id === editId);
    if (!jar) return;
    if (jar.balance > 0) {
      toast("Move or spend the balance first");
      return;
    }
    if (!confirm(`Delete “${jar.name}”?`)) return;
    state.jars = state.jars.filter((j) => j.id !== editId);
    save();
    currentJarId = null;
    renderHome();
    showView("home");
    toast("Jar deleted");
  });

  $("#form-settings").addEventListener("submit", (e) => {
    e.preventDefault();
    const symbol = $("#currency-symbol").value.trim() || "₱";
    state.currency = symbol.slice(0, 3);

    let totalPct = 0;
    $$("#plan-fields [data-plan]").forEach((input) => {
      const jar = state.jars.find((j) => j.id === input.dataset.plan);
      if (!jar) return;
      const pct = Math.max(0, Math.min(100, Number(input.value) || 0));
      jar.planPct = pct;
      totalPct += pct;
    });
    if (totalPct > 100.001) {
      toast("Percentages can’t add up to more than 100");
      updatePlanTotal();
      return;
    }

    save();
    renderHome();
    showView("home");
    toast(totalPct === 100 ? "Plan saved — ready for payday" : "Settings saved");
  });

  $("#btn-reset").addEventListener("click", () => {
    if (!confirm("Erase all Pocket data on this phone?")) return;
    state = defaultState();
    save();
    renderHome();
    showView("home");
    toast("Data reset");
  });

  // PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  renderHome();
})();
