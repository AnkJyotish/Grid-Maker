// Numerology Destiny Calculator - Vedic Grid + Destiny/Basic + Dasha/Antardasha
// Theme: Shadow Green & Mint Green (matches styles.css)

class NumerologyCalculator {
  constructor() {
    this.form = document.getElementById('numerologyForm');
    this.inputSection = document.querySelector('.input-section');
    this.resultsSection = document.getElementById('resultsSection');
    this.gridSection = document.getElementById('gridSection');
    this.navigationSection = document.getElementById('navigationSection');

    // Vedic mapping (number -> grid cell index)
    // Grid cells are row-major: cell1..cell9
    // Layout:
    // Row1: [3, 1, 6]
    // Row2: [9, 7, 5]
    // Row3: [2, 8, 4]
    this.vedicMap = { 1: 2, 2: 7, 3: 1, 4: 9, 5: 6, 6: 4, 7: 5, 8: 8, 9: 3 };

    this.dashaNames = {
      1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury',
      6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
    };
    this.dashaDescriptions = {
      1: 'Leadership, authority, and self-confidence.',
      2: 'Emotions, intuition, and nurturing.',
      3: 'Wisdom, expansion, and good fortune.',
      4: 'Unexpected events and transformation.',
      5: 'Communication, intellect, and business.',
      6: 'Love, beauty, and luxury.',
      7: 'Spirituality and detachment.',
      8: 'Discipline, hard work, and karma.',
      9: 'Energy, courage, and action.'
    };

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Button ripple effect
    const btn = document.getElementById('calculateBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Form submission event triggered");

    try {
      const fullNameInput = document.getElementById('fullName');
      const birthDateInput = document.getElementById('birthDate');

      if (!fullNameInput || !birthDateInput) {
        alert('Form inputs are missing. Please reload the page.');
        return;
      }

      const fullName = fullNameInput.value.trim();
      const birthDate = birthDateInput.value;
      const gender = document.querySelector('input[name="gender"]:checked')?.value;

      // Validate fullName: non-empty
      if (!fullName) {
        alert('Please enter your full name.');
        fullNameInput.focus();
        return;
      }

      // Validate birthDate: non-empty and valid date
      if (!birthDate) {
        alert('Please enter your birth date.');
        birthDateInput.focus();
        return;
      }

      // Validate gender: selected
      if (!gender) {
        alert('Please select your gender.');
        return;
      }
      const dateObj = new Date(birthDate);
      if (isNaN(dateObj.getTime())) {
        alert('Please enter a valid birth date.');
        birthDateInput.focus();
        return;
      }

      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      // Calculate numbers
      const basic = this.basicNumber(day);
      const destiny = this.destinyNumber(day, month, year);

      console.log(`Basic Number: ${basic}, Destiny Number: ${destiny}`);

      // Store user data in sessionStorage for chart access (session only)
      const userData = {
        fullName: fullName,
        birthDate: birthDate,
        gender: gender,
        basicNumber: basic,
        destinyNumber: destiny,
        day: day,
        month: month,
        year: year
      };
      sessionStorage.setItem('numerologyData', JSON.stringify(userData));

      // Update number cards
      this.updateNumberCards(basic, destiny);
      console.log("Updated number cards");

      // Calculate Dasha & Antardasha first
      this.calculateAndRenderDasha(basic, dateObj);
      console.log("Calculated and rendered Dasha");

      // Render Vedic grid with dasha numbers
      this.renderVedicGrid({ day, month, year, basic, destiny });
      console.log("Rendered Vedic grid");

      // Update detailed analysis
      this.updateDetailedAnalysis(basic, destiny);
      console.log("Updated detailed analysis");

      // Show user info panel and populate with user data
      const userInfoSection = document.getElementById('userInfoSection');
      if (userInfoSection) {
        userInfoSection.style.display = 'block';
        document.getElementById('displayName').textContent = fullName;
        document.getElementById('displayDOB').textContent = this.formatDate(dateObj);
        document.getElementById('displayGender').textContent = gender;
      }

      // Hide input section and show results
      if (this.inputSection) this.inputSection.style.display = 'none';
      if (this.gridSection) this.gridSection.style.display = 'block';
      if (this.resultsSection) this.resultsSection.style.display = 'block';
      if (this.navigationSection) this.navigationSection.style.display = 'block';
      this.gridSection.scrollIntoView({ behavior: 'smooth' });
      console.log("Updated UI visibility");

      // Add back button to header
      this.addBackButton();
      console.log("Added back button");

      // Show bottom navigation bar
      showBottomNavigation();
      console.log("Showed bottom navigation");
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An error occurred while calculating. Please check your inputs.");
    }
  }

  // --- Numerology helpers ---

  // Digital root 1..9 (0 becomes 9)
  digitalRoot(n) {
    n = Math.abs(Number(n) || 0);
    const r = n % 9;
    return r === 0 ? 9 : r;
  }

  // Basic Number = digital root of day
  basicNumber(day) {
    return this.digitalRoot(day);
  }

  // Destiny Number = digital root of (sum of all digits in DD/MM/YYYY)
  destinyNumber(day, month, year) {
    const sumDigits = (num) => num.toString().split('').reduce((a, d) => a + Number(d), 0);
    const total = sumDigits(day) + sumDigits(month) + sumDigits(year);
    return this.digitalRoot(total);
  }

  // --- Grid rendering ---

  renderVedicGrid({ day, month, year, basic, destiny }) {
    // Clear cells
    for (let i = 1; i <= 9; i++) {
      const el = document.getElementById(`cell${i}`);
      if (el) {
        el.innerHTML = ''; // Clear existing content
        el.classList.remove('digit-chip'); // Remove any existing classes
      }
    }

    // Exclude year's century number, only use last two digits
    const yearStr = year.toString();
    const yearLastTwo = yearStr.slice(-2);

    const digits = [
      ...day.toString().split(''),
      ...month.toString().split(''),
      ...yearLastTwo.split('')
    ].map(Number).filter(n => n >= 1 && n <= 9);

    const counts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
    digits.forEach(n => counts[n]++);

    // Add Destiny as extra occurrence
    counts[destiny] = (counts[destiny] || 0) + 1;

    // Add Basic number only if date is NOT 1-9, 10, 20, or 30
    const specialDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30];
    if (!specialDates.includes(day)) {
      counts[basic] = (counts[basic] || 0) + 1;
    }

    // Render digits in grid
    for (let n = 1; n <= 9; n++) {
      const cellIndex = this.vedicMap[n];
      const cell = document.getElementById(`cell${cellIndex}`);
      const repeats = counts[n] || 0;

      for (let i = 0; i < repeats; i++) {
        const chip = document.createElement('span');
        chip.className = 'digit-chip';
        chip.style.fontSize = '20px';
        chip.textContent = n.toString();
        cell.appendChild(chip);
      }
    }

    // Add Mahadasha number to its cell
    if (this._currentDasha) {
      const mahaCellIndex = this.vedicMap[this._currentDasha];
      const mahaCell = document.getElementById(`cell${mahaCellIndex}`);
      if (mahaCell) {
        const mahaChip = document.createElement('span');
        mahaChip.className = 'digit-chip mahadasha-number';
        mahaChip.style.fontSize = '20px';
        mahaChip.style.color = '#ff0000ff';
        mahaChip.textContent = this._currentDasha.toString();
        mahaCell.appendChild(mahaChip);
      }
    }

    // Add Antardasha number to its cell
    if (this._currentAntardasha) {
      const antaCellIndex = this.vedicMap[this._currentAntardasha];
      const antaCell = document.getElementById(`cell${antaCellIndex}`);
      if (antaCell) {
        const antaChip = document.createElement('span');
        antaChip.className = 'digit-chip antardasha-number';
        antaChip.style.fontSize = '20.3px';
        antaChip.style.color = '#ff03dd';
        antaChip.textContent = this._currentAntardasha.toString();
        antaCell.appendChild(antaChip);
      }
    }
  }

