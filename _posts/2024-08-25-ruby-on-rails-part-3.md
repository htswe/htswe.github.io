---
title: "Ruby on Rails (part 3)"
header:
  image: https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
categories:
  - Tech
tags:
  - Learning
  - Ruby on Rails
---

## Controllers and CRUD

Rails helper also has view creation.

```ruby
<%= form_for(@subject) do |f| %>
    <% f.text_field(:name) %>
    <% f.text_field(:position) %>
    <% f.text_field(:visible) %>

    <% f.submit("Create Subject") %>
<% end %>
```

By using `form_for` helper, it will automatically adjust if it is new record or updating existing record when `submit` is executed.

Likewise, the text fields will be auto populated if it is existing records.

## Strong params to regulate input

Mass assignment is the term for passing a hash of values, usually form parameters to an object that's going to be assigned to the object's attributes. `New`, `create`, and `update` are the primary methods that use mass assignment, but there are a few others as well. In each one of these cases, you'll see that we're taking a hash of values, and we're essentially just dumping them into the object and asking the object to assign all of the attributes based on that hash. That's what mass assignment is.

Rails is making our lives much easier by allowing us to assign values to this object all at once, instead of having to assign them one by one. Unfortunately, this convenience also introduces a major security issue. The attacker will add sensitive parameter like password to overwrite.

To counter this, rails introduces required parameter and permissable parameters.

```ruby
params.require(:subject).permit(:name, :position, :visible)
```

## Partials and Helpers

To better organize code, rails also provide the partials and helpers.

```ruby
<%= form_for(@subject, :url => subjects_path, :method => 'post') do |f| %>

    <%= render(:partial => 'form', :locals => {:f => f}) %>

    <div class="form-buttons">
        <%= f.submit("Create Subject") %>
    </div>
<% end %>
```

```ruby
# /views/subjects/_form.html.erb

<table summary="Subject form fields">
    <tr>
        <th>Name</th>
        <td><%= f.text_field(:name) %></td>
    </tr
    ...
</table>
```

This `_form.html.erb` can be reused in both new or edit form.

## More readings

[api](https://api.rubyonrails.org)

[guide](https://guides.rubyonrails.org)
