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

// ====== Party Member Settings UI ======
let partyMemberSettingsContainer;

// Get all monster types as a flat list
function getAllMonsterTypes() {
  const types = [];
  monsterFamilies.forEach(family => {
    family.members.forEach(member => {
      types.push(member);
    });
  });
  return types;
}

// Populate party member dropdowns based on party size
function populatePartyMemberSettings() {
  const partySizeSelect = document.getElementById("partySize");
  const partySize = partySizeSelect.value === "5" ? 5 : parseInt(partySizeSelect.value, 10);
  
  partyMemberSettingsContainer.innerHTML = "";
  
  for (let i = 0; i < partySize; i++) {
    const memberDiv = document.createElement("div");
    memberDiv.className = "party-member-row";
    
    const memberLabel = document.createElement("div");
    memberLabel.className = "party-member-label";
    memberLabel.textContent = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
    memberDiv.appendChild(memberLabel);
    
    const dropdownsContainer = document.createElement("div");
    dropdownsContainer.className = "party-member-dropdowns";
    
    // First dropdown: Type selection
    const typeSelect = document.createElement("select");
    typeSelect.id = `member${i}_type`;
    typeSelect.className = "member-type-select";
    
    if (i === 0) {
      // First member is always Ramza
      const opt = document.createElement("option");
      opt.value = "Ramza";
      opt.textContent = "Ramza";
      opt.selected = true;
      typeSelect.appendChild(opt);
      typeSelect.disabled = true;
    } else {
      const options = ["", "*", "Human", "Monster"];
      options.forEach(optVal => {
        const opt = document.createElement("option");
        opt.value = optVal;
        opt.textContent = optVal || "(empty)";
        typeSelect.appendChild(opt);
      });
    }
    
    typeSelect.addEventListener("change", () => updateMemberDropdowns(i));
    dropdownsContainer.appendChild(typeSelect);
    
    // Second dropdown: Job/Monster Family selection
    const jobSelect = document.createElement("select");
    jobSelect.id = `member${i}_job`;
    jobSelect.className = "member-job-select";
    jobSelect.style.display = "none";
    const memberIndex = i; // Capture for closure
    jobSelect.addEventListener("change", () => {
      const typeSel = document.getElementById(`member${memberIndex}_type`);
      if (typeSel && typeSel.value === "Monster") {
        updateMonsterTypeDropdown(memberIndex);
      }
    });
    dropdownsContainer.appendChild(jobSelect);
    
    // Third dropdown: Secondary job (for humans/Ramza) or Monster type (for monsters)
    const secondaryContainer = document.createElement("span");
    secondaryContainer.className = "member-secondary-container";
    secondaryContainer.style.display = "none";
    
    const secondaryLabel = document.createElement("span");
    secondaryLabel.className = "member-secondary-label";
    secondaryLabel.textContent = "Secondary: ";
    secondaryLabel.id = `member${i}_secondaryLabel`;
    
    const secondarySelect = document.createElement("select");
    secondarySelect.id = `member${i}_secondary`;
    secondarySelect.className = "member-secondary-select";
    
    secondaryContainer.appendChild(secondaryLabel);
    secondaryContainer.appendChild(secondarySelect);
    dropdownsContainer.appendChild(secondaryContainer);
    
    memberDiv.appendChild(dropdownsContainer);
    partyMemberSettingsContainer.appendChild(memberDiv);
  }
  
  // Initialize dropdowns for existing members
  for (let i = 0; i < partySize; i++) {
    updateMemberDropdowns(i);
    // For Ramza, make sure the job dropdown is visible and populated
    if (i === 0) {
      const typeSelect = document.getElementById(`member${i}_type`);
      if (typeSelect && typeSelect.value === "Ramza") {
        const jobSelect = document.getElementById(`member${i}_job`);
        const secondaryLabel = document.getElementById(`member${i}_secondaryLabel`);
        const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
        if (jobSelect) {
          jobSelect.style.display = "flex";
          // Clear any default selection so it randomizes
          jobSelect.value = "";
        }
        if (secondaryContainer) {
          secondaryContainer.style.display = "inline-flex";
        }
        const secondarySelect = document.getElementById(`member${i}_secondary`);
        if (secondarySelect) {
          secondarySelect.value = "";
        }
      }
    }
  }
}

