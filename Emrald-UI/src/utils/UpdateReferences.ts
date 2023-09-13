export const updateReferences = (
  data: any,
  keyToFind: string,
  replacementValue: string,
) => {
  // if (data instanceof Object) {
    if (Array.isArray(data)) {
      // If the data is an array, iterate through its elements
      data.forEach((item: any) => {
        // Recursively call updateReferences on each array element
        updateReferences(item, keyToFind, replacementValue);
      });
    } else {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key === keyToFind) {
            // If the current key matches the key to find, update it
            data[key] = replacementValue;
          } else if (Array.isArray(data[key])) {
            // If the current value is an array, iterate through its elements
            data[key].forEach((item: any, index: number) => {
              // Check if the array element matches the key to find
              if (item === keyToFind) {
                // Update the array element with the replacement value
                data[key][index] = replacementValue;
              }
            });
          } else {
            // Recursively traverse nested objects
            updateReferences(data[key], keyToFind, replacementValue);
          }
        }
      }
    // }
  }

  return data;
};
