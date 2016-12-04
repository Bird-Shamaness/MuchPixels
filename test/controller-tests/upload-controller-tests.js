const {
    expect
} = require('chai');
const sinon = require('sinon');

var httpMocks = require('node-mocks-http');

const controller = require('../../controllers/upload-controller')(null, null);

describe('Upload controller tests', () => {
    it('should redirect to home if not logged in', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/upload'
        });

        var response = httpMocks.createResponse();

        controller.getPhotoUpload(request, response);

        var redirectUrl = response._getRedirectUrl();

        expect(redirectUrl).to.eql('/');
    });

    it('should render upload view when req has user', () => {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: '/upload',
            user: "pesho"
        });

        var response = httpMocks.createResponse();

        controller.getPhotoUpload(request, response);

        var renderedView = response._getRenderView();

        expect(renderedView).to.eql('upload');
    });
});