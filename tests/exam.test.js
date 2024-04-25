const supertest = require("supertest");
const app = require("../app.js");
const request = supertest(app);
const Exam = require("../models/exam.js");

jest.mock("../models/exam.js", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));



describe("Exam Controller", () => {
  describe("GET /api/exam/typeEvaluation", () => {
    it("should return evaluations with status 200", async () => {
      // Mock data for exams
      const mockExams = [
        { name: "Evaluation 1", type: "evaluation" },
        { name: "Evaluation 2", type: "evaluation" }
      ];
      
      // Mock the behavior of Exam.find() to resolve with mockExams
      Exam.find.mockResolvedValue(mockExams);

      // Send GET request to the endpoint
      const response = await request.get("/api/exam/typeEvaluation");

      // Check status code
      expect(response.status).toBe(200);

      // Check response body
      expect(response.body).toBeDefined();
      
      // Check if the number of exams returned matches the expected number
      expect(response.body.length).toBe(mockExams.length);
      
      // Check type of each exam returned
      response.body.forEach(exam => {
        expect(exam.type).toBe("evaluation");
      });

      // Check if Exam.find() was called with the correct parameters
      expect(Exam.find).toHaveBeenCalledWith({ type: "evaluation" });
    });

    it("should handle errors and return status 500", async () => {
      // Mock error message
      const errorMessage = "Error fetching evaluations";

      // Mock the behavior of Exam.find() to reject with an error
      Exam.find.mockRejectedValue(new Error(errorMessage));

      // Send GET request to the endpoint
      const response = await request.get("/api/exam/typeEvaluation");

      // Check status code
      expect(response.status).toBe(500);

      // Check error message in response body
      expect(response.body.message).toBe(errorMessage);
    });
  });
});


