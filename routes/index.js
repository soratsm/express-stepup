import express from "express";

const router = express.Router();

// get / post / all 等に対応させる
router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.post("/", (req, res) => {
  // この段階でreqのbody属性にejsのname属性値が格納される
  res.send("OK");
});

export default router;
