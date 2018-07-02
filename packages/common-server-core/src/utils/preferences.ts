export const getCurrentPreferences = (preferencesDefaultArr, overwritePreferences) => {
  const preferencesArr = { ...preferencesDefaultArr };

  Object.keys(preferencesDefaultArr).forEach(key => {
    const overwritesSettings = Object.keys(overwritePreferences).filter(el => el.indexOf(key) !== -1);
    let newValues = {};
    overwritesSettings.forEach(item => {
      const overwriteKey = item.split('.').pop();
      newValues[overwriteKey] = overwritePreferences[item];
    });
    preferencesArr[key] = { ...preferencesDefaultArr[key], ...newValues };
  });
  return preferencesArr;
};

export const transformPrefsToArray = (preferences) => {
  const resultArr = [];
  Object.keys(preferences).forEach(key => {
    const type = key.split('.')[0];
    const findType = resultArr.find(el => el.type === type);
    if (!findType) {
      resultArr.push({
        type,
        data: [{
          name: key,
          ...preferences[key],
        }],
      });
    } else {
      findType['data'].push({
        name: key,
        ...preferences[key],
      });
    }
  });
  return resultArr;
};
