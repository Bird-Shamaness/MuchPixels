const {expect} = require('chai');

const TimeConverter = require('../../utils/time-converter');

describe('Time Converter', () => {

    it('Should return years ago when date is more than 1 year back', (done) => {

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

    it('Should return 1 year ago when date is exactly 1 year back', (done) => {

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

    it('Should return months ago when date is more than 2 months back', (done) => {

        let date = 'Wed Oct 30 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('2 months ago');
                done();
            });
    });

    it('Should return days ago when date is more than 2 days back', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 5;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('3 days ago');
                done();
            });
    });

    it('Should return 1 week ago when date is between 6 and 13 days back', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 10;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('1 week ago');
                done();
            });
    });

    it('Should return hours ago when hour is more than 2 hours back', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 2;
            },
            getHours: function () {
                return 20;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('4 hours ago');
                done();
            });
    });

    it('Should return minutes ago when minutes are more than 2 minutes back', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 2;
            },
            getHours: function () {
                return 16;
            },
            getMinutes: function () {
                return 38;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('3 minutes ago');
                done();
            });
    });

    it('Should return 1 second ago when seconds are exactly 1 second back', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 2;
            },
            getHours: function () {
                return 16;
            },
            getMinutes: function () {
                return 35;
            },
            getSeconds: function () {
                return 16;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('1 second ago');
                done();
            });
    });

    it('Should return just now when time is the same to the second', (done) => {

        let date = 'Wed Dec 2 2016 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            },
            getMonth: function () {
                return 11;
            },
            getDate: function () {
                return 2;
            },
            getHours: function () {
                return 16;
            },
            getMinutes: function () {
                return 35;
            },
            getSeconds: function () {
                return 15;
            }
        };

        TimeConverter.convertTime(date, fakeToday)
            .then((result) => {
                expect(result).to.eql('just now');
                done();
            });
    });

    it('Should return photos with converted dates', (done) => {

        let fakeDate = 'Wed Nov 30 2014 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakePhotos = [
            {
                date: fakeDate
            },
            {
                date: fakeDate
            }
        ];

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            }
        };

        TimeConverter.convertMultiple(fakePhotos, fakeToday)
            .then((result) => {
                expect(result[0].date).to.eql('2 years ago');
                done();
            });
    });

    it('Should return comments with converted dates', (done) => {

        let fakeDate = 'Wed Nov 30 2012 16:35:15 GMT+0200 (GTB Standard Time)';

        let fakeComments = [
            {
                comment: {
                    date: fakeDate
                }
            }
        ];

        let fakeToday = {
            getFullYear : function () {
                return '2016';
            }
        };

        TimeConverter.convertMultipleComments(fakeComments, fakeToday)
            .then((result) => {
                expect(result[0].date).to.eql('4 years ago');
                done();
            });
    });

});
