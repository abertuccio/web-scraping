const puppeteer = require('puppeteer');


const getJsonImages = async (urlParts, searchTerm, querySelectorAll) => {

  var url = urlParts.domain + '?' +
    urlParts.queryParameters.reduce((a, c) =>
      a += JSON.stringify(c).replace(/:/g, '=').replace(/\"|\{|\}/gi, "") + "&"
      , "")


  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector(querySelectorAll)


  const rawImages = await page.$$eval(querySelectorAll, imgTag => imgTag.map(e => e.src))

  let imagesArr = rawImages.reduce((a, c) => {
    if (c) {
      a.push({ "url": c });
    }
    return a;
  }, [])

  const images = [{ "images": imagesArr }]

  await browser.close();

  return images;

}


const getGoogleImages = (search) => {

  const querySelectorAll = '.rg_ic.rg_i';

  const urlParts = {
    domain: 'https://www.google.com/search',
    queryParameters: [{ q: search }, { source: 'lnms' }, { tbm: 'isch' }]
  }

  return getJsonImages(urlParts, search, querySelectorAll)

}

const getMercadoLibreImages = (search) => {

  const querySelectorAll = '.image-content a img';

  const urlParts = {
    domain: 'https://listado.mercadolibre.com.ar/'+search,
    queryParameters: []
  }

  return getJsonImages(urlParts, search, querySelectorAll)

}

const searchMethod = (page) => {

  var method = () => {
    return {
      status: "error",
      detail: "No existe metodo para " + page
    }
  }

  switch (page) {
    case "google":
      method = getGoogleImages;
      break;
    case "mercadolibre":
      method = getMercadoLibreImages;
      break;  
  }

  return method;


}



module.exports = {
  searchMethod: searchMethod
}
