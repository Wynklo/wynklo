export function initCareersToast() {
  const careersLinks = document.querySelectorAll('a');
  careersLinks.forEach(link => {
    if (link.textContent.trim().toLowerCase() === 'careers') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        let toast = document.getElementById('global-careers-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'global-careers-toast';
          toast.className = 'careers-toast';
          toast.innerHTML = '<p>Will be opening soon</p>';
          document.body.appendChild(toast);
        }
        
        toast.classList.remove('show');
        void toast.offsetWidth; // Force reflow
        toast.classList.add('show');
        
        if (toast.hideTimeout) clearTimeout(toast.hideTimeout);
        toast.hideTimeout = setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      });
    }
  });
}
