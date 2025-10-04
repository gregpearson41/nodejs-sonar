const fs = require("fs");
const yaml = require("js-yaml");
const readline = require("readline");

// File to store sign-in/out data
const FILE = "attendance.yaml";

// Setup CLI prompt
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Load existing YAML file (if any)
function loadData() {
    if (fs.existsSync(FILE)) {
        const fileContents = fs.readFileSync(FILE, "utf8");
        return yaml.load(fileContents) || [];
    }
    return [];
}

// Save YAML file
function saveData(data) {
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(FILE, yamlStr, "utf8");
}

// Helper to format datetime from input
function buildDate(dateStr, timeStr) {
    let now = new Date();

    // If user provided date (YYYY-MM-DD)
    if (dateStr && dateStr.trim() !== "") {
        now = new Date(dateStr);
    }

    // If user provided time (HH:MM)
    if (timeStr && timeStr.trim() !== "") {
        const [hours, minutes] = timeStr.split(":").map(Number);
        now.setHours(hours || 0);
        now.setMinutes(minutes || 0);
        now.setSeconds(0);
        now.setMilliseconds(0);
    }

    return now.toISOString();
}

// Ask user for sign in / out
function main() {
    rl.question("Do you want to (1) Sign In or (2) Sign Out? ", (choice) => {
        const data = loadData();

        rl.question("Enter your name: ", (name) => {
            rl.question("Enter date (YYYY-MM-DD, leave empty for today): ", (dateStr) => {
                rl.question("Enter time (HH:MM, leave empty for now): ", (timeStr) => {
                    const entry = {
                        name,
                        action: choice === "1" ? "Sign In" : "Sign Out",
                        time: buildDate(dateStr, timeStr),
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
