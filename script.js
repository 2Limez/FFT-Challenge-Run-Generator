// ====== Data ======
const humanJobs = [
  "Squire", "Chemist", "Knight", "Archer", "White Mage", "Black Mage",
  "Monk", "Thief", "Oracle", "Time Mage", "Geomancer", "Dragoon",
  "Orator", "Summoner", "Samurai", "Ninja", "Arithmetician",
  "Dancer", "Bard", "Mime"
];

const monsterFamilies = [
  { name: "Chocobo Family", members: ["Chocobo", "Black Chocobo", "Red Chocobo"] },
  { name: "Goblin Family", members: ["Goblin", "Black Goblin", "Gobbledygook"] },
  { name: "Bomb Family", members: ["Bomb", "Grenade", "Exploder"] },
  { name: "Panther Family", members: ["Red Panther", "Coeurl", "Vampire Cat"] },
  { name: "Mindflayer Family", members: ["Piscodemon", "Squidrakin", "Mindflayer"] },
  { name: "Skeleton Family", members: ["Skeleton", "Bonesnatch", "Skeletal Fiend"] },
  { name: "Ghost Family", members: ["Ghoul", "Ghast", "Revenant"] },
  { name: "Ahriman Family", members: ["Floating Eye", "Ahriman", "Plague Horror"] },
  { name: "Aevis Family", members: ["Jura Aevis", "Steelhawk", "Cockatrice"] },
  { name: "Pig Family", members: ["Pig", "Swine", "Wild Boar"] },
  { name: "Treant Family", members: ["Dryad", "Treant", "Elder Treant"] },
  { name: "Minotaur Family", members: ["Wisenkin", "Minotaur", "Sekhret"] },
  { name: "Malboro Family", members: ["Malboro", "Ochu", "Great Malboro"] },
  { name: "Behemoth Family", members: ["Behemoth", "Behemoth King", "Dark Behemoth"] },
  { name: "Dragon Family", members: ["Dragon", "Blue Dragon", "Red Dragon"] },
  { name: "Hydra Family", members: ["Hydra", "Greater Hydra", "Tiamat"] }
];

// ====== Helpers ======
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getSelectedRadio(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

// ====== Job limitation UI ======
const jobLimitationSelect = document.getElementById("jobLimitation");
const jobLimitationHint = document.getElementById("jobLimitationHint");
const jobTypeSelect = document.getElementById("jobType");

const humanLimitations = [
  {
    value: "strict",
    label: "Strict (single job, no cross-abilities)",
    hint: "Each unit may only use one job at a time and may not equip abilities from other jobs."
  },
  {
    value: "locked",
    label: "Locked (same job the entire run)",
    hint: "Each unit is locked into its assigned job for the whole run."
  },
  {
    value: "secondary",
    label: "Secondary (one random secondary job)",
    hint: "Each unit may equip a secondary ability set from one randomly chosen job and must keep that pairing."
  }
];

const monsterLimitations = [
  {
    value: "monster-loose",
    label: "Loose (any monster in the family)",
    hint: "You may use any monster within the chosen family."
  },
  {
    value: "monster-strict",
    label: "Strict (single monster type)",
    hint: "You must stick to a single monster type from within the chosen family."
  }
];

function populateJobLimitation() {
  const scope = getSelectedRadio("jobScope");
  const source = scope === "monster" ? monsterLimitations : humanLimitations;

  jobLimitationSelect.innerHTML = "";
  source.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label;
    jobLimitationSelect.appendChild(opt);
  });
  updateJobLimitationHint();
}

function updateJobLimitationHint() {
  const scope = getSelectedRadio("jobScope");
  const value = jobLimitationSelect.value;
  const source = scope === "monster" ? monsterLimitations : humanLimitations;
  const found = source.find(x => x.value === value);
  jobLimitationHint.textContent = found ? found.hint : "";
}

function populateJobType() {
  const scope = getSelectedRadio("jobScope");
  jobTypeSelect.innerHTML = "";

  if (scope === "monster") {
    monsterFamilies.forEach((fam, index) => {
      const opt = document.createElement("option");
      opt.value = String(index);
      opt.textContent = fam.name;
      jobTypeSelect.appendChild(opt);
    });
  } else {
    humanJobs.forEach(job => {
      const opt = document.createElement("option");
      opt.value = job;
      opt.textContent = job;
      jobTypeSelect.appendChild(opt);
    });
  }
}

// Auto-force monster scope when Monstrous selected
function syncScopeWithSpecial() {
  const special = getSelectedRadio("specialMode");
  const monsterScopeRadio = document.querySelector('input[name="jobScope"][value="monster"]');
  const humanScopeRadio = document.querySelector('input[name="jobScope"][value="human"]');

  if (special === "monstrous") {
    monsterScopeRadio.checked = true;
    monsterScopeRadio.disabled = false;
    humanScopeRadio.disabled = true;
  } else {
    humanScopeRadio.disabled = false;
  }

  populateJobLimitation();
  populateJobType();
}

// ====== Generation logic ======
const resultsEl = document.getElementById("results");

