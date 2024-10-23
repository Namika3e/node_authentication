const responseHandler = {
  clientError: (res, message) => {
    res.status(400).json({
      status: "failure",
      message: message,
    });
  },

  success: (res, data) => {
    res.status(200).json({
      status: "success",
      data: data,
      dataCount: count,
    });
  },

  created: (res) => {
    res.status(201).json({
      status: "success",
      message: "Operation completed successfully",
    });
  },

  ok: (res) => {
    res.status(204).json({
      status: "success",
    });
  },

  unauthorized: (res, message) => {
    res.status(401).json({
      status: "failure",
      message,
    });
  },

  notfound: (res, message) => {
    res.status(404).json({
      status: "failure",
      message,
    });
  },

  unprocessable: (res, message) => {
    res.status(422).json({
      status: "failure",
      message,
    });
  },

  forbidden: (res, message) => {
    res.status(403).json({
      status: "failure",
      message,
    });
  },
  serverError: (res) => {
    res.status(500).json({
      status:"failure",
      message:"Something went wrong"
    })
  }
};

module.exports =  responseHandler ;
