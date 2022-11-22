const moment = require("moment");
const { Builder } = require("selenium-webdriver");
const cheerio = require("cheerio");
const fs = require("fs");
require("chromedriver");

const url =
	"https://www.pccomponentes.com/samsung-ue50bu8000k-50-led-ultrahd-4k-hdr10";

async function takeScreenshot(url) {
	// Wait for browser to build and launch properly
	let driver = await new Builder().forBrowser("chrome").build();

	// Navigate to the url passed in
	await driver.get(url);

	// Get the source code completed
	let source = await driver.getPageSource();

	const web = cheerio.load(source);
	const price = web("span.baserice").text();
	const webPrice = Array.from(price);

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
