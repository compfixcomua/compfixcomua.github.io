(() => {
  'use strict';

  const english = {
    skip: 'Skip to content',
    brandLabel: 'Stand with Ukraine — back to top',
    navLabel: 'Main navigation',
    navWhy: 'Why it matters',
    navHelp: 'How to help <span aria-hidden="true">↗</span>',
    heroEyebrow: 'Free people. A free country.',
    heroLine1: 'FREEDOM',
    heroLine2: 'IS IN OUR',
    heroLine3: 'NATURE.',
    heroDescription: 'Unbreakable. Unstoppable. Deeply rooted.<br> Help Ukraine stand strong and bloom again.',
    heroCta: 'Stand with Ukraine',
    artNote: 'Strong roots.<br> A free future.',
    scroll: 'Together, until victory',
    whyKicker: '01 / What we stand for',
    whyTitle: 'The right to live.<br> To love. <span class="blue-text">To be ourselves.</span>',
    whyText1: 'Ukraine is its people. Those who plant flowers by their homes. Teach children. Create something new. And those who defend all of this against Russian aggression.',
    whyText2: 'We are fighting for simple things: our homes, our language, our tomorrow. Everyone who stands with us helps make that tomorrow possible.',
    whySignoff: 'Freedom grows where we stand together.',
    helpKicker: '02 / Turn solidarity into action',
    helpTitle: 'Your support.<br> Our resilience.',
    helpIntro: 'No donation is too small.<br> Every act of support can save lives.<br> Choose a cause close to your heart.',
    u24Category: 'Rebuilding & relief',
    u24Text: 'Ukraine’s official fundraising platform. Support medical aid, rebuilding, humanitarian demining, and other areas of need.',
    cbaCategory: 'Support for defenders',
    cbaName: 'Come Back Alive',
    cbaText: 'A foundation supporting Ukraine’s defenders with equipment, training, and technology that strengthen defense and save lives.',
    voicesCategory: 'Care for children',
    voicesName: 'Voices of Children',
    voicesText: 'Psychological and psychosocial support for children experiencing war. Helping childhood feel like childhood again.',
    fundCta: 'Support the foundation',
    fundsNote: 'These links open the organizations’ official websites. Choose a cause and donate directly there.',
    shareKicker: '03 / Make our voices heard',
    shareTitle: 'Let your support<br> speak <span class="share-outline">volumes.</span>',
    shareDescription: 'Talk about Ukraine. Share this page.<br> Inspire one more person to take action.',
    shareCta: 'Share this page',
    downloadCta: 'Download the poster',
    copyFallback: 'Copy this link:',
    footerMessage: 'This domain stands with Ukraine.<br> And always will.',
    backTop: 'Back to top',
    footerIndependent: 'An independent page of solidarity. With love for Ukraine.',
    inspiredBy: 'Inspired by',
  };

  const textElements = [...document.querySelectorAll('[data-i18n]')];
  const ariaElements = [...document.querySelectorAll('[data-i18n-aria]')];
  const ukrainian = Object.fromEntries([
    ...textElements.map(element => [element.dataset.i18n, element.innerHTML]),
    ...ariaElements.map(element => [element.dataset.i18nAria, element.getAttribute('aria-label')]),
  ]);
  const originalTitle = document.title;
  const originalDescription = document.querySelector('meta[name="description"]').content;
  const shareStatus = document.querySelector('#share-status');
  const shareFallback = document.querySelector('#share-fallback');
  const shareUrlInput = document.querySelector('#share-url');
  let language = 'uk';

  function shareUrl() {
    return `https://compfix.com.ua/${language === 'en' ? '?lang=en' : ''}`;
  }

  function setLanguage(nextLanguage, updateUrl = false) {
    language = nextLanguage === 'en' ? 'en' : 'uk';
    const strings = language === 'en' ? english : ukrainian;
    document.documentElement.lang = language;
    // Both dictionaries are trusted local content; no URL or user input becomes HTML.
    textElements.forEach(element => { element.innerHTML = strings[element.dataset.i18n]; });
    ariaElements.forEach(element => { element.setAttribute('aria-label', strings[element.dataset.i18nAria]); });
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === language));
    });
    document.querySelectorAll('[data-href-uk]').forEach(link => {
      link.href = link.getAttribute(`data-href-${language}`);
    });
    document.title = language === 'en' ? 'Freedom is in our nature. Stand with Ukraine.' : originalTitle;
    document.querySelector('meta[name="description"]').content = language === 'en'
      ? 'Stand with Ukraine. Support its defenders, help children, and contribute to rebuilding. Every action matters.'
      : originalDescription;
    shareStatus.textContent = '';
    shareFallback.hidden = true;
    shareUrlInput.value = shareUrl();
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (language === 'en') url.searchParams.set('lang', 'en');
      else url.searchParams.delete('lang');
      try { window.history.replaceState(null, '', url); } catch { /* Language still works on file:// previews. */ }
    }
  }

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang, true));
  });

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl());
      shareStatus.textContent = language === 'en' ? 'Link copied. Thank you for standing with Ukraine!' : 'Посилання скопійовано. Дякуємо, що ти поруч!';
    } catch {
      shareFallback.hidden = false;
      shareUrlInput.value = shareUrl();
      shareUrlInput.focus();
      shareUrlInput.select();
      shareStatus.textContent = language === 'en' ? 'Select and copy the link below.' : 'Виділи й скопіюй посилання нижче.';
    }
  }

  document.querySelector('#share-button').addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    shareStatus.textContent = '';
    shareFallback.hidden = true;
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: document.title,
            text: language === 'en' ? 'Freedom is in our nature. Stand with Ukraine.' : 'Свобода в нашій природі. Підтримай Україну.',
            url: shareUrl(),
          });
          shareStatus.textContent = language === 'en' ? 'Thank you for standing with Ukraine!' : 'Дякуємо, що ти поруч!';
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      await copyLink();
    } finally {
      button.disabled = false;
    }
  });

  window.addEventListener('popstate', () => setLanguage(new URLSearchParams(window.location.search).get('lang')));
  setLanguage(new URLSearchParams(window.location.search).get('lang'));
  document.documentElement.classList.add('js');
})();