function generateRun() {
  // Party size
  const sizeValue = document.getElementById("partySize").value;
  const partySize = sizeValue === "5" ? 5 : parseInt(sizeValue, 10);
  const unanimous = document.getElementById("unanimous").checked;

  // Special / scope
  const specialMode = getSelectedRadio("specialMode");
  const scope = getSelectedRadio("jobScope");
  const limitation = jobLimitationSelect.value;
  const jobTypeSelection = jobTypeSelect.value;

  const crystals = getSelectedRadio("crystals");
  const shops = getSelectedRadio("shops");
  const randomBattles = getSelectedRadio("randomBattles");

  // Build job assignments
  const characters = [];
  const maxSlots = partySize;

  if (specialMode === "fjf") {
    // Four Job Fiesta: pick 4 unique jobs
    const shuffledJobs = shuffle(humanJobs);
    const fiestaJobs = shuffledJobs.slice(0, 4);

    if (unanimous) {
      for (let i = 0; i < maxSlots; i++) {
        const baseJob = randomChoice(fiestaJobs);
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + i,
          baseJob,
          fiestaJobs,
          note: "Four Job Fiesta pool"
        });
      }
    } else {
      for (let i = 0; i < maxSlots; i++) {
        const baseJob = fiestaJobs[i % fiestaJobs.length];
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + i,
          baseJob,
          fiestaJobs,
          note: "Four Job Fiesta pool"
        });
      }
    }

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "human",
      limitation,
      crystals,
      shops,
      randomBattles,
      fiestaJobs,
      characters
    });
    return;
  }

  if (specialMode === "monstrous") {
    // Monstrous: monsters only, except Ramza
    const familyIndex = parseInt(jobTypeSelection, 10) || 0;
    const family = monsterFamilies[familyIndex];

    // Ramza gets a human job
    const ramzaJob = randomChoice(humanJobs);

    if (unanimous) {
      // One roll for Ramza, one for the monster party as a whole
      characters.push({
        name: "Ramza",
        baseJob: ramzaJob,
        note: "Human (Monstrous exception)"
      });
      for (let i = 1; i < maxSlots; i++) {
        characters.push({
          name: "Monster " + i,
          baseJob: family.name,
          members: family.members.slice(),
          note: limitation === "monster-strict"
            ? "Strict monster type within family"
            : "Any monster within family"
        });
      }
    } else {
      characters.push({
        name: "Ramza",
        baseJob: ramzaJob,
        note: "Human (Monstrous exception)"
      });
      for (let i = 1; i < maxSlots; i++) {
        const member = limitation === "monster-strict"
          ? randomChoice(family.members)
          : family.name;
        characters.push({
          name: "Monster " + i,
          baseJob: member,
          members: family.members.slice(),
          note: limitation === "monster-strict"
            ? "Locked to this monster type"
            : "Any monster within family"
        });
      }
    }

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "monster",
      limitation,
      crystals,
      shops,
      randomBattles,
      family,
      characters
    });
    return;
  }

  // Normal human / monster run without special modes
  if (scope === "monster") {
    const familyIndex = parseInt(jobTypeSelection, 10) || 0;
    const family = monsterFamilies[familyIndex];

    if (unanimous) {
      for (let i = 0; i < maxSlots; i++) {
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + i,
          baseJob: family.name,
          members: family.members.slice(),
          note: limitation === "monster-strict"
            ? "Strict monster type within family"
            : "Any monster within family"
        });
      }
    } else {
      for (let i = 0; i < maxSlots; i++) {
        const member = limitation === "monster-strict"
          ? randomChoice(family.members)
          : family.name;
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + i,
          baseJob: member,
          members: family.members.slice(),
          note: limitation === "monster-strict"
            ? "Locked to this monster type"
            : "Any monster within family"
        });
      }
    }

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "monster",
      limitation,
      crystals,
      shops,
      randomBattles,
      family,
      characters
    });
  } else {
    // Human jobs
    let baseJob;
    const secondaryJobs = {};

    if (unanimous) {
      baseJob = jobTypeSelection || randomChoice(humanJobs);
      for (let i = 0; i < maxSlots; i++) {
        const name = i === 0 ? "Ramza" : "Ally " + i;
        let secondary = null;
        if (limitation === "secondary") {
          secondary = randomChoice(humanJobs.filter(j => j !== baseJob));
          secondaryJobs[name] = secondary;
        }

        characters.push({
          name,
          baseJob,
          secondary: secondaryJobs[name] || null,
          note: buildHumanNote(limitation)
        });
      }
    } else {
      for (let i = 0; i < maxSlots; i++) {
        const name = i === 0 ? "Ramza" : "Ally " + i;
        const charJob = jobTypeSelection || randomChoice(humanJobs);
        let secondary = null;

        if (limitation === "secondary") {
          secondary = randomChoice(humanJobs.filter(j => j !== charJob));
        }

        characters.push({
          name,
          baseJob: charJob,
          secondary,
          note: buildHumanNote(limitation)
        });
      }
    }

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "human",
      limitation,
      crystals,
      shops,
      randomBattles,
      characters
    });
  }
}

