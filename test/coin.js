const chai = require("chai");
const chaiHttp = require("chai-http");
const randomEmail = require("random-email");
const server = require("../index");

chai.should();
chai.use(chaiHttp);

describe("Coin API", () => {
  describe("PATCH /coin/latest", () => {
    it("It should update latest coin prices", (done) => {
      chai
        .request(server)
        .patch("/coin/latest")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("GET /coin/all", () => {
    it("It should retrive all coins from db", (done) => {
      chai
        .request(server)
        .get("/coin/all")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });
  

});
