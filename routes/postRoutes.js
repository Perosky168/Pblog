const express = require('express');

const protect = require("../middleware/authMiddleware");
const PostController = require("../controllers/postController");

const router = express.Router()

router.route("/")
  .get(PostController.getAllPosts)
  .post(protect, PostController.createPOst)

router.route("/:id")
  .get(PostController.getOnePOst)
  .patch(PostController.updatePOst)
  .delete(PostController.deletePOst)

module.exports = router;