import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  Shield,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { AppointmentRequest } from "./backend.d";

const LOGO_SRC = "/images/logo.jpg";
const PHONE_DISPLAY = "098765 43210";
const PHONE_TEL = "09876543210";
const WHATSAPP_LINK = "https://wa.me/919876543210";
const MAPS_QUERY =
  "https://maps.google.com/maps?q=Shop+No+7+Wing+A+Heritage+Plaza+PCMC+Link+Rd+Chinchwad+Gaon+Pimpri+Chinchwad+Maharashtra+411033";
const MAPS_EMBED = `${MAPS_QUERY}&output=embed`;
const ADDRESS_LINE1 = "Shop No. 7, Wing-A, Heritage Plaza,";
const ADDRESS_LINE2 = "PCMC Link Rd, near Twacha Clinic, Chinchwad Gaon,";
const ADDRESS_LINE3 = "Chinchwad, Pimpri-Chinchwad, Maharashtra 411033";

const SERVICES = [
  "Root Canal Treatment",
  "Ceramic Tooth Treatment",
  "Tooth Extraction",
  "Dental Fillings",
  "Pediatric Dentistry",
  "General Dental Care",
];

const STAR_INDICES = [0, 1, 2, 3, 4];

// ─── Admin Panel ──────────────────────────────────────────────────────────────