// Update dropdowns for a specific member
function updateMemberDropdowns(memberIndex) {
  const typeSelect = document.getElementById(`member${memberIndex}_type`);
  const jobSelect = document.getElementById(`member${memberIndex}_job`);
  const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
  const secondaryLabel = document.getElementById(`member${memberIndex}_secondaryLabel`);
  const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
  
  if (!typeSelect || !jobSelect) return;
  
  const type = typeSelect.value;
  
  // Clear and populate job dropdown
  jobSelect.innerHTML = "";
  jobSelect.style.display = "none";
  if (secondaryContainer) {
    secondaryContainer.style.display = "none";
  }
  
  if (type === "Ramza" || type === "Human") {
    // Show human jobs
    jobSelect.style.display = "flex";
    humanJobs.forEach(job => {
      const opt = document.createElement("option");
      opt.value = job;
      opt.textContent = job;
      jobSelect.appendChild(opt);
    });
    
    // Show secondary dropdown
    if (secondaryContainer) {
      secondaryContainer.style.display = "inline-flex";
    }
    if (secondaryLabel) {
      secondaryLabel.textContent = "Secondary: ";
    }
    secondarySelect.innerHTML = "";
    const emptyOpt = document.createElement("option");
    emptyOpt.value = "";
    emptyOpt.textContent = "(none)";
    secondarySelect.appendChild(emptyOpt);
    humanJobs.forEach(job => {
      const opt = document.createElement("option");
      opt.value = job;
      opt.textContent = job;
      secondarySelect.appendChild(opt);
    });
  } else if (type === "Monster") {
    // Show monster families in second dropdown
    jobSelect.style.display = "flex";
    monsterFamilies.forEach((family, index) => {
      const opt = document.createElement("option");
      opt.value = String(index);
      opt.textContent = family.name;
      jobSelect.appendChild(opt);
    });
    
    // Show third dropdown with "*" and family members
    if (secondaryContainer) {
      secondaryContainer.style.display = "inline-flex";
    }
    if (secondaryLabel) {
      secondaryLabel.textContent = "Type: ";
    }
    
    // Update third dropdown based on selected family
    updateMonsterTypeDropdown(memberIndex);
  }
  // If type is "" or "*", dropdowns remain hidden
}

// Update monster type dropdown based on selected family
function updateMonsterTypeDropdown(memberIndex) {
  const jobSelect = document.getElementById(`member${memberIndex}_job`);
  const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
  
  if (!jobSelect || !secondarySelect) return;
  
  secondarySelect.innerHTML = "";
  
  const familyIndex = parseInt(jobSelect.value, 10);
  if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < monsterFamilies.length) {
    const family = monsterFamilies[familyIndex];
    
    // Add "*" option
    const starOpt = document.createElement("option");
    starOpt.value = "*";
    starOpt.textContent = "*";
    secondarySelect.appendChild(starOpt);
    
    // Add family members
    family.members.forEach(member => {
      const opt = document.createElement("option");
      opt.value = member;
      opt.textContent = member;
      secondarySelect.appendChild(opt);
    });
  }
}

// ====== Generation logic ======
let resultsEl;

