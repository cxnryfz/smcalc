document.addEventListener('DOMContentLoaded', () => {
  const SECRET_CODE_KEY = 'calculator-secret-code';
  let clearClickCount = 0;
  
  // Create floating squares for XenOS background
  function createSquares() {
    const container = document.querySelector('.xen-squares');
    for (let i = 0; i < 15; i++) {
      const square = document.createElement('div');
      square.className = 'xen-square';
      square.style.width = Math.random() * 100 + 50 + 'px';
      square.style.height = square.style.width;
      square.style.left = Math.random() * 100 + '%';
      square.style.top = Math.random() * 100 + '%';
      square.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(square);
    }
  }

  createSquares();
  
  // Check if it's first time
  const secretCode = localStorage.getItem(SECRET_CODE_KEY);
  if (!secretCode) {
    document.getElementById('first-time-setup').classList.remove('hidden');
  } else {
    document.getElementById('calculator').classList.remove('hidden');
  }

  // Setup handlers
  document.getElementById('done-btn').addEventListener('click', () => {
    const code = document.getElementById('secret-code-setup').value;
    if (code) {
      localStorage.setItem(SECRET_CODE_KEY, code);
      document.getElementById('first-time-setup').classList.add('hidden');
      document.getElementById('calculator').classList.remove('hidden');
    }
  });

  function bootToXenOS() {
    document.getElementById('calculator').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('xen-os').classList.remove('hidden');
      updateClock();
      setInterval(updateClock, 1000);
    }, 4000);
  }

  // Calculator functionality
  const display = document.getElementById('display');
  let currentExpression = '';

  // Calculator Mode Toggle
  const basicMode = document.getElementById('basic-mode');
  const scientificMode = document.getElementById('scientific-mode');
  const basicButtons = document.querySelector('.basic-buttons');
  const scientificButtons = document.querySelector('.scientific-buttons');

  basicMode.addEventListener('click', () => {
    basicMode.classList.add('mode-active');
    scientificMode.classList.remove('mode-active');
    basicButtons.classList.remove('hidden');
    scientificButtons.classList.add('hidden');
  });

  scientificMode.addEventListener('click', () => {
    scientificMode.classList.add('mode-active');
    basicMode.classList.remove('mode-active');
    scientificButtons.classList.remove('hidden');
    basicButtons.classList.add('hidden');
  });

  // Scientific Calculator Functions
  function sin(x) { return Math.sin(x * Math.PI / 180); }
  function cos(x) { return Math.cos(x * Math.PI / 180); }
  function tan(x) { return Math.tan(x * Math.PI / 180); }
  function log(x) { return Math.log10(x); }
  function ln(x) { return Math.log(x); }

  document.querySelectorAll('.basic-buttons .calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.textContent;
      
      if (value === 'C') {
        clearClickCount++;
        if (clearClickCount >= 4) {
          document.getElementById('calculator').classList.add('hidden');
          document.getElementById('first-time-setup').classList.remove('hidden');
          localStorage.removeItem(SECRET_CODE_KEY);
          clearClickCount = 0;
          return;
        }
        currentExpression = '';
        display.value = '';
      } else {
        clearClickCount = 0;
        
        if (value === '=') {
          try {
            if (currentExpression === localStorage.getItem(SECRET_CODE_KEY)) {
              bootToXenOS();
              currentExpression = '';
              display.value = '';
              return;
            }
            const result = safeEval(currentExpression.replace('×', '*').replace('÷', '/'));
            display.value = result;
            currentExpression = result.toString();
          } catch (e) {
            display.value = 'Error';
            currentExpression = '';
          }
        } else {
          if (display.value === 'Error') {
            currentExpression = '';
            display.value = '';
          }
          currentExpression += value;
          display.value = currentExpression;
        }

        if (currentExpression === localStorage.getItem(SECRET_CODE_KEY)) {
          bootToXenOS();
        }
      }
    });
  });

  // Add scientific button handlers
  document.querySelectorAll('.scientific-buttons .calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.textContent;
      
      switch(value) {
        case 'π':
          currentExpression += Math.PI;
          break;
        case 'e':
          currentExpression += Math.E;
          break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
          currentExpression += value + '(';
          break;
        default:
          currentExpression += value;
      }
      display.value = currentExpression;
    });
  });

  // Modified eval function to handle scientific operations
  function safeEval(expr) {
    expr = expr.replace(/π/g, Math.PI)
               .replace(/e/g, Math.E)
               .replace(/sin\(/g, 'Math.sin(')
               .replace(/cos\(/g, 'Math.cos(')
               .replace(/tan\(/g, 'Math.tan(')
               .replace(/log\(/g, 'Math.log10(')
               .replace(/ln\(/g, 'Math.log(')
               .replace(/√/g, 'Math.sqrt')
               .replace(/\^/g, '**');
    return eval(expr);
  }

  // XenOS functionality
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    document.querySelector('.time').textContent = timeString;
  }

  // Playground App
  const gameUrls = {
    'slope': 'https://www.gamenora.com/embed/slope',
    'slope-multi': 'https://www.gamenora.com/embed/slope-multiplayer'
  };

  document.querySelector('.playground-app').addEventListener('click', () => {
    document.getElementById('game-menu').classList.remove('hidden');
  });

  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const game = card.dataset.game;
      document.getElementById('game-menu').classList.add('hidden');
      openAppFrame(gameUrls[game]);
    });
  });

  // App Frame Management
  function openAppFrame(url) {
    const frame = document.createElement('div');
    frame.className = 'app-frame';
    frame.innerHTML = `
      <iframe src="${url}" frameborder="0"></iframe>
      <div class="bottom-hover-area"></div>
      <div class="bottom-app-bar">
        <button class="app-bar-btn close-app">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
          Close
        </button>
        <button class="app-bar-btn killswitch">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          Killswitch
        </button>
      </div>
    `;
    document.body.appendChild(frame);

    // Setup event listeners
    frame.querySelector('.close-app').addEventListener('click', () => {
      frame.remove();
      document.getElementById('game-menu').classList.add('hidden');
    });

    frame.querySelector('.killswitch').addEventListener('click', () => {
      frame.remove();
      document.getElementById('xen-os').classList.add('hidden');
      document.getElementById('calculator').classList.remove('hidden');
      currentExpression = '';
      display.value = '';
    });
  }

  // Update app click handlers
  document.querySelector('.lightswitch-app').addEventListener('click', () => {
    openAppFrame('https://cxnryfz.github.io/lightswitch-web/');
  });

  // Remove old frame-related code
  const oldFrame = document.getElementById('lightswitch-frame');
  if (oldFrame) {
    oldFrame.remove();
  }
});
