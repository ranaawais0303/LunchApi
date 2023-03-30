const express = require("express");
const MenuItemController = require("../controllers/MenuItemController");
const MenuController = require("../controllers/MenuController");
const router = express.Router();

router.post("/addItem", MenuItemController.createItem);
router.post("/AddMenu", MenuController.createMenu);
router.post("/AddItemIntoMenu", MenuController.addItemIntoMenu);
router.patch("/updateMenu", MenuController.updateManu);
router.patch("/updateItem", MenuItemController.updateItem);
router.delete("/deleteMenu", MenuController.deleteMenu);
router.delete("/deleteItem", MenuItemController.deleteItem);
router.get("/getMenus", MenuController.getMenus);
router.get("/getItems", MenuItemController.getItems);
router.get("/getItem", MenuItemController.getOneItem);
router.get("/getMenu", MenuController.getOneMenu);
router.put("/updateCurr", MenuController.updateCurr);

module.exports = router;
