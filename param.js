/*
* config file
*/
exports.IP = "0.0.0.0";
exports.PORT = 1500;

exports.startServer = function () {
	// output conlose log
	console.log("Server running at http://" + exports.IP + ":" + exports.PORT + "/");
	console.log("[Ctrl + c] is stop key.");
};
exports.HEADER = { "Content-Type": "text/html; charset=UTF-8" };


exports.DB_IP = "localhost";
exports.DB_PORT = 3306;
exports.DB_NAME = "test01";

