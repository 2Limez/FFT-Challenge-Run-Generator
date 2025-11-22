// ============================================================================
// FFT Challenge Run Generator - Modular Structure
// ============================================================================

// ============================================================================
// DATA MODULE
// ============================================================================
const Data = {
  humanJobs: [
    "Squire", "Chemist", "Knight", "Archer", "White Mage", "Black Mage",
    "Monk", "Thief", "Oracle", "Time Mage", "Geomancer", "Dragoon",
    "Orator", "Summoner", "Samurai", "Ninja", "Arithmetician",
    "Dancer", "Bard", "Mime"
  ],

  uniqueCharacterJobs: [
    "Mustadio", "Agrias", "Rapha", "Marach", "Cloud", "Beowulf", "Reis", "Orlandeau", "Meliadoul"
  ],

  monsterFamilies: [
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
  ],

  uniqueMonsterFamilies: [
    { name: "Construct 8", members: [] },
    { name: "Byblos", members: [] }
  ],

  getAllMonsterTypes() {
    const types = [];
    this.monsterFamilies.forEach(family => {
      family.members.forEach(member => types.push(member));
    });
    return types;
  }
};

// ============================================================================
// UTILITY MODULE
// ============================================================================
const Utils = {
  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  getSelectedRadio(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  },

  getPartySize() {
    const sizeValue = document.getElementById("partySize").value;
    return sizeValue === "5" ? 5 : parseInt(sizeValue, 10);
  }
};