  // --- Dasha / Antardasha ---

  calculateAndRenderDasha(basic, birthDateObj) {
    const today = new Date();
    
    // Planetary periods in years
    const planetaryPeriods = {
      1: 1,  // Sun - 1 year
      2: 2,  // Moon - 2 years
      3: 3,  // Jupiter - 3 years
      4: 4,  // Rahu - 4 years
      5: 5,  // Mercury - 5 years
      6: 6,  // Venus - 6 years
      7: 7,  // Ketu - 7 years
      8: 8,  // Saturn - 8 years
      9: 9   // Mars - 9 years
    };

    // Calculate total years since birth
    const years = this.diffInYears(birthDateObj, today);
    
    // Calculate current mahadasha based on planetary sequence
    let currentYear = 0;
    let currentDasha = basic;
    let dashaStartYear = 0;
    
    // Find which dasha we're currently in
    while (currentYear <= years) {
      const period = planetaryPeriods[currentDasha];
      if (currentYear + period > years) {
        dashaStartYear = currentYear;
        break;
      }
      currentYear += period;
      currentDasha = (currentDasha % 9) + 1;
    }

    // Calculate antardasha using the specified formula
    const getDayNumber = (date) => {
      const dayMap = {
        0: 1,  // Sunday
        1: 2,  // Monday
        2: 9,  // Tuesday
        3: 5,  // Wednesday
        4: 3,  // Thursday
        5: 6,  // Friday
        6: 8   // Saturday
      };
      return dayMap[date.getDay()];
    };

    const calculateAntardasha = (birthDate, targetYear) => {
      const [day, month, year] = [
        birthDate.getDate(),
        birthDate.getMonth() + 1,
        birthDate.getFullYear()
      ];
      
      // Get last two digits of the target year
      const lastTwoDigits = targetYear % 100;
      
      // Get birthday date in target year
      const targetBirthday = new Date(targetYear, birthDate.getMonth(), birthDate.getDate());
      const dayNumber = getDayNumber(targetBirthday);
      
      // Formula: (date + month) + last two digits of target year + day number
      const sum = (day + month) + lastTwoDigits + dayNumber;
      return this.digitalRoot(sum);
    };

    const lastBirthday = new Date(birthDateObj.getFullYear() + this.diffInYears(birthDateObj, today), 
                                   birthDateObj.getMonth(), 
                                   birthDateObj.getDate());
    const currentAntardasha = calculateAntardasha(birthDateObj, lastBirthday.getFullYear());

    // Calculate dasha dates
    const dashaStart = new Date(birthDateObj.getFullYear() + dashaStartYear, 
                               birthDateObj.getMonth(), 
                               birthDateObj.getDate());
    const dashaEnd = new Date(dashaStart.getFullYear() + planetaryPeriods[currentDasha], 
                             dashaStart.getMonth(), 
                             dashaStart.getDate());

    // Calculate progress within current dasha
    const progress = Math.min(
      Math.max((today - dashaStart) / (dashaEnd - dashaStart), 0),
      1
    );

    // Render dasha information
    document.getElementById('currentDasha').textContent =
      `${currentDasha} - ${this.dashaNames[currentDasha]} (${planetaryPeriods[currentDasha]} years)`;
    document.getElementById('dashaDescription').textContent =
      this.dashaDescriptions[currentDasha];

    const startStr = this.formatDate(dashaStart);
    const endStr = this.formatDate(dashaEnd);
    document.getElementById('dashaStart').textContent = startStr;
    document.getElementById('dashaEnd').textContent = endStr;

    const bar = document.getElementById('dashaProgress');
    if (bar) bar.style.width = `${Math.round(progress * 100)}%`;

    document.getElementById('currentAntardasha').textContent =
      `${currentAntardasha} - ${this.dashaNames[currentAntardasha]}`;
    document.getElementById('antardashaDescription').textContent =
      this.dashaDescriptions[currentAntardasha];

    this._currentDasha = currentDasha;
    this._currentAntardasha = currentAntardasha;
  }

