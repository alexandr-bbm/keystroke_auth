# Keystroke authentication remote web-service

## What's that?

This is a repository of free web-service for authentication security improvement by analyzing the keystrokes dynamics.
It contains core backend server code under `keystroke_auth_server` and example of its usage under `client_example`.

You can try it live [here](http://alexandrbbm.pythonanywhere.com/).
To test the service we suggest register (first form) with the simplest password you use and know well, and that you can share
with your friend. Try to use the second form for authentication. Then, tell your friend your credentials and ask him to 
authenticate through the second form. This is a simulation of password compromising when malefactor can't authenticate 
even if he knows user credentials.

You can also try to login with my credentials: bbm | 222123. Please, do not update this user's keystroke, use second form.

## About the service
The service provides remote HTTP methods to register user by saving keystroke dynamics of typing his 
login and password and a method to authenticate him afterwards. Service can be easily integrated with existing 
authentication systems of any application (web, desktop, and mobile) to enhance its security level.

The service is written using Django framework (Python). Demonstration page is written with usage of JavaScript.

Features:

* Easily integrated
* No need for sending password values
* Helper JavaScript Module (`client_example/static/keyStrokeAuthService.js`) for gathering key events needed for service.
* API documentation

**Please note:**

* Validity of the password value should be checked at your side (this service does not replace authentication system,
but add additional security layer for it) 
* Service is in pre-alpha stage and **is not ready for real-world usage yet**, because register methods are not protected.

## API Documentation

Please, find request JSON schema for authentication and registration methods below.

```typescript
interface RequestJSONSchema {
    login: string;
    login_timestamps: TimeStamps; // see below
    password_timestamps: TimeStamps;
}

interface TimeStamps {
    flight_times: Array<number>,
    dwell_times: Array<number>,
}
```

To have request data be populated automatically, please see `keyStrokeAuthService.js` usage in `clientPageScript.js`
under `client_example/static` directory.


### Register method 

Url: `http://alexandrbbm.pythonanywhere.com/server/authenticate_keystroke/`

Possible `status` field values of the JSON response:

`need_more_sample` - need to type credentials again.

`success` - keystroke successfully created.

`error` - error happened, see `message` field.

`invalid_keystroke` - keystroke can't be accepted due to long pauses between buttons hold.

### Authentication method

url: `http://alexandrbbm.pythonanywhere.com/server/authenticate_keystroke/`

Possible `status` field values of the JSON response:

`success` - success result of request processing, please see `message` field for authentication result.

`error` - error happened, see `message` field.

`invalid_keystroke` - keystroke can't be accepted due to long pauses between buttons hold.
