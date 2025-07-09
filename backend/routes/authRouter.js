import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173/login");
  });
});

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

export default router;