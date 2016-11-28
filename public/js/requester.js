const requester = {
  init() {
    $.ajaxSetup({
      headers:
            { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
    });
  },
  get(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        method: 'GET',
        success(response) {
          resolve(response);
        }
      });
    });
  },
  post(url, body) {
    const comment = {
      content: body
    };

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        data: JSON.stringify(comment),
        contentType: 'application/json',
        method: 'POST',
        success(response) {
          resolve(response);
        }
      });
    });
  }
};
