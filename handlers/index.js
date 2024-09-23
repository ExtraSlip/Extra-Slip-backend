const success = (res, response) => {
  response.data = response.data ? response.data : [];
  response.status = response.status ?? true;
  return res.status(200).json(response);
};

const error = (res, error) => {
  let statusCode = error.statuscode ? error.statuscode : 400;
  let err = error.error ? error.error : [];
  error = { status: false, msg: error.msg, error: err };
  return res.status(statusCode).json(error);
};

module.exports = {
  success,
  error,
};