// ============================================================================
// PARTY MEMBER UI MODULE
// ============================================================================
const PartyMemberUI = {
  container: null,
  panel: null,
  updateRunSummary: null,

  init(container, panel, updateRunSummaryFn) {
    this.container = container;
    this.panel = panel;
    this.updateRunSummary = updateRunSummaryFn;
  },

  populate() {
    const partySize = Utils.getPartySize();
    this.container.innerHTML = "";
    
    for (let i = 0; i < partySize; i++) {
      this._createMemberRow(i);
    }
    
    // Initialize dropdowns for all members
    for (let i = 0; i < partySize; i++) {
      this.updateMemberDropdowns(i);
      this._setupRamza(i);
      this.updateSecondaryEnabledState(i);
    }
  },

  _createMemberRow(i) {
    const memberDiv = document.createElement("div");
    memberDiv.className = "party-member-row";
    
    const memberLabel = document.createElement("div");
    memberLabel.className = "party-member-label";
    memberLabel.textContent = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
    memberDiv.appendChild(memberLabel);
    
    const dropdownsContainer = document.createElement("div");
    dropdownsContainer.className = "party-member-dropdowns";
    
    // Type dropdown
    const typeSelect = this._createTypeDropdown(i);
    dropdownsContainer.appendChild(typeSelect);
    
    // Job dropdown
    const jobSelect = this._createJobDropdown(i);
    dropdownsContainer.appendChild(jobSelect);
    
    // Secondary dropdown
    const secondaryContainer = this._createSecondaryDropdown(i);
    dropdownsContainer.appendChild(secondaryContainer);
    
    memberDiv.appendChild(dropdownsContainer);
    this.container.appendChild(memberDiv);
  },

  _createTypeDropdown(i) {
    const typeSelect = document.createElement("select");
    typeSelect.id = `member${i}_type`;
    typeSelect.className = "member-type-select";
    
    if (i === 0) {
      const opt = document.createElement("option");
      opt.value = "Ramza";
      opt.textContent = "Ramza";
      opt.selected = true;
      typeSelect.appendChild(opt);
      typeSelect.disabled = true;
    } else {
      ["", "*", "Human", "Monster"].forEach(optVal => {
        const opt = document.createElement("option");
        opt.value = optVal;
        opt.textContent = optVal || "";
        typeSelect.appendChild(opt);
      });
      typeSelect.removeAttribute('disabled');
    }
    
    typeSelect.addEventListener("change", () => {
      this.updateMemberDropdowns(i);
      this.updateSecondaryEnabledState(i);
      if (this.updateRunSummary) this.updateRunSummary();
    });
    
    return typeSelect;
  },

  _createJobDropdown(i) {
    const jobSelect = document.createElement("select");
    jobSelect.id = `member${i}_job`;
    jobSelect.className = "member-job-select";
    jobSelect.style.display = "none";
    
    jobSelect.addEventListener("change", () => {
      const typeSel = document.getElementById(`member${i}_type`);
      if (typeSel && typeSel.value === "Monster") {
        this.updateMonsterTypeDropdown(i);
      }
      this.updateSecondaryEnabledState(i);
      if (this.updateRunSummary) this.updateRunSummary();
    });
    
    return jobSelect;
  },

  _createSecondaryDropdown(i) {
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
      if (this.updateRunSummary) this.updateRunSummary();
    });
    
    secondaryContainer.appendChild(secondaryLabel);
    secondaryContainer.appendChild(secondarySelect);
    return secondaryContainer;
  },

  _setupRamza(i) {
    if (i === 0) {
      const typeSelect = document.getElementById(`member${i}_type`);
      if (typeSelect && typeSelect.value === "Ramza") {
        const jobSelect = document.getElementById(`member${i}_job`);
        const secondaryLabel = document.getElementById(`member${i}_secondaryLabel`);
        const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
        
        if (jobSelect) {
          jobSelect.style.display = "flex";
          jobSelect.value = "";
        }
        if (secondaryContainer) {
          secondaryContainer.style.display = "inline-flex";
        }
        const secondarySelect = document.getElementById(`member${i}_secondary`);
        if (secondarySelect) secondarySelect.value = "";
      }
    } else {
      const typeSelect = document.getElementById(`member${i}_type`);
      if (typeSelect) typeSelect.removeAttribute('disabled');
    }
  },

  updateMemberDropdowns(memberIndex) {
    const typeSelect = document.getElementById(`member${memberIndex}_type`);
    const jobSelect = document.getElementById(`member${memberIndex}_job`);
    const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
    const secondaryLabel = document.getElementById(`member${memberIndex}_secondaryLabel`);
    const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
    
    if (!typeSelect || !jobSelect) return;
    
    if (memberIndex > 0) {
      typeSelect.removeAttribute('disabled');
    }
    
    const type = typeSelect.value;
    jobSelect.innerHTML = "";
    jobSelect.style.display = "none";
    if (secondaryContainer) secondaryContainer.style.display = "none";
    
    // Handle blank type by defaulting to Human for non-Ramza members
    const effectiveType = (type === "" && memberIndex > 0) ? "Human" : type;
    
    if (effectiveType === "Ramza" || effectiveType === "Human") {
      this._populateHumanJobDropdown(jobSelect, secondarySelect, secondaryContainer, secondaryLabel, memberIndex);
    } else if (effectiveType === "Monster") {
      this._populateMonsterJobDropdown(jobSelect, secondarySelect, secondaryContainer, secondaryLabel, memberIndex);
    }
    
    this.updateSecondaryEnabledState(memberIndex);
  },

  _populateHumanJobDropdown(jobSelect, secondarySelect, secondaryContainer, secondaryLabel, memberIndex) {
    jobSelect.style.display = "flex";
    jobSelect.appendChild(this._createOption("", ""));
    Data.humanJobs.forEach(job => {
      jobSelect.appendChild(this._createOption(job, job));
    });
    
    // Add unique character jobs if allowed, but never for Five Job Fiesta or Ramza (memberIndex 0)
    const isFJF = Utils.getSelectedRadio("specialMode") === "fjf";
    const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
    const isRamza = memberIndex === 0;
    if (uniqueAllowed && !isFJF && !isRamza) {
      Data.uniqueCharacterJobs.forEach(job => {
        jobSelect.appendChild(this._createOption(job, job));
      });
    }
    
    if (!isFJF && secondaryContainer) {
      secondaryContainer.style.display = "inline-flex";
      if (secondaryLabel) secondaryLabel.textContent = "Secondary: ";
      secondarySelect.innerHTML = "";
      secondarySelect.appendChild(this._createOption("", ""));
      secondarySelect.appendChild(this._createOption("none", "(none)"));
      Data.humanJobs.forEach(job => {
        secondarySelect.appendChild(this._createOption(job, job));
      });
      // Note: Unique character jobs are NOT added to secondary dropdown
    } else if (isFJF && secondaryContainer) {
      secondaryContainer.style.display = "none";
    }
  },

  _populateMonsterJobDropdown(jobSelect, secondarySelect, secondaryContainer, secondaryLabel, memberIndex) {
    jobSelect.style.display = "flex";
    jobSelect.appendChild(this._createOption("", ""));
    Data.monsterFamilies.forEach((family, index) => {
      jobSelect.appendChild(this._createOption(String(index), family.name));
    });
    
    // Add unique monster families if allowed
    const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
    if (uniqueAllowed) {
      // Use negative indices to distinguish unique families from regular ones
      Data.uniqueMonsterFamilies.forEach((family, index) => {
        jobSelect.appendChild(this._createOption(String(-(index + 1)), family.name));
      });
    }
    
    if (secondaryContainer) secondaryContainer.style.display = "inline-flex";
    if (secondaryLabel) secondaryLabel.textContent = "Type: ";
    
    this.updateMonsterTypeDropdown(memberIndex);
  },

  updateMonsterTypeDropdown(memberIndex) {
    const jobSelect = document.getElementById(`member${memberIndex}_job`);
    const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
    
    if (!jobSelect || !secondarySelect) return;
    
    const currentValue = secondarySelect.value;
    secondarySelect.innerHTML = "";
    secondarySelect.appendChild(this._createOption("", ""));
    
    const familyIndex = parseInt(jobSelect.value, 10);
    
    // Handle unique monster families (negative indices) - they have no types
    if (!isNaN(familyIndex) && familyIndex < 0) {
      const uniqueIndex = Math.abs(familyIndex) - 1;
      if (uniqueIndex >= 0 && uniqueIndex < Data.uniqueMonsterFamilies.length) {
        // Unique families have no types, so dropdown stays blank
        secondarySelect.value = "";
      } else {
        secondarySelect.value = "";
      }
    } else if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < Data.monsterFamilies.length) {
      const family = Data.monsterFamilies[familyIndex];
      family.members.forEach(member => {
        secondarySelect.appendChild(this._createOption(member, member));
      });
      
      if (currentValue === "" || family.members.includes(currentValue)) {
        secondarySelect.value = currentValue;
      } else {
        secondarySelect.value = "";
      }
    } else {
      secondarySelect.value = "";
    }
  },

  updateSecondaryEnabledState(memberIndex) {
    const jobSelect = document.getElementById(`member${memberIndex}_job`);
    const secondarySelect = document.getElementById(`member${memberIndex}_secondary`);
    const typeSelect = document.getElementById(`member${memberIndex}_type`);
    const secondaryLabel = document.getElementById(`member${memberIndex}_secondaryLabel`);
    const secondaryContainer = secondaryLabel ? secondaryLabel.parentElement : null;
    
    if (!secondarySelect) return;
    
    const isFJF = Utils.getSelectedRadio("specialMode") === "fjf";
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    const secondaryAllowed = allowSecondary === "allowed";
    const type = typeSelect ? typeSelect.value : "";
    const isHuman = type === "Ramza" || type === "Human";
    const isMonster = type === "Monster";
    
    if (isHuman) {
      if (isFJF || !secondaryAllowed) {
        if (secondaryContainer) secondaryContainer.style.display = "none";
      } else {
        if (secondaryContainer) secondaryContainer.style.display = "inline-flex";
        secondarySelect.disabled = !jobSelect || jobSelect.value === "";
      }
    } else if (isMonster) {
      secondarySelect.disabled = !jobSelect || jobSelect.value === "";
    } else {
      secondarySelect.disabled = true;
    }
  },

  _createOption(value, text) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = text;
    return opt;
  },

  populateFromCharacters(characters, partySize) {
    for (let i = 0; i < Math.min(characters.length, partySize); i++) {
      const char = characters[i];
      const typeSelect = document.getElementById(`member${i}_type`);
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      if (!typeSelect) continue;
      
      if (i > 0) typeSelect.removeAttribute('disabled');
      
      const isMonster = Data.monsterFamilies.some(family => 
        family.members.includes(char.baseJob)
      );
      
      if (isMonster) {
        const family = Data.monsterFamilies.find(f => f.members.includes(char.baseJob));
        if (family) {
          if (i > 0) typeSelect.removeAttribute('disabled');
          typeSelect.value = "Monster";
          this.updateMemberDropdowns(i);
          if (i > 0) typeSelect.removeAttribute('disabled');
          
          const familyIndex = Data.monsterFamilies.indexOf(family);
          jobSelect.value = String(familyIndex);
          this.updateMonsterTypeDropdown(i);
          
          if (char.familyName) {
            secondarySelect.value = "";
          } else {
            secondarySelect.value = char.baseJob;
          }
        }
      } else {
        if (i > 0) typeSelect.removeAttribute('disabled');
        const charType = char.characterType || (i === 0 ? "Ramza" : "Human");
        typeSelect.value = charType;
        this.updateMemberDropdowns(i);
        if (i > 0) typeSelect.removeAttribute('disabled');
        
        if (jobSelect) jobSelect.value = char.baseJob;
        if (secondarySelect) {
          if (char.secondary && char.secondary !== char.baseJob && Data.humanJobs.includes(char.secondary)) {
            secondarySelect.value = char.secondary;
          } else {
            if (secondarySelect.querySelector('option[value="none"]')) {
              secondarySelect.value = "none";
            } else {
              secondarySelect.value = "";
            }
          }
        }
      }
      this.updateSecondaryEnabledState(i);
      if (i > 0 && typeSelect) typeSelect.removeAttribute('disabled');
    }
  },

  clearAll(partySize) {
    for (let i = 0; i < partySize; i++) {
      const typeSelect = document.getElementById(`member${i}_type`);
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      
      if (i === 0) {
        if (jobSelect) jobSelect.value = "";
        if (secondarySelect) secondarySelect.value = "";
        this.updateMemberDropdowns(i);
      } else {
        if (typeSelect) typeSelect.value = "";
        if (jobSelect) jobSelect.value = "";
        if (secondarySelect) secondarySelect.value = "";
        this.updateMemberDropdowns(i);
      }
    }
  }
};