function generateRun() {
  // Party size
  const sizeValue = document.getElementById("partySize").value;
  const partySize = sizeValue === "5" ? 5 : parseInt(sizeValue, 10);
  const unanimous = document.getElementById("unanimous").checked;

  // Special / scope
  const specialMode = getSelectedRadio("specialMode");

  const crystals = getSelectedRadio("crystals");
  const shops = getSelectedRadio("shops");
  const randomBattles = getSelectedRadio("randomBattles");

  // Build job assignments
  const characters = [];
  const maxSlots = partySize;

  if (specialMode === "fjf") {
    // Five Job Fiesta: pick 5 unique jobs
    const shuffledJobs = shuffle(humanJobs);
    const fiestaJobs = shuffledJobs.slice(0, 5);

    if (unanimous) {
      for (let i = 0; i < maxSlots; i++) {
        const baseJob = randomChoice(fiestaJobs);
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + (i + 1),
          baseJob,
          fiestaJobs,
          note: ""
        });
      }
    } else {
      for (let i = 0; i < maxSlots; i++) {
        const baseJob = fiestaJobs[i % fiestaJobs.length];
        characters.push({
          name: i === 0 ? "Ramza" : "Ally " + (i + 1),
          baseJob,
          fiestaJobs,
          note: ""
        });
      }
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, partySize);

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "human",
      limitation: null,
      crystals,
      shops,
      randomBattles,
      fiestaJobs,
      characters
    });
    return;
  }

  if (specialMode === "cavalry") {
    // Cavalry Challenge: 2 human units + 2 chocobos
    const chocoboFamily = monsterFamilies.find(f => f.name === "Chocobo Family");
    const shuffledJobs = shuffle(humanJobs);
    
    // 2 human units with random jobs
    for (let i = 0; i < 2; i++) {
      const humanJob = randomChoice(humanJobs);
      characters.push({
        name: i === 0 ? "Ramza" : "Ally " + i,
        baseJob: humanJob,
        note: "Must mount chocobo on first turn"
      });
    }
    
    // 2 chocobos
    for (let i = 0; i < 2; i++) {
      const chocoboType = randomChoice(chocoboFamily.members);
      characters.push({
        name: "Chocobo " + (i + 1),
        baseJob: chocoboType,
        note: "Mount for human unit"
      });
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, 4);

    renderResults({
      partySize: 4,
      unanimous: false,
      specialMode,
      scope: "human",
      limitation: null,
      crystals,
      shops,
      randomBattles,
      characters
    });
    return;
  }

  if (specialMode === "humansOnly") {
    // Humans Only: only human characters allowed
    for (let i = 0; i < maxSlots; i++) {
      const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
      const baseJob = randomChoice(humanJobs);
      let secondary = null;
      
      // Randomly assign secondary job
        // Ensure secondary is different from base job
        const availableJobs = humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
      
      characters.push({
        name,
        baseJob,
        secondary: secondary || null,
        characterType: i === 0 ? "Ramza" : "Human",
        note: null
      });
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, partySize);

    renderResults({
      partySize,
      unanimous,
      specialMode,
      scope: "human",
      limitation: null,
      crystals,
      shops,
      randomBattles,
      characters
    });
    return;
  }

  if (specialMode === "monstrous") {
    // Monstrous: monsters only, except Ramza
    // Ramza gets a human job
    const ramzaJob = randomChoice(humanJobs);
    characters.push({
      name: "Ramza",
      baseJob: ramzaJob,
      note: "Human (Monstrous exception)"
    });

    if (unanimous) {
      // One roll for the monster party as a whole
      const familyIndex = Math.floor(Math.random() * monsterFamilies.length);
      const family = monsterFamilies[familyIndex];
      for (let i = 1; i < maxSlots; i++) {
        const member = randomChoice(family.members);
        characters.push({
          name: "Monster " + (i + 1),
          baseJob: member,
          members: family.members.slice(),
          family: family.name,
          note: ""
        });
      }

      // Populate dropdowns with generated values
      populateDropdownsFromCharacters(characters, partySize);

      renderResults({
        partySize,
        unanimous,
        specialMode,
        scope: "monster",
        limitation: null,
        crystals,
        shops,
        randomBattles,
        family,
        characters
      });
    } else {
      // Each monster gets its own family roll
      const families = [];
      for (let i = 1; i < maxSlots; i++) {
        const familyIndex = Math.floor(Math.random() * monsterFamilies.length);
        const family = monsterFamilies[familyIndex];
        families.push(family);
        const member = randomChoice(family.members);
        characters.push({
          name: "Monster " + (i + 1),
          baseJob: member,
          members: family.members.slice(),
          family: family.name,
          note: "Any monster within family"
        });
      }

      // Populate dropdowns with generated values
      populateDropdownsFromCharacters(characters, partySize);

      renderResults({
        partySize,
        unanimous,
        specialMode,
        scope: "monster",
        limitation: null,
        crystals,
        shops,
        randomBattles,
        families,
        characters
      });
    }
    return;
  }

  // Normal mode: always randomize all party members (including type)
  for (let i = 0; i < maxSlots; i++) {
    const typeSelect = document.getElementById(`member${i}_type`);
    
    if (!typeSelect) continue;
    
    const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
    
    let baseJob = null;
    let secondary = null;
    let characterType;
    
    // Always randomize type (except Ramza is always Ramza)
    if (i === 0) {
      // First member is always Ramza
      characterType = "Ramza";
      baseJob = randomChoice(humanJobs);
      
      // Randomly assign secondary job
        // Ensure secondary is different from base job
        const availableJobs = humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
    } else {
      // For other members, randomly choose Human or Monster
      const isHuman = Math.random() < 0.5;
      
      if (isHuman) {
        characterType = "Human";
        baseJob = randomChoice(humanJobs);
        
        // Randomly assign secondary job
          // Ensure secondary is different from base job
          const availableJobs = humanJobs.filter(j => j !== baseJob);
          if (availableJobs.length > 0) {
            secondary = randomChoice(availableJobs);
          }
      } else {
        characterType = "Monster";
        const familyIndex = Math.floor(Math.random() * monsterFamilies.length);
        const family = monsterFamilies[familyIndex];
        baseJob = randomChoice(family.members);
      }
    }
    
    if (baseJob) {
      characters.push({
        name,
        baseJob,
        secondary: secondary || null,
        characterType: characterType,
        note: null
      });
    }
  }

  // Populate dropdowns with generated values
  populateDropdownsFromCharacters(characters, partySize);

  renderResults({
    partySize,
    unanimous,
    specialMode,
    scope: "mixed",
    limitation: null,
    crystals,
    shops,
    randomBattles,
    characters
  });
}

