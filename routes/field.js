const Sequelize = require("sequelize");
const requireLogin = require("../middlewares/requireLogin");
const Op = Sequelize.Op;
let express = require("express");
let app = express.Router();

module.exports = (db) => {
  app.post("/", [requireLogin], async (req, res) => {
    const { fieldName, type, options } = req.body;
    let value = await db.Field.create({
      fieldName,
      type,
      _user: req.user.id,
      options: options,
    });
    return res.send(value);
  });
  app.put("/", [requireLogin], async (req, res) => {
    let value = await db.Field.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    return res.send(value);
  });
  app.get("/", [requireLogin], async (req, res) => {
    const values = await db.Field.findAll({
      where: {
        _user: req.user.id,
      },
    });
    return res.send(values);
  });
  app.delete("/:id", [requireLogin], async (req, res) => {
    await db.Field.destroy({
      where: { id: req.params.id },
    });
    return res.json({});
  });
  return app;
};
