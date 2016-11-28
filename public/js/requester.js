const requester = {
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
  }
};
