const { timeout } = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'f953a805e6941946037516052c6557af'
    },
    visualFeedback: true
  })
)

async function scrapeGoogle(query) {
    const browser = await puppeteer.launch({ 
      headless: true, 
      executablePath: '/usr/bin/google-chrome', 
      args: [
        '--no-sandbox', '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
        // disable automation

      ] });
    const page = await browser.newPage();
    
    // Set user agent to mimic a real browser
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36");
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { timeout: 0 });

    // await page.solveRecaptchas()
    await page.waitForNavigation()

    // for (let i = 0; i < 100; i++) {
    //     await page.goto(`https://www.google.com/search?q=mua+laptop+${i}`, { waitUntil: "domcontentloaded" });
    //     setTimeout(() => {
    //         console.log('wait')
    //     }, 1000)
    // }
    // // Extract search results
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a")).filter(el => (
            el.href.includes("https://www.googleadservices.com/pagead")
        )).map(el => ({
            title: el.querySelector("h3") ? el.querySelector("h3").innerText : "",
            url: el.href
        }));
    });

    console.log(results);

    // await browser.close();
}

// Run the function with a query
scrapeGoogle("mua laptop");