const chai = require('chai');
const chaiHttp = require('chai-http');
// const app = require("../app.js");
const { app, startServer, stopServer } = require("../app"); 
const  Course = require('../models/course');
const {expect} = require("chai");
const { connection} = require("mongoose");
const { connect } = require("../config/mongoose.js");
const mongoose = require("mongoose");

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
            const res = await chai.request(app).get('/api/courses/' + course._id);
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

        const res = await chai.request(app)
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
        chai.request(app)
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
        chai.request(app)
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

        const res = await chai.request(app)
            .patch('/api/courses/archive/' + course.id);

        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('isArchived').eql(true);
    });
});
after(async () => {
    await mongoose.connection.close();
});
/*
after(async () => {
    await mongoose.connection.db.collection('courses').deleteMany({});
});
*/

