const DaysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const Months = "JanFebMarAprMayJunJulAugSepOctNovDec";

function convert(input, today) {
    input += "";
    input = input.split(' ');

    //Years
    let year = input[3];
    let currentYear = today.getFullYear();
    let passed = currentYear - year;
    if (passed > 0) {
        if (passed == 1) {
            return currentYear - year + ' year ago';
        }
        return currentYear - year + ' years ago';
    }

    //Months
    let month = input[1];
    month = Months.indexOf(month) / 3 + 1;
    let currentMonth = today.getMonth() + 1;

    passed = currentMonth - month;
    if (passed > 0) {
        if (passed == 1) {
            //TODO Leap year
            let daysPassed = (DaysInMonths[month - 1] - input[2]) + today.getDate();

            if (daysPassed < 7) {
                if (daysPassed == 1) {
                    return "1 day ago";
                }
                return daysPassed + ' days ago';
            }

            let weeksPassed = daysPassed / 7;
            weeksPassed = Math.round(weeksPassed);
            if (weeksPassed == 1) {
                return "1 week ago";
            }
            return weeksPassed + " weeks ago";

        }
        return currentMonth - month + ' months ago';
    }

    //Days
    let days = input[2];
    let currentDay = today.getDate();
    let daysPassed = currentDay - days;

    if (daysPassed > 0) {
        if (daysPassed < 7) {
            if (daysPassed == 1) {
                return "1 day ago";
            }
            return daysPassed + ' days ago';
        }

        let weeksPassed = daysPassed / 7;
        weeksPassed = Math.round(weeksPassed);
        if (weeksPassed == 1) {
            return "1 week ago";
        }
        return weeksPassed + " weeks ago";
    }

    //Hours
    let time = input[4];
    time = time.split(':');

    let hour = time[0];
    let currentHour = today.getHours();
    passed = currentHour - hour;
    if (passed > 0) {
        if (passed == 1) {
            return currentHour - hour + ' hour ago';
        }
        return currentHour - hour + ' hours ago';
    }

    //Minutes
    let minute = time[1];
    let currentMinute = today.getMinutes();
    passed = currentMinute - minute;
    if (passed > 0) {
        if (passed == 1) {
            return currentMinute - minute + ' minute ago';
        }
        return currentMinute - minute + ' minutes ago';
    }

    //Seconds
    let second = time[2];
    let currentSeconds = today.getSeconds();
    passed = currentSeconds - second;
    if (passed > 0) {
        if (passed == 1) {
            return currentSeconds - second + ' second ago';
        }
        return currentSeconds - second + ' seconds ago';
    }

    return 'just now';
}

module.exports.convertTime = (date, today) => new Promise((resolve, reject) => {
    const convertedTime = convert(date, today);

    resolve(convertedTime);
});

module.exports.convertMultiple = (photos, today) => new Promise((resolve, reject) => {
    let convertedPhotos = [];

    for (photo of photos) {
        convertedPhotos.push({
            id: photo.id,
            title: photo.title,
            author: photo.author,
            date: convert(photo.date, today),
            url: photo.url,
            description: photo.description,
            upvotes: photo.upvotes
        });
    }

    resolve(convertedPhotos);
});

module.exports.convertMultipleComments = (comments, today) => new Promise((resolve, reject) => {
    let convertedComments = [];

    for (comment of comments) {
        convertedComments.push({
            canDeleteComment: comment.canDeleteComment,
            date: convert(comment.comment.date, today),
            user: comment.comment.user,
            content: comment.comment.content
        });
    }

    resolve(convertedComments);
});