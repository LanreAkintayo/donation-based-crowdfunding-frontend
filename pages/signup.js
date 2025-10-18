import { useState } from "react"; // 1. Import useState to manage our form data
import Layout from "./layout";

const SignUp = () => {
  // 2. Set up state to hold the form data (what the user types in)
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 3. Set up state to hold any validation errors
  const [errors, setErrors] = useState({});

  // 4. This function runs every time the user types in an input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 5. This function runs when the user clicks the "Sign Up" button
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading on submission

    // --- VALIDATION LOGIC ---
    const newErrors = {};
    if (!formData.fullName) {
        newErrors.fullName = "Full name is required.";
    }
    if (!formData.username) {
        newErrors.username = "Username is required.";
    }
    if (!formData.email) {
        newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        // This is a simple check to see if the email looks valid
        newErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
        newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
    }
    // --- END OF VALIDATION ---

    setErrors(newErrors); // Update the errors state

    // 6. If there are no errors, we can submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully:", formData);
      // **IMPORTANT**: This is where you would send the data to your backend API
      // For example: await yourApi.registerUser(formData);
      alert("Account created successfully! (Check the console for the data)");
    } else {
      console.log("Form has errors:", newErrors);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#e7e0ce] via-white to-white px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our community to fund and get funded!
          </p>
        </div>

        {/* 7. Attach the handleSubmit function to the form's onSubmit event */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          
          {/* --- Full Name Field --- */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName} // Connect input to state
              onChange={handleChange}   // Connect input to handleChange function
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Aliyu Musa"
            />
            {/* Show error message if it exists */}
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          {/* --- Username Field --- */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username} // Connect input to state
              onChange={handleChange}    // Connect input to handleChange function
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., aliyumusa"
            />
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
          </div>

          {/* --- Email Address Field --- */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email} // Connect input to state
              onChange={handleChange}  // Connect input to handleChange function
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* --- Password Field --- */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password} // Connect input to state
              onChange={handleChange}   // Connect input to handleChange function
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* --- Confirm Password Field --- */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword} // Connect input to state
              onChange={handleChange}          // Connect input to handleChange function
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* --- Sign Up Button --- */}
          <div>
            <button
              type="submit" // The button type should be "submit" to trigger the form's onSubmit
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SignUp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SignUp;