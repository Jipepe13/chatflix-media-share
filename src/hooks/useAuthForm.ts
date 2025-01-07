import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (error: AuthError) => {
    console.error("Auth error details:", error);
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return "Invalid credentials. Please check your email and password.";
        case 422:
          return "Invalid email format.";
        case 429:
          return "Too many attempts. Please try again later.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred. Please try again.";
  };

  const checkUserRole = async (userId: string): Promise<string | null> => {
    try {
      console.log("Checking user role for ID:", userId);
      
      // Use single() instead of maybeSingle() to get better error handling
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No role found
          console.log("No role found for user");
          return null;
        }
        console.error("Error checking user role:", error);
        throw error;
      }

      console.log("User role data:", data);
      return data?.role || null;
    } catch (error) {
      console.error("Error in checkUserRole:", error);
      // Don't throw the error, just return null to allow the login flow to continue
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Starting authentication process...");
      console.log("Auth mode:", isLogin ? "login" : "signup");
      console.log("Email being used:", email);
      
      if (isLogin) {
        console.log("Attempting login...");
        
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        console.log("Login successful, user:", user);

        if (!user) {
          console.error("No user data returned after login");
          throw new Error("No user data returned");
        }

        let userRole = null;
        try {
          userRole = await checkUserRole(user.id);
          console.log("User role:", userRole);
        } catch (roleError) {
          console.error("Error checking role, continuing with login:", roleError);
        }

        // Even if role check fails, allow login to proceed
        if (email === 'cassecou100@gmail.com' && userRole === 'admin') {
          console.log("Admin user detected, redirecting to admin panel");
          navigate('/cassecou100');
        } else {
          console.log("Regular user, redirecting to chat");
          navigate('/chat');
        }

        toast.success("Connexion réussie !");
      } else {
        console.log("Attempting signup...");
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.error("Signup error:", error);
          throw error;
        }
        
        console.log("Signup successful");
        toast.success("Inscription réussie !");
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return {
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    showPassword,
    setShowPassword,
    handleSubmit,
  };
};