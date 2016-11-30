 /* globals require function*/

 $(function() {
     const socket = io();
     const $messageForm = $('#messageForm');
     const $message = $('#message');
     const $chat = $('#chat');
     const $messageArea = $('#messageArea');
     const $userFormArea = $('#userFormArea');
     const $userForm = $('#userForm');
     const $users = $('#users');
     const $username = $('#username');

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
             html += '<li class="list-group-item">' + data[i] + '</li>';
         }
         $users.html(html);
     });
 });