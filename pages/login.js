import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "./layout";

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    loginIdentifier: "", // This field will hold either email or username
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    // Basic validation
    if (!formData.loginIdentifier || !formData.password) {
      setError("Please enter both your email/username and password.");
      setIsLoading(false);
      return;
    }

    try {
      // Use the environment variable for the API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // **IMPORTANT**: Store the token (the VIP wristband)
      localStorage.setItem('authToken', data.token);

      alert('Login successful!');
      router.push('/'); // Redirect to the user's dashboard

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#e7e0ce] via-white to-white px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue to your account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* --- Email or Username Field --- */}
          <div>
            <label htmlFor="loginIdentifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email or Username
            </label>
            <input id="loginIdentifier" name="loginIdentifier" type="text" required value={formData.loginIdentifier} onChange={handleChange} className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm" placeholder="e.g., aliyumusa or you@example.com"
            />
          </div>

          {/* --- Password Field --- */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm" placeholder="••••••••"
            />
          </div>

          {/* --- Error Message Display --- */}
          {error && (
            <div>
              <p className="text-center text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* --- Log In Button --- */}
          <div>
            <button type="submit" disabled={isLoading} className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-orange-400 disabled:cursor-not-allowed">
              {isLoading ? 'Signing In...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Login;