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
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        console.error("Error checking user role:", roleError);
        return null;
      }

      console.log("User role data:", roleData);
      return roleData?.role || null;
    } catch (error) {
      console.error("Error in checkUserRole:", error);
      return null;
    }
  };

  const setDefaultUserRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'user' }]);

      if (error) {
        console.error("Error setting default role:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in setDefaultUserRole:", error);
      throw error;
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

        if (!user) {
          console.error("No user data returned after login");
          throw new Error("No user data returned");
        }

        console.log("Login successful, user:", user);

        let userRole = null;
        try {
          userRole = await checkUserRole(user.id);
          console.log("User role:", userRole);
        } catch (roleError) {
          console.error("Error checking role:", roleError);
          // Continue with login even if role check fails
          userRole = null;
        }

        // Specific routing for admin
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
        
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          console.error("Signup error:", error);
          throw error;
        }

        if (user) {
          try {
            await setDefaultUserRole(user.id);
            console.log("Default role set for new user");
          } catch (roleError) {
            console.error("Error setting default role:", roleError);
            // Continue with signup even if role setting fails
          }
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