import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Allow both GET and POST for easier testing
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405 
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "admin@veralogix-group.org";
    const adminPassword = "admin";
    
    const usersToCreate = [
      { email: adminEmail, role: "student", firstName: "Student", lastName: "Admin" },
      { email: `employer.${adminEmail}`, role: "employer", firstName: "Employer", lastName: "Admin" },
      { email: `university.${adminEmail}`, role: "university", firstName: "University", lastName: "Admin" },
    ];

    const results = [];

    for (const userData of usersToCreate) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === userData.email);

      if (existingUser) {
        results.push({ email: userData.email, status: "already exists", userId: existingUser.id });
        continue;
      }

      // Create user with admin API
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
        },
      });

      if (createError) {
        results.push({ email: userData.email, status: "error", error: createError.message });
      } else {
        results.push({ email: userData.email, status: "created", userId: newUser.user?.id });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        loginCredentials: {
          student: { email: adminEmail, password: adminPassword },
          employer: { email: `employer.${adminEmail}`, password: adminPassword },
          university: { email: `university.${adminEmail}`, password: adminPassword },
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error seeding admin users:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});