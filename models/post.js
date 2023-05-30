const path = require("path");
const fs = require("fs");

const uuid = require("uuid");

const accessFile = require("../utils/accessFile");

const dataPath = path.join(__dirname, "..", "data", "users.json");

function getPostsFromFile(filePath, callback) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            callback("[]");
        } else {
            callback(JSON.parse(fileData));
        }
    });
}

class Post {
    constructor(id, caption, imageUrl, hashtags) {
        this.id = id;
        this.caption = caption;
        this.imageUrl = imageUrl;
        this.hashtags = hashtags;
    }

    save() {
        this.id = uuid.v1();
        accessFile(dataPath, "[]").then((msg) => {
            if (msg === "File created") {
                fs.writeFile(dataPath, JSON.stringify([this]), (err) => {
                    if (err) console.log(err);
                });
            } else if (msg === "File exists") {
                getPostsFromFile(dataPath, (posts) => {
                    // type of posts is an array of objects
                    let updatedPosts = posts;
                    updatedPosts.push(this);
                    fs.writeFile(
                        dataPath,
                        JSON.stringify(updatedPosts),
                        (err) => {
                            if (err) console.log(err);
                        }
                    );
                });
            }
        });
    }

    static fetchOne(postId, callback) {
        getPostsFromFile(dataPath, (posts) => {
            const userPost = posts.find((post) => post.id === postId);
            callback(userPost);
        });
    }

    static fetchAll(callback) {
        getPostsFromFile(dataPath, (posts) => {
            callback(posts);
        });
    }

    static updatePost(newPost, callback) {
        // accessing the post and then changing the data
        getPostsFromFile(
            dataPath, (posts) => {
                const existingIndex = posts.findIndex(
                    (post) => post.id === newPost.id
                );
                try {
                    posts[existingIndex] = newPost;
                    fs.writeFile(dataPath, JSON.stringify(posts), (err) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        callback("Updated");
                    });
                } catch (err) {
                    callback("Not updated");
                }
            }
        );
    }

    static deleteById(postId, callback) {
        getPostsFromFile(dataPath, (posts) => {
            let updatedPosts = posts.filter((p) => p.id !== postId);
            fs.writeFile(dataPath, JSON.stringify(updatedPosts), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }
}

module.exports = Post;
