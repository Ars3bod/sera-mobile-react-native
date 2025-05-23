This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# SERA Mobile App

**SERA Mobile App** is the official regulatory platform of the Saudi Electricity Regulatory Authority, developed using React Native. It provides citizens and stakeholders with easy, secure, and modern access to essential regulatory services. The app offers an Arabic-first experience and integrates with the Nafath national login system for secure identity verification and access.

With a user-friendly interface, the app enables individuals and organizations to manage their interactions with the Authority by submitting and tracking complaints, inquiries, and formal requests—all from their mobile devices.

---

## 🔐 Key Features

1. **Secure Login via Nafath**

   - Authenticate and sign in using the official Saudi Nafath system for trusted digital identity management.

2. **Complaints Management**

   - View all past and current complaints.
   - Check complaint statuses: All, Closed, and Processing.
   - Submit new complaints against service providers.

3. **Inquiries System**

   - Track and view submitted inquiries.
   - Filter by All, Closed, and Processing inquiries.
   - Submit new inquiries regarding services or regulations.

4. **Profile Management**

   - View and edit personal profile information: Name, National ID, Contact Info, Birth Date, etc.

5. **Authorization Application Request**

   - Submit applications to request authorization for electricity generation, co-generation, or district cooling.

6. **Application for a License**

   - Submit formal requests to obtain a license for electricity generation, co-generation, or district cooling.

7. **Data Sharing Service**

   - Access the national data sharing portal as part of compliance with the National Data Management Office (NDMO).

8. **Freedom of Information**
   - Submit requests under the Freedom of Information Policy for transparent access to non-confidential public data.

---

## 🛠️ Technical Information

- **Platform:** iOS & Android
- **Framework:** React Native
- **Authentication:** Nafath Integration
- **State Management:** (To be specified)
- **Networking:** (To be specified)
- **Secure Storage:** (To be specified)
- **UI/UX:** RTL-first (Right-to-Left) with full Arabic localization
- **PDF Support:** (To be specified)
- **Deployment:** Google Play Store, Apple App Store
- **APIs Integration:** Secure backend APIs from SERA's systems (complaints, inquiries, services)

---

## 📱 Requirements

- React Native
- Integration with Nafath National Login
- Arabic language support

---

## ℹ️ Contribution & Support

For contributions or support, please contact the development team or open an issue in the project repository.
