const SKETCH_ID = "-LU1rcKfhXHtTiSwdiMt";
let welcomeScreen = document.querySelector("#welcome");
let symptomScreen = document.querySelector("#symptoms");
let diagnoseScreen = document.querySelector("#diagnose");
let prescriptionScreen = document.querySelector("#prescription");
let PRESCRIPTIONS = [
  "images/voorschrift-nl-1.svg",
  "images/voorschrift-nl-2.svg",
  "images/voorschrift-nl-3.svg"
];
let locale = 'nl';

function choice(l) {
  return l[Math.floor(Math.random() * l.length)];
}

function hideElements(elements) {
  elements.forEach(element => (element.style.display = "none"));
}

function showElements(elements) {
  scroll(0,0);
  elements.forEach(element => (element.style.display = "flex"));
}

function goToSymptomScreen() {
  pushHistoryState('symptom');
  hideElements([welcomeScreen, diagnoseScreen, prescriptionScreen]);
  showElements([symptomScreen]);
}

function goToDiagnoseScreen() {
  pushHistoryState('diagnose');
  hideElements([welcomeScreen, symptomScreen, prescriptionScreen]);
  showElements([diagnoseScreen]);
  document.querySelectorAll('.checkbox-container input:checked').forEach(input => input.checked = false);
  onGenerate();
}

function goToWelcomeScreen() {
  pushHistoryState('welcome');
  hideElements([symptomScreen, diagnoseScreen, prescriptionScreen]);
  showElements([welcomeScreen]);
}

function goToPrescriptionScreen() {
  pushHistoryState('prescription');
  hideElements([welcomeScreen, symptomScreen, diagnoseScreen]);
  showElements([prescriptionScreen]);
  const imageUrl = choice(PRESCRIPTIONS);
  document.querySelector(".prescription-image").src = imageUrl;
}

function pushHistoryState(section) {
  const url = new URL(window.location.href);
  if (section === 'welcome') {
    url.searchParams.delete('section');
  } else {
    url.searchParams.set('section', section);
  }
  const parmas = url.href.split('.html')[1];
  history.pushState({}, `${section} screen`, `index.html${parmas}`);
}

function printPrescription(){
  var printContents = document.getElementById('voorschrift-print').innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  document.body.classList.add('center');
  window.print();
  document.body.classList.remove('center');
  document.body.innerHTML = originalContents;
  welcomeScreen = document.querySelector("#welcome");
  symptomScreen = document.querySelector("#symptoms");
  diagnoseScreen = document.querySelector("#diagnose");
  prescriptionScreen = document.querySelector("#prescription");
  goToWelcomeScreen();
}

function switchLanguage(newLocale) {
  PRESCRIPTIONS = PRESCRIPTIONS.map(src => src.replace(`-${locale}`, `-${newLocale}`));
  document.querySelectorAll('.i18n').forEach(img => (img.src = img.src.replace(`-${locale}`, `-${newLocale}`)));
  document.querySelector('body').className = `locale-${newLocale}`;
  locale = newLocale;
}

function changeATag(aTag, lang) {
  const url = new URL(window.location.href);
  const section = url.searchParams.get('section');
  if (section) {
    if (lang === 'nl') {
      aTag.href = `?section=${section}`;
      createCookie('googtrans', '', -1);
    } else {
      aTag.href = `?lang=${lang}&section=${section}#googtrans(${lang}|${lang})`;
    }
  } else {
    if (lang === 'nl') {
      aTag.href = 'index.html';
      createCookie('googtrans', '', -1);
    } else {
      aTag.href = `?lang=${lang}#googtrans(${lang}|${lang})`;
    }
  }
}

async function fetchSketch(sketchId) {
  const url = `https://emrg-pcg.firebaseio.com/sketch/${SKETCH_ID}.json`;
  const res = await fetch(url);
  return await res.json();
}

async function loadSketch(seed) {
  const sketch = await fetchSketch(SKETCH_ID);
  const phraseBook = await parsePhraseBook(sketch.source, fetchSketch);
  return phraseBook;
}

async function onGenerate() {
  if (!window.sketch) return;
  const result = await generateString(window.sketch, "root", {}, Date.now());
  const ziekte = /U heeft last van (een\s+)?(.*?)\./.exec(result)[2];

  document.querySelector(".diagnose-seed").innerHTML = result;
  document.querySelector(".diagnose-ziekte").innerHTML = ziekte;
}

async function init() {
  window.sketch = await loadSketch(SKETCH_ID);
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang');
  const section = url.searchParams.get('section');
  if (lang) {
    switchLanguage(lang);
  }
  switch (section) {
    case 'symptom':
      goToSymptomScreen();
      break;
    case 'diagnose':
      goToDiagnoseScreen();
      break;
    case 'prescription':
      goToPrescriptionScreen();
      break;
  }
  onGenerate();
}

init();

const $title = document.querySelector(".main-logo");
$title.addEventListener("click", goToSymptomScreen);

const $diagnoseButton = document.querySelector("#diagnose-button");
$diagnoseButton.addEventListener("click", goToDiagnoseScreen);

const $prescriptionButton = document.querySelector("#prescription-button");
$prescriptionButton.addEventListener("click", goToPrescriptionScreen);

const $printButton = document.querySelector("#print-button");
$printButton.addEventListener("click", printPrescription);

const $resetButton = document.querySelector("#reset-button");
$resetButton.addEventListener("click", goToWelcomeScreen);


function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'nl', layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT}, 'google_translate_element');
}

function triggerHtmlEvent(element, eventName) {
  var event;
  if (document.createEvent) {
    event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    element.dispatchEvent(event);
  } else {
    event = document.createEventObject();
    event.eventType = eventName;
    element.fireEvent('on' + event.eventType, event);
  }
}

jQuery('.lang-select').click(function() {
  var theLang = jQuery(this).attr('data-lang');
  jQuery('.goog-te-combo').val(theLang);

  window.location = jQuery(this).attr('href');
  location.reload();
});

function createCookie(name,value,days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
      var expires = "; expires=" + date.toGMTString();
  } else {
      var expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
