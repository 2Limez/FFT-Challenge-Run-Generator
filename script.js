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
let partyMemberSettingsPanel;

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
        opt.textContent = optVal || "";
        typeSelect.appendChild(opt);
      });
      // Explicitly ensure type dropdown is enabled for non-Ramza members
      typeSelect.removeAttribute('disabled');
    }
    
    typeSelect.addEventListener("change", () => {
      updateMemberDropdowns(i);
      updateSecondaryEnabledState(i);
      if (updateRunSummary) {
        updateRunSummary();
      }
    });
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
      updateSecondaryEnabledState(memberIndex);
      if (updateRunSummary) {
        updateRunSummary();
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
    secondarySelect.addEventListener("change", () => {
      if (updateRunSummary) {
        updateRunSummary();
      }
    });
    
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
    } else {
      // Explicitly ensure type dropdown is enabled for non-Ramza members
      const typeSelect = document.getElementById(`member${i}_type`);
      if (typeSelect) {
        typeSelect.removeAttribute('disabled');
      }
    }
    // Update secondary enabled state for each member
    updateSecondaryEnabledState(i);
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
  
  // Ensure type dropdown is enabled for non-Ramza members
  if (memberIndex > 0) {
    typeSelect.removeAttribute('disabled');
  }
  
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
    // Add blank option at the top
    const blankOpt = document.createElement("option");
    blankOpt.value = "";
    blankOpt.textContent = "";
    jobSelect.appendChild(blankOpt);
    humanJobs.forEach(job => {
      const opt = document.createElement("option");
      opt.value = job;
      opt.textContent = job;
      jobSelect.appendChild(opt);
    });
    
    // Check if Five Job Fiesta is selected
    const specialMode = getSelectedRadio("specialMode");
    const isFJF = specialMode === "fjf";
    
    // Show secondary dropdown only if not Five Job Fiesta
    if (!isFJF && secondaryContainer) {
      secondaryContainer.style.display = "inline-flex";
      if (secondaryLabel) {
        secondaryLabel.textContent = "Secondary: ";
      }
      secondarySelect.innerHTML = "";
      // Add blank option at the top
      const blankSecondaryOpt = document.createElement("option");
      blankSecondaryOpt.value = "";
      blankSecondaryOpt.textContent = "";
      secondarySelect.appendChild(blankSecondaryOpt);
      const noneOpt = document.createElement("option");
      noneOpt.value = "none";
      noneOpt.textContent = "(none)";
      secondarySelect.appendChild(noneOpt);
      humanJobs.forEach(job => {
        const opt = document.createElement("option");
        opt.value = job;
        opt.textContent = job;
        secondarySelect.appendChild(opt);
      });
    } else if (isFJF && secondaryContainer) {
      // Hide secondary dropdown for Five Job Fiesta
      secondaryContainer.style.display = "none";
    }
  } else if (type === "Monster") {
    // Show monster families in second dropdown
    jobSelect.style.display = "flex";
    // Add blank option at the top
    const blankOpt = document.createElement("option");
    blankOpt.value = "";
    blankOpt.textContent = "";
    jobSelect.appendChild(blankOpt);
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
  
  // Update secondary enabled state
  updateSecondaryEnabledState(memberIndex);
}

