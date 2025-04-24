const router = require("express").Router();
const commentController = require("../controllers/commentController");
const requireUser = require("../middlewares/requireUser");

router.post("/", requireUser, commentController.createCommentController);
router.delete("/", requireUser, commentController.deleteCommentController);
router.get("/", requireUser, commentController.getPostCommentsController);

module.exports = router;
