const User = require("../models/user");
const Listing = require("../models/listings");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    if (!role || !["host", "guest"].includes(role)) {
      req.flash("error", "Invalid role selected. Must be host or guest.");
      return req.session.save(() => res.redirect("/signup"));
    }
    const newUser = new User({ email, username, role });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      req.session.save(() => {
        if (registeredUser.role === "host") {
          res.redirect("/listings/new");
        } else {
          res.redirect("/listings");
        }
      });
    });
  } catch (e) {
    req.flash("error", e.message);
    req.session.save(() => res.redirect("/signup"));
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  req.session.save(async () => {
    if (req.user && req.user.role === "host") {
      const listingCount = await Listing.countDocuments({ owner: req.user._id });
      if (listingCount === 0) {
        return res.redirect("/listings/new");
      }
    }
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  });
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    req.session.save(() => {
      res.redirect("/listings");
    });
  });
};

module.exports.renderDashboard = (req, res) => {
  res.render("users/dashboard.ejs");
};