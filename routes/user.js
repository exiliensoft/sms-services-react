let express = require("express");
let app = express.Router();

module.exports = (db) => {
  /* ------------------------------------------------- */
  /* Update current user */
  /* ------------------------------------------------- */
  app.put("/current_user", async (req, res) => {
    const response = await db.User.update(
      {
        ...req.body,
        updatedAt: Date(),
      },
      { where: { id: req.user.id } }
    );

    res.send(response);
  });
  return app;
};
