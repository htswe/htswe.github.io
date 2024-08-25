---
title: "Ruby on Rails (part 2)"
header:
  image: https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
categories:
  - Tech
tags:
  - Learning
  - Ruby on Rails
---

## Models and ActiveRecord

### ActiveRecord and ActiveRelation

ActiveRecord is the rails implementation of active record design pattern. Instead of database row, it retrieves and manipulates data as objects.

It also understands the structure of the table, knows how to create, read, update and delete rows as objects.

```ruby
user = User.new
user.first_name = "John"
user.save # SQL INSERT

user.last_name = "Doe"
user.save # SQL UPDATE since it knows there is already row exists

user.destroy # SQL DELETE
```

ActiveRelation is also known as "Arel". It simplifies the generation of complex database queries. It is chainable and do not execute until needed.

```ruby
users = User.where(first_name: "John") # SQL not yet execute
users = users.order("last_name ASC").limit(5) # chain it to previous query

users.each {|user|
    ... # SQL is now executed because it is needed by now
}
```

### Rails console

We could use rails console to interact with rails.

```shell
rails console -e development
rails console # default environment is development
rails c #shorthand
```

Note: rails comes with `irb` (interactive ruby), but `irb` command alone will not load with your project.

### Create records using ActiveRecord

There are 2 ways that you could create record.

1. instantiate -> set values -> save
2. create

Using approach 1,

```shell
$ rails console
> subject = Subject.new(:name => 'First Subject')
> subject.position = 1
> subject.save
```

Using approach 2,

```shell
$ rails console
> subject = Subject.create(:name => 'Second Subject', :position = 2)
```

### Update records using ActiveRecord

There are 2 ways that you could update record.

1. find -> set values -> save
2. find -> update

Using approach 1,

```shell
$ rails console
> subject = Subject.find(1) # find by id or primary key
> subject.name = "New Subject"
> subject.save
```

Using approach 2,

```shell
$ rails console
> subject = Subject.find(2) # find by id or primary key
> subject.update(:name => "New Subject", :position => 2)
```

### Delete records using ActiveRecord

1. find -> destroy

```shell
$ rails console
> subject = Subject.find(2) # find by id or primary key
> subject.destroy
```

### Find records using ActiveRecord

Primary Key Finder: `Subject.find(2)` will return an object or an error.

Condition: `Subject.where(:visible => true)` will help to filter.

Note: for dynamic data (eg. user's input), be careful.

```shell
User.where("first_name LIKE #{@query}") # SQL Injection can happen
User.where(["first_name LIKE ?", @query]) # SQL sanitization
```

If you want to find first, `Subject.where(:visible => true).first`
It will return an object or `nil`

Other conditions would be

```shell
Subject.order('position ASC')
Subject.limit(20)
Subject.offset(100) # skip 100 results
```

### One-to-many assocations

```ruby
class Subject
    has_many :pages
end

class Page
    belongs_to :subject
end
```

After linking between two tables, we can then use it:

```shell
subject.pages
subject.pages << page
subject.pages.delete(page)
subject.pages.empty?
subject.pages.size
```

## CRUD

For most web application, we will have Create, Read, Update and Delete operations.

To create a controller,

```ruby
rails generate controller Subjects
```

This will create the controller under `app/controllers/subjects_controller.rb`.

```ruby
class SubjectsController < ApplicationController

    def index
        # list of records
    end

    def show
        # a single record
    end

    def new
        # display new form
    end

    def create
        # process new form
    end

    def edit
        # display edit form
    end

    def update
        # process edit form
    end

    def delete
        # display delete form
    end

    def destroy
        # process delete form
    end
end
```

These methods will be linked to the `routes.rb` under `config`.

```ruby
Rails.application.routes.draw do

    get 'subjects/index'
    get 'subjects/show'
    get 'subjects/new'
    get 'subjects/edit'
    get 'subjects/delete'

end
```

## REST

REST stands for Representational state transfer. Using REST, we are going to perform state transformations upon resources.

Here are some REST HTTP verbs.
`GET` - Retrieve items from resource
`POST` - Create new item in resource
`PATCH` - Update existing item in resource
`DELETE` - Delete existing item in resource

### Resourceful routes

In part 1, we discussed about 3 other routes and now, we are going to look at resourceful routes. It is the combination of RESTful and CRUD and it is Rails default.

It is used by most professional Rails developers and optimized for REST.

| HTTP Verb | URL | Action | Description |
| --------- | --- | ------ | ----------- |
| GET | /subjects | index | show all items |
| GET | /subjects/:id | show | show item with :id |
| GET | /subjects/new | new | show new form |
| POST | /subjects | create | create an item |
| GET | /subjects/:id/edit | edit | show edit form for item with :id |
| PATCH | /subjects/:id | update | update item with :id |
| GET | /subjects | delete | show delete form for item with :id |
| DELETE | /subjects | destroy | delete item with :id |

To enable this behavior, rails make it easy. To get it,

```rub
# config/routes.rb

resources :subjects
```

### Omitting resourceful routes

If you don't want to use the default, you could also modify:

```rub
# config/routes.rb

# all except show action
resources :subjects, :except => [:show]

# only these
resources :users, :only => [:index, :show]

# additional route
resources :subjects do

    member do
        get :delete # GET /subjects/:id/delete
    end

    collection do
        get :export # GET /subjects/export
    end

end

```

### Using resourceful URL helper

```ruby
<%= link_to('All Subjects', subjects_path) %>
<%= link_to('Show Subject', subjects_path(@subject.id) ) %>
<%= link_to('Edit Subject', edit_subjects_path(@subject) ) %>
```

This will help to shorten in format.

```ruby
{ :controller => `subjects`, :action => `show`, :id => 5 }

# can be shorten as
subject_path(5)
```

| HTTP Verb | URL | Action | Helper |
| --------- | --- | ------ | ----------- |
| GET | /subjects | index | subjects_path |
| GET | /subjects/:id | show | subject_path(:id) |
| GET | /subjects/new | new | new_subject_path |
| POST | /subjects | create | subjects_path |
| GET | /subjects/:id/edit | edit | edit_subject_path(:id) |
| PATCH | /subjects/:id | update | subject_path(:id) |
| GET | /subjects/:id/delete | delete | delete_subject_path(:id) |
| DELETE | /subjects/id | destroy | subject_path(:id) |
