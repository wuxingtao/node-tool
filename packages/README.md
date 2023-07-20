## 功能清单
- [x] cd-multiple.js 禅道任务开始自动化
- [x] cd-multiple-end.js 禅道结束自动化
- [x] cd-index.js 禅道自动化
- [ ] lj-index.js 蓝鲸自动化

## puppeteer selector

* 1.通过id或者class或者标签定位元素；id是#id值；class是.class名字；标签直接使用标签名称即可
* 2.通过id或者class或者标签和属性共同定位元素
* 3.通过xpath定位元素，xpath可读性比较差，不建议大家使用该方式定位页面元素，故这里也不做介绍
* 4.先查找符合条件的多个元素，再在多个元素中按元素顺序进行筛选，即选择页面元素的某个子元素
* 5.先查找父元素，再在父元素基础上继续定位元素
* 6.通过元素包含的text定位元素(仅expect-puppeteer才提供)
* 7.通过document定位元素
————————————————

### xpath 根据内容定位
```js
// xpath 根据内容定位
const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const [page] = await browser.pages();

    await page.goto('https://example.org/');

    const [element] = await page.$x('//a[text()="More information..."]');
    // For partial match:
    // const [element] = await page.$x('//a[contains(text(), "More")]');
    await element.click();
  } catch (err) {
    console.error(err);
  }
})();
```

### xpath 匹配多个元素，父元素
