-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student'::user_role)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create role-specific profile entries
CREATE OR REPLACE FUNCTION public.handle_role_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create role-specific profile based on user role
  IF NEW.role = 'student' THEN
    INSERT INTO public.student_profiles (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'employer' THEN
    INSERT INTO public.employer_profiles (user_id, company_name)
    VALUES (NEW.user_id, COALESCE(NEW.first_name || ' ' || NEW.last_name || '''s Company', 'My Company'))
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'university' THEN
    INSERT INTO public.university_profiles (user_id, institution_name)
    VALUES (NEW.user_id, 'My Institution')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for role-specific profile creation
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_role_profile();