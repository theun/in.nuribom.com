# -*- coding: utf-8 -*- 

<%
import jsonpickle
category = request.matchdict['category']

action  = request.params['action'] if 'action' in request.params else ''
target  = request.params['target'] if 'target' in request.params else ''
message = request.session.pop_flash()
%>

% if target == 'birthday':
${ jsonpickle.encode({'birthday': str(user.birthday.date()), 'message': message}) }
% elif target == 'name':
<span id="name_value">${user.name if 'name' in user else ''}</span>
% elif target == 'mobile':
<span id="mobile_value">${user.mobile_phone if 'mobile_phone' in user else ''}</span>
% elif target == 'phone':
<span id="phone_value">${user.home_phone if 'home_phone' in user else ''}</span>
% elif target == 'phone1':
<span id="phone1_value">${user.home_phone1 if 'home_phone1' in user else ''}</span>
% elif target == 'email':
<span id="email_value">${user.email if 'email' in user else ''}</span>
% elif target == 'email1':
<span id="email1_value">${user.email1 if 'email1' in user else ''}</span>
% elif target == 'address':
<span id="address_value">${user.address if 'address' in user else ''}</span>
% elif target == 'address1':
<span id="address1_value">${user.address1 if 'address1' in user else ''}</span>
% endif