// ============================================================================
// CHARACTER GENERATION MODULE
// ============================================================================
const CharacterGenerator = {
  getFromDropdowns(i) {
    const typeSelect = document.getElementById(`member${i}_type`);
    const jobSelect = document.getElementById(`member${i}_job`);
    const secondarySelect = document.getElementById(`member${i}_secondary`);
    
    if (!typeSelect) return null;
    
    const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
    let characterType = typeSelect.value;
    let baseJob = null;
    let secondary = null;
    
    if (i === 0) characterType = "Ramza";
    
    if (characterType === "" && i > 0) {
      characterType = Math.random() < 0.5 ? "Human" : "Monster";
    }
    
    if (characterType === "" || characterType === "*") return null;
    
    // Get job/family
    const jobValue = jobSelect ? jobSelect.value : "";
    if (jobValue === "") {
      if (characterType === "Ramza" || characterType === "Human") {
        const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
        // Ramza (i === 0) cannot have unique character jobs
        const availableJobs = (uniqueAllowed && i > 0)
          ? [...Data.humanJobs, ...Data.uniqueCharacterJobs]
          : Data.humanJobs;
        baseJob = Utils.randomChoice(availableJobs);
      } else if (characterType === "Monster") {
        const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
        const allFamilies = uniqueAllowed
          ? [...Data.monsterFamilies, ...Data.uniqueMonsterFamilies]
          : Data.monsterFamilies;
        const familyIndex = Math.floor(Math.random() * allFamilies.length);
        const family = allFamilies[familyIndex];
        if (family.members.length > 0) {
          baseJob = Utils.randomChoice(family.members);
        } else {
          // Unique families have no members, use family name as job
          baseJob = family.name;
        }
      }
    } else {
      if (characterType === "Ramza" || characterType === "Human") {
        baseJob = jobValue;
      } else if (characterType === "Monster") {
        const familyIndex = parseInt(jobValue, 10);
        // Handle unique monster families (negative indices)
        if (!isNaN(familyIndex) && familyIndex < 0) {
          const uniqueIndex = Math.abs(familyIndex) - 1;
          if (uniqueIndex >= 0 && uniqueIndex < Data.uniqueMonsterFamilies.length) {
            const family = Data.uniqueMonsterFamilies[uniqueIndex];
            // Unique families have no types, so use family name as job
            baseJob = family.name;
          }
        } else if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < Data.monsterFamilies.length) {
          const family = Data.monsterFamilies[familyIndex];
          const secondaryValue = secondarySelect ? secondarySelect.value : "";
          if (secondaryValue && secondaryValue !== "") {
            baseJob = secondaryValue;
          } else {
            baseJob = Utils.randomChoice(family.members);
          }
        }
      }
    }
    
    // Get secondary
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    const secondaryAllowed = allowSecondary === "allowed";
    
    if ((characterType === "Ramza" || characterType === "Human") && secondarySelect && secondaryAllowed) {
      const secondaryValue = secondarySelect.value;
      if (secondaryValue === "" || secondaryValue === "none") {
        if (baseJob && Data.humanJobs.includes(baseJob)) {
          const availableJobs = Data.humanJobs.filter(j => j !== baseJob);
          if (availableJobs.length > 0) {
            secondary = Utils.randomChoice(availableJobs);
          }
        }
      } else if (secondaryValue !== "") {
        secondary = secondaryValue === "none" ? null : secondaryValue;
      }
    } else {
      secondary = null;
    }
    
    // For monsters, check if secondary is blank and store family info
    let familyName = null;
    if (characterType === "Monster" && jobSelect && secondarySelect) {
      const jobValue = jobSelect.value;
      const secondaryValue = secondarySelect.value;
      if (jobValue !== "" && secondaryValue === "") {
        const familyIndex = parseInt(jobValue, 10);
        // Handle unique monster families (negative indices)
        if (!isNaN(familyIndex) && familyIndex < 0) {
          const uniqueIndex = Math.abs(familyIndex) - 1;
          if (uniqueIndex >= 0 && uniqueIndex < Data.uniqueMonsterFamilies.length) {
            familyName = Data.uniqueMonsterFamilies[uniqueIndex].name;
          }
        } else if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < Data.monsterFamilies.length) {
          familyName = Data.monsterFamilies[familyIndex].name;
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
};

// ============================================================================
// SPECIAL MODES MODULE
// ============================================================================
const SpecialModes = {
  generateFiveJobFiesta(partySize) {
    // Five Job Fiesta never allows unique characters
    const availableJobs = Data.humanJobs;
    const shuffledJobs = Utils.shuffle(availableJobs);
    const fiestaJobs = shuffledJobs.slice(0, 5);
    const characters = [];
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    const secondaryAllowed = allowSecondary === "allowed";
    
    for (let i = 0; i < partySize; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : "Ally " + (i + 1);
      
      let baseJob = null;
      if (jobSelect && jobSelect.value !== "" && fiestaJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        baseJob = fiestaJobs[i % fiestaJobs.length];
      }
      
      let secondary = null;
      if (secondaryAllowed && secondarySelect && secondarySelect.value !== "" && 
          secondarySelect.value !== "none") {
        // Only allow regular human jobs as secondary, not unique characters
        if (Data.humanJobs.includes(secondarySelect.value) && fiestaJobs.includes(secondarySelect.value)) {
          secondary = secondarySelect.value;
        }
      } else if (secondaryAllowed && secondarySelect && 
                 (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Only randomize from regular human jobs for secondary
        const availableSecondaryJobs = fiestaJobs.filter(j => j !== baseJob && Data.humanJobs.includes(j));
        if (availableSecondaryJobs.length > 0) {
          secondary = Utils.randomChoice(availableSecondaryJobs);
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
    
    return { characters, fiestaJobs };
  },

  generateCavalry() {
    const chocoboFamily = Data.monsterFamilies.find(f => f.name === "Chocobo Family");
    const characters = [];
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    const secondaryAllowed = allowSecondary === "allowed";
    
    // 2 human units
    for (let i = 0; i < 2; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : "Ally " + i;
      
      const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
      // Ramza (i === 0) cannot have unique character jobs
      const availableJobs = (uniqueAllowed && i > 0)
        ? [...Data.humanJobs, ...Data.uniqueCharacterJobs]
        : Data.humanJobs;
      
      let baseJob = null;
      if (jobSelect && jobSelect.value !== "" && availableJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        baseJob = Utils.randomChoice(availableJobs);
      }
      
      let secondary = null;
      if (secondaryAllowed && secondarySelect && secondarySelect.value !== "" && 
          secondarySelect.value !== "none") {
        // Only allow regular human jobs as secondary, not unique characters
        if (Data.humanJobs.includes(secondarySelect.value)) {
          secondary = secondarySelect.value;
        }
      } else if (secondaryAllowed && secondarySelect && 
                 (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Only randomize from regular human jobs for secondary
        const availableJobs = Data.humanJobs.filter(j => j !== baseJob);
        if (availableJobs.length > 0) {
          secondary = Utils.randomChoice(availableJobs);
        }
      }
      
      characters.push({
        name,
        baseJob,
        secondary: secondary || null,
        note: "Must mount chocobo on first turn"
      });
    }
    
    // 2 chocobos
    for (let i = 2; i < 4; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = "Chocobo " + (i - 1);
      let baseJob = null;
      
      if (secondarySelect && secondarySelect.value !== "" && 
          chocoboFamily.members.includes(secondarySelect.value)) {
        baseJob = secondarySelect.value;
      } else if (jobSelect && jobSelect.value !== "") {
        const familyIndex = parseInt(jobSelect.value, 10);
        if (!isNaN(familyIndex) && familyIndex >= 0 && familyIndex < Data.monsterFamilies.length) {
          const family = Data.monsterFamilies[familyIndex];
          if (family.name === "Chocobo Family") {
            baseJob = secondarySelect && secondarySelect.value !== "" 
              ? secondarySelect.value 
              : Utils.randomChoice(family.members);
          } else {
            baseJob = Utils.randomChoice(chocoboFamily.members);
          }
        } else {
          baseJob = Utils.randomChoice(chocoboFamily.members);
        }
      } else {
        baseJob = Utils.randomChoice(chocoboFamily.members);
      }
      
      characters.push({
        name,
        baseJob,
        note: "Mount for human unit"
      });
    }
    
    return { characters };
  },

  generateHumansOnly(partySize) {
    const characters = [];
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    const secondaryAllowed = allowSecondary === "allowed";
    const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
    
    for (let i = 0; i < partySize; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      const name = i === 0 ? "Ramza" : `Party Member ${i + 1}`;
      
      // Ramza (i === 0) cannot have unique character jobs
      const availableJobs = (uniqueAllowed && i > 0)
        ? [...Data.humanJobs, ...Data.uniqueCharacterJobs]
        : Data.humanJobs;
      
      let baseJob = null;
      if (jobSelect && jobSelect.value !== "" && availableJobs.includes(jobSelect.value)) {
        baseJob = jobSelect.value;
      } else {
        baseJob = Utils.randomChoice(availableJobs);
      }
      
      let secondary = null;
      if (secondaryAllowed && secondarySelect && secondarySelect.value !== "" && 
          secondarySelect.value !== "none") {
        // Only allow regular human jobs as secondary, not unique characters
        if (Data.humanJobs.includes(secondarySelect.value)) {
          secondary = secondarySelect.value;
        }
      } else if (secondaryAllowed && secondarySelect && 
                 (secondarySelect.value === "" || secondarySelect.value === "none")) {
        // Only randomize from regular human jobs for secondary
        const availableSecondaryJobs = Data.humanJobs.filter(j => j !== baseJob);
        if (availableSecondaryJobs.length > 0) {
          secondary = Utils.randomChoice(availableSecondaryJobs);
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
    
    return { characters };
  },

  generateMonstrous(partySize) {
    const characters = [];
    const families = [];
    
    // Ramza gets a human job
    const ramzaJobSelect = document.getElementById(`member0_job`);
    const ramzaSecondarySelect = document.getElementById(`member0_secondary`);
    let ramzaJob = null;
    let ramzaSecondary = null;
    
    if (ramzaJobSelect && ramzaJobSelect.value !== "" && Data.humanJobs.includes(ramzaJobSelect.value)) {
      ramzaJob = ramzaJobSelect.value;
    } else {
      ramzaJob = Utils.randomChoice(Data.humanJobs);
    }
    
    if (ramzaSecondarySelect && ramzaSecondarySelect.value !== "" && 
        ramzaSecondarySelect.value !== "none") {
      ramzaSecondary = ramzaSecondarySelect.value;
    } else if (ramzaSecondarySelect && 
               (ramzaSecondarySelect.value === "" || ramzaSecondarySelect.value === "none")) {
      const availableJobs = Data.humanJobs.filter(j => j !== ramzaJob);
      if (availableJobs.length > 0) {
        ramzaSecondary = Utils.randomChoice(availableJobs);
      }
    }
    
    characters.push({
      name: "Ramza",
      baseJob: ramzaJob,
      secondary: ramzaSecondary || null,
      note: ""
    });
    
    // Each monster gets its own family roll
    const uniqueAllowed = Utils.getSelectedRadio("uniqueCharacters") === "allowed";
    const allFamilies = uniqueAllowed
      ? [...Data.monsterFamilies, ...Data.uniqueMonsterFamilies]
      : Data.monsterFamilies;
    
    for (let i = 1; i < partySize; i++) {
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      let family = null;
      let member = null;
      let familyName = null;
      
      if (jobSelect && jobSelect.value !== "") {
        const selectedFamilyIndex = parseInt(jobSelect.value, 10);
        // Handle unique monster families (negative indices)
        if (!isNaN(selectedFamilyIndex) && selectedFamilyIndex < 0) {
          const uniqueIndex = Math.abs(selectedFamilyIndex) - 1;
          if (uniqueIndex >= 0 && uniqueIndex < Data.uniqueMonsterFamilies.length) {
            family = Data.uniqueMonsterFamilies[uniqueIndex];
            // Unique families have no members, use family name as job
            member = family.name;
            familyName = family.name;
          }
        } else if (!isNaN(selectedFamilyIndex) && selectedFamilyIndex >= 0 && 
            selectedFamilyIndex < Data.monsterFamilies.length) {
          family = Data.monsterFamilies[selectedFamilyIndex];
          if (secondarySelect && secondarySelect.value !== "" && 
              family.members.includes(secondarySelect.value)) {
            member = secondarySelect.value;
          } else {
            member = Utils.randomChoice(family.members);
            if (secondarySelect && secondarySelect.value === "") {
              familyName = family.name;
            }
          }
        }
      }
      
      if (!family) {
        const familyIndex = Math.floor(Math.random() * allFamilies.length);
        family = allFamilies[familyIndex];
        if (family.members.length > 0) {
          member = Utils.randomChoice(family.members);
        } else {
          // Unique families have no members, use family name as job
          member = family.name;
        }
      }
      
      families.push(family);
      characters.push({
        name: "Monster " + (i + 1),
        baseJob: member,
        members: family.members.length > 0 ? family.members.slice() : [],
        family: family.name,
        familyName: familyName || null,
        note: ""
      });
    }
    
    return { characters, families };
  }
};

// ============================================================================
// RUN GENERATION MODULE
// ============================================================================
const RunGenerator = {
  generate(forceRandomize = false) {
    const partySize = Utils.getPartySize();
    
    if (forceRandomize) {
      PartyMemberUI.clearAll(partySize);
    }
    
    const specialMode = Utils.getSelectedRadio("specialMode");
    const shops = Utils.getSelectedRadio("shops");
    const randomBattles = Utils.getSelectedRadio("randomBattles");
    const allowSecondary = Utils.getSelectedRadio("allowSecondary");
    
    let result;
    
    if (specialMode === "fjf") {
      result = SpecialModes.generateFiveJobFiesta(partySize);
      PartyMemberUI.populateFromCharacters(result.characters, partySize);
      Renderer.render({
        partySize,
        specialMode,
        scope: "human",
        limitation: null,
        shops,
        randomBattles,
        allowSecondary,
        fiestaJobs: result.fiestaJobs,
        characters: result.characters
      });
      return;
    }
    
    if (specialMode === "cavalry") {
      result = SpecialModes.generateCavalry();
      PartyMemberUI.populateFromCharacters(result.characters, 4);
      Renderer.render({
        partySize: 4,
        specialMode,
        scope: "human",
        limitation: null,
        shops,
        randomBattles,
        allowSecondary,
        characters: result.characters
      });
      return;
    }
    
    if (specialMode === "humansOnly") {
      result = SpecialModes.generateHumansOnly(partySize);
      PartyMemberUI.populateFromCharacters(result.characters, partySize);
      Renderer.render({
        partySize,
        specialMode,
        scope: "human",
        limitation: null,
        shops,
        randomBattles,
        allowSecondary,
        characters: result.characters
      });
      return;
    }
    
    if (specialMode === "monstrous") {
      result = SpecialModes.generateMonstrous(partySize);
      PartyMemberUI.populateFromCharacters(result.characters, partySize);
      Renderer.render({
        partySize,
        specialMode,
        scope: "monster",
        limitation: null,
        shops,
        randomBattles,
        allowSecondary,
        families: result.families,
        characters: result.characters
      });
      return;
    }
    
    // Normal mode
    const characters = [];
    for (let i = 0; i < partySize; i++) {
      const char = CharacterGenerator.getFromDropdowns(i);
      if (char && char.baseJob) {
        characters.push(char);
      }
    }
    
    PartyMemberUI.populateFromCharacters(characters, partySize);
    Renderer.render({
      partySize,
      specialMode,
      scope: "mixed",
      limitation: null,
      shops,
      randomBattles,
      allowSecondary,
      characters
    });
  }
};

// ============================================================================
// RENDERER MODULE
// ============================================================================
const Renderer = {
  resultsEl: null,

  init(resultsEl) {
    this.resultsEl = resultsEl;
  },

  render(data) {
    const {
      partySize,
      specialMode,
      scope,
      limitation,
      shops,
      randomBattles,
      allowSecondary,
      fiestaJobs,
      family,
      families,
      characters
    } = data;

    const sizeLabel = partySize === 5 ? "* (full party)" : String(partySize);
    const specialLabel = this._getSpecialLabel(specialMode);
    const scopeLabel = scope === "monster" ? "Monster Families" : scope === "mixed" ? "Mixed" : "Human Jobs";
    const limitationLabel = this._getLimitationLabel(limitation);

    let html = "";

    html += `<div class="results-section-title">General</div>`;
    html += `<div class="row"><span class="label">Party Size</span><span class="value">${sizeLabel}</span></div>`;
    html += `<div class="row"><span class="label">Challenge Mode</span><span class="value">${specialLabel}</span></div>`;
    if (limitation) {
      html += `<div class="row"><span class="label">Job Scope</span><span class="value">${scopeLabel}</span></div>`;
      html += `<div class="row"><span class="label">Job Limitation</span><span class="value">${limitationLabel}</span></div>`;
    }

    // Run Rules section
    const hasShopsRule = shops === "Items Only" || shops === "Strict";
    const hasRandomBattlesRule = randomBattles === "Forbidden";
    
    if (hasShopsRule || hasRandomBattlesRule) {
      html += `<div class="results-section-title">Run Rules</div>`;
      if (shops === "Items Only") {
        html += `<div style="margin-bottom:8px;">You cannot buy equipment from shops (except for poaches).</div>`;
      } else if (shops === "Strict") {
        html += `<div style="margin-bottom:8px;">You cannot buy anything from shops (except for poaches).</div>`;
      }
      if (randomBattles === "Forbidden") {
        html += `<div style="margin-bottom:8px;">You must skip all random battles.</div>`;
      }
      html += `</div>`;
    }

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
        if (ch.familyName) displayJob = ch.familyName;
        let line = `<strong>${ch.name}</strong>: ${displayJob}`;
        if (ch.secondary) line += ` / ${ch.secondary}`;
        if (ch.note) line += ` <span class="small">(${ch.note})</span>`;
        html += `<li>${line}</li>`;
      });
      html += `</ul>`;
    }

    html += `<div class="hint" style="margin-top:6px;"></div>`;
    this.resultsEl.innerHTML = html;
  },

  _getSpecialLabel(specialMode) {
    const labels = {
      "normal": "Normal",
      "monstrous": "Monstrous",
      "fjf": "Five Job Fiesta",
      "cavalry": "Cavalry Challenge",
      "humansOnly": "Humans Only"
    };
    return labels[specialMode] || "Normal";
  },

  _getLimitationLabel(limitation) {
    const labels = {
      "strict": "Strict",
      "locked": "Locked",
      "secondary": "Secondary",
      "monster-loose": "Monster (Loose)",
      "monster-strict": "Monster (Strict)"
    };
    return labels[limitation] || limitation;
  }
};

// ============================================================================
// SETTINGS MODULE
// ============================================================================
const Settings = {
  randomize(skipPartySize = false) {
    const partySizeSelect = document.getElementById("partySize");
    
    if (!skipPartySize) {
      const partySizeOptions = ["1", "2", "3", "4", "5"];
      const randomPartySize = Utils.randomChoice(partySizeOptions);
      const oldValue = partySizeSelect.value;
      partySizeSelect.value = randomPartySize;
      
      if (oldValue !== randomPartySize || true) {
        partySizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    const shopsOptions = ["Normal", "Items Only", "Strict"];
    document.querySelector(`input[name="shops"][value="${Utils.randomChoice(shopsOptions)}"]`).checked = true;
    
    const randomBattlesOptions = ["Normal", "Forbidden"];
    document.querySelector(`input[name="randomBattles"][value="${Utils.randomChoice(randomBattlesOptions)}"]`).checked = true;
    
    const allowSecondaryOptions = ["allowed", "disallowed"];
    document.querySelector(`input[name="allowSecondary"][value="${Utils.randomChoice(allowSecondaryOptions)}"]`).checked = true;
    
    const uniqueCharactersOptions = ["allowed", "disallowed"];
    document.querySelector(`input[name="uniqueCharacters"][value="${Utils.randomChoice(uniqueCharactersOptions)}"]`).checked = true;
  },

  reset() {
    document.getElementById("partySize").value = "5";
    document.querySelector('input[name="specialMode"][value="normal"]').checked = true;
    document.querySelector('input[name="shops"][value="Normal"]').checked = true;
    document.querySelector('input[name="randomBattles"][value="Normal"]').checked = true;
    document.querySelector('input[name="allowSecondary"][value="allowed"]').checked = true;
    
    PartyMemberUI.populate();
    Renderer.resultsEl.innerHTML = `<div class="hint">
      Configure options on the left, then select <strong>Randomize All</strong> to generate a challenge.
    </div>`;
  },

  resetPartyMembers() {
    const partySize = Utils.getPartySize();
    PartyMemberUI.clearAll(partySize);
    RunGenerator.generate();
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize modules
  const partyMemberSettingsContainer = document.getElementById("partyMemberSettings");
  const resultsEl = document.getElementById("results");
  const partyMemberSettingsPanel = document.getElementById("partyMemberSettingsPanel");
  
  let updateRunSummary = () => RunGenerator.generate();
  
  PartyMemberUI.init(partyMemberSettingsContainer, partyMemberSettingsPanel, updateRunSummary);
  Renderer.init(resultsEl);
  
  // Initialize UI
  PartyMemberUI.populate();
  
  // Check initial mode
  const initialMode = Utils.getSelectedRadio("specialMode");
  if (initialMode === "fjf" && partyMemberSettingsPanel) {
    partyMemberSettingsPanel.style.display = "none";
  }
  
  // Party size change handler
  const partySizeSelect = document.getElementById("partySize");
  partySizeSelect.addEventListener("change", () => {
    PartyMemberUI.populate();
    updateRunSummary();
  });
  
  // Special mode change handler
  const specialModeRadios = document.querySelectorAll('input[name="specialMode"]');
  specialModeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "cavalry") {
        partySizeSelect.value = "4";
        partySizeSelect.disabled = true;
        PartyMemberUI.populate();
        if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "";
      } else if (radio.value === "fjf") {
        partySizeSelect.value = "5";
        partySizeSelect.disabled = true;
        PartyMemberUI.populate();
        if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "none";
        // Hide Secondary Jobs and Unique Characters settings
        const allowSecondarySetting = document.getElementById("allowSecondarySetting");
        const uniqueCharactersSetting = document.getElementById("uniqueCharactersSetting");
        if (allowSecondarySetting) allowSecondarySetting.style.display = "none";
        if (uniqueCharactersSetting) uniqueCharactersSetting.style.display = "none";
        // Update dropdowns to exclude unique characters
        const currentPartySize = Utils.getPartySize();
        for (let i = 0; i < currentPartySize; i++) {
          PartyMemberUI.updateMemberDropdowns(i);
        }
      } else {
        partySizeSelect.disabled = false;
        if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "";
        // Show Secondary Jobs and Unique Characters settings
        const allowSecondarySetting = document.getElementById("allowSecondarySetting");
        const uniqueCharactersSetting = document.getElementById("uniqueCharactersSetting");
        if (allowSecondarySetting) allowSecondarySetting.style.display = "";
        if (uniqueCharactersSetting) uniqueCharactersSetting.style.display = "";
        const currentPartySize = Utils.getPartySize();
        for (let i = 0; i < currentPartySize; i++) {
          PartyMemberUI.updateMemberDropdowns(i);
          PartyMemberUI.updateSecondaryEnabledState(i);
        }
      }
      updateRunSummary();
    });
  });
  
  // Radio button change handlers
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", () => {
      updateRunSummary();
      if (radio.name === "allowSecondary") {
        const currentPartySize = Utils.getPartySize();
        for (let i = 0; i < currentPartySize; i++) {
          PartyMemberUI.updateSecondaryEnabledState(i);
        }
      } else if (radio.name === "uniqueCharacters") {
        // Update all dropdowns when unique characters setting changes
        const currentPartySize = Utils.getPartySize();
        for (let i = 0; i < currentPartySize; i++) {
          PartyMemberUI.updateMemberDropdowns(i);
        }
      }
    });
  });
  
  // Party member dropdown change listeners
  function addPartyMemberChangeListeners() {
    const partySize = Utils.getPartySize();
    for (let i = 0; i < partySize; i++) {
      const typeSelect = document.getElementById(`member${i}_type`);
      const jobSelect = document.getElementById(`member${i}_job`);
      const secondarySelect = document.getElementById(`member${i}_secondary`);
      
      [typeSelect, jobSelect, secondarySelect].forEach(select => {
        if (select) {
          select.removeEventListener("change", updateRunSummary);
          select.addEventListener("change", updateRunSummary);
        }
      });
    }
  }
  
  partySizeSelect.addEventListener("change", addPartyMemberChangeListeners);
  addPartyMemberChangeListeners();
  
  // Button handlers
  document.getElementById("btnRandomize").addEventListener("click", () => {
    Settings.randomize();
    RunGenerator.generate(true);
  });
  
  document.getElementById("btnReset").addEventListener("click", Settings.resetPartyMembers);
  
  // Initial randomization and render
  // Randomize challenge mode first on page load
  const challengeModeOptions = ["normal", "humansOnly", "monstrous", "fjf", "cavalry"];
  const randomChallengeMode = Utils.randomChoice(challengeModeOptions);
  const initialModeRadio = document.querySelector(`input[name="specialMode"][value="${randomChallengeMode}"]`);
  if (initialModeRadio) {
    initialModeRadio.checked = true;
    // Manually apply mode-specific settings before dispatching event
    if (randomChallengeMode === "cavalry") {
      partySizeSelect.value = "4";
      partySizeSelect.disabled = true;
      PartyMemberUI.populate();
      if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "";
    } else if (randomChallengeMode === "fjf") {
      partySizeSelect.value = "5";
      partySizeSelect.disabled = true;
      PartyMemberUI.populate();
      if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "none";
      // Hide Secondary Jobs and Unique Characters settings
      const allowSecondarySetting = document.getElementById("allowSecondarySetting");
      const uniqueCharactersSetting = document.getElementById("uniqueCharactersSetting");
      if (allowSecondarySetting) allowSecondarySetting.style.display = "none";
      if (uniqueCharactersSetting) uniqueCharactersSetting.style.display = "none";
    } else {
      partySizeSelect.disabled = false;
      if (partyMemberSettingsPanel) partyMemberSettingsPanel.style.display = "";
      // Ensure dropdowns are populated for other modes
      const currentPartySize = Utils.getPartySize();
      for (let i = 0; i < currentPartySize; i++) {
        PartyMemberUI.updateMemberDropdowns(i);
        PartyMemberUI.updateSecondaryEnabledState(i);
      }
    }
    // Dispatch event to trigger any other handlers
    initialModeRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  // Randomize settings, but skip party size if mode requires a specific size
  const skipPartySize = randomChallengeMode === "cavalry" || randomChallengeMode === "fjf";
  Settings.randomize(skipPartySize);
  updateRunSummary();
});