// Update secondary dropdown enabled/disabled state
function updateSecondaryEnabledState(memberIndex) {
  const jobSelect = document.getElementById(`member${memberIndex}_job`);
  const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
  const typeSelect = document.getElementById(`member${memberIndex}_type`);
  const secondaryLabel = document.getElementById(`member${memberIndex}_secondaryLabel`);
  const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
  
  if (!secondarySelect) return;
  
  // Check if Five Job Fiesta is selected
  const specialMode = getSelectedRadio("specialMode");
  const isFJF = specialMode === "fjf";
  
  // Check if this is a human/Ramza type or monster type
  const type = typeSelect ? typeSelect.value : "";
  const isHuman = type === "Ramza" || type === "Human";
  const isMonster = type === "Monster";
  
  // For humans/Ramza: hide entirely if Five Job Fiesta, otherwise disable if main job not selected
  if (isHuman) {
    if (isFJF) {
      // Hide secondary dropdown entirely for Five Job Fiesta
      if (secondaryContainer) {
        secondaryContainer.style.display = "none";
      }
    } else {
      // Show secondary dropdown if not FJF
      if (secondaryContainer) {
        secondaryContainer.style.display = "inline-flex";
      }
      const shouldDisable = !jobSelect || jobSelect.value === "";
      secondarySelect.disabled = shouldDisable;
    }
  }
  // For monsters: enable if monster family is selected
  else if (isMonster) {
    const shouldDisable = !jobSelect || jobSelect.value === "";
    secondarySelect.disabled = shouldDisable;
  }
  // For empty type or other: disable
  else {
    secondarySelect.disabled = true;
  }
}

// Update monster type dropdown based on selected family
function updateMonsterTypeDropdown(memberIndex) {
  const jobSelect = document.getElementById(`member${memberIndex}_job`);
  const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
  
  if (!jobSelect || !secondarySelect) return;
  
  // Preserve current value if it's a valid option
  const currentValue = secondarySelect.value;
  
  secondarySelect.innerHTML = "";
  
  // Add blank option at the top
  const blankOpt = document.createElement("option");
  blankOpt.value = "";
  blankOpt.textContent = "";
  secondarySelect.appendChild(blankOpt);
  
  const familyIndex = parseInt(jobSelect.value, 10);
  if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < monsterFamilies.length) {
    const family = monsterFamilies[familyIndex];
    
    // Add family members (no "*" option - blank means use family)
    family.members.forEach(member => {
      const opt = document.createElement("option");
      opt.value = member;
      opt.textContent = member;
      secondarySelect.appendChild(opt);
    });
    
    // Restore previous value if it's still valid (blank or a family member)
    if (currentValue === "" || family.members.includes(currentValue)) {
      secondarySelect.value = currentValue;
    } else {
      // If previous value is not valid, default to blank
      secondarySelect.value = "";
    }
  } else {
    // No family selected, set to blank
    secondarySelect.value = "";
  }
}

// ====== Generation logic ======
let resultsEl;
let updateRunSummary = null; // Will be set in DOMContentLoaded

