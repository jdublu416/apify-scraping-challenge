const Apify = require('apify');
const util = require('util');


Apify.main(async () => {

    // Get queue and enqueue first url.
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest(new Apify.Request({ url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/' }));

    // Create crawler.
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,

        handlePageFunction: getEventData,

        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed 4 times`);
        },
    });

    // Run crawler.
    await crawler.run();
    
});



const getEventData = async ({ page, request }) => {

    // Function to get data from page
    const title = await page.title();
    const posts = await page.$$('.athing');

    console.log(`Page ${request.url} succeeded and it has ${posts.length} posts.`);


    // Log data (util is a tool that nicely formats objects in the console)
    console.log(util.inspect(title, false, null));
}


