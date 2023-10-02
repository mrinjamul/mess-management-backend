function maskUser(user) {
  const usr = {
    _id: user._id,
    id: user.id,
    fullName: user.fullName,
    year: user.year,
    mobile: user.mobile,
    advance: user.advance,
    role: user.role,
    level: user.level,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  return usr;
}

module.exports = { maskUser };
