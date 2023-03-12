const fs = require("fs");


setInterval(() => {
    let data = fs.readFileSync("pollsRoles.json");
    fs.writeFileSync("backupPollsRoles.json", data);

    data = fs.readFileSync("polls.json");
    fs.writeFileSync("backupPolls.json", data);

    data = fs.readFileSync("usersPolls.json");
    fs.writeFileSync("backupUsersPolls.json", data);
}, 1000 * 60 * 60);