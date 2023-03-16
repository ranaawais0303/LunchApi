const express = require("express");
const MenuItemController = require("../controllers/MenuItemController");
const MenuController = require("../controllers/MenuController");
const router = express.Router();

router.post("/addItem", MenuItemController.createItem);
router.post("/AddMenu", MenuController.createMenu);
router.patch("/updateMenu", MenuController.updateManu);
router.patch("/updateItem", MenuItemController.updateItem);

module.exports = router;
