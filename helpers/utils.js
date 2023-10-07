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

// is it a string?
function isString(value) {
  return typeof value === "string" || value instanceof String;
}

// is it a Date?
function isDate(value) {
  return value instanceof Date;
}

// getSorter return a sort callback function
function getSorter(sortBy, orderBy) {
  return (a, b) => {
    const fieldA = a[sortBy];
    const fieldB = b[sortBy];
    if (orderBy === "asc") {
      if (isString(fieldA) || isString(fieldB)) {
        return fieldA.localeCompare(fieldB);
      } else if (!isNaN(fieldA) && !isNaN(fieldB)) {
        return fieldA - fieldB;
      } else if (isDate(fieldA) && isDate(fieldB)) {
        return new Date(fieldA) - new Date(fieldB);
      }
    } else {
      if (isString(fieldA) || isString(fieldB)) {
        return fieldB.localeCompare(fieldA);
      } else if (!isNaN(fieldA) && !isNaN(fieldB)) {
        return fieldB - fieldA;
      } else if (isDate(fieldA) && isDate(fieldB)) {
        return new Date(fieldB) - new Date(fieldA);
      }
    }
    return 0;
  };
}

module.exports = { maskUser, getSorter };
