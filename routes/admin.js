const path = require("path");
const fs = require("fs");

const { Router } = require("express");

const Post = require("../models/post");

const router = Router();

const dataPath = path.join(__dirname, "..", "data", "users.json");

router.get("/actions", (req, res) => {
    Post.fetchAll((post) => {
        res.render("admin/actions", {
            path: "/admin/actions",
            title: "My post actions",
            posts: post,
        });
    });
});

router.post("/delete", (req, res) => {
    const postId = req.body.postId;
    Post.deleteById(postId, () => {
        try {
            res.redirect("/");
        } catch (err) {
            res.render("/admin/delete");
        }
    });

    res.redirect("/");
});

router.get("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    Post.fetchOne(postId, (editPost) => {
        res.render("admin/edit", {
            title: "Edit post",
            path: req.url,
            post: editPost,
        });
    });
});

router.post("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    const newBody = {
        id: postId,
        caption: req.body.caption.trim(),
        imageUrl: req.body.imageUrl,
        hashtags: req.body.hashtags.trim(),
    };

    Post.updatePost(newBody, (value) => {
        if (value === "Updated") {
            return res.redirect("/");
        } else {
            return res.redirect(`/admin/edit/${postId}`);
        }
    });
});

module.exports = router;