function AdminPanel() {
  const { actor, isFetching } = useActor();

  const { data: bookings, isLoading } = useQuery<AppointmentRequest[]>({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
  });

  const formatTimestamp = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white" data-ocid="admin.panel">
      <header className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="MYDENT" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-bold">MYDENT Admin — Patient Bookings</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = "";
          }}
          className="text-sm text-blue-200 hover:text-white underline cursor-pointer"
          data-ocid="admin.back.link"
        >
          ← Back to Site
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {isLoading || isFetching ? (
          <div
            className="flex items-center justify-center py-24 gap-3 text-blue-600"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium">Loading bookings…</span>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3"
            data-ocid="admin.empty_state"
          >
            <Users className="w-12 h-12 opacity-30" />
            <p className="text-lg">No bookings yet</p>
          </div>
        ) : (
          <div
            className="rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-semibold text-gray-700">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Patient Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Service
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date / Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b, i) => (
                  <TableRow
                    key={`${b.patientName}-${i}`}
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <TableCell className="text-gray-400 text-sm">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {b.patientName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {b.phoneNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {b.serviceType}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatTimestamp(b.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

function BookingForm({ onSuccess }: { onSuccess: () => void }) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not ready");
      await actor.bookAppointment(name, phone, service);
    },
    onSuccess: () => {
      toast.success("Appointment booked! We'll contact you soon.");
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to book. Please call us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !service) {
      toast.error("Please fill in all fields.");
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="book-name">Full Name</Label>
        <Input
          id="book-name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg"
          data-ocid="booking.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="book-phone">Phone Number</Label>
        <Input
          id="book-phone"
          placeholder="Your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg"
          data-ocid="booking.phone_input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Service</Label>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="rounded-lg" data-ocid="booking.select">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="w-full rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
        disabled={mutation.isPending}
        data-ocid="booking.submit_button"
      >
        {mutation.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {mutation.isPending ? "Booking..." : "Confirm Appointment"}
      </Button>
    </form>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin",
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setIsAdmin(window.location.hash === "#admin");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (isAdmin) {
    return (
      <>
        <Toaster position="top-right" />
        <AdminPanel />
      </>
    );
  }

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
        }`}
        data-ocid="nav.panel"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={LOGO_SRC}
              alt="MYDENT Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-extrabold text-blue-600 tracking-tight">
              MY<span className="text-blue-800">DENT</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                data-ocid={`nav.${link.id}.link`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setBookingOpen(true)}
              className="hidden sm:flex rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5"
              data-ocid="nav.book_appointment.button"
            >
              Book Appointment
            </Button>
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.menu.button"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-blue-100 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                setBookingOpen(true);
              }}
              className="w-full rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Book Appointment
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              5.0 Rated · 280+ Happy Patients
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-tight">
              Gentle, Expert <span className="text-blue-600">Dental Care</span>{" "}
              for Your Entire Family
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Trusted by 280+ happy patients with a 5.0★ rating. Modern dental
              treatments delivered with warmth and precision at Chinchwad,
              Pimpri-Chinchwad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setBookingOpen(true)}
                size="lg"
                className="rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-12"
                data-ocid="hero.book_appointment.primary_button"
              >
                Book Appointment
              </Button>
              <a href={`tel:${PHONE_TEL}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-pill border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold px-8 h-12"
                  data-ocid="hero.call_now.secondary_button"
                >
                  <Phone className="w-4 h-4 mr-2" /> Call Now
                </Button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] aspect-[4/3]">
              <img
                src="/images/clinic.jpg"
                alt="MYDENT Dental Clinic Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">5.0 ★ Rating</p>
                <p className="text-xs text-gray-500">280+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-blue-700 text-white py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {[
              {
                icon: (
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                ),
                label: "5.0 Rating",
                sub: "Google Reviews",
              },
              {
                icon: <Users className="w-5 h-5 text-blue-200" />,
                label: "280+ Reviews",
                sub: "Verified Patients",
              },
              {
                icon: <Heart className="w-5 h-5 text-blue-200" />,
                label: "Highly Recommended",
                sub: "by Families",
              },
              {
                icon: (
                  <img
                    src={LOGO_SRC}
                    alt="MYDENT"
                    className="w-5 h-5 object-contain"
                  />
                ),
                label: "Trusted Clinic",
                sub: "Chinchwad, MH",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-shrink-0">{item.icon}</div>
                <div className="text-left">
                  <p className="font-bold text-sm sm:text-base">{item.label}</p>
                  <p className="text-xs text-blue-200">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Doctor */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card max-w-sm mx-auto">
                <img
                  src="/images/doctor.jpg"
                  alt="Dr. Neil D"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white rounded-2xl p-4 shadow-lg text-center">
                <p className="text-2xl font-extrabold">5.0★</p>
                <p className="text-xs text-blue-100">Patient Rating</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
                  Meet Your Doctor
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Dr. Priya G Kadam
                </h2>
                <p className="text-gray-500 mt-1">BDS · Dental Surgeon</p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Dr. Priya G Kadam brings expertise, warmth, and unwavering
                commitment to every patient interaction. She believes in making
                dentistry a comfortable, transparent experience — no unnecessary
                treatments, only what you truly need.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    icon: <Heart className="w-5 h-5 text-blue-500" />,
                    text: "Gentle & professional — puts patients at ease",
                  },
                  {
                    icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
                    text: "Explains every procedure in plain language",
                  },
                  {
                    icon: <Shield className="w-5 h-5 text-blue-500" />,
                    text: "Focused on patient comfort above all",
                  },
                  {
                    icon: <Award className="w-5 h-5 text-blue-500" />,
                    text: "Ethical approach — no unnecessary treatments",
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setBookingOpen(true)}
                className="rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7"
                data-ocid="about.book_appointment.button"
              >
                Book a Consultation <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Our Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Comprehensive dental care for every member of your family — from
              routine checkups to advanced treatments.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <img
                    src={LOGO_SRC}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                ),
                title: "Root Canal Treatment",
                desc: "Pain-free root canal procedures to save your natural tooth and relieve discomfort.",
              },
              {
                icon: <Crown className="w-8 h-8 text-blue-500" />,
                title: "Ceramic Tooth Treatment",
                desc: "Natural-looking ceramic crowns and veneers for a beautiful, durable smile.",
              },
              {
                icon: <Scissors className="w-8 h-8 text-blue-500" />,
                title: "Tooth Extraction",
                desc: "Gentle extractions performed with precision to minimize discomfort and recovery time.",
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-500" />,
                title: "Dental Fillings",
                desc: "Tooth-colored composite fillings that restore strength and a natural appearance.",
              },
              {
                icon: <Heart className="w-8 h-8 text-blue-500" />,
                title: "Pediatric Dentistry",
                desc: "Kid-friendly dental care in a gentle environment that children actually enjoy.",
              },
              {
                icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
                title: "General Dental Care",
                desc: "Comprehensive checkups, cleaning, and preventive care for long-term oral health.",
              },
            ].map((service, i) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 group"
                data-ocid={`services.item.${i + 1}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Patient Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              What Our Patients Say
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "I've undergone a root canal procedure from there by Dr. Priya G Kadam and I'm extremely happy with the treatment and the hospitality. She explained everything in detail before and after and always followed up by call or text. Highly recommended!",
                name: "Verified Patient",
              },
              {
                quote:
                  "I was having toothache since long and was unable to chew. The doctor didn't stop trying — they removed my tooth, cleaned it and placed it again. After root canal and capping I'm completely satisfied and able to chew everything I was craving for. Thank you MYDENT!",
                name: "Verified Patient",
              },
              {
                quote:
                  "I had my root canal treatment in MYDENT and it was totally painless. Before going I was very scared but after coming to this clinic my fear has gone. I'm happy with the treatment. If anyone has a tooth issue I will refer this clinic.",
                name: "Verified Patient",
              },
            ].map((t) => (
              <div
                key={t.quote.slice(0, 30)}
                className="bg-white border border-blue-100 rounded-2xl p-6 shadow-card flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {STAR_INDICES.map((idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Our Difference
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose MYDENT?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="w-6 h-6 text-blue-500" />,
                title: "Pain-free & Gentle Treatment",
                desc: "We prioritize your comfort every step of the way using the latest techniques.",
              },
              {
                icon: (
                  <img
                    src={LOGO_SRC}
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                ),
                title: "Kid-Friendly Environment",
                desc: "Special care and a warm atmosphere designed for children to feel safe.",
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
                title: "Transparent Communication",
                desc: "We explain every treatment option clearly so you can make informed decisions.",
              },
              {
                icon: <Star className="w-6 h-6 text-blue-500" />,
                title: "Highly Rated Clinic",
                desc: "5.0 stars from 280+ verified Google reviews — our patients speak for us.",
              },
              {
                icon: <Award className="w-6 h-6 text-blue-500" />,
                title: "Experienced Professionals",
                desc: "Years of expertise combined with continuous learning and modern tools.",
              },
              {
                icon: <Clock className="w-6 h-6 text-blue-500" />,
                title: "Convenient Evening Hours",
                desc: "Open Mon–Sun until 10 PM — because dental care shouldn't disrupt your day.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="flex gap-4 bg-white rounded-2xl p-5 shadow-card"
                data-ocid={`whychoose.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Visit Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Find Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 rounded-2xl overflow-hidden shadow-card h-72 md:h-auto">
              <iframe
                title="MYDENT Location"
                src={MAPS_EMBED}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 text-xl">Clinic Info</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Address
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {ADDRESS_LINE1}
                      <br />
                      {ADDRESS_LINE2}
                      <br />
                      {ADDRESS_LINE3}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Phone</p>
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="text-blue-600 font-medium text-sm hover:underline"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Hours</p>
                    <p className="text-gray-600 text-sm">
                      Mon – Sun: 9:30 AM – 10 PM
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <a href={`tel:${PHONE_TEL}`}>
                  <Button
                    className="w-full rounded-pill bg-blue-600 hover:bg-blue-700 text-white"
                    data-ocid="contact.call_now.button"
                  >
                    <Phone className="w-4 h-4 mr-2" /> Call Now
                  </Button>
                </a>
                <a href={MAPS_QUERY} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full rounded-pill border-blue-400 text-blue-700 hover:bg-blue-50"
                    data-ocid="contact.get_directions.button"
                  >
                    <MapPin className="w-4 h-4 mr-2" /> Get Directions
                  </Button>
                </a>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-xl mb-4">
                Quick Appointment
              </h3>
              <BookingForm onSuccess={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Book Your Appointment Today
          </h2>
          <p className="text-blue-200 text-lg">
            Stress-free dental care for you and your family. Open Mon–Sun until
            10 PM.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${PHONE_TEL}`}>
              <Button
                size="lg"
                className="rounded-pill bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-12"
                data-ocid="cta.call_now.button"
              >
                <Phone className="w-4 h-4 mr-2" /> Call Now
              </Button>
            </a>
            <Button
              size="lg"
              onClick={() => setBookingOpen(true)}
              className="rounded-pill bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 border border-blue-400"
              data-ocid="cta.book_appointment.primary_button"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 border-t border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img
                  src={LOGO_SRC}
                  alt="MYDENT Logo"
                  className="w-9 h-9 object-contain"
                />
                <span className="text-xl font-extrabold text-blue-600">
                  MY<span className="text-blue-800">DENT</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {ADDRESS_LINE1}
                <br />
                {ADDRESS_LINE2}
                <br />
                {ADDRESS_LINE3}
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="text-blue-600 font-medium text-sm"
              >
                {PHONE_DISPLAY}
              </a>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(link.id)}
                      className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Our Services</h4>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => scrollTo("services")}
                      className="text-gray-500 hover:text-blue-600 text-sm transition-colors text-left"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Connect With Us</h4>
              <div className="flex gap-3 mb-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                  data-ocid="footer.whatsapp.button"
                >
                  <SiWhatsapp className="w-5 h-5" />
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Mon–Sun: 9:30
                  AM – 10 PM
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Walk-ins
                  Welcome
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-blue-200 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} MYDENT Dental Clinic. All rights
            reserved.
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-5 sm:bottom-8 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        data-ocid="whatsapp.button"
        aria-label="Chat on WhatsApp"
      >
        <SiWhatsapp className="w-7 h-7 text-white" />
      </a>

      {/* Sticky Mobile CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white border-t border-blue-100 shadow-lg">
        <a href={`tel:${PHONE_TEL}`}>
          <Button
            className="w-full rounded-pill bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base"
            data-ocid="mobile_cta.call_now.button"
          >
            📞 Call Now: {PHONE_DISPLAY}
          </Button>
        </a>
      </div>

      {/* Booking Modal */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent
          className="sm:max-w-md rounded-2xl"
          data-ocid="booking.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Book an Appointment
            </DialogTitle>
          </DialogHeader>
          <BookingForm
            onSuccess={() => {
              setTimeout(() => setBookingOpen(false), 1500);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
