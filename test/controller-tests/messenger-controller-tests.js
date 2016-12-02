const {
    expect
} = require('chai');
const sinon = require('sinon');

const httpMocks = require('node-mocks-http');

const controller = require('../../controllers/messenger-controller');

describe('Messenger controller tests', () => {
    it('should render messenger view', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/messenger'
        });

        var response = httpMocks.createResponse();

        controller.getMessenger(request, response);

        var renderedView = response._getRenderView();

        expect(renderedView).to.eql('messenger');
    });
});