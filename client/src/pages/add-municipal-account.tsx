import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, CheckCircle } from "lucide-react";

const addAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  propertyNumber: z.string().min(6, "Property number must be at least 6 characters"),
  taxType: z.string().min(1, "Tax type is required"),
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

// Only include states that have district data defined
const states = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal"
];

const districtsByState: Record<string, string[]> = {
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi",
    "South West Delhi", "West Delhi"
  ],
  "Maharashtra": [
    "Mumbai", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", 
    "Aurangabad", "Solapur", "Ahmednagar", "Kolhapur", "Raigad", "Satara",
    "Sangli", "Ratnagiri", "Sindhudurg", "Dhule", "Jalgaon", "Nandurbar",
    "Amravati", "Akola", "Yavatmal", "Buldhana", "Washim", "Hingoli",
    "Parbhani", "Jalna", "Beed", "Latur", "Osmanabad", "Nanded", "Wardha",
    "Chandrapur", "Gadchiroli", "Gondia", "Bhandara"
  ],
  "Karnataka": [
    "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary",
    "Bidar", "Vijayapura", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag",
    "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore",
    "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada",
    "Yadgir"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
    "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram",
    "Salem", "Sivaganga", "Thanjavur", "The Nilgiris", "Theni", "Thiruvallur",
    "Thiruvarur", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur",
    "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha",
    "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
    "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr",
    "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad",
    "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad",
    "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi",
    "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
    "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri",
    "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura",
    "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
    "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur",
    "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong",
    "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas",
    "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman",
    "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", 
    "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", 
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", 
    "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", 
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", 
    "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", 
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", 
    "Tapi", "Vadodara", "Valsad"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", 
    "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", 
    "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", 
    "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", 
    "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
  ],
};

const taxTypes = [
  "Property Tax",
  "Water & Sewerage Tax",
  "Education Cess",
  "General Tax",
  "Other"
];

export default function AddMunicipalAccount() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const isEditMode = searchParams.get('edit') === 'true';
  const accountId = searchParams.get('id');

  const form = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountName: "",
      state: "",
      district: "",
      municipality: "",
      propertyNumber: "",
      taxType: "",
    },
  });

  const selectedState = form.watch("state");
  const availableDistricts = selectedState ? districtsByState[selectedState] || [] : [];

  useEffect(() => {
    if (isEditMode) {
      const name = searchParams.get('name');
      const state = searchParams.get('state');
      const district = searchParams.get('district');
      const municipality = searchParams.get('municipality');
      const propertyNumber = searchParams.get('propertyNumber');
      const taxType = searchParams.get('taxType');

      if (name) form.setValue('accountName', name);
      if (state) form.setValue('state', state);
      if (district) form.setValue('district', district);
      if (municipality) form.setValue('municipality', municipality);
      if (propertyNumber) form.setValue('propertyNumber', propertyNumber);
      if (taxType) form.setValue('taxType', taxType);
    }
  }, [isEditMode]);

  const onSubmit = async (data: AddAccountForm) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      toast({
        title: isEditMode ? "Account Updated Successfully" : "Account Added Successfully",
        description: `${data.accountName} tax account has been ${isEditMode ? 'updated' : 'added'}`,
      });
      navigate(isEditMode && accountId ? `/municipal-tax/account/${accountId}` : "/municipal-tax");
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <div className="w-10"></div>
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'ACCOUNT UPDATED' : 'ACCOUNT ADDED'}</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="border border-white/20 bg-white/5 p-12">
              <div className="w-20 h-20 border border-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white/80" />
              </div>
              <h2 className="text-2xl font-light mb-2 text-white">Success!</h2>
              <p className="text-white/60 mb-6">
                Your tax account has been {isEditMode ? 'updated' : 'added'} successfully
              </p>
              <p className="text-sm text-white/40">
                Redirecting to {isEditMode ? 'account details' : 'tax payments'}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/municipal-tax")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'EDIT ACCOUNT' : 'ADD ACCOUNT'}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Municipal Tax</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-32 px-4 w-full max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white/60" />
          </div>
          <div>
            <h2 className="text-lg font-light tracking-wide text-white">Municipal Tax Details</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter your property information</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Account Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Home Property, Office Property"
                      className="bg-white/5 border-white/10 text-white rounded-none h-12"
                      data-testid="input-account-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">State</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("district", "");
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {states.map((state) => (
                        <SelectItem key={state} value={state} className="text-white">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">District</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedState}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district} className="text-white">
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Municipality</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter municipality name"
                      className="bg-white/5 border-white/10 text-white rounded-none h-12"
                      data-testid="input-municipality"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Tax Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-tax-type">
                        <SelectValue placeholder="Select tax type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {taxTypes.map((taxType) => (
                        <SelectItem key={taxType} value={taxType} className="text-white">
                          {taxType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Property Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter property number"
                      className="bg-white/5 border-white/10 text-white rounded-none h-12"
                      data-testid="input-property-number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-white text-black hover:bg-white/90 h-14 font-light text-base tracking-wide rounded-none"
          data-testid="button-create"
        >
          {isSubmitting ? (isEditMode ? "Updating Account..." : "Creating Account...") : (isEditMode ? "Update Account" : "Create Account")}
        </Button>
      </div>
    </div>
  );
}
