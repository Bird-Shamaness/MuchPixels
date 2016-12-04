 /* globals require function*/

 $(function() {
     let socket = io();
     let $messageForm = $('#messageForm');
     let $message = $('#message');
     let $chat = $('#chat');
     let $messageArea = $('#messageArea');
     let $userFormArea = $('#userFormArea');
     let $userForm = $('#userForm');
     let $users = $('#users');
     let $username = $('#username');

     $messageForm.submit(function(e) {
         e.preventDefault();
         socket.emit('send message', $message.val());
         $message.val('');
     });

     socket.on('new message', function(data) {
         $chat.append('<div class="well"><strong>' + data.user + '</strong>: ' + data.msg + '</div>');
     });

     $userForm.submit(function(e) {
         e.preventDefault();
         socket.emit('new user', $username.val(), function(data) {
             if (data) {
                 $userFormArea.hide();
                 $messageArea.show();
             }
         });
         $username.val('');
     });

     socket.on('get users', function(data) {
         let html = '';
         for (i = 0; i < data.length; i++) {
             html += '<li class="list-group-item"><div id="online-dot"></div>' + data[i] + '</li>';
         }
         $users.html(html);
     });
 });