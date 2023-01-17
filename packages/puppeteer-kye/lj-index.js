/**
 * @Desc: index
 * @Author: wu xingtao
 * @Date: 2023/1/5
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto('https://paas.ky-tech.com.cn/console/');
  console.log('start!', page.url());
  await page.type('#user','218823',{delay:100})
  await page.type('#password','KYe@2188',{delay:100})
   page.click('.login-btn')
  await page.waitForNavigation({waitUntil: 'load'});
  console.log('FOUND!', page.url());

  await page.waitForSelector('#d_2492');
  page.click('#d_2492')

  page.goto('https://paas.ky-tech.com.cn/o/ky-deploy/#/front/deploy')
  await page.waitForSelector('.el-submenu');

  console.log('FOUND!', page.url());
  page.click(page.$$('.el-submenu')[1])
  console.log('FOUND!', page.url());
  // await page.waitFor(4000);


})();
