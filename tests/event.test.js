const supertest = require("supertest");
const app = require("../app.js");
const request = supertest(app);
const Event = require("../models/event.js");

jest.mock("../models/event.js", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  save: jest.fn(),
}));

// beforeAll(() => {
//   jest.setTimeout(3000);
// });

describe("Event Controller", () => {
  describe("GET /api/events", () => {
    it("should list all events", async () => {
      const mockEvents = [{ title: "Event 1" }, { title: "Event 2" }];
      Event.find.mockResolvedValue(mockEvents);

      const response = await request.get("/api/events");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(Event.find).toHaveBeenCalledWith({ isArchived: false });
    });

    it("should handle errors when listing events", async () => {
      const errorMessage = "Error fetching events";
      Event.find.mockRejectedValue(new Error(errorMessage));

      const response = await request.get("/api/events");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
    });
  });

  describe("GET /api/events/:id", () => {
    it("should get an event by id", async () => {
      const mockEventId = "65e487bc64aff87a4f39971a";
      const mockEvent = { _id: mockEventId, title: "Final Year Event" };
      Event.findById.mockResolvedValue(mockEvent);

      const response = await request.get(`/api/events/${mockEventId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", mockEventId);
      expect(response.body).toHaveProperty("title", mockEvent.title);
      expect(Event.findById).toHaveBeenCalledWith(mockEventId);
    });

    it("should return 404 when event is not found", async () => {
      const mockEventId = "nonexistentid";
      Event.findById.mockResolvedValue(null);

      const response = await request.get(`/api/events/${mockEventId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Event not found");
      expect(Event.findById).toHaveBeenCalledWith(mockEventId);
    });
  });

//   describe("POST /api/events/createEvent", () => {
//       const mockEventData = {
//           title: "New Event",
//           description: "This is an Event test Description",
//           startDate: new Date(),
//           endDate: new Date(),
//           location: "Event Location",
//           startTime: "12:00",
//           endTime: "14:00",
//           capacity: 100,
//       };

//       it("should create an event and return 201 status", async () => {
//           const mockEventInstance = new Event(mockEventData); 
//           Event.mockReturnValueOnce(mockEventInstance); 

//           const response = await request
//               .post("/api/events/createEvent")
//               .send(mockEventData);

//           expect(response.status).toBe(201);
//           expect(response.body).toEqual(mockEventData);
//           expect(Event).toHaveBeenCalledWith(mockEventData); 
//           expect(mockEventInstance.save).toHaveBeenCalled(); 
//       });

//       it("should handle errors and return 500 status", async () => {
//           const errorMessage = "Error creating event";
//           const mockEventInstance = new Event(mockEventData);
//           mockEventInstance.save.mockRejectedValue(new Error(errorMessage)); 
//           Event.mockReturnValueOnce(mockEventInstance);

//           const response = await request.post("/api/events/createEvent").send({});

//           expect(response.status).toBe(500);
//           expect(response.body).toHaveProperty("message", errorMessage);
//           expect(Event).toHaveBeenCalledWith({}); 
//           expect(mockEventInstance.save).toHaveBeenCalled(); 
//       });
//   });

  describe("DELETE api/events/deleteEvent/:id", () => {
    it("should delete an event and return 200 status", async () => {
      const mockEventId = "65f228518c3460cb1bbd4ef6";
      Event.findByIdAndDelete.mockResolvedValue({ _id: mockEventId });
      const response = await request.delete(
        `/api/events/deleteEvent/${mockEventId}`
      );
      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Event deleted successfully"
      );
      expect(Event.findByIdAndDelete).toHaveBeenCalledWith(mockEventId);
    });

    it("should return 404 when event to delete is not found", async () => {
      const mockEventId = "nonexistentid";
      Event.findByIdAndDelete.mockResolvedValue(null);
      const response = await request.delete(
        `/api/events/deleteEvent/${mockEventId}`
      );
      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Event not found");
      expect(Event.findByIdAndDelete).toHaveBeenCalledWith(mockEventId);
    });

    it("should handle errors and return 500 status", async () => {
      const mockEventId = "65f228518c3460cb1bbd4ef6";
      const errorMessage = "Error deleting event";
      Event.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));
      const response = await request.delete(
        `/api/events/deleteEvent/${mockEventId}`
      );
      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", errorMessage);
      expect(Event.findByIdAndDelete).toHaveBeenCalledWith(mockEventId);
    });
  });

  describe("PUT api/events/updateEvent/:id", () => {
    const mockEventId = "65f1cd1185b360993d9cfc7b";
    const updatedData = {
      title: "Competition Edition",
    };

    it("should update an event and return 200 status", async () => {
      Event.findByIdAndUpdate.mockResolvedValue({
        _id: mockEventId,
        ...updatedData,
      });

      const response = await request
        .put(`/api/events/updateEvent/${mockEventId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("title", updatedData.title);
      expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEventId,
        updatedData,
        { new: true }
      );
    });

    it("should return 404 when event to update is not found", async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request
        .put(`/api/events/updateEvent/${mockEventId}`)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Event not found");
    });

    it("should handle errors and return 500 status", async () => {
      const errorMessage = "Error updating event";
      Event.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      const response = await request
        .put(`/api/events/updateEvent/${mockEventId}`)
        .send(updatedData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", errorMessage);
    });
  });

  describe("PATCH api/events/archiveEvent/:id", () => {
    const mockEventId = "65f1859a85b360993d9cfc51";

    it("should archive an event and return 200 status", async () => {
      const archivedEventData = {
        isArchived: true,
        status: "Archived",
      };

      Event.findByIdAndUpdate.mockResolvedValue({
        _id: mockEventId,
        ...archivedEventData,
      });

      const response = await request
        .patch(`/api/events//archiveEvent/${mockEventId}`)
        .send(archivedEventData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", mockEventId);
      expect(response.body).toHaveProperty("isArchived", true);
      expect(response.body).toHaveProperty("status", "Archived");
      expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEventId,
        { $set: archivedEventData },
        { new: true }
      );
    });

    it("should return 404 when event to archive is not found", async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request
        .patch(`/api/events/archiveEvent/${mockEventId}`)
        .send({});

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Event not found");
    });

    it("should handle errors and return 500 status", async () => {
      const errorMessage = "Error archiving event";
      Event.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      const response = await request
        .patch(`/api/events/archiveEvent/${mockEventId}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", errorMessage);
    });
  });
  describe("GET /api/events/archived", () => {
    it("should list archived events", async () => {
      const mockArchivedEvents = [
        { title: "Archived Event 1", isArchived: true },
        { title: "Archived Event 2", isArchived: true },
      ];
      Event.find.mockResolvedValue(mockArchivedEvents);

      const response = await request.get("/api/events/archived");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArchivedEvents);
      expect(Event.find).toHaveBeenCalledWith({ isArchived: true });
    });

    it("should handle errors when listing archived events", async () => {
      const errorMessage = "Error fetching archived events";
      Event.find.mockRejectedValue(new Error(errorMessage));

      const response = await request.get("/api/events/archived");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
    });
  });

  describe("PATCH /api/events/restoreEvent/:id", () => {
    const mockEventId = "65f1859a85b360993d9cfc51";
    const mockEventData = {
      _id: mockEventId,
      title: "Archived Event",
      isArchived: false,
      status: "Active",
    };

    it("should restore an archived event", async () => {
      Event.findByIdAndUpdate.mockResolvedValue(mockEventData);

      const response = await request.patch(
        `/api/events/restoreEvent/${mockEventId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEventData);
      expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
        mockEventId,
        { $set: { isArchived: false, status: "Active" } },
        { new: true }
      );
    });

    it("should return 404 if the event to restore is not found", async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request.patch(
        `/api/events/restoreEvent/${mockEventId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    it("should handle errors during the restoration of an event", async () => {
      const errorMessage = "Error restoring event";
      Event.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      const response = await request.patch(
        `/api/events/restoreEvent/${mockEventId}`
      );

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessage);
    });
  });
});
