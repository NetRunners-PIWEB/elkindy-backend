const supertest = require('supertest');
// const app = require('../app.js');
// const request = supertest(app);
const { startServer, stopServer } = require('../app');

const Exam = require('./../models/exam');

describe('Exam Controller', () => {
    beforeAll(async () => {
        await startServer();
      });
    
      afterAll(async () => {
        await stopServer();
      });
    

    test('POST /api/exam/createExam creates a new exam', async () => {
        // Données d'exemple pour l'examen
        const examData = {
            // Propriétés de l'examen
            name: 'solfej',
            startDate: new Date(),
            duration: '90 m', // Durée en minutes
            type: 'exam', // Type d'examen (exam ou evaluation)
            teacher: 'John Doe', // Enseignant
            students: ['farah', 'farah'], // Étudiants associés
            classe: 'A3' // Classe associée
            // Ajoutez d'autres propriétés selon votre modèle d'examen
        };

        // Envoyer une requête POST avec les données d'examen
        const response = await request.post('/api/exam/createExam').send(examData);

        // Vérifier que la réponse est un code de statut 201 Created
        expect(response.status).toBe(201);

        // Vérifier que la réponse contient les données de l'examen créé
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe(examData.name);
        expect(new Date(response.body.startDate)).toEqual(examData.startDate);
        expect(response.body.duration).toBe(examData.duration);
        expect(response.body.type).toBe(examData.type);
        expect(response.body.teacher).toBe(examData.teacher);
        expect(response.body.students).toEqual(expect.arrayContaining(examData.students));
        expect(response.body.classe).toBe(examData.classe);

        // Vérifier que l'examen a été enregistré dans la base de données
        const createdExam = await Exam.findOne({ name: examData.name });
        expect(createdExam).toBeTruthy();
        expect(createdExam.name).toBe(examData.name);
        expect(new Date(createdExam.startDate)).toEqual(examData.startDate);
        expect(createdExam.duration).toBe(examData.duration);
        expect(createdExam.type).toBe(examData.type);
        expect(createdExam.teacher).toBe(examData.teacher);
        expect(createdExam.students).toEqual(expect.arrayContaining(examData.students));
        expect(createdExam.classe).toBe(examData.classe);
    });
});
