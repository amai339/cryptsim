const chai = require("chai");
const chaiHttp = require("chai-http");
const randomEmail = require("random-email");
const User = require("../models/User");
const server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("Sim API", async () => {
  const id = "5f390694d497213ce8206241";
  const user = await User.findById(id, {});

  describe("GET /sim/history", () => {
    it("it should correctly retrive history", (done) => {
      chai
        .request(server)
        .get(`/sim/history?id=${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  describe("GET /sim/totalinvested", () => {
    it("it should correctly invested amount", (done) => {
      chai
        .request(server)
        .get(`/sim/totalinvested?id=${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("profit")
            .eq(user.netProfit);
        res.body.should.have.property("invested").eq(user.moneyInvested)
          done();
        });
    });
  });
  describe("GET /sim/wallet", () => {
    it("it should correctly retrive user portfolio", (done) => {
      chai
        .request(server)
        .get(`/sim/wallet?id=${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  describe("GET /sim/money", () => {
    it("It should give correct money amount", (done) => {
      chai
        .request(server)
        .get(`/sim/money?id=${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eq(user.money.toString());
          done();
        });
    });
  });
  describe("PATCH /sim/money", () => {
    it("it should correctly update user money amount", (done) => {
      chai
        .request(server)
        .patch("/sim/money")
        .send({ id, amount: 230 })
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eq((user.money + 230).toFixed(2).toString());
          done();
        });
    });
  });
});
