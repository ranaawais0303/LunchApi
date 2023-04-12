const express = require("express");
const addonsController = require("../controllers/addonsController");
const router = express.Router();

router.post("/addItem", addonsController.createItem);
router.patch("/updateItem/:id", addonsController.updateItem);
router.delete("/deleteItem/:id", addonsController.deleteItem);
router.get("/getItems", addonsController.getItems);
router.get("/getItem", addonsController.getOneItem);

module.exports = router;
