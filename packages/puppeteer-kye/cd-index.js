/**
 * @Desc: index
 * @Author: wu xingtao
 * @Date: 2023/1/5
 */
const puppeteer = require('puppeteer');
const help = require('./utils/help.js');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process']
  });
  const page = await browser.newPage();
  await page.goto('http://zentao.ky-tech.com.cn/user-login.html');
  console.log('start!', page.url());

  /* 页面登录 */
  await page.waitForSelector('#account');
  await page.type('#account','2218823',{delay:100})
  const passwordInput = await page.$('.form-control[name="password"]')
  console.log(passwordInput)
  await passwordInput.type('KYe@2188',{delay:100})
   page.click('#submit')

  /* 等待跳转 */
  await page.waitForNavigation();
  // await page.goto('http://zentao.ky-tech.com.cn/my-task.html');

  /* 后台页面首页 - 适用单个任务 */
  await page.waitForSelector('.table-borderless tr')

  const today = help.getToDay()
  console.log(today)
  // 任务列表
  const [element] = await page.$x(`//td[contains(text(),"${today}")]`);


  console.log('today task',element)
  if(element){
    element.click()
  }
  await page.waitForNavigation();

  /* 任务详情页 */
  const [startBtn] = await page.$x(`//span[contains(text(),"开始")]`);
  const [endBtn] = await page.$x(`//span[contains(text(),"完成")]`);
  if(endBtn){
    console.log(endBtn)
    endBtn.click()
  }
  if(startBtn){
    console.log(startBtn)
    startBtn.click()
  }
  // iframe
  setTimeout(async () => {
    await page.waitForSelector('iframe');
    console.log('iframe is ready. Loading iframe content');
    // const elementHandle = await page.$('iframe[src="https://example.com"]',);
    const elementHandle = await page.$('#iframe-triggerModal')
    console.log('iframe element', elementHandle)
    const frame = await elementHandle.contentFrame();

    frame.click('#submit')
  },1000)

  setTimeout(async () => {
    await browser.close();
  },1000)
})();
