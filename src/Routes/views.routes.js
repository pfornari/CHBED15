import { Router } from "express";
import MessagesDao from "../daos/dbManager/messages.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("home", {});
});

router.get("/chat", async (req, res) => {
  const message = req.body;
  const user = req.body;

  const messages = await MessagesDao.addMessage(message);

  res.render("chat", {
    messages,
  });
});


export default router;
