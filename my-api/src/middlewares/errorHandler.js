// Middleware này nhận lỗi từ next(err) ở bất kỳ controller nào
// Express nhận ra đây là error middlerware vì có đúng 4 tham số
const errorHandler = (err, req, res, next) => {
    console.error(err); // log lỗi ra console để dễ debug
    res.status(500).json({
        error: "Internal Server Error"
    });
};

module.exports = errorHandler;