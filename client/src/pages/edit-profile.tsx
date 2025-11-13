import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Camera,
  Edit3,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Settings,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  CreditCard,
  Wallet,
  DollarSign,
  Target,
  Activity,
  Award,
  Crown,
  Star,
  Percent,
  IndianRupee,
  Hexagon,
  Upload
} from "lucide-react";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    phoneVerified: boolean;
    secondaryPhone: string;
    dateOfBirth: string;
    gender: string;
    profilePicture: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  professional: {
    occupation: string;
    company: string;
    annualIncome: string;
    workExperience: string;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      promotional: boolean;
    };
    privacy: {
      profileVisibility: string;
      activitySharing: boolean;
      dataSharing: boolean;
    };
  };
  security: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    sessionTimeout: string;
    lastPasswordChange: string;
  };
}

export default function EditProfile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Mock profile data (in real app, this would come from APIs)
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      displayName: "John D.",
      email: "john.doe@email.com",
      emailVerified: false,
      phone: "+91 98765 43210",
      phoneVerified: false,
      secondaryPhone: "",
      dateOfBirth: "1990-05-15",
      gender: "male",
      profilePicture: ""
    },
    address: {
      line1: "123 Tech Park Road",
      line2: "Near City Mall",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India"
    },
    professional: {
      occupation: "Software Engineer",
      company: "Tech Corp Ltd",
      annualIncome: "1200000",
      workExperience: "5"
    },
    preferences: {
      language: "english",
      currency: "INR",
      timezone: "Asia/Kolkata",
      notifications: {
        email: true,
        sms: true,
        push: true,
        promotional: false
      },
      privacy: {
        profileVisibility: "private",
        activitySharing: false,
        dataSharing: false
      }
    },
    security: {
      twoFactorAuth: true,
      biometricAuth: false,
      sessionTimeout: "30",
      lastPasswordChange: "2024-11-15"
    }
  });

  const handleInputChange = (section: keyof ProfileData, field: string, value: any) => {
    setProfileData(prev => {
      const updates: any = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      
      // Reset verification status when email or phone changes
      if (section === "personalInfo") {
        if (field === "email" && value !== prev.personalInfo.email) {
          updates.personalInfo.emailVerified = false;
        }
        if (field === "phone" && value !== prev.personalInfo.phone) {
          updates.personalInfo.phoneVerified = false;
        }
      }
      
      return updates;
    });
  };

  const handleNestedInputChange = (section: keyof ProfileData, nestedSection: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...(prev[section] as any)[nestedSection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated"
    });
    
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleVerifyPhone = () => {
    // In real app, this would send OTP and verify
    toast({
      title: "OTP Sent",
      description: "Verification code sent to your phone number"
    });
    // Simulate successful verification
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          phoneVerified: true
        }
      }));
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully"
      });
    }, 2000);
  };

  const handleVerifyEmail = () => {
    // In real app, this would send OTP and verify
    toast({
      title: "OTP Sent",
      description: "Verification code sent to your email"
    });
    // Simulate successful verification
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          emailVerified: true
        }
      }));
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully"
      });
    }, 2000);
  };

  const handleKYCUpload = () => {
    // In real app, this would open file picker and upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast({
          title: "Documents Selected",
          description: `${files.length} document(s) ready for upload`
        });
        // Here you would upload the files
      }
    };
    input.click();
  };

  const handleProfilePictureUpload = () => {
    // In real app, this would open file picker, show cropper, and upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Here you would:
        // 1. Read the file as data URL
        // 2. Show a cropper dialog
        // 3. Upload the cropped image
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setProfileData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              profilePicture: imageUrl
            }
          }));
          toast({
            title: "Profile Picture Updated",
            description: "Your profile picture has been updated successfully"
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "address", name: "Address", icon: MapPin },
    { id: "professional", name: "Professional", icon: Building },
    { id: "preferences", name: "Preferences", icon: Settings },
    { id: "security", name: "Security", icon: Shield }
  ];

  const getSectionIcon = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.icon : User;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">EDIT PROFILE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Update personal info</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-edit"
          >
            {isEditing ? <EyeOff className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Profile Completion */}
        <div className="bg-white/5 border border-white/10 p-4" data-testid="profile-completion">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">Profile Completion</h4>
              <p className="text-xs text-white/60">85% complete - Add more info to unlock features</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 bg-white/10 h-2">
                <div 
                  className="bg-white h-2 transition-all duration-300"
                  style={{ width: "85%" }}
                  data-testid="progress-profile-completion"
                />
              </div>
              <span className="text-xs text-white/60">85%</span>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white/5 border border-white/10 p-6 text-center" data-testid="profile-picture-section">
          <div className="w-20 h-20 border border-white/60 mx-auto flex items-center justify-center mb-4 overflow-hidden">
            {profileData.personalInfo.profilePicture ? (
              <img 
                src={profileData.personalInfo.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white/60" />
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleProfilePictureUpload}
            className="text-white/60 hover:text-white text-sm"
            data-testid="button-change-picture"
          >
            <Camera className="h-4 w-4 mr-2" />
            Change Profile Picture
          </Button>
        </div>

        {/* Section Navigation */}
        <div className="bg-white/5 border border-white/10 p-4" data-testid="section-navigation">
          <h3 className="text-lg font-semibold text-white mb-4">Edit Sections</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={cn(
                    "h-10 px-4 whitespace-nowrap text-sm flex-shrink-0",
                    activeSection === section.id 
                      ? "bg-white text-black hover:bg-white/90" 
                      : "text-white hover:bg-white/10 border border-white/10"
                  )}
                  onClick={() => setActiveSection(section.id)}
                  data-testid={`button-section-${section.id}`}
                >
                  <SectionIcon className="h-4 w-4 mr-2" />
                  {section.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Edit Forms */}
        <div className="space-y-6">
          {/* Personal Information */}
          {activeSection === "personal" && (
            <div className="bg-white/5 border border-white/10 p-6" data-testid="personal-info-section">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              {/* Info Notice */}
              <div className="bg-white/5 border border-white/10 p-3 mb-4">
                <p className="text-xs text-white/60">
                  Changes to name or government ID require verification — this may take up to 24 hours.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white/80">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.personalInfo.firstName}
                      onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white/80">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.personalInfo.lastName}
                      onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="displayName" className="text-white/80">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.personalInfo.displayName}
                    onChange={(e) => handleInputChange("personalInfo", "displayName", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-display-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profileData.personalInfo.email}
                      onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white flex-1"
                      data-testid="input-email"
                    />
                    {!profileData.personalInfo.emailVerified && (
                      <Button
                        size="sm"
                        onClick={handleVerifyEmail}
                        className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none"
                        data-testid="button-verify-email"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    {profileData.personalInfo.emailVerified && (
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none h-9 px-3">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-white/80">Primary Phone</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      value={profileData.personalInfo.phone}
                      onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white flex-1"
                      data-testid="input-phone"
                    />
                    {!profileData.personalInfo.phoneVerified && (
                      <Button
                        size="sm"
                        onClick={handleVerifyPhone}
                        className="bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-none"
                        data-testid="button-verify-phone"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                    )}
                    {profileData.personalInfo.phoneVerified && (
                      <Badge className="bg-white/10 text-white border-white/20 rounded-none h-9 px-3">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryPhone" className="text-white/80">Secondary Phone (Optional)</Label>
                  <Input
                    id="secondaryPhone"
                    value={profileData.personalInfo.secondaryPhone}
                    onChange={(e) => handleInputChange("personalInfo", "secondaryPhone", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-secondary-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth" className="text-white/80">Date of Birth</Label>
                  <DatePicker
                    value={profileData.personalInfo.dateOfBirth}
                    onChange={(date) => handleInputChange("personalInfo", "dateOfBirth", date)}
                    disabled={!isEditing}
                    placeholder="Select date of birth"
                    className="bg-black border-white/10 text-white"
                    data-testid="input-date-of-birth"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender" className="text-white/80">Gender</Label>
                  <Select
                    value={profileData.personalInfo.gender}
                    onValueChange={(value) => handleInputChange("personalInfo", "gender", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-black border-white/10 text-white" data-testid="select-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* KYC Documents */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-white/80">KYC Documents</Label>
                    <Button
                      size="sm"
                      onClick={handleKYCUpload}
                      disabled={!isEditing}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10"
                      data-testid="button-upload-kyc"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Re-upload
                    </Button>
                  </div>
                  <p className="text-xs text-white/60">
                    Upload new KYC documents for verification if required
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Address Information */}
          {activeSection === "address" && (
            <div className="bg-white/5 border border-white/10 p-6" data-testid="address-info-section">
              <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="line1" className="text-white/80">Address Line 1</Label>
                  <Input
                    id="line1"
                    value={profileData.address.line1}
                    onChange={(e) => handleInputChange("address", "line1", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-line1"
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="line2" className="text-white/80">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    value={profileData.address.line2}
                    onChange={(e) => handleInputChange("address", "line2", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-line2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-white/80">City</Label>
                    <Input
                      id="city"
                      value={profileData.address.city}
                      onChange={(e) => handleInputChange("address", "city", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-white/80">State</Label>
                    <Input
                      id="state"
                      value={profileData.address.state}
                      onChange={(e) => handleInputChange("address", "state", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-state"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode" className="text-white/80">Pin Code</Label>
                    <Input
                      id="pincode"
                      value={profileData.address.pincode}
                      onChange={(e) => handleInputChange("address", "pincode", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-pincode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-white/80">Country</Label>
                    <Input
                      id="country"
                      value={profileData.address.country}
                      onChange={(e) => handleInputChange("address", "country", e.target.value)}
                      disabled={!isEditing}
                      className="bg-black border-white/10 text-white"
                      data-testid="input-country"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Information */}
          {activeSection === "professional" && (
            <div className="bg-white/5 border border-white/10 p-6" data-testid="professional-info-section">
              <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="occupation" className="text-white/80">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileData.professional.occupation}
                    onChange={(e) => handleInputChange("professional", "occupation", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-occupation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company" className="text-white/80">Company</Label>
                  <Input
                    id="company"
                    value={profileData.professional.company}
                    onChange={(e) => handleInputChange("professional", "company", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-company"
                  />
                </div>
                
                <div>
                  <Label htmlFor="annualIncome" className="text-white/80">Annual Income (₹)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={profileData.professional.annualIncome}
                    onChange={(e) => handleInputChange("professional", "annualIncome", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-annual-income"
                  />
                </div>
                
                <div>
                  <Label htmlFor="workExperience" className="text-white/80">Work Experience (Years)</Label>
                  <Input
                    id="workExperience"
                    type="number"
                    value={profileData.professional.workExperience}
                    onChange={(e) => handleInputChange("professional", "workExperience", e.target.value)}
                    disabled={!isEditing}
                    className="bg-black border-white/10 text-white"
                    data-testid="input-work-experience"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === "preferences" && (
            <div className="bg-white/5 border border-white/10 p-6" data-testid="preferences-section">
              <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
              <div className="space-y-6">
                {/* General Preferences */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white/80">General</h4>
                  <div>
                    <Label htmlFor="language" className="text-white/80">Language</Label>
                    <Select
                      value={profileData.preferences.language}
                      onValueChange={(value) => handleInputChange("preferences", "language", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-black border-white/10 text-white" data-testid="select-language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency" className="text-white/80">Currency</Label>
                    <Select
                      value={profileData.preferences.currency}
                      onValueChange={(value) => handleInputChange("preferences", "currency", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-black border-white/10 text-white" data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white/80">Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: "email", label: "Email Notifications" },
                      { key: "sms", label: "SMS Notifications" },
                      { key: "push", label: "Push Notifications" },
                      { key: "promotional", label: "Promotional Emails" }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`notification-${key}`} className="text-white/80">{label}</Label>
                        <Switch
                          id={`notification-${key}`}
                          checked={profileData.preferences.notifications[key as keyof typeof profileData.preferences.notifications]}
                          onCheckedChange={(checked) => handleNestedInputChange("preferences", "notifications", key, checked)}
                          disabled={!isEditing}
                          data-testid={`switch-notification-${key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-white/80">Privacy</h4>
                  <div>
                    <Label htmlFor="profileVisibility" className="text-white/80">Profile Visibility</Label>
                    <Select
                      value={profileData.preferences.privacy.profileVisibility}
                      onValueChange={(value) => handleNestedInputChange("preferences", "privacy", "profileVisibility", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-black border-white/10 text-white" data-testid="select-profile-visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends_only">Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { key: "activitySharing", label: "Share Activity with Others" },
                      { key: "dataSharing", label: "Allow Data Sharing for Analytics" }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={`privacy-${key}`} className="text-white/80">{label}</Label>
                        <Switch
                          id={`privacy-${key}`}
                          checked={profileData.preferences.privacy[key as keyof Pick<typeof profileData.preferences.privacy, "activitySharing" | "dataSharing">]}
                          onCheckedChange={(checked) => handleNestedInputChange("preferences", "privacy", key, checked)}
                          disabled={!isEditing}
                          data-testid={`switch-privacy-${key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="bg-white/5 border border-white/10 p-6" data-testid="security-section">
              <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white/80">Two-Factor Authentication</Label>
                    <p className="text-xs text-white/60">Add extra security to your account</p>
                  </div>
                  <Switch
                    checked={profileData.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange("security", "twoFactorAuth", checked)}
                    disabled={!isEditing}
                    data-testid="switch-two-factor"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white/80">Biometric Authentication</Label>
                    <p className="text-xs text-white/60">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    checked={profileData.security.biometricAuth}
                    onCheckedChange={(checked) => handleInputChange("security", "biometricAuth", checked)}
                    disabled={!isEditing}
                    data-testid="switch-biometric"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionTimeout" className="text-white/80">Session Timeout (minutes)</Label>
                  <Select
                    value={profileData.security.sessionTimeout}
                    onValueChange={(value) => handleInputChange("security", "sessionTimeout", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-black border-white/10 text-white" data-testid="select-session-timeout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border border-white/10 p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Last Password Change</span>
                    <span className="text-white text-sm">
                      {new Date(profileData.security.lastPasswordChange).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white text-xs mt-2"
                    data-testid="button-change-password"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="sticky bottom-6 z-40">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-white text-black hover:bg-white/90 h-12"
              data-testid="button-save-profile"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}