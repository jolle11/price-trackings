const moment = require("moment");
const { Builder } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
require("chromedriver");

const url =
	"https://bellroy.com/products/lite-sling?color=shadow&material=diamond_ripstop";

async function getPrice(url) {
	// Wait for browser to build and launch properly
	let driver = await new Builder().forBrowser("chrome").build();

	// Navigate to the url passed in
	await driver.get(url);

	// Get the source code completed
	let source = await driver.getPageSource();

	const web = cheerio.load(source);
	const price = web("span.price_value").text();
	const webPrice = Array.from(price);

	// If price is filled
	if (webPrice.length) {
		webPrice.shift(); // Bellroy uses the currency symbol before the price number
		webPrice.unshift(moment().format("DD-MM-YYYY - ")); // Add date
		const result = webPrice.join("");
		console.log(result);
	} else {
		console.log("Something went wrong while getting the price.");
	}

	await driver.close();
}

getPrice(url);
