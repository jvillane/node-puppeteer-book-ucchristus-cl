import {launch} from "puppeteer";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bookPlz() {

  const browser = await launch({
    headless: false,
    timeout: 30000,
    args: ['--start-fullscreen'],
    dumpio: true,
    slowMo: 100
  })
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1366, height: 768});

  await page.goto('https://agenda.ucchristus.cl/', {waitUntil: "networkidle0"});

  const areaLoadingSelector = '.reservaStepper.cloader .container-loader'
  await page.waitForSelector(areaLoadingSelector, {hidden: true});
  await sleep(500);

  const examsSelector = '#mat-radio-3 .mat-radio-outer-circle';
  await page.waitForSelector(examsSelector);
  await page.click(examsSelector);

  const specialtyLoadingSelector = '.panel-area p mat-spinner';
  await page.waitForSelector(specialtyLoadingSelector, {hidden: true});
  await sleep(500);

  //seleccionar especialidad
  const specialtySelector = '#mat-input-2';
  await page.waitForSelector(specialtySelector);
  await page.hover(specialtySelector);
  await page.click(specialtySelector);
  //TODO cambiar texto
  //await page.type(specialtySelector, 'covid', {delay: 20});
  await page.type(specialtySelector, 'cardio', {delay: 20});
  //esperar a que en el filtro aparezca sólo 1 especialidad
  const onlyOneSpecialtyAutocomplete = 'div.mat-autocomplete-panel mat-option:only-child';
  const selector = await page.waitForSelector(onlyOneSpecialtyAutocomplete);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await sleep(500);

  //seleccionar área
  const areaSelector = '#mat-input-3';
  await page.hover(areaSelector);
  await page.click(areaSelector);
  //TODO cambiar texto
  //await page.type(areaSelector, 'auto', {delay: 20});
  await page.type(areaSelector, 'electro', {delay: 20});
  await sleep(500);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  //seleccionar centro
  await sleep(500);
  const centerSelector = '#buscar1 .row > div:nth-child(2) input';
  await page.waitForSelector(centerSelector);
  await page.hover(centerSelector);
  await page.click(centerSelector);
  await page.type(centerSelector, 'todos', {delay: 20});
  await sleep(500);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  //accionar búsqueda
  const searchSelector1 = 'p.info-busqueda > button';
  await page.waitForSelector(searchSelector1);
  await page.hover(searchSelector1);
  await page.click(searchSelector1);

  //seleccionar primer dia disponible
  const daySelector = 'div.calendario table tbody tr[role=row] td:not(.mat-calendar-body-disabled):not(.day-disabled)';
  await page.waitForSelector(daySelector);
  await page.hover(daySelector);
  await page.click(daySelector);

  //seleccionar primera hora disponible
  const timeSelector = 'div.sel-hora a.item-hora:not(.active)';
  await page.waitForSelector(timeSelector);
  await page.hover(timeSelector);
  await page.click(timeSelector);

  //ingresar rut
  const rutSelector = 'div.info-paciente input';
  await page.hover(rutSelector);
  await page.click(rutSelector);
  //TODO cambiar texto
  //await page.type(rutSelector, 'rut-valido', {delay: 20});
  await page.type(rutSelector, '19', {delay: 20});

  //presionar buscar
  const searchSelector2 = 'div.info-paciente button';
  await page.waitForSelector(searchSelector2);
  await page.hover(searchSelector2);
  await page.click(searchSelector2);

  //esperar que desaparezca el loader
  const bookLoaderSelector = 'div.reservaStepper div.container-loader';
  await page.waitForSelector(bookLoaderSelector, {hidden: true});
  await sleep(500);
  //seleccionar prevision
  const previsionSelector = 'div.info-paciente > div > div:nth-child(3) mat-select';
  await page.waitForSelector(previsionSelector);
  await page.hover(previsionSelector);
  await page.click(previsionSelector);
  await page.keyboard.press('Enter');

  //presionar siguiente
  const nextButtonSelector = 'div.info-paciente > div > div:nth-child(3) button';
  await page.waitForSelector(nextButtonSelector);
  await page.hover(nextButtonSelector);
  await page.click(nextButtonSelector);

  //esperar que desaparezca el loader
  await page.waitForSelector(bookLoaderSelector, {hidden: true});
  await sleep(500);
  //presionar reservar
  const bookButtonSelector = 'app-confirmacion button';
  await page.waitForSelector(bookButtonSelector);
  await page.hover(bookButtonSelector);
  //await page.click(bookButtonSelector);
}

bookPlz();
