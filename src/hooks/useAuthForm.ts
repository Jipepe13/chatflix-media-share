import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Auth submitted:", { email, password, username });
      
      if (isLogin) {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log("User logged in:", user);

        if (!user) {
          throw new Error("No user data returned");
        }

        // Fetch user role
        const { data: roleData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (rolesError) {
          console.error("Error fetching roles:", rolesError);
          throw rolesError;
        }

        console.log("User role data:", roleData);

        // Check if user is admin and has the specific email
        if (email === 'cassecou100@gmail.com' && roleData?.role === 'admin') {
          console.log("Admin user detected, redirecting to admin panel at /cassecou100");
          navigate('/cassecou100');
        } else {
          console.log("Regular user, redirecting to chat");
          navigate('/chat');
        }

        toast.success("Connexion réussie !");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Inscription réussie !");
        navigate("/chat");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Une erreur est survenue");
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