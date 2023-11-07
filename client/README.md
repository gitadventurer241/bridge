# Our Frontend 🌈

Welcome to our frontend project! We're excited to give you a quick tour of how we've structured our frontend with a focus on reusability and maintainability.

## Reusable Component Structure 🧩

At the heart of our frontend architecture is a reusable component structure. We believe in building from the ground up with components that are versatile and can be easily integrated into different parts of the application.

### UI Components

In the `UI` folder, you'll find a collection of small UI components. These components are designed to handle specific UI elements, such as buttons, input fields, and tooltips. They serve as the building blocks for the larger components and ensure consistency in the user interface.

### Bigger Reusable Components

Our frontend also features bigger reusable components that are composed of these smaller UI components. These components are designed to handle more complex parts of the application, providing a high level of modularity and making it easier to maintain and scale the project.

### Leveraging Ant Design

To streamline our frontend development, many of our components are built as alterations or extensions of Ant Design components. Ant Design provides a wealth of well-designed and customizable UI components, and we've built upon this foundation to create a cohesive and visually appealing user interface.

## Iconography with Tabler Icons

Icons play a crucial role in user experience, and we've integrated Tabler Icons into our project to ensure a consistent and attractive iconography. You'll find a wide range of icons from Tabler Icons used throughout the application to enhance the visual appeal and provide clear communication.

## Styling Consistency with index.css

Consistency in styling is key to a polished user interface. To maintain this consistency, we've centralized styling variables in our `index.css` file. This includes definitions for padding, margins, colors, and common styling properties. By keeping these variables in one place, we ensure a uniform look and feel across the entire application.

<br/>

## Get Started 🚀

To run the frontend locally, follow these steps:

1. Clone the repository.
```bash
 git clone https://github.com/WomenPlusPlus/deploy-impact-23-shift-4.git
```
2. Navigate to the `client` folder in your project directory.
```bash
cd client
```
3. Install all dependencies.
```bash
npm install 
```
4. Start the frontend application.
```bash
npm start
```
<br/>

## Deployment on Vercel 🙌
Our client is deployed on Vercel. To deploy a new version run the following command from the client root directory.

```bash
vercel --prod
```