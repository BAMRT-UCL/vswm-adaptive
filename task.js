"use strict";
// VSWM v0.3: provisional staircase, NOT calibrated Bayesian assessment.
const CONFIG = { gridSize: 5, showMs: 1500, minLoad: 2, maxLoad: 12, maxTrials: 20, initialLoad: 3 };
const $ = id => document.getElementById(id);
let bank = [], used = new Set(), history = [], current = null;
let load = CONFIG.initialLoad, goodStreak = 0, poorStreak = 0;
let phase = "setup", selected = new Set(), shownAt = 0, recallAt = 0, displayTimer = null;
let participant = "", year = "", sessionId = "";
let stage = "search", searchFailures = 0, threshold = null;
const grid = $("grid");
for (let i = 0; i < CONFIG.gridSize ** 2; i++) {
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cell";
  cell.setAttribute("aria-label", `Location ${i + 1}`);
  cell.addEventListener("click", () => {
    if (phase !== "recall") return;
    if (selected.has(i)) selected.delete(i);
    else if (selected.size < current.load) selected.add(i);
    render();
  });
  grid.appendChild(cell);
}
const cells = [...grid.children];
function render() {
  cells.forEach((cell, i) => {
    cell.classList.toggle("target", phase === "showing" && current.targets.includes(i));
    cell.classList.toggle("selected", phase === "recall" && selected.has(i));
    cell.disabled = phase !== "recall";
  });
}
function validateBank(data) {
  if (!Array.isArray(data) || !data.length) throw Error("Item bank is empty.");
  const ids = new Set();
  for (const item of data) {
    if (!item.id || ids.has(item.id) || !Number.isInteger(item.load) || item.load < CONFIG.minLoad || item.load > CONFIG.maxLoad ||
      !Array.isArray(item.targets) || item.targets.length !== item.load || new Set(item.targets).size !== item.load ||
      item.targets.some(i => !Number.isInteger(i) || i < 0 || i >= 25)) throw Error(`Invalid item: ${item.id}`);
    ids.add(item.id);
  }
  return data;
}
async function init() {
  $("startBtn").disabled = true;
  try {
    const res = await fetch("items.json", {cache:"no-store"});
    if (!res.ok) throw Error(`HTTP ${res.status}`);
    bank = validateBank(await res.json());
    $("startBtn").disabled = false;
  } catch (err) {
    alert(`Unable to load items.json: ${err.message}`);
  }
}
function start() {
  participant = $("participantId").value.trim();
  year = $("yearGroup").value;
  if (!participant || !year) return alert("Enter a participant code and year group.");
  sessionId = `vswm-${Date.now()}`;
  history = []; used = new Set(); load = CONFIG.initialLoad;
  goodStreak = 0; poorStreak = 0; stage = "search"; searchFailures = 0; threshold = null;
  $("setup").hidden = true; $("results").hidden = true; $("assessment").hidden = false;
  nextTrial();
}
function selectItem() {
  const unused = bank.filter(item => !used.has(item.id));
  if (!unused.length) return null;
  const exactLoad = unused.filter(item => item.load === load);
  if (exactLoad.length) return exactLoad[0];
  // Never silently substitute an easier item after exhausting the requested load.
  // Choose the nearest unused load and record the actual load administered.
  unused.sort((a,b) => Math.abs(a.load-load)-Math.abs(b.load-load) || a.id.localeCompare(b.id));
  return unused[0];
}
function chooseMeasurementLoad() {
  const recent = history.slice(-8);
  const byLoad = new Map();
  for (const r of recent) {
    const arr = byLoad.get(r.load) || [];
    arr.push(r.proportion - r.falseSelections / Math.max(1,r.load));
    byLoad.set(r.load,arr);
  }
  const candidates = [...byLoad].map(([l,vals]) => ({load:l, mean:vals.reduce((a,b)=>a+b,0)/vals.length}));
  const closest = candidates.sort((a,b)=>Math.abs(a.mean-0.7)-Math.abs(b.mean-0.7))[0];
  return Math.max(CONFIG.minLoad,Math.min(CONFIG.maxLoad, closest ? closest.load : (threshold || load)));
}

