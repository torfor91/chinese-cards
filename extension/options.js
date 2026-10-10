const input = document.getElementById('url');
const saved = document.getElementById('saved');

chrome.storage.sync.get('appUrl').then(({ appUrl }) => { input.value = appUrl ?? ''; });

document.getElementById('save').addEventListener('click', async () => {
  await chrome.storage.sync.set({ appUrl: input.value.trim() });
  saved.textContent = 'Сохранено ✓';
  setTimeout(() => { saved.textContent = ''; }, 1500);
});
