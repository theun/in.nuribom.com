# -*- coding: utf-8 -*- 

<%inherit file="../layout.mako"/>

<%
from myproject.views import log
log.warn(vars())
%>

% if login: 
<div align="right">
  <a href="${request.route_url('blog_post')}" class="button classy first-in-line" rel="nofollow"><span>새글</span></a>
</div>
% endif

<%include file="blog_page.html" />

<div id="page_footer">
    <div class="pagination">
    % if page == 0:
      <span class="disabled"><< 이전</span>
    % else:
      <a href="${request.route_url('blog_list', page=(page-1))}"><< 이전</a>
    % endif
    % for no in range(pages):
      % if page == no:
      <span class="current">${page+1}</span>
      % else:
      <a href="${request.route_url('blog_list', page=no)}">${no+1}</a>
      % endif
    % endfor
    % if page == (pages-1):
      <span class="disabled">다음 >></span>
    % else:
      <a href="${request.route_url('blog_list', page=(page+1))}">다음 >></a>
    % endif
    </div>
</div>