  diffInYears(start, end) {
    let years = end.getFullYear() - start.getFullYear();
    const m = end.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) years--;
    return years;
  }

  formatDate(d) {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // --- Cards & Analysis ---

  updateNumberCards(basic, destiny) {
    this.animateNumber('basicNumber', 0, basic, 800);
    this.animateNumber('destinyNumber', 0, destiny, 800);

    document.getElementById('basicDescription').textContent = this.getBasicDescription(basic);
    document.getElementById('destinyDescription').textContent = this.getDestinyDescription(destiny);
  }

  updateDetailedAnalysis(basic, destiny) {
    const lifePath = (basic === destiny)
      ? `Your destiny number ${destiny} aligns closely with your basic number ${basic}, indicating harmony between your core nature and life direction.`
      : `Your destiny number ${destiny} contrasts with your basic number ${basic}, suggesting growth through balancing core tendencies with life lessons.`;

    const rec = this.getRecommendationsForDasha(this._currentDasha);

    document.getElementById('lifePathInsights').textContent = lifePath;
    document.getElementById('recommendations').textContent = rec;

    // Update Destiny Number Influence panel
    document.getElementById('destinyNumberInfluence').textContent = destiny;
    this.updateDestinyFeatures(destiny);

    // Update new panels
    this.updateLuckyNumber(destiny);
    this.updateLuckyColor(destiny);
    this.updateZodiacSign(destiny);
    this.updateLuckyDirection(destiny);

    // Update Supportive Numbers panel with digits of the date of DOB separated by comma
    const userDataStr = sessionStorage.getItem('numerologyData');
    let supportiveNumbers = 'N/A';
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.birthDate) {
          // Extract day from birthDate (format: YYYY-MM-DD)
          const parts = userData.birthDate.split('-');
          if (parts.length === 3) {
            const day = parts[2];
            if (day && !isNaN(day)) {
              const digits = day.toString().split('').filter(d => d !== '0');
              const uniqueDigits = [...new Set(digits)];
              supportiveNumbers = uniqueDigits.join(',');
            }
          }
        }
      } catch (e) {
        console.error('Error parsing numerologyData for supportive numbers:', e);
      }
    }
    document.getElementById('supportiveNumbers').textContent = supportiveNumbers;
  }

  updateDestinyFeatures(destiny) {
    const featuresMap = {
      1: [
        'Confident',
        'Great Leadership Quality',
        'Very Good Management',
        'Authoritative',
        'Dominating',
        'Name & Fame',
        'Egoistic',
        'Short-Tempered',
        'Stubborn',
        'Always Motivated & Motivating Others',
        'Business Number'
      ],
      2: [
        'Sentimental',
        'Need Continuous Push',
        'Traditional Fashion',
        'Image Conscious',
        'Attractive',
        'Creative',
        'Emotional',
        'Possessive',
        "Can't deal with stress",
        'Needs Sharing',
        'Motherly Instinct',
        'Suicidal Tendencies'
      ],
      3: [
        'Wisdom',
        'Leader',
        'Need Motivation',
        'Confidence',
        'Disciplined',
        'Attaches to Family',
        'High Moral Value',
        'Spiritual People',
        'Excellent Management Skills',
        'Decision With Consent',
        'No to Temptation/Addiction',
        'Justice Lover',
        'Basic: Attached to Family',
        'Destiny: Attached to Current Family'
      ],
      4: [
        'Travels Lot',
        'Unfruitful Travelling',
        'Spends lot of money on Unnecessary things',
        'Expensive',
        'Spending Thrift',
        'Execution is Bad by Default',
        "Can't keep Promises, though intents rightly",
        'Love to Explore Party Lovers',
        'Researchers',
        'Risk Takers',
        'Stays away from Birth Place',
        'Destiny: Electronic Items frequent breakdown'
      ],
      5: [
        'Money Matters: Very',
        'Calculative',
        'Straight Forward',
        'Logical People',
        'Well aware source of Income',
        'Knows where to incur expenses',
        'Finance Mgmt: None can Compete',
        'Mind: always Active in Money Calculations',
        'Born Business Man/Woman'
      ],
      6: [
        'Attractive/Attractive Aura',
        'Attraction Towards Opposite Gender',
        'Harsh Speakers',
        'Fashionable',
        'Brand Cautious/Updated Fashion',
        'Food Lover /Good Cook',
        'Impressed by Show Off & Luxury',
        'Trend Setters',
        'Focus on Love, Materialistic World & Outer Beauty'
      ],
      7: [
        'Useful Travels',
        'Positivity & Luck in Life',
        'Work Easily Done',
        'Spiritual',
        'Logical',
        'Demands & Gives Explanation with Logic',
        'Stability',
        'Deep Thinkers'
      ],
      8: [
        'Hard Work in each every Field of Life',
        'Easily Gets Disappointment',
        'Spiritual & God Believer',
        'Soft Hearted',
        'Justice Believer & Lover',
        "Can't see one crying",
        'Egoistic',
        'Ambitious',
        "Workaholic: Can't sit idle Else Depressed"
      ],
      9: [
        'Courageous',
        'Stubborn',
        'Confident',
        'Sensible',
        'Bold',
        'Active',
        'Very Fast Action',
        'Easily Pumpable',
        'Argument Attire'
      ]
    };

    const featuresList = document.getElementById('destinyFeatures');
    featuresList.innerHTML = '';
    
    const features = featuresMap[destiny] || [];
    features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
  }

  getDestinyDescription(n) {
    const map = {
      1:'You are a natural leader with strong individuality and pioneering spirit.',
      2:'You possess diplomatic skills and work well in partnerships.',
      3:'You are creative, expressive, and blessed with good fortune.',
      4:'You are practical, systematic, and build solid foundations.',
      5:'You crave freedom, adventure, and embrace change.',
      6:'You are nurturing, responsible, and value harmony.',
      7:'You are analytical, spiritual, and seek deeper truths.',
      8:'You are ambitious, business-minded, and achieve material success.',
      9:'You are humanitarian, compassionate, and serve others.'
    };
    return map[n] || '';
  }

  getBasicDescription(n) {
    const map = {
      1:'Independent, original, and innovative.',
      2:'Cooperative, sensitive, and diplomatic.',
      3:'Optimistic, creative, and expressive.',
      4:'Practical, reliable, and hardworking.',
      5:'Adaptable, versatile, and freedom-loving.',
      6:'Responsible, caring, and artistic.',
      7:'Analytical, thoughtful, and spiritual.',
      8:'Ambitious, authoritative, and successful.',
      9:'Compassionate, generous, and idealistic.'
    };
    return map[n] || '';
  }

  getRecommendationsForDasha(dasha) {
    const rec = {
      1:'Take leadership roles and start new ventures.',
      2:'Focus on relationships and emotional well-being.',
      3:'Pursue creative projects and educational opportunities.',
      4:'Build stable foundations and be prepared for changes.',
      5:'Embrace flexibility and explore new experiences.',
      6:'Focus on family, home, and creative pursuits.',
      7:'Engage in spiritual practices and introspection.',
      8:'Work hard towards career and financial goals.',
      9:'Serve others and engage in humanitarian activities.'
    };
    return rec[dasha] || '';
  }

  // --- New Panel Methods ---

  updateLuckyNumber(destiny) {
    // New lucky number mapping based on destiny number
    const luckyNumberMap = {
      1: '1, 3',
      2: '1, 3', 
      3: '1, 3',
      4: '6, 5',
      5: '6, 5',
      6: '6, 5',
      7: '7, 9',
      8: '8, 7',
      9: '7, 9'
    };
    
    const luckyNumbers = luckyNumberMap[destiny] || '1';
    document.getElementById('luckyNumber').textContent = luckyNumbers;
    document.getElementById('luckyNumberDescription').textContent = 
      `Your lucky numbers ${luckyNumbers} bring harmony and positive vibrations.`;
  }

  updateLuckyColor(destiny) {
    const colorMap = {
      1: { name: 'Golden, Orange', hex: '#FFD700' }, // Golden as primary
      2: { name: 'Milky White, Cream', hex: '#FFFDD0' }, // Cream as primary
      3: { name: 'Yellow, Orange', hex: '#FFA500' }, // Orange as primary
      4: { name: 'Blue, Black', hex: '#0000FF' }, // Blue as primary
      5: { name: 'Green', hex: '#008000' },
      6: { name: 'White, Metallic Colour', hex: '#FFFFFF' }, // White as primary
      7: { name: 'Sandal Grey, Red', hex: '#8B4513' }, // Sandal Grey as primary
      8: { name: 'Blue, Black', hex: '#0000FF' }, // Blue as primary
      9: { name: 'Red', hex: '#FF0000' }
    };

    const color = colorMap[destiny] || { name: 'Unknown', hex: '#CCCCCC' };
    const colorDisplay = document.getElementById('luckyColor');
    const colorName = document.getElementById('luckyColorName');

    colorDisplay.style.backgroundColor = color.hex;
    colorName.textContent = color.name;
    document.getElementById('luckyColorDescription').textContent =
      `${color.name} enhances your numerological vibrations and brings prosperity.`;
  }

  updateZodiacSign(destiny) {
    const planetMap = {
      1: 'Sun',
      2: 'Moon',
      3: 'Jupiter',
      4: 'Rahu',
      5: 'Mercury',
      6: 'Venus',
      7: 'Ketu',
      8: 'Saturn',
      9: 'Mars'
    };

    // Handle undefined destiny number
    if (!destiny || destiny < 1 || destiny > 9) {
      document.getElementById('zodiacSign').textContent = 'Loading...';
      document.getElementById('zodiacDescription').textContent = 'Calculating...';
      return;
    }

    const planet = planetMap[destiny];
    document.getElementById('zodiacSign').textContent = planet;
    document.getElementById('zodiacDescription').textContent =
      `${planet} is the ruling planet for destiny number ${destiny}, influencing your core characteristics and life path.`;
  }

  updateLuckyDirection(destiny) {
    const directionMap = {
      1: 'East',
      2: 'North East',
      3: 'North East',
      4: 'South East',
      5: 'North',
      6: 'South East',
      7: 'South West',
      8: 'West',
      9: 'South'
    };

    const direction = directionMap[destiny] || 'East';
    document.getElementById('luckyDirection').textContent = direction;
    document.getElementById('luckyDirectionDescription').textContent =
      `Face ${direction} direction for success and positive energy flow.`;
  }

  // --- Animations ---

  animateNumber(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();
    const step = (t) => {
      const p = Math.min((t - startTime) / duration, 1);
      const val = Math.floor(start + (end - start) * p);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // --- Navigation ---

  addBackButton() {
    // Remove existing back button if any
    const existingBackBtn = document.getElementById('backButton');
    if (existingBackBtn) {
      existingBackBtn.remove();
    }

    // Create back button
    const backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.innerHTML = '◀';
    backButton.className = 'back-button show'; // Add 'show' class to make it visible

    // Fix: Use addEventListener instead of onclick property for better reliability
    backButton.addEventListener('click', () => this.goBackToInput());

    // Add to header
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(backButton);
    }
  }

  goBackToInput() {
    // Hide results sections
    if (this.gridSection) this.gridSection.style.display = 'none';
    if (this.resultsSection) this.resultsSection.style.display = 'none';
    if (this.navigationSection) this.navigationSection.style.display = 'none';

    // Hide user info panel
    const userInfoSection = document.getElementById('userInfoSection');
    if (userInfoSection) {
      userInfoSection.style.display = 'none';
    }

    // Show input section
    if (this.inputSection) this.inputSection.style.display = 'block';

    // Remove back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
      backButton.remove();
    }

    // Hide bottom navigation
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      bottomNav.style.display = 'none';
    }

    // Load saved data into form fields
    const savedData = sessionStorage.getItem('numerologyData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const fullNameInput = document.getElementById('fullName');
        const birthDateInput = document.getElementById('birthDate');
        if (fullNameInput) fullNameInput.value = data.fullName || '';
        if (birthDateInput) birthDateInput.value = data.birthDate || '';
        if (data.gender) {
          const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
          if (genderRadio) genderRadio.checked = true;
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    // Clear localStorage flag
    localStorage.removeItem('showNavigation');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus on the first input field (fullName) to ensure user can start typing immediately
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
      setTimeout(() => fullNameInput.focus(), 100);
    }
  }
}

// Navigation Functions
function loadSavedData() {
  const savedData = sessionStorage.getItem('numerologyData');
  if (savedData) {
    const data = JSON.parse(savedData);
    document.getElementById('fullName').value = data.fullName || '';
    document.getElementById('birthDate').value = data.birthDate || '';
    if (data.gender) {
      const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
      if (genderRadio) genderRadio.checked = true;
    }

    // If we have saved data, automatically restore the calculation results
    if (data.basicNumber && data.destinyNumber) {
      restoreCalculationResults(data);
    }
  }
}

function restoreCalculationResults(data) {
  try {
    const calculator = new NumerologyCalculator();

    // Update number cards
    calculator.updateNumberCards(data.basicNumber, data.destinyNumber);

    // Calculate and render Dasha & Antardasha
    const birthDateObj = new Date(data.year, data.month - 1, data.day);
    calculator.calculateAndRenderDasha(data.basicNumber, birthDateObj);

    // Render Vedic grid
    calculator.renderVedicGrid({
      day: data.day,
      month: data.month,
      year: data.year,
      basic: data.basicNumber,
      destiny: data.destinyNumber
    });

    // Update detailed analysis
    calculator.updateDetailedAnalysis(data.basicNumber, data.destinyNumber);

    // Show and populate user info panel
    const userInfoSection = document.getElementById('userInfoSection');
    if (userInfoSection) {
      userInfoSection.style.display = 'block';
      document.getElementById('displayName').textContent = data.fullName;
      document.getElementById('displayDOB').textContent = calculator.formatDate(birthDateObj);
      document.getElementById('displayGender').textContent = data.gender;
    }

    // Hide input section and show results
    const inputSection = document.querySelector('.input-section');
    const gridSection = document.getElementById('gridSection');
    const resultsSection = document.getElementById('resultsSection');
    const navigationSection = document.getElementById('navigationSection');

    if (inputSection) inputSection.style.display = 'none';
    if (gridSection) gridSection.style.display = 'block';
    if (resultsSection) resultsSection.style.display = 'block';
    if (navigationSection) navigationSection.style.display = 'block';

    // Add back button to header
    calculator.addBackButton();

    // Show bottom navigation bar
    showBottomNavigation();

    console.log('Calculation results restored successfully');
  } catch (error) {
    console.error('Error restoring calculation results:', error);
  }
}

