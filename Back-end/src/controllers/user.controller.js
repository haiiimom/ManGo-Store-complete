const UserModel = require('../models/account.models/user.model');

// api: get user
const getUser = async (req, res, next) => {
  try {
    //nếu kiểm tra xác thực sai thì trả về lỗi
    if (!res.locals.isAuth)
      return res
        .status(400)
        .json({ message: 'Không thể lấy thông tin user', error });
    // lấy thông tin người dùng -> gửi khách hàng
    const { _id } = req.user;
    const infoUser = await UserModel.findOne({ accountId: _id }).populate({
      path: 'accountId',
      select: 'email -_id',
    });

    //gửi thông tin người dùng ngoại trừ _id
    const infoUserSend = {
      ...infoUser._doc,
      email: infoUser.accountId.email,
      accountId: null,
    };
    res.status(200).json({ user: infoUserSend });
  } catch (error) {
    res.status(400).json({ message: 'Không thể lấy thông tin user', error });
  }
};

// api: update user
const putUpdateUser = async (req, res, next) => {
  try {
    const { userId, value } = req.body;
    if (await UserModel.exists({ _id: userId })) {
      const response = await UserModel.updateOne({ _id: userId }, { ...value });
      if (response) {
        return res.status(200).json({ message: 'success' });
      }
    } else {
      return res.status(409).json({ message: 'Tài khoản không tồn tại' });
    }
  } catch (error) {
    return res.status(409).json({ message: 'Cập nhật thất bại' });
  }
};

//export
module.exports = {
  getUser,
  putUpdateUser,
};
