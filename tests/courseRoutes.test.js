const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../app.js");
const should = chai.should();

chai.use(chaiHttp);

describe('Courses', () => {

    describe('/GET/:id course', () => {
        it('it should GET a course by the given id', (done) => {
            let courseId = 'someCourseId';
            chai.request(server)
                .get('/course/' + courseId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(courseId);
                    done();
                });
        });
    });

});
