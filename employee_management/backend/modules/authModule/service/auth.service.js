import User from "../Model/User";

export const findUserById = async (id) => {
  return await User.findById(id).lean();
};
export const getOneUser = async (data) => {
  return await User.findOne(data).lean();
};

export const getUserList = async (data) => {
  return await User.find(data).lean();
};

export const saveUser = async (data) => {
  return await User.create(data);
};
