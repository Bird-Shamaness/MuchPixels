 const initPager = () => {
   $(window).scroll(() => {
       if ($(window).scrollTop() + $(window).height() == $(document).height()) {
           const pathname = window.location.pathname.split('/');
           const page = pathname[pathname.length - 1];
           const type = pathname[pathname.length - 2];

           const url = `/api/${type}/${page}`;

           requester.get(url)
                 .then((response) => {
                   $('body').html(response);
                   history.pushState(null, '', +page + 1);
                 });
         }
     });

 };
