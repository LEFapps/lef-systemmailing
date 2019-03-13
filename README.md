# lef-systemmailing

## Settings

Set `{"systemMailsFrom": "Example <no-reply@example.com>"}` in your Meteor settings file.

## Example usage

```JSX
import { RegisterEmail, GenerateEmail } from "meteor/lef:systemmailing";

RegisterEmail({
  _id: "resetPassword",
  params: {
    firstname: "user.profile.firstname",
    lastname: "user.profile.lastname",
    url: "url"
  }
});

const translator = new Translator();

Accounts.emailTemplates = {
  resetPassword: {
    from: () => new GenerateEmail({ _id: "resetPassword" }).from(),
    subject: user =>
      new GenerateEmail({
        _id: "resetPassword",
        language: user.profile.language || 'nl'
      }).subject({ user }),
    html: (user, url) =>
      new GenerateEmail({
        _id: "resetPassword",
        language: user.profile.language || 'nl'
      }).html({ user, url })
  }
};
```

```JSX
import { RegisterEmail, GenerateEmail } from 'meteor/lef:systemmailing'
import { Email } from 'meteor/email'

RegisterEmail({
  _id: 'newNotifications',
  params: {
    name: 'user.profile.name',
    totalNotifications: 'notifications.total'
  }
})

const notifications = getSome()
users.map(user => {
  const email = new GenerateEmail({
    _id: 'newNotifications',
    language: user.profile.language || 'nl'
  })
  Email.send({
    to: user.emails[0].address,
    from: email.from(),
    subject: email.subject({ user, notifications }),
    html: email.html({ user, notifications })
  })
})
```
