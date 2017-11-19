const ssh2 = jest.genMockFromModule('ssh2');

ssh2.Client = class Client {
  constructor() {
    this.end = jest.fn();
    this.exec = jest.fn((command, callback) => {
      callback({}, new Stream())
    });
  }
  on(event, callback) {
    callback();
    return this;
  }

  connect(config) {
    return this;
  }
}

class Stream {
  on(event, callback) {
    callback();
  }
}

module.exports = ssh2;
