const supertest = require("supertest");
// const app = require("../app.js");
const { startServer, stopServer } = require('../app');
const request = supertest(app);
const Instrument = require("./../models/instrument");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
describe("Test /instruments routes", () => {
  // beforeAll(() => {
  //   jest.setTimeout(3000);
  // });
  beforeAll(async () => {
    jest.setTimeout(3000);
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  });
  describe("GET /api/v1/instruments", () => {
    it("should get all instruments successfully", async () => {
      const response = await request.get("/api/v1/instruments");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.instruments).toBeDefined();
      expect(response.body.total_results).toBeDefined();
    });

    it("should handle errors when getting all instruments", async () => {
      jest.spyOn(Instrument, "aggregate").mockImplementationOnce(() => {
        throw new Error("Test error");
      });

      const response = await request.get("/api/v1/instruments");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/instruments", () => {
    it("should add an instrument successfully", async () => {
      const data = {
        author: "65d517bddf2aa46349809694",
        title: "Test Instrument jest",
        type: "Guitar",
        brand: "Test Brand",
        details: "Test Details",
        condition: "Excellent",
        status: "exchange",
      };
      const response = await request.post("/api/v1/instruments").send(data);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
    it("should handle errors when adding an instrument", async () => {
      jest
        .spyOn(Instrument, "create")
        .mockRejectedValue(new Error("Test error"));

      const response = await request.post("/api/v1/instruments");
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
  describe("GET /api/v1/instruments/:id", () => {
    it("should get an instrument successfully", async () => {
      const instrumentId = "65e2f745efab294463d4abed";
      const userId = null;
      const response = await request.get(`/api/v1/instruments/${instrumentId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.instrument._id).toBe(instrumentId);
    });

    it("should handle errors when getting an instrument", async () => {
      const instrumentId = "65e2f745efab294463d4abedd";
      const response = await request.get(`/api/v1/instruments/${instrumentId}`);
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
});
