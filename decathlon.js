const moment = require("moment");
const { Builder } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
require("chromedriver");

const url = "https://www.decathlon.es/es/..."; // URL of the decathlon product here

async function getPrice(url) {
	// Wait for browser to build and launch properly
	let driver = await new Builder().forBrowser("chrome").build();

	// Navigate to the url passed in
	await driver.get(url);

	// Get the source code completed
	let source = await driver.getPageSource();

	const web = cheerio.load(source);
	const price = web("div.product-summary-price").text();
	let webPrice = Array.from(price);

	// Take shown price at the moment
	for (let i = 0; i < webPrice.length; i++) {
		if (webPrice[i] === "%") {
			webPrice.splice(0, i + 1);
		}
	}
	//Remove space at the end
	for (let i = 0; i < webPrice.length; i++) {
		if (webPrice[i] === "€") {
			webPrice.splice(i - 1, 999);
		}
	}

	if (webPrice.length) {
		webPrice.shift(); // Remove space at the beginning
		webPrice.unshift(moment().format("DD-MM-YYYY - ")); // Add date
		const result = webPrice.join("");
		console.log(result);
	} else {
		console.log("Something went wrong while getting the price.");
	}

	await driver.close();
}

getPrice(url);
