import {IPreferences, IOverwritePreference, IPreferencesData, IPreferncesTransformed} from '../interfaces';

export function getCurrentPreferences<T>(preferencesDefaultArr: IPreferences<T>[], overwritePreferences: IOverwritePreference[]) {
  const preferencesArr = { ...preferencesDefaultArr };

  Object.keys(preferencesDefaultArr).forEach(key => {
    if (preferencesDefaultArr[key].overridable) {
      const overwritesSettings = Object.keys(overwritePreferences).filter(el => el.indexOf(key) !== -1);
      let newValues = {};
      overwritesSettings.forEach(item => {
        const overwriteKey = item.split('.').pop();
        newValues[overwriteKey] = overwritePreferences[item];
      });
      preferencesArr[key] = { ...preferencesDefaultArr[key], ...newValues };
    }
  });
  return preferencesArr;
}

export function transformPrefsToArray<T>(preferences: IPreferences<T>[]) {
  const resultArr: IPreferencesData<T>[] = [];
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
}
