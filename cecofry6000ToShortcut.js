const moment = require("moment");
const { Builder } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
require("chromedriver");

const url =
	"https://cecotec.es/es/freidoras-sin-aceite/cecofry-experience-6000";

async function getPrice(url) {
	// Wait for browser to build and launch properly
	let driver = await new Builder().forBrowser("chrome").build();

	// Navigate to the url passed in
	await driver.get(url);

	// Get the source code completed
	let source = await driver.getPageSource();

	const web = cheerio.load(source);
	const price = web("h3.css-bxi7sc").text();
	const webPrice = Array.from(price);

	if (webPrice.length) {
		webPrice.splice(webPrice.length - 2, 2);
		webPrice.unshift(moment().format("DD-MM-YYYY - "));
		const result = webPrice.join("");
		console.log(result);
	} else {
		console.log("Something went wrong while getting the price.");
	}

	await driver.close();
}

getPrice(url);
