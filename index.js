const puppeteer = require("puppeteer");

async function scrapeGoogle(query) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set user agent to mimic a real browser
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

    // Extract search results
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a")).map(el => ({
                href: el.href,
                text: el.textContent
        }));
    });

    console.log(results);

    await browser.close();
}

// Run the function with a query
scrapeGoogle("Node.js web scraping");