function nextTrial() {
  if (history.length >= CONFIG.maxTrials) return finish();
  current = selectItem();
  if (!current) return finish();
  used.add(current.id);
  selected = new Set();
  phase = "showing";
  $("feedback").textContent = "";
  $("nextBtn").hidden = true; $("submitBtn").hidden = true;
  $("progress").textContent = `Trial ${history.length + 1} of up to ${CONFIG.maxTrials}`;
  $("message").textContent = "Remember the blue squares.";
  shownAt = performance.now();
  render();
  clearTimeout(displayTimer);
  displayTimer = setTimeout(() => {
    if (phase !== "showing") return;
    recallAt = performance.now();
    phase = "recall";
    $("message").textContent = "Select the squares you remember, then submit.";
    $("submitBtn").hidden = false;
    render();
  }, CONFIG.showMs);
}
function submit() {
  if (phase !== "recall") return;
  const submittedAt = performance.now();
  const hits = current.targets.filter(i => selected.has(i)).length;
  const falseSelections = [...selected].filter(i => !current.targets.includes(i)).length;
  const proportion = hits / current.load;
  const exact = hits === current.load && falseSelections === 0;
  history.push({
    trial: history.length + 1, itemId: current.id, load: current.load,
    targets: [...current.targets], responses: [...selected].sort((a,b)=>a-b),
    hits, omissions: current.load-hits, falseSelections, proportion, exact,
    intendedPresentationMs: CONFIG.showMs, observedPresentationMs: Math.round(recallAt-shownAt),
    responseTimeMs: Math.round(submittedAt-recallAt), timestamp: new Date().toISOString()
  });
  // Exploratory adaptive procedure: rapid search followed by threshold sampling.
  // No claim of calibrated item difficulty or psychometric precision.
  if (stage === "search") {
    if (exact) {
      load = Math.min(CONFIG.maxLoad, current.load + 1);
    } else {
      searchFailures++;
      // Partial recall is informative; one imperfect trial is not necessarily a threshold.
      if (searchFailures >= 2 || proportion <= 0.5 || current.load === CONFIG.maxLoad) {
        threshold = current.load;
        stage = "measure";
        load = Math.max(CONFIG.minLoad, current.load - (proportion <= 0.5 ? 1 : 0));
      } else {
        load = current.load;
      }
    }
    if (current.load === CONFIG.maxLoad) {
      stage = "measure";
      threshold = current.load;
    }
  } else {
    // Track the current threshold with a smoothed, recent-trial performance signal.
    const recent = history.slice(-5);
    const weighted = recent.reduce((sum,r)=>sum+(r.proportion-r.falseSelections/Math.max(1,r.load)),0)/recent.length;
    if (weighted > 0.9) load = Math.min(CONFIG.maxLoad,current.load+1);
    else if (weighted < 0.55) load = Math.max(CONFIG.minLoad,current.load-1);
    else load = chooseMeasurementLoad();
  }
  phase = "feedback";
  render();
  $("submitBtn").hidden = true; $("nextBtn").hidden = false;
  $("message").textContent = "Answer recorded.";
  $("feedback").textContent = `You recalled ${hits} of ${current.load} locations.`;
}
function finish() {
  phase = "finished";
  $("assessment").hidden = true; $("results").hidden = false;
  const exact = history.filter(r=>r.exact).length;
  $("summary").textContent = `${history.length} trials completed; ${exact} completely correct. Highest load attempted: ${Math.max(...history.map(r=>r.load))}. Exploratory prototype only.`;
}
function download() {
  const payload = {version:"0.3", task:"spatial-simultaneous", participant, yearGroup:year, sessionId,
    configuration:CONFIG, adaptiveStageAtEnd:stage, provisionalThresholdLoad:threshold, trials:history};
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = `${participant.replace(/[^a-zA-Z0-9_-]/g,"_")}_VSWM_${sessionId}.json`;
  link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("startBtn").addEventListener("click", start);
$("submitBtn").addEventListener("click", submit);
$("nextBtn").addEventListener("click", nextTrial);
$("downloadBtn").addEventListener("click", download);
$("restartBtn").addEventListener("click", () => { $("results").hidden = true; $("setup").hidden = false; });
init();
