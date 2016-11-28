$(document).ready(() => {
  const pathname = window.location.pathname.split('/');
  const id = pathname[pathname.length - 1];

  const spinner = '<i class="fa fa-spinner" aria-hidden="true"></i>';

  $('.vote').click(() => {
    $('.voting').html(spinner);
    $.ajax({
      url: `/api/photo/${id}/upvote`,
      method: 'GET',
      success(response) {
        $('body').html(response);
      }
    });
  });

  $('.unvote').click(() => {
    $('.voting').html(spinner);
    $.ajax({
      url: `/api/photo/${id}/unvote`,
      method: 'GET',
      success(response) {
        $('body').html(response);
      }
    });
  });
});
