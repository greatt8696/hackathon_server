const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("뀨");
});

module.exports = router;
