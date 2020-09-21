const chai = require("chai");
const chaiHttp = require("chai-http");
const randomEmail = require("random-email");
const server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("User API", () => {
  const email = randomEmail();
  const badUser = {
    name: "test",
    email: email,
    password: "password",
    password2: "passsssword",
  };
  const goodUser = {
    name: "test",
    email: email,
    password: "password",
    password2: "password",
  };
  const badUser2 = {
    name: "test",
    email: email,
    password: "p",
    password2: "p",
  };
  const goodUserLogin = {
    email: email,
    password: "password",
  };
  const badUserLogin = {
    email: email,
    password: "lasdflkjljkdasf",
  };

  //User Register
  describe("POST /user/register", () => {
    it("It should not register user with wrong password confirmation", (done) => {
      chai
        .request(server)
        .post("/user/register")
        .send(badUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("password2").eq("Passwords must match");
          done();
        });
    });
    it("It should not register user with password shorter than 6 characters", (done) => {
      chai
        .request(server)
        .post("/user/register")
        .send(badUser2)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("password")
            .eq("Password must be at least 6 characters");
          done();
        });
    });
    it("It should successfully register user", (done) => {
      chai
        .request(server)
        .post("/user/register")
        .send(goodUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name").eq(goodUser.name);
          res.body.should.have.property("email").eq(goodUser.email);
          res.body.should.have.property("_id");
          res.body.should.have.property("money").eq(0);
          done();
        });
    });
    it("It should not register user with same email", (done) => {
      chai
        .request(server)
        .post("/user/register")
        .send(goodUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("email").eq("Email already exists");
          done();
        });
    });
  });
  //login tests
  describe("POST /user/login", () => {
    it("It should login good user", (done) => {
      chai
        .request(server)
        .post("/user/login")
        .send(goodUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success").eq(true);
          res.body.should.have.property("token");
          done();
        });
    });
    it("It should not login with incorrect password", (done) => {
      chai
        .request(server)
        .post("/user/login")
        .send(badUserLogin)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have
            .property("passwordincorrect")
            .eq("Password incorrect");
          done();
        });
    });
  });
  //watchlist
  const id = "5f390694d497213ce8206241";
  const symbols = ["LTC", "BTC", "ETH"];
  describe("GET /user/watchlist", () => {
    it("It return user watchlist", (done) => {
      chai
        .request(server)
        .get(`/user/watchlist?id=${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  describe("PATCH /user/watchlist", () => {
    it("It should patch user watchlist", (done) => {
      chai
        .request(server)
        .patch("/user/watchlist").send({id,symbols})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
});