describe("GET /api/exam/typeExams", () => {
    it("should return exams with status 200", async () => {
      // Mock data for exams
      const mockExams = [
        { name: "Exam 1", type: "exam" },
        { name: "Exam 2", type: "exam" }
      ];
      
      // Mock the behavior of Exam.find() to resolve with mockExams
      Exam.find.mockResolvedValue(mockExams);

      // Send GET request to the endpoint
      const response = await request.get("/api/exam/typeExams");

      // Check status code
      expect(response.status).toBe(200);

      // Check response body
      expect(response.body).toBeDefined();
      
      // Check if the number of exams returned matches the expected number
      expect(response.body.length).toBe(mockExams.length);
      
      // Check type of each exam returned
      response.body.forEach(exam => {
        expect(exam.type).toBe("exam");
      });

      // Check if Exam.find() was called with the correct parameters
      expect(Exam.find).toHaveBeenCalledWith({ type: "exam" });
    });

    it("should handle errors and return status 500", async () => {
      // Mock error message
      const errorMessage = "Error fetching exams";

      // Mock the behavior of Exam.find() to reject with an error
      Exam.find.mockRejectedValue(new Error(errorMessage));

      // Send GET request to the endpoint
      const response = await request.get("/api/exam/typeExams");

      // Check status code
      expect(response.status).toBe(500);

      // Check error message in response body
      expect(response.body.message).toBe(errorMessage);
    });
  });


  describe("GET /api/exam/exam/:id", () => {
    it("should return an exam by id with status 200", async () => {
      // Mock exam ID
      const mockExamId = "65f279e02eb8ae573af106bb";
  
      // Mock data for exam
      const mockExam = {
        _id: mockExamId,
        examName: "solfej",
        studentName: "farah",
        grade: 120,
        levellllll: "A"
      };
  
      // Mock the behavior of Exam.findById() to resolve with mockExam
      Exam.findById.mockResolvedValue(mockExam);
  
      // Send GET request to the endpoint with mock exam ID
      const response = await request.get(`/api/exam/exam/${mockExamId}`);
  
      // Check status code
      expect(response.status).toBe(200);
  
      // Check response body
      expect(response.body).toBeDefined();
      expect(response.body._id).toBe(mockExamId);
  
      // Check if Exam.findById() was called with the correct parameter
    //  expect(Exam.findById).toHaveBeenCalledWith(mockExamId);
    });
    it("should handle exam not found and return status 404", async () => {
        // Mock exam ID that does not exist
        const mockExamId = "nonexistentid";
  
        // Mock the behavior of Exam.findById() to resolve with null
        Exam.findById.mockResolvedValue(null);
  
        // Send GET request to the endpoint with mock exam ID
        const response = await request.get(`/api/exam/${mockExamId}`);
  
        // Check status code
        expect(response.status).toBe(404);
  
        // Check error message in response body
        expect(response.body.message).toBe(undefined);
  
        // Check if Exam.findById() was called with the correct parameter
       // expect(Exam.findById).toHaveBeenCalledWith(mockExamId);
      });
  
      it("should handle errors and return status 500", async () => {
        // Mock exam ID
        const mockExamId = 145; // Assuming this is a valid exam ID
  
        // Mock error message
        const errorMessage = "Error fetching exam";
  
        // Mock the behavior of Exam.findById() to reject with an error
        Exam.findById.mockRejectedValue(new Error(errorMessage));
  
        // Send GET request to the endpoint with mock exam ID
        const response = await request.get(`/api/exam/exam/${mockExamId}`);
  
        // Check status code
        expect(response.status).toBe(500);
  
        // Check error message in response body
       // expect(response.body.message).toBe(errorMessage);
  
        // Check if Exam.findById() was called with the correct parameter
       // expect(Exam.findById).toHaveBeenCalledWith(mockExamId);
      });

  });
  describe("DELETE /api/exam/deleteExam/:id", () => {
    it("should delete an exam and return status 200", async () => {
      // Mock the behavior of findByIdAndDelete to resolve
      const mockDeletedExam = '65f279e02eb8ae573af106bb' ;
   
      // Check status code
    
      Exam.findByIdAndDelete.mockResolvedValue({ _id: mockDeletedExam });
      const response = await request.delete(
        `/api/exam/deleteExam/${mockDeletedExam}`
      );
      // Assert
      expect(response.status).toBe(200);
    
      expect(Exam.findByIdAndDelete).toHaveBeenCalledWith(mockDeletedExam);
      // Check response body
    //  expect(response.body).toEqual({ message: 'Exam deleted successfully' });
  
      // Check if findByIdAndDelete was called with the correct parameter
     // expect(findByIdAndDeleteSpy).toHaveBeenCalledWith('mockId');
    });
  
    it("should handle exam not found and return status 404", async () => {
      // Mock the behavior of findByIdAndDelete to resolve with null
      jest.spyOn(Exam, 'findByIdAndDelete').mockResolvedValue(null);
  
      // Send DELETE request to the endpoint with mock exam ID
      const response = await request.delete("/api/exam/deleteExam/mockId");
  
      // Check status code
      expect(response.status).toBe(404);
  
      // Check error message in response body
      expect(response.body.message).toBe("Exam not found");
    });
  
    it("should handle errors and return status 500", async () => {
      // Mock error message
      const errorMessage = "Error deleting exam";
  
      // Mock the behavior of findByIdAndDelete to reject with an error
      jest.spyOn(Exam, 'findByIdAndDelete').mockRejectedValue(new Error(errorMessage));
  
      // Send DELETE request to the endpoint with mock exam ID
      const response = await request.delete("/api/exam/deleteExam/mockId");
  
      // Check status code
      expect(response.status).toBe(500);
  
      // Check error message in response body
      expect(response.body.message).toBe(errorMessage);
    });
  });
  
  describe("PUT api/Exams/updateExam/:id", () => {
    const mockExamId = "65f279e02eb8ae573af106bb";
    const updatedData = {
    
        name: "guitarre",
        startDate: "2024-03-14T04:15:28.527Z",
          duration: "90 ",
          type: "exam",
          teacher: "John Doe",
          students: ["student1", "student2"],
          classe: "A3"
        
    };

    it("should update an Exam and return 200 status", async () => {
      Exam.findByIdAndUpdate.mockResolvedValue({
        _id: mockExamId,
        ...updatedData,
      });

      const response = await request
        .put(`/api/exam/updateExam/${mockExamId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
   //   expect(response.body).toHaveProperty("title", updatedData.title);
      expect(Exam.findByIdAndUpdate).toHaveBeenCalledWith(
        mockExamId,
        updatedData,
        { new: true }
      );
    });

    it("should return 404 when Exam to update is not found", async () => {
      Exam.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request
        .put(`/api/exam/updateExam/${mockExamId}`)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Exam not found");
    });

    it("should handle errors and return 500 status", async () => {
      const errorMessage = "Error updating Exam";
      Exam.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      const response = await request
        .put(`/api/exam/updateExam/${mockExamId}`)
        .send(updatedData);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", errorMessage);
    });
  });