function buildHumanNote(limitation) {
  switch (limitation) {
    case "strict":
      return "Single job at a time; no cross-job abilities.";
    case "locked":
      return "Locked into assigned job for entire run.";
    case "secondary":
      return "Fixed secondary job paired with base job.";
    default:
      return "";
  }
}

// ====== Render ======
function renderResults(data) {
  const {
    partySize,
    unanimous,
    specialMode,
    scope,
    limitation,
    crystals,
    shops,
    randomBattles,
    fiestaJobs,
    family,
    characters
  } = data;

  const sizeLabel = partySize === 5 ? "* (full party)" : String(partySize);

  const specialLabel = (() => {
    if (specialMode === "monstrous") return "Monstrous";
    if (specialMode === "fjf") return "Four Job Fiesta";
    return "None";
  })();

  const scopeLabel = scope === "monster" ? "Monster Families" : "Human Jobs";

  const limitationLabelMap = {
    "strict": "Strict",
    "locked": "Locked",
    "secondary": "Secondary",
    "monster-loose": "Monster (Loose)",
    "monster-strict": "Monster (Strict)"
  };
  const limitationLabel = limitationLabelMap[limitation] || limitation;

  let html = "";

  html += `<div class="results-section-title">General</div>`;
  html += `<div class="row"><span class="label">Party Size</span><span class="value">${sizeLabel}</span></div>`;
  html += `<div class="row"><span class="label">Unanimous</span><span class="value">${unanimous ? "Yes" : "No"}</span></div>`;
  html += `<div class="row"><span class="label">Special Setting</span><span class="value">${specialLabel}</span></div>`;
  html += `<div class="row"><span class="label">Job Scope</span><span class="value">${scopeLabel}</span></div>`;
  html += `<div class="row"><span class="label">Job Limitation</span><span class="value">${limitationLabel}</span></div>`;

  html += `<div class="results-section-title">Run Rules</div>`;
  html += `<div class="row"><span class="label">Crystals</span><span class="value">${crystals}</span></div>`;
  html += `<div class="row"><span class="label">Shops</span><span class="value">${shops}</span></div>`;
  html += `<div class="row"><span class="label">Random Battles</span><span class="value">${randomBattles}</span></div>`;

  if (specialMode === "fjf" && fiestaJobs) {
    html += `<div class="results-section-title">Four Job Fiesta Pool</div>`;
    html += `<ul class="job-list">`;
    fiestaJobs.forEach(j => {
      html += `<li>${j}</li>`;
    });
    html += `</ul>`;
  }

  if (scope === "monster" && family) {
    html += `<div class="results-section-title">Monster Family</div>`;
    html += `<div class="row"><span class="label">Family</span><span class="value">${family.name}</span></div>`;
    html += `<div class="small" style="margin-top:4px;">Members: ${family.members.join(", ")}</div>`;
  }

  html += `<div class="results-section-title">Party</div>`;
  html += `<ul class="job-list">`;
  characters.forEach(ch => {
    let line = `<strong>${ch.name}</strong>: ${ch.baseJob}`;
    if (ch.secondary) {
      line += ` / Secondary: ${ch.secondary}`;
    }
    if (ch.note) {
      line += ` <span class="small">(${ch.note})</span>`;
    }
    html += `<li>${line}</li>`;
  });
  html += `</ul>`;

  html += `<div class="hint" style="margin-top:6px;">Play normally until you reach <strong>Mandalia Plains</strong>, unlock the required jobs, then switch into your assigned configuration for the remainder of the run.</div>`;

  resultsEl.innerHTML = html;
}

// ====== Reset ======
function resetForm() {
  document.getElementById("partySize").value = "1";
  document.getElementById("unanimous").checked = false;

  document.querySelector('input[name="specialMode"][value="none"]').checked = true;

  const humanScope = document.querySelector('input[name="jobScope"][value="human"]');
  const monsterScope = document.querySelector('input[name="jobScope"][value="monster"]');
  humanScope.checked = true;
  humanScope.disabled = false;
  monsterScope.disabled = false;

  document.querySelector('input[name="crystals"][value="Normal"]').checked = true;
  document.querySelector('input[name="shops"][value="Normal"]').checked = true;
  document.querySelector('input[name="randomBattles"][value="Normal"]').checked = true;

  populateJobLimitation();
  populateJobType();

  resultsEl.innerHTML = `<div class="hint">
    Configure options on the left, then select <strong>Randomize Run</strong> to generate a challenge.
  </div>`;
}

// ====== Event wiring ======
document.addEventListener("DOMContentLoaded", () => {
  populateJobLimitation();
  populateJobType();

  document.querySelectorAll('input[name="jobScope"]').forEach(el => {
    el.addEventListener("change", () => {
      populateJobLimitation();
      populateJobType();
    });
  });

  jobLimitationSelect.addEventListener("change", updateJobLimitationHint);

  document.querySelectorAll('input[name="specialMode"]').forEach(el => {
    el.addEventListener("change", syncScopeWithSpecial);
  });

  document.getElementById("btnRandomize").addEventListener("click", generateRun);
  document.getElementById("btnReset").addEventListener("click", resetForm);
});

