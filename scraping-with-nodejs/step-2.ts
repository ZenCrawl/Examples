import * as dotenv from "dotenv";
import puppeteer from "puppeteer-core";
dotenv.config({ path: "../.env" });

(async () => {
  // create browser
  const browserWSEndpoint = `wss://api.zencrawl.com/browser/?apiKey=${process.env.apiKey}&proxy_premium=true&proxy_country=us`;
  const browser = await puppeteer.connect({ browserWSEndpoint });

  // get default page
  const page = (await browser.pages())[0];
  // or create a new page
  // const page = await browser.newPage();

  // visit page
  await page.goto("https://example.com");
  console.log(`->title:`, await page.title());

  // close browser
  await browser.close();
})();
