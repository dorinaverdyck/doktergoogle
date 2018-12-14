const welcomeScreen = document.querySelector("#welcome");
const symptomScreen = document.querySelector("#symptoms");
const diagnoseScreen = document.querySelector("#diagnose");
const prescriptionScreen = document.querySelector("#prescription");
let locale = 'nl';

function choice(l) {
  return l[Math.floor(Math.random() * l.length)];
}

function hideElements(elements) {
  elements.forEach(element => (element.style.display = "none"));
}

function showElements(elements) {
  elements.forEach(element => (element.style.display = "flex"));
}

function goToSymptomScreen() {
  hideElements([welcomeScreen, diagnoseScreen, prescriptionScreen]);
  showElements([symptomScreen]);
}

function goToDiagnoseScreen() {
  hideElements([welcomeScreen, symptomScreen, prescriptionScreen]);
  showElements([diagnoseScreen]);
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

const PRESCRIPTIONS = [
  "images/voorschrift-1.svg",
  "images/voorschrift-2.svg",
  "images/voorschrift-3.svg"
];

function printPrescription() {
  window.print();
  goToWelcomeScreen();
}

function switchLanguage(e, newLocale) {
  e.preventDefault();
  document.querySelectorAll('.i18n').forEach(img => (img.src = img.src.replace(`-${locale}`, `-${newLocale}`)));
  document.querySelector('body').className = `locale-${newLocale}`;
  locale = newLocale;
}

const SKETCH_ID = "-LTWTm__dntsH9NS-5ZE";

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
