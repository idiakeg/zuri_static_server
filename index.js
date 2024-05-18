const http = require("http");
const fs = require("fs");
const path = require("path");

const requestHandler = (req, res) => {
    if (req.method === "POST") {
        let body = [];

        req.on("data", (chunk) => {
            body.push(chunk);
        });

        req.on("end", () => {
            let goo = JSON.parse(Buffer.concat(body).toString());
            let db;

            fs.readFile(
                path.join(__dirname, "database.json"),
                "utf-8",
                (err, data) => {
                    if (err) console.log(err);
                    db = JSON.parse(data);
                    db.push(goo);

                    fs.writeFile(
                        "./database.json",
                        JSON.stringify(db, null, 2),
                        (err) => {
                            if (err) console.log(err);
                        }
                    );
                }
            );

            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, POST",
                "Access-Control-Allow-Headers": "content-type",
            });

            res.write(
                JSON.stringify({
                    status: "success",
                    msg: goo,
                })
            );
            res.end();
        });
    }

    if (req.method === "GET") {
        let filePath = path.join(
            __dirname,
            "public",
            req.url == "/" ? "index.html" : req.url
        );

        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    // serve the 404 page
                    fs.readFile(
                        path.join(__dirname, "public", "notFound.html"),
                        "utf-8",
                        (err, data) => {
                            if (err) console.log(err);
                            res.writeHead(400, { "Content-Type": "text/html" });
                            res.end(data);
                        }
                    );
                }
                console.log(err);
                return;
            }

            res.setHeader("Content-Type", getExtensionName(filePath));
            res.end(data);
        });
    }
};

const getExtensionName = (file_path) => {
    let extensionName = path.extname(file_path);

    if (extensionName === ".html") {
        return "text/html";
    } else if (extensionName === ".css") {
        return "text/css";
    } else if (extensionName === ".ico") {
        return "image/x-icon";
    } else {
        return "application/json";
    }
};

const server = http.createServer(requestHandler);

server.listen(4343, () => console.log("server running."));
