# -*- coding: utf-8 -*- 
<%inherit file="layout.mako"/>

<form id="login" class="login-form" accept-charset="UTF-8" action="${url}" method="post">
  <input name="utf8" type="hidden" value="&#x2713;" />
  <input name="came_from" type="hidden" value="${came_from}" />
  % if activate == "REQUESTED":
  <input name="login" type="hidden" value="${login}" />
  <legend>암호등록: ${login}</legend>
  <div class="control-group">
    <label class="control-label" for="password">암호</label>
    <div class="controls">
        <input autocomplete="disabled" class="text" id="password" name="password" style="width: 18em;" tabindex="1" type="password" value="" placeholder="Password" />
    </div>
  </div>
  <div class="control-group">
    <label class="control-label" for="confirm_password">암호 재입력</label>
    <div class="controls">
      <input autocomplete="disabled" class="text" id="confirm_password" name="confirm_password" style="width: 18em;" tabindex="2" type="password" value="" />
    </div>
  </div>
  <div class="control-group">
    <div class='controls'>
      <button type="submit" class="btn" id="register" name="commit" tabindex="3">등록</button>
    </div>
  </div>
  % else:
    <legend>로그인</legend>
    <div class="group-center">
        <div class="controls">
            <label for="login_field">사용자 아이디</label>
            <input type="text" autocapitalize="off" id="login_field" name="login" tabindex="1" placeholder="아이디">
        </div>
        <div class="controls">
            <label for="password">비밀번호</label>
            <input type="password" autocomplete="disabled" id="password" name="password" tabindex="2" placeholder="암호">
        </div>
        <div class="form-inline">
            <button name="commit" tabindex="3" type="submit" class="btn inline">로그인</button>
            <label class="checkbox">
                <input type="checkbox" name="PersistentCookie" id="PersistentCookie" value="yes" checked="checked"> 로그인 상태 유지
            </label>
        </div>
    </div>
  % endif
</form>

<script>
$(document).ready(function() {
    $(".formbody input").first().focus();
    % if activate == "REQUESTED":
    $("#register").click(function() {
        if ($("#password").val() != $("#confirm_password").val()) {
            alert("암호를 잘못 입력하였습니다.");
            return false;
        } 
    });
    % else:
    
    % endif
});
</script>