// Populate dropdowns based on generated characters
function populateDropdownsFromCharacters(characters, partySize) {
  for (let i = 0; i < Math.min(characters.length, partySize); i++) {
    const char = characters[i];
    const typeSelect = document.getElementById(`member${i}_type`);
    const jobSelect = document.getElementById(`member${i}_job`);
    const secondarySelect = document.getElementById(`member${i}_secondary`);
    if (!typeSelect) continue;
    
    // Determine if it's a human or monster
    const isMonster = monsterFamilies.some(family => 
      family.members.includes(char.baseJob)
    );
    
    if (isMonster) {
      // Find which family this monster belongs to
      const family = monsterFamilies.find(f => 
        f.members.includes(char.baseJob)
      );
      
      if (family) {
        typeSelect.value = "Monster";
        updateMemberDropdowns(i);
        
        const familyIndex = monsterFamilies.indexOf(family);
        jobSelect.value = String(familyIndex);
        updateMonsterTypeDropdown(i);
        
        secondarySelect.value = char.baseJob;
      }
    } else {
      // Human character
      const charType = char.characterType || (i === 0 ? "Ramza" : "Human");
      typeSelect.value = charType;
      updateMemberDropdowns(i);
      
      // Set values after dropdowns are populated
      if (jobSelect) {
        jobSelect.value = char.baseJob;
      }
      if (secondarySelect) {
        // Set secondary if it exists and is different from base job
        if (char.secondary && char.secondary !== char.baseJob && humanJobs.includes(char.secondary)) {
          secondarySelect.value = char.secondary;
        } else {
          // No secondary or invalid - set to "(none)"
          secondarySelect.value = "";
        }
      }
    }
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
    families,
    characters
  } = data;

  const sizeLabel = partySize === 5 ? "* (full party)" : String(partySize);

  const specialLabel = (() => {
    if (specialMode === "normal") return "Normal";
    if (specialMode === "monstrous") return "Monstrous";
    if (specialMode === "fjf") return "Five Job Fiesta";
    if (specialMode === "cavalry") return "Cavalry Challenge";
    if (specialMode === "humansOnly") return "Humans Only";
    return "Normal";
  })();

  const scopeLabel = scope === "monster" ? "Monster Families" : scope === "mixed" ? "Mixed" : "Human Jobs";

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
  html += `<div class="row"><span class="label">Challenge Mode</span><span class="value">${specialLabel}</span></div>`;
  if (limitation) {
    html += `<div class="row"><span class="label">Job Scope</span><span class="value">${scopeLabel}</span></div>`;
    html += `<div class="row"><span class="label">Job Limitation</span><span class="value">${limitationLabel}</span></div>`;
  }

  html += `<div class="results-section-title">Run Rules</div>`;
  html += `<div class="row"><span class="label">Crystals</span><span class="value">${crystals}</span></div>`;
  html += `<div class="row"><span class="label">Shops</span><span class="value">${shops}</span></div>`;
  html += `<div class="row"><span class="label">Random Battles</span><span class="value">${randomBattles}</span></div>`;

  if (specialMode === "fjf" && fiestaJobs) {
    html += `<div class="results-section-title">Five Job Fiesta Pool</div>`;
    html += `<ul class="job-list">`;
    fiestaJobs.forEach(j => {
      html += `<li>${j}</li>`;
    });
    html += `</ul>`;
  }

  if (specialMode !== "fjf") {
    html += `<div class="results-section-title">Party</div>`;
    html += `<ul class="job-list">`;
    characters.forEach(ch => {
      let line = `<strong>${ch.name}</strong>: ${ch.baseJob}`;
      if (ch.secondary) {
        line += ` / ${ch.secondary}`;
      }
      if (ch.note) {
        line += ` <span class="small">(${ch.note})</span>`;
      }
      html += `<li>${line}</li>`;
    });
    html += `</ul>`;
  }

  html += `<div class="hint" style="margin-top:6px;">Play normally until you reach <strong>Mandalia Plains</strong>, unlock the required jobs, then switch into your assigned configuration for the remainder of the run.</div>`;

  resultsEl.innerHTML = html;
}

