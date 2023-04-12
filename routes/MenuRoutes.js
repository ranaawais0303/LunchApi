const express = require("express");
const MenuItemController = require("../controllers/MenuItemController");
const MenuController = require("../controllers/MenuController");
const router = express.Router();

router.post("/addItem", MenuItemController.createItem);
router.post("/AddMenu", MenuController.createMenu);
router.post("/AddItemIntoMenu", MenuController.addItemIntoMenu);
router.patch("/updateMenu/:id", MenuController.updateManu);
//for update you shoud pass id into params same as del
router.patch("/updateItem/:id", MenuItemController.updateItem);
router.delete("/deleteMenu/:id", MenuController.deleteMenu);
router.delete("/deleteItem/:id", MenuItemController.deleteItem);
router.get("/getMenus", MenuController.getMenus);
router.get("/getItems", MenuItemController.getItems);
router.get("/getItem", MenuItemController.getOneItem);
router.get("/getMenu", MenuController.getOneMenu);
// router.post("/shutdown", MenuController.shutDown);
router.put("/updateCurr/:id", MenuController.updateCurr);

module.exports = router;
