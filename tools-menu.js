(function () {
  function closeAll(except) {
    document.querySelectorAll('.tools-menu.open').forEach((menu) => {
      if (menu === except) return;
      menu.classList.remove('open');
      const toggle = menu.querySelector('.tools-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.tools-toggle');
    if (toggle) {
      event.preventDefault();
      const menu = toggle.closest('.tools-menu');
      const willOpen = !menu.classList.contains('open');
      closeAll(menu);
      menu.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      return;
    }

    if (!event.target.closest('.tools-menu')) closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
})();
