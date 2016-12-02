const {
    expect
} = require('chai');
const sinon = require('sinon');

var httpMocks = require('node-mocks-http');

const controller = require('../../controllers/error-controller');

describe('Error controller tests', () => {
    it('should render non existing user view', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/error/non-existing-user'
        });

        var response = httpMocks.createResponse();

        controller.getNonExistingUser(request, response);

        var renderedView = response._getRenderView();

        expect(renderedView).to.eql('errors/non-existing-user');
    });

    it('should render non existing photo view', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/error/non-existing-photo'
        });

        var response = httpMocks.createResponse();

        controller.getNonExistingPhoto(request, response);

        var renderedView = response._getRenderView();

        expect(renderedView).to.eql('errors/non-existing-photo');
    });
});