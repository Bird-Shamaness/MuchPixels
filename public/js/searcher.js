 const initSearcher = () => {
     $('#search-photos').click(() => {
         var pattern = $('#pattern').val();
         if (pattern.length > 0) {
             var url = `/api/search/photos/${pattern}`;

             requester.get(url)
                 .then(response => {
                     $('#results').html(response);
                 });
         }
     });

     $('#search-users').click(() => {
         var pattern = $('#pattern').val();
         if (pattern.length > 0) {
             var url = `/api/search/users/${pattern}`;

             requester.get(url)
                 .then(response => {
                     console.log(response);
                     $('#results').html(response);
                 });
         }
     });
 };