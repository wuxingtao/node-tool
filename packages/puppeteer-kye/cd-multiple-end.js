/**
 * @Desc: 批量多个任务
 * @Author: wu xingtao
 * @Date: 2023/1/5
 */
const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
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

  /* 后台页面首页 - 等待首页加载 */
  await page.waitForSelector('#subNavbar ul')

  /* 打开我的-任务列表 */
  const element = await page.$('li[data-id="task"] a');


  console.log('today task',element)
  if(element){
    element.click()
  }else{
    console.log('no task element')
  }
  await page.waitForNavigation();

  const today = dayjs(help.getToDay()).format("MM-DD")

  async function todayTaskCheck () {
    // 今日任务列表
    const elementLists = await page.$x(`//td[@class='c-deadline'][contains(text(),"${today}")]`);
    let taskLists = elementLists.length // 剩余任务数
    // const [targetElement] = await page.$x('//div[contains(@class, "group") and contains(., "1st Goal")]/div[@class="parent2"]//span[@class="odds"]')
    console.log(today, elementLists.length)
    if (elementLists.length) {
      for (let i = 0; i < elementLists.length; i++) {
        // const parentElement = await page.evaluate(el => el.parentNode, elementLists[i]);
        const parentNode = await elementLists[i].getProperty('parentNode')
        const parentClassHandle =await (await parentNode.getProperty('className')).jsonValue()

        console.log('parentNode', parentNode)
        console.log('parentClassHandle', parentClassHandle)

        // 获取属性attr
        const attr = await page.evaluate(el => el.getAttribute("data-id"), parentNode);
        console.log('data-id',attr)

        const btnTrElements = await page.$(`.fixed-right table tr[data-id="${attr}"]`)
        const btnElements = await btnTrElements.$('a[title="完成"]')
        console.log('btnElements', btnElements)
        if (btnElements) {
          try{
            await btnElements.click()
          }catch (e) {
            console.log('错误信息', e)
          }
          // iframe
          setTimeout(async () => {
            await page.waitForSelector('iframe');
            console.log('iframe is ready. Loading iframe content');
            // const elementHandle = await page.$('iframe[src="https://example.com"]',);
            const elementHandle = await page.$('#iframe-triggerModal')
            console.log('iframe element', elementHandle)
            if(!elementHandle){
              console.log('iframe modal error')
              return
            }
            const frame = await elementHandle.contentFrame();

            frame.click('#submit')

            // 重新执行检查
            setTimeout(async () => {
              await todayTaskCheck()
            },1000)
          }, 1000)
        } else{
          taskLists -= 1
        }
      }
      // // 剩余任务数为0
      // if(taskLists <= 0){
      //   setTimeout(async () => {
      //     await browser.close();
      //   },1000)
      // }
    }
  }

  await todayTaskCheck()

})();
