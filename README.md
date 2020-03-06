
# Summary

Do you like how you can easily code and test using Expo?

With this tool you will have similar development and testing experience in **React Native but without Expo**.

**react-native-enable-debug-in-release** does the following:
- Enables **DEBUG mode** in release configuration
- Enables **Developer Menu** in release configuration
- Makes possible usage of **Fast Refresh** and **Remote Debugging** on real devices without USB connection

So you can build debug version of your application **one time**, deploy to devices (including in the cloud) and connect them to your development computer with Fast Refresh and Remote Debugging!

It is an easy tool for your CI/CD or local testing that doesn't add additional dependencies to your project.

# How to use

Go to root folder of your React Native application (where package.json is located) and run:
```
npx react-native-enable-debug-in-release
```

Alternatively, you can specify path as first argument
```
npx react-native-enable-debug-in-release ../myProduct/react-native-app/
```

# CI/CD or debugging branch

Take into account that it modifies project files in place.

It is safe to use as an additional step in your CI/CD process.

But if you are building React Native application on your local machine - revert changes when build is completed.

Alternatively, create a special branch in a code repository that you will not merge to your real production version.


# Ideas why it could be useful

- Developers with Windows or Linux environment - can build iOS application using online services and then launch application in the debug mode on own iOS devices or in the cloud
- Expo-like development - build your application in the debug mode only one time, and then see immediately any number of changes in JavaScript on real devices or emulators
- Problem is reproducible only on the devices in the cloud - you can use the debug mode there too!

# Shaking devices

Use the following module if you want to open Develoepr Menu without shake.
- [react-native-open-developer-menu](https://github.com/react-native-open-developer-menu/react-native-open-developer-menu])
