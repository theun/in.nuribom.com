# -*- coding: utf-8 -*- 

<%inherit file="layout.mako" />

<%
from myproject.views import log
from myproject.models import Team
%>

<%def name="team_row(object, id=None, depth=0)">
    <ul>
        <li>
            <div>
                % for d in range(depth):
                <div class="tree-node-icon"></div>
                % endfor
                <div class="tree-leaf-icon ${'tree-subitem-icon' if object.children else ''}"></div> 
                <div id="${id}" class="list-item">
                    <span>${object.name}</span>
                    <span style="color:darkblue;">
                    (
                    % if object.leader:
                    ${object.leader.name} :
                    % endif
                    ${object.count()} 명
                    )
                    </span>
                </div>
            </div>
            % if object['children']:
                % for t in object['children']:
                ${team_row(t, t.id, depth+1)}
                % endfor
            % endif
        </li>
    </ul>
</%def>

<link rel="stylesheet" href="/static/stylesheets/admin.css" media="screen" type="text/css" />

<div class="navbar">
    <div class="navbar-inner">
        <a class="brand" id="group-name" href="#">조직도</a>
    </div>
</div>

<div id="content-body">
    <div id="team">
        % for team in teams:
            % if not team.parents:
            ${team_row(team, id=team.id, depth=0)}
            % endif
        % endfor
    </div>
</div>
<script>
function viewTeam() {
    $(location).attr("href", "/team/" + $(this).prop("id"))
}
$(document).ready(function() {
    $(".list-item").click(viewTeam);
});
</script>