function showNavigation() {
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) bottomNav.style.display = 'flex';
}

function calculateNameNumbers() {
  const nameInput = document.getElementById('nameInput').value.trim();
  if (!nameInput) {
    alert('Please enter your name');
    return;
  }

  const names = nameInput.split(' ');
  const firstName = names[0];
  const fullName = nameInput.replace(/\s+/g, '');

  // Simple numerology calculation for demonstration
  const firstNameNumber = calculateNameValue(firstName);
  const fullNameNumber = calculateNameValue(fullName);

  const results = document.getElementById('nameResults');
  document.getElementById('firstNameLabel').textContent = `${firstName}:`;
  document.getElementById('firstNameResult').textContent = firstNameNumber;
  document.getElementById('fullNameLabel').textContent = 'Full Name:';
  document.getElementById('fullNameResult').textContent = fullNameNumber;
  results.style.display = 'block';
}

function calculateNameValue(name) {
  const letterValues = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };

  let total = 0;
  for (let char of name.toLowerCase()) {
    if (letterValues[char]) {
      total += letterValues[char];
    }
  }

  // Reduce to single digit
  while (total > 9) {
    total = Math.floor(total / 10) + (total % 10);
  }
  return total;
}

function calculateMobileNumerology() {
  const mobileNumber = document.getElementById('mobileNumber').value.trim();
  const errorMessage = document.getElementById('mobileErrorMessage');
  const resultsPanel = document.getElementById('mobileResultsPanel');

  if (!/^\d{10}$/.test(mobileNumber)) {
    errorMessage.style.display = 'block';
    resultsPanel.style.display = 'none';
    return;
  }

  errorMessage.style.display = 'none';

  // Simple mobile numerology calculation
  let sum = 0;
  for (let digit of mobileNumber) {
    sum += parseInt(digit);
  }

  // Reduce to single digit
  let destinyNumber = sum;
  while (destinyNumber > 9) {
    destinyNumber = Math.floor(destinyNumber / 10) + (destinyNumber % 10);
  }

  document.getElementById('mobileDestiny').textContent = destinyNumber;
  resultsPanel.style.display = 'block';

  // Generate simple grid for mobile numbers
  generateMobileGrid(mobileNumber);
}

