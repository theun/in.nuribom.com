# -*- coding: utf-8 -*- 
<%inherit file="layout.mako"/>

<div id="login" class="login_form">
<form accept-charset="UTF-8" action="${url}" method="post">
  <input name="utf8" type="hidden" value="&#x2713;" />
  % if activate == "REQUESTED":
  <input name="login" type="hidden" value="${login}" />
  <h1>암호등록: ${login}</h1>
  <div class="formbody">
    <label for="password">
      암호<br />
      <input autocomplete="disabled" class="text" id="password" name="password" style="width: 21em;" tabindex="1" type="password" value="" />
    </label>
    <label for="confirm_password">
      암호 재입력<br />
      <input autocomplete="disabled" class="text" id="confirm_password" name="confirm_password" style="width: 21em;" tabindex="2" type="password" value="" />
    </label>

    <label class='submit_btn'>
      <input id="register" name="commit" tabindex="3" type="submit" value="등록" />
    </label>
  </div>
  % else:
  <h1>로그인</h1>
  <div class="formbody">
    <label for="login_field">
      아이디<br />
      <input autocapitalize="off" class="text" id="login_field" name="login" style="width: 21em;" tabindex="1" type="text" />
    </label>

    <label for="password">
      암호<br />
      <input autocomplete="disabled" class="text" id="password" name="password" style="width: 21em;" tabindex="2" type="password" value="" />
    </label>

    <label class='submit_btn'>
      <input name="commit" tabindex="3" type="submit" value="로그인" />
    </label>
  </div>
  % endif
</form>
</div>

<script>
$(document).ready(function() {
    $(".formbody input").first().focus();
    $("#register").click(function() {
        if ($("#password").val() != $("#confirm_password").val()) {
            alert("암호를 잘못 입력하였습니다.");
            return false;
        } 
    });
});
</script>