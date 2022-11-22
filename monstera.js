const moment = require("moment");
const { Builder } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
require("chromedriver");

const url = "https://www.monstera.es/..."; // URL of the monstera product here

async function takeScreenshot(url) {
	// Wait for browser to build and launch properly
	let driver = await new Builder().forBrowser("chrome").build();

	// Navigate to the url passed in
	await driver.get(url);

	// Get the source code completed
	let source = await driver.getPageSource();

	const web = cheerio.load(source);
	const price = web("div.product-price").text();
	let webPrice = Array.from(price);
	// Take shown price at the moment
	for (let i = 0; i < webPrice.length; i++) {
		if (webPrice[i] === "€") {
			webPrice.splice(i, 999);
		}
	}
	const discounted = []; // We'll need this to store only the price
	// We take the array and extract only the price value
	for (let j = 0; j < webPrice.length; j++) {
		if (
			Number(webPrice[j]) ||
			webPrice[j] === "0" ||
			webPrice[j] === "," ||
			webPrice[j] === "."
		) {
			discounted.push(webPrice[j]);
		}
	}

	webPrice = discounted;

	if (webPrice.length) {
		webPrice.unshift(moment().format("DD-MM-YYYY - ")); // Add date
		const result = webPrice.join("");
		console.log(result);
	} else {
		console.log("Something went wrong while getting the price.");
	}

	await driver.close();
}

takeScreenshot(url);