function generateMobileGrid(mobileNumber) {
  const grid = document.getElementById('mobileGrid');
  grid.innerHTML = '';

  const digits = mobileNumber.split('').map(Number);
  const counts = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};

  digits.forEach(digit => {
    if (digit >= 1 && digit <= 9) {
      counts[digit]++;
    }
  });

  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-container';
  gridContainer.style.gridTemplateColumns = 'repeat(3, 60px)';
  gridContainer.style.gridTemplateRows = 'repeat(3, 60px)';

  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.style.fontSize = '16px';
    cell.style.padding = '5px';

    if (counts[i] > 0) {
      cell.textContent = `${i} (${counts[i]})`;
    } else {
      cell.textContent = i.toString();
      cell.style.opacity = '0.3';
    }

    gridContainer.appendChild(cell);
  }

  grid.appendChild(gridContainer);
}

function calculateMatch() {
  const nameA = document.getElementById('nameA').value.trim();
  const dobA = document.getElementById('dobA').value;
  const nameB = document.getElementById('nameB').value.trim();
  const dobB = document.getElementById('dobB').value;

  if (!nameA || !dobA || !nameB || !dobB) {
    alert('Please fill in all fields for both partners');
    return;
  }

  // Simple compatibility calculation
  const compatibility = Math.floor(Math.random() * 100) + 1; // Random for demo
  const results = document.getElementById('matchResults');
  const verdict = document.getElementById('compatibilityVerdict');

  verdict.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h4 style="color: var(--mint-green); margin-bottom: 10px;">Compatibility Score</h4>
      <div style="font-size: 3rem; font-weight: bold; color: var(--light-mint);">
        ${compatibility}%
      </div>
      <p style="margin-top: 10px;">
        ${getCompatibilityMessage(compatibility)}
      </p>
    </div>
  `;

  results.style.display = 'block';
}

function getCompatibilityMessage(score) {
  if (score >= 80) return 'Excellent compatibility! Strong foundation for a lasting relationship.';
  if (score >= 60) return 'Good compatibility with potential for growth and harmony.';
  if (score >= 40) return 'Moderate compatibility. Requires effort and understanding.';
  return 'Challenging compatibility. Needs significant work and compromise.';
}

// Show navigation after successful calculation
function showBottomNavigation() {
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) bottomNav.style.display = 'flex';

  // Store in localStorage that navigation should be shown
  localStorage.setItem('showNavigation', 'true');
}

// Check if navigation should be shown on page load
function checkNavigationState() {
  const shouldShowNav = localStorage.getItem('showNavigation') === 'true';
  if (shouldShowNav) {
    showBottomNavigation();
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new NumerologyCalculator();

  // Load saved data if available
  loadSavedData();

  // Check if navigation should be shown
  checkNavigationState();
});
