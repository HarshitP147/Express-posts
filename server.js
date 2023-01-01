const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const Post = require("./models/post");

const app = express();

app.set("view engine", "ejs");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    Post.fetchAll((posts) => {
        res.render("index", {
            title: "Home",
            path: req.url,
            posts: posts,
        });
    });
});

app.listen(process.env.PORT || 3000);
