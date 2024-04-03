const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../app.js");
const  Course = require('../models/course');
const {expect} = require("chai");
const { connection} = require("mongoose");
const { connect } = require("../config/mongoose.js");
const mongoose = require("mongoose");
const User = require('../models/user');

const should = chai.should();
chai.use(chaiHttp);
before(async function () {
    this.timeout(10000);
});

describe('Database Connection', function() {
    before(function(done) {
        connect().once('open', () => done()).on('error', (error) => done(error));
    });

    it('should connect to the test database', function() {
        expect(mongoose.connection.db.databaseName).to.equal('ElKindyDB_Test');
        console.log(mongoose.connection.db.databaseName);
    });

});
describe('Courses', () => {
    describe('/GET/:id course', () => {
        it('it should GET a course by the given id', async () => {
            let course = new Course({
                title: 'Course to Archive',
                category: 'Initiation',
                price: 33,
                isArchived: false
            });
            course = await course.save();
            const res = await chai.request(server).get('/api/courses/' + course._id);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id').eql(course._id.toString());
        });
    });
});

describe('PUT /api/courses/:id', () => {
    it('should update a course given the id', async function() {
        this.timeout(10000);
        let course = new Course({ title: 'Initial Title', category: 'Initiation', price: 33 },);
        course = await course.save();

        const res = await chai.request(server)
            .put('/api/courses/' + course.id)
            .send({title: 'Updated Title', price: 100});

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('title').eql('Updated Title');
        res.body.should.have.property('price').eql(100);

    });

});

describe('POST /api/courses', () => {
    it('should create a new course', (done) => {
        let course = {
            title: "New Course",
            category: "Initiation",
            description: "This is a new course",
            price: 100
        };
        chai.request(server)
            .post('/api/courses/')
            .send(course)
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('category');
                res.body.should.have.property('price');
                done();
            });
    });

});
describe('GET /api/courses', () => {
    it('it should GET all the courses', (done) => {
        chai.request(server)
            .get('/api/courses')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});
describe('PATCH /api/courses/archive/:id', function() {
    this.timeout(10000);

    it('should archive a course given the id', async function() { 
        let course = new Course({
            title: 'Course to Archive',
            category: 'Initiation',
            price: 33,
            isArchived: false
        });
        course = await course.save();

        const res = await chai.request(server)
            .patch('/api/courses/archive/' + course.id);

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('isArchived').eql(true);
    });
});
describe('GET /api/courses/arch/archived', () => {
    it('should list archived courses with pagination', async () => {
        const res = await chai.request(server).get('/api/courses/arch/archived').query({ page: 1, pageSize: 5 });
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('data').which.is.an('array');
    });
});
describe('GET /api/courses/details/:courseId/teachers', () => {
    it('should get assigned teachers for a course', async () => {
        const course = new Course({ title: 'Test Course for Teachers', category: 'Initiation', price: 33});
        await course.save();

        const res = await chai.request(server).get(`/api/courses/details/${course._id}/teachers`);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('assignedTeachers').which.is.an('array');
    });
});


describe('GET /api/courses/popular', () => {
    it('should get the top three courses', async () => {
        const res = await chai.request(server).get('/api/courses/popular');
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.length.should.be.at.most(3);
    });
});
describe('GET /api/courses/teachers-stats', () => {
    it('should get statistics for teachers', async () => {
        const res = await chai.request(server).get('/api/courses/teachers-stats');
        res.should.have.status(200);
        res.body.should.be.a('object');
    });
});
describe('GET /api/courses/students-stats', () => {
    it('should get statistics for students', async () => {
        const res = await chai.request(server).get('/api/courses/students-stats');
        res.should.have.status(200);
        res.body.should.be.a('object');
    });
});


/*
after(async () => {
    await mongoose.connection.db.collection('courses').deleteMany({});
});
*/

