const fs = require("fs");


setInterval(() => {
	let data = fs.readFileSync("pollsRoles.json");
	fs.writeFileSync("backupPollRoles.json", data);

	data = fs.readFileSync("polls.json");
	fs.writeFileSync("polls.json", data);

	data = fs.readFileSync("usersPolls.json");
	fs.writeFileSync("usersPolls.json", data);
}, 1000 * 60 * 60);
