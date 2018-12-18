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
  hideElements([welcomeScreen, diagnoseScreen, prescriptionScreen]);
  showElements([symptomScreen]);
}

function goToDiagnoseScreen() {
  hideElements([welcomeScreen, symptomScreen, prescriptionScreen]);
  showElements([diagnoseScreen]);
  document.querySelectorAll('.checkbox-container input:checked').forEach(input => input.checked = false);
  onGenerate();
}

function goToWelcomeScreen() {
  hideElements([symptomScreen, diagnoseScreen, prescriptionScreen]);
  showElements([welcomeScreen]);
}

function goToPrescriptionScreen() {
  hideElements([welcomeScreen, symptomScreen, diagnoseScreen]);
  showElements([prescriptionScreen]);
  const imageUrl = choice(PRESCRIPTIONS);
  document.querySelector(".prescription-image").src = imageUrl;
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

function switchLanguage(e, newLocale) {
  e.preventDefault();
  PRESCRIPTIONS = PRESCRIPTIONS.map(src => src.replace(`-${locale}`, `-${newLocale}`));
  document.querySelectorAll('.i18n').forEach(img => (img.src = img.src.replace(`-${locale}`, `-${newLocale}`)));
  document.querySelector('body').className = `locale-${newLocale}`;
  locale = newLocale;
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

  // console.log(result);

  document.querySelector(".diagnose-seed").innerHTML = result;
  document.querySelector(".diagnose-ziekte").innerHTML = ziekte;
}

async function init() {
  window.sketch = await loadSketch(SKETCH_ID);
  // document.querySelector('#generate').addEventListener('click', onGenerate);
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
