const init = () => {
  const pathname = window.location.pathname.split('/');
  const id = pathname[pathname.length - 1];

  const spinner = '<i class="fa fa-spinner" aria-hidden="true"></i>';

  $('.vote').click(() => {
    $('.voting').html(spinner);

    const url = `/api/photo/${id}/upvote`;

    requester.get(url)
    .then((response) => {
      $('body').html(response);
    });
  });

  $('.unvote').click(() => {
    $('.voting').html(spinner);
    const url = `/api/photo/${id}/unvote`;

    requester.get(url)
    .then((response) => {
      $('body').html(response);
    });
  });
};