// ====== Reset ======
function resetForm() {
  document.getElementById("partySize").value = "5";
  document.getElementById("unanimous").checked = false;

  document.querySelector('input[name="specialMode"][value="normal"]').checked = true;

  document.querySelector('input[name="crystals"][value="Normal"]').checked = true;
  document.querySelector('input[name="shops"][value="Normal"]').checked = true;
  document.querySelector('input[name="randomBattles"][value="Normal"]').checked = true;

  populatePartyMemberSettings();

  resultsEl.innerHTML = `<div class="hint">
    Configure options on the left, then select <strong>Randomize Run</strong> to generate a challenge.
  </div>`;
}

// ====== Event wiring ======
document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM element references
  partyMemberSettingsContainer = document.getElementById("partyMemberSettings");
  resultsEl = document.getElementById("results");

  // Initialize party member settings
  populatePartyMemberSettings();

  // Update party member settings when party size changes
  const partySizeSelect = document.getElementById("partySize");
  partySizeSelect.addEventListener("change", () => {
    populatePartyMemberSettings();
  });

  // Set party size to 4 when Cavalry Challenge is selected
  const specialModeRadios = document.querySelectorAll('input[name="specialMode"]');
  specialModeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "cavalry") {
        partySizeSelect.value = "4";
        populatePartyMemberSettings();
      }
    });
  });

  document.getElementById("btnRandomize").addEventListener("click", generateRun);
  document.getElementById("btnReset").addEventListener("click", resetForm);
});

