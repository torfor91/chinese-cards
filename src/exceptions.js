// exceptions.js — классы исключений

class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

class StorageError extends AppError {
  constructor(message) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

class SessionError extends AppError {
  constructor(message) {
    super(message, 'SESSION_ERROR');
    this.name = 'SessionError';
  }
}

export { AppError, ValidationError, StorageError, SessionError };