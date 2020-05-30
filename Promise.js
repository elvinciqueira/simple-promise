class PromiseSimple {
  constructor(executionFunction) {
    this.promiseChain = [];
    this.handleError = () => { };

    this.onResolve = this.onResolve.bind(this);
    this.onReject = this.onReject.bind(this);

    executionFunction(this.onResolve, this.onReject);
  }

  then(onResolve) {
    this.promiseChain.push(onResolve);

    return this;
  }

  catch(handleError) {
    this.handleError = handleError;

    return this;
  }

  onResolve(value) {
    let storadValue = value;

    try {
      this.promiseChain.forEach(nextFunction => {
        storadValue = nextFunction(storadValue);
      });
    } catch (error) {
      this.promiseChain = [];

      this.onReject(error);
    }
  }

  onReject(error) {
    this.handleError(error);
  }
}

fakeApiBackend = () => {
  const user = {
    username: 'arthur',
    favoriteNumber: 42,
    profile: 'https://gitconnected.com/arthur'
  }

  if (Math.random() > .05) {
    return {
      data: user,
      statusCode: 200,
    };
  } else {
    const error = {
      statusCode: 400,
      message: 'Could not found user',
      error: 'Not found',
    };

    return error;
  }
};

const makeApiCall = () => {
  return new PromiseSimple((resolve, reject) => {
    setTimeout(() => {
      const apiResponse = fakeApiBackend();

      if (apiResponse.statusCode >= 400) {
        reject(apiResponse);
      } else {
        resolve(apiResponse.data);
      }
    }, 5000);
  });
};

makeApiCall()
  .then(user => {
    console.log('The first .then()');

    return user;
  })
  .then(user => {
    console.log(`User ${user.username}'s favorite number is ${user.favoriteNumber}`);

    return user;
  })
  .then(user => {
    console.log('The previous .then() told you the favoriteNumber')

    return user.profile;
  })
  .then(profile => {
    console.log(`The profile URL is ${profile}`);
  })
  .then(() => {
    console.log('The last then()');
  })
  .catch(error => {
    console.log(error.message);
  })