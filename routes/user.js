const { Router } = require("express");

const Post = require("../models/post");

const router = Router();

router.get("/posts", (req, res) => {
    Post.fetchAll((posts) => {
        res.render("users/my-posts", {
            title: "My posts",
            path: "/user/posts",
            posts: posts,
        });
    });
});

router.get("/post/:postId", (req, res, next) => {
    const postId = req.params.postId;
    Post.fetchOne(postId, (post => {
        res.render("users/post-detail", {
            title: "Detail post view",
            path: req.url,
            post: post
        })
    }))
})

router.get("/new", (req, res) => {
    res.render("users/add-post", {
        title: "New post",
        path: "/user/new",
    });
});

router.post("/new", (req, res) => {
    const body = req.body;
    let userPost = new Post(null, body.caption, body.imageUrl, body.hashtags);
    userPost.save();
    res.redirect("/");
});

module.exports = router;