// Helper function to get character data from dropdowns, randomizing only blank fields
function getCharacterFromDropdowns(i, specialMode = null) {
  const typeSelect = document.getElementById(`member${i}_type`);
  const jobSelect = document.getElementById(`member${i}_job`);
  const secondarySelect = document.getElementById(`member${i}_secondary`);
  
  if (!typeSelect) return null;
  
  const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
  let characterType = typeSelect.value;
  let baseJob = null;
  let secondary = null;
  
  // For Ramza, always use "Ramza" as type
  if (i === 0) {
    characterType = "Ramza";
  }
  
  // Only randomize type if it's blank (and not Ramza)
  if (characterType === "" && i > 0) {
    characterType = Math.random() < 0.5 ? "Human" : "Monster";
  }
  
  // If type is still blank or "*", skip this character
  if (characterType === "" || characterType === "*") {
    return null;
  }
  
  // Get job/family - randomize only if blank
  const jobValue = jobSelect ? jobSelect.value : "";
  if (jobValue === "") {
    // Need to randomize
    if (characterType === "Ramza" || characterType === "Human") {
      baseJob = randomChoice(humanJobs);
    } else if (characterType === "Monster") {
      const familyIndex = Math.floor(Math.random() * monsterFamilies.length);
      const family = monsterFamilies[familyIndex];
      baseJob = randomChoice(family.members);
    }
  } else {
    // Use existing selection
    if (characterType === "Ramza" || characterType === "Human") {
      baseJob = jobValue;
    } else if (characterType === "Monster") {
      const familyIndex = parseInt(jobValue, 10);
      if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < monsterFamilies.length) {
        const family = monsterFamilies[familyIndex];
        // Check secondary for specific monster type
        const secondaryValue = secondarySelect ? secondarySelect.value : "";
        if (secondaryValue && secondaryValue !== "") {
          baseJob = secondaryValue;
        } else {
          // Blank means use family - will be displayed as family name in summary
          baseJob = randomChoice(family.members);
        }
      }
    }
  }
  
  // Get secondary - randomize only if blank (for humans/Ramza)
  if ((characterType === "Ramza" || characterType === "Human") && secondarySelect) {
    const secondaryValue = secondarySelect.value;
    if (secondaryValue === "" || secondaryValue === "none") {
      // Randomize secondary if blank
      if (baseJob && humanJobs.includes(baseJob)) {
        const availableJobs = humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
      }
    } else if (secondaryValue !== "") {
      secondary = secondaryValue === "none" ? null : secondaryValue;
    }
  }
  
  // For monsters, check if secondary is blank and store family info
  let familyName = null;
  if (characterType === "Monster" && jobSelect && secondarySelect) {
    const jobValue = jobSelect.value;
    const secondaryValue = secondarySelect.value;
    // If secondary is blank, use the family name in summary
    if (jobValue !== "" && secondaryValue === "") {
      const familyIndex = parseInt(jobValue, 10);
      if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < monsterFamilies.length) {
        familyName = monsterFamilies[familyIndex].name;
      }
    }
  }
  
  return {
    name,
    baseJob,
    secondary: secondary || null,
    characterType,
    note: null,
    familyName: familyName || null
  };
}

