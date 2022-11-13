const atualizacao = document.getElementById('atualizacao');
const fecha = document.getElementById('fecha');
let newWorker;

fecha.addEventListener('click', () => atualizacao.classList.remove('ativo'));

document.getElementById('reload').addEventListener('click', () => {
  atualizacao.classList.remove('ativo');
  setTimeout(() => newWorker.postMessage({ action: 'skipWaiting'}), 200);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('sw.js registrado');
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing;

      newWorker.addEventListener('statechange', () => {
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              atualizacao.classList.add('ativo');
            }
            break;
        }
      });
    });
  }).catch((err) => console.log("sw não registrado", err));

  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}