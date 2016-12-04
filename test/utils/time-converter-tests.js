const {expect} = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const TimeConverter = require('../../utils/time-converter');

describe('Time Converter', () => {

    it('Should return years ago when date is more than 1 year older', (done) => {

        let date = 'Wed Nov 30 2014 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('2 years ago');
                done();
            });
    });

    it('Should return 1 year ago when date is exactly 1 year older', (done) => {

        let date = 'Wed Nov 30 2015 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('1 year ago');
                done();
            });
    });

});