function generateRun(forceRandomize = false) {
  // Party size
  const sizeValue = document.getElementById("partySize").value;
  const partySize = sizeValue === "5" ? 5 : parseInt(sizeValue, 10);
  
  // If forceRandomize is true, clear all party member dropdowns first
  if (forceRandomize) {
    for (let i = 0; i < partySize; i++) {
      const typeSelect = document.getElementById(`member${i}_type`);
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      
      // Don't clear Ramza's type (it's always Ramza), but clear his job and secondary
      if (i === 0) {
        if (jobSelect) {
          jobSelect.value = "";
        }
        if (secondarySelect) {
          secondarySelect.value = "";
        }
        // Update Ramza's dropdowns
        updateMemberDropdowns(i);
      } else {
        // For other members, clear everything
        if (typeSelect) {
          typeSelect.value = "";
        }
        if (jobSelect) {
          jobSelect.value = "";
        }
        if (secondarySelect) {
          secondarySelect.value = "";
        }
        // Update dropdowns after clearing
        updateMemberDropdowns(i);
      }
    }
  }

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

    for (let i = 0; i < maxSlots; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : "Ally " + (i + 1);
      
      let baseJob = null;
      let secondary = null;
      
      // Check if job is already set
      if (jobSelect && jobSelect.value !== "" && fiestaJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        // Randomize from fiesta jobs - cycle through the 5 jobs
        baseJob = fiestaJobs[i % fiestaJobs.length];
      }
      
      // Check if secondary is already set
      if (secondarySelect && secondarySelect.value !== "" && secondarySelect.value !== "none" && fiestaJobs.includes(secondarySelect.value)) {
        secondary = secondarySelect.value;
      } else if (secondarySelect && (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Randomize secondary if blank
        const availableJobs = fiestaJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
      }
      
      characters.push({
        name,
        baseJob,
        secondary: secondary || null,
        fiestaJobs,
        note: ""
      });
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, partySize);

    renderResults({
      partySize,
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
    
    // 2 human units with random jobs (or use existing selections)
    for (let i = 0; i < 2; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : "Ally " + i;
      
      let baseJob = null;
      let secondary = null;
      
      if (jobSelect && jobSelect.value !== "" && humanJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        baseJob = randomChoice(humanJobs);
      }
      
      if (secondarySelect && secondarySelect.value !== "" && secondarySelect.value !== "none") {
        secondary = secondarySelect.value;
      } else if (secondarySelect && (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Randomize secondary if blank
        const availableJobs = humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
      }
      
      characters.push({
        name,
        baseJob,
        secondary: secondary || null,
        note: "Must mount chocobo on first turn"
      });
    }
    
    // 2 chocobos (or use existing selections)
    for (let i = 2; i < 4; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = "Chocobo " + (i - 1);
      
      let baseJob = null;
      
          if (secondarySelect && secondarySelect.value !== "" && chocoboFamily.members.includes(secondarySelect.value)) {
            baseJob = secondarySelect.value;
          } else if (jobSelect && jobSelect.value !== "") {
            const familyIndex = parseInt(jobSelect.value, 10);
            if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < monsterFamilies.length) {
              const family = monsterFamilies[familyIndex];
              if (family.name === "Chocobo Family") {
                if (secondarySelect && secondarySelect.value !== "") {
                  baseJob = secondarySelect.value;
                } else {
                  baseJob = randomChoice(family.members);
                }
              } else {
                baseJob = randomChoice(chocoboFamily.members);
              }
            } else {
              baseJob = randomChoice(chocoboFamily.members);
            }
          } else {
            baseJob = randomChoice(chocoboFamily.members);
          }
      
      characters.push({
        name,
        baseJob,
        note: "Mount for human unit"
      });
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, 4);

    renderResults({
      partySize: 4,
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
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
      
      let baseJob = null;
      let secondary = null;
      
      if (jobSelect && jobSelect.value !== "" && humanJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        baseJob = randomChoice(humanJobs);
      }
      
      if (secondarySelect && secondarySelect.value !== "" && secondarySelect.value !== "none") {
        secondary = secondarySelect.value;
      } else if (secondarySelect && (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Randomize secondary if blank
        const availableJobs = humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = randomChoice(availableJobs);
        }
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
    // Ramza gets a human job (or use existing selection)
    const ramzaJobSelect = document.getElementById(`member0_job`);
    const ramzaSecondarySelect = document.getElementById(`member0_secondary`);
    let ramzaJob = null;
    let ramzaSecondary = null;
    
    if (ramzaJobSelect && ramzaJobSelect.value !== "" && humanJobs.includes(ramzaJobSelect.value)) {
      ramzaJob = ramzaJobSelect.value;
    } else {
      ramzaJob = randomChoice(humanJobs);
    }
    
    if (ramzaSecondarySelect && ramzaSecondarySelect.value !== "" && ramzaSecondarySelect.value !== "none") {
      ramzaSecondary = ramzaSecondarySelect.value;
    } else if (ramzaSecondarySelect && (ramzaSecondarySelect.value === "" || ramzaSecondarySelect.value === "none")) {
      const availableJobs = humanJobs.filter(j => j !== ramzaJob);
      if (availableJobs.length > 0) {
        ramzaSecondary = randomChoice(availableJobs);
      }
    }
    
    characters.push({
      name: "Ramza",
      baseJob: ramzaJob,
      secondary: ramzaSecondary || null,
      note: ""
    });

    // Each monster gets its own family roll (or use existing selections)
    const families = [];
    for (let i = 1; i < maxSlots; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      let family = null;
      let member = null;
      
      let familyName = null;
      if (jobSelect && jobSelect.value !== "") {
        const selectedFamilyIndex = parseInt(jobSelect.value, 10);
        if (!isNaN(selectedFamilyIndex) && selectedFamilyIndex >= 0 && selectedFamilyIndex < monsterFamilies.length) {
          family = monsterFamilies[selectedFamilyIndex];
          if (secondarySelect && secondarySelect.value !== "" && family.members.includes(secondarySelect.value)) {
            member = secondarySelect.value;
          } else {
            member = randomChoice(family.members);
            // If secondary is blank, store family name to display in summary
            if (secondarySelect && secondarySelect.value === "") {
              familyName = family.name;
            }
          }
        }
      }
      
      if (!family) {
        const familyIndex = Math.floor(Math.random() * monsterFamilies.length);
        family = monsterFamilies[familyIndex];
        member = randomChoice(family.members);
      }
      
      families.push(family);
      characters.push({
        name: "Monster " + (i + 1),
        baseJob: member,
        members: family.members.slice(),
        family: family.name,
        familyName: familyName || null,
        note: ""
      });
    }

    // Populate dropdowns with generated values
    populateDropdownsFromCharacters(characters, partySize);

    renderResults({
      partySize,
      specialMode,
      scope: "monster",
      limitation: null,
      crystals,
      shops,
      randomBattles,
      families,
      characters
    });
    return;
  }

  // Normal mode: randomize only blank dropdowns
  for (let i = 0; i < maxSlots; i++) {
    const char = getCharacterFromDropdowns(i);
    if (char && char.baseJob) {
      characters.push(char);
    }
  }

  // Populate dropdowns with generated values
  populateDropdownsFromCharacters(characters, partySize);

  renderResults({
    partySize,
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
    
    // Ensure type dropdown is enabled for non-Ramza members
    if (i > 0) {
      typeSelect.removeAttribute('disabled');
    }
    
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
        // Ensure type dropdown is enabled before setting value
        if (i > 0) {
          typeSelect.removeAttribute('disabled');
        }
        typeSelect.value = "Monster";
        updateMemberDropdowns(i);
        // Ensure it stays enabled after updateMemberDropdowns
        if (i > 0) {
          typeSelect.removeAttribute('disabled');
        }
        
        const familyIndex = monsterFamilies.indexOf(family);
        jobSelect.value = String(familyIndex);
        updateMonsterTypeDropdown(i);
        
        // If familyName is set, it means blank was selected, so set to blank
        // Otherwise, set to the specific monster type
        if (char.familyName) {
          secondarySelect.value = "";
        } else {
          secondarySelect.value = char.baseJob;
        }
      }
    } else {
      // Human character
      // Ensure type dropdown is enabled before setting value
      if (i > 0) {
        typeSelect.removeAttribute('disabled');
      }
      const charType = char.characterType || (i === 0 ? "Ramza" : "Human");
      typeSelect.value = charType;
      updateMemberDropdowns(i);
      // Ensure it stays enabled after updateMemberDropdowns
      if (i > 0) {
        typeSelect.removeAttribute('disabled');
      }
      
      // Set values after dropdowns are populated
      if (jobSelect) {
        jobSelect.value = char.baseJob;
      }
      if (secondarySelect) {
        // Set secondary if it exists and is different from base job
        if (char.secondary && char.secondary !== char.baseJob && humanJobs.includes(char.secondary)) {
          secondarySelect.value = char.secondary;
        } else {
          // No secondary or invalid - set to "(none)" if option exists, otherwise blank
          if (secondarySelect.querySelector('option[value="none"]')) {
            secondarySelect.value = "none";
          } else {
            secondarySelect.value = "";
          }
        }
      }
    }
    // Update secondary enabled state after populating
    updateSecondaryEnabledState(i);
    // Final check: ensure type dropdown is enabled for non-Ramza members
    if (i > 0 && typeSelect) {
      typeSelect.removeAttribute('disabled');
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
      let displayJob = ch.baseJob;
      // If familyName is set, it means secondary was blank, so display the family name
      if (ch.familyName) {
        displayJob = ch.familyName;
      }
      let line = `<strong>${ch.name}</strong>: ${displayJob}`;
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

  html += `<div class="hint" style="margin-top:6px;"></div>`;

  resultsEl.innerHTML = html;
}

// ====== Reset ======
function resetForm() {
  document.getElementById("partySize").value = "5";

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
  partyMemberSettingsPanel = document.getElementById("partyMemberSettingsPanel");

  // Function to update run summary when any setting changes
  updateRunSummary = function() {
    generateRun();
  };

  // Initialize party member settings (after updateRunSummary is set)
  populatePartyMemberSettings();
  
  // Check initial mode and set panel visibility
  const initialMode = getSelectedRadio("specialMode");
  if (initialMode === "fjf") {
    if (partyMemberSettingsPanel) {
      partyMemberSettingsPanel.style.display = "none";
    }
  }

  // Function to add change listeners to party member dropdowns for run summary updates
  function addPartyMemberChangeListeners() {
    const partySize = partySizeSelect.value === "5" ? 5 : parseInt(partySizeSelect.value, 10);
    for (let i = 0; i < partySize; i++) {
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      if (secondarySelect) {
        // Add listener for secondary dropdown changes
        secondarySelect.addEventListener("change", updateRunSummary);
      }
    }
  }

  // Update party member settings when party size changes
  const partySizeSelect = document.getElementById("partySize");
  partySizeSelect.addEventListener("change", () => {
    populatePartyMemberSettings();
    addPartyMemberChangeListeners();
    updateRunSummary();
  });

  // Handle special mode changes
  const specialModeRadios = document.querySelectorAll('input[name="specialMode"]');
  specialModeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "cavalry") {
        partySizeSelect.value = "4";
        populatePartyMemberSettings();
        // Show party member settings panel
        if (partyMemberSettingsPanel) {
          partyMemberSettingsPanel.style.display = "";
        }
      } else if (radio.value === "fjf") {
        // Five Job Fiesta: force party size to 5 and hide party member settings
        partySizeSelect.value = "5";
        populatePartyMemberSettings();
        // Hide party member settings panel
        if (partyMemberSettingsPanel) {
          partyMemberSettingsPanel.style.display = "none";
        }
      } else {
        // Other modes: show party member settings panel
        if (partyMemberSettingsPanel) {
          partyMemberSettingsPanel.style.display = "";
        }
        // Update secondary enabled states for all members when mode changes
        const currentPartySize = partySizeSelect.value === "5" ? 5 : parseInt(partySizeSelect.value, 10);
        for (let i = 0; i < currentPartySize; i++) {
          updateSecondaryEnabledState(i);
        }
      }
      updateRunSummary();
    });
  });

  // Add event listeners to all radio buttons and dropdowns to update run summary
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", updateRunSummary);
  });

  // Add event listeners to party member dropdowns to update run summary
  function addPartyMemberChangeListeners() {
    const partySize = partySizeSelect.value === "5" ? 5 : parseInt(partySizeSelect.value, 10);
    for (let i = 0; i < partySize; i++) {
      const typeSelect = document.getElementById(`member${i}_type`);
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      
      if (typeSelect) {
        typeSelect.removeEventListener("change", updateRunSummary);
        typeSelect.addEventListener("change", updateRunSummary);
      }
      if (jobSelect) {
        jobSelect.removeEventListener("change", updateRunSummary);
        jobSelect.addEventListener("change", updateRunSummary);
      }
      if (secondarySelect) {
        secondarySelect.removeEventListener("change", updateRunSummary);
        secondarySelect.addEventListener("change", updateRunSummary);
      }
    }
  }

  // Update listeners when party size changes
  partySizeSelect.addEventListener("change", addPartyMemberChangeListeners);
  
  // Initial setup of listeners
  addPartyMemberChangeListeners();

  // Generate initial run summary
  updateRunSummary();

  document.getElementById("btnRandomize").addEventListener("click", () => {
    generateRun(true); // Force randomization of everything
  });
  document.getElementById("btnReset").addEventListener("click", resetForm);
});

