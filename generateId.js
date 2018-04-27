/** from boomerang.js **/

/**
 * Generates a random ID based on the specified number of characters.  Uses
 * characters a-z0-9.
 *
 * @param {number} chars Number of characters (max 40)
 *
 * @returns {string} Random ID
 *
 * @memberof BOOMR.utils
 */
var generateId= function(chars) {
	return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".substr(0, chars || 40).replace(/x/g, function(c) {
		var c = (Math.random() || 0.01).toString(36);

		// some implementations may return "0" for small numbers
		if (c === "0") {
			return "0";
		}
		else {
			return c.substr(2, 1);
		}
	});
}

console.log(generateId(8));