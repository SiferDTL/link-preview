const ref = {
  textArea: document.querySelector('.text-area'),
  wrapperLink: document.querySelector('.link-list'),
  typer: document.querySelector('.typer'),
  button: document.querySelector('.button-modal'),
  backdrop: document.querySelector('.backdrop'),
  form: document.querySelector('.form'),
  cross_icon: document.querySelector('.icon-cross'),
};

if (ref.button) {
  ref.button.addEventListener('click', async e => {
    ref.backdrop.classList.remove('backdrop--is-hidden');
  });
}
if (ref.form) {
  ref.form.addEventListener('submit', async e => {
    e.preventDefault();
  });
}

if (ref.backdrop) {
  ref.backdrop.addEventListener('click', async e => {
    if (e.target.tagName === 'svg') return;
    if (
      e.target.className?.includes('backdrop') ||
      e.target.className?.includes('close-btn')
    )
      ref.backdrop.classList.add('backdrop--is-hidden');
  });
}

if (ref.cross_icon) {
  ref.cross_icon.addEventListener('click', async e => {
    if (e.target.tagName !== 'svg') return;
    if (e.target.classList[0] === 'icon-cross')
      ref.backdrop.classList.add('backdrop--is-hidden');
  });
}

if (ref.textArea) {
  ref.textArea.addEventListener('input', async e => {
    let links = [];

    if (e.target.value.length > 0) {
      links = extractLinksFromText(e.target.value);
    }

    if (links.length > 0) {
      ref.typer.classList.remove('typer--hide');
      const result = await getPrevLinks(links);
      if (result?.previewData.length > 0) {
        appendHtml(result?.previewData, links);
      }
    } else {
      ref.wrapperLink.innerHTML = '';
    }
  });
}

function extractLinksFromText(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const matches = text.match(urlRegex);

  return matches || [];
}

async function getPrevLinks(urls) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/prev-link/preview?urls=${JSON.stringify(
        urls,
      )}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching link previews:', error.message);
    throw new Error('Error fetching link previews');
  }
}

function appendHtml(data, links) {
  const result = data.map(({ description, imageUrl, title }, idx) => {
    const host = links[idx].split('/');
    return `
            <li>
            <a href="/redirect?redirectLink=${links[idx]}" target="_blank">
              <img src='http://localhost:8080/api/prev-link/image-proxy?url=${imageUrl}' alt='${title}' />
              <div class='wrapper-card'>
                <h2>${title}</h2>
                <p class='description'>${description}</p>
                <p class='info'>
                  <span>${host[2]}</span>
                  <span>.</span>
                  <span>Для перегляду знадобиться 1 хв</spanх>
                </p>
                
              </div>
             
            </a>
          </li>
    `;
  });
  ref.wrapperLink.innerHTML = result.join('');
  ref.typer.classList.add('typer--hide');
}
