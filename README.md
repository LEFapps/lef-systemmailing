# lef-systemmailing

## Settings

Set `{"systemMailsFrom": "Example <no-reply@example.com>"}` in your Meteor settings file.

## Example usage

```JSX
import { RegisterEmail, GenerateEmail } from "meteor/lef:systemmailing";
import { Translator } from "meteor/lef:translations";

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
        language: user.profile.language || translator.getCurrentLanguage()
      }).subject({ user }),
    html: (user, url) =>
      new GenerateEmail({
        _id: "resetPassword",
        language: user.profile.language || translator.getCurrentLanguage()
      }).html({ user, url })
  }
};
```

## Installation

Git clone this repository into your project `packages` folder and `meteor add lef:translations`.
