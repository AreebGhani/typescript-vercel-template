window.addEventListener('load', function () {
  const themeToggleBtn = document.createElement('button');
  themeToggleBtn.classList.add('theme-toggle-btn');
  document.body.appendChild(themeToggleBtn);

  // Create moon SVG (for light theme) and sun SVG (for dark theme)
  const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

  const iconContainer = document.createElement('span');
  iconContainer.classList.add('theme-icon');
  themeToggleBtn.appendChild(iconContainer);

  // Set initial theme based on localStorage
  const currentTheme = localStorage.getItem('theme') || 'light';
  loadTheme(currentTheme);

  themeToggleBtn.addEventListener('click', function () {
    const isDark = document.body.classList.contains('swagger-ui-dark');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme); // Store the theme choice
    loadTheme(newTheme);
  });

  function loadTheme(theme) {
    // Remove existing theme stylesheets
    const existingLink = document.querySelector(
      'link[rel="stylesheet"][data-theme="light"], link[rel="stylesheet"][data-theme="dark"]'
    );
    if (existingLink) {
      existingLink.remove();
    }

    // Create a new link element for the selected theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/css/${theme}.css`; // Use light.css or dark.css
    link.setAttribute('data-theme', theme);
    document.head.appendChild(link);

    // Update body class for theme-specific styles
    document.body.classList.toggle('swagger-ui-light', theme === 'light');
    document.body.classList.toggle('swagger-ui-dark', theme === 'dark');

    // Change the icon based on the theme
    if (theme === 'light') {
      iconContainer.innerHTML = moonIcon; // Set moon icon for light theme
    } else {
      iconContainer.innerHTML = sunIcon; // Set sun icon for dark theme
    }
  }
});
