const supertest = require("supertest");
// const app = require("../app.js");
const { startServer, stopServer } = require('../app');
const request = supertest(app);
const Instrument = require("./../models/instrument");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "1h" });
};

describe("Test /instruments routes", () => {
  let token;

  beforeAll(async() => {
    jest.setTimeout(5000);
    token = generateToken("65fda83050e4769c343e9c63");
    await startServer();
  });
  afterAll(async () => {
    await stopServer();
  });
  describe("GET /api/instruments", () => {
    it("should get all instruments successfully", async () => {
      const response = await request
        .get("/api/instruments")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.instruments).toBeDefined();
      expect(response.body.total_results).toBeDefined();
    });
  });

  describe("POST /api/v1/instruments", () => {
    it("should add an instrument successfully", async () => {
      const data = {
        author: "65fda83050e4769c343e9c63",
        title: "Test Instrument jest",
        type: "Guitar",
        brand: "Test Brand",
        details: "Test Details",
        condition: "Excellent",
        status: "exchange",
      };
      const response = await request
        .post("/api/instruments")
        .set("Authorization", `Bearer ${token}`)
        .send(data);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
  describe("GET /api/instruments/:id", () => {
    it("should get an instrument successfully", async () => {
      const instrumentId = "660c171af902fd81529e3436";
      const response = await request
        .get(`/api/instruments/${instrumentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.instrument).toBeDefined();
    });
  });
  describe("DELETE /api/instruments/:id", () => {
    it("should delete an instrument successfully", async () => {
      const instrumentId = "660c171af902fd81529e3436";

      const response = await request
        .delete(`/api/instruments/${instrumentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
  describe("PATCH /api/instruments/:id/like", () => {
    it("should add a like to an instrument successfully", async () => {
      const instrumentId = "660c171af902fd81529e3436";
      const response = await request
        .patch(`/api/instruments/${instrumentId}/like`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
});
});
