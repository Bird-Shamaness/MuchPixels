const {
    expect
} = require('chai');
const sinon = require('sinon');

const httpMocks = require('node-mocks-http');

const controller = require('../../controllers/home-controller');

describe('Home controller tests', () => {
    it('should render home view', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/'
        });

        var response = httpMocks.createResponse();

        controller.index(request, response);

        var renderedView = response._getRenderView();

        expect(renderedView).to.eql('home');
    });
});