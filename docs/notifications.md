# Notifications

This is a global notification feature for the entire app. Behind the scenes it
consists of different parts, but in order to use it you will most likely just
call the actions from your different containers.

In the default implementation, the
[notification messages from Bulma](http://bulma.io/documentation/elements/notification/)
are used and the naming is consistent. Notification are overlaying the entire
layout, but the appearance can be changed anytime in the component.


## Notify Actions

### Showing

The showing actions names are consistent with the class names from Bulma. The
messages will disapear on their own after a defined timeout (can be found in the
container).

These showing actions should be called from containers only.

All actions take exactly one argument, the string you want to show. For `error`
you can also pass in an error object.

#### `this.$actions.notify.primary(content)`

#### `this.$actions.notify.info(content)`

#### `this.$actions.notify.success(content)`

#### `this.$actions.notify.warning(content)`

#### `this.$actions.notify.danger(content)`

#### `this.$actions.notify.log(content)`

This is one of two actions that has no complimenting class name. When calling
`log`, no class name will be set to the notification message.

#### `this.$actions.notify.error(string or object)`

This is an proxy for `danger`. You can pass either a string (to work exacly like
`danger`), or a error object you would receive from callbacks. This error object
tries to find error messages in the following places:

- err.message
- err.response.body.message

If it can't be found there, and no string is defined, it will default to a
`Error` string.

### Removing

#### `this.$actions.notify.remove(message object)`

This action will remove the message from the state and thus from the screen. It
accepts a full message object to obtain the index. You will likely not use this
action since it is already used internally for the close click event or timeout.


## Notify Component

This is the visual component to the notifications and can be found in the
`./client/components/notify` folder. The component itself is wrapped in a
container (see below) which is included in the layout component which can
be found at `./client/components/layout`.

The current styling will overlay messages over the content, but can be changed
easily.


## Notify Container

The container will handle the data flow, e.g. watching the state (see below) and
pass the array of notifications to the component. It is also responsible to
create the timeouts that will remove notifications after a certain delay (which
can be defined in the containers `$data.timeout`), as well as handling a close
click event.


## Notify State

The notifications are stored in a array called `notifyMessages` in
`./client/$state`. The notification itself is a object with a `type` and
`content` fields:

    { type: 'primary', content: 'primary message' }

The `type` correlates with the class names and action function names. The
`content` is the string you want to show in the notification message.
