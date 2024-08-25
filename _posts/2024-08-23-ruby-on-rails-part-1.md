---
title: "Ruby on Rails (part 1)"
header:
  image: https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
categories:
  - Tech
tags:
  - Learning
  - Ruby on Rails
---

## What is Ruby on Rails

### Introduction

Ruby on rail is made up of 2 parts.

* Ruby is an object oriented programming language, invented by Yukihiro Matsumoto in 1995.
* Ruby on Rail is an open-source web application framework, created by David Heinemeier Hansson in 2003.

Rails framework also has many default features built in, especially web security features.

### MVC architecture

The Ruby on Rails framework uses an MVC architecture. The M stands for model, the V stands for view, and the C stands for controller. The model refers to the data objects that we use. The view is the presentation layer. It's what the user sees and interacts with, the webpages, the HTML, the CSS, and the JavaScript. The controller processes and responds to user events, such as clicking on links and submitting forms. The controller will make decisions based on the request and then control what happens in response. It controls the interaction with our models and our views.

## Getting started

### Create new project

`$ rails new simple_app -d mysql`
The above command line creates a new project and configure it to use the mySQL database.

### Configure

Look for `config` directory. check out `application.rb`. `/config/initializers` is where the initialization stuffs take place, right at boot. `environment` is where we keep configuration for each environment. `database.yml` is where database configurations are stored for different environment.

### Access project from a browser

From command line: `$rails server` or `$rails s` to start the server.
From web, visit `localhost:3000`

### Rails architecture

![rail-architecture](/assets/images/rail-architecture.png){: .align-center}

### Routing

 The routes file is stored in `config/routes.rb`.

* Simple match route
* Default route
* Root route
* Resourceful route

#### Simple match route

```ruby
get "demo/index" #shorthand

match "demo/index", :to => "demo#index", :via => :get
```

we're mapping this string to the demo controller and the index action and we're going to do it using a `get` request.

### Default route

```ruby
get ':controller(/:action(/:id))'

match ':controller(/:action(/:id))', :via => :get
```

eg. `GET /students/edit/52`, it is going to `StudentsController`, `edit` action and `52` as its id.

Default route was the widely used in early version, but Resourceful route is getting more popular these days.

### Root route

```ruby
root "demo#index"
match "/", :to => "demo#index", :via => :get
```

if it matches nothing, it will match to the root.

## Controller, Views and Dynamic Content

### Render

default behavior is rendering the template matching the current controller and action.

For example, we want to have a default behavior on `hello` route

```ruby
class DemoController < ApplicationController
    layout false

    def index
    end

    def hello
    end
end
```

route is `get demo/hello`.
action is `hello` method inside `DemoController`.
view is `demo/hello.html.erb`.

if you want different template, use `render`.

```ruby
render(:template => 'demo/not_default')
render('demo/not_default') # shorthand
render('not_default') # if it is under same controller
```

### Redirect

They can also redirect or send the user to a different controller and action. Imagine this scenario, a user requests a web page that's inside a password protected area.

When you redirect, what actually happens is that rails returns a status code to the browser which looks like this.

```shell
HTTP/1.1 302 Found
Location: http://localhost:3000/demo/hello
```

The location is the new URL we want the browser to try. When browsers receive this response, they automatically make a new request for this new URL.

In rails, you could do,

```ruby
redirect_to(:controller => 'demo', :action => 'index')
redirect_to(controller: 'demo', action: 'index')
redirect_to(:action => 'index')
redirect_to('https://wikipedia.com')
```

### ERB Template

```ruby
<% code %> # execute without output
<%= code %> # execute with output
```

### Instance variable

To share the instance variable to other components in MVC architecture, use `@`.

```ruby
# DemoController
def hello
    @array = [1, 2, 3, 4, 5]
end
```

```ruby
# hello.html.erb

<% @array.times do |n| %>
    <p><%= n %></p>

```

### Link

```ruby
<%= link_to(text, target) %>
```

## Database and Migration

You can use either SQL command or Ruby migration command. If you want to test if your project is able to connect to the database as the user,

```shell
rails db:schema:dump
```

### Generate migration

```ruby
rails generate migration MigrationName
```

Another handy usecase is to generate model.

```ruby
rails generate model ModelName
```

When you generate a general migration, a new file will be created in `db/migration` directory.

```ruby
class MyMigration < ActiveRecord::Migration(6.0)

    def change
    end

end
```

`change` method consists of two methods, `up` and `down`. Ruby on Rails is smart enough to know that you are migrating up or down, therefore, it will reverse automatically according to your code inside `change` method. However, if you have different steps for `up` and `down`, you may also specify it by yourself.

```ruby
class MyMigration < ActiveRecord::Migration(6.0)

    def up
    end

    def down
    end

end
```

Here are some common methods:
`create_table`, `add_column`,
`drop_table`, `remove_column`,
`rename_table`, `rename_column`

Next, we will see the model generation.

```shell
rails generate model User first_name:string last_name:string email:string
```

This will create all necessary files for `User` model with the parameters such as `first_name`, `last_name` and `email`. It also generate the test files and model files as well.

To execute them,

```shell
$rails db:migrate
```

This will execute all the migration scripts and update the database.

### Run migration

Here are some useful rails commands.

```shell
# this will show the current status
rails db:migrate:status

# this resets to initial version
rails db:migrate VERSION=0

# this will migrate until the specified version
rails db:migrate VERSION=202408242545324
```

### Foreign key

If you want to have foreign key, we could manually edit the file with `t.belongs_to`. It is a shortcut and if you are looking for longer form, `t.integer :student_id, index: true` or `t.references :student`.

```ruby
class User < ActiveRecord::Migration[6.0]

    def change
        create_table :user do |t|
            t.belongs_to :student
            t.string :first_name
            t.string :last_name
            t.string :email
            t.timestamps
        end
    end
end
```
