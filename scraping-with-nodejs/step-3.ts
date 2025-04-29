import * as dotenv from "dotenv";
import puppeteer from "puppeteer-core";
dotenv.config({ path: "../.env" });

(async () => {
  // create browser
  const browserWSEndpoint = `wss://api.zencrawl.com/browser/?apiKey=${process.env.apiKey}`;
  const browser = await puppeteer.connect({ browserWSEndpoint });

  // get default page
  const page = (await browser.pages())[0];
  // or create a new page
  // const page = await browser.newPage();

  // visit page
  await page.goto("https://quotes.toscrape.com/js/");

  const quotesData = await page.evaluate(() => {
    const quoteElements = document.querySelectorAll("div.quote");
    const quotes: { text: string; author: string; tags: string[] }[] = []; // 明确定义 quotes 数组的类型

    quoteElements.forEach((quoteElement) => {
      const textElement = quoteElement.querySelector("span.text");
      const authorElement = quoteElement.querySelector("small.author");
      const tagsElements = quoteElement.querySelectorAll("div.tags a.tag");
      const tags = Array.from(tagsElements)
        .map((tag) => (tag ? tag.textContent : null))
        .filter((tag) => tag !== null) as string[]; // 更严谨地处理 null 并断言类型

      if (textElement && authorElement) {
        const textContent = textElement.textContent?.trim();
        const authorContent = authorElement.textContent?.trim();

        if (textContent && authorContent) {
          quotes.push({
            text: textContent.slice(1, -1),
            author: authorContent,
            tags: tags,
          });
        }
      }
    });

    return quotes;
  });
  console.log(`[puppeteer]rows:`, quotesData);

  // close browser
  await browser.close();
})();
