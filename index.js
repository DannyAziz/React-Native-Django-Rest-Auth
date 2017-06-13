import { AsyncStorage } from 'react-native';

// Change this
const API_URL = "CHANGE THIS";

export var DjangoAuth = {
  authenticationStatus() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('auth_token').then((token) => {
        if (!token) {
          reject('No token');
        }
        // If there's a token, check against API and see if
          fetch(API_URL + 'user/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Token ' + token
            }
          })
          .then((response) => {
            response.json().then((data) => {
              if (response.ok) {
                resolve(data);
              } else {
                reject(data);
              }
            });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((err) => {
        reject(err);
      });
    });
  },
  /*
  attempts login with given username and password.
  if successful will save auth token to AsyncStorage
  */
  login(username, password) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + 'login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      })
      .then((response) => {
        console.log(response);
        response.json().then((data) => {
          if (response.ok) {
            AsyncStorage.setItem('auth_token', data.key).then(() => {
              resolve('Authenticated');
            });
          } else {
            reject(data);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
    });
  },
  /*
  This will call the logout API and if succesful will remove the auth_token.
  If there is anything else that needs to be removed once logged out do it once
  the promise has resolved
  */
  logout() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('auth_token').then((token) => {
        fetch(API_URL + "logout/", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + token
          }
        })
        .then((response) => {
          response.json().then((data) => {
            if (response.ok) {
              AsyncStorage.removeItem('auth_token').then(() => {
                resolve('Logged out!');
              });
            } else {
              reject(data);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
      });
    });
  },
  register(username, password, email, firstName, lastName) {
    return new Promise((resolve, reject) => {
      fetch(API_URL + "registration/", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password1: password,
          password2: password,
          email: email,
          first_name: firstName,
          last_name: lastName
        })
      })
      .then((response) => {
        response.json().then((data) => {
          if (response.ok) {
            AsyncStorage.setItem('auth_token', data.key).then(() => {
              resolve('Authenticated');
            });
          } else {
            reject(data);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
};
