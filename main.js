const Apify = require('apify');
const util = require('util');

Apify.main(async () => {

    // const requestList = new Apify.RequestList({
    //     sources: [
    //         { url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/' },
    //     ],
    // });
    // await requestList.initialize();
  // Get queue and enqueue first url.
  const requestQueue = await Apify.openRequestQueue();
  await requestQueue.addRequest(
    new Apify.Request({
      url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/'
    })
  );

  // Create crawler.
  const crawler = new Apify.PuppeteerCrawler({
    // requestList,
    requestQueue,
    launchPuppeteerOptions: { headless: false },

    handlePageFunction: getEventData,

    

    handleFailedRequestFunction: async ({ request }) => {
      console.log(`Request ${request.url} failed 4 times`);
    }
  });

  // Run crawler.
  await crawler.run();
});

const getEventData = async ({ page, request }) => {

  // Function to get data from page
  const pageTitle = await page.title();
  const eventURL =  await page.$('.detail-c2.left > div.footer > a').href;
    console.log(`this is the page object ${page}`);
  const title = await page.$('.detail-c2.left > h1').innerText;
  const description = await page.$('.description.clearfix > p').innerText;
  const date = await page.$('.detail-c2.left > firstChild').innerText;
  const times = await page.$('.detail-c2.left > div:nth-child(8)').innerText;
  const recurring = await page.$('.detail-c2.left > div:nth-child(3)')
    .innerText;
  const adrs = await page.$('.detail-c2.left > div.adrs').innerText;

  console.log(`event title: ${title}`);
  console.log(`event description: ${description}`);
  console.log(`event date: ${date}`);
  console.log(`event times: ${times}`);
  console.log(`event recurring: ${recurring}`);
  console.log(`event adrs: ${adrs}`);
  console.log(`event pageTitle: ${pageTitle}`);
  console.log(`event eventURL: ${eventURL}`);


  const pageFunction = ($posts) => {
    const data = [];

    // We're getting the title, rank and URL of each post on Hacker News.
    $posts.forEach(($post) => {
        data.push({
            title: $post.querySelector('.detail-c2.left  h1').innerText,
            description: $post.querySelector('.description.clearfix  p').innerText,
            eventhref: $post.querySelector('.detail-c2.left .footer  a').href,
        });
    });

    return data;
};
// const data = await page.$$eval('.athing', pageFunction);
await Apify.pushData(data);
};




// const data = await page.$$eval('.athing', pageFunction);
// console.log(`Page ${request.url} succeeded and it has ${posts.length} posts.`);

// Log data (util is a tool that nicely formats objects in the console)
// console.log(util.inspect(title, false, null));

// Apify.main(async () => {
//     // Create and initialize an instance of the RequestList class that contains the start URL.
//     const requestList = new Apify.RequestList({
//         sources: [
//             { url: 'https://news.ycombinator.com/' },
//         ],
//     });
//     await requestList.initialize();

//     // Apify.openRequestQueue() is a factory to get a preconfigured RequestQueue instance.
//     const requestQueue = await Apify.openRequestQueue();

//     // Create an instance of the PuppeteerCrawler class - a crawler
//     // that automatically loads the URLs in headless Chrome / Puppeteer.
//     const crawler = new Apify.PuppeteerCrawler({
//         // The crawler will first fetch start URLs from the RequestList
//         // and then the newly discovered URLs from the RequestQueue
//         requestList,
//         requestQueue,

//         // Run Puppeteer in headless mode. If you set headless to false, you'll see the scraping
//         // browsers showing up on your screen. This is great for debugging.
//         launchPuppeteerOptions: { headless: true },

//         // This function will be called for each URL to crawl.
//         // Here you can write the Puppeteer scripts you are familiar with,
//         // with the exception that browsers and pages are automatically managed by the Apify SDK.
//         // The function accepts a single parameter, which is an object with the following fields:
//         // - request: an instance of the Request class with information such as URL and HTTP method
//         // - page: Puppeteer's Page object (see https://pptr.dev/#show=api-class-page)
//         handlePageFunction: async ({ request, page }) => {
//             console.log(`Processing ${request.url}...`);

//             // A function to be evaluated by Puppeteer within the browser context.
//             const pageFunction = (page) => {
//                 const data = [];

//                 // We're getting the title, rank and URL of each post on Hacker News.
//                 page.forEach((p) => {
//                     data.push({
//                         title: p.querySelector('.title a').innerText,
//                         rank: p.querySelector('.rank').innerText,
//                         href: p.querySelector('.title a').href,
//                     });
//                 });

//                 return data;
//             };
//             const data = await page.$$eval('.athing', pageFunction);

//             // Store the results to the default dataset.
//             await Apify.pushData(data);

//             // Find the link to the next page using Puppeteer functions.
//             // let nextHref;
//             // try {
//             //     nextHref = await page.$eval('.morelink', el => el.href);
//             // } catch (err) {
//             //     console.log(`${request.url} is the last page!`);
//             //     return;
//             // }

//             // Enqueue the link to the RequestQueue
//             // await requestQueue.addRequest(new Apify.Request({ url: nextHref }));
//         },

//         // This function is called if the page processing failed more than maxRequestRetries+1 times.
//         handleFailedRequestFunction: async ({ request }) => {
//             console.log(`Request ${request.url} failed too many times`);
//         },
//     });

//     // Run the crawler and wait for it to finish.
//     await crawler.run();

//     console.log('Crawler finished.');
// });
