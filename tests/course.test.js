const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../app.js");
const  Course = require('../models/course');
const {expect} = require("chai");
const { connection} = require("mongoose");
const { connect } = require("../config/mongoose.js");
const mongoose = require("mongoose");

const should = chai.should();
chai.use(chaiHttp);
before(function() {
    this.timeout(10000);
});
describe('Database Connection', function() {
    before(function(done) {
        connect().once('open', () => done()).on('error', (error) => done(error));
    });

    it('should connect to the test database', function() {
        expect(mongoose.connection.db.databaseName).to.equal('ElKindyDB_Test');
    });

});
describe('Courses', () => {
    describe('/GET/:id course', () => {
        it('it should GET a course by the given id', (done) => {
            let courseId = '65db52b1d59f029a2488b527';
            chai.request(server)
                .get('/api/courses/' + courseId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id').eql(courseId);
                    done();
                });
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
                res.body.should.be.a('array');
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



