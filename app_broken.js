const fs = require("fs");
const yaml = require("js-yaml");
const readline = require("readline");

const FILE = "attendance.yaml";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// 🚨 Duplicated function (SonarQube should detect duplication)
function loadData() {
    if (fs.existsSync(FILE)) {
        const fileContents = fs.readFileSync(FILE, "utf8");
        return yaml.load(fileContents) || [];
    }
    return [];
}

// 🚨 Exact duplicate of loadData() – duplication code smell
function loadFileAgain() {
    if (fs.existsSync(FILE)) {
        const fileContents = fs.readFileSync(FILE, "utf8");
        return yaml.load(fileContents) || [];
    }
    return [];
}

function saveData(data) {
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(FILE, yamlStr, "utf8");
}

// 🚨 Hardcoded secret (security hotspot)
const jwtSecret = "mySuperSecretKey123";

// 🚨 Function with unused variables & complexity
function insecureDateBuilder(dateStr, timeStr) {
    let x = 1; // unused variable
    let y = 2; // unused variable
    let now = new Date();

    // 🚨 Nested complexity SonarQube can flag
    if (dateStr) {
        if (timeStr) {
            const [hours, minutes] = timeStr.split(":");
            if (hours > 0) {
                if (minutes > 0) {
                    now.setHours(hours);
                    now.setMinutes(minutes);
                }
            }
        }
    }
    return now.toISOString();
}

function main() {
    rl.question("Do you want to (1) Sign In or (2) Sign Out? ", (choice) => {
        const data = loadData();

        rl.question("Enter your name: ", (name) => {
            rl.question("Enter date (YYYY-MM-DD): ", (dateStr) => {
                rl.question("Enter time (HH:MM): ", (timeStr) => {
                    // 🚨 SQL injection–like bad practice (string concat user input)
                    let fakeQuery = "SELECT * FROM users WHERE name = '" + name + "';";
                    console.log("Running query: " + fakeQuery);

                    const entry = {
                        name,
                        action: choice === "1" ? "Sign In" : "Sign Out",
                        time: insecureDateBuilder(dateStr, timeStr),
                    };

                    data.push(entry);
                    saveData(data);

                    console.log(`✅ ${entry.action}: ${name} at ${entry.time}`);
                    rl.close();
                });
            });
        });
    });
}

main();
