import passport from "passport";
import { Strategy } from "passport-local";

import digest from './hash.js';

import config from "../../config/mongodb.config.js";
import { MongoClient } from "mongodb";
const { CONNECTION_URL, OPTIONS, DATABSE } = config;

passport.serializeUser((email, done) => {
  done(null, email);
});

passport.deserializeUser((email, done) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    var db = client.db(DATABSE);
    db.collection("users")
      .findOne({ email })
      .then((user) => {
        return new Promise((resolve, reject) => {
          db.collection("privileges")
            .findOne({ role: user.role })
            .then((privilege) => {
              user.permissions = privilege.permissions;
              resolve(user);
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error);
      })
      .then(() => {
        client.close();
      });
  });
});

passport.use(
  "local-strategy",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
        var db = client.db(DATABSE);
        db.collection("users")
          .findOne({
            email: username,
            password: digest(password),
          })
          .then((user) => {
            if (user) {
              // ログインしたとこにセッションIDを再生成する
              req.session.regenerate((error) => {
                if (error) {
                  done(error);
                } else {
                  done(null, user.email);
                }
              });
            } else {
              done(
                null,
                false,
                req.flash(
                  "message",
                  "ユーザー名 または パスワード が間違っています。"
                )
              );
            }
          })
          .catch((error) => {
            done(error);
          })
          .then(() => {
            client.close();
          });
      });
    }
  )
);

const initialize = function () {
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      if (req.user) {
        res.locals.user = req.user;
      }
      next();
    },
  ];
};

const authenticate = function () {
  return passport.authenticate("local-strategy", {
    successRedirect: "/account/",
    failureRedirect: "/account/login",
  });
};

const authorize = function (privilege) {
  return function (req, res, next) {
    if (
      req.isAuthenticated() &&
      (req.user.permissions || []).indexOf(privilege) >= 0
    ) {
      next();
    } else {
      res.redirect("/account/login");
    }
  };
};
export default {
  initialize,
  authenticate,
  authorize